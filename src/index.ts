import './scss/styles.scss';
import { Api } from "./components/base/api";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { Cards } from './components/model/Cards';
import { LarekAPI } from './components/LarekAPI';
import { CardView } from './components/view/CardView';
import { IBasketData, ICard, TCardBasket, TCardCatalog, TFormOrder, TInitCards, TOrderResult, TPayment } from './types';
import { PageView } from './components/view/PageView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from './components/view/ModalView';
import { Basket } from './components/model/Basket';
import { BasketView } from './components/view/BasketView';
import { Order } from './components/model/Order';
import { FormOrderView } from './components/view/FormOrderView';
import { OrderSuccessView } from './components/view/OrderSuccessView';


const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

const basketTemplate = cloneTemplate('#basket');
const contactsTemplate = cloneTemplate('#contacts');

const cards = new Cards(events);
const basket = new Basket(events);
const order = new Order(events);

const pageView = new PageView(ensureElement('.page__wrapper'), events);
const modalView = new ModalView(ensureElement('#modal-container'), events);
const basketView = new BasketView(basketTemplate, events);


events.onAll((event) => {
    console.log(event.eventName, event.data);
});

// инициализация
api.getProductList<TInitCards>().then(initObject => {
    cards.list = initObject.items;

    const galleryItems = cards.list.map(cardData => {
        const newCardView = new CardView(cloneTemplate('#card-catalog'), events);
        return newCardView.render(cardData);
    });

    pageView.render({ gallery: galleryItems });

}).catch(err => console.error(err))



//просмотр карточки
events.on('card-preview:select', (event: { data: ICard }) => {
    // cards.setCardStatus(event.data.id, basket.contains(event.data));
    const newCardView = new CardView(cloneTemplate('#card-preview'), events);
    const newCardElement = newCardView.render(cards.getCard(event.data.id));
    modalView.render({ content: newCardElement });
})



//Корзина
events.on('basket:add', (event: { data: ICard }) => {
    basket.add(cards.getCard(event.data.id));
    cards.setCardBasketStatus(event.data.id, basket.contains(event.data));
    pageView.render({ count: basket.total });
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

    basketView.render({ cost: basket.cost, cards: cardsList });
    pageView.render({ count: basket.total });
})

events.on('basket:open', () => {
    basketView.render({ cost: basket.cost });
    modalView.render({ content: basketTemplate });
})



const orderTemplate = cloneTemplate('#order');

events.on('basket:submit', () => {
    order.orderProducts = basket.getBasketProductsIds();
    order.cost = basket.cost;
    modalView.render({ content: orderTemplate });
})



// ордер
const formOrderView = new FormOrderView(orderTemplate, events);

events.on('order-form:payment', (event: { data: TPayment }) => {
    order.payment = event.data;
})

events.on('order-form-address:input', (event: { data: string }) => {
    order.address = event.data;
})


events.on('order-data:change', () => {
    const errorMessage = order.isOrderValid() ? '' : 'Укажите все данные';
    formOrderView.render({ valid: order.isOrderValid(), error: errorMessage });

    const contactsErrorMessage = order.isContactsValid() ? '' : 'Укажите все данные';
    formContactsView.render({ valid: order.isContactsValid(), error: contactsErrorMessage });
})

events.on('order-form:submit', (event: { payment: string, address: string }) => {
    // console.log(event);
    modalView.render({ content: contactsTemplate });
})



// contacts
const formContactsView = new FormOrderView(contactsTemplate, events);

events.on('contacts-form-email:input', (event: { data: string }) => {
    order.email = event.data;
})

events.on('contacts-form-phone:input', (event: { data: string }) => {
    order.phone = event.data;
})


// success
const successTemplate = cloneTemplate('#success');
const orderSuccessView = new OrderSuccessView(successTemplate, events);
events.on('contacts-form:submit', () => {

    console.log(order.getFullOrderData());
    console.log(basket.getFullBasketData());
    const fullData = Object.assign({}, order.getFullOrderData(), basket.getFullBasketData());
    console.log(fullData);

    api.setOrder<TOrderResult>(fullData).then(data => {


        orderSuccessView.render({ title: data.id, description: String(data.total) })
        modalView.render({ content: successTemplate })
    })
})






function getErrorMessage(): string {
    return order.isOrderValid() ? '' : 'Укажите все данные';
}

// function toggleCardBasketStatus(id: string) {
//     const isInBasket = basketData.cards.some(item => item.id === id);
//     cardsData.setCardStatus(id, isInBasket);
// }

