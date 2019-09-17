/*global it expect window jest*/
/*eslint-disable*/

import createPersisted from './../packages'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.config.productionTip = false;
Vue.use(Vuex);

// 用  store._subscribers[0]({type: 'increment2'}, { module2:{count: 88888} });  可以脱离 本地数 mock 数据  
// 没办法 全局使用 -  会被改掉

const module1 =  {
  
    state: {
        count100: 100,
        count200: 200
    },
    mutations: {
        increment1(state) {
            state.count100++;
        },
        decrement1(state) {
            state.count100--;
        }
    }
}

const module2 =  {
    state: {
        count: 666
    },
    mutations: {
        increment2(state) {
            state.count+=2;
        },
        decrement2(state) {
            state.count-=2;
        }
    }
}

//  数组情况 和 base解析
const module3 =  {
    state: {
        one: 666,
        count: {
            c: 3
        }
    },
    mutations: {
        increment3(state) {
            state.count+=3;
        },
        decrement3(state) {
            state.count-=3;
        }
    }
}
function clear () {
    window.localStorage.clear()
    window.sessionStorage.clear()
}

// 二级 深度合并
it("二级 深度合并", () => {
    
    window.localStorage.setItem('saveData',  JSON.stringify({
        module1: {
            one: 333,
            count: {
                a: 2
            }
        }
    }))
    const store = new Vuex.Store({ modules: {
        module1: module3
    } } );
    store.replaceState = jest.fn()
    store.subscribe = jest.fn()
    const plugin = createPersisted(
        {
            LS: {
                //  新添属性3
                module: module3,
                storePath: "module1"
            }
        }   
    );
    plugin(store);
    expect(store.replaceState).toBeCalledWith( { 
        module1: {
            one: 333,
            count: {
                a: 2,
                c: 3
            }
        } 
    });
    expect(store.subscribe).toBeCalled();
});


it("base64 解析是否正确", () => {
    var encode = (data) => {
        return window.btoa(encodeURIComponent(JSON.stringify(data)))
    }
    var decode = (data) => {
        return  JSON.parse(decodeURIComponent(window.atob(data)))
    }
    expect(JSON.stringify(decode(encode({"name":"saveData"})))).toBe(JSON.stringify({"name":"saveData"}));
});



it("初始化state和修改state存本地", () => {
    clear()
    window.localStorage.setItem('saveData',  JSON.stringify({
        module1: {
            count: 333
        }
    }))
    const store = new Vuex.Store({ modules: {
        module1
    } } );
    store.replaceState = jest.fn();
    store.subscribe = jest.fn();
    const plugin = createPersisted(
        {
            LS: {
                module: module1,
                storePath: "module1"
            }
        }   
    );
    plugin(store);
    expect(store.replaceState).toBeCalledWith( { module1: { count: 333 ,
        count100: 100,
        count200: 200
    } });
    expect(store.subscribe).toBeCalled();
});

it("默认存全部", () => {
    clear()
    const all =  {
        state: {
            count100: 100,
            count200: 200
        },
        mutations: {
            increment1(state) {
                state.count100++;
            }
        }
    }
    const store = new Vuex.Store({
        modules: {
            all
        },  state: {
            count: 1
        }
    });
    const plugin = createPersisted({
        mode: 'LS'
    });
    plugin(store);
    store.commit("increment1")
    // store._subscribers[0]({type: 'increment1'}, { module1:{count: 56789} });
    // store._subscribers[0]({type: 'increment1'}, { module1:{count: 56789, age: 18} });
    expect(window.localStorage.getItem('saveData')).toBe(
        JSON.stringify({ 
            count: 1,
            all: {
                count100: 101,
                count200: 200
            }
        })
    );
});

it("默认取全部", () => {
    clear()
    const store = new Vuex.Store({ modules: {
        module1
    } } );
    window.localStorage.setItem('saveData',  JSON.stringify({
        module1: {
            count: 666666
        }
    }))
    const plugin = createPersisted({
        mode: 'LS'
    });
    store.replaceState = jest.fn();
    store.subscribe = jest.fn();
    plugin(store);
    expect(store.replaceState).toBeCalledWith({ module1: {count: 666666,
        count100: 100,
        count200: 200
    }});
    expect(store.subscribe).toBeCalled();
});

