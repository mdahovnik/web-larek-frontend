import { APP_EVENTS } from "../../utils/constants";
import { IEvents } from "./events";

export abstract class Data {

    constructor( protected event: IEvents) {}

    protected dataChanged(eventName: APP_EVENTS, payload?: object) {
        this.event.emit(eventName, payload ?? {});
    }
}