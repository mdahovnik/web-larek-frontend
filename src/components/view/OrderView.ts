import { IEvents } from "../base/events";
import { ContactsView } from "./ContactsView";


export class OrderView extends ContactsView {

    protected _orderButtons?: NodeListOf<HTMLButtonElement>;
    protected _payment: string;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._orderButtons = this.container.querySelectorAll('button[type=button]');

        this._orderButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this._payment = button.name;
                // this.togglePaymentButton(payment);

                this._orderButtons.forEach(button => {
                    button.classList.toggle('button_alt-active', button.name === this._payment)
                });

                this.emitChanges(`${this._containerName}-payment:select`, { payment: this._payment });
            })
        })
    }

    set payment(value: string) {
        this._payment = value;

        if (!value) {
            this._orderButtons.forEach(button => {
                button.classList.toggle('button_alt-active', false)
            });
        }
    }

    //TODO: сделать сброс кнопок после размещения ордера
    private togglePaymentButton(value: string) {
        this._orderButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value)
        });
    }


}