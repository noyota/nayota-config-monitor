module.exports=function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){const n=r(1).EventEmitter,o=r(2),u=r(3);e.exports=class extends n{constructor(e,t){super(),t.route("/face-camera/records").post(u(async(e,t)=>{const r=e.body,n=r.mac;this.emit(`node${n}`,{0:JSON.stringify(r),1:r.faceId,2:r.role}),t.json({})}))}async config(e){const t=e.attribute.filter(e=>"url"===e.key)[0].value;await new Promise((r,n)=>{o.post({url:`${e.url}/linmu/server/url`,form:{url:t}},function(e,t,r){e&&n(e),JSON.parse(r).success?t():n("参数错误")})})}write(e,t,r,n){}}},function(e,t){e.exports=require("events")},function(e,t){e.exports=require("request")},function(e,t){e.exports=(e=>(function(...t){const r=e(...t),n=t[t.length-1];return Promise.resolve(r).catch(n)}))}]);