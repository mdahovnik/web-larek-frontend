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

export class ContactsView extends Form<IOrderForm> {
 
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

}