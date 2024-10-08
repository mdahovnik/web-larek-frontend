
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number
}

export interface ICardData {
    cardsList: ICard[];
    selectedProduct: string | null;
    getProduct(id: string): ICard;
}

export interface IBasket {
    isEmpty: boolean;
    cardsList: ICard[];
    count: string;
    cost: number;
}

export interface IBasketData {
    basket: IBasket;
    productToDelete: string;
    addProduct(product: ICard): void;
    removeProduct(id: string): void;
    getProductInfo(): TCardBasket;
    checkProductStatus(id: string): boolean;
}

export interface IContacts {
    email: string;
    phone: string;
}

export interface IOrder extends IContacts {
    payment: string;
    address: string;
    total: number;
    product: TCardOrder[];
}

export interface IOrderData {
    order: IOrder;
    status: string | null;
    isOrderValid: boolean;
    checkValidation(data: Record<keyof TOrderValidation, string>): boolean;
    sendOrder(order: IOrder): void;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type TCardBase = Pick<ICard, 'image' | 'title' | 'category' | 'price'>;
export type TCardModal = Pick<ICard, 'description' | 'image' | 'title' | 'category' | 'price'>;
export type TCardBasket = Pick<ICard, 'title' | 'price' | 'id'>;
export type TCardOrder = Pick<ICard, 'id'>;
export type TOrderValidation = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;