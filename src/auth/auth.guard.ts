import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const headers = req.headers;

    const signature = headers['signature'];
    const pubKey = headers['public-key'];
    const poolId = headers['pool-id'];
    const timestamp = headers['timestamp'];

    if (signature && pubKey && poolId) {
      return await this.authService.validateSignature(
        signature,
        pubKey,
        poolId,
        timestamp,
      );
    }

    throw new HttpException(
      'Please include "signature", "public-key", "pool-id", and "timestamp" headers.',
      403,
    );
  }
}
