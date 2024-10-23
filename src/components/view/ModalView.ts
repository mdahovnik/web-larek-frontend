import { View } from "../base/View";
import { IEvents } from "../base/events";

interface IModalContent {
    content: HTMLElement;
    cost: number;
}

export class ModalView extends View<IModalContent> {
    protected _closeBtn: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this._closeBtn = container.querySelector('.modal__close');
        this._content = container.querySelector('.modal__content');

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

    open() {
        this.container.classList.add('modal_active');
        document.addEventListener('keyup', this.handleEscUp);
        this.emitChanges('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        document.removeEventListener('keyup', this.handleEscUp);
        this.emitChanges('modal:close');
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