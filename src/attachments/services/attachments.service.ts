import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpStatusCode } from "src/shared/enums/http-codes.enum";
import { BaseService } from "src/shared/services/base.service";
import { Repository } from "typeorm";
import { Attachment } from "../entities/attachment.entity";
import { AttachableTypeEnum } from "../enums/attachable-type.enum";
import { AttachmentInput } from "../inputs/attachment.input";
import { ResponseAttachment } from "../responses/attachment.response";
import { SampleAttachment } from "../entities/sample-attachment.entity";
import response from "src/shared/helpers/response.helper";
import * as moment from "moment";
import { deleteFileFromDisk, saveFileToDisk } from "src/shared/helpers/file.helper";

@Injectable()
export class AttachmentService extends BaseService {


    constructor(
        @InjectRepository(SampleAttachment)
        private sampleAttachmentRepo: Repository<SampleAttachment>,
        @InjectRepository(Attachment)
        private attachRepo: Repository<Attachment>,
    ) {
        super();
    }

    private rels = [];

    getAttachments(attachableUid: string, attachableType: AttachableTypeEnum) {
        return this.attachRepo.find({
            where: {
                deleted: false,
                attachableType,
                attachableUid
            }
        })
    }

    async deleteAttachment(uuid: string) {
        const res = new ResponseAttachment();

        const dbAtt = await this.attachRepo.findOne({
            where: {
                deleted: false,
                uuid
            }
        });

        if (!dbAtt) {
            return response(null, res, 'Attachment not found', HttpStatusCode.NO_FOUND);
        }

        try {
            await deleteFileFromDisk(dbAtt.attachemntDriveLocation);

            dbAtt.deleted = true;

            const saved = await this.attachRepo.save(dbAtt);

            return response(
                this.getEntityById<Attachment>(
                    this.attachRepo,
                    saved.id,
                    this.rels
                ),
                res
            );
        } catch (e) {
            console.log(e)
            return response(null, res, 'Error while delete file', HttpStatusCode.THROWN_ERROR);
        }


    }



    async saveAttachment({ attachableUid, attachableType, attachableFormat, attachemntData, attachmentExtension, attachmentName, uuid }: AttachmentInput) {
        const res = new ResponseAttachment();

        if (attachableType === AttachableTypeEnum.SAMPLE_ATTACHMENT) {
            const dbSpaces = await this.sampleAttachmentRepo.findOne({
                where: {
                    deleted: false,
                    uuid: attachableUid
                }
            });

            if (!dbSpaces) {
                return response(null, res, 'Sample attachment not found', HttpStatusCode.NO_FOUND);
            }

            const dbAtt = await this.attachRepo.findOne({
                where: {
                    deleted: false,
                    attachableUid,
                    uuid
                }
            });


            if (dbAtt) {
                const attachment = dbAtt;

                const _attachmentName = moment().unix().toString();

                attachment.attachableType = AttachableTypeEnum.SAMPLE_ATTACHMENT;
                attachment.attachableUid = attachableUid;
                attachment.attachableFormat = attachableFormat;
                attachment.attachmentExtension = attachmentExtension;
                attachment.attachmentName = _attachmentName;
                attachment.attachmentOGName = attachmentName;

                try {

                    await deleteFileFromDisk(attachment.attachemntDriveLocation);

                    const location = await saveFileToDisk(attachemntData, _attachmentName, attachmentExtension.toString().toLowerCase());

                    if (location) {
                        attachment.attachemntDriveLocation = location;
                        attachment.attachemntData = attachemntData;
                        const saved = await this.attachRepo.save(attachment);

                        return response(
                            this.getEntityById<Attachment>(
                                this.attachRepo,
                                saved.id,
                                this.rels
                            ),
                            res
                        );

                    }

                } catch (e) {
                    // console.log(e)
                    return response(null, res, 'Error while saving attachment', HttpStatusCode.THROWN_ERROR);
                }
            } else {

                const attachment = new Attachment();

                const _attachmentName = moment().unix().toString();

                attachment.attachableType = AttachableTypeEnum.SAMPLE_ATTACHMENT;
                attachment.attachableUid = attachableUid;
                attachment.attachableFormat = attachableFormat;
                attachment.attachmentExtension = attachmentExtension;
                attachment.attachmentName = _attachmentName;
                attachment.attachmentOGName = attachmentName;

                try {
                    const location = await saveFileToDisk(attachemntData, _attachmentName, attachmentExtension.toString().toLowerCase());

                    if (location) {
                        attachment.attachemntDriveLocation = location;
                        attachment.attachemntData = attachemntData;
                        const saved = await this.attachRepo.save(attachment);

                        return response(
                            this.getEntityById<Attachment>(
                                this.attachRepo,
                                saved.id,
                                this.rels
                            ),
                            res
                        );

                    }

                } catch (e) {
                    // console.log(e)
                    return response(null, res, 'Error while saving attachment', HttpStatusCode.THROWN_ERROR);
                }
            }

        }




    }

}