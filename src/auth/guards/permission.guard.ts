import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";
import { IPermission } from "src/users/decorators/has-permission.decorator";
import { AuthMessages } from "../enums/auth-messages.enum";
import { AuthService } from "../services/auth.service";


@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext) {

        const ctx = GqlExecutionContext.create(context);

        const { user } = ctx.getContext().req;

        if (!user) {
            throw new UnauthorizedException(AuthMessages.INVALID_LOGIN);
        }

        const accessMethod = this.reflector.get<string>('permission', context.getHandler());

        const accessClass = this.reflector.get<string>('permission', context.getClass());

        if ((accessMethod as unknown as IPermission)?.name) {
            const permissions = await this.authService.getUserPermissions(user.email);

            if (!permissions.some(p => p === (accessMethod as unknown as IPermission).name)) {
                throw new ForbiddenException(AuthMessages.ACCESS_DENIED);
            }
        }

        if ((accessClass as unknown as IPermission)?.name) {
            const permissions = await this.authService.getUserPermissions(user.email);


            if (!permissions.some(p => p === (accessClass as unknown as IPermission).name)) {
                throw new ForbiddenException(AuthMessages.ACCESS_DENIED);
            }
        }

        return true;
    }

}