import { appEvents } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { View } from "../base/View";
import { IEvents } from "../base/events";

interface IPage {
    gallery: HTMLElement[];
    count: number;
    locked: boolean;
}

export class Page extends View<IPage> {
    protected _basketButton: HTMLElement;
    protected _basketCount: HTMLElement;
    protected _pageWrapper: HTMLElement;
    protected _gallery: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._basketButton = ensureElement('.header__basket', container);
        this._pageWrapper = ensureElement('.page__wrapper', container);
        this._gallery = ensureElement('.gallery', container);
        this._basketCount = container.querySelector('.header__basket-counter');

        this._basketButton.addEventListener('click', () => {
            this.emitChanges(appEvents.basketOpen, { data: this });
        });
    }

    set gallery(elements: HTMLElement[]) {
        this._gallery.replaceChildren(...elements);
    }

    set count(value: number) {
        this.setText(this._basketCount, value);
    }

    set locked(value: boolean) {
        this.toggleClass(this._pageWrapper, 'page__wrapper_locked', value);
    }

}