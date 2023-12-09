import { registerEnumType } from "@nestjs/graphql";

export enum AttachmentExtension {
    PDF, PNG, JPG
}

registerEnumType(AttachmentExtension, {
    name: 'AttachmentExtension'
})