

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: string
}

export interface IProductData {
    products: IProduct[];
    selectedProduct: string | null;
}

export interface IUser {
    address: string;
    email: string;
    phoneNumber: string;
    payment: string;
    cart: IProduct[];
}

export type TProductStall = Pick<IProduct, 'image' | 'title' | 'category' | 'price'>;

export type TProductModal = Pick<IProduct, 'description' | 'image' | 'title' | 'category' | 'price'>;

export type TProductCart = Pick<IProduct, 'title' | 'price'>;

export type TUserPayment = Pick<IUser, 'payment' | 'address'>;

export type TUserContact = Pick<IUser, 'email' | 'phoneNumber'>;