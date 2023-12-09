import { Injectable } from "@nestjs/common";
import { SampleAttachment } from "../entities/sample-attachment.entity";
import { AttachmentService } from "./attachments.service";
import { AttachableTypeEnum } from "../enums/attachable-type.enum";


@Injectable()
export class SampleAttachmentService {

    constructor(
        private attachmentService: AttachmentService
    ) {

    }

    // Last step: implement the actual code
    getAttachments(sampleAttachment: SampleAttachment) {
        return this.attachmentService.getAttachments(sampleAttachment.uuid, AttachableTypeEnum.SAMPLE_ATTACHMENT);
    }


}