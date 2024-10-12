import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IModalContent {
    content: HTMLElement;
}

export class Modal extends Component<IModalContent> {
    protected _closeBtn: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeBtn = container.querySelector('.modal__close');
        this._content = container.querySelector('.modal__content');

        this._closeBtn.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (evt) => {
            evt.stopPropagation();
        });

        this.events.on('modal:close', this.close.bind(this));
    }

    open() {
        this.container.classList.add('modal_active');
        this.container.classList.add('page__wrapper_locked');
        // console.log(this.container.classList.contains('modal_active'));
    }

    close() {
        
        this.container.classList.remove('modal_active');
        this.container.classList.remove('page__wrapper_locked');
        console.log(this.container.classList.contains('modal_active'));
        // this.content = null;
    }

    set content(content: HTMLElement) {
        // console.log(this._content);

        this._content.replaceChildren(content);
    }

    render(data?: Partial<IModalContent>): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }

}