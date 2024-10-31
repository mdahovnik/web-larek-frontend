import { ICard, ICardsData, TGalleryCard } from "../../types";
import { appEvents } from "../../utils/constants";
import { Data } from "../base/Data";

export class CardsData extends Data<ICardsData> {
    protected _list: ICard[] = [];
    protected _selectedCardId: string = '';

    setList(cards: ICard[]) {
        this._list = cards;
        this.dataChanged(appEvents.cardsListChanged);
    }

    setSelectedCard(id: string) {
        this._selectedCardId = id;
        this.dataChanged(appEvents.selectedCardChanged);
    }

    getSelectedCard() {
        return this._list.find(card => card.id === this._selectedCardId)!;
    }

    getCard(id: string) {
        return this._list.find(card => card.id === id)!;
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