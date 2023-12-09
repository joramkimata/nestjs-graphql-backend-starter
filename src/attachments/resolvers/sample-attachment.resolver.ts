import { Resolver, ResolveField, Parent } from "@nestjs/graphql";
import { SampleAttachment } from "../entities/sample-attachment.entity";
import { SampleAttachmentService } from "../services/sample-attachment.service";


@Resolver(of => SampleAttachment)
export class SampleAttachmentResolver {

    constructor(
        private sampleAttachmentService: SampleAttachmentService
    ) {

    }

    // Step 3: Resolve the attachment
    // Check Step 2 and Step 1 in folder entities @ sample-attachment.entity.ts
    // Attachments resolver
    @ResolveField()
    async attachments(@Parent() sampleAttachment: SampleAttachment) {
        return this.sampleAttachmentService.getAttachments(sampleAttachment);
    }
}