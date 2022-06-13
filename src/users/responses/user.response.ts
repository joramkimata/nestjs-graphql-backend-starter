import { Field, ObjectType } from "@nestjs/graphql";
import { HttpStatusCode } from "src/shared/enums/http-codes.enum";
import { GenericResponsePayload } from "src/shared/interfaces/generic-response.interface";
import { User } from "../entities/user.entity";

@ObjectType()
export class ResponseUser implements GenericResponsePayload<User> {
    @Field()
    code: HttpStatusCode;

    @Field({ nullable: true })
    data?: User;

    @Field({ nullable: true })
    status?: boolean;

    @Field({ nullable: true })
    errorDescription?: string;
}