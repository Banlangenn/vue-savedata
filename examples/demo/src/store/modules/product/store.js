/* eslint-disable */
const productstore = {
    // namespaced: true,
    state: {
        brand: [],
        products: '1459856855',
        pictures: []
    },
    mutations: {
        nickname(state, nickname) {
            state.products = nickname;
        }
    },
    actions: {
        setactnickname(context, nickname) {
            context.commit('nickname', nickname);
        }
    }
};

export default productstore;
