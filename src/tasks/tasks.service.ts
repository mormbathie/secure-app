import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TasksService {
    constructor(private readonly prisma : PrismaService){}
    async createTask(dto: CreateTaskDto, userId: number){
        return this.prisma.task.create({
            data:{
                title: dto.title,
                description: dto.description || '',
                userId 
            },
        });
    }
    async findAllTasks(userId: number){
        return this.prisma.task.findMany({
             where:{userId},
             orderBy:{createdAt: 'desc'}
        });
       
    }

   async findOneForUser(id: number, userId: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
  async update(id: number, userId: number, dto: UpdateTaskDto) {
    // Vérifie que la task appartient bien au user
    await this.findOneForUser(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        isCompleted: dto.isCompleted,
      },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOneForUser(id, userId);

    await this.prisma.task.delete({
      where: { id },
    });

    return { message: `Task ${id} deleted successfully` };
  }

}
