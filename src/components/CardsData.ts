import { ICard, ICardsData } from "../types";
import { IEvents } from "./base/events";

export class CardsData implements ICardsData {
    protected _cardsList: ICard[];
    protected _selectedCard: string;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set cardsList(cards: ICard[]) {
        this._cardsList = cards;
        this.events.emit('cardsList:changed');
    }

    get cardsList() {
        return this._cardsList;
    }

    set selectedCard(id: string) {
        this._selectedCard = id;
        // this.events.emit('selected-card:changed');
    }

    get selectedCard() {
        return this._selectedCard;
    }

    getCard(id: string): ICard {
        return this.cardsList.find(card => card.id === id);
    }

}