import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

// Create a noop storage for SSR
const createNoopStorage = () => {
    return {
        getItem(_key) {
            return Promise.resolve(null);
        },
        setItem(_key, value) {
            return Promise.resolve(value);
        },
        removeItem(_key) {
            return Promise.resolve();
        },
    };
};

// Use localStorage on client, noop on server
const storage = typeof window !== 'undefined' 
    ? createWebStorage('local') 
    : createNoopStorage();

export default storage;
