import { IOrderData, TOrderResult, TOrderProducts, TOrderValidation, TPayment } from "../../types";
import { isEmpty } from "../../utils/utils";
import { IEvents } from "../base/events";


export class OrderData implements IOrderData {

    private _payment: TPayment;
    private _email: string;
    private _phone: string;
    private _address: string;
    private _total: number;
    private _items: TOrderProducts[];
    protected _status: TOrderResult;

    // isOrderValid: boolean;

    constructor(protected events: IEvents) {

    }

    // public get payment(): string {
    //     return this._payment;
    // }

    public set payment(value: TPayment) {
        this._payment = value;
        this.orderDataChanged();
        // this.events.emit('order-data-payment:changed', {data: this});
    }

    // public get address(): string {
    //     return this._address;
    // }

    public set address(value: string) {
        this._address = value;
        this.orderDataChanged();
    }

    public get total(): number {
        return this._total;
    }

    public set total(value: number) {
        this._total = value;
        this.orderDataChanged();
    }

    public get orderProducts(): TOrderProducts[] {
        return this._items;
    }

    public set orderProducts(value: TOrderProducts[]) {
        this._items = value;
        this.orderDataChanged();
    }
    
    // public get email(): string {
    //     return this._email;
    // }

    public set email(value: string) {
        this._email = value;
        this.orderDataChanged();
    }

    // public get phone(): string {
    //     return this._phone;
    // }

    public set phone(value: string) {
        this._phone = value;
        this.orderDataChanged();
    }
    
    set status(response: TOrderResult) {
        this._status = response;
    }

    isOrderValid(): boolean{
        return !isEmpty(this._payment) && !isEmpty(this._address);
    }

    isContactsValid():boolean{
        return !isEmpty(this._email) && !isEmpty(this._phone);
    }

    getOrderStatus(): boolean {
        return this._status.id !== null;
    }

    clear() {
        // this._order = null;
    }

    // isOrderValid(obj: Record<keyof TOrderValidation, string>): boolean {
    //     return Object.values(obj).some(item => item === '');
    // }

    protected orderDataChanged() {
        this.events.emit('order-data:change', { data: this })
    }

    // sendOrder(order: IOrder): void {
    //     throw new Error("Method not implemented.");
    // }

}