export type CartItem = {
  id: number;
  type: 'garment' | 'chair';
  cartId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

export type AddCartItemInput = Omit<CartItem, 'quantity'> & {
  quantity?: number;
};
