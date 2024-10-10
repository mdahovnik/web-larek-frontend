import './scss/styles.scss';
import { Api } from "./components/base/api";
import { API_URL, CDN_URL, settings } from "./utils/constants";
import { EventEmitter } from './components/base/events';
import { CardsData } from './components/CardsData';
import { LarekAPI } from './components/LarekAPI';
import { Card } from './components/Card';
import { ICard, TInitCards } from './types';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { BasketData } from './components/BasketData';
import { Basket } from './components/Basket';


const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

const modal = new Modal(ensureElement('#modal-container'), events);

const cardsData = new CardsData(events);
const basketData = new BasketData(events);


const container = document.querySelector('.page__wrapper') as HTMLElement;
const page = new Page(container, events);

events.onAll((event) => {
    console.log(event.eventName, event.data);
});

/**
 * получение данных с сервера
 */
const elements: HTMLElement[] = [];
api.getProductList<TInitCards>().then(obj => {
    cardsData.cardsList = obj.items;

    cardsData.cardsList.forEach((item) => {
        const card = new Card(cloneTemplate('#card-catalog'), events);
        elements.push(card.render(item));
    });

    page.render({ gallery: elements, count: basketData.total })
}).catch(err => console.error(err))



/**
 * просмотр карточки
 */
events.on('card-preview:changed', (data: { card: ICard }) => {
    const card = new Card(cloneTemplate('#card-preview'), events);
    const newCardElement = card.render(cardsData.getCard(data.card.id));
    modal.render({ content: newCardElement });
})


/**
 * Корзина
 */
const basketTemplate = cloneTemplate('#basket');
const basket = new Basket(basketTemplate, events);
const list = basketTemplate.querySelector('.basket__list') as HTMLElement;

// добавление в корзину
events.on('card-basket:added', (data: { card: ICard }) => {
    basketData.addProduct(cardsData.getCard(data.card.id));
    const card = new Card(cloneTemplate('#card-basket'), events);

    basketData.basketList.forEach((item) => {
        list.prepend(card.render(cardsData.getCard(item.id)));
    });

    page.render({ gallery: elements, count: basketData.total });
    modal.close();
})

events.on('basket: open', () => {

    basket.render({cost: basketData.cost})
    modal.render({ content: basketTemplate});
})





