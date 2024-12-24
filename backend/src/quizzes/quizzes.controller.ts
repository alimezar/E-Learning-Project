import { Controller, Post, Get, Body, Param, Put, Delete, Query, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { QuizService } from './quizzes.service';
import { Quizzes } from './quizzes.schema';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // Create a new quiz
  @Post()
  async createQuiz(@Body() quizData: Partial<Quizzes>): Promise<Quizzes> {
    try {
      return await this.quizService.createQuiz(quizData);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Get all quizzes
  @Get()
  async getQuizzes(): Promise<Quizzes[]> {
    return this.quizService.getQuizzes();
  }

  // Get a single quiz by ID
  @Get(':id')
  async getQuiz(@Param('id') quizId: string): Promise<Quizzes> {
    return this.quizService.getQuizById(quizId);
  }

  // Update a quiz by ID
  @Put(':id')
  async updateQuiz(
    @Param('id') quizId: string,
    @Body() updateData: Partial<Quizzes>,
  ): Promise<Quizzes> {
    try {
      return await this.quizService.updateQuiz(quizId, updateData);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // Delete a quiz by ID
  @Delete(':id')
  async deleteQuiz(@Param('id') quizId: string): Promise<{ message: string }> {
    try {
      await this.quizService.deleteQuiz(quizId);
      return { message: `Quiz with ID "${quizId}" successfully deleted.` };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // Fetch quizzes by moduleId and creator role
  @Get()
  async getQuizzesByModuleAndRole(
    @Query('moduleId') moduleId: string,
    @Query('role') role?: string
  ) {
    if (!moduleId) {
      throw new BadRequestException('moduleId is required');
    }
    return this.quizService.getQuizzesByModuleAndRole(moduleId, role);
  }
}
