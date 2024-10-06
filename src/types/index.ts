
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
}

export interface IProductData {
    products: IProduct[];
    selectedProduct: string | null;
    getProduct(id: string): IProduct;
}

export interface IBasket {
    isEmpty: boolean;
    products: IProduct[];
    count: string;
    cost: number;
}

export interface IBasketData {
    basket: IBasket;
    productToDelete: string;
    addProduct(product: IProduct): void;
    removeProduct(id: string): void;
    getProductInfo(): TProductBasket;
    checkProductStatus(id: string): boolean;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    product: TProductOrder[];
}

export interface IOrderResult {

}

export interface IOrderData {
    order: IOrder;
    status: IOrderResult;
    isOrderValid: boolean;
    checkValidation(data: Record<keyof TOrderValidation, string>): boolean;
    getOrder(): IOrder;
    getOrderStatus(order: IOrder): Promise<IOrderResult>;
}


export type TProductBaseInfo = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;
export type TProductModal = Pick<IProduct, 'description' | 'image' | 'title' | 'category' | 'price'>;
export type TProductBasket = Pick<IProduct, 'title' | 'price' | 'id'>;
export type TProductOrder = Pick<IProduct, 'id'>;
export type TOrderValidation = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;
// export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;
// export type TOrderEmail = Pick<IOrder, 'email' | 'phone'>;



export interface IModal {

}