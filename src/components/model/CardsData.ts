import { ICard, ICardsData } from "../../types";
import { appEvents } from "../../utils/constants";
import { Data } from "../base/Data";

export class CardsData extends Data  implements ICardsData {
    protected _list: ICard[] = [];

    setCards(cards: ICard[]) {
        this._list = cards;
        this.dataChanged(appEvents.cardsListChanged);
    }

    getCard(id: string) {
        return this._list.find(card => card.id === id)!;
    }

    getCards(): ICard[] {
        return this._list.map((item) => {
            return {
                id: item.id,
                title: item.title,
                price: item.price,
                category: item.category,
                description: item.description,
                image: item.image
            }
        })
    }
}
