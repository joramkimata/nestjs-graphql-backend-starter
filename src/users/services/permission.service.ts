import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "../entities/permission.entity";
import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { IPermission } from "../decorators/has-permission.decorator";
import { PermissionGroupName } from "../enums/permission-group-name.enum";


@Injectable()
export class PermissionService {


    private logger = new Logger(PermissionService.name);

    constructor(
        @InjectRepository(Permission)
        private permissionReposity: Repository<Permission>
    ) { }

    getPermissions() {
        return this.permissionReposity.find({
            where: {
                deleted: false
            }
        });
    }

    getAllPermissionsByGroupName(groupName: PermissionGroupName) {

    }

    async seedPermissions(discoveryService: DiscoveryService) {
        const allPermissionsMethodLevel = await discoveryService.providerMethodsWithMetaAtKey<IPermission>('permission');
        const allPermissionsClassLevel = await discoveryService.providersWithMetaAtKey<IPermission>('permission');

        const methodPermissions = allPermissionsMethodLevel.map(p => p.meta);
        const classPermissions = allPermissionsClassLevel.map(p => p.meta);

        const permissions = methodPermissions.concat(classPermissions);

        const newPermissions = [];

        permissions.forEach(async p => {
            const dbPermission = await this.permissionReposity.findOne({
                name: p.name,
                deleted: false
            });

            if (dbPermission == null) {
                const permission = new Permission();
                permission.displayName = p.displayName;
                permission.name = p.name;
                permission.permissionGroupName = p.permissionGroupName;
                permission.description = p.description;
                await this.permissionReposity.save(permission);
                newPermissions.push(permission);
            }
        });

        if (newPermissions.length) {
            this.logger.debug(`**** Permissions seeded ****`);
        }
    }

}