import { IApi, ICard, TOrderResult, TInitCards } from "../types";
import { Api, ApiPostMethods } from "./base/api";


// export interface ILarekAPI {
//     getProductList: () => Promise<ICard[]>;
//     getOrderResult: (order: IOrder) => Promise<IOrderResult>;
// }

export class LarekAPI {
    private _baseApi: IApi;

    constructor(baseApi: IApi,) {
        this._baseApi = baseApi;
    }

    getProductList<T>(): Promise<T> {
        return this._baseApi.get<T>('/product/').then((obj: T) => obj);
    }

    placeOrder<T>(data: object): Promise<T> {
        return this._baseApi.post<T>('/order', data,'POST').then((obj: T) => obj);
    }

}