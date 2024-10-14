import { View } from "../common/View";
import { IEvents } from "../base/events";

export interface IBasketContent {
    cards: HTMLElement[];
    cost: number;
}

export class BasketView extends View<IBasketContent> {

    protected _cards: HTMLUListElement;
    protected _basketItemIndex: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected _cost: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._cards = container.querySelector('.basket__list');
        this._basketItemIndex = container.querySelector('.basket__item-index');
        this._basketButton = container.querySelector('.basket__button');
        this._cost = container.querySelector('.basket__price');

        this.setEmitOnElementClick('basket:submit', this._basketButton);
        // this._basketButton.addEventListener('click', () => {
        //     this.events.emit('basket:submit', {card: this})});
    }

    set cost(price: number) {
        this._cost.textContent = price ? `${price} синапсов` : `0 синапсов`;
        this.toggleDisabledAttribute(this._basketButton, price, );
    }

    set cards(cards: HTMLElement[]) {
        this._cards.replaceChildren(...cards);
        this.numbering();
    }

    numbering() {
        let cardIndex: number = 1;
        this.container.querySelectorAll('.basket__item-index')
            .forEach(el => el.textContent = String(cardIndex++));
    }
}