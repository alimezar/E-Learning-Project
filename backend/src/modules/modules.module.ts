import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { Module as ModuleSchema, ModuleSchema as Schema } from './modules.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ModuleSchema.name, schema: Schema }])],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
