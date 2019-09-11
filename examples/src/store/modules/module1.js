const state = {
    count: 30,
    complex: {
        name: 'saveData'
    }
};

const mutations = {
    increment1(state) {
        state.count += 10;
        state.complex.name = 'increase';
    },
    decrement1(state) {
        state.count -= 10;
    }
};

const actions = {};

export default {
    state,
    mutations,
    actions
};
