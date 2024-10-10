import { ApiPostMethods } from "../components/base/api";

export interface ICard {
    category: string;
    description: string;
    id: string;
    image: string;
    price: number;
    title: string;
}

export interface ICardsData {
    cardsList: ICard[];
    selectedCard: string | null;
    getCard(id: string): ICard;
}

export interface IBasket {
    // isEmpty: boolean;
    // count: string;
    cost: number;
}

export interface IBasketData {
    basket: IBasket;
    basketList: ICard[];
    toRemove: string;
    addProduct(card: ICard): void;
    removeProduct(id: string): void;
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


export interface IApi {
    get<T>(url: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type IOrderResult = { id: string, total: number }
export type TInitCards = { total: number, items: ICard[] };

export type TCardBase = Pick<ICard, 'image' | 'title' | 'category' | 'price'>;
export type TCardModal = Pick<ICard, 'description' | 'image' | 'title' | 'category' | 'price'>;
export type TCardBasket = Pick<ICard, 'title' | 'price' | 'id'>;
export type TCardOrder = Pick<ICard, 'id'>;
export type TOrderValidation = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;