# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

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

Продукт

```
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: string
}
```
<!-- Корзина

```
export interface IBasket {
    isEmpty: boolean;
}
``` -->
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

Интерфейс модели данных продуктов в веб-ларьке

```
export interface IProductData {
    products: IProduct[];
    selectedProduct: string | null;
    getProduct(id: string): IProduct;
}
```
Данные продукта для отображения на главной странице

```
export type TProductStall = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;
```
Данные продукта используемые в окне с подробной информацией

```
export type TProductModal = Pick<IProduct, 'description' | 'image' | 'title' | 'category' | 'price'>;
```
Данные продукта используемые при просмотре корзины

```
export type TProductCart = Pick<IProduct, 'title' | 'price'>;
```
Данные заказа для формы выбора способа оплаты

```
export type TOrderPayment = Pick<IOrder, 'payment' | 'address'>;
```
Данные заказа для формы с email

```
export type TOrderContact = Pick<IOrder, 'email' | 'phoneNumber'>;
```
Данные используемые для валидации форм

```
export type TOrderValidation = Pick<IOrder, 'payment' | 'address' | 'email' | 'phoneNumber'>;
```
Данные заказа для окна с результатом его оформления

```
export type TOrderCompleted = Pick<IOrder,'total'>;
```

### Архитектура приложения

Кодовая база приложения разделена на слои согласно парадигме MVP

### Базовый код

### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовая часть адреса сервера и опционально объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос, параметром принимает endpoint запроса и возвращает promise с объектом которым ответил сервер.
- `post` - параметрами принимает endpoint и объект с данными, которые будут переданы в JSON в теле запроса. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра.

### Класс EventEmitter
Брокер событий позволяет подписываться на события и отправлять события. В слоях приложения используется для генерации событий, а в presenter для их обработки.
Основные методы описаны в интерфейсе `IEvents`:
- `on` - подписывает на событие
- `emit` - инициализирует событие
- `trigger` - возвращает функцию при вызове которой инициализируется требуемое событие

### Слой данных

#### Класс ProductData 
Отвечает за хранение и логику работы с данными продуктов в ларьке полученных с сервера.\
Конструктор принимает инстанс брокера событий\
Поля для хранения данных:
- `_products: IProduct[]` - массив объектов продуктов
- `_selectedProduct: string | null` - id продукта, выбранного для просмотра в модальном окне.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы для работы с этими данными:
- getProduct(id: string): IProduct - возвращает продукт по id
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс BasketData
Отвечает за хранение и логику работы с продуктами в корзине.
Конструктор принимает инстанс брокера событий\
Поля для хранения данных:
- `_basket: IBasket` - корзина.
- `_productToDelete: string` - id продукта для удаления из корзины.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы для работы с этими данными:
- `addProduct(product: IProduct): void` - добавляет один продукт в начало массива и вызывает событие изменения массива.
- `removeProduct(id: string): void` - удаляет из массива выбранный продукт по id и вызывает событие изменения массива и вызывает событие изменения массива.
- `getProductInfo(): TProductBasket` - получение данных продукта.
- `checkProductStatus(id: string): boolean` - проверяет находится ли выбранный продукт в корзине.
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс OrderData
Отвечает за хранение и логику работы с заказом.
Конструктор принимает инстанс брокера событий\
Поля для хранения данных:
- `_order: IOrder` - заказ.
- `_status: IOrderResult` - результат выполненного заказа
- `_isOrderValid: boolean` - валидность составленного заказа.
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Методы для работы с этими данными:
- `checkValidation(data: Record<keyof TOrderValidation, string>): boolean` - проверяет заказ на валидность.
- `getOrder(): IOrder` - 
- `getOrderStatus(order: IOrder): Promise<IOrderResult>` - получает 
