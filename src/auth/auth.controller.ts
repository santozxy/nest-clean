import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from "@nestjs/common";
import { LoginDto, RegisterDto, SocialLoginDto } from "./dtos/auth";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { User } from "generated/prisma";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post("login")
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post("login/apple")
  async loginWithApple(@Body() body: SocialLoginDto) {
    return this.authService.appleLogin(body);
  }

  @Post("login/google")
  async loginWithGoogle(@Body() body: SocialLoginDto) {
    return this.authService.googleLogin(body);
  }

  @Post("logout")
  async logout(@Request() req: Request & { user: User }) {
    await this.authService.logout(req.user);
    return {
      message: "Logged out successfully",
      status: "success",
    };
  }

  @UseGuards(AuthGuard)
  @Get("me")
  getMe(@Request() req: Request & { user: User }) {
    return req.user;
  }
}
