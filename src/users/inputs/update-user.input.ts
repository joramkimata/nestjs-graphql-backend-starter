import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UpdateUserInput {
    @Field()
    fullName: string;

    @Field({ nullable: true })
    phoneNumber: string;

    @Field()
    email: string;



}