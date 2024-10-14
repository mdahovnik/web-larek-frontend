import { IBasketData, ICard, TOrderProducts } from "../../types";
import { IEvents } from "../base/events";

export class Basket implements IBasketData {

    protected _list: ICard[];
    protected _cost: number;
    protected _total: number;
    // toRemove: string;

    constructor(protected events: IEvents) {
        this._list = [];
        this._cost = 0;
    }

    set cards(cards: ICard[]) {
        this._list = cards;
        this.basketDataChanged();
    }

    get cards(): ICard[] {
        return this._list;
    }

    get cost(): number {
        if (!this._list.length) return 0;

        return this._list.map((item) => item.price).reduce((a, b) => a + b);
    }

    get total() {
        return this._list.length ?? 0;
    }

    getBasketProductsIds(): TOrderProducts {
        return { items: this._list.map(card => card.id) };
    }

    add(card: ICard): void {
        if (!this.contains(card)) {
            this._list.unshift(card);
            this.basketDataChanged();
        }
    }

    remove(card: ICard): void {
        if (this.contains(card)) {
            this._list = this._list.filter(item => item.id !== card.id);
            this.basketDataChanged();
        }
    }

    clear() {
        this._list = [];
        this._cost = 0;
        this.basketDataChanged();
    }

    protected basketDataChanged() {
        this.events.emit('basket-data:change', { data: this })
    }

    contains(card: ICard) {
        return this._list.some(item => item.id === card.id);
    }


}