import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Column, Entity } from "typeorm";
import { Attachment } from "./attachment.entity";


@Entity(`${process.env.DB_PREFIX}_sample_attachments`)
@ObjectType()
export class SampleAttachment extends BaseEntity {

    @Field({ nullable: true })
    @Column()
    sample: string

    @Field(type => [Attachment], { nullable: true })
    attachments: Attachment[];

}