import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
export declare class PaginationValidationPipe extends ValidationPipe {
    constructor();
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
}
