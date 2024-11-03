import './scss/styles.scss';
import { API_URL, APP_EVENTS, CDN_URL, settings } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { CardsData } from './components/model/CardsData';
import { LarekAPI } from './components/base/LarekAPI';
import { Card, CardBasket, CardPreview } from './components/view/Card';
import { ICard, IOrder, TGalleryCard, TPayment } from './types';
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
        gallery: cards.getCards().map(item => {
            const cardCatalogType = new Card<TGalleryCard>(cloneTemplate('#card-catalog'), events, {
                onClick: () => { events.emit(APP_EVENTS.cardPreviewChanged, item) }
            });

            return cardCatalogType.render({
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
        cards: basket.getCards().map((item) => {
            const cardBasketType = new CardBasket(cloneTemplate('#card-basket'), events, {
                onClick: () => { events.emit(APP_EVENTS.basketRemove, item); }
            });
            return cardBasketType.render({
                index: item.index,
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
        content: basketView.render({
            cost: basket.getCost()
        })
    });
})

events.on(APP_EVENTS.basketSubmit, () => {
    order.clear();
    const { payment, address } = order.getOrderError();

    modalView.render({
        content: orderView.render({
            payment: order.getOrder().payment,
            address: order.getOrder().address,
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
events.on(APP_EVENTS.orderPaymentSelect, (data: { payment: TPayment }) => {
    order.setField('payment', data.payment);
})

events.on(APP_EVENTS.orderFormInput, (data: { field: keyof IOrder, value: string }) => {
    order.setField(data.field, data.value);
})

events.on(APP_EVENTS.orderDataChange, (errors: Partial<IOrder>) => {
    const { payment, address } = errors;
    const isOrderValid = !payment && !address;

    orderView.render({
        payment: order.getOrder().payment,
        address: order.getOrder().address,
        valid: isOrderValid,
        error: getErrorMessage({
            payment,
            address
        })
    });
})

events.on(APP_EVENTS.orderFormSubmit, () => {
    const { email, phone } = order.getOrderError();

    modalView.render({
        content: contactsView.render({
            email: order.getOrder().email,
            phone: order.getOrder().phone,
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
events.on(APP_EVENTS.contactsFormInput, (data: { field: keyof IOrder, value: string }) => {
    order.setField(data.field, data.value)
})

events.on(APP_EVENTS.orderDataChange, (errors: Partial<IOrder>) => {
    const { email, phone } = errors;
    const isContactsValid = !email && !phone;

    contactsView.render({
        email: order.getOrder().email,
        phone: order.getOrder().phone,
        valid: isContactsValid,
        error: getErrorMessage({
            email,
            phone
        })
    });
})

events.on(APP_EVENTS.contactsFormSubmit, () => {
    const orderData = Object.assign(
        { ...order.getOrder() },
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


