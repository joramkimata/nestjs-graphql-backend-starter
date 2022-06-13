import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/settings/entities/department.entity';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './resolvers/user.resolver';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';
import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { PermissionResolver } from './resolvers/permission.resolver';
import { Site } from 'src/settings/entities/site.entity';
import { RoleResolver } from './resolvers/role.resolver';

@Module({
    imports: [
        DiscoveryModule,
        TypeOrmModule.forFeature([
            User,
            Permission,
            Role,
            Department,
            Site
        ])
    ],
    providers: [
        UserResolver,
        UserService,
        RoleService,
        RoleResolver,
        PermissionResolver,
        PermissionService,
        DiscoveryService
    ]
})
export class UsersModule implements OnModuleInit {

    constructor(
        private permissionService: PermissionService,
        private userService: UserService,
        private discoveryService: DiscoveryService
    ) { }

    onModuleInit() {
        this.permissionService.seedPermissions(this.discoveryService);
        this.userService.seedAdmin();
    }
}
