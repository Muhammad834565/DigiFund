import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipService } from './relationship.service';
import { RelationshipResolver } from './relationship.resolver';
import {
  RelationshipRequest,
  SupplierRelationship,
  ConsumerRelationship,
} from '../entities/relationship.entity';
import { UserMain } from '../entities/user-main.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RelationshipRequest,
      UserMain,
      SupplierRelationship,
      ConsumerRelationship,
    ]),
  ],
  providers: [RelationshipService, RelationshipResolver],
  exports: [RelationshipService],
})
export class RelationshipModule { }
