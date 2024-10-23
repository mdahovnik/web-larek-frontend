// import { ICard } from "../types";
import { ensureElement } from "../../utils/utils";
import { View } from "../common/View";
import { IEvents } from "../base/events";

interface IPage {
    gallery: HTMLElement[];
    count: number;
    locked: boolean;
}

export class PageView extends View<IPage> {
    protected _basket: HTMLElement;
    protected _basketCount: HTMLElement;
    protected _gallery: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(protected container: HTMLElement, protected _events: IEvents) {
        super(container, _events);

        this._basket = container.querySelector('.header__basket');
        this._wrapper = container.querySelector('.page__wrapper');
        this._basketCount = container.querySelector('.header__basket-counter');
        this._gallery = container.querySelector('.gallery');

        this._basket.addEventListener('click', () => {
            this.emitChanges('basket:open', { data: this });
        });
    }

    set gallery(elements: HTMLElement[]) {
        this._gallery.replaceChildren(...elements);
    }

    set count(value: number) {
        this.setText(this._basketCount, value);
    }

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }

}