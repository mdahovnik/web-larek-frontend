import { IEvents } from "../base/events";
import { FormView } from "../common/FormView";


export class OrderInfoView extends FormView {

    protected _orderButtons?: NodeListOf<HTMLButtonElement>;
    protected _inputs: NodeListOf<HTMLInputElement>;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._orderButtons = this.container.querySelectorAll('button[type=button]');
        this._inputs = this.container.querySelectorAll<HTMLInputElement>('.form__input');

        this._orderButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this.togglePaymentButton(button.name);
                this.emitChanges(`${this.containerName}:payment`, { data: button.name });
            })
        })
    }

//TODO: сделать сброс кнопок после размещения ордера
    private togglePaymentButton(value: string) {
        this._orderButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value)
        });
    }


}