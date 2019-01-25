import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from '../reducers';

const loggerMiddleware = createLogger();

const initState = {
    modal: {
        isOpen: false,
        title: 'Заголовок окна',
        subTitle: 'надзаголовок',
    },
    filters: [],
    lotFilters: [],
    pages: {
        perPage: 18,
        current: 0,
        count: 0
    },
    priceOrder: null
};

const configureStore = (initialState = initState) => {
    let middleware = [thunkMiddleware];

    if (process.env.NODE_ENV !== 'production') {
        middleware = [...middleware, loggerMiddleware];
    }

    const store = createStore(reducer, initialState,
        applyMiddleware(...middleware)
    );

    return store;
}

export default configureStore;