
import { Type } from '@nestjs/common';
import { ObjectType, Field, Int } from '@nestjs/graphql';


export function PaginatedResponse<T>(T: Type<T>): any {
    @ObjectType({ isAbstract: true })
    abstract class PageClass {

        @Field(() => Int)
        totalPages: number;

        @Field(() => [T])
        items: T[];

        @Field(() => Int)
        totalCount: number;

    }

    return PageClass;
}

