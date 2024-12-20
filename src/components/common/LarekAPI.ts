import { ICard, TInitCards, TOrderResponse, IOrder } from "../../types";
import { Api } from "../base/api";


export interface ILarekAPI {
    getProductList: () => Promise<ICard[]>;
    placeOrder: (order: IOrder) => Promise<TOrderResponse>;
}

export class LarekAPI extends Api implements ILarekAPI {
    constructor(protected cdn: string, baseUrl: string, option?: object) {
        super(baseUrl, option)
    }

    getProductList(): Promise<ICard[]> {
        return this.get('/product/')
            .then((data: TInitCards) =>
                data.items.map(item => ({
                    ...item,
                    image: this.cdn + item.image
                }))
            );
    }

    placeOrder(order: IOrder): Promise<TOrderResponse> {
        return this.post('/order', order, 'POST')
            .then((result: TOrderResponse) => result);
    }

}