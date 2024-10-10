import { ICard } from "../types";
import { CDN_URL } from "../utils/constants";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";
import { Component } from "./base/Component";


export class Card extends Component<ICard> {
    // protected container: HTMLElement;
    protected events: IEvents;

    protected cardCategory?: HTMLSpanElement;
    protected cardTitle: HTMLTitleElement;
    protected cardImage?: HTMLImageElement;
    protected cardPrice: HTMLSpanElement;
    protected cardText?: HTMLParagraphElement;
    protected button: HTMLButtonElement;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        // this.element = cloneTemplate(template);
        this.events = events;

        this.cardCategory = this.container.querySelector('.card__category');
        this.cardTitle = this.container.querySelector('.card__title');
        this.cardImage = this.container.querySelector('.card__image');
        this.cardPrice = this.container.querySelector('.card__price');
        this.cardText = this.container.querySelector('.card__text');
        this.button = this.container.querySelector('.card__button');

        this.button?.addEventListener('click', () => {
            this.events.emit('card-basket:added', { card: this });
        });

        this.container.addEventListener('click', () => {
            this.events.emit('card-preview:changed', { card: this });
        });
    }

    set category(category: string) {
        if (this.cardCategory)
            this.cardCategory.textContent = category;
    }

    set title(title: string) {
        this.cardTitle.textContent = title;
    }

    get title(): string {
        return this.cardTitle.textContent || '';
    }

    set image(address: string) {
        if (this.cardImage)
            this.cardImage.src = CDN_URL + address;
    }

    set price(price: string) {
        this.cardPrice.textContent = price ?? "Бесценно";
    }

    set description(text: string) {
        if (this.cardText)
            this.cardText.textContent = text;
    }

    // set button(text: string) {
    //     if (this.cardText)
    //         this.cardText.textContent = text;
    // }

    render(data: Partial<ICard>) {
        // console.log(data);

        Object.assign(this, data);

        return this.container;
    }

}