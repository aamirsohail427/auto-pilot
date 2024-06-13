export interface ListDataResponse<T> {
    data: {
        items: T[]
    };
    success: boolean;
    unAuthorizedRequest: boolean;
}

export interface DataResponse<T> {
    data: T;
    success: boolean;
    unAuthorizedRequest: boolean;
}

export interface ValidateResponse<T> {
    data: {
        message: string,
        isValid: boolean
    };
    success: boolean;
    unAuthorizedRequest: boolean;
}

export interface ValidationDuplicateResponse<T> {
    data: {
        message: string,
        isValid: boolean,
        duplicateData: T
    };
    success: boolean;
    unAuthorizedRequest: boolean;
}
