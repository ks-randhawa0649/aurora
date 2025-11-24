import React, { useContext } from 'react';
import { useRouter } from 'next/router';

import ALink from '~/components/features/custom-link';

import { mainMenu } from '~/utils/data/menu';
import { UserContext } from '../../../pages/_app';

function MainMenu() {
    const pathname = useRouter().pathname;
    const { user } = useContext(UserContext);

    return (
        <nav className="main-nav">
            <ul className="menu">
                <li id="menu-home" className={ pathname === '/' ? 'active' : '' }>
                    <ALink href='/'>Home</ALink>
                </li>

                <li id="menu-shop" className={ pathname === '/pages/shop' ? 'active' : '' }>
                    <ALink href='/pages/shop'>Products</ALink>
                </li>
                <li id="menu-contact" className={ pathname === '/pages/contact-us' ? 'active' : '' }>
                    <ALink href="/pages/contact-us">Contact Us</ALink>
                </li>
                <li id="menu-about" className={ pathname === '/pages/about-us' ? 'active' : '' }>
                    <ALink href="/pages/about-us">About Us</ALink>
                </li>
                {user && !user.isPro && (
                <li id="menu-aurora-pro" style={{color:'#ff0090ff'}} className={ pathname === '/pages/aurora-pro' ? 'active' : '' }>
                    <ALink href="/pages/aurora-pro">Join Aurora Pro!</ALink>
                </li>
                )}
                {user && user.isPro && (
                <li id="menu-pro-dashboard" style={{color:'#ff0090ff'}} className={ pathname === '/pages/pro-dashboard' ? 'active' : '' }>
                    <ALink href="/pages/aurora-pro">Your Aurora Pro</ALink>
                </li>
                )}
            </ul>
        </nav>
    )
}

export default MainMenu;