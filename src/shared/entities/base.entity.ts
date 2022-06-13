import { Field, ObjectType } from "@nestjs/graphql";
import { PrimaryGeneratedColumn, Column, Generated, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@ObjectType()
export class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Field()
    @Generated('uuid')
    uuid: string;

    @Field(type => String)
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Field(type => String)
    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: Date;

    // Soft Delete
    @Field(type => String)
    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deletedAt?: Date;

    @Column({ name: 'deleted', nullable: true })
    deleted?: boolean = false;

}