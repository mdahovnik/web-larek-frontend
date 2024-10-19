import { IBasketData, ICard } from "../../types";
import { IEvents } from "../base/events";

export class Basket implements IBasketData {

    protected _cards: ICard[];

    constructor(protected events: IEvents) {
        this._cards = [];
    }

    set cards(cards: ICard[]) {
        this._cards = cards;
        this.basketDataChanged();
    }

    get cards(): ICard[] {
        return this._cards;
    }

    getCost() {
        if (!this._cards.length) return 0;
        return this._cards.map((item) => item.price).reduce((a, b) => a + b);
    }

    getCount() {
        return this._cards.length ?? 0;
    }

    add(card: ICard): void {
        if (!this.contains(card)) {
            this._cards.unshift(card);
            this.basketDataChanged();
        }
    }

    remove(card: ICard): void {
        if (this.contains(card)) {
            this._cards = this._cards.filter(item => item.id !== card.id);
            this.basketDataChanged();
        }
    }

    clear() {
        this._cards = [];
        this.basketDataChanged();
    }

    getProductIdList() {
        return this._cards.map(card => card.id) ;
    }

    contains(card: ICard) {
        return this._cards.some(item => item.id === card.id);
    }

    isEmpty(): boolean {
        return this._cards.length === 0;
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