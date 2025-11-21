import React from 'react';
import OwlCarousel from '~/components/features/owl-carousel';
import ProductTwo from '~/components/features/product/product-two';

import { mainSlider17 } from '~/utils/data/carousel';

export default function RelatedProducts( props ) {
    const { products, adClass = "" } = props;

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <section className={ `mt-10 pt-3 ${ adClass }` }>
            <h2 className="title title-center mb-5">Related Products</h2>

            <OwlCarousel adClass="owl-carousel owl-theme owl-nav-full" options={ mainSlider17 }>
                {
                    products.map( ( item, index ) => (
                        <ProductTwo
                            product={ item }
                            key={ `product-two-${ index }` }
                        />
                    ) )
                }
            </OwlCarousel>
        </section>
    );
}