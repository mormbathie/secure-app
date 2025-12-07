import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @Request() req: any) {
    const userId = req.user.userId; // vient de JwtStrategy.validate()
    return this.tasksService.createTask(dto, userId);
  }

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.userId;
    return this.tasksService.findAllTasks(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    return this.tasksService.findOneForUser(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    return this.tasksService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    return this.tasksService.remove(id, userId);
  }
}
