import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
    @Field()
    fullName: string;

    @Field({ nullable: true })
    phoneNumber: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    confirmPassword: string;
}