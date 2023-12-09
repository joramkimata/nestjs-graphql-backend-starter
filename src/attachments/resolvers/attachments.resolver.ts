
import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { Attachment } from "../entities/attachment.entity";
import { AttachableTypeEnum } from "../enums/attachable-type.enum";
import { AttachmentInput } from "../inputs/attachment.input";
import { AttachmentService } from "../services/attachments.service";
import { ResponseAttachment } from "../responses/attachment.response";

@Resolver(of => Attachment)
export class AttachmentResolver {


    constructor(
        private attachmentService: AttachmentService
    ) { }

    @Mutation(returns => ResponseAttachment)
    saveAttachment(
        @Args('input')
        input: AttachmentInput
    ) {
        return this.attachmentService.saveAttachment(input);
    }



    @Mutation(returns => ResponseAttachment)
    deleteAttachment(
        @Args('uuid')
        uuid: string
    ) {
        return this.attachmentService.deleteAttachment(uuid);
    }

    @Query(returns => [Attachment])
    getAttachments(
        @Args('attachableUid')
        attachableUid: string,
        @Args('attachableType', { type: () => AttachableTypeEnum })
        attachableType: AttachableTypeEnum
    ) {
        return this.attachmentService.getAttachments(attachableUid, attachableType);
    }
}