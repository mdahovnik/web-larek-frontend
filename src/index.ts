import './scss/styles.scss';
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { CardsData } from './components/model/CardsData';
import { LarekAPI } from './components/base/LarekAPI';
import { CardView } from './components/view/CardView';
import { IBasketData, ICard, IOrder, TBasketCard, TGalleryCard, TPayment } from './types';
import { PageView } from './components/view/PageView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from './components/view/ModalView';
import { BasketData } from './components/model/BasketData';
import { BasketView, IBasketContent } from './components/view/BasketView';
import { OrderData } from './components/model/OrderData';
import { OrderView } from './components/view/OrderView';
import { SuccessView } from './components/view/SuccessView';
import { IOrderForm } from './components/view/ContactsView';


const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cards = new CardsData(events);
const basket = new BasketData(events);
const order = new OrderData(events);

const pageView = new PageView(ensureElement('.page'), events);
const modalView = new ModalView(ensureElement<HTMLElement>('#modal-container'), events);

const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderView = new OrderView(cloneTemplate(orderTemplate), events);
const contactsView = new OrderView(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);

events.onAll((event) => {
    console.log(event.eventName, event.data);
});

// загрузка данных
api.getProductList().then(data => {
    cards.list = data;
}).catch(err => console.error(err))


//рендеринг всех карточек товаров
events.on('cards-list:changed', () => {
    pageView.render({
        gallery: cards.getGalleryCards().map(cardData => {
            const newCardV = new CardView<TGalleryCard>(cloneTemplate('#card-catalog'), events);
            return newCardV.render({
                ...cardData
            });
        })
    });
})

/**
 * MAIN PAGE
 */
events.on('card-preview:changed', (event: { id: string }) => {
    const cardPreview = new CardView<ICard>(cloneTemplate('#card-preview'), events);
    const selectedCard = cards.getCard(event.id);

    modalView.render({
        content: cardPreview.render({
            ...selectedCard,
            canBuy: basket.contains(event.id)
        })
    });
})

events.on('card-button:press', () => {
    modalView.close();
})


/**
 * BASKET
 */
events.on('basket:add', (event: { id: string }) => {
    basket.add(cards.getCard(event.id));
})

events.on('basket:remove', (event: { id: string }) => {
    basket.remove(event.id);
})

events.on('basket-data:change', () => {
    basketView.render({
        cost: basket.getCost(),
        cards: basket.getBasketViewCards().map((item) => {
            const newCardView = new CardView<TBasketCard>(cloneTemplate('#card-basket'), events);
            return newCardView.render({
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
    order.clearData();
    orderView.reset();
    const { payment, address } = order.getOrderError();

    modalView.render({
        content: orderView.render({
            payment: '',
            valid: false,
            error: getErrorMessage({ payment, address })
        })
    });
})


/**
 * ORDER FORM
 */
events.on('order-form-payment:select', (event: { payment: TPayment }) => {
    order.setField('payment', event.payment);
})

events.on('order-form-address:input', (event: { value: string }) => {
    order.setField('address', event.value);
})

events.on('order-data:change', (errors: Partial<IOrder>) => {
    const { payment, address } = errors;
    orderView.render({
        valid: order.isOrderValid(),
        error: getErrorMessage({ payment, address })
    });
})

events.on('order-form:submit', () => {
    order.clearData();
    contactsView.reset();
    const { email, phone } = order.getOrderError();

    modalView.render({
        content: contactsView.render({
            valid: false,
            error: getErrorMessage({ email, phone })
        })
    });
})


/**
 * CONTACTS FORM
 */
events.on('contacts-form-email:input', (event: { value: string }) => {
    order.setField('email', event.value)
})

events.on('contacts-form-phone:input', (event: { value: string }) => {
    order.setField('phone', event.value);
})

events.on('contacts-data:change', (errors: Partial<IOrder>) => {
    const { email, phone } = errors;
    contactsView.render({
        valid: order.isContactsValid(),
        error: getErrorMessage({ email, phone })
    });
})


events.on('contacts-form:submit', () => {
    const orderData = Object.assign(
        order.order,
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

