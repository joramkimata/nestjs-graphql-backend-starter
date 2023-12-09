import { registerEnumType } from "@nestjs/graphql";


export enum AttachableTypeEnum {
    SAMPLE_ATTACHMENT
}

registerEnumType(AttachableTypeEnum, {
    name: 'AttachableTypeEnum'
})