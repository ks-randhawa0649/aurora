import { useState, useEffect } from "react";
import Modal from "react-modal";
import Cookie from "js-cookie";

const modalStyles = {
    content: {
        position: "relative"
    },
    overlay: {
        background: 'rgba(0,0,0,.4)',
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex'
    }
};

Modal.setAppElement( "#__next" );

export default function NewsletterModal() {
    const [ modalState, setModalState ] = useState( false );
    const [ noMore, setNoMore ] = useState( false );

    useEffect( () => {
        let timer;
        Cookie.get( "hideNewsletter" ) || ( timer = setTimeout( () => {
            setModalState( true );
        }, 5000 ) );

        return () => {
            timer && clearTimeout( timer );
        };
    }, [] );

    function closeModal() {
        document.querySelector( ".ReactModal__Overlay.newsletter-modal-overlay" ).classList.add( 'removed' );
        document.querySelector( ".newsletter-popup.ReactModal__Content" ).classList.remove( "ReactModal__Content--after-open" );

        setTimeout( () => {
            setModalState( false );

            noMore && Cookie.set( "hideNewsletter", 'true', { expires: 7, path: window.location.pathname } );
        }, 250 );
    }

    function handleChange( event ) {
        setNoMore( event.target.checked );
    }

    return (
        <Modal
            isOpen={ modalState }
            style={ modalStyles }
            onRequestClose={ closeModal }
            shouldReturnFocusAfterClose={ false }
            overlayClassName="newsletter-modal-overlay"
            className="newsletter-popup bg-img"
        >
            <div className="newsletter-popup" id="newsletter-popup">
                <div className="newsletter-content">
                    <h4 className="text-uppercase text-white newsletter-h4">Up to <span className="text-primary">20% Off</span></h4>
                    <h2 className="font-weight-semi-bold text-white newsletter-h2">Sign up to <span>AURORA</span></h2>
                    <p className="text-white newsletter-p">Subscribe to the Aurora eCommerce newsletter to receive timely updates from your favorite products.</p>
                    <form action="#" method="get" className="input-wrapper input-wrapper-inline input-wrapper-round newsletter-form">
                        <input type="email" className="form-control email newsletter-input" name="email" id="email2" placeholder="Email address here..." required aria-label="newsletter"/>
                        <button className="btn btn-dark newsletter-btn" type="submit">SUBMIT</button>
                    </form>
                    <div className="form-checkbox justify-content-center newsletter-checkbox">
                        <input type="checkbox" value={ noMore } className="custom-checkbox" id="hide-newsletter-popup" onChange={ handleChange } name="hide-newsletter-popup" required />
                        <label htmlFor="hide-newsletter-popup">Don't show this popup again</label>
                    </div>
                </div>
                <button title="Close (Esc)" type="button" className="mfp-close" onClick={ closeModal }><span>×</span></button>
            </div>

            <style jsx>{`
                .newsletter-popup {
                    background-image: url(/images/kunwar.jpg);
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    height: 60vh;
                    width: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .newsletter-content {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    max-width: 600px;
                    padding: 40px;
                }

                .newsletter-content h4,
                .newsletter-content h2,
                .newsletter-content p {
                    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
                }

                .newsletter-checkbox {
                    color: white;
                    margin-top: 15px;
                }

                .newsletter-checkbox input {
                    border-color: white;
                }

                @media (max-width: 768px) {
                    .newsletter-popup {
                        height: auto !important;
                        min-height: 500px !important;
                        background-image: url(/images/kunwar.jpg) !important;
                        background-size: cover !important;
                        background-position: center center !important;
                        padding: 40px 20px !important;
                    }

                    .newsletter-content {
                        padding: 20px 15px !important;
                        width: 100%;
                    }

                    .newsletter-h4 {
                        font-size: 14px !important;
                        margin-bottom: 8px !important;
                        line-height: 1.4 !important;
                    }

                    .newsletter-h2 {
                        font-size: 20px !important;
                        margin-bottom: 10px !important;
                        line-height: 1.3 !important;
                    }

                    .newsletter-p {
                        font-size: 12px !important;
                        margin-bottom: 15px !important;
                        line-height: 1.5 !important;
                    }

                    .newsletter-form {
                        flex-direction: column !important;
                        gap: 10px !important;
                        width: 100% !important;
                        margin-bottom: 15px !important;
                    }

                    .newsletter-input {
                        width: 100% !important;
                        font-size: 13px !important;
                        padding: 12px 15px !important;
                        margin: 0 0 10px 0 !important;
                        display: block !important;
                    }

                    .newsletter-btn {
                        width: 100% !important;
                        padding: 12px 20px !important;
                        font-size: 14px !important;
                        margin: 0 !important;
                        display: block !important;
                    }

                    .newsletter-checkbox {
                        font-size: 11px !important;
                        margin-top: 15px !important;
                        display: flex !important;
                        align-items: flex-start !important;
                        justify-content: center !important;
                        gap: 8px !important;
                        flex-wrap: wrap !important;
                    }

                    .newsletter-checkbox input {
                        flex-shrink: 0;
                        margin-top: 2px;
                    }

                    .newsletter-checkbox label {
                        flex: 1;
                        line-height: 1.5 !important;
                        max-width: 200px;
                        text-align: left;
                    }

                    .mfp-close {
                        top: 10px !important;
                        right: 10px !important;
                        font-size: 32px !important;
                    }
                }

                @media (max-width: 480px) {
                    .newsletter-popup {
                        min-height: 450px !important;
                        padding: 30px 15px !important;
                    }

                    .newsletter-h2 {
                        font-size: 18px !important;
                    }

                    .newsletter-p {
                        font-size: 11px !important;
                    }
                }
            `}</style>
        </Modal>
    );
}