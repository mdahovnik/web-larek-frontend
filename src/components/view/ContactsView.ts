import { IEvents } from "../base/events";
import { View } from "../common/View";

export interface IOrderForm {
    error: string;
    payment: string;
    address: string;
    email: string;
    phone: string;
}

export class ContactsView extends View<IOrderForm> {
    protected _submitButton: HTMLButtonElement;
    protected _error: HTMLElement;
    protected _valid: boolean;
    protected _containerName: string;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        this._containerName = this.container.getAttribute('name');
        this._submitButton = this.container.querySelector('button[type=submit]');
        this._error = this.container.querySelector('.form__errors');

        this.container.addEventListener('input', (event) => {
            const input = (event.target as HTMLInputElement);
            const name = input.name;
            const value = input.value;
            this.emitChanges(`${this._containerName}-${name}:input`, { value })
        });

        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            //TODO: сброс формы
            // this.reset();
            this.emitChanges(`${this._containerName}:submit`);
        });

    }

    set error(error: string) {
        if (error)
            this.showInputError(error);
        else
            this.hideInputError();

        this._submitButton.toggleAttribute('disabled', !(error.length === 0));
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }


    private showInputError(errorMessage: string) {
        this._error.textContent = 'Укажите ' + errorMessage;
    }

    private hideInputError() {
        this._error.textContent = '';
    }

    //TODO: доделать сброс формы
    reset() {
        (this.container as HTMLFormElement).reset();
        // this._orderButtons.forEach(button => button.classList.remove('button_alt-active'))
        // this.valid = false;
    }
}