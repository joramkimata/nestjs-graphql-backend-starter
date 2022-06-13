import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Role } from "../entities/role.entity";
import { AssignPermissionsInput } from "../inputs/assign-permissions.input";
import { RoleInput } from "../inputs/role.input";
import { ResponseRole } from "../responses/role.response";
import { RoleService } from "../services/role.service";


@Resolver(of => Role)
export class RoleResolver {

    constructor(private roleService: RoleService) { }

    @Mutation(returns => ResponseRole)
    createRole(
        @Args('input') input: RoleInput
    ) {
        return this.roleService.createRole(input);
    }

    @Mutation(returns => ResponseRole)
    updateRole(
        @Args('uuid') uuid: string,
        @Args('updateRoleInput') updateRoleInput: RoleInput
    ) {
        return this.roleService.updateRole(uuid, updateRoleInput);
    }

    @Mutation(returns => ResponseRole)
    deleteRole(
        @Args('uuid') uuid: string,
    ) {
        return this.roleService.deleteRole(uuid);
    }

    @Query(returns => [Role],)
    getRoles() {
        return this.roleService.getRoles();
    }

    // Query for Get One
    @Query(returns => Role, { nullable: true })
    getRole(
        @Args('uuid') uuid: string
    ) {
        return this.roleService.getRole(uuid);
    }

    @Mutation(returns => ResponseRole)
    assignPermissions(
        @Args('input')
        input: AssignPermissionsInput
    ) {
        return this.roleService.assignPermissions(input);
    }
}