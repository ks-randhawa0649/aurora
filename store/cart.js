import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { takeEvery } from "redux-saga/effects";
import { toast } from 'react-toastify';

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

            return {
                data: [
                    ...state.data,
                    newProduct
                ]
            };

        case actionTypes.REMOVE_FROM_CART:
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