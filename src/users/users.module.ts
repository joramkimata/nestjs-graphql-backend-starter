import { Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { UserResolver } from './resolvers/user.resolver';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';
import { DiscoveryService } from "@golevelup/nestjs-discovery";
import { PermissionResolver } from './resolvers/permission.resolver';
import { RoleResolver } from './resolvers/role.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        DiscoveryModule,
        TypeOrmModule.forFeature([
            User,
            Permission,
            Role,
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
