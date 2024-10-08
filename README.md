# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- `src/` — исходные файлы проекта
- `src/components/` — папка с JS компонентами
- `src/components/base/` — папка с базовым кодом

Важные файлы:
- `src/pages/index.html` — HTML-файл главной страницы
- `src/types/index.ts` — файл с типами
- `src/index.ts` — точка входа приложения
- `src/scss/styles.scss` — корневой файл стилей
- `src/utils/constants.ts` — файл с константами
- `src/utils/utils.ts` — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

карточка

```
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: string
}
```

Заказ

```
export interface IOrder {
    payment: string;
    email: string;
    phoneNumber: string;
    address: string;
}
```
Результат выполнения заказа

```
export interface IOrderResult {
    id: string;
    total: number;
}
```

Интерфейс модели данных карточек в веб-ларьке

```
export interface ICardData {
    cards: ICard[];
    selectedCard: string | null;
    getCard(id: string): ICard;
}
```
Данные карточки для отображения на главной странице

```
export type TCardBase = Pick<ICard, 'image' | 'title' | 'category' | 'price'>;
```
Данные карточки используемые в окне с подробной информацией

```
export type TCardModal = Pick<ICard, 'description' | 'image' | 'title' | 'category' | 'price'>;
```
Данные карточки используемые при просмотре корзины

```
export type TCardBasket = Pick<ICard, 'title' | 'price' | 'id'>;
```
Данные карточки для формирования заказа

```
export type TCardOrder = Pick<ICard, 'id'>;
```
Данные используемые для валидации форм

```
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;
export type TOrderContacts = Pick<IOrder, 'email' | 'phone'>;
```

## Архитектура приложения

Кодовая база приложения разделена на слои согласно парадигме MVP

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов.

*Конструктор :*
- принимает базовую часть адреса сервера и опционально объект с заголовками запросов.

*Методы :*
- `get` - выполняет GET запрос, параметром принимает endpoint запроса и возвращает promise с объектом которым ответил сервер.
- `post` - параметрами принимает endpoint и объект с данными, которые будут переданы в JSON в теле запроса. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра.

#### Класс EventEmitter
Брокер событий позволяет подписываться на события и отправлять события. В слоях приложения используется для генерации событий, а в presenter для их обработки.
Основные методы описаны в интерфейсе `IEvents`:
- `on` - подписывает на событие
- `emit` - инициализирует событие
- `trigger` - возвращает функцию при вызове которой инициализируется требуемое событие


### Слой данных

#### Класс CardData 
Отвечает за хранение и логику работы с данными карточек в ларьке полученных с сервера.

*Конструктор :*
- принимает инстанс брокера событий.

*Поля :*
- `_cards: ICard[]` - массив объектов карточек
- `_selectedCard: string | null` - `id` карточки, выбранного для просмотра в модальном окне.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

*Методы :*
- `getCard(id: string): ICard` - возвращает карточка по `id`
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс BasketData
Отвечает за хранение и логику работы с карточками в корзине.

*Конструктор :*
- принимает инстанс брокера событий

*Поля :*
- `_basket: IBasket` - корзина.
- `_cardToDelete: string` - id карточки для удаления из корзины.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

*Методы :*
- `addCard(card: ICard): void` - добавляет один карточка в начало массива и вызывает событие изменения массива.
- `removeCard(id: string): void` - удаляет из массива выбранный карточка по `id` и вызывает событие изменения массива и вызывает событие изменения массива.
- `getCardInfo(): TCardBasket` - получение данных карточки.
- `checkCardStatus(id: string): boolean` - проверяет находится ли выбранный карточка в корзине.
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс OrderData
Отвечает за хранение и логику работы с заказом.

*Конструктор :*
- принимает инстанс брокера событий.

*Поля :*
- `_order: IOrder` - заказ.
- `_status: IOrderResult` - результат выполненного заказа
- `_isOrderValid: boolean` - валидность составленного заказа.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

*Методы :*
- `checkValidation(data: Record<keyof TOrderValidation, string>): boolean` - проверяет заказ на валидность.
- `sendOrder(order: IOrder): void` - отправляет ордер на сервер и вызывает событие изменения статуса заказа. 
- сеттеры и геттеры для сохранения и получения данных из полей класса.


### Слой представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно. Устанавливает слушатели на клавиатуру, для закрытия модального окна по `Esc`, на клик в оверлей и кнопку-крестик для закрытия модального окна. Генерация событий `modal:open`, `modal:close`. 

*Конструктор :*
- принимает элемент модального окна на основе шаблона и экземпляр класса `EventEmitter` для возможности инициации событий.

*Поля :*
- `modalContent` - содержимое модального окна
- `events: IEvents` - брокер событий

