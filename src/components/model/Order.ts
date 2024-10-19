import { IOrderData, TOrderResult, TPayment, IOrder, TOrderError } from "../../types";
import { isEmpty } from "../../utils/utils";
import { IEvents } from "../base/events";


export class Order implements IOrderData {

    protected _status: string;
    protected _orderErrors: TOrderError;

    protected _order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: []
    }

    constructor(protected events: IEvents) {
    }


    // setOrder(key: keyof IOrder, value: any) {
    //     this._order[key] = value;
    // }

    setPayment(value: TPayment) {
        this._order.payment = value;
        this.validateOrder();
        this.eventsEmit('order-data:change');
    }

    setAddress(value: string) {
        this._order.address = value;
        this.validateOrder();
        this.eventsEmit('order-data:change');
    }

    setTotal(value: number) {
        this._order.total = value;
        this.validateOrder();
        this.eventsEmit('order-data:change');

    }

    setItems(value: string[]) {
        this._order.items = value;
        // this.validateOrder();
        // this.eventsEmit('order-data:change');
    }

    setEmail(value: string) {
        this._order.email = value;
        this.validateOrder();
        this.eventsEmit('contacts-data:change');
    }

    setPhone(value: string) {
        this._order.phone = value;
        this.validateOrder();
        this.eventsEmit('contacts-data:change');
    }

    set status(value: string) {
        this._status = value;
    }

    isOrderValid(): boolean {
        return !isEmpty(this._order.payment) && !isEmpty(this._order.address);
    }

    isContactsValid(): boolean {
        return !isEmpty(this._order.email) && !isEmpty(this._order.phone);
    }

    getOrderStatus(): boolean {
        return this._status !== null;
    }

    clear() {
        // this._order = null;
    }

    // getFullOrderData(obj: Record<keyof TOrderValidation, string>): TOrderValidation {
    get order() {
        return this._order;
    }

    protected eventsEmit(eventName: string) {
        this.events.emit(eventName, this._orderErrors)
    }

    getOrderError() {
        return this._orderErrors;
    }

    // getError(field: keyof TOrderError) {
    //     return this._orderErrors[field];
    // }

    isValid() {
        return Object.keys(this._orderErrors).length === 0;
    }

    validateOrder() {
        const errors: typeof this._orderErrors = {};

        if (!this._order.payment) {
            errors.payment = 'способ оплаты';
        }
        if (!this._order.address) {
            errors.address = 'адрес';
        }
        if (!this._order.email) {
            errors.email = 'email';
        }
        if (!this._order.phone) {
            errors.phone = 'телефон';
        }

        this._orderErrors = errors;
        // this.events.emit('order-errors:change', this._orderErrors);

    }
}