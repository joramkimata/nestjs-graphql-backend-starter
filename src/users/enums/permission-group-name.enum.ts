import { registerEnumType } from "@nestjs/graphql";

export enum PermissionGroupName {
    "UAA" = "UAA"
}

registerEnumType(PermissionGroupName, {
    name: "PermissionGroupName"
})