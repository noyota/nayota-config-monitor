this["medicine-pro"]=function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e){!function(){function e(t,e){this.addrmin=40,this.addrmax=60,this.validate=e,this.options=t;var r=this;JSON.parse(t.defaulttest).forEach(function(t){r["analysis"+t.address]=t.analysis})}e.prototype.find=function(){this.validate;var t=this.options.devicename,e=JSON.parse(this.options.defaulttest),r=JSON.parse(this.options.defaultbutton),n=parseInt(9e3*Math.random())+1e3;return{cmd:"02000900B00100CA86",resolve:function(o,s,i){return 0==o.length?i(400):s({address:n,name:t+n,test:e,button:r})}}},e.prototype.changeAddr=function(t){for("number"==typeof t.address&&(t.address=t.address.toString(16));t.address.length<2;)t.address="0"+t.address;var e="fdfdfd00"+t.address;e=this.validate(e);this.validate;var r=this.options.devicename,n=JSON.parse(this.options.defaulttest),o=JSON.parse(this.options.defaultbutton);return{cmd:e,resolve:function(e,s,i){return e.length<14?i(400):"FD"!=e.substr(0,2)?i(403):e.substr(8,2).toUpperCase()!=t.address.toUpperCase()?i(402):s({address:t.address,name:r+t.address,test:n,button:o})}}},e.prototype.readAll=function(t){},e.prototype.readOne=function(t,e){this["analysis"+e];return{cmd:"02000900B00100CA86",resolve:function(t,e,r){var n="";if(t.length<16)return r(400);if(t.indexOf("0300")>-1)for(var o=(t=t.substr(0,t.length-4)).split("0300"),s=o.length-1;s>=0;s--)16==o[s].length&&(n+="0300"+o[s]);else n="";return e(n)}}},e.prototype.read=function(t,e){},e.prototype.write=function(t,e){},e.prototype.writeOne=function(t,e,r){},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("medicine-pro",function(t,r,n){n.exports=e}):"object"==typeof t&&"object"==typeof t.exports&&(t.exports=e)}()}]);