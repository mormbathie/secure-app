import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
@Module({
  imports:[
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any },
    }), 
  ],
  providers: [AuthService,JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
