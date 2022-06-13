import { InputType, Field } from "@nestjs/graphql";


@InputType()
export class RoleInput {

    @Field()
    name: string;

    @Field()
    displayName: string;

    @Field({ nullable: true })
    description: string;
}