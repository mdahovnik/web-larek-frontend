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

const page = new Page(ensureElement('.page__wrapper'), events);
const modal = new Modal(ensureElement('#modal-container'), events);

const basketTemplate = cloneTemplate('#basket');
const cardPreviewTemplate = cloneTemplate('#card-preview');

const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const basket = new Basket(basketTemplate, events);


const galleryItems: HTMLElement[] = [];

events.onAll((event) => {
    console.log(event.eventName, event.data);
});

/**
 * получение данных с сервера
 */
api.getProductList<TInitCards>().then(obj => {
    cardsData.cardsList = obj.items;

    cardsData.cardsList.forEach((cardData) => {
        const newCard = new Card(cloneTemplate('#card-catalog'), events);
        galleryItems.push(newCard.render(cardData));
    });

    page.render({ gallery: galleryItems, count: basketData.total })
}).catch(err => console.error(err))



/**
 * просмотр карточки
 */
events.on('card-preview:changed', (data: { card: ICard }) => {
    const card = new Card(cardPreviewTemplate, events);
    const newCardElement = card.render(cardsData.getCard(data.card.id));
    modal.render({ content: newCardElement });
})


/**
 * Корзина
 */
events.on('card-basket:added', (data: { card: ICard }) => {
    basketData.add(cardsData.getCard(data.card.id));
    page.render({ gallery: galleryItems, count: basketData.total });
})


events.on('card-basket:remove', (data: { card: ICard }) => {
    basketData.remove(data.card);
})


events.on('basket:changed', (data: { cards: ICard[] }) => {
    const cardsList: HTMLElement[] = [];
 
    data.cards.forEach((item) => {
        const newCard = new Card(cloneTemplate('#card-basket'), events);
        cardsList.push(newCard.render(cardsData.getCard(item.id)));
    });

    basket.render({ cost: basketData.cost, cards: cardsList });
    page.render({ gallery: galleryItems, count: basketData.total });
})


events.on('basket: open', () => {
    modal.render({ content: basketTemplate });
})





