import { IOrderData, IOrder, TOrderError } from "../../types";
import { appEvents } from "../../utils/constants";
import { Data } from "../base/Data";

export class OrderData extends Data<IOrderData> {
    protected _orderErrors: TOrderError = {};
    protected _order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    }

    getOrder() {
        const order = { ...this._order }
        return Object.freeze(order);
    }

    setField(field: keyof IOrder, value: string) {
        this._order[field] = value;
        this.validateOrder();

        if (field === 'payment' || field === 'address')
            this.dataChanged(appEvents.orderDataChange, this._orderErrors);
        else
            this.dataChanged(appEvents.contactsDataChange, this._orderErrors);
    }

    clear() {
        (Object.keys(this._order) as (keyof typeof this._order)[])
            .forEach(key => { this._order[key] = '' });

        this.validateOrder();
    }

    getOrderError(): TOrderError {
        return this._orderErrors;
    }

    isOrderValid() {
        return this._order.payment.length !== 0
            && this._order.address.length !== 0;
    }

    isContactsValid() {
        return this._order.email.length !== 0
            && this._order.phone.length !== 0;
    }

    protected validateOrder() {
        const errors: typeof this._orderErrors = {};

        if (!this._order.payment) errors.payment = 'способ оплаты';
        if (!this._order.address) errors.address = 'адрес';
        if (!this._order.email) errors.email = 'email';
        if (!this._order.phone) errors.phone = 'телефон';

        this._orderErrors = errors;
    }

}