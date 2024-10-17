import { IEvents } from "../base/events";
// import { IOrderForm } from "../view/FormOrderView";
import { View } from "./View";

export interface IOrderForm {
    valid: boolean;
    error: string;
}

export class FormView extends View<IOrderForm> {
    protected _submitButton: HTMLButtonElement;
    protected _error: HTMLElement;
    protected containerName: string;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.containerName = this.container.getAttribute('name');
        this._submitButton = this.container.querySelector('button[type=submit]');
        this._error = this.container.querySelector('.form__errors');

        this.container.addEventListener('input', (event) => {
            const input = (event.target as HTMLInputElement);
            this.emitChanges(`${this.containerName}-${input.name}:input`, { data: input.value })
        });

        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            // this.reset();
            this.emitChanges(`${this.containerName}:submit`);
        });

    }

    set valid(value: boolean) {
        // this._isValid = value;
        // this.toggleDisabledAttribute(this._submitButton, this._isValid);
        this._submitButton.toggleAttribute('disabled', !value);
    }

    set error(error: string) {
        if (error) this.showInputError(error);
        else this.hideInputError();
    }

    private showInputError(errorMessage: string) {
        this._error.textContent = errorMessage;
    }

    private hideInputError() {
        this._error.textContent = '';
    }

    //TODO: доделать сброс формы
    reset() {
        (this.container as HTMLFormElement).reset();
        // this._orderButtons.forEach(button => button.classList.remove('button_alt-active'))
        this.valid = false;
    }
}