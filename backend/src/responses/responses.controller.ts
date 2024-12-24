import { Controller, Get, Post, Param, Body, Query, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
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

  // Check for responses by quizId and userId
  @Get()
  async getResponsesByQuizAndUser(
    @Query('quizId') quizId: string,
    @Query('userId') userId: string
  ) {
    if (!quizId || !userId) {
      throw new BadRequestException('quizId and userId are required');
    }
    return this.responseService.getResponsesByQuizAndUser(quizId, userId);
  }
}
