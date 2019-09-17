/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersisted from './../../../../packages';
// const createPersisted = require('./../../../../packages')
import user from './modules/user/store';
import product from './modules/product/store';
const persisted = createPersisted({
    saveName: 'aaa',
    ciphered: false,
    mode: 'LS',
    LS: [
        {
            module: user,
            storePath: 'user'
        },
        {
            module: product,
            storePath: 'product'
        },
    ]
});

// const persiste2 = createPersiste({
//     saveName: 'bbb',
//     ciphered: true,
//     mode: 'LS',
//     LS: [
//         {
//             module: user,
//             storePath: 'user'
//         },
//     ]
// });

Vue.use(Vuex);
const store = new Vuex.Store({
    modules: {
        user,
        product
    },
    plugins: [ persisted ]
});

export default store;
