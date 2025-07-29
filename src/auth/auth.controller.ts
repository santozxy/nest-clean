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

  @UseGuards(AuthGuard)
  @Get("me")
  getMe(@Request() req: Request & { user: User }) {
    return req.user;
  }
}
