import { Controller, Post, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { QuizService } from './quizzes.service';
import { Quizzes } from './quizzes.schema';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // Create a new quiz
  @Post()
  async createQuiz(@Body() quizData: Partial<Quizzes>): Promise<Quizzes> {
    return this.quizService.createQuiz(quizData);
  }

  // Get all the quizzes
  @Get()
  async getQuizzes(): Promise<Quizzes[]> {
    return this.quizService.getQuizzes();
  }

  // Get one quiz by its ID
  @Get(':id')
  async getQuiz(@Param('id') quizId: string): Promise<Quizzes> {
    return this.quizService.getQuizById(quizId);
  }

  // Update a quiz by its ID
  @Put(':id')
  async updateQuiz(
    @Param('id') quizId: string,
    @Body() updateData: Partial<Quizzes>,
  ): Promise<Quizzes> {
    return this.quizService.updateQuiz(quizId, updateData);
  }

  // Delete a quiz by its ID
  @Delete(':id')
  async deleteQuiz(@Param('id') quizId: string): Promise<void> {
    await this.quizService.deleteQuiz(quizId);
  }
}
