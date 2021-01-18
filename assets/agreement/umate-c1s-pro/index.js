this["umate-c1s-pro"]=function(e){var t={};function r(a){if(t[a])return t[a].exports;var o=t[a]={i:a,l:!1,exports:{}};return e[a].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(a,o,function(t){return e[t]}.bind(null,o));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(module,exports){!function(){function Relay(e,t){this.addrmin=1,this.addrmax=40,this.validate=t,this.button=[0,1,2,3],this.options=e;var r=this;JSON.parse(e.defaulttest).forEach(function(e){r["analysis"+e.address]=e.analysis})}Relay.prototype.find=function(){for(var e=this.addrmin,t="";e<=this.addrmax;){for(var r=e.toString(16);r.length<2;)r="0"+r;t+=this.validate(r+"0300000001")+",",e++}var a=this.validate,o=this.options.devicename,n=JSON.parse(this.options.defaulttest),d=JSON.parse(this.options.defaultbutton);return{cmd:t.substr(0,t.length-1),resolve:function(e,t,r){if(e.length<10)return r(400);var s=e.substr(0,e.length-4);return validatedata=a(s),validatedata.toUpperCase()!=e.toUpperCase()?r(401):"03"!=e.substr(2,2)?r(402):t({address:s=e.substr(0,2),name:o+s,test:n,button:d})},changeAddr:!0}},Relay.prototype.changeAddr=function(e){for("number"==typeof e.address&&(e.address=e.address.toString(16));e.address.length<2;)e.address="0"+e.address;var t="0125"+e.address+"55AA",r=(this.validate,this.options.devicename),a=JSON.parse(this.options.defaulttest),o=JSON.parse(this.options.defaultbutton);return{cmd:t,resolve:function(t,n,d){if(t.length<10)return d(400);if("25"!=t.substr(2,2))return d(402);t.substr(0,2);return n({address:e.address,name:r+e.address,test:a,button:o})}}},Relay.prototype.readAll=function(e){},Relay.prototype.readOne=function(addr,code){var analysis=this["analysis"+code];for(code=code.toString(16),1==code.length?code="000"+code:2==code.length?code="00"+code:3==code.length&&(code="0"+code),"number"==typeof addr&&(addr=addr.toString(16));addr.length<2;)addr="0"+addr;validate=this.validate;var commond=addr+"03"+code+"0001";return commond=validate(commond),{cmd:commond,resolve:function(result,success,error){if(result.length<14)return error(400);var data=result.substr(0,result.length-4);if(validatedata=validate(data),validatedata.toUpperCase()!=result.toUpperCase())return error(401);var addrback=result.substr(0,2);if(addrback.toUpperCase()!=addr.toUpperCase())return error(403);var func=result.substr(2,2);if("03"!=func)return error(402);var data=null;data=result.substr(6,4);var analyze=null;return eval(analysis),success(analyze?analyze(data):data)}}},Relay.prototype.read=function(e,t){},Relay.prototype.write=function(e,t){},Relay.prototype.writeOne=function(e,t,r){},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("umate-c1s-pro",function(e,t,r){r.exports=Relay}):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=Relay)}(this)}]);