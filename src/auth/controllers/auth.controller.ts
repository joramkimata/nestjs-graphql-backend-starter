import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { GetUser } from "../decorators/get-user.decorator";
import { LoginDto } from "../dto/login.dto";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { AuthService } from "../services/auth.service";

@Controller('/auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post('login')
    @HttpCode(200)
    login(@Body() login: LoginDto) {
        return this.authService.login(login);
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    getProfile(
        @GetUser() user: User
    ) {
        user.password = undefined;
        return user;
    }

    @Get('/logout')
    @UseGuards(JwtAuthGuard)
    logout(
        @GetUser() user: User
    ) {
        return this.authService.logout(user);
    }

    @Post('/refresh')
    refresh(
        @Body('refreshToken') refreshToken: string
    ) {
        return this.authService.refresh(refreshToken);
    }
}