/*eslint no-undef: "error"*/
/*eslint-env browser*/

/*
 * @Author:banlangen
 * @Date: 2018-08-12 01:05:13
 * @Last Modified by: banlangen
 * @Last Modified time: 2019-11-20 09:51:20
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
    mode =  'LS',
    MMD = 2, //  模块合并深度  => 
    ciphertext = false,
    encode = (data) => {
        return window.btoa(encodeURIComponent(JSON.stringify(data)))
    },
    decode = (data) => {
        return  JSON.parse(decodeURIComponent(window.atob(data)))
    },
    setState = (state, Sg) => {
        state = ciphertext ? encode(state) : JSON.stringify(state)
        window[Sg].setItem(saveName, state)
    },
    getState = (Sg) => {
        try {
            let data = window[Sg].getItem(saveName) // 如果 没有key 会返回 null
            if (!data) return null
            return ciphertext ? decode(data) : JSON.parse(data)
        } catch (error) {
            return null
        }
    },
    checkParams = (params) => {
        if (!(params.hasOwnProperty('storePath') && params.hasOwnProperty('module'))) {
            console.warn(`SS,LS的key约定必须包含storePath、module`)
            return false
        }
        // if (!(params.module.hasOwnProperty('state') && params.module.hasOwnProperty('mutations'))) {
        //     console.warn(`module约定必须要有mutations、state`)
        //     return false
        // }
        return true
    },
    deepMerge = (origin, target, deep) => {
        // target  覆盖  origin  // 
        if (!deep) return target
        for (let key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                origin[key] = origin[key] && Object.prototype.toString.call(origin[key]) === '[object Object]' ? deepMerge(origin[key], target[key], --deep) : origin[key] = target[key]
            }
        }
        return origin
    }
} = {}) {
    // 辅助函数 减少代码
    function typeHandle(namespaced, type) {
        if (namespaced) {
            const arr = type.split('/')
            return arr[arr.length - 1]
        }
        return type
    }
    // 处理函数
    function dataHandle(data, mutation, state) {
        let result = null
        // data  组件传入的模块
        for (const item of data) {
            // 处理命名空间
            const type = typeHandle(item.module.namespaced, mutation.type)
            // 属于当前模块  改
            //  2019.11.20  新加-- 屏蔽掉不合法的 module
            const mutations = item.module.mutations 
            if (!mutations) continue
            //  2019.11.20  新加-- 屏蔽掉不合法的 module
            
            if (Object.prototype.hasOwnProperty.call(mutations, type)) {
                result = {...result, [item.storePath]: state[item.storePath]}
                //  不能break  不同模块 可能有同名的mutation， 需要触发储存
            }
        }
        return result
    }
    // SS LS  可以支持数组
    // 所以 存取都要数组
    return store => {
        let _SS = !SS || Array.isArray(SS) ? SS : [SS]
        let _LS = !LS || Array.isArray(LS) ? LS : [LS]
        let data
        let initSSData = null
        let initLSData = null
        if (_LS) {
            // 一次就全部取出来了
            for (const item of _LS) {
                if (!checkParams(item)) {
                    _LS = null
                    break
                }
            }
            if (_LS) {
                initLSData =  data =  getState('localStorage')
            }
        }
        if (_SS) {
            // 一次就全部取出来了
            for (const item of _SS) {
                if (!checkParams(item)) {
                    _SS = null
                    break
                }
            }
            // data 存在不能这样子取
            if (_SS) {
                initSSData = getState('sessionStorage')
                // LS 是否有
                // 合并数据
                data = initLSData ? {...initLSData, ...initSSData} : initSSData
            }
        }
        if (!_LS && !_SS) {
            // 'localStorage'
            data = getState(`${mode !== 'SS' ? 'localStorage' : 'sessionStorage'}`)
        }
        data && store.replaceState(deepMerge(store.state, data, MMD + 1)) // {...store.state, ...data}
        // 当 store 初始化后调用
        store.subscribe((mutation, state) => {
            // 1. SS = null
            // 2. LS = null
            // 3. LS SS = null
            // 4. LS SS != null
            // 每次 mutation 之后调用
            // 这两个可以合并为一个
            if (_LS) {
                let localData = dataHandle(_LS, mutation, state)
                if (localData) {
                    //  本身已经合并过了  为什么还要合并历史（initLSData）
                    //  localData  拿到的是  当前模块的  value  =>  LS  是数组，可能会有多个 要合并其余的
                    // 二级 value  肯定不一样 --Object  不允许重复key
                    initLSData = {...initLSData, ...localData}
                    setState(initLSData, 'localStorage')
                }
                if (!_SS) return
            }
            
            if (_SS) {
                let sessionData = dataHandle(_SS, mutation, state)
                // 要和以前的合并
                if (sessionData) {
                    initSSData = {...initSSData, ...sessionData}
                    setState(initSSData, 'sessionStorage')
                }
                return
            }
            !LS && !SS && setState(state, `${mode !== 'SS' ? 'localStorage' : 'sessionStorage'}`)
        })
    }
}

export default createPersiste
// module.exports = createPersiste