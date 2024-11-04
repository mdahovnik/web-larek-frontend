import { TBasketCard, TGalleryCard, TPreviewCard } from "../../types";
import { CategoryColor } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { View } from "../base/View";

interface ICardAction {
    onClick: () => void;
}

export class Card<T> extends View<T> {
    protected _cardTitle: HTMLTitleElement;
    protected _cardPrice: HTMLSpanElement;
    protected _button: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents, action?: ICardAction) {
        super(container, events);

        this._cardTitle = ensureElement<HTMLTitleElement>('.card__title', container);
        this._cardPrice = ensureElement('.card__price', container);
        this._button = container.querySelector('.card__button');

        if (!this._button)
            this.container.addEventListener('click', () => { action?.onClick?.() });
        else
            this._button.addEventListener('click', () => { action?.onClick?.() });
    }

    set title(title: string) {
        this.setText(this._cardTitle, title);
    }

    set price(price: number) {
        this.setText(this._cardPrice, price ? String(price) + ' синапсов' : 'Бесценно');
        this.setDisabled(this._button, Number(price) === 0)
    }
}

export interface IIndex {
    index: number
}

export class CardBasket extends Card<TBasketCard & IIndex> {
    protected _index: HTMLElement;

    constructor(protected container: HTMLElement, events: IEvents, action?: ICardAction) {
        super(container, events, action);
        this._index = container.querySelector('.basket__item-index');
    }

    set index(value: number) {
        this.setText(this._index, value);
    }
}

export class CardGallery<T> extends Card<T & TGalleryCard> {
    protected _cardCategory: HTMLSpanElement;
    protected _cardImage: HTMLImageElement;

    constructor(protected container: HTMLElement, events: IEvents, action?: ICardAction) {
        super(container, events, action);
        this._cardImage = container.querySelector('.card__image');
        this._cardCategory = container.querySelector('.card__category');
    }

    set category(category: keyof typeof CategoryColor) {
        this.setText(this._cardCategory, category);
        this.setColor(category)
    }

    set image(address: string) {
        if (this._cardImage)
            this.setImage(this._cardImage, address);
    }

    protected setColor(category: keyof typeof CategoryColor): void {
        const color = CategoryColor[category]
        if (color)
            this.toggleClass(this._cardCategory, `card__category_${color}`, true);
    }
}

export class CardPreview extends CardGallery<TPreviewCard> {
    protected _cardText: HTMLParagraphElement;

    constructor(protected container: HTMLElement, events: IEvents, action?: ICardAction) {
        super(container, events, action);
        this._cardText = container.querySelector('.card__text');
    }

    set description(value: string) {
        this.setText(this._cardText, value);
    }

    set canBuy(value: boolean) {
        if (value && this._cardCategory)
            this.setText(this._button, 'Удалить');
    }

}

