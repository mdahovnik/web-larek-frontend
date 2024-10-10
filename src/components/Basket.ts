import { IBasket } from "../types";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

export class Basket extends Component<IBasket> {

    protected _basket: IBasket;
    protected _basketList: HTMLUListElement;
    protected _basketButton: HTMLButtonElement;
    protected _cost: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this._basketList = container.querySelector('.basket__list')
        this._basketButton = container.querySelector('.basket__button')
        this._cost = container.querySelector('.basket__price')
    }

    set cost(price: string) {
        this._cost.textContent = price;
    }


}