import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ResponseService } from './responses.services';
import { Response } from './responses.schema';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  async createResponse(@Body() createResponseDto: Partial<Response>) {
    return this.responseService.createResponse(createResponseDto);
  }

  @Get()
  async findAllResponses() {
    return this.responseService.findAllResponses();
  }

  @Get(':responseId')
  async findResponseById(@Param('responseId') responseId: string) {
    return this.responseService.findResponseById(responseId);
  }
}