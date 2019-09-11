const state = {
    name: 'saveData',
    age: 70
};

const mutations = {
    ageIncrement(state) {
        state.age += 20;
    },
    ageDecrement(state) {
        state.age -= 20;
    }
};

const actions = {};

export default {
    state,
    mutations,
    actions
};
