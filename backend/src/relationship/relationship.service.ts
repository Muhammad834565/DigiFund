import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RelationshipRequest,
  SupplierRelationship,
  ConsumerRelationship,
} from '../entities/relationship.entity';
import { UserMain } from '../entities/user-main.entity';
import {
  SendRelationshipRequestInput,
  AcceptRejectRequestInput,
  SearchUserInput,
} from '../common/dto/relationship.input';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(RelationshipRequest)
    private relationshipRepository: Repository<RelationshipRequest>,
    @InjectRepository(UserMain)
    private userRepository: Repository<UserMain>,
    @InjectRepository(SupplierRelationship)
    private supplierRelationshipRepository: Repository<SupplierRelationship>,
    @InjectRepository(ConsumerRelationship)
    private consumerRelationshipRepository: Repository<ConsumerRelationship>,
  ) { }

  async sendRequest(
    input: SendRelationshipRequestInput,
    requesterPublicId: string,
  ) {
    // Validate that requested user exists
    const requestedUser = await this.userRepository.findOne({
      where: { public_id: input.requested_public_id },
    });

    if (!requestedUser) {
      throw new NotFoundException(
        `User with public_id ${input.requested_public_id} not found`,
      );
    }

    // Check for existing request
    const existingRequest = await this.relationshipRepository.findOne({
      where: {
        requester_public_id: requesterPublicId,
        requested_public_id: input.requested_public_id,
        relationship_type: input.relationship_type,
      },
    });

    if (existingRequest) {
      throw new BadRequestException(
        'Relationship request already exists with this user',
      );
    }

    const request = this.relationshipRepository.create({
      requester_public_id: requesterPublicId,
      requested_public_id: input.requested_public_id,
      relationship_type: input.relationship_type,
      status: 'pending',
    });

    return await this.relationshipRepository.save(request);
  }

  async getPendingRequests(userPublicId: string) {
    return await this.relationshipRepository.find({
      where: {
        requested_public_id: userPublicId,
        status: 'pending',
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async getSentRequests(userPublicId: string) {
    return await this.relationshipRepository.find({
      where: {
        requester_public_id: userPublicId,
        status: 'pending',
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async acceptRejectRequest(
    input: AcceptRejectRequestInput,
    userPublicId: string,
  ) {
    const request = await this.relationshipRepository.findOne({
      where: {
        id: parseInt(input.request_id),
        requested_public_id: userPublicId,
      },
    });

    if (!request) {
      throw new NotFoundException('Request not found or unauthorized');
    }

    if (request.status !== 'pending') {
      throw new BadRequestException(`Request already ${request.status}`);
    }

    request.status = input.action;
    const saveResult = await this.relationshipRepository.save(request);

    // If accepted, create bidirectional relationships
    if (input.action === 'accepted') {
      const requester = await this.userRepository.findOne({
        where: { public_id: request.requester_public_id },
      });
      const requested = await this.userRepository.findOne({
        where: { public_id: request.requested_public_id },
      });

      if (requester && requested) {
        if (request.relationship_type === 'supplier') {
          // Requester asked Requested to be their Supplier
          // 1. Requester gets a SupplierRelationship
          await this.supplierRelationshipRepository.save({
            owner_public_id: requester.public_id,
            supplier_public_id: requested.public_id,
            company_name: requested.company_name,
            contact_person: requested.contact_person,
            email: requested.email,
            phone_no: requested.phone_no,
            location: requested.address,
            status: 'active',
          });

          // 2. Requested gets a ConsumerRelationship
          await this.consumerRelationshipRepository.save({
            owner_public_id: requested.public_id,
            consumer_public_id: requester.public_id,
            company_name: requester.company_name,
            contact_person: requester.contact_person,
            email: requester.email,
            phone_no: requester.phone_no,
            location: requester.address,
            status: 'active',
          });
        } else if (request.relationship_type === 'consumer') {
          // Requester asked Requested to be their Consumer
          // 1. Requester gets a ConsumerRelationship
          await this.consumerRelationshipRepository.save({
            owner_public_id: requester.public_id,
            consumer_public_id: requested.public_id,
            company_name: requested.company_name,
            contact_person: requested.contact_person,
            email: requested.email,
            phone_no: requested.phone_no,
            location: requested.address,
            status: 'active',
          });

          // 2. Requested gets a SupplierRelationship
          await this.supplierRelationshipRepository.save({
            owner_public_id: requested.public_id,
            supplier_public_id: requester.public_id,
            company_name: requester.company_name,
            contact_person: requester.contact_person,
            email: requester.email,
            phone_no: requester.phone_no,
            location: requester.address,
            status: 'active',
          });
        }
      }
    }

    return saveResult;
  }

  async getSuppliers(userPublicId: string) {
    // Get accepted relationships where user is the owner (Consumer)
    const relationships = await this.supplierRelationshipRepository.find({
      where: {
        owner_public_id: userPublicId,
        status: 'active',
      },
    });

    return relationships.map((rel) => ({
      id: rel.id,
      supplier_public_id: rel.supplier_public_id,
      company_name: rel.company_name,
      contact_person: rel.contact_person,
      email: rel.email,
      phone_no: rel.phone_no,
      location: rel.location,
      status: rel.status,
      created_at: rel.created_at,
    }));
  }

  async getConsumers(userPublicId: string) {
    // Get accepted relationships where user is the owner (Supplier)
    const relationships = await this.consumerRelationshipRepository.find({
      where: {
        owner_public_id: userPublicId,
        status: 'active',
      },
    });

    return relationships.map((rel) => ({
      id: rel.id,
      consumer_public_id: rel.consumer_public_id,
      company_name: rel.company_name,
      contact_person: rel.contact_person,
      email: rel.email,
      phone_no: rel.phone_no,
      location: rel.location,
      status: rel.status,
      created_at: rel.created_at,
    }));
  }

  async removeRelationship(requestId: string, userPublicId: string) {
    const request = await this.relationshipRepository.findOne({
      where: [
        { id: parseInt(requestId), requester_public_id: userPublicId },
        { id: parseInt(requestId), requested_public_id: userPublicId },
      ],
    });

    if (!request) {
      throw new NotFoundException('Relationship not found or unauthorized');
    }

    await this.relationshipRepository.remove(request);
    return request;
  }

  async searchUser(input: SearchUserInput) {
    if (!input.public_id && !input.email && !input.phone_no) {
      throw new BadRequestException(
        'Please provide at least one search criteria',
      );
    }

    const where: Partial<UserMain> = {};
    if (input.public_id) where.public_id = input.public_id;
    if (input.email) where.email = input.email;
    if (input.phone_no) where.phone_no = input.phone_no;

    const user = await this.userRepository.findOne({ where });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
