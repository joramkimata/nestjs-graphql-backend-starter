import { responsePaginated } from "src/shared/helpers/response.helper";
import { ObjectType } from "@nestjs/graphql";
import { Role } from "../entities/role.entity";


@ObjectType()
export class ResponseRolePaginated extends responsePaginated(Role) { }