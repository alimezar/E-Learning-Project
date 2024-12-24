import { Controller, Get, Query } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  // Get all logs with optional limit
  @Get()
  async getLogs(@Query('limit') limit: string) {
    const logLimit = parseInt(limit, 10) || 50; // Default limit is 50
    return this.logsService.getAllLogs(logLimit);
  }
}
