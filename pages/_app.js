import React, { createContext, useEffect, useState } from 'react'
import { useStore, Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import Helmet from "react-helmet";
import { useRouter } from 'next/router';

import { wrapper } from "../store/index.js";
import Layout from '~/components/layout';
import $ from "jquery";
import { demoActions } from '~/store/demo';

import { currentDemo } from '~/server/queries';
import * as ga from '~/lib/analytics';

import "~/public/sass/style.scss";

export const UserContext = createContext({ user: null, setUser: () => {} })

const App = ({ Component, pageProps, initialUser }) => {
    const store = useStore();
    const router = useRouter();
    const [user, setUser] = useState(initialUser || null)

    useEffect(() => {
        if (store.getState().demo.current !== currentDemo) {
            store.dispatch(demoActions.refreshStore(currentDemo));
        }
        if (typeof window !== "undefined") {
            window.$ = window.jQuery = $;
            console.log("jQuery loaded globally!");
        }
    }, [])

    // Track page views on route change
    useEffect(() => {
        const handleRouteChange = (url) => {
            ga.pageview(url);
        };
        
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    // Client refresh (optional) ensures freshness if cookie changes after hydration
    useEffect(() => {
        if (!user) {
            fetch('/api/auth/me')
                .then(r => r.json())
                .then(d => { if (d.user) setUser(d.user) })
                .catch(() => {})
        }
    }, [user])

    const LoadingComponent = (
        <div className="loading-overlay">
            <div className="bounce-loader">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
                <div className="bounce4"></div>
            </div>
        </div>
    );

    return (
        <Provider store={store}>
            <PersistGate
                persistor={store.__persistor}
                loading={LoadingComponent}>
                <Helmet>
                    <meta charSet="UTF-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                    <title>Aurora - AI-Powered Fashion Store</title>

                    <meta name="keywords" content="Fashion, AI, Virtual Try-On, E-commerce" />
                    <meta name="description" content="Aurora - AI-Powered Fashion Store with Virtual Try-On" />
                    <meta name="author" content="Aurora Team" />
                </Helmet>

                <UserContext.Provider value={{ user, setUser }}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </UserContext.Provider>
            </PersistGate>
        </Provider>
    );
}

App.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {};
    let initialUser = null
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    if (ctx.req) {
        const { getUserFromRequest } = await import('../lib/auth')
        initialUser = await getUserFromRequest(ctx.req)
    }
    return { pageProps, initialUser };
};

export default wrapper.withRedux(App);
