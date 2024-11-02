import { appEvents } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { View } from "../base/View";
import { IEvents } from "../base/events";

interface IModalContent {
    content: HTMLElement;
    cost: number;
}

export class Modal extends View<IModalContent> {
    protected _closeBtn: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._content = ensureElement('.modal__content', container);
        this._closeBtn = ensureElement<HTMLButtonElement>('.modal__close', container);

        this._closeBtn.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (evt) => {
            evt.stopPropagation();
        });

        this.handleEscUp = this.handleEscUp.bind(this);
    }

    set content(content: HTMLElement) {
        this._content.replaceChildren(content);
    }

    protected open() {
        this.toggleClass(this.container, 'modal_active', true);
        document.addEventListener('keyup', this.handleEscUp);
        this.emitChanges(appEvents.modalOpen);
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
        this.content = null;
        document.removeEventListener('keyup', this.handleEscUp);
        this.emitChanges(appEvents.modalClose);
    }

    protected handleEscUp(event: KeyboardEvent) {
        if (event.key === 'Escape')
            this.close();
    }

    render(data?: Partial<IModalContent>): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}