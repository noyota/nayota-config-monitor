this["LR-TDS210-pro"]=function(e){var t={};function r(o){if(t[o])return t[o].exports;var a=t[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(o,a,function(t){return e[t]}.bind(null,a));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(module,exports){!function(){function Sun(e,t){this.addrmin=1,this.addrmax=40,this.validate=t,this.options=e;var r=this;JSON.parse(e.defaulttest).forEach(function(e){r["analysis"+e.address]=e.analysis})}Sun.prototype.find=function(){for(var e=this.addrmin,t="";e<=this.addrmax;){for(var r=e.toString(16);r.length<2;)r="0"+r;t+=this.validate(r+"0300000002")+",",e++}var o=this.validate,a=this.options.devicename,n=JSON.parse(this.options.defaulttest),s=JSON.parse(this.options.defaultbutton);return{cmd:t.substr(0,t.length-1),resolve:function(e,t,r){if(e.length<18)return r(400);var d=e.substr(0,e.length-4);return validatedata=o(d),validatedata!=e?r(401):"03"!=e.substr(2,2)?r(402):t({address:d=e.substr(0,2),name:a+d,test:n,button:s})},changeAddr:!1}},Sun.prototype.readOne=function(address,code){code=code.toString(16);var analysis=this["analysis"+code];for(1==code.length?code="000"+code:2==code.length?code="00"+code:3==code.length&&(code="0"+code),"number"==typeof address&&(address=address.toString(16));address.length<2;)address="0"+address;validate=this.validate;var commond=address+"03"+code+"0002";return commond=this.validate(commond),{cmd:commond,resolve:function(result,success,error){if(result.length<18)return error(400);var data=result.substr(0,result.length-4);if(validatedata=validate(data),validatedata.toLowerCase()!=result.toLowerCase())return error(401);var addrback=result.substr(0,2);if(addrback.toUpperCase()!=address.toUpperCase())return error(403);var func=result.substr(2,2);if("03"!=func)return error(402);var data=result.substr(6,8),analyze=null;return eval(analysis),success(analyze?analyze(data):data)}}},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("LR-TDS210-pro",function(e,t,r){r.exports=Sun}):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=Sun)}(this)}]);