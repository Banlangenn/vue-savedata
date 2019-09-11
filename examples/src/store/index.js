import Vue from 'vue';
import Vuex from 'vuex';
import createPersiste from './../../../lib/vue-savedata.umd';

import productstore from './modules/productstore';

import user  from './modules/user';

const persiste = createPersiste({
    ciphertext: false,
    LS: {
        module: user,
        storePath: 'user' 
    }
})

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        productstore,
        user
    },
    plugins: [persiste]
})
