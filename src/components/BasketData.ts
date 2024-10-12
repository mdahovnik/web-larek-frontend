import { IBasket, IBasketData, ICard } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
    // basket: IBasket;
    protected _basketList: ICard[];
    protected _cost: number;
    protected _total: number;
    // toRemove: string;

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

    get cost(): number {
        if (this._basketList.length)
            return this._basketList.map((item) => item.price).reduce((a, b) => a + b);
    }

    get total() {
        return this._basketList.length ?? 0;
    }

    add(card: ICard): void {
        if (!this.basketContains(card)) {
            this._basketList.push(card);
            this.basketChanged();
        }
    }

    remove(card: ICard): void {
        if (this.basketContains(card)) {
            this._basketList = this._basketList.filter(item => item.id !== card.id);
            this.basketChanged();
        }
    }

    clear() {
        this._basketList = [];
        this._cost = 0;
    }

    protected basketChanged() {
        this.events.emit('basket:changed', { cards: this._basketList })
    }

    protected basketContains(card: ICard) {
        return this._basketList.some(item => item.id === card.id);
    }


}