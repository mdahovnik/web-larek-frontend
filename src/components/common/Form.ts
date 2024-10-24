import { IEvents } from "../base/events";
import { View } from "../base/View";


export class Form<T> extends View<T> {
    protected _error: HTMLElement;
    protected _valid: boolean;
    protected _submitButton: HTMLButtonElement;
    protected _containerName: string;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._submitButton = container.querySelector('button[type=submit]');
        this._error = container.querySelector('.form__errors');
        this._containerName = container.getAttribute('name');

        this.container.addEventListener('input', (event) => {
            const input = (event.target as HTMLInputElement);
            const field = input.name;
            const value = input.value;
            this.emitChanges(`${this._containerName}:input`, { field, value })
        });

        this.container.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.emitChanges(`${this._containerName}:submit`);
        });
    }

    set error(error: string) {
        if (error) this.showInputError(error);
        else this.hideInputError();
    }

    set valid(isValid: boolean) {
        this._valid = isValid;
        this._submitButton.toggleAttribute('disabled', !isValid);
    }

    private showInputError(errorMessage: string) {
        this.setText(this._error, 'Укажите ' + errorMessage)
    }

    private hideInputError() {
        this.setText(this._error, '')
    }

    reset() {
        (this.container as HTMLFormElement).reset();
    }
}