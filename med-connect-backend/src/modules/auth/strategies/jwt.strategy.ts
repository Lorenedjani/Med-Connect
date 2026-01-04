import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret') || 'fallback-secret',
      algorithms: [configService.get('jwt.algorithm') || 'HS256'],
      issuer: configService.get('jwt.issuer'),
      audience: configService.get('jwt.audience'),
    });
  }

  async validate(payload: IJwtPayload) {
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // You can add additional validation here, such as checking if user still exists
    // or if token is blacklisted

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      isVerified: payload.isVerified || false,
    };
  }
}
