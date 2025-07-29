import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto, LoginDto } from "./dtos/auth";
import { PrismaService } from "@/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(body: RegisterDto) {
    const hasUser = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (hasUser) {
      throw new UnauthorizedException({
        message: "User already exists with this email",
        status: "error",
      });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await this.prismaService.user.create({
      data: {
        ...body,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      message: "User registered successfully",
      data: user,
      status: "success",
    };
  }

  async login(body: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });
    if (!user) {
      throw new UnauthorizedException({
        message: "Invalid credentials",
        status: "error",
      });
    }

    const comparedPassword = await bcrypt.compare(body.password, user.password);

    if (!comparedPassword) {
      throw new UnauthorizedException({
        message: "Invalid credentials",
        status: "error",
      });
    }

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return {
      message: "User logged in successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
      status: "success",
    };
  }
}
