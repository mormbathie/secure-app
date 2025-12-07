import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
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
        const passwordHash = await bcrypt.hash(dto.password,10);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: passwordHash,
                name: dto.name,
                lastName: dto.lastName,
                job: dto.job,
            },
        });
        const Token = await this.signToken(newUser.id, newUser.email);
        return { 
            
            user:{
                access_token: Token,
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                lastName: newUser.lastName,
                job: newUser.job,
            },
         };

    }

    async login(dto : LoginDto){

        // Login logic would go here
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        const PasswordValid = await bcrypt.compare(dto.password, user?.passwordHash || '');

        if (!user || !PasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }


        const Token = await this.signToken(user.id, user.email);
        return { 
            
            user:{
                access_token: Token,
                id: user.id,
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                job: user.job,
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
