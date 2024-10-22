import { IBasketData, ICard, TBasketCard, TGalleryCard } from "../../types";
import { IEvents } from "../base/events";

export class BasketData implements IBasketData {

    protected _cards: ICard[];

    constructor(protected events: IEvents) {
        this._cards = [];
    }

    set cards(cards: []) {
        this._cards = cards;
        this.basketDataChanged();
    }

    getBasketViewCards(): TBasketCard[] {
        return this._cards.map((item, index) => {
            return {
                id: item.id,
                title: item.title,
                price: item.price,
                index: index + 1
            }
        })
    }

    getCost() {
        if (!this._cards.length) return 0;
        return this._cards.map((item) => item.price).reduce((a, b) => a + b);
    }

    getQuantity() {
        return this._cards.length ?? 0;
    }

    add(card: ICard): void {
        if (!this.contains(card.id)) {
            this._cards.unshift(card);
            this.basketDataChanged();
        }
    }

    remove(card: ICard): void {
        if (this.contains(card.id)) {
            this._cards = this._cards.filter(item => item.id !== card.id);
            this.basketDataChanged();
        }
    }

    clear() {
        this._cards = [];
        this.basketDataChanged();
    }

    getIdList() {
        return this._cards.map(card => card.id);
    }

    contains(id: string) {
        return this._cards.some(item => item.id === id);
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