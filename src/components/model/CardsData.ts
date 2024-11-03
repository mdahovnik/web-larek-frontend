import { ICard, ICardsData, TBasketCard} from "../../types";
import { APP_EVENTS } from "../../utils/constants";
import { Data } from "../base/Data";

export class CardsData extends Data implements ICardsData {
    protected _list: ICard[] = [];

    setCards(cards: ICard[]) {
        this._list = cards;
        this.dataChanged(APP_EVENTS.cardsListChanged);
    }

    getCard(id: string) {
        return this._list.find(card => card.id === id)!;
    }

    getCards(): ICard[] {
        return this._list.map((item) => {
            return {
                ...item
            }
        })
    }

}