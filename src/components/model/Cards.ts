import { ICard, ICardsData } from "../../types";
import { IEvents } from "../base/events";

export class Cards implements ICardsData {
    protected _cardsList: ICard[];
    protected _selectedCard: string;

    constructor(protected events: IEvents) {
    }

    set cardsList(cards: ICard[]) {
        this._cardsList = cards;
        this.events.emit('cardsList:change');
    }

    get cardsList() {
        return this._cardsList;
    }

    set selectedCard(id: string) {
        this._selectedCard = id;
        this.events.emit('selected-card:change');
    }

    get selectedCard() {
        return this._selectedCard;
    }

    getCard(id: string): ICard {
        return this._cardsList.find(card => card.id === id);
    }

    setCardStatus(id: string, value: boolean){
        this.getCard(id).isInBasket = value;
    }

}