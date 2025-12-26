export interface SalesRecord {
    Name: string;
    Insurance: number;
    "T.price": number;
    InsuranceDiscount: number;
    CACHDiscount: number;
    DIFRENT: number;
    Deductible1: number;
    Expr1: number;
    PUPADESCOUNT: number;
    "puba .27": number;
    TAW: number;
    AXA: number;
    Quantity: number;
    ApprovePrice: number;
    Trans_Year: number;
    GalleryID: number;
}

export interface ApiResponse {
    message: string;
    data: SalesRecord[];
}

export interface Store {
    StoreID: number;
    Name: string;
}

export interface Gallery {
    GalleryID: number;
    Name: string;
}
