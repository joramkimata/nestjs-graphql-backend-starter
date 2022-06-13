import { Field, ObjectType } from "@nestjs/graphql";
import { BaseEntity } from "src/shared/entities/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { UserType } from "../enums/user-type.enum";
import { Role } from "./role.entity";

@Entity(`${process.env.DB_PREFIX}_users`)
@ObjectType()
export class User extends BaseEntity {
    @Column({ name: 'full_name' })
    @Field()
    fullName: string;

    @Column({ name: 'phone_number', nullable: true })
    @Field({ nullable: true })
    phoneNumber: string;

    @Column()
    @Field()
    email: string;

    @Column()
    password: string;

    @Column({ name: 'refresh_token', nullable: true })
    refreshToken: string;

    @Column({ default: false })
    active: boolean = false;

    @Field(type => [Role], { nullable: true })
    @ManyToMany(type => Role,)
    @JoinTable({
        name: `${process.env.DB_PREFIX}_user_roles`,
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' }
    })
    roles: Role[]
}