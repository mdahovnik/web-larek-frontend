import { IEvents } from "../base/events";
import { Form } from "../common/Form";

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
    error: string;
    valid: boolean;
}

export class ContactsForm extends Form<IOrderForm> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._email = this.container.elements.namedItem('email') as HTMLInputElement;
        this._phone = this.container.elements.namedItem('phone') as HTMLInputElement
    }

    set email(value: string) {
        this._email.value = value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }

}