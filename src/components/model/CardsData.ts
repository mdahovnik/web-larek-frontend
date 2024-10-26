import { ICard, ICardsData, TGalleryCard } from "../../types";
import { appEvents } from "../../utils/constants";
import { IEvents } from "../base/events";

export class CardsData implements ICardsData {
    protected _list: ICard[];
    protected _selectedCard: string;

    constructor(protected events: IEvents) {}

    set list(cards: ICard[]) {
        this._list = cards;
        this.events.emit(appEvents.cardsListChanged);
    }

    set selectedCard(id: string) {
        this._selectedCard = id;
        this.events.emit(appEvents.selectedCardChanged);
    }

    get selectedCard() {
        return this._selectedCard;
    }

    getCard(id: string): ICard {
        return this._list.find(card => card.id === id);
    }

    getGalleryCards(): TGalleryCard[] {
        return this._list.map((item) => {
            return {
                id: item.id,
                title: item.title,
                price: item.price,
                category: item.category,
                image: item.image
            }
        })
    }
}