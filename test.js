// import Vue from 'vue';
// import Vuex from 'vuex';
const Vue = require('vue')
const Vuex = require('Vuex')
const createPersisted =  require('./lib/vue-savedata.umd.js').default

Vue.config.productionTip = false;
Vue.use(Vuex);




const module1 =  {
  state: {
    count: 8888
  },
  mutations: {
    increment1(state) {
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
      state.count+=2;
    }
  }
}







  it("初始化state和修改state存本地", () => {
    window.localStorage.setItem('saveData',  JSON.stringify({
      count: 333
    }))
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
    const plugin = createPersisted();
    store.replaceState = jest.fn();
    store.subscribe = jest.fn();
    plugin(store);

    expect(store.replaceState).toBeCalledWith( { module1: {count: 56789, age: 18}});
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
      JSON.stringify({ count: 6666})
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
      JSON.stringify({ count: 88888})
    );
  });

  it(' SS，LS更改状态 保存到本地', () => {
    const store = new Vuex.Store({ modules: {
      module1, module2
    } } );
    const plugin = createPersisted(
      { 
        SS: {
          module: module2,
          storePath: "module2"
        },
        LS: {
          module: module1,
          storePath: "module1"
        }
    }
    );

    plugin(store); 
    store._subscribers[0]({type: 'increment2'}, { module2:{count: 88888} });
    store._subscribers[0]({type: 'increment'}, { module2:{count: 6666} });
    expect(window.sessionStorage.getItem('saveData')).toBe(
      JSON.stringify({ count: 88888})
    );
    expect(window.localStorage.getItem('saveData')).toBe(
      JSON.stringify({ count: 6666})
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

