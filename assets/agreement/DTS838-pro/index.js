this["DTS838-pro"]=function(e){var t={};function r(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,function(t){return e[t]}.bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(module,exports){!function(){function eightlu(e,t){this.addrmin=1,this.addrmax=40,this.validate=t,this.options=e;var r=this;JSON.parse(e.defaulttest).forEach(function(e){r["analysis"+e.address]=e.analysis})}eightlu.prototype.find=function(){this.validate;var e=this.options.devicename,t=JSON.parse(this.options.defaulttest),r=JSON.parse(this.options.defaultbutton);return{cmd:"68010203",resolve:function(s,n,o){return n({address:"0102",name:e+"0102",test:t,button:r})},changeAddr:!0}},eightlu.prototype.changeAddr=function(e){for("number"==typeof e.address&&(e.address=e.address.toString(16));e.address.length<2;)e.address="0"+e.address;var t="0006000100"+e.address;this.validate;t=this.validate(t);var r=this.options.devicename,s=JSON.parse(this.options.defaulttest),n=JSON.parse(this.options.defaultbutton);return{cmd:t,resolve:function(t,o,a){return t.length<16?a(400):"06"!=t.substr(2,2)?a(402):t.substr(10,2).toUpperCase()!=e.address.toUpperCase()?a(403):o({address:e.address,name:r+e.address,test:s,button:n})}}},eightlu.prototype.readOne=function(address,code){var analysis=this["analysis"+code];for("number"==typeof address&&(address=address.toString(16));address.length<2;)address="0"+address;validate=this.validate;var commond=address+"0400000002";return commond=validate(commond),{cmd:commond,resolve:function(result,success,error){if(result.length<18)return error(400);var addrback=result.substr(0,2);if(addrback!=address.toUpperCase())return error(403);var func=result.substr(2,2);if("04"!=func)return error(402);var data=result.substr(6,8),analyze=null;return eval(analysis),success(analyze?analyze(data):data)}}},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("DTS838-pro",function(e,t,r){r.exports=eightlu}):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=eightlu)}(this)}]);