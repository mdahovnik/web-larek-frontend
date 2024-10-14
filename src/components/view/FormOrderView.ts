import { TFormOrder } from "../../types";
import { ensureAllElements, isEmpty } from "../../utils/utils";
import { IEvents } from "../base/events";
import { View } from "../common/View";

export interface IOrderForm {
    valid: boolean;
    error: string;
}

export class OrderFormView extends View<IOrderForm> {

    protected _orderButtons?: NodeListOf<HTMLButtonElement>;
    protected _inputFields: NodeListOf<HTMLInputElement>;
    protected _submitButton: HTMLButtonElement;
    protected _error: HTMLElement;
    protected _isValid: boolean;
    protected containerName: string;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.containerName = this.container.getAttribute('name');
        this._orderButtons = this.container.querySelectorAll('button[type=button]');
        this._inputFields = this.container.querySelectorAll<HTMLInputElement>('.form__input');
        this._submitButton = this.container.querySelector('button[type=submit]');
        this._error = this.container.querySelector('.form__errors');

        this._orderButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this.togglePaymentButton(button.name);
                events.emit(`${this.containerName}:payment`, { data: button.name });
            })
        })

        this.container.addEventListener('input', (event) => {
            const inputValue = (event.target as HTMLInputElement).value;
            this.events.emit(`${this.containerName}:input`, { data: inputValue })
        });

        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.reset();
            this.events.emit(`${this.containerName}:submit`);
        });

    }

    set valid(value: boolean) {
        this._isValid = value;
        this.toggleDisabledAttribute(this._submitButton, this._isValid);
    }

    set error(validationString: string) {
        if (validationString)
            this.showInputError(validationString);
        else
            this.hideInputError();
    }

    private showInputError(errorMessage: string) {
        this._error.textContent = errorMessage;
    }

    private hideInputError() {
        this._error.textContent = '';
    }

    private togglePaymentButton(value: string) {
        this._orderButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value)
        });
    }

    // set isFormValid(value: boolean) {
    //     this._isValid = value;
    // }

    //TODO: унифицировать
    // getFormValues(): TFormOrder {
    //     return { payment: this._payment, address: this._address };
    // }

    //TODO: доделать
    reset() {
        (this.container as HTMLFormElement).reset();
        this._orderButtons.forEach(button => button.classList.remove('button_alt-active'))
        this.valid = false;
    }
}