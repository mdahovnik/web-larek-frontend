import { IBasketData, ICard, TOrderProducts } from "../../types";
import { IEvents } from "../base/events";

export class Basket implements IBasketData {

    protected _list: ICard[];
    protected _cost: number;
    protected _total: number;

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

    getBasketProductsId() {
        return this._list.map(card => card.id) ;
    }

    contains(card: ICard) {
        return this._list.some(item => item.id === card.id);
    }

    isEmpty(): boolean {
        return this._list.length === 0;
    }
    //TODO: определить возвращаемый тип
    // getFullBasketData() {
    //     return {
    //         "total": this.cost,
    //         "items": this.getBasketProductsIds()
    //     }
    // }

    protected basketDataChanged() {
        this.events.emit('basket-data:change', { data: this })
    }


}