import { ICard } from "../../types";
import { CategoryColor } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { View } from "../base/View";

interface ICArdAction {
    onClick: () => void;
}

export class Card<T> extends View<T> {
    protected _cardCategory: HTMLSpanElement;
    protected _cardTitle: HTMLTitleElement;
    protected _cardImage: HTMLImageElement;
    protected _cardPrice: HTMLSpanElement;
    protected _cardText: HTMLParagraphElement;
    protected _button: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents, action?: ICArdAction) {
        super(container, events);

        this._cardTitle = ensureElement<HTMLTitleElement>('.card__title', container);
        this._cardPrice = ensureElement('.card__price', container);
        this._cardImage = container.querySelector('.card__image');
        this._cardCategory = container.querySelector('.card__category');
        this._cardText = container.querySelector('.card__text');
        this._button = container.querySelector('.card__button');

        if (!this._button)
            this.container.addEventListener('click', () => { action?.onClick?.() });
        else
            this._button.addEventListener('click', () => { action?.onClick?.() });
    }

    set category(category: string) {
        this.setText(this._cardCategory, category);
        this.setColor(category)
    }

    set description(value: string) {
        this.setText(this._cardText, value);
    }

    set title(title: string) {
        this.setText(this._cardTitle, title);
    }

    set image(address: string) {
        if (this._cardImage)
            this.setImage(this._cardImage, address);
    }

    set price(price: number) {
        this.setText(this._cardPrice, price ? String(price) + ' синапсов' : 'Бесценно');
        this.setDisabled(this._button, Number(price) === 0)
    }

    protected setColor(category: string): void {
        const color = (Object.keys(CategoryColor) as (keyof typeof CategoryColor)[])
            .find(key => {
                return CategoryColor[key] === category
            });

        this.toggleClass(this._cardCategory, `card__category_${color}`, true);
    }

}


export interface ICardPreview {
    canBuy: boolean
}

export class CardPreview extends Card<ICardPreview & ICard> {
    constructor(protected container: HTMLElement, events: IEvents, action?: ICArdAction) {
        super(container, events, action);
    }

    set canBuy(value: boolean) {
        if (value && this._cardCategory)
            this.setText(this._button, 'Удалить');
    }
}


export interface ICardBasket {
    index: number
}

export class CardBasket extends Card<ICardBasket & ICard> {
    protected _index: HTMLElement;

    constructor(protected container: HTMLElement, events: IEvents, action?: ICArdAction) {
        super(container, events, action);
        this._index = container.querySelector('.basket__item-index');
    }

    set index(value: number) {
        this.setText(this._index, value);
    }
}