import { IOrderData, IOrder, TOrderError } from "../../types";
import { IEvents } from "../base/events";

//TODO: убрать не нужные методы
export class OrderData implements IOrderData {

    protected _status: boolean;
    protected _orderErrors: TOrderError;
    protected _total: number;
    protected _items: string[];

    protected _order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
    }

    constructor(protected events: IEvents) { }

    set total(value: number) {
        this._total = value;
        this.validateOrder();
    }

    set items(value: string[]) {
        this._items = value;
        this.validateOrder();
    }

    setOrderField(field: keyof IOrder, value: string) {
        this._order[field] = value;
        this.validateOrder();

        if (field === 'payment' || field === 'address')
            this.eventsEmit('order-data:change');
        else
            this.eventsEmit('contacts-data:change');
    }

    set status(value: boolean) {
        this._status = value;
        this.eventsEmit('order-status:change');
    }

    get status() {
        return this._status !== null;
    }

    clearOrderData() {
        this._order.payment = '';
        this._order.address = '';
        this.validateOrder();
    }

    clearContactsData() {
        this._order.email = '';
        this._order.phone = '';
        this.validateOrder();
    }

    getOrderError(): TOrderError {
        return this._orderErrors;
    }

    get order() {
        return Object.assign(this._order, { total: this._total, items: this._items });
    }

    protected validateOrder() {
        const errors: typeof this._orderErrors = {};

        if (!this._order.payment) errors.payment = 'способ оплаты';

        if (!this._order.address) errors.address = 'адрес';

        if (!this._order.email) errors.email = 'email';

        if (!this._order.phone) errors.phone = 'телефон';

        this._orderErrors = errors;
        // this.events.emit('order-errors:change', this._orderErrors);
    }

    protected eventsEmit(eventName: string) {
        this.events.emit(eventName, this._orderErrors)
    }
}