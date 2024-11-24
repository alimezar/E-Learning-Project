import { Controller, Get, Post, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseService } from './responses.services';
import { Response } from './responses.schema';

@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  async createResponse(@Body() createResponseDto: Partial<Response>) {
    try {
      return await this.responseService.createResponse(createResponseDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
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
