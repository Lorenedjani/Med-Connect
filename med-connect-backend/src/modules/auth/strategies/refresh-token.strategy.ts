import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { IRefreshTokenPayload } from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.refreshSecret') || 'fallback-refresh-secret',
      algorithms: [configService.get('jwt.algorithm') || 'HS256'],
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: IRefreshTokenPayload) {
    const refreshToken = request.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    // Validate refresh token exists and is not blacklisted
    // This would typically involve checking against a database or cache

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tokenId: payload.tokenId,
    };
  }
}
