import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { GetGqlUser } from "src/auth/decorators/get-user-graphql.decorator";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UserType } from "../enums/user-type.enum";
import { AssignRolesInput } from "../inputs/assign-roles.input";
import { CreateUserInput } from "../inputs/create-user.input";
import { UpdateUserInput } from "../inputs/update-user.input";
import { ResponseUser } from "../responses/user.response";
import { UserService } from "../services/user.service";
import { PaginatedInput } from "src/shared/inputs/pagination.input";
import { ResponseUserPaginated } from "../responses/user-paginated.response";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/auth/guards/graphql.guard";
import { PermissionGuard } from "src/auth/guards/permission.guard";
import { HasPermission } from "../decorators/has-permission.decorator";
import { PermissionGroupName } from "../enums/permission-group-name.enum";


@Resolver(of => User)
// @UseGuards(GqlAuthGuard, PermissionGuard)
// @UseGuards(GqlAuthGuard)
// @UseGuards(PermissionGuard)
// @HasPermission({ displayName: "View Users", name: "VIEW_USERS", permissionGroupName: PermissionGroupName.UAA })
export class UserResolver {

    constructor(
        private userService: UserService
    ) { }

    // Queries

    @Query(returns => User)
    getCurrentUserInfo(
        @GetGqlUser()
        user: User
    ) {
        return this.userService.getCurrentUserInfo(user);
    }

    @Query(returns => [User])
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Query(returns => ResponseUserPaginated)
    getAllUserPaginated(
        @Args('input')
        input: PaginatedInput
    ) {
        return this.userService.getAllUserPaginated(input);
    }

    // Mutations

    @Mutation(returns => ResponseUser)
    createUser(
        @Args('input')
        createUserInput: CreateUserInput
    ) {
        return this.userService.createUser(createUserInput);
    }

    @Mutation(returns => ResponseUser)
    updateUser(
        @Args('uuid')
        uuid: string,
        @Args('userInput')
        userInput: UpdateUserInput
    ) {
        return this.userService.updateUser(uuid, userInput);
    }

    @Mutation(returns => ResponseUser)
    deleteUser(
        @Args('uuid')
        uuid: string,
    ) {
        return this.userService.deleteUser(uuid);
    }

    @Mutation(returns => ResponseUser)
    activateUser(
        @Args('uuid')
        uuid: string,
    ) {
        return this.userService.activateUser(uuid);
    }

    @Mutation(returns => ResponseUser)
    blockUser(
        @Args('uuid')
        uuid: string,
    ) {
        return this.userService.blockUser(uuid);
    }

    @Mutation(returns => ResponseUser)
    changeUserPassword(
        @Args('uuid')
        uuid: string,
        @Args('password')
        password: string,
        @Args('confirmPassword')
        confirmPassword: string
    ) {
        return this.userService.changeUserPassword(uuid, password, confirmPassword);
    }

    @Mutation(returns => ResponseUser)
    assignRoles(
        @Args('assignRolesInput')
        assignRolesInput: AssignRolesInput
    ) {
        return this.userService.assignRoles(assignRolesInput);
    }
}