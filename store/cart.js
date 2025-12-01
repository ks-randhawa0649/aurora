import { persistReducer } from "redux-persist";
import storage from './storage';
import { takeEvery } from "redux-saga/effects";
import { toast } from 'react-toastify';
import * as ga from '~/lib/analytics';

export const actionTypes = {
    ADD_TO_CART: 'ADD_TO_CART',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    UPDATE_CART: 'UPDATE_CART',
    CLEAR_CART: 'CLEAR_CART'
};

const initialState = {
    data: []
};

const cartReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ADD_TO_CART:
            const productId = action.payload.product.id;
            const variant = action.payload.product.variant || '';
            
            // Find if product with same variant exists
            const existingIndex = state.data.findIndex( item => 
                item.id === productId && (item.variant || '') === variant
            );

            if ( existingIndex > -1 ) {
                // Update quantity of existing item
                const newData = [ ...state.data ];
                newData[ existingIndex ] = {
                    ...newData[ existingIndex ],
                    qty: newData[ existingIndex ].qty + action.payload.product.qty,
                    sum: (newData[ existingIndex ].qty + action.payload.product.qty) * newData[ existingIndex ].price
                };

                console.log('Updated existing cart item:', newData[ existingIndex ]);

                // Track add to cart event
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'add_to_cart', {
                        currency: 'USD',
                        value: newData[ existingIndex ].price * action.payload.product.qty,
                        items: [{
                            item_id: newData[ existingIndex ].id || newData[ existingIndex ].slug,
                            item_name: newData[ existingIndex ].name,
                            item_category: newData[ existingIndex ].category?.[0]?.name || 'Product',
                            item_variant: variant || undefined,
                            price: newData[ existingIndex ].price,
                            quantity: action.payload.product.qty
                        }]
                    });
                }

                return {
                    data: newData
                };
            }

            // Add new item with price
            const newProduct = {
                ...action.payload.product,
                price: action.payload.product.price || 0,
                sum: (action.payload.product.price || 0) * action.payload.product.qty
            };

            console.log('Adding new cart item:', newProduct);

            // Track add to cart event for new product
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'add_to_cart', {
                    currency: 'USD',
                    value: newProduct.price * newProduct.qty,
                    items: [{
                        item_id: newProduct.id || newProduct.slug,
                        item_name: newProduct.name,
                        item_category: newProduct.category?.[0]?.name || 'Product',
                        item_variant: variant || undefined,
                        price: newProduct.price,
                        quantity: newProduct.qty
                    }]
                });
            }

            return {
                data: [
                    ...state.data,
                    newProduct
                ]
            };

        case actionTypes.REMOVE_FROM_CART:
            // Find the item being removed for tracking
            const removedItem = state.data.find( item => 
                item.id === action.payload.product.id && 
                (!item.variant || item.variant === action.payload.product.variant)
            );

            // Track remove from cart event
            if (removedItem && typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'remove_from_cart', {
                    currency: 'USD',
                    value: removedItem.price * removedItem.qty,
                    items: [{
                        item_id: removedItem.id || removedItem.slug,
                        item_name: removedItem.name,
                        item_category: removedItem.category?.[0]?.name || 'Product',
                        item_variant: removedItem.variant || undefined,
                        price: removedItem.price,
                        quantity: removedItem.qty
                    }]
                });
            }

            return {
                data: state.data.filter( item => {
                    if ( item.id !== action.payload.product.id ) return true;
                    if ( item.variant && item.variant !== action.payload.product.variant ) return true;
                    return false;
                } )
            };

        case actionTypes.UPDATE_CART:
            return {
                data: state.data.map( item => {
                    if ( item.id === action.payload.product.id && 
                         ( !item.variant || item.variant === action.payload.product.variant ) ) {
                        return {
                            ...item,
                            qty: action.payload.qty,
                            sum: item.price * action.payload.qty
                        };
                    }
                    return item;
                } )
            };

        case actionTypes.CLEAR_CART:
            return initialState;

        default:
            return state;
    }
};

export const cartActions = {
    addToCart: ( product ) => ( { type: actionTypes.ADD_TO_CART, payload: { product } } ),
    removeFromCart: ( product ) => ( { type: actionTypes.REMOVE_FROM_CART, payload: { product } } ),
    updateCart: ( product, qty ) => ( { type: actionTypes.UPDATE_CART, payload: { product, qty } } ),
    clearCart: () => ( { type: actionTypes.CLEAR_CART } )
};

export function* cartSaga() {
    yield takeEvery( actionTypes.ADD_TO_CART, function* saga( e ) {
        toast.success( "Product added to cart" );
    } );
}

const persistConfig = {
    keyPrefix: "riode-",
    key: "cart",
    storage
};

export default persistReducer( persistConfig, cartReducer );