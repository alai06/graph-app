import { Request } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express' {
    interface Request {
        user?: string | jwt.JwtPayload;
    }
}