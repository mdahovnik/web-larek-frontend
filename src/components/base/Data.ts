import { appEvents } from "../../utils/constants";
import { IEvents } from "./events";

export abstract class Data<T> {

    constructor(data: Partial<T>, protected event: IEvents) {
        Object.assign(this, data);
    }

    protected dataChanged(eventName: appEvents, payload?: object) {
        this.event.emit(eventName, payload ?? {});
    }
}