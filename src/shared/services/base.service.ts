import { Not, Repository } from "typeorm";
import { GenericPaginatedResponse } from "../interfaces/generic-paginated-response.interface";


export class BaseService {
    async getEntityById<T>(repo: Repository<T>, id: number, relations: string[]): Promise<T> {
        return repo.findOne({
            where: {
                deleted: false,
                id
            },
            relations
        });
    }

    async checkRestExistanceNotId<T>(repo: Repository<T>, id: number, whereObject: FindConditions<T>, relations: string[] = []): Promise<T> {
        const obj = {
            deleted: false,
            id: Not(id),
            ...whereObject
        }

        return repo.findOne({
            where: obj,
            relations
        });

    }

    async getEntitiesWhere<T>(repo: Repository<T>, whereObject:   FindConditions<T>,relations: string[]): Promise<T[]> {

        const obj = {
            deleted: false,
            ...whereObject
        }

        return repo.find({
            where: obj,
            relations
        });
    }

    async getEntitys<T>(repo: Repository<T>, relations: string[]): Promise<T[]> {
        return repo.find({
            where: {
                deleted: false,
            },
            relations
        });
    }

    async getPaginatedData<T>(repo: Repository<T>, pageNumber: number, pageSize: number, relations: string[] = []): Promise<GenericPaginatedResponse<T>> {
        console.log(pageNumber)
        const [items, totalCount] = await repo.findAndCount({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            relations
        });

        return {
            items,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize), // You can also calculate totalPages here
        };
    }
}
