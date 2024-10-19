import { ICard, ICardsData } from "../../types";
import { IEvents } from "../base/events";

export class Cards implements ICardsData {
    protected _list: ICard[];
    protected _selectedCard: string;

    constructor(protected events: IEvents) {
    }

    set list(cards: ICard[]) {
        this._list = cards;
        this.events.emit('cards:changed');
    }

    get list() {
        return this._list;
    }

    set selectedCard(id: string) {
        this._selectedCard = id;
        this.events.emit('selected-card:changed');
    }

    get selectedCard() {
        return this._selectedCard;
    }

    getCard(id: string): ICard {
        return this._list.find(card => card.id === id);
    }

    setCardBasketStatus(id: string, value: boolean){
        this.getCard(id).isInBasket = value;
    }

}