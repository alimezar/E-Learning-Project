import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Response, ResponseSchema } from './responses.schema';
import { ResponseService } from './responses.services';
import { ResponseController } from './responses.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }])],
  providers: [ResponseService],
  controllers: [ResponseController],
})
export class ResponseModule {}
