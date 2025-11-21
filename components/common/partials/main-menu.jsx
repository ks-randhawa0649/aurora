import { useRouter } from 'next/router';

import ALink from '~/components/features/custom-link';

import { mainMenu } from '~/utils/data/menu';

function MainMenu() {
    const pathname = useRouter().pathname;

    return (
        <nav className="main-nav">
            <ul className="menu">
                <li id="menu-home" className={ pathname === '/' ? 'active' : '' }>
                    <ALink href='/'>Home</ALink>
                </li>

                <li id="menu-shop" className={ pathname === '/pages/shop' ? 'active' : '' }>
                    <ALink href='/pages/shop'>Products</ALink>
                </li>
                <li id="menu-about" className={ pathname === '/pages/contact-us' ? 'active' : '' }>
                    <ALink href="/pages/contact-us">About Us</ALink>
                </li>
            </ul>
        </nav>
    )
}

export default MainMenu;