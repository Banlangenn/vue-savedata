// import Vue from 'vue';
// import Vuex from 'vuex';
const Vue = require('vue')
const Vuex = require('Vuex')
// const createPersisted =  require('./lib/vue-savedata.umd.js').default
const createPersisted =  require('./packages/index')
// import createPersiste from "./packages/index"
// console.log(createPersiste)
Vue.config.productionTip = false;
Vue.use(Vuex);




const module1 =  {
  
  state: {
    count100: 100,
    count200: 200
  },
  mutations: {
    increment1(state) {
      console.log('increment1increment1increment1')
      state.count++;
    },
    decrement1(state) {
      state.count--;
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

const module3 =  {
  state: {
    count: 666
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



// it("LS SS 取本地", () => {
//   window.localStorage.setItem('saveData',  JSON.stringify({
//     module1: {
//       count: 333
//     }
//   }))
//   window.localStorage.setItem('saveData',  JSON.stringify({
//     module2: {
//       count: 666
//     }
//   }))
//   const store = new Vuex.Store({ modules: {
//     module1, module2
//   } } );
//   store.replaceState = jest.fn();
//   store.subscribe = jest.fn();
//   const plugin = createPersisted(
//     {
//       LS: {
//         module: module1,
//         storePath: "module1"
//       },
//       SS: {
//         module: module2,
//         storePath: "module2"
//       }
// } 
       
//   );
//   plugin(store);
//   expect(store.replaceState).toBeCalledWith( { module1: { count: 333 },module2: {
//     count: 666
//   } });
//   expect(store.subscribe).toBeCalled();
// });





  it("初始化state和修改state存本地", () => {
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
    expect(store.replaceState).toBeCalledWith( { module1: { count: 333 } });
    expect(store.subscribe).toBeCalled();
  });

  it("默认存全部", () => {
    const store = new Vuex.Store({ modules: {
      module1
    } } );
    const plugin = createPersisted();
    plugin(store);
    store._subscribers[0]({type: 'increment1'}, { module1:{count: 56789} });
    store._subscribers[0]({type: 'increment1'}, { module1:{count: 56789, age: 18} });
    expect(window.localStorage.getItem('saveData')).toBe(
      JSON.stringify({ module1: {count: 56789, age: 18}})
    );
  });

  it("默认取全部", () => {
    const store = new Vuex.Store({ modules: {
      module1
    } } );
    window.localStorage.setItem('saveData',  JSON.stringify({
      module1: {
        count: 666666
      }
    }))
    const plugin = createPersisted();
    store.replaceState = jest.fn();
    store.subscribe = jest.fn();
    plugin(store);
    expect(store.replaceState).toBeCalledWith({ module1: {count: 666666}});
    expect(store.subscribe).toBeCalled();
  });

  it(' LS更改状态 保存到本地', () => {
    const store = new Vuex.Store({ modules: {
      module1
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
  // console.log(store.)
    expect(window.localStorage.getItem('saveData')).toBe(
      JSON.stringify({ module1:{count: 6666} })
    );
  });
  it(' SS更改状态 保存到本地', () => {
    const store = new Vuex.Store({ modules: {
      module2
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


  

  it('不合法的module,取存全部', () => {
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

    expect(store.replaceState).toBeCalledWith( {module1: {count: 123456789}});
    expect(store.subscribe).toBeCalled();
  });





   
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

