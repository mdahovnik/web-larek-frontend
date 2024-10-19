import { IEvents } from "../base/events";
import { FormView } from "../common/FormView";


export class OrderInfoView extends FormView {

    protected _orderButtons?: NodeListOf<HTMLButtonElement>;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._orderButtons = this.container.querySelectorAll('button[type=button]');
        this._orderButtons?.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name;
                this.togglePaymentButton(payment);
                this.emitChanges(`${this.containerName}:payment`, { payment });
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