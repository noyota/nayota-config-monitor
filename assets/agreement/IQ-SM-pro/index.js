this["IQ-SM-pro"]=function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e){!function(){function e(t,e){this.validate=e,this.button=[0],this.options=t}e.prototype.find=function(){var t="59F910240000";alert(t),t=this.validate(t);var e=this.options.devicename,r=JSON.parse(this.options.defaulttest),n=JSON.parse(this.options.defaultbutton);return{cmd:t,resolve:function(t,o,a){if(t.length<16)return a(400);if("59F910"!=t.substr(0,6))return a(402);var s=t.substr(0,4);return o({address:s,name:e+s,test:r,button:n})},changeAddr:!1}},e.prototype.changeAddr=function(t){for("number"==typeof t.address&&(t.address=t.address.toString(16));t.address.length<2;)t.address="0"+t.address;var e="00000000"+t.oldAddr+"F8E7D600000000"+t.address,r=(this.validate,this.options.devicename),n=JSON.parse(this.options.defaulttest),o=JSON.parse(this.options.defaultbutton);return{cmd:e+",AAAAAAAAAA5656560F",resolve:function(e,a,s){var i=e.split(",")[1];return i.length<10?s(400):i.substr(8,2).toUpperCase()!=t.address.toUpperCase()?s(402):a({address:t.address,name:r+t.address,test:n,button:o})}}},e.prototype.readBtnOne=function(t){var e="59F910240000";e=this.validate(e);this.validate;return{cmd:e,resolve:function(t,e,r){if(t.length<16)return r(400);var n=t.substr(10,2);return e({state:parseInt(n,16)})}}},e.prototype.readAll=function(t){},e.prototype.readOne=function(t,e){},e.prototype.read=function(t,e){},e.prototype.write=function(t,e){},e.prototype.writeOne=function(t,e,r){r=r?"FF":"00",validate=this.validate;var n="59F9102600"+r;return{cmd:n=this.validate(n),resolve:function(t,e,r){if(t.length<16)return r(400);var n=t.substr(0,t.length-4);return validatedata=validate(n),validatedata.toUpperCase()!=t.toUpperCase()?r(401):("FF"==(n=t.substr(10,2))?n=!0:"00"==n&&(n=!1),e(n))}}},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("IQ-SM-pro",function(t,r,n){n.exports=e}):"object"==typeof t&&"object"==typeof t.exports&&(t.exports=e)}()}]);