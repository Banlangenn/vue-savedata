!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var o=t();for(var r in o)("object"==typeof exports?exports:e)[r]=o[r]}}(window,function(){return function(e){var t={};function o(r){if(t[r])return t[r].exports;var n=t[r]={i:r,l:!1,exports:{}};return e[r].call(n.exports,n,n.exports,o),n.l=!0,n.exports}return o.m=e,o.c=t,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(r,n,function(t){return e[t]}.bind(null,n));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";function r(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{},r=Object.keys(o);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(o).filter(function(e){return Object.getOwnPropertyDescriptor(o,e).enumerable}))),r.forEach(function(t){n(e,t,o[t])})}return e}function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function u(e){return e.hasOwnProperty("storePath")&&e.hasOwnProperty("module")?!(!e.module.hasOwnProperty("state")||!e.module.hasOwnProperty("mutations"))||(console.warn("module约定必须要有mutations、state"),!1):(console.warn("SS,LS的key约定必须包含storePath、module"),!1)}o.r(t),t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.SS,o=void 0===t?null:t,a=e.LS,l=void 0===a?null:a,i=e.saveName,c=void 0===i?"saveData":i,s=e.setState,f=void 0===s?function(e,t){window[t].setItem(c,JSON.stringify(e))}:s,p=e.getState,d=void 0===p?function(e,t){var o=null;try{o=JSON.parse(window[t].getItem(c))}catch(e){return o}return o?e?n({},e,o):o:null}:p;return console.log("=============================="),function(e){var t="";if(l&&u(l)?t=d(l.storePath,"localStorage"):l=null,o&&u(o)){var n=d(o.storePath,"sessionStorage");t=t?r({},n,t):n}else o=null;l||o||(t=d(null,"localStorage")),t&&e.replaceState(r({},e.state,t)),e.subscribe(function(e,t){l&&Object.prototype.hasOwnProperty.call(l.module.mutations,e.type)&&(f(t[l.storePath],"localStorage"),!o)||(o&&Object.prototype.hasOwnProperty.call(o.module.mutations,e.type)?f(t[o.storePath],"sessionStorage"):!l&&!o&&f(t,"localStorage"))})}}}])});