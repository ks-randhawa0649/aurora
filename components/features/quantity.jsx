import { useState, useEffect } from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export default function Quantity({ qty = 1, ...props }) {
    const { adClass = 'mr-2 input-group' } = props;
    const [quantity, setQuantity] = useState(parseInt(qty));

    useEffect(() => {
        setQuantity(qty);
    }, [props.product]);

    useEffect(() => {
        props.onChangeQty && props.onChangeQty(quantity);
    }, [quantity]);

    function minusQuantity() {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    function plusQuantity() {
        if (quantity < props.max) {
            setQuantity(quantity + 1);
        }
    }

    function changeQty(e) {
        if (e.currentTarget.value !== '') {
            let newQty = Math.min(parseInt(e.currentTarget.value), props.max);
            newQty = Math.max(newQty, 1);
            setQuantity(newQty);
        }
    }

    return (
        <div className={adClass} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
                onClick={minusQuantity} 
                style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                }}
            >
                <RemoveIcon />
            </button>

            <input
                className="quantity form-control"
                type="number"
                min="1"
                max={props.max}
                value={quantity}
                onChange={changeQty}
                style={{ width: '60px', textAlign: 'center' }}
            />

            <button 
                onClick={plusQuantity} 
                style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                }}
            >
                <AddIcon />
            </button>
        </div>
    );
}
