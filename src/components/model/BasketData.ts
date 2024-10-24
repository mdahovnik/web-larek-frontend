import { IBasketData, ICard, TBasketCard, TGalleryCard } from "../../types";
import { IEvents } from "../base/events";

export class BasketData implements IBasketData {
    protected _cards: ICard[];

    constructor(protected events: IEvents) {
        this._cards = [];
    }

    add(card: ICard): void {
        if (!this.contains(card.id)) {
            this._cards.unshift(card);
            this.basketDataChanged();
        }
    }

    remove(id: string): void {
        if (this.contains(id)) {
            this._cards = this._cards.filter(item => item.id !== id);
            this.basketDataChanged();
        }
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

    getCost(): number {
        if (!this._cards.length) return 0;
        return this._cards
            .map((item) => item.price)
            .reduce((a, b) => a + b);
    }

    getQuantity(): number {
        return this._cards.length ?? 0;
    }

    clear(): void {
        this._cards = [];
        this.basketDataChanged();
    }

    getIdList(): string[] {
        return this._cards.map(card => card.id);
    }

    contains(id: string): boolean {
        return this._cards.some(item => item.id === id);
    }

    protected basketDataChanged(): void {
        this.events.emit('basket-data:change', { data: this })
    }

}