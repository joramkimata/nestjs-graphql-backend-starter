import { ObjectType } from "@nestjs/graphql";
import { genericResponsePayload } from "src/shared/helpers/graphql.helper";
import { responsePaginated } from "src/shared/helpers/response.helper";
import { Attachment } from "../entities/attachment.entity";


@ObjectType()
export class ResponseAttachment extends genericResponsePayload(Attachment) { }

@ObjectType()
export class ResponseAttachmentPaginated extends responsePaginated(Attachment) { }