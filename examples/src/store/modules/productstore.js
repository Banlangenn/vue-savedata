const state = {
    count: 50
};

const mutations = {
    increment2(state) {
        state.count += 20;
    },
    decrement2(state) {
        state.count -= 20;
    }
};

const actions = {};

export default {
    state,
    mutations,
    actions
};
