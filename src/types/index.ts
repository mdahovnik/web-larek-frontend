import { ICardBasket } from "../components/view/Card";

export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface ICardsData {
    setList(cards: ICard[]): void;
    setSelectedCard(id: string): void;
    getSelectedCard(): ICard;
    getCard(id: string): ICard;
    getCards(): ICard[];
}

export interface IBasketData {
    getCost(): number;
    getQuantity(): number;
    add(card: ICard): void;
    remove(id: string): void;
    getIdList(): string[];
    contains(id: string): boolean;
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
    getOrder(): IOrder;
    setField(field: keyof IOrder, value: string): void;
    getOrderError(): TOrderError;
    isOrderValid(): boolean;
    isContactsValid(): boolean;
    clear(): void;
}


export type TPayment = 'card' | 'cash';

export type TOrderError = Partial<Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>>

export type TBasketCard = Pick<ICard & ICardBasket, 'title' | 'price' | 'id' | 'index'>;

export type TOrderResponse = {
    id: string,
    total: number
}

export type TInitCards = {
    total: number,
    items: ICard[]
};
