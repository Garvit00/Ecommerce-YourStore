export const addDecimals = (num) => {
    return (Math.round(num*100)/100).toFixed(2);
}

export const updateCart = (state) => {
                //calculating item price
                state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));

                //calculating shipping price (if orders above 499 then free else 40 charge)
                state.shippingPrice = addDecimals(state.itemsPrice > 499 ? 0 : 40);
    
                //calculating tax (18%)
    
                state.taxPrice = addDecimals(Number((0.18*state.itemsPrice).toFixed(2)));
    
                //total price
    
                state.totalPrice = (
                    Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)
                ).toFixed(2);
    
                localStorage.setItem('cart', JSON.stringify(state));

                return state;
}