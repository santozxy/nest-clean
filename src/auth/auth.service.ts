import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto, LoginDto, PayloadSocialLogin } from "./dtos/auth";
import { PrismaService } from "@/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "generated/prisma";
import { decodeJwtPayload } from "./utils/utils.auth";

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

  async appleLogin(token: string, name?: string) {
    const payload = decodeJwtPayload<PayloadSocialLogin>(token);

    const { sub, email } = payload;

    let user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email,
          name: name || "Apple User",
          password: bcrypt.hashSync(sub, 10),
        },
      });
    }

    const getToken = this.jwtService.sign({
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
          role: user.role,
        },
        token: getToken,
      },
      status: "success",
    };
  }
  async googleLogin(token: string, name: string) {
    // extrair sub e email do token JWT
    const payload = await this.jwtService.decode(token);
    console.log("Google login payload:", payload, name);
    if (!payload) {
      throw new UnauthorizedException({
        message: "Invalid token",
        status: "error",
      });
    }
  }
  async logout(user: User) {
    await new Promise((resolve) => {
      console.log(`User ${user.email} logged out`);
      setTimeout(resolve, 1000);
    });
    return {
      message: "User logged out successfully",
      status: "success",
    };
  }
}
