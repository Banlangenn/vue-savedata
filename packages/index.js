/*
 * @Author:banlangen
 * @Date: 2018-08-12 01:05:13
 * @Last Modified by: banlangen
 * @Last Modified time: 2019-01-23 15:45:07
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
 function createPersiste ({
    SS = null,
    LS = null,
    saveName = 'saveData',
    setState = (state, Sg) => {
        window[Sg].setItem(saveName, JSON.stringify(state))
    },
    getState = (path, Sg) => {
        let data = null
        try {
            data = JSON.parse(window[Sg].getItem(saveName)) // 如果 没有key 会返回 null
        } catch (error) {
            return data
        }
        if (!data) return null
        return path ? {[path]: data} : data
    }
} = {}) {
    console.log('==============================')
    return store => {
        let data = ''
        if (LS && checkoutParams(LS)) {
            const localData = getState(LS.storePath, 'localStorage')
            data = localData
        } else { LS = null }
        if (SS && checkoutParams(SS)) {
            const sessionData = getState(SS.storePath, 'sessionStorage')
            if (data) {
                data = {...sessionData, ...data}
            } else {
                data = sessionData
            }
        } else { SS = null }
        if (!LS && !SS) {
            data = getState(null, 'localStorage')
        }
        data && store.replaceState({...store.state, ...data})
        // 当 store 初始化后调用
        store.subscribe((mutation, state) => {
        // 每次 mutation 之后调用
        if (LS && Object.prototype.hasOwnProperty.call(LS.module.mutations, mutation.type)) {
            setState(state[LS.storePath], 'localStorage')
            if(!SS) return
        }
        if (SS && Object.prototype.hasOwnProperty.call(SS.module.mutations, mutation.type)) {
            setState(state[SS.storePath], 'sessionStorage')
            return
        }
        !LS && !SS && setState(state, 'localStorage')
        })
    }
}

function checkoutParams(params) {
    if (!(params.hasOwnProperty('storePath') && params.hasOwnProperty('module'))) {
        console.warn(`SS,LS的key约定必须包含storePath、module`)
        return false
    }
    if (!(params.module.hasOwnProperty('state') && params.module.hasOwnProperty('mutations'))) {
        console.warn(`module约定必须要有mutations、state`)
        return false
    }
    return true
}



export default createPersiste