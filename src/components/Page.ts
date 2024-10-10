import { ICard } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
    gallery: HTMLElement[];
    count: number;
}

export class Page extends Component<IPage> {
    // protected _container: HTMLElement;
    protected _basket: HTMLElement;
    protected _basketCount: HTMLElement;
    protected _gallery: HTMLElement;
    // protected _events: IEvents;
    // protected _modalContainer: HTMLElement

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        // this.container = container;
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._basketCount = container.querySelector('.header__basket-counter');
        this._gallery = container.querySelector('.gallery');

        // this._modalContainer = document.querySelector('#modal-container');
        // console.log(this._modalContainer);
        
        this._basket.addEventListener('click', () => {
            this.events.emit('basket: open');
            // this._modalContainer.classList.add('modal_active');
            // console.log(this._modalContainer);
        })
    }

    set gallery(elements: HTMLElement[]) {
        this._gallery.replaceChildren(...elements);
    }

    set count(data: number) {
        // console.log(this._basketCount);
        this._basketCount.textContent = String(data);
    }
    // render(data: Partial<IPage>) {
    //     Object.assign(this, data);
    //     return this.container;
    // }
}