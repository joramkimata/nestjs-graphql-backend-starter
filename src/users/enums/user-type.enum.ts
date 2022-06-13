import { registerEnumType } from "@nestjs/graphql";


export enum UserType {
    STAFF, ADMIN
}

registerEnumType(UserType, {
    name: 'UserType'
})