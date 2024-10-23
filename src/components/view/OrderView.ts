import { isEmpty } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";
import { IOrderForm } from "./ContactsView";


export class OrderView extends Form<IOrderForm> {
    protected _orderButtons?: NodeListOf<HTMLButtonElement>;
    protected _payment: string;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._orderButtons = this.container.querySelectorAll('button[type=button]');

        this._orderButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this._payment = button.name;
                this._orderButtons.forEach(button => {
                    this.toggleClass(button, 'button_alt-active', button.name === this._payment);
                });

                this.emitChanges('order-payment:select', { payment: this._payment });
            })
        })
    }

    set payment(value: string) {
        this._payment = value;

        if (isEmpty(value))
            this._orderButtons.forEach(button => {
                button.classList.remove('button_alt-active')
            });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

}