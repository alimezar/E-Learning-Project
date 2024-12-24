import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';


@UseGuards(AuthorizationGuard)
@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  // Get all logs with optional limit
  @Get()
  @Roles('admin') // RBAC Series
  async getLogs(@Query('limit') limit: string) {
    const logLimit = parseInt(limit, 10) || 50; // Default limit is 50
    return this.logsService.getAllLogs(logLimit);
  }
}
