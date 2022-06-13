

export class BaseService {
    async getEntityById<T>(repo: any, id: number, relations: string[]): Promise<T> {
        return repo.findOne({
            where: {
                deleted: false,
                id
            },
            relations
        });
    }
}