it(' LS更改状态 保存到本地', () => {
    clear()
    const store = new Vuex.Store({ modules: {
        module1,
    } } );
    const plugin = createPersisted(
        { LS:
          {
              module: module1,
              storePath: "module1"
          }
        }
    );
  
    plugin(store);
    store._subscribers[0]({type: 'increment1'}, { module1:{count: 6666} });
    expect(window.localStorage.getItem('saveData')).toBe(
        JSON.stringify({ module1:{count: 6666} })
    );
});

it(' SS更改状态 保存到本地', () => {
    clear()
    const store = new Vuex.Store({ modules: {
        module2,
    } } );
    const plugin = createPersisted(
        { SS:
          {
              module: module2,
              storePath: "module2"
          }
        }
    );
  
    plugin(store);
    store._subscribers[0]({type: 'increment2'}, { module2:{count: 88888} });
    // console.log(store.)
    expect(window.sessionStorage.getItem('saveData')).toBe(
        JSON.stringify({module2:{count: 88888}})
    );
});

it(' SS，LS更改状态 保存到本地', () => {
    clear()
    const store = new Vuex.Store({ state:{
        name: "saveData"
    },
    modules: {
        module1, module2, user: module2
    }});
    const plugin = createPersisted(
        { 
            SS: [
                {
                    module: module2,
                    storePath: "module2"
                },
                {
                    module: module2,
                    storePath: "user"
                }
            ],
            LS: {
                module: module1,
                storePath: "module1"
            }
        }
    );

    plugin(store); 
    // console.dir(store)
    // 这边是直接调用  那个方法 到时候会传入正确的 state的 
    store._subscribers[0]({type: 'increment2'}, {module2:{count: 88888},module1:{count: 6666},user:{age:18}});
    store._subscribers[0]({type: 'increment1'}, {module2:{count: 88888},module1:{count: 6666},user:{age:18}});
    expect(window.sessionStorage.getItem('saveData')).toBe(
        JSON.stringify({ module2:{count: 88888},user:{age:18} })
    );
    expect(window.localStorage.getItem('saveData')).toBe(
        JSON.stringify({ module1:{count: 6666} })
    );
});


  

it('SS效验不通过module,取存全部', () => {
    
    window.localStorage.setItem('saveData',  JSON.stringify({
        module1: {count: 123456789}
    }))
    const store = new Vuex.Store({ modules: {
        module1
    } } );

    store.replaceState = jest.fn();
    store.subscribe = jest.fn();
    const plugin = createPersisted(
        { SS: {
            module: module2,
        }  
        }
    );

    plugin(store);

    expect(store.replaceState).toBeCalledWith( {module1: {
        count: 123456789,
        count100: 100,
        count200: 200
    }});
    expect(store.subscribe).toBeCalled();
});

it('LS效验不通过module,取存全部', () => {
    
    window.localStorage.setItem('saveData',  JSON.stringify({
        module1: {count: 123456789}
    }))
    const store = new Vuex.Store({ modules: {
        module1
    } } );

    store.replaceState = jest.fn();
    store.subscribe = jest.fn();
    const plugin = createPersisted(
        { LS: {
            module: module2,
        }  
        }
    );

    plugin(store);

    expect(store.replaceState).toBeCalledWith( {module1: {count: 123456789,
        count100: 100,
        count200: 200}});
    expect(store.subscribe).toBeCalled();
});

// LS  不合法
//  加密 解密


   
it("在本地存不合法的数据 null", () => {
    
    window.localStorage.setItem('saveData', JSON.stringify(null));
  
    const store = new Vuex.Store({ modules: {
        module1
    } } );
    store.replaceState = jest.fn();
    store.subscribe = jest.fn();
  
    const plugin = createPersisted(
        { LS:
          {
              module: module1,
              storePath: "module1"
          }
        }
    );
    plugin(store);
    expect(store.replaceState).not.toBeCalled();
    expect(store.subscribe).toBeCalled();
})


it("在本地存JSON不能解析数据 <不合法>", () => {
    
    window.localStorage.setItem('saveData', '<不合法>');
  
    const store = new Vuex.Store({ modules: {
        module1
    } } );
    store.replaceState = jest.fn();
    store.subscribe = jest.fn();
  
    const plugin = createPersisted(
        { LS:
          {
              module: module1,
              storePath: "module1"
          }
        }
    );
    plugin(store);
    expect(store.replaceState).not.toBeCalled();
    expect(store.subscribe).toBeCalled();
})

