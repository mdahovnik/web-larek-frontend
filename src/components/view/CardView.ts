import { ICard } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { IEvents } from "../base/events";
import { View } from "../common/View";


export class CardView extends View<ICard> {
    protected _events: IEvents;
    protected _cardCategory?: HTMLSpanElement;
    protected _cardTitle: HTMLTitleElement;
    protected _cardImage?: HTMLImageElement;
    protected _cardPrice: HTMLSpanElement;
    protected _cardText?: HTMLParagraphElement;
    protected _button: HTMLButtonElement;
    private _isInBasket: boolean;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);

        this._events = events;
        this._cardCategory = this.container.querySelector('.card__category');
        this._cardTitle = this.container.querySelector('.card__title');
        this._cardImage = this.container.querySelector('.card__image');
        this._cardPrice = this.container.querySelector('.card__price');
        this._cardText = this.container.querySelector('.card__text');
        this._button = this.container.querySelector('.card__button');

        if (this._cardText) {
            this.setEmitOnElementClick('card-basket:add', this._button);
            // this._button.addEventListener('click', () => {
            //     this.events.emit('card-basket:add', { card: this });
            // });
        }

        if (!this._button) {
            this.setEmitOnElementClick('card-preview:change', this.container);
            // this.container.addEventListener('click', () => {
            //     this.events.emit('card-preview:change',{ card: this });
            // });
        }

        if (!this._cardCategory) {
            this.setEmitOnElementClick('card-basket:remove', this._button);
            // this._button.addEventListener('click', () => {
            //     this.events.emit('card-basket:remove',{ card: this });
            // });
        }


    }

    set category(category: string) {
        if (this._cardCategory)
            this._cardCategory.textContent = category;
    }

    set title(title: string) {
        this._cardTitle.textContent = title;
    }

    set image(address: string) {
        if (this._cardImage)
            this._cardImage.src = CDN_URL + address;
    }

    set price(price: number) {
        this._cardPrice.textContent = price ? String(price) : "Бесценно";
        this.toggleDisabledAttribute(this._button, price);
    }

    set description(text: string) {
        if (this._cardText)
            this._cardText.textContent = text;
    }

    set isInBasket(value: boolean) {
        this._isInBasket = value;

        if (this._isInBasket && this._cardCategory) {
            this._button.textContent = 'Удалить';
            this.setEmitOnElementClick('card-basket:remove', this._button);
            // this._button.addEventListener('click', () => {
            //     this.events.emit('card-basket:add', { card: this })
            // });
        }
    }

    // set button(text: string) {
    //     if (this.cardText)
    //         this.cardText.textContent = text;
    // }

}