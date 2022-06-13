import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { HasPermission } from "../decorators/has-permission.decorator";
import { Permission } from "../entities/permission.entity";
import { PermissionGroupName } from "../enums/permission-group-name.enum";
import { PermissionService } from "../services/permission.service";


@Resolver(of => Permission)
@HasPermission({
    name: 'VIEW_PERMISSIONS',
    displayName: 'Can View Permissions',
    description: 'Can View Permissions',
    permissionGroupName: PermissionGroupName.UAA
})
export class PermissionResolver {
    constructor(
        private permissionService: PermissionService
    ) { }

    @Query(returns => [Permission])
    getAllPermissions() {
        return this.permissionService.getPermissions();
    }


}