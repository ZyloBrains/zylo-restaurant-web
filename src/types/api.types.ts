export interface ApiResponse<T>{
    data: T;
    success:boolean;
    message:string|null;
    stauts:number;
    errors:unknown|null;
    timestamp:string;
    
}
export interface PaginationResponse<T>{
    content: T[],
    pageNumber:number,
    pageSize:number,
    totalElements:number,
    totalPages:number,
    firstPage:boolean,
    last:boolean
}