import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          let data = request?.cookies?.['Authentication'];
          if (!data) {
            data = request?.cookies?.['token'];
          }
          if (!data) {
            if (request?.headers) {
              return ExtractJwt.fromAuthHeaderAsBearerToken()(request);
            }
            return null;
          }
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: cfg.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // payload: { sub: <id>, public_id, private_id, email, role }
    return {
      id: payload.sub,
      public_id: payload.public_id,
      private_id: payload.private_id,
      email: payload.email,
      role: payload.role,
    };
  }
}
