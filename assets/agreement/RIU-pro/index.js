this["RIU-pro"]=function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(module,exports){!function(){function eightlu(e,t){this.addrmin=1,this.addrmax=20,this.validate=t,this.options=e;var r=this;JSON.parse(e.defaulttest).forEach(function(e){r["analysis"+e.address]=e.analysis})}eightlu.prototype.find=function(){for(var e=this.addrmin,t="",r=this.validate;e<=this.addrmax;){for(var n=e.toString(16);n.length<2;)n="0"+n;t+=r(n+"0300330002")+",",e++}var o=this.options.devicename,s=JSON.parse(this.options.defaulttest),u=JSON.parse(this.options.defaultbutton);return{cmd:t.substr(0,t.length-1),resolve:function(e,t,r){if(e.length<18)return r(400);if("03"!=e.substr(2,2))return r(401);if("04"!=e.substr(4,2))return r(402);var n=e.substr(0,2);return t({address:n,name:o+n,test:s,button:u})},changeAddr:!1}},eightlu.prototype.readOne=function(address,code){var analysis=this["analysis"+code],hun=999;for("number"==typeof address&&(address=address.toString(16));address.length<2;)address="0"+address;0==code&&(hun=33),1==code&&(hun=35),2==code&&(hun=37),3==code&&(hun=21),4==code&&(hun=21),validate=this.validate;var commond=address+"0300"+hun+"0002";return commond=validate(commond),{cmd:commond,resolve:function(result,success,error){if(result.length<18)return error(400);var func=result.substr(2,2);if("03"!=func)return error(401);var func1=result.substr(4,2);if("04"!=func1)return error(402);var data=result.substr(10,4)+result.substr(6,4),analyze=null;return eval(analysis),success(analyze?analyze(data):data)}}},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("RIU-pro",function(e,t,r){r.exports=eightlu}):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=eightlu)}(this)}]);