import { IEvents } from "../base/events";

export abstract class View<T> {
    constructor(protected readonly container: HTMLElement, protected events: IEvents) {

    }
// TODO: унифицировать
    setEmitOnElementClick<T>(event: string, element: HTMLElement) {
        element.addEventListener('click', () => {
            this.events.emit(event, { data: this });
        });
    }

    toggleDisabledAttribute<T>(element: HTMLElement, value: T) {
        if (!value) {
            element?.setAttribute('disabled', 'disabled');
        }
        else element?.removeAttribute('disabled');
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}