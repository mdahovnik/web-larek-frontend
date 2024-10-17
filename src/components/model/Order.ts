import { IOrderData, TOrderResult, TOrderProducts, TOrderValidation, TPayment } from "../../types";
import { isEmpty } from "../../utils/utils";
import { IEvents } from "../base/events";


export class Order implements IOrderData {

    private _payment: TPayment;
    private _email: string;
    private _phone: string;
    private _address: string;
    private _total: number;
    private _items: TOrderProducts;
    protected _status: TOrderResult;

    // isOrderValid: boolean;

    constructor(protected events: IEvents) {

    }


    set payment(value: TPayment) {
        this._payment = value;
        this.eventsEmit('order-data:change');
        // this.events.emit('order-data-payment:changed', {data: this});
    }

    set address(value: string) {
        this._address = value;
        this.eventsEmit('order-data:change');
    }

    get total(): number {
        return this._total;
    }

    set total(value: number) {
        this._total = value;
        // this.eventsEmit();
    }

    get items(): TOrderProducts {
        return this._items;
    }

    set items(value: TOrderProducts) {
        this._items = value;
        // this.eventsEmit();
    }

    set email(value: string) {
        this._email = value;
        this.eventsEmit('contacts-data:change');
    }

    set phone(value: string) {
        this._phone = value;
        this.eventsEmit('contacts-data:change');
    }

    set status(response: TOrderResult) {
        this._status = response;
    }

    isOrderValid(): boolean {
        return !isEmpty(this._payment) && !isEmpty(this._address);
    }

    isContactsValid(): boolean {
        return !isEmpty(this._email) && !isEmpty(this._phone);
    }

    getOrderStatus(): boolean {
        return this._status.id !== null;
    }

    clear() {
        // this._order = null;
    }


    // getFullOrderData(obj: Record<keyof TOrderValidation, string>): TOrderValidation {
    getOrder(): TOrderValidation {
        return {
            'payment': this._payment,
            "email": this._email,
            "phone": this._phone,
            "address": this._address,
            "total" : this._total,
            'items': this._items
        }
    }

    protected eventsEmit(eventName: string) {
        this.events.emit(eventName, { data: this })
    }

    // sendOrder(order: IOrder): void {
    //     throw new Error("Method not implemented.");
    // }

}