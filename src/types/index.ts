
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
}

export interface ICardData {
    products: ICard[];
    selectedProduct: string | null;
    getProduct(id: string): ICard;
}

export interface IBasket {
    isEmpty: boolean;
    products: ICard[];
    count: string;
    cost: number;
}

export interface IBasketData {
    basket: IBasket;
    productToDelete: string;
    addProduct(product: ICard): void;
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

export interface IOrderData {
    order: IOrder;
    status: string | null;
    isOrderValid: boolean;
    checkValidation(data: Record<keyof TOrderValidation, string>): boolean;
    sendOrder(order: IOrder): void;
}


export type TProductBase = Pick<ICard, 'image' | 'title' | 'category' | 'price'>;
export type TProductModal = Pick<ICard, 'description' | 'image' | 'title' | 'category' | 'price'>;
export type TProductBasket = Pick<ICard, 'title' | 'price' | 'id'>;
export type TProductOrder = Pick<ICard, 'id'>;
export type TOrderValidation = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

