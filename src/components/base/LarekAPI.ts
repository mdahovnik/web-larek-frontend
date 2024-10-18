// import { IApi, ICard, TOrderResult, TInitCards } from "../../types";
import { ICard, TInitCards, TOrderResult, TOrderValidation } from "../../types";
import { Api } from "./api";


export interface ILarekAPI {
    getProductList: () => Promise<ICard[]>;
    placeOrder: (order: TOrderValidation) => Promise<TOrderResult>;
}

export class LarekAPI extends Api implements ILarekAPI {
    private _cdn: string;

    constructor(cdn: string, baseUrl: string, option?: object) {
        super(baseUrl, option)
        this._cdn = cdn;
    }

    getProductList(): Promise<ICard[]> {
        return this.get('/product/').then((data: TInitCards) =>
            data.items.map(item => ({
                ...item,
                image: this._cdn + item.image
            }))
        );
    }

    placeOrder(order: TOrderValidation): Promise<TOrderResult> {
        return this.post('/order', order, 'POST').then((result: TOrderResult) => result);
    }

}