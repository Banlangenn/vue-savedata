/* eslint-disable */
const user = {
    namespaced: true,
    state: {
        nickname: ''
    },
    mutations: {
        nickname(state, nickname) {
            state.nickname = nickname;
        }
    },
    actions: {
        setactnickname(context, nickname) {
            context.commit('nickname', nickname);
        }
    }
};

export default user;
