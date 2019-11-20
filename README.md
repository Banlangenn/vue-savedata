
# vue-savedata 
[![Build Status](https://www.travis-ci.org/Banlangenn/vue-savedata.svg?branch=master)](https://www.travis-ci.org/Banlangenn/vue-savedata)  [![codecov](https://codecov.io/gh/Banlangenn/vue-savedata/branch/master/graph/badge.svg)](https://codecov.io/gh/Banlangenn/vue-savedata)

 vuex 指定【模块】的state持久化（配置简，性能佳，体积小） 
 ## updata 2.x
* 添加 ciphertext密文支持
* 添加 SS LS 支持数组 （每一个module要添加store中modules中）
* 添加 默认储存位置配置
* 支持 模块命名空间
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
// 默认全部持久化，你也可以通过一丢丢配置项,指定数据持久化
const store = new Vuex.Store({
  // ...
  plugins: [createPersiste()],
})
```
## API

### `createPersiste([options])`
下列选项（默认保存store中的每个数据到本地  ）
### （`温馨提示`: LS即Localstorage本地存储,    SS即sessionStorage本地存储,   LS、SS可同时使用,也可单独使用 ）
可以为您的特定需求配置插件:
(参数都是可选的：有默认值)
* `saveName <String>`: 本地save的key  默认： savedata
* `ciphertext <Boolean>`: 是不是密文存本地(base64) 默认 false
* `mode <String>`: 默认存储模式（LS,SS配置不存在时有效） 默认： LS
* `MMD <Number>`: 模块 深度合并, 深度值  默认：2(如果出现数据丢失可以尝试把这个开高一点)
* `SS <Object> || <Array>`: { storePath: xx, module: xx }   __注：storePath:(和Vuex中的option.modules:{key：value}的key,一,一对应)__
* `SL <Object> || <Array>`: { storePath: xx, module: xx }  同上, 支持多个模块，传入数组



```js
import createPersiste from 'vue-savedata'
import module1 from './modules/module1'
import module2 from './modules/module2'
const persiste = createPersiste({
	ciphertext: true, // 加密存本地, 默认为false
	LS: {
		module: module1,
		storePath: 'module100' // __storePath:(和Vuex中的option.modules:{key：value}的key,一,一对应)__
	},
	SS: {
		module: module2,
		storePath: 'module2' 
	}
})
/**
 * 
 * 数组 支持传入多个模块,相应，__storePath:和Vuex中的option.modules:{key：value}的key,一一对应__
 * const persiste = createPersiste({
	LS:[{
		module: module1,
		storePath: 'module100' 
	}，...],
	SS: [{
		module: module2,
		storePath: 'module2' 
	}，...]
})
 ***/
const store = new Vuex.Store({
  	// ...
	modules: {
		module100: module1,
		module2
	},
	plugins: [persiste],
})
```

