import { ApiPostMethods } from "../components/base/api";

export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
    isInBasket: boolean;
}

export interface ICardsData {
    list: ICard[];
    // selectedCard: string | null;
    getCard(id: string): ICard;
    setCardBasketStatus(id: string, value: boolean): void;
}


export interface IBasketData {
    cards: ICard[];
    getCost(): number;
    getCount(): number;
    add(card: ICard): void;
    remove(card: ICard): void;
    getProductIdList(): string[];
    clear(): void;
}

export interface IContacts {
    email: string;
    phone: string;
}

export interface IOrder extends IContacts {
    payment: string;
    address: string;
    total: number;
    items: string[];
    // orderProducts: TOrderProducts[];
}

export interface IOrderData {
    // payment: string;
    // address: string;
    // total: number;
    // items: string[];
    order: IOrder;
    status: string;
    // getOrder(): IOrder;
    isOrderValid(data: Record<keyof IOrder, string | number>): boolean;
    // isOrderValid: boolean;
    // sendOrder(order: IOrder): void;
}



//TODO: перепроверить типы
export type TInitCards = { total: number, items: ICard[] };
// export type TOrderProducts = string[];
// export type TFormOrder = Pick<IOrderData, 'payment' | 'address'>;//
export type TPayment = 'card' | 'cash';
// export type TOrder = Pick<IOrderData, 'payment' | 'address' | 'email' | 'phone' | 'total' | 'items'>;
export type TOrderResult = { id: string, total: number }
export type TOrderError = Partial<Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>>


export type TCardCatalog = Pick<ICard, 'image' | 'title' | 'category' | 'price'>;
export type TCardModal = Pick<ICard, 'description' | 'image' | 'title' | 'category' | 'price'>;
export type TCardBasket = Pick<ICard, 'title' | 'price' | 'id'>;
// export type TOrderContacts = Pick<IOrderData, 'email' | 'phone'>;//
// export type TBasketData = Pick<IBasketData, 'cards' | 'cost'>;