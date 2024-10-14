import { ApiPostMethods } from "../components/base/api";

export interface ICard {
    category: string;
    description: string;
    id: string;
    image: string;
    price: number;
    title: string;
    isInBasket: boolean;
}

export interface ICardsData {
    cardsList: ICard[];
    selectedCard: string | null;
    getCard(id: string): ICard;
}


export interface IBasketData {
    cards: ICard[];
    cost: number;
    total: number;
    add(card: ICard): void;
    remove(card: ICard): void;
    clear(): void;
}

export interface IContacts {
    email: string;
    phone: string;
}

// export interface IOrder extends IContacts {
//     payment: string;
//     address: string;
//     total: number;
//     orderProducts: TOrderProducts[];
// }

export interface IOrderData extends IContacts {
    payment: string;
    address: string;
    total: number;
    orderProducts: TOrderProducts[];
    status: TOrderResult;
    // isOrderValid: boolean;
    isOrderValid(data: Record<keyof TOrderValidation, string | number>): boolean;
    // sendOrder(order: IOrder): void;
}


export interface IApi {
    get<T>(url: string): Promise<T>;
    post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TInitCards = { total: number, items: ICard[] };
export type TOrderProducts = { items: string[] };
export type TFormOrder = Pick<IOrderData, 'payment' | 'address'>;//
export type TPayment = 'card' | 'cash';

export type TCardBase = Pick<ICard, 'image' | 'title' | 'category' | 'price'>;
export type TCardModal = Pick<ICard, 'description' | 'image' | 'title' | 'category' | 'price'>;
export type TCardBasket = Pick<ICard, 'title' | 'price' | 'id'>;
export type TOrderValidation = Pick<IOrderData, 'payment' | 'address' | 'email' | 'phone'>;
export type TOrderResult = { id: string, total: number }
export type TOrderContacts = Pick<IOrderData, 'email' | 'phone'>;//
// export type TBasketData = Pick<IBasketData, 'cards' | 'cost'>;