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

        this._basketButton.addEventListener('click', () => {
            this.emitChanges('basket:submit', { data: this })
        });
    }

    set cards(cards: HTMLElement[]) {
        this._cards.replaceChildren(...cards);
    }

    set cost(cost: number) {
        this.setText(this._cost, cost ? `${cost} синапсов` : `0 синапсов`);
        this.setDisabled(this._basketButton, cost === 0);
    }
}