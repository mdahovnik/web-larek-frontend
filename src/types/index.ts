
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface ICardsData {
    setCards(cards: ICard[]): void;
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
    clear(): void;
}


export type TPayment = 'card' | 'cash';

export type TOrderError = Partial<Pick<IOrder,
    'address' |
    'email' |
    'payment' |
    'phone'
>>

export type TPreviewCard = Pick<ICard & { canBuy: boolean },
    'description' |
    'canBuy'
>;

export type TGalleryCard = Pick<ICard,
    'category' |
    'image' |
    'price' |
    'title'
>;

export type TBasketCard = Pick<ICard & { index: number },
    'id' |
    'price' |
    'title'
// 'index'
>;

export type TOrderResponse = {
    id: string,
    total: number
}

export type TInitCards = {
    total: number,
    items: ICard[]
};
