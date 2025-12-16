import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { GraphQLContext } from '../auth/types/auth.types';
import { RelationshipService } from './relationship.service';
import { RelationshipRequest } from '../entities/relationship.entity';
import {
  SendRelationshipRequestInput,
  AcceptRejectRequestInput,
  SearchUserInput,
} from '../common/dto/relationship.input';
import { MessageResponse } from '../common/dto/response.type';
import { UserMain } from '../entities/user-main.entity';
import {
  SupplierResponse,
  ConsumerResponse,
} from '../common/dto/relationship.response';

@Resolver(() => RelationshipRequest)
export class RelationshipResolver {
  constructor(private readonly relationshipService: RelationshipService) {}

  @Mutation(() => RelationshipRequest)
  @UseGuards(JwtAuthGuard)
  async sendRelationshipRequest(
    @Args('input') input: SendRelationshipRequestInput,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;
    return await this.relationshipService.sendRequest(input, user.public_id);
  }

  @Query(() => [RelationshipRequest])
  @UseGuards(JwtAuthGuard)
  async getMyRelationshipRequests(@Context() context: GraphQLContext) {
    const user = context.req.user;
    // Return both pending requests received and sent
    const pending = await this.relationshipService.getPendingRequests(
      user.public_id,
    );
    const sent = await this.relationshipService.getSentRequests(user.public_id);
    return [...pending, ...sent];
  }

  @Query(() => [RelationshipRequest])
  @UseGuards(JwtAuthGuard)
  async getPendingRequests(@Context() context: GraphQLContext) {
    const user = context.req.user;
    return await this.relationshipService.getPendingRequests(user.public_id);
  }

  @Query(() => [RelationshipRequest])
  @UseGuards(JwtAuthGuard)
  async getSentRequests(@Context() context: GraphQLContext) {
    const user = context.req.user;
    return await this.relationshipService.getSentRequests(user.public_id);
  }

  @Mutation(() => RelationshipRequest)
  @UseGuards(JwtAuthGuard)
  async acceptRejectRequest(
    @Args('input') input: AcceptRejectRequestInput,
    @Context() context: GraphQLContext,
  ) {
    const user = context.req.user;
    return await this.relationshipService.acceptRejectRequest(
      input,
      user.public_id,
    );
  }

  @Query(() => [SupplierResponse])
  @UseGuards(JwtAuthGuard)
  async getSuppliers(@Context() context: GraphQLContext) {
    const user = context.req.user;
    return await this.relationshipService.getSuppliers(user.public_id);
  }

  @Query(() => [ConsumerResponse])
  @UseGuards(JwtAuthGuard)
  async getConsumers(@Context() context: GraphQLContext) {
    const user = context.req.user;
    return await this.relationshipService.getConsumers(user.public_id);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(JwtAuthGuard)
  async removeRelationship(
    @Args('request_id') requestId: string,
    @Context() context: GraphQLContext,
  ): Promise<MessageResponse> {
    const user = context.req.user;
    await this.relationshipService.removeRelationship(
      requestId,
      user.public_id,
    );
    return {
      message: `Relationship ${requestId} removed successfully`,
    };
  }

  @Query(() => UserMain)
  @UseGuards(JwtAuthGuard)
  async searchUser(@Args('input') input: SearchUserInput) {
    return await this.relationshipService.searchUser(input);
  }
}
