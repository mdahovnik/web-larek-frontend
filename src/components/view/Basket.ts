import { appEvents } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { View } from "../base/View";
import { IEvents } from "../base/events";

export interface IBasketContent {
    cards: HTMLElement[];
    cost: number;
}

export class Basket extends View<IBasketContent> {
    protected _cards: HTMLUListElement;
    protected _basketItemIndex: HTMLSpanElement;
    protected _basketButton: HTMLButtonElement;
    protected _cost: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._cards = ensureElement<HTMLUListElement>('.basket__list', container);
        this._basketButton = ensureElement<HTMLButtonElement>('.basket__button', container);
        this._cost = ensureElement('.basket__price', container);
        this._basketItemIndex = container.querySelector('.basket__item-index');

        this._basketButton.addEventListener('click', () => {
            this.emitChanges(appEvents.basketSubmit)
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