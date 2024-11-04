import { IBasketData, ICard, TCardBasket } from "../../types";
import { APP_EVENTS } from "../../utils/constants";
import { Data } from "../base/Data";

export class BasketData extends Data implements IBasketData {
    protected _cards: ICard[] = [];

    add(card: ICard): void {
        if (!this.contains(card.id)) {
            this._cards.unshift(card);
            this.dataChanged(APP_EVENTS.basketDataChange);
        }
    }

    remove(id: string): void {
        if (this.contains(id)) {
            this._cards = this._cards.filter(item => item.id !== id);
            this.dataChanged(APP_EVENTS.basketDataChange);
        }
    }

    getCards(): TCardBasket[] {
        return this._cards.map((item) => {
            return {
                id: item.id,
                price: item.price,
                title: item.title
            }
        })
    }

    getCost(): number {
        if (!this._cards.length) return 0;
        
        return this._cards.reduce((accumulator, current) => {
            return accumulator + current.price;
        }, 0);
    }

    getQuantity(): number {
        return this._cards.length ?? 0;
    }

    clear(): void {
        this._cards = [];
        this.dataChanged(APP_EVENTS.basketDataChange);
    }

    getIdList(): string[] {
        return this._cards.map(card => card.id);
    }

    contains(id: string): boolean {
        return this._cards.some(item => item.id === id);
    }

}