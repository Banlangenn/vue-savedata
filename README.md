
# vue-savedata
 自动保存 vuex 中数据
## Requirements

* [Vue.js](https://vuejs.org) (v2.0.0+)
* [Vuex](http://vuex.vuejs.org) (v2.0.0+)

## Installation

```bash
$ npm install vue-savedata
$ yarn add vue-savedata
```

## Usage


```js
import createPersiste from 'vue-savedata'

const store = new Vuex.Store({
  // ...
  plugins: [createPersist()],
})
```
## API

### `createPersiste([options])`
下列选项（默认保存store中的每个数据到本地  ）

可以为您的特定需求配置插件:

* `saveName <String>`: 本地save的key  默认： savedata
* `SS <Object>`: {storePath: xx, module: xx }   storePath:在store 上的路径   module:需要 本地存的 模块
* `SL <Object>`: {storePath: xx, module: xx }  同上
* `getState <Function>`:  取本地时调用的方法  可自定义（SS,SL也会调用此方法）
* `setState <Function>`:  存本地时调用的方法  同上

（`温馨提示`: LS即Localstorage本地存储,    SS即sessionStorage本地存储,   LS、SS可同时使用也可单独使用 ）

```js
import createPersiste from 'vue-savedata'
import module1 from './modules/module1'
import module2 from './modules/module2'
const persiste = createPersiste({
	LS: {
		module: module1,
		storePath: 'module1'
	},
	SS: {
		module: module2,
		storePath: 'module2'
	}
})
const store = new Vuex.Store({
  // ...
  modules: {
   module1,
   module2
	 },
  plugins: [persiste],
})
```

## License

[MIT](https://github.com/robinvdvleuten/vue-savedata/blob/master/LICENSE) © [Robin van der Vleuten](https://www.robinvdvleuten.nl)
