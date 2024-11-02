import { appEvents } from "../../utils/constants";
import { ensureAllElements, isEmpty } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../common/Form";
import { IOrderForm } from "./ContactsForm";


export class OrderForm extends Form<IOrderForm> {
    protected _orderButtons: HTMLButtonElement[];
    protected _address: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._orderButtons = ensureAllElements<HTMLButtonElement>('button[type=button]', container);
        this._address = this.container.elements.namedItem('address') as HTMLInputElement;
        
        this._orderButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this.emitChanges(appEvents.orderPaymentSelect, { payment: button.name });
            })
        })
    }

    set payment(value: string) {
        this._orderButtons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === value)
        });
    }

    set address(value: string) {
        this._address.value = value;
    }

}