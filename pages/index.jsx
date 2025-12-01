import React from 'react';
import { Helmet } from 'react-helmet';

import { useQuery } from "@apollo/react-hooks";

// Import Apollo Server and Query
import withApollo from '../server/apollo';
import { GET_HOME_DATA } from '../server/queries';

//jquery
import $ from 'jquery';

// import Home Components
import IntroSection from '~/components/partials/home/intro-section';
import ServiceBox from '~/components/partials/home/service-section';
import BestCollection from '~/components/partials/home/best-collection';
import CtaSection from '~/components/partials/home/cta-section';

function HomePage() {
    const { data, loading, error } = useQuery( GET_HOME_DATA, { variables: { productsCount: 7 } } );
    const featured = data && data.specialProducts.featured;
    const bestSelling = data && data.specialProducts.bestSelling;
    const latest = data && data.specialProducts.latest;
    const onSale = data && data.specialProducts.onSale;
    const posts = data && data.posts.data;

    return (
        <div className="main home">
            <Helmet>
                <title>Aurora - Home</title>
            </Helmet>


            <h1 className="d-none">Aurora - Home</h1>
            <div className="page-content">
                <div className="intro-section">
                    <IntroSection />

                    <ServiceBox />
                </div>

                {/* <CategorySection /> */}

                <BestCollection products={ bestSelling } loading={ loading } />

                {/* <DealSection /> */}

                {/* <FeaturedCollection products={ featured } loading={ loading } /> */}

                <CtaSection />

                {/* <BlogSection posts={ posts } /> */}

            </div>
        </div>
    )
}

export default withApollo( { ssr: typeof window === 'undefined' } )( HomePage );
