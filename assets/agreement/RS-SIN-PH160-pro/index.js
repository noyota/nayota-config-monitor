this["RS-SIN-PH160-pro"]=function(e){var t={};function r(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(a,n,function(t){return e[t]}.bind(null,n));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(module,exports){!function(){function Relay(e,t){this.addrmin=1,this.addrmax=40,this.validate=t,this.button=[0,1,2,3],this.options=e;var r=this;JSON.parse(e.defaulttest).forEach(function(e){r["analysis"+e.address]=e.analysis})}Relay.prototype.find=function(){for(var e=this.addrmin,t="";e<=this.addrmax;){for(var r=e.toString(16);r.length<2;)r="0"+r;t+=this.validate(r+"0300000001")+",",e++}var a=this.validate,n=this.options.devicename,o=JSON.parse(this.options.defaulttest),s=JSON.parse(this.options.defaultbutton);return{cmd:t.substr(0,t.length-1),resolve:function(e,t,r){if(e.length<14)return r(400);var d=e.substr(0,e.length-4);return validatedata=a(d),validatedata.toUpperCase()!=e.toUpperCase()?r(401):"03"!=e.substr(2,2)?r(402):t({address:d=e.substr(0,2),name:n+d,test:o,button:s})},changeAddr:!1}},Relay.prototype.changeAddr=function(e){},Relay.prototype.readAll=function(e){},Relay.prototype.readOne=function(addr,code){var analysis=this["analysis"+code];for("number"==typeof addr&&(addr=addr.toString(16));addr.length<2;)addr="0"+addr;validate=this.validate;var commond=addr+"0300000002";return commond=this.validate(commond),{cmd:commond,resolve:function(result,success,error){if(result.length<18)return error(400);var data=result.substr(0,result.length-4);if(validatedata=validate(data),validatedata.toUpperCase()!=result.toUpperCase())return error(401);var addrback=result.substr(0,2);if(addrback.toUpperCase()!=addr.toUpperCase())return error(403);var func=result.substr(2,2);if("03"!=func)return error(402);var data=result.substr(6,8),ph=result.substr(6,4),wendu=result.substr(10,4),analyze=null;if(eval(analysis),analyze){if(1==code)return success(analyze(ph));if(2==code)return success(analyze(wendu))}return success(data)}}},Relay.prototype.read=function(e,t){},Relay.prototype.write=function(e,t){},Relay.prototype.writeOne=function(e,t,r){},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("RS-SIN-PH160-pro",function(e,t,r){r.exports=Relay}):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=Relay)}(this)}]);