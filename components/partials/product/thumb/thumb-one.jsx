import React, { useEffect } from 'react';

function ThumbOne( props ) {
    const { product } = props;

    useEffect( () => {
        if ( !product || !product.small_pictures || product.small_pictures.length === 0 ) {
            return;
        }

        const timer = setTimeout( () => {
            const productThumbsWrapper = document.querySelector( '.product-thumbs-one' );
            const productThumb = document.querySelector( '.product-thumb' );
            
            // Check if elements exist before accessing properties
            if ( !productThumbsWrapper || !productThumb ) {
                return;
            }

            const wrapperHeight = productThumbsWrapper.offsetHeight;
            const thumbHeight = productThumb.offsetHeight;
            
            if ( !wrapperHeight || !thumbHeight ) {
                return;
            }

            const thumbCount = Math.floor( wrapperHeight / thumbHeight );
            
            const thumbUpButton = document.querySelector( '.thumb-up' );
            const thumbDownButton = document.querySelector( '.thumb-down' );

            if ( thumbUpButton ) {
                thumbUpButton.addEventListener( 'click', thumbUpClick );
            }
            if ( thumbDownButton ) {
                thumbDownButton.addEventListener( 'click', thumbDownClick );
            }

            function thumbUpClick( e ) {
                e.preventDefault();
                const productThumbs = document.querySelector( '.product-thumbs' );
                if ( !productThumbs ) return;
                
                const transform = productThumbs.style.transform;
                const currentTransform = transform ? parseInt( transform.split( '(' )[1] ) : 0;
                
                if ( currentTransform < 0 ) {
                    productThumbs.style.transform = `translateY(${ currentTransform + thumbHeight }px)`;
                    
                    if ( thumbDownButton ) {
                        thumbDownButton.classList.remove( 'disabled' );
                    }
                    if ( currentTransform + thumbHeight >= 0 && thumbUpButton ) {
                        thumbUpButton.classList.add( 'disabled' );
                    }
                }
            }

            function thumbDownClick( e ) {
                e.preventDefault();
                const productThumbs = document.querySelector( '.product-thumbs' );
                if ( !productThumbs ) return;
                
                const transform = productThumbs.style.transform;
                const currentTransform = transform ? parseInt( transform.split( '(' )[1] ) : 0;
                const maxTransform = -( product.small_pictures.length - thumbCount ) * thumbHeight;
                
                if ( currentTransform > maxTransform ) {
                    productThumbs.style.transform = `translateY(${ currentTransform - thumbHeight }px)`;
                    
                    if ( thumbUpButton ) {
                        thumbUpButton.classList.remove( 'disabled' );
                    }
                    if ( currentTransform - thumbHeight <= maxTransform && thumbDownButton ) {
                        thumbDownButton.classList.add( 'disabled' );
                    }
                }
            }

            // Cleanup function
            return () => {
                if ( thumbUpButton ) {
                    thumbUpButton.removeEventListener( 'click', thumbUpClick );
                }
                if ( thumbDownButton ) {
                    thumbDownButton.removeEventListener( 'click', thumbDownClick );
                }
            };
        }, 100 );

        return () => clearTimeout( timer );
    }, [ product ] );

    if ( !product || !product.small_pictures || product.small_pictures.length === 0 ) {
        return null;
    }

    return (
        <div className="product-thumbs-wrap">
            <div className="product-thumbs-one">
                <div className="product-thumbs">
                    {
                        product.small_pictures.map( ( item, index ) => (
                            <div 
                                className="product-thumb" 
                                key={ `product-thumb-${ index }` }
                            >
                                <img 
                                    src={ item.url } 
                                    alt={ `${product.name} thumbnail ${index + 1}` }
                                    width={ item.width || 109 } 
                                    height={ item.height || 122 }
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder.jpg';
                                    }}
                                />
                            </div>
                        ) )
                    }
                </div>
            </div>
            <button className="thumb-up disabled">
                <i className="fas fa-chevron-up"></i>
            </button>
            <button className="thumb-down disabled">
                <i className="fas fa-chevron-down"></i>
            </button>
        </div>
    );
}

export default React.memo( ThumbOne );