import { IBasket, IBasketData, ICard, TCardBasket } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
    basket: IBasket;
    protected _basketList: ICard[];
    protected _cost: number;
    protected _total: number;
    toRemove: string;

    constructor(protected events: IEvents) {
        this._basketList = [];
        this._cost = 0;
    }

    set basketList(cards: ICard[]) {
        this._basketList = cards;
    }

    get basketList(): ICard[] {
        return this._basketList;
    }

    addProduct(card: ICard): void {
        this.basketList.push(card);
        this.basketChanged();
    }

    removeProduct(id: string): void {
        this.basketList = this.basketList.filter(card => card.id !== id);
        this.basketChanged();
    }

    get cost(): number {
        if (this.basketList.length)
            return this._basketList.map((item) => item.price).reduce((a, b) => a + b);
    }

    get total() {
        return this._basketList.length ?? 0;
    }

    protected basketChanged() {
        this.events.emit('basket:changed', { cards: this.basketList })
    }

}