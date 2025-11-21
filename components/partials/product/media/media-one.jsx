import React, { useState } from 'react';
import { Magnifier } from 'react-image-magnifiers';

function MediaOne( props ) {
    const { product, adClass = 'product-gallery-vertical' } = props;
    const [selectedImage, setSelectedImage] = useState(0);

    if (!product) {
        return <div className="text-center p-5">Loading product...</div>;
    }

    if (!product.pictures || !Array.isArray(product.pictures) || product.pictures.length === 0) {
        return <div className="text-center p-5">No images available</div>;
    }

    const currentImage = product.pictures[selectedImage] || product.pictures[0];

    const handleThumbnailClick = (index) => {
        setSelectedImage(index);
    };

    return (
        <div className={ `product-gallery ${ adClass }` }>
            <div className="product-single-carousel">
                <div className="product-item">
                    <Magnifier
                        imageSrc={ currentImage.url }
                        imageAlt={ product.name || 'Product' }
                        largeImageSrc={ currentImage.url }
                        dragToMove={ false }
                        mouseActivation="hover"
                        cursorStyleActive="crosshair"
                        className="product-single-image"
                        style={{
                            maxWidth: '70%',
                            height: 'auto'
                        }}
                    />
                </div>
            </div>

            {product.pictures.length > 1 && (
                <div className="product-thumbs-wrap" style={{ marginTop: '20px' }}>
                    <div className="product-thumbs" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {product.pictures.map((item, index) => (
                            <div 
                                className={`product-thumb ${selectedImage === index ? 'active' : ''}`}
                                key={`product-thumb-${index}`}
                                onClick={() => handleThumbnailClick(index)}
                                style={{ 
                                    cursor: 'pointer',
                                    border: selectedImage === index ? '2px solid #000' : '2px solid transparent',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    width: '100px',
                                    height: '120px'
                                }}
                            >
                                <img 
                                    src={item.url} 
                                    alt={`Thumbnail ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder.jpg';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo( MediaOne );