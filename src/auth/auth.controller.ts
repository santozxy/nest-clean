import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from "@nestjs/common";
import { LoginDto, RegisterDto } from "./dtos/auth";
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
  async loginWithApple(@Body() body: { token: string; name: string }) {
    return this.authService.appleLogin(body.token, body.name);
  }

  @Post("login/google")
  async loginWithGoogle(@Body() body: { token: string; name: string }) {
    return this.authService.googleLogin(body.token, body.name);
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
