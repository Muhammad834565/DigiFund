import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryResolver } from './inventory.resolver';
import { InventoryMaster } from '../entities/inventory-master.entity';
import { UserMain } from '../entities/user-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMaster, UserMain])],
  providers: [InventoryService, InventoryResolver],
  exports: [InventoryService],
})
export class InventoryModule {}
