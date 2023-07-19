import { responsePaginated } from "src/shared/helpers/response.helper";
import { User } from "../entities/user.entity";
import { ObjectType } from "@nestjs/graphql";


@ObjectType()
export class ResponseUserPaginated extends responsePaginated(User) { }