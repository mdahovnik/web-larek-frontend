// import { ICard } from "../types";
import { ensureElement } from "../../utils/utils";
import { View } from "../common/View";
import { IEvents } from "../base/events";

interface IPage {
    gallery?: HTMLElement[];
    count?: number;
}

export class PageView extends View<IPage> {
    protected _basket: HTMLElement;
    protected _basketCount: HTMLElement;
    protected _gallery: HTMLElement;

    constructor(protected container: HTMLElement, protected _events: IEvents) {
        super(container, _events);

        this._basket = ensureElement('.header__basket');
        this._basketCount = container.querySelector('.header__basket-counter');
        this._gallery = container.querySelector('.gallery');

        // this.setEmitOnElementClick('basket:open', this._basket);
        this._basket.addEventListener('click', () => {
            this.emitChanges('basket:open', { data: this });
        });
    }

    set gallery(elements: HTMLElement[]) {
        this._gallery.replaceChildren(...elements);
    }

    set count(data: number) {
        this._basketCount.textContent = String(data);
    }

    
}