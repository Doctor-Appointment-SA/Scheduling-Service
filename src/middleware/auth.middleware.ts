// src/middleware/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    try {
      // ส่งไปถาม auth-service
      const response = await axios.get("http://auth-service:4001/api/auth/whoami", {
        headers: { Authorization: token },
      });

      // เก็บ user object ลงใน req.user
      (req as any).user = response.data;
      console.log("Authenticated user:", response.data);
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
