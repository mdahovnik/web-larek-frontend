export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export const CategoryColor = {
    "софт-скил": "soft",
    "хард-скил": "hard",
    "другое": "other",
    "дополнительное": "additional",
    "кнопка": "button"
}

export enum APP_EVENTS {
    cardsListChanged = 'cards-list:changed',
    cardPreviewChanged = 'card-preview:changed',
    basketAdd = 'basket:add',
    basketRemove = 'basket:remove',
    basketDataChange = 'basket-data:change',
    basketOpen = 'basket:open',
    basketSubmit = 'basket:submit',
    orderPaymentSelect = 'order-payment:select',
    formChange = 'form:change',
    orderDataChange = 'order-data:change',
    orderFormSubmit = 'order-form:submit',
    contactsFormInput = 'contacts-form:input',
    contactsDataChange = 'contacts-data:change',
    contactsFormSubmit = 'contacts-form:submit',
    orderSuccessSubmit = 'order-success:submit',
    modalOpen = 'modal:open',
    modalClose = 'modal:close',
    selectedCardChanged = 'selected-card:changed',
    errorsChanged = 'formErrors:change'
}