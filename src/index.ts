import './scss/styles.scss';
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { CardsData } from './components/model/CardsData';
import { LarekAPI } from './components/base/LarekAPI';
import { Card } from './components/view/Card';
import { ICard, IOrder, TBasketCard, TGalleryCard, TPayment } from './types';
import { Page } from './components/view/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/view/Modal';
import { BasketData } from './components/model/BasketData';
import { Basket } from './components/view/Basket';
import { OrderData } from './components/model/OrderData';
import { OrderForm } from './components/view/OrderForm';
import { Success } from './components/view/Success';


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
const contactsView = new OrderForm(cloneTemplate(contactsTemplate), events);
const successView = new Success(cloneTemplate(successTemplate), events);

events.onAll((event) => {
    console.log(event.eventName, event.data);
});

/**
 * INITIAL LOAD
 */
api.getProductList().then(data => {
    cards.list = data;
}).catch(err => console.error(err))


/**
 * GALLERY
 */
events.on('cards-list:changed', () => {
    pageView.render({
        gallery: cards.getGalleryCards().map(item => {
            const cardCatalog = new Card<TGalleryCard>(cloneTemplate('#card-catalog'), events, {
                onClick: () => {
                    events.emit('card-preview:changed', item)
                }
            });
            return cardCatalog.render({
                ...item
            });
        })
    });
})


/**
 * CARD PREVIEW
 */
events.on('card-preview:changed', (item: TGalleryCard) => {
    const isInBasket = basket.contains(item.id);
    const selectedCard = cards.getCard(item.id);
    const cardPreview = new Card<ICard>(cloneTemplate('#card-preview'), events, {
        onClick: () => {
            if (isInBasket)
                events.emit('basket:remove', item);
            else
                events.emit('basket:add', item);

            modalView.close();
        }
    });

    modalView.render({
        content: cardPreview.render({
            ...selectedCard,
            canBuy: isInBasket
        })
    });
})


/**
 * BASKET
 */
events.on('basket:add', (item: TGalleryCard) => {
    basket.add(cards.getCard(item.id));
})

events.on('basket:remove', (item: TBasketCard) => {
    basket.remove(item.id);
})

events.on('basket-data:change', () => {
    basketView.render({
        cost: basket.getCost(),
        cards: basket.getBasketViewCards().map((item) => {
            const cardBasket = new Card<TBasketCard>(cloneTemplate('#card-basket'), events, {
                onClick: () => {
                    events.emit('basket:remove', item);
                }
            });
            return cardBasket.render({
                ...item
            });
        })
    });

    pageView.render({
        count: basket.getQuantity()
    });
})

events.on('basket:open', () => {
    modalView.render({
        content: basketView.render({
            cost: basket.getCost()
        })
    });
})

events.on('basket:submit', () => {
    order.clear();
    orderView.reset();
    const { payment, address } = order.getOrderError();

    modalView.render({
        content: orderView.render({
            payment: '',
            valid: false,
            error: getErrorMessage({
                payment,
                address
            })
        })
    });
})


/**
 * ORDER FORM
 */
events.on('order-payment:select', (data: { payment: TPayment }) => {
    order.setField('payment', data.payment);
})

events.on('order-form:input', (data: { field: keyof IOrder, value: string }) => {
    order.setField(data.field, data.value);
})

events.on('order-data:change', (errors: Partial<IOrder>) => {
    const { payment, address } = errors;

    orderView.render({
        valid: order.isOrderValid(),
        error: getErrorMessage({
            payment,
            address
        })
    });
})

events.on('order-form:submit', () => {
    contactsView.reset();
    const { email, phone } = order.getOrderError();

    modalView.render({
        content: contactsView.render({
            valid: false,
            error: getErrorMessage({
                email,
                phone
            })
        })
    });
})


/**
 * CONTACTS FORM
 */
events.on('contacts-form:input', (data: { field: keyof IOrder, value: string }) => {
    order.setField(data.field, data.value)
})

events.on('contacts-data:change', (errors: Partial<IOrder>) => {
    const { email, phone } = errors;

    contactsView.render({
        valid: order.isContactsValid(),
        error: getErrorMessage({
            email,
            phone
        })
    });
})

events.on('contacts-form:submit', () => {
    const orderData = Object.assign(
        { ...order.order },
        {
            total: basket.getCost(),
            items: basket.getIdList()
        });

    api.placeOrder(orderData)
        .then(data => {
            modalView.render({
                content: successView.render({
                    description: `Списано ${data.total} синапсов`
                })
            });
            basket.clear();
        }).catch(err => console.error(err))
})


/**
 * ORDER STATUS
 */
events.on('order-success:submit', () => {
    modalView.close();
})


/**
 * MODAL
 */
events.on('modal:open', () => {
    pageView.locked = true;
});

events.on('modal:close', () => {
    pageView.locked = false;
});

function getErrorMessage(errors: Partial<IOrder>): string {
    return Object.values(errors)
        .filter(i => !!i)
        .join(' и ');
}


