import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { User } from "generated/prisma";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        status: "error",
        message: "Access denied. No token provided.",
      });
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
    } catch (error) {
      const err = error as Error;
      console.error("JWT verification failed:", err);
      throw new UnauthorizedException({
        status: "error",
        message: `Invalid token: ${err.message}`,
      });
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers?.["authorization"];
    if (typeof authHeader === "string") {
      const [type, token] = authHeader.split(" ");
      return type === "Bearer" ? token : null;
    }
    return null;
  }
}
