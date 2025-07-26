export interface QueryParamsResult {
    page: number;
    limit: number;
    search?: string;
    filters: Record<string, any>;
}
export declare const QueryParams: (...dataOrPipes: unknown[]) => ParameterDecorator;
