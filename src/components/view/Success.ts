import { IEvents } from "../base/events";
import { View } from "../base/View";


export interface IOrderSuccess {
    title: string;
    description: string;
}

export class Success extends View<IOrderSuccess> {
    protected _description: HTMLElement;
    protected _successButton: HTMLButtonElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);
        
        this._description = container.querySelector('.order-success__description')!;
        this._successButton = container.querySelector('.order-success__close')!;

        this._successButton?.addEventListener('click', () => {
            this.emitChanges(`${this.container.className}:submit`);
        })
    }

    set description(value: string) {
        this.setText(this._description, value);
    }
}
