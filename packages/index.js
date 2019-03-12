/*
 * @Author:banlangen
 * @Date: 2018-08-12 01:05:13
 * @Last Modified by: banlangen
 * @Last Modified time: 2019-03-12 18:23:15
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
    data = null,
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
    let _storage
    if (data) {
        _storage =  Array.isArray(data) ? data : [data]
    }
    // 初始化检查参数是否合法
  
   for (const item of _storage ) {
       if (!checkoutParams(item)) {
            _storage  = null
            break
       }
   }
    return store => {
        let data = ''
        // if (LS && checkoutParams(LS)) {
        //     const localData = getState(LS.storePath, 'localStorage')
        //     data = localData
        // } else { LS = null }
        // if (SS && checkoutParams(SS)) {
        //     const sessionData = getState(SS.storePath, 'sessionStorage')
        //     if (data) {
        //         data = {...sessionData, ...data}
        //     } else {
        //         data = sessionData
        //     }
        // } else { SS = null }


        if (!_storage) {
            data = getState(null, 'localStorage')
        } else {
            data = _storage.reduce((prv,next) => {
                const curr = getState(next.storePath, next.storage)
                return curr ? { [next.storePath]: { ...prv,...curr } } : curr
            },{})
            // let isv = true, tepm = {}
            // for (const module of storage ) {
            //     if (checkoutParams(module)) {
            //         tepm = {...tepm, ...getState(module.storePath, module.storage)}
            //     } else {
            //         isv = false
            //         break
            //     }
            //     if (isv) data = tepm
            // }
            console.log('=================>============>')
            console.log('=================>============>')
            console.log('=================>============>')
            console.log('=================>============>')
            console.log(data)
        }
        data && store.replaceState({...store.state, ...data})
        // 当 store 初始化后调用
        store.subscribe((mutation, state) => {
        // 每次 mutation 之后调用
            if (!_storage) {
                setState(state, 'localStorage')
                return
            }
            for (const module of object) {
                if (Object.prototype.hasOwnProperty.call(module.module.mutations, mutation.type)) {
                    setState(state[module.storePath], module.storage)
                }
            }
        })
    }
}

function checkoutParams(params) {
    console.log(params)
    if (!(params.hasOwnProperty('storePath') && params.hasOwnProperty('module'))) {
        console.warn(`key约定必须包含storePath、module`)
        return false
    }
    if (!(params.module.hasOwnProperty('state') && params.module.hasOwnProperty('mutations'))) {
        console.warn(`module约定必须要有mutations、state`)
        return false
    }
    if (!params.hasOwnProperty('storage') || params.storage !== 'localStorage' || params.storage !== 'sessionStorage') {
        console.warn(`module约定必须要有storage， 值为localStorage或者sessionStorage`)
        return false
    }
    return true
}


module.exports = createPersiste
// export default createPersiste