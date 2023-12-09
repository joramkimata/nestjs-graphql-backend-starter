import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Column, Entity } from "typeorm";


@Entity(`${process.env.DB_PREFIX}_sample_attachments`)
@ObjectType()
export class SampleAttachment extends BaseEntity {

    @Field({ nullable: true })
    @Column()
    sample: string

}