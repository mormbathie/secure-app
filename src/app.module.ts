import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [AuthModule, TasksModule,AuthModule],
  providers: [PrismaService],
})

export class AppModule {}
