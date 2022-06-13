import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Column, Entity } from "typeorm";
import { PermissionGroupName } from "../enums/permission-group-name.enum";

@Entity(`${process.env.DB_PREFIX}_permissions`)
@ObjectType()
export class Permission extends BaseEntity {
    @Field()
    @Column()
    name: string;

    @Column({ name: 'display_name' })
    @Field()
    displayName: string;

    @Column({ type: 'text', nullable: true })
    @Field({ nullable: true })
    description: string;

    @Column({ name: 'permission_group_name' })
    @Field(type => PermissionGroupName)
    permissionGroupName: PermissionGroupName;
}