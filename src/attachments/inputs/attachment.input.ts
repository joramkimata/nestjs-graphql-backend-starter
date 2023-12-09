import { InputType, Field } from "@nestjs/graphql"
import { AttachableFormat } from "../enums/attachable-format.enum"
import { AttachableTypeEnum } from "../enums/attachable-type.enum"
import { AttachmentExtension } from "../enums/attachment-extension.enum"

@InputType()
export class AttachmentInput {
    @Field()
    attachableUid: string

    @Field(type => AttachableTypeEnum)
    attachableType: AttachableTypeEnum

    @Field(type => AttachableFormat)
    attachableFormat: AttachableFormat

    @Field()
    attachmentName: string

    @Field(type => AttachmentExtension)
    attachmentExtension: AttachmentExtension


    @Field()
    attachemntData: string

    @Field({ nullable: true })
    uuid: string
}