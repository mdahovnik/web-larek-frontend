import './scss/styles.scss';
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { CardsData } from './components/model/CardsData';
import { LarekAPI } from './components/base/LarekAPI';
import { CardView } from './components/view/CardView';
import { IBasketData, ICard, IOrder, TPayment } from './types';
import { PageView } from './components/view/PageView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from './components/view/ModalView';
import { BasketData } from './components/model/BasketData';
import { BasketView } from './components/view/BasketView';
import { OrderData } from './components/model/OrderData';
import { OrderView } from './components/view/OrderView';
import { SuccessView } from './components/view/SuccessView';


const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cards = new CardsData(events);
const basket = new BasketData(events);
const order = new OrderData(events);

const pageView = new PageView(ensureElement('.page__wrapper'), events);
const modalView = new ModalView(ensureElement('#modal-container'), events);

const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderView = new OrderView(cloneTemplate(orderTemplate), events);
const contactsView = new OrderView(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);

events.onAll((event) => {
    console.log(event.eventName, event.data);
});

// инициализация
api.getProductList().then(data => {
    cards.list = data;

    const galleryItems = cards.list.map(cardData => {
        const newCardView = new CardView(cloneTemplate('#card-catalog'), events);
        return newCardView.render(cardData);
    });

    pageView.render({
        gallery: galleryItems
    });

}).catch(err => console.error(err))


//просмотр карточки
events.on('card-preview:changed', (event: { data: ICard }) => {
    const isInBasket = basket.contains(event.data);
    cards.setCardBasketStatus(event.data.id, isInBasket);

    const newCardView = new CardView(cloneTemplate('#card-preview'), events);

    modalView.render({
        content: newCardView.render(
            cards.getCard(event.data.id))
    });
})


//Корзина
events.on('basket:add', (event: { data: ICard }) => {
    basket.add(cards.getCard(event.data.id));
    cards.setCardBasketStatus(event.data.id, basket.contains(event.data));

    pageView.render({
        count: basket.getCount()
    });

    modalView.close();
})

events.on('basket:remove', (event: { data: ICard }) => {
    basket.remove(event.data);
    cards.setCardBasketStatus(event.data.id, basket.contains(event.data));

    if (basket.isEmpty()) modalView.close();
})

events.on('basket-data:change', (event: { data: IBasketData }) => {
    const cardsList = event.data.cards.map((item) => {
        const newCardView = new CardView(cloneTemplate('#card-basket'), events);
        return newCardView.render(
            cards.getCard(item.id)
        );
    });

    basketView.render({
        cost: basket.getCost(),
        cards: cardsList
    });

    pageView.render({
        count: basket.getCount()
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
    order.items = basket.getProductIdList();
    order.total = basket.getCost();

    order.clearOrderData();
    const { payment, address } = order.getOrderError();

    modalView.render({
        content: orderView.render({
            address: '',
            payment: '',
            error: getErrorMessage({ payment, address })
        })
    });
})


// ордер
events.on('order-form-payment:select', (event: { payment: TPayment }) => {
    order.setOrderField('payment', event.payment);
})

events.on('order-form-address:input', (event: { value: string }) => {
    order.setOrderField('address', event.value);
})

events.on('order-data:change', (errors: Partial<IOrder>) => {
    const { payment, address } = errors;

    orderView.render({
        error: getErrorMessage({ payment, address })
    });
})

events.on('order-form:submit', () => {
    order.clearContactsData();
    const { email, phone } = order.getOrderError();
    
    modalView.render({
        content: contactsView.render({
            email: '',
            phone: '',
            error: getErrorMessage({ email, phone })
        })
    });
})


// contacts
events.on('contacts-form-email:input', (event: { value: string }) => {
    order.setOrderField('email', event.value)
})

events.on('contacts-form-phone:input', (event: { value: string }) => {
    order.setOrderField('phone', event.value);
})

events.on('contacts-data:change', (errors: Partial<IOrder>) => {
    const { email, phone } = errors;

    contactsView.render({
        error: getErrorMessage({ email, phone })
    });
})

events.on('contacts-form:submit', () => {
    api.placeOrder(order.order)
        .then(data => {
            modalView.render({
                content: successView.render({
                    description: `Списано ${data.total} синапсов`
                })
            });

            order.status = true;
            basket.clear();
        }).catch(err => console.error(err))
})


// success
events.on('order-success:submit', () => {
    modalView.close();
})


function getErrorMessage(errors: Partial<IOrder>): string {
    return Object.values(errors)
        .filter(i => !!i)
        .join(' и ');
}

