import { IBasket } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Basket extends Component<IBasket> {

    protected _basket: IBasket;
    protected _items: HTMLUListElement;
    protected _basketItemIndex?: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected _cost?: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this._items = container.querySelector('.basket__list');
        this._basketItemIndex = container.querySelector('.basket__item-index');
        this._basketButton = container.querySelector('.basket__button');
        this._cost = container.querySelector('.basket__price');
    }

    // set itemIndex(index: string) {
    //     // this._items.ch
    //     this._basketItemIndex.textContent = index;
    // }

    set cost(price: string) {
        this._cost.textContent = price ? `${price} синапсов` : `0 синапсов`;
    }

    set cards(cards: HTMLElement[]) {
        this._items.replaceChildren(...cards);
        this.makeNumbering();
    }

    makeNumbering() {
        let cardIndex: number = 1;
        this.container.querySelectorAll('.basket__item-index')
            .forEach(el => el.textContent = String(cardIndex++));
    }
}