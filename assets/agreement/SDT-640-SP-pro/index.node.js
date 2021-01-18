module.exports=function(t){var e={};function r(a){if(e[a])return e[a].exports;var o=e[a]={i:a,l:!1,exports:{}};return t[a].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(a,o,function(e){return t[e]}.bind(null,o));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(module,exports){!function(){function Relay(t,e){this.addrmin=1,this.addrmax=60,this.validate=e,this.button=[0,1,2,3],this.options=t;var r=this;JSON.parse(t.defaulttest).forEach(function(t){r["analysis"+t.address]=t.analysis})}Relay.prototype.find=function(){for(var t=this.addrmin,e="";t<=this.addrmax;){for(var r=t.toString(16);r.length<2;)r="0"+r;e+=this.validate(r+"0300000001")+",",t++}var a=this.validate,o=this.options.devicename,d=JSON.parse(this.options.defaulttest),n=JSON.parse(this.options.defaultbutton);return{cmd:e.substr(0,e.length-1),resolve:function(t,e,r){if(t.length<14)return r(400);var s=t.substr(0,t.length-4);return validatedata=a(s),validatedata!=t?r(401):"03"!=t.substr(2,2)?r(402):e({address:s=t.substr(0,2),name:o+s,test:d,button:n})},changeAddr:!0}},Relay.prototype.changeAddr=function(t){for("number"==typeof t.address&&(t.address=t.address.toString(16));t.address.length<2;)t.address="0"+t.address;for("number"==typeof t.oldAddr&&(t.oldAddr=t.oldAddr.toString(16));t.oldAddr.length<2;)t.oldAddr="0"+t.oldAddr;var e=t.oldAddr+"100000000102"+t.address+"01";e=this.validate(e);var r=this.validate,a=this.options.devicename,o=JSON.parse(this.options.defaulttest),d=JSON.parse(this.options.defaultbutton);return{cmd:e,resolve:function(t,e,n){if(t.length<16)return n(400);var s=t.substr(0,t.length-4);return validatedata=r(s),validatedata.toUpperCase!=t.toUpperCase?n(401):"10"!=t.substr(2,2)?n(402):e({address:s=t.substr(0,2),name:a+s,test:o,button:d})}}},Relay.prototype.read=function(t,e){},Relay.prototype.readOne=function(addr,code){var analysis=this["analysis"+code];for("number"==typeof addr&&(addr=addr.toString(16));addr.length<2;)addr="0"+addr;if(10==code){for(code=code.toString(16);code.length<4;)code="0"+code;validate=this.validate;var commond=addr+"04"+code+"0002"}else{for(code=code.toString(16);code.length<4;)code="0"+code;validate=this.validate;var commond=addr+"03"+code+"0001"}return commond=this.validate(commond),{cmd:commond,resolve:function(result,success,error){if(result.length<14)return error(400);var data=result.substr(0,result.length-4);if(validatedata=validate(data),validatedata.toUpperCase!=result.toUpperCase)return error(401);var addrback=result.substr(0,2);if(addrback!=addr.toUpperCase)return error(403);var func=result.substr(2,2);if("03"!=func||"04"!=func)return error(402);var data=null;if("03"==func)var data=result.substr(6,4);else if("04"==func)var data=result.substr(6,8);var analyze=null;return eval(analysis),success(analyze?analyze(data):data)}}},Relay.prototype.write=function(t,e){},Relay.prototype.writeOne=function(t,e,r){},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("SDM-640-pro",function(t,e,r){r.exports=Relay}):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=Relay)}(this)}]);