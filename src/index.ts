import './scss/styles.scss';
import { Api } from "./components/base/api";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { Cards } from './components/model/Cards';
import { LarekAPI } from './components/base/LarekAPI';
import { CardView } from './components/view/CardView';
import { IBasketData, ICard, IOrder, TCardBasket, TCardCatalog, TInitCards, TOrderError, TOrderResult, TPayment } from './types';
import { PageView } from './components/view/PageView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from './components/view/ModalView';
import { Basket } from './components/model/Basket';
import { BasketView } from './components/view/BasketView';
import { Order } from './components/model/Order';
import { OrderInfoView } from './components/view/OrderInfoView';
import { OrderSuccessView } from './components/view/OrderSuccessView';


const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const basketTemplate = cloneTemplate('#basket');
const contactsTemplate = cloneTemplate('#contacts');
const orderTemplate = cloneTemplate('#order');
const successTemplate = cloneTemplate('#success');

const cards = new Cards(events);
const basket = new Basket(events);
const order = new Order(events);

const pageView = new PageView(ensureElement('.page__wrapper'), events);
const modalView = new ModalView(ensureElement('#modal-container'), events);
const basketView = new BasketView(basketTemplate, events);
const orderView = new OrderInfoView(orderTemplate, events);
const contactsView = new OrderInfoView(contactsTemplate, events);
const orderSuccessView = new OrderSuccessView(successTemplate, events);

events.onAll((event) => {
    console.log(event.eventName, event.data);
});

// инициализация
api.getProductList().then(initObject => {
    cards.list = initObject;

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
    const newCardElement = newCardView.render(cards.getCard(event.data.id));

    modalView.render({
        content: newCardElement
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
        return newCardView.render(cards.getCard(item.id));
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
    basketView.render({
        cost: basket.getCost()
    });

    modalView.render({
        content: basketTemplate
    });
})


events.on('basket:submit', () => {
    order.setItems(basket.getProductIdList());
    order.setTotal(basket.getCost());
    // order.validateOrder();
    modalView.render({
        content: orderTemplate
    });
})



// ордер
events.on('order-form:payment', (event: { payment: TPayment }) => {
    order.setPayment(event.payment);
})


events.on('order-form-address:input', (event: { value: string }) => {
    order.setAddress(event.value);
})


events.on('order-data:change', (errors: Partial<IOrder>) => {
    const { payment, address } = errors;

    orderView.render({
        error: getErrorMessage({ payment, address })
    });
})

events.on('order-form:submit', () => {
    const { email, phone } = order.getOrderError();

    contactsView.render({
        error: getErrorMessage({ email, phone })
    });

    modalView.render({
        content: contactsTemplate
    });
})



// contacts
events.on('contacts-form-email:input', (event: { value: string }) => {
    order.setEmail(event.value);
})


events.on('contacts-form-phone:input', (event: { value: string }) => {
    order.setPhone(event.value);
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
            orderSuccessView.render({
                description: `Списано ${data.total} синапсов`
            });

            modalView.render({
                content: successTemplate
            });

            orderView.reset();
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

