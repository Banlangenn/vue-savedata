/*
 * @Author:banlangen
 * @Date: 2018-08-12 01:05:13
 * @Last Modified by: banlangen
 * @Last Modified time: 2019-03-13 14:40:39
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
    getState = (Sg) => {
        let data = null
        try {
            data = JSON.parse(window[Sg].getItem(saveName)) // 如果 没有key 会返回 null
        } catch (error) {
            return data
        }
        if (!data) return null
        return data
    },
    checkParams = (params) => {
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
} = {}){
    // SS LS  可以支持数组
    // 所以 存取都要数组 
    return store => {
        let _SS = !SS || Array.isArray(SS) ? SS : [SS],
        _LS = !LS || Array.isArray(LS) ? LS : [LS],data,
        initSSData = null,
        initLSData = null
        if (_LS) {
            // 一次就全部取出来了
            for (const item of _LS) {
                if(!checkParams(item)){
                    _LS = null
                    break;
                }
            }
            if(_LS) {
                initLSData =  data =  getState('localStorage')
            }
        }
        if (_SS) {
              // 一次就全部取出来了
              for (const item of _SS) {
                if(!checkParams(item)){
                    _SS = null
                    break;
                }
            }
            // data 存在不能这样子取
           
            if (_SS) {
                initSSData = getState('sessionStorage')
                // LS 是否有
                data = data ? {...data, ...initSSData} : initSSData 
            }
        }
        if (!_LS && !_SS) {
            data = getState('localStorage')
        }
        data && store.replaceState({...store.state, ...data})
        // 当 store 初始化后调用
        store.subscribe((mutation, state) => {
            // 1. SS = null
            // 2. LS = null
            // 3. LS SS = null
            // 4. LS SS != null

        // 每次 mutation 之后调用
        if (_LS) {
            let localData = null
            for (const LSM of _LS) {
                // 属于当前模块  改
                // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
                // console.log(LSM)
                if (Object.prototype.hasOwnProperty.call(LSM.module.mutations, mutation.type)) {
                    localData = {...localData, [LSM.storePath]: state[LSM.storePath]}
                }
            }
            if (localData) {
                initLSData = {...initLSData,...localData}
                setState(initLSData, 'localStorage')
            }
            if(!_SS) return
        }
        if (_SS) {
            let sessionData = null
            for (const SSM of _SS) {
                // 属于当前模块  改
                if (Object.prototype.hasOwnProperty.call(SSM.module.mutations, mutation.type)) {
                    sessionData = {...sessionData, [SSM.storePath]: state[SSM.storePath]}
                }
            }
            // 要和以前的合并
            if (sessionData) {
                initSSData = {...initSSData,...sessionData}
                setState(initSSData, 'sessionStorage')
            }
            return
        }
        !LS && !SS && setState(state, 'localStorage')
        })
    }
}   



module.exports = createPersiste
// export default createPersiste