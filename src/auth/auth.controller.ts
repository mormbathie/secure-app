import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body, Post } from '@nestjs/common';
import { SignUpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() dto: SignUpDto) {
        return this.authService.signup(dto);
    }
    @Post('login')
    async login(@Body() dto: any) {
        return this.authService.login(dto);
    }
}
