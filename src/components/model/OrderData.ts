import { IOrderData, IOrder, TOrderError } from "../../types";
import { appEvents } from "../../utils/constants";
import { Data } from "../base/Data";

export class OrderData extends Data<IOrderData> {
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
        this.dataChanged(appEvents.orderDataChange, this.getOrderError());
    }

    clear() {
        (Object.keys(this._order) as (keyof typeof this._order)[])
            .forEach(key => { this._order[key] = '' });

        this.validateOrder();
        this.dataChanged(appEvents.orderDataChange);
    }

    getOrderError(): TOrderError {
        return this.validateOrder();
    }

    protected validateOrder() {
        const errors: TOrderError = {};

        if (!this._order.payment) errors.payment = 'способ оплаты';
        if (!this._order.address) errors.address = 'адрес';
        if (!this._order.email) errors.email = 'email';
        if (!this._order.phone) errors.phone = 'телефон';

        return errors;
    }
}