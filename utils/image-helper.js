/**
 * Get the correct image URL
 * Images from database already have full paths like /images/products/tshirt/858.jpg
 * Just return the URL as-is
 */
export const getImageUrl = (url) => {
    if (!url) return '/images/placeholder.jpg';
    
    // If URL already starts with http or /, use it as-is
    if (url.startsWith('http') || url.startsWith('/')) {
        return url;
    }
    
    // Otherwise, add leading slash
    return `/${url}`;
};