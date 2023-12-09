import { Module } from '@nestjs/common';
import { SampleAttachment } from './entities/sample-attachment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { AttachmentResolver } from './resolvers/attachments.resolver';
import { AttachmentService } from './services/attachments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Attachment,
            SampleAttachment
        ])
    ],
    providers: [
        AttachmentResolver,
        AttachmentService
    ],
    exports: [
        AttachmentService
    ]
})
export class AttachmentsModule { }
