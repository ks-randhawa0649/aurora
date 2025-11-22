import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import ALink from '~/components/features/custom-link';
import Card from '~/components/features/accordion/card';
import { UserContext } from '../../../pages/_app';

import { mainMenu } from '~/utils/data/menu';

function MobileMenu( props ) {
    const [ search, setSearch ] = useState( "" );
    const [ timer, setTimer ] = useState( null );
    const router = useRouter();
    const { user, setUser } = useContext(UserContext);

    useEffect( () => {
        window.addEventListener( 'resize', hideMobileMenuHandler );
        document.querySelector( "body" ).addEventListener( "click", onBodyClick );

        return () => {
            window.removeEventListener( 'resize', hideMobileMenuHandler );
            document.querySelector( "body" ).removeEventListener( "click", onBodyClick );
        }
    }, [] )

    useEffect( () => {
        setSearch( "" );
    }, [ router.query.slug ] )

    const hideMobileMenuHandler = () => {
        if ( window.innerWidth > 991 ) {
            document.querySelector( 'body' ).classList.remove( 'mmenu-active' );
        }
    }

    const hideMobileMenu = () => {
        document.querySelector( 'body' ).classList.remove( 'mmenu-active' );
    }

    async function handleLogout(e) {
        e.preventDefault();
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        hideMobileMenu();
        router.push('/');
    }

    function onSearchChange( e ) {
        setSearch( e.target.value );
    }

    function onBodyClick( e ) {
        if ( e.target.closest( '.header-search' ) ) return e.target.closest( '.header-search' ).classList.contains( 'show-results' ) || e.target.closest( '.header-search' ).classList.add( 'show-results' );

        document.querySelector( '.header-search.show' ) && document.querySelector( '.header-search.show' ).classList.remove( 'show' );
        document.querySelector( '.header-search.show-results' ) && document.querySelector( '.header-search.show-results' ).classList.remove( 'show-results' );
    }

    function onSubmitSearchForm( e ) {
        e.preventDefault();
        router.push( {
            pathname: '/shop',
            query: {
                search: search
            }
        } );
    }

    return (
        <div className="mobile-menu-wrapper">
            <div className="mobile-menu-overlay" onClick={ hideMobileMenu }>
            </div>

            <ALink className="mobile-menu-close" href="#" onClick={ hideMobileMenu }><i className="d-icon-times"></i></ALink>

            <div className="mobile-menu-container bg-white scrollable">
                <form action="#" className="input-wrapper" onSubmit={ onSubmitSearchForm }>
                    <input type="text" className="form-control" name="search" autoComplete="off" value={ search } onChange={ onSearchChange }
                        placeholder="Search your keyword..." required />
                    <button className="btn btn-search" type="submit">
                        <i className="d-icon-search"></i>
                    </button>
                </form>

                <ul className="mobile-menu bg-white text-dark mmenu-anim">
                    <li>
                        <ALink href="/">Home</ALink>
                    </li>

                    <li>
                        <ALink href="/pages/shop">Shop</ALink>
                    </li>

                    <li>
                        <ALink href="/pages/about-us">About Us</ALink>
                    </li>

                    <li>
                        <ALink href="/pages/contact-us">Contact Us</ALink>
                    </li>

                    <li>
                        <ALink href="/pages/cart">
                             My Cart
                        </ALink>
                    </li>

                    {user ? (
                        <>
                            <li>
                                <ALink href="/pages/account">
                                     My Account
                                </ALink>
                            </li>
                            <li>
                                <a href="#" onClick={handleLogout}>
                                    Logout
                                </a>
                            </li>
                        </>
                    ) : (
                        <li>
                            <ALink href="/pages/login">
                                 Login
                            </ALink>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default React.memo( MobileMenu );