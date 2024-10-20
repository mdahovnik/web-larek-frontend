import { IEvents } from "../base/events";
import { View } from "../common/View";


export interface IOrderSuccess {
    title: string;
    description: string;
}

export class SuccessView extends View<IOrderSuccess> {

    // protected _title: HTMLElement;
    protected _description: HTMLElement;
    protected _successButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        // this._title = container.querySelector('.order-success__title');
        this._description = container.querySelector('.order-success__description');
        this._successButton = container.querySelector('.order-success__close');

        this._successButton?.addEventListener('click', () => {
            this.events.emit(`${this.container.className}:submit`);
        })

    }


    // set title(value: string) {
    //     this._title.textContent = value;
    // }


    set description(value: string) {
        this._description.textContent = value;
    }
}
