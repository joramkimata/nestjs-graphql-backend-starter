import { ObjectType, Field } from "@nestjs/graphql"
import { Entity, Column } from "typeorm"
import { AttachableFormat } from "../enums/attachable-format.enum"
import { AttachableTypeEnum } from "../enums/attachable-type.enum"
import { AttachmentExtension } from "../enums/attachment-extension.enum"
import { BaseEntity } from "src/shared/entities/base.entity"

@Entity(`${process.env.DB_PREFIX}_attachments`)
@ObjectType()
export class Attachment extends BaseEntity {

    @Column({ name: 'attachable_uid' })
    @Field()
    attachableUid: string

    @Column({ name: 'attachable_type', type: 'enum', enum: AttachableTypeEnum })
    @Field(type => AttachableTypeEnum)
    attachableType: AttachableTypeEnum

    @Column({ name: 'attachable_format', type: 'enum', enum: AttachableFormat })
    @Field(type => AttachableFormat)
    attachableFormat: AttachableFormat

    @Column({ name: 'attachable_name' })
    @Field()
    attachmentName: string

    @Column({ name: 'attachable_orginal_name' })
    @Field()
    attachmentOGName: string

    @Column({ name: 'attachable_extension', type: 'enum', enum: AttachmentExtension })
    @Field()
    attachmentExtension: AttachmentExtension

    @Column({ name: 'attachable_data', type: 'text' })
    @Field()
    attachemntData: string

    @Column({ name: 'attachable_drive_location' })
    @Field()
    attachemntDriveLocation: string
}