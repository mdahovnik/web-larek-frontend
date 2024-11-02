import { appEvents } from "../../utils/constants";
import { IEvents } from "./events";

export abstract class Data {

    constructor( protected event: IEvents) {}

    protected dataChanged(eventName: appEvents, payload?: object) {
        this.event.emit(eventName, payload ?? {});
    }
}