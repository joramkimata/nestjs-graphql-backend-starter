import { registerEnumType } from "@nestjs/graphql";


export enum AttachableFormat {
    FILE, IMAGE,
}

registerEnumType(AttachableFormat, {
    name: 'AttachableFormat'
})