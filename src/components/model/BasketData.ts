import { IBasketData, ICard, TBasketCard } from "../../types";
import { appEvents } from "../../utils/constants";
import { Data } from "../base/Data";

export class BasketData extends Data implements IBasketData{
    protected _cards: ICard[] = [];

    add(card: ICard): void {
        if (!this.contains(card.id)) {
            this._cards.unshift(card);
            this.dataChanged(appEvents.basketDataChange);
        }
    }

    remove(id: string): void {
        if (this.contains(id)) {
            this._cards = this._cards.filter(item => item.id !== id);
            this.dataChanged(appEvents.basketDataChange);
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
        this.dataChanged(appEvents.basketDataChange);
    }

    getIdList(): string[] {
        return this._cards.map(card => card.id);
    }

    contains(id: string): boolean {
        return this._cards.some(item => item.id === id);
    }

}