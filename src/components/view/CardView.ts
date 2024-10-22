import { ICard } from "../../types";
import { CategoryColor } from "../../utils/constants";
import { IEvents } from "../base/events";
import { View } from "../common/View";


export class CardView<T> extends View<T> {
    protected _cardCategory: HTMLSpanElement;
    protected _cardTitle: HTMLTitleElement;
    protected _cardImage: HTMLImageElement;
    protected _cardPrice: HTMLSpanElement;
    protected _cardText: HTMLParagraphElement;
    protected _button: HTMLButtonElement;
    protected _index: HTMLElement;
    protected _isSelected: boolean;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);

        this._cardCategory = this.container.querySelector('.card__category');
        this._cardTitle = this.container.querySelector('.card__title');
        this._cardImage = this.container.querySelector('.card__image');
        this._cardPrice = this.container.querySelector('.card__price');
        this._cardText = this.container.querySelector('.card__text');
        this._button = this.container.querySelector('.card__button');
        this._index = this.container.querySelector('.basket__item-index');

        if (!this._button) {
            this.container.addEventListener('click', () => {
                this.emitChanges('card-preview:changed', { card: this });
            });
        }

        if (this._cardText) {
            this._button.addEventListener('click', () => {
                if (this._isSelected)
                    this.emitChanges('basket:remove', { card: this });
                else
                    this.emitChanges('basket:add', { card: this });

                this.emitChanges('card-preview-button:press')
            });
        }

        if (!this._cardCategory) {
            this._button.addEventListener('click', () => {
                this.emitChanges('basket:remove', { card: this });
            });
        }
    }

    set category(category: string) {
        this.setText(this._cardCategory, category);
        this.setColor(category)
    }

    set title(title: string) {
        this.setText(this._cardTitle, title);
    }

    set image(address: string) {
        this.setImage(this._cardImage, address);
    }

    set price(price: number) {
        this.setText(this._cardPrice, price ? String(price) + ' синапсов' : 'Бесценно');
        this.setDisabled(this._button, Number(price) === 0)
    }

    set description(value: string) {
        this.setText(this._cardText, value);
    }

    set index(value: number) {
        this.setText(this._index, value);
    }

    set canBuy(value: boolean) {
        this._isSelected = value;

        if (this._isSelected && this._cardCategory) {
            this.setText(this._button, 'Удалить');
        }
    }

    setColor(category: string) {
        const color = (Object.keys(CategoryColor) as (keyof typeof CategoryColor)[])
            .find(key => {
                return CategoryColor[key] === category
            });

        this._cardCategory.classList.add(`card__category_${color}`);
    }

}

