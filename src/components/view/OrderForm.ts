import { appEvents } from "../../utils/constants";
import { ensureAllElements, isEmpty } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";
import { IOrderForm } from "./ContactsForm";


export class OrderForm extends Form<IOrderForm> {
    protected _orderButtons: HTMLButtonElement[];
    protected _payment: string;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._orderButtons = ensureAllElements<HTMLButtonElement>('button[type=button]', container);

        this._orderButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this._payment = button.name;
                this._orderButtons.forEach(button => {
                    this.toggleClass(button, 'button_alt-active', button.name === this._payment);
                });

                this.emitChanges(appEvents.orderPaymentSelect, { payment: this._payment });
            })
        })
    }

    set payment(value: string) {
        this._payment = value;

        if (isEmpty(value))
            this._orderButtons.forEach(button => {
                this.toggleClass(button, 'button_alt-active', false)
            });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

}