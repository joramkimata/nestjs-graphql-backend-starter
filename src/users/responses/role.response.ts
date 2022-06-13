import { ObjectType, Field } from "@nestjs/graphql";
import { HttpStatusCode } from "src/shared/enums/http-codes.enum";
import { GenericResponsePayload } from "src/shared/interfaces/generic-response.interface";
import { Role } from "../entities/role.entity";


@ObjectType()
export class ResponseRole implements GenericResponsePayload<Role> {
    @Field()
    code: HttpStatusCode;

    @Field({ nullable: true })
    data?: Role;

    @Field({ nullable: true })
    status?: boolean;

    @Field({ nullable: true })
    errorDescription?: string;
}