export interface IPaginationOptions {
    take: number;
    skip: number;
    limit?: number;
    page?: number;
    order?: any;
    filter?: any;
    keyword?: string;
}
