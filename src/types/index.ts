import { ApiPostMethods } from "../components/base/api";

//TODO: добавить не достающие методы
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
    canBuy: boolean;
    index: number;
}

export interface ICardsData {
    list: ICard[];
    selectedCard: string;
    getCard(id: string): ICard;
    getGalleryCards(): TGalleryCard[];
}

export interface IBasketData {
    cards: ICard[];
    getCost(): number;
    getQuantity(): number;
    add(card: ICard): void;
    remove(id: string): void;
    getIdList(): string[];
    contains(id: string): boolean;
    isEmpty(): boolean;
    clear(): void;
}

export interface IContacts {
    email: string;
    phone: string;
}

export interface IOrder extends IContacts {
    payment: string;
    address: string;
}

export interface IOrderData {
    order: IOrder;
    setField(field: keyof IOrder, value: string): void;
    getOrderError(): TOrderError;
    isOrderValid(): boolean;
    isContactsValid(): boolean;
    clear(): void;
}

//TODO: перепроверить типы
export type TOrderResponse = { id: string, total: number }
export type TPayment = 'card' | 'cash';
export type TOrderError = Partial<Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>>
export type TInitCards = { total: number, items: ICard[] };
export type TGalleryCard = Pick<ICard, 'image' | 'title' | 'category' | 'price' | 'id'>;
export type TBasketCard = Pick<ICard, 'title' | 'price' | 'id' | 'index'>;

