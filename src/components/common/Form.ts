import { IEvents } from "../base/events";
import { View } from "./View";


export class Form<T> extends View<T> {
    protected _error: HTMLElement;
    protected _valid: boolean;
    protected _submitButton: HTMLButtonElement;
    protected _containerName: string;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._submitButton = this.container.querySelector('button[type=submit]');
        this._containerName = this.container.getAttribute('name');
        this._error = this.container.querySelector('.form__errors');
        
        this.container.addEventListener('input', (event) => {
            const input = (event.target as HTMLInputElement);
            const name = input.name;
            const value = input.value;
            this.emitChanges(`${this._containerName}-${name}:input`, { value })
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

    set valid(isValid: boolean){
        this._valid = isValid;
        this._submitButton.toggleAttribute('disabled', !isValid);
    }

    private showInputError(errorMessage: string) {
        this._error.textContent = 'Укажите ' + errorMessage;
    }

    private hideInputError() {
        this._error.textContent = '';
    }

    reset() {
        (this.container as HTMLFormElement).reset();
    }
}