import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Questions } from './questions.schema';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Create a new question
  @Post()
  async createQuestion(@Body() questionData: Partial<Questions>): Promise<Questions> {
    return this.questionsService.createQuestion(questionData);
  }

  // Get all questions
  @Get()
  async getQuestions(): Promise<Questions[]> {
    return this.questionsService.getQuestions();
  }

  // Get a single question by ID
  @Get(':id')
  async getQuestion(@Param('id') id: string): Promise<Questions> {
    return this.questionsService.getQuestion(id);
  }

  // Update a question by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Questions>,
  ): Promise<Questions> {
    return this.questionsService.updateQuestion(id, updateData);
  }

  // Delete a question by ID
  @Delete(':id')
  async deleteQuestion(@Param('id') id: string): Promise<Questions> {
    return this.questionsService.deleteQuestion(id);
  }
}
