import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";

export interface JwtPayload {
    user: string,
    refreshToken: boolean
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECURITY_KEY,
        });
    }

    async validate(payload: JwtPayload) {
        return this.authService.getUserFromJwtPayload(payload);
    }
}