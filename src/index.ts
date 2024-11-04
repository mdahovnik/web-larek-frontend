import './scss/styles.scss';
import { API_URL, APP_EVENTS, CDN_URL, settings } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { CardsData } from './components/model/CardsData';
import { LarekAPI } from './components/common/LarekAPI';
import { CardBasket, CardGallery, CardPreview } from './components/view/Card';
import { ICard, IOrder } from './types';
import { Page } from './components/view/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/view/Modal';
import { BasketData } from './components/model/BasketData';
import { Basket } from './components/view/Basket';
import { OrderData } from './components/model/OrderData';
import { OrderForm } from './components/view/OrderForm';
import { Success } from './components/view/Success';
import { ContactsForm } from './components/view/ContactsForm';


const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cards = new CardsData(events);
const basket = new BasketData(events);
const order = new OrderData(events);

const pageView = new Page(ensureElement('.page'), events);
const modalView = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsView = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);

events.onAll((event) => {
    console.log(event.eventName, event.data);
});


/**
 * INITIAL LOAD
 */
api.getProductList().then(data => {
    cards.setCards(data);
}).catch(console.error)


/**
 * GALLERY
 */
events.on(APP_EVENTS.cardsListChanged, () => {
    pageView.render({
        content: cards.getCards().map(item => {
            const cardGalleryType = new CardGallery(cloneTemplate('#card-catalog'), events, {
                onClick: () => { events.emit(APP_EVENTS.cardPreviewChanged, item) }
            });

            return cardGalleryType.render({
                category: item.category,
                image: item.image,
                price: item.price,
                title: item.title
            });
        })
    });
})


/**
 * CARD PREVIEW
 */
events.on(APP_EVENTS.cardPreviewChanged, (item: ICard) => {
    const isInBasket = basket.contains(item.id);
    const cardPreviewType = new CardPreview(cloneTemplate('#card-preview'), events, {
        onClick: () => {
            if (isInBasket)
                events.emit(APP_EVENTS.basketRemove, item);
            else
                events.emit(APP_EVENTS.basketAdd, item);

            modalView.close();
        }
    });

    modalView.render({
        content: cardPreviewType.render({
            category: item.category,
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            canBuy: isInBasket
        })
    });
})


/**
 * BASKET
 */
events.on(APP_EVENTS.basketAdd, (item: ICard) => {
    basket.add(item);
})

events.on(APP_EVENTS.basketRemove, (item: ICard) => {
    basket.remove(item.id);
})

events.on(APP_EVENTS.basketDataChange, () => {
    basketView.render({
        cost: basket.getCost(),
        cards: basket.getCards().map((item, index) => {
            const cardBasketType = new CardBasket(cloneTemplate('#card-basket'), events, {
                onClick: () => { events.emit(APP_EVENTS.basketRemove, item); }
            });
            return cardBasketType.render({
                index: index + 1,
                title: item.title,
                price: item.price
            });
        })
    });

    pageView.render({
        count: basket.getQuantity()
    });
})

events.on(APP_EVENTS.basketOpen, () => {
    modalView.render({
        content: basketView.render()
    });
})

events.on(APP_EVENTS.basketSubmit, () => {
    order.clear();
    const { payment, address } = order.getOrderError();

    modalView.render({
        content: orderViewRender(payment, address)
    });
})

/**
 * FORM
 */
events.on(APP_EVENTS.formChange, (data: { field: keyof IOrder, value: string }) => {
    order.setField(data.field, data.value);
})

/**
 * ORDER FORM
 */
events.on(APP_EVENTS.orderDataChange, (errors: Partial<IOrder>) => {
    const { payment, address, email, phone } = errors;

    orderViewRender(payment, address);
    contactsViewRender(email, phone);
})

events.on(APP_EVENTS.orderFormSubmit, () => {
    const { email, phone } = order.getOrderError();

    modalView.render({
        content: contactsViewRender(email, phone)
    });
})


/**
 * CONTACTS FORM
 */
events.on(APP_EVENTS.contactsFormSubmit, () => {
    const orderData = {
        ...order.getOrder(),
        total: basket.getCost(),
        items: basket.getIdList()
    };

    api.placeOrder(orderData)
        .then(data => {
            modalView.render({
                content: successView.render({
                    description: `Списано ${data.total} синапсов`
                })
            });
            basket.clear();
        }).catch(console.error)
})


/**
 * ORDER STATUS
 */
events.on(APP_EVENTS.orderSuccessSubmit, () => {
    modalView.close();
})


/**
 * MODAL
 */
events.on(APP_EVENTS.modalOpen, () => {
    pageView.locked = true;
});

events.on(APP_EVENTS.modalClose, () => {
    pageView.locked = false;
});

function getErrorMessage(errors: Partial<IOrder>): string {
    return Object.values(errors)
        .filter(i => !!i)
        .join(' и ');
}

function orderViewRender(payment: string, address: string): HTMLElement {
    return orderView.render({
        payment: order.getOrder().payment,
        address: order.getOrder().address,
        valid: !payment && !address,
        error: getErrorMessage({
            payment,
            address
        })
    });
}

function contactsViewRender(email: string, phone: string): HTMLElement {
    return contactsView.render({
        email: order.getOrder().email,
        phone: order.getOrder().phone,
        valid: !email && !phone,
        error: getErrorMessage({
            email,
            phone
        })
    });
}