*Методы :*
- `open` и `close` - для управления отображением модального окна и генерации соответствующих событий.
- `render` - отображает модальное окно

#### Класс Form
Компонент формы.

*Конструктор :*
- принимает контейнер с формой и брокер событий

*Поля :*
- `_submit` - для элемента кнопки подтверждения
- `_errors` - для изменения сообщений об ошибках валидации в форме

*Методы :*
- `render` -  готовит компонент формы, используя переданное состояние
- `onInputChange` - вызывает событие `form-input-field:change`

#### Класс Card
Отвечает за отображение карточки, задавая в карточке данные названия, описание, изображения, категорию, стоимость товара.Класс используется для отображения карточек на странице сайта. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.

*Конструктор :*
- принимает элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки.
- принимает экземпляр `EventEmitter` для инициации событий.

*Поля :*
- Поля класса содержат элементы разметки элементов карточки. 

*Методы :*
- `setData(cardData: ICard): void` - заполняет атрибуты элементов карточки данными.
- `render(): HTMLElement` - метод возвращает полностью заполненную карточку с установленным слушателем.
- геттер `id` возвращает уникальный `id` карточки

#### Класс Basket
Отвечает за отображение корзины. Предоставляет сеттеры для изменения отображения корзины.

*Конструктор :*
- принимает брокер событий

*Поля :*
- template - элемент шаблона корзины
- _cardsList - элемент содержимого корзины (карточек товаров)
- _count - элемент суммы товаров в корзине
- _button - элемент кнопки оформления заказа в корзине

*Методы :*
- toggleButton - меняет состояние активности кнопки на переданное


#### Класс OrderForm
Реализует компонент формы отправки заказа.

*Конструктор :*
- принимает контейнер с формой и брокер событий

*Поля :*
- _cashBtn - кнопка выбора оплатой при получении
- _cardBtn - кнопка выбора оплаты картой
- _address - поле адреса


#### Класс ContactsForm
Реализует компонент формы контактов.

*Конструктор :*
- принимает контейнер с формой и брокер событий

*Поля :*
- _email - поле с email
- _phone - поле с телефоном

#### Класс OrderSuccess
Отвечает за отображение окна с подтверждением заказа.

*Конструктор :*
- принимает DOM-элемент окна на базе шаблона и брокер событий

*Поля :*
- `_closeBtn` - элемент кнопки закрытия окна
- `_total` - элемент с суммой заказа

*Сеттеры :*
- `total` - меняет содержимое элемента с суммой заказа

#### Класс Page
Отвечает за отображение блока с карточками на главной странице .

*Конструктор :*
- принимает DOM-элемент главной страницы, в котором размещаются карточки и брокер событий.

*Поля :*
- `_container: HTMLElement` - элемент контейнера.
- `events: IEvents` - брокер событий

*Методы :* 
- `addCard(cardElement: HTMLElement)` - для добавления карточек на страницу.
- сеттер `container` - для полного обновления содержимого главной страницы после начальной загрузки данных сервера.


### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса `Api` и предоставляет методы реализующие взаимодействие с бэкэндом сервиса.

### Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

### Список событий, генерируемых в системе:
**События изменения данных (генерируются классами моделями данных)**
- `cards:changed` - изменение массива карточек
- `card:selected` - изменение открываемой в модальном окне карточки
- `card:clear` - очистка данных выбранной для показа в модальном окне карточки

**События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)**\
*- События модальных окон*
- `modal:open` - открытие модального окна
- `modal:open` - закрытие модального окна

*- События модального окна просмотра карточки*
- `card:select` - выбор карточки для просмотра в модальном окне

*- События модального окна  корзины*
- `card:delete` - выбор карточки для удаления из корзины
- `basket:changed` - изменение количества карточек в корзине

*- События модального окна с формой выбора способа оплаты и адреса*
- `payment:selected`- выбор способа оплаты заказа
- `edit-payment-form:input` - изменение данных в форме способа оплаты
- `edit-payment-form:validation` - сообщает о необходимости валидации формы
- `payment-form:submit` - сохранение данных формы (способ оплаты и адрес)
- `form-input-field:change` - изменение полей ввода

*- События модального окна с формой ввода email и телефона*
- `edit-email-form:input` - изменение данных в форме способа оплаты
- `edit-email-form:validation` - сообщает о необходимости валидации формы
- `email-form:submit` - сохранение данных формы ( email и телефон)

*- События модального окна с формой подтверждения заказа*
- `order-status-form:submit` - генерируемое при нажатии "За новыми покупками"

### Презентер

Отвечает за взаимодействие компонентов Взаимодействие происходит за счет брокера событий, который их отслеживает.