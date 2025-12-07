import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { access } from 'fs';


@Injectable()
export class AuthService {
    // Auth service methods would go here
    constructor(
        private prisma : PrismaService,
        private JwtService : JwtService

    ){}

    async signup(dto: SignUpDto){

        // Signup logic
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const passwordHash = dto.password;
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: passwordHash,
                name: dto.name,
            },
        });
        const Token = await this.signToken(newUser.id, newUser.email);
        return { 
            access_token: Token,
            user:{
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
         };

    }

    async login(dto : LoginDto){

        // Login logic would go here
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user || user.passwordHash !== dto.password) {
            throw new ConflictException('Invalid credentials');
        }

        const Token = await this.signToken(user.id, user.email);
        return { 
            access_token: Token,
            user:{
                id: user.id,
                email: user.email,
                name: user.name,
            },
           
         };

         


    }

    private async signToken(userId: number, email: string): Promise<string>{
        const payload = {
            sub: userId,
            email,
        };
        return this.JwtService.sign(payload);
         
    }
   

}
