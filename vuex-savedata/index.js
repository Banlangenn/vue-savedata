/**
 * 
 * @param {Object}
 * SS {storePath: xx, module: xx }
 * LS {storePath: xx, module: xx }
 * storePath  在store 上的路径
 * module     需要 本地存的 模块
 *  可以同时 存 LS SS
 * saveName   key
 * Storage    默认 localStorage 存  也可以 sessionStorage   （刷新不关闭 变量 刷新就没有了）
 * setState   本地存 可以自定义
 * getState   本地取  可以自定义
 * @returns {Store<any>}
 * TODU
 * 可以可以 同时支持 sessionStorage localStorage
 * ssModule: {}
 */
export default function createPersiste ({
    SS = null,
    LS = null,
    saveName = 'saveData',
    setState = (state, Sg) => {
        window[Sg].setItem(saveName, JSON.stringify(state))
    },
    getState = (path, Sg) => {
        const data = window[Sg].getItem(saveName) // 如果 没有key 会返回 null
        if (!data) return null
        return path ? {[path]: JSON.parse(data)} : JSON.parse(data)
        // return storePath ? {[storePath]: JSON.parse(data)} : JSON.parse(data)
    }
} = {}) {
    return store => {
        let data = ''
        if (LS) {
            const localData = getState(LS.storePath, 'localStorage')
            data = localData
        }
        if (SS) {
            const sessionData = getState(SS.storePath, 'sessionStorage')
            if (data) {
                data = {...sessionData, ...data}
            } else {
                data = sessionData
            }
        }
        if (!LS && !SS) {
            data = getState(null, 'localStorage')
        }
        data && store.replaceState({...store.state, ...data})
        // 当 store 初始化后调用
        store.subscribe((mutation, state) => {
        // 每次 mutation 之后调用
        if (LS && LS.module && LS.module['mutations'] && LS.module['mutations'][mutation.type]) {
            console.log(LS)
            setState(state[LS.storePath], 'localStorage')
            return
        }
        if (SS && SS.module && SS.module['mutations'] && SS.module['mutations'][mutation.type]) {
            setState(state[SS.storePath], 'sessionStorage')
            return
        }
        setState(state, 'localStorage')
        // mutation 的格式为 { type, payload }
        })
    }
}

