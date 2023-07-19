import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { LoginDto } from "../dto/login.dto";

import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { hashCompare, hashing } from "src/shared/helpers/hashing.helper";
import { JwtPayload } from "../strategies/jwt.strategy";
import { AuthMessages } from "../enums/auth-messages.enum";


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }


    async getUserPermissions(email: string) {
        const query = `SELECT pm.name FROM ${process.env.DB_PREFIX}_users u 
        INNER JOIN ${process.env.DB_PREFIX}_user_roles ur ON ur.user_id=u.id 
        INNER JOIN ${process.env.DB_PREFIX}_role_permissions rp ON rp.role_id=rp.role_id
        INNER JOIN ${process.env.DB_PREFIX}_permissions pm ON pm.id=rp.permission_id
        WHERE u.email='${email}' GROUP BY pm.name,u.email`;

        const permissions = await this.userRepository.query(query);

        const permissionsArray = permissions.map(p => p.name);

        return permissionsArray;
    }

    async login({ email, password }: LoginDto) {
        const user = await this.userRepository.findOne({
            where: {
                email,
                deleted: false,
                active: true
            }
        });

        if (user == null) {
            throw new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        if (user.active != true) {
            throw new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        const payload: TokenPayload = { user: user.uuid, refreshToken: false };
        const payloadRefreshToken: TokenPayload = { ...payload, refreshToken: true };

        const myRefreshToken = this.jwtService.sign(payloadRefreshToken, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        });

        user.refreshToken = await hashing(myRefreshToken);

        await this.userRepository.save(user);

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: myRefreshToken
        };
    }

    async getUserFromJwtPayload(payload: JwtPayload) {

        if (!payload) throw new UnauthorizedException();

        // prevent passing refresh token as access token 
        if (payload.refreshToken) {
            throw new UnauthorizedException(AuthMessages.ACCESS_TOKEN_ONLY);
        }


        const user = await this.userRepository.findOne({
            where: {
                deleted: false,
                uuid: payload.user
            }
        });

        if (!user) {
            throw new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        // checks if user logged out
        if (!user.refreshToken) {
            throw new UnauthorizedException(AuthMessages.LOGGED_OUT);
        }

        return user;
    }

    async logout(user: User) {
        const dbUser = await this.userRepository.findOne({
            email: user.email
        });

        if (dbUser) {
            dbUser.refreshToken = '';
            await this.userRepository.save(dbUser);

            return {
                "message": "successfully logged out!"
            }
        }
    }

    async refresh(refreshToken: string) {

        try {
            const { user } = this.jwtService.decode(refreshToken) as JwtPayload;

            const dbUser = await this.userRepository.findOne({
                uuid: user,
                deleted: false,
                active: true
            });

            if (!dbUser) {
                throw new UnauthorizedException('User not found');
            }

            const hashedRefreshToken = dbUser.refreshToken;

            if (!hashedRefreshToken) {
                throw new UnauthorizedException();
            }

            if (!hashCompare(refreshToken, hashedRefreshToken)) {
                throw new UnauthorizedException();
            }

            const payload = { user, refreshToken: false };

            return {
                access_token: this.jwtService.sign(payload),
            }

        } catch (e) {
            throw new UnauthorizedException('Expired Refresh Token');
        }

    }


}