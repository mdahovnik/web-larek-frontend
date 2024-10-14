import './scss/styles.scss';
import { Api } from "./components/base/api";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { Cards } from './components/model/Cards';
import { LarekAPI } from './components/LarekAPI';
import { CardView } from './components/view/CardView';
import { IBasketData, ICard, TFormOrder, TInitCards, TPayment } from './types';
import { PageView } from './components/view/PageView';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ModalView } from './components/view/ModalView';
import { Basket } from './components/model/Basket';
import { BasketView } from './components/view/BasketView';
import { OrderData } from './components/model/Order';
import { OrderFormView } from './components/view/FormOrderView';


const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

const basketTemplate = cloneTemplate('#basket');
const orderTemplate = cloneTemplate('#order');
const contactsTemplate = cloneTemplate('#contacts');

const cards = new Cards(events);
const basket = new Basket(events);
const order = new OrderData(events);

const pageView = new PageView(ensureElement('.page__wrapper'), events);
const modalView = new ModalView(ensureElement('#modal-container'), events);
const basketView = new BasketView(basketTemplate, events);
const formOrderView = new OrderFormView(orderTemplate, events);

const galleryItems: HTMLElement[] = [];

events.onAll((event) => {
    console.log(event.eventName, event.data);
});

// инициализация
api.getProductList<TInitCards>().then(obj => {
    cards.cardsList = obj.items;

    cards.cardsList.forEach((cardData) => {
        const newCardView = new CardView(cloneTemplate('#card-catalog'), events);
        galleryItems.push(newCardView.render(cardData));
    });

    pageView.render({ gallery: galleryItems });

}).catch(err => console.error(err))


//просмотр карточки
events.on('card-preview:change', (event: { data: ICard }) => {
    const newCardView = new CardView(cloneTemplate('#card-preview'), events);
    cards.setCardStatus(event.data.id, basket.contains(event.data));
    const newCardElement = newCardView.render(cards.getCard(event.data.id));
    modalView.render({ content: newCardElement });
})


//Корзина
events.on('card-basket:add', (event: { data: ICard }) => {
    basket.add(cards.getCard(event.data.id));
    // toggleCardBasketStatus(event.data.id);
    cards.setCardStatus(event.data.id, basket.contains(event.data));
    pageView.render({ count: basket.total });
    modalView.close();
})

events.on('card-basket:remove', (event: { data: ICard }) => {
    basket.remove(event.data);
    // toggleCardBasketStatus(event.data.id);
    cards.setCardStatus(event.data.id, basket.contains(event.data));
})

events.on('basket-data:change', (event: { data: IBasketData }) => {
    const cardsList: HTMLElement[] = [];

    event.data.cards.forEach((item) => {
        const newCardView = new CardView(cloneTemplate('#card-basket'), events);
        cardsList.push(newCardView.render(cards.getCard(item.id)));
    });

    basketView.render({ cost: basket.cost, cards: cardsList });
    pageView.render({ count: basket.total });
    // modal.render({ content: basketTemplate });
})

events.on('basket: open', () => {
    basketView.render({ cost: basket.cost });
    modalView.render({ content: basketTemplate });
})

events.on('basket:submit', () => {
    // formOrderView.render({valid: false, error: 'ERROR FORM'});
    modalView.render({ content: orderTemplate });
})


/*
 форма ордера
*/

events.on('order-form:payment', (event: { data: TPayment }) => {
    order.payment = event.data;
})

events.on('order-form:input', (event: { data: string }) => {
    order.address = event.data;
})

events.on('order-data:change', () => {
    const errorMessage = order.isOrderValid() ? '' : 'Укажите все данные';
    // console.log(orderData.isOrderValid());
    formOrderView.render({ valid: order.isOrderValid(), error: errorMessage });
})

events.on('order-form: submit', (event: { payment: string, address: string }) => {
    // orderData.payment 
    console.log(event);
    modalView.render({content: contactsTemplate});

})



// function toggleCardBasketStatus(id: string) {
//     const isInBasket = basketData.cards.some(item => item.id === id);
//     cardsData.setCardStatus(id, isInBasket);
// }

