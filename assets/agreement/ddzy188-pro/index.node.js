module.exports=function(t){var a={};function e(r){if(a[r])return a[r].exports;var n=a[r]={i:r,l:!1,exports:{}};return t[r].call(n.exports,n,n.exports,e),n.l=!0,n.exports}return e.m=t,e.c=a,e.d=function(t,a,r){e.o(t,a)||Object.defineProperty(t,a,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,a){if(1&a&&(t=e(t)),8&a)return t;if(4&a&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&a&&"string"!=typeof t)for(var n in t)e.d(r,n,function(a){return t[a]}.bind(null,n));return r},e.n=function(t){var a=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(a,"a",a),a},e.o=function(t,a){return Object.prototype.hasOwnProperty.call(t,a)},e.p="",e(e.s=0)}([function(module,exports){!function(){function Relay(t,a){this.addrmin=20,this.addrmax=40,this.validate=a,this.button=[0,1,2,3,4,5,6,7],this.options=t;var e=this;JSON.parse(t.defaulttest).forEach(function(t){e["analysis"+t.address]=t.analysis})}Relay.prototype.find=function(){this.validate;var t=this.options.devicename,a=JSON.parse(this.options.defaulttest),e=JSON.parse(this.options.defaultbutton);return{cmd:"68AAAAAAAAAAAA681300DF16",resolve:function(r,n,o){if(r.length<44)return o(400);if("93"!=r.substr(24,2))return o(402);var d=r.substr(20,2);return n({address:d,name:t+d,test:a,button:e})},changeAddr:!0}},Relay.prototype.changeAddr=function(t){for("number"==typeof t.address&&(t.address=t.address.toString(16));t.address.length<2;)t.address="0"+t.address;var a=(51+parseInt(t.address,16)).toString(16),e=(230+parseInt(a,16)).toString(16),r="68AAAAAAAAAAAA6815063333333333"+a+e.substr(e.length-2,2)+"16",n=(this.validate,this.options.devicename),o=JSON.parse(this.options.defaulttest),d=JSON.parse(this.options.defaultbutton);return{cmd:r,resolve:function(a,e,r){return a.length<32?r(400):"95"!=a.substr(24,2)?r(402):a.substr(20,2).toUpperCase()!=t.address.toUpperCase()?r(403):e({address:t.address,name:n+t.address,test:o,button:d})}}},Relay.prototype.readAll=function(t){},Relay.prototype.readOne=function(addr,code){var codeone=code;code=code.toString(16);var analysis=this["analysis"+code];for(1==code?code="33343435":2==code?code="33333333":3==code?code="33343535":4==code&&(code="3335C333"),addr=addr.toString(16);addr.length<2;)addr="0"+addr;var code1=code.substr(0,2),code2=code.substr(2,2),code3=code.substr(4,2),code4=code.substr(6,2),jiaoyanone=(104+parseInt(addr,16)+104+17+4+parseInt(code1,16)+parseInt(code2,16)+parseInt(code3,16)+parseInt(code4,16)).toString(16),jiaoyan=jiaoyanone.substr(jiaoyanone.length-2,2);validate=this.validate;var commond="680000000000"+addr+"681104"+code+jiaoyan+"16";return{cmd:commond,resolve:function(result,success,error){if(1==codeone){if(result.length<44)return error(400);var func=result.substr(24,2);if("91"!=func)return error(402);var data1=result.substr(36,2),data2=result.substr(38,2);for(data1=(parseInt(data1,16)-51).toString(16),data2=(parseInt(data2,16)-51).toString(16);data1.length<2;)data1="0"+data1;var data=data2+data1,analyze=null;return eval(analysis),success(analyze?analyze(data):data)}if(2==codeone||4==codeone){if(result.length<48)return error(400);var func=result.substr(24,2);if("91"!=func)return error(402);var data1=result.substr(36,2),data2=result.substr(38,2),data3=result.substr(40,2),data4=result.substr(42,2);for(data1=(parseInt(data1,16)-51).toString(16),data2=(parseInt(data2,16)-51).toString(16),data3=(parseInt(data3,16)-51).toString(16),data4=(parseInt(data4,16)-51).toString(16);data1.length<2;)data1="0"+data1;for(;data2.length<2;)data2="0"+data2;for(;data3.length<2;)data3="0"+data3;var data=data4+data3+data2+data1,analyze=null;return eval(analysis),success(analyze?analyze(data):data)}if(3==codeone){if(result.length<46)return error(400);var func=result.substr(24,2);if("91"!=func)return error(402);var data1=result.substr(36,2),data2=result.substr(38,2),data3=result.substr(40,2);for(data1=(parseInt(data1,16)-51).toString(16),data2=(parseInt(data2,16)-51).toString(16),data3=(parseInt(data3,16)-51).toString(16);data1.length<2;)data1="0"+data1;for(;data2.length<2;)data2="0"+data2;var data=data3+data2+data1,analyze=null;return eval(analysis),success(analyze?analyze(data):data)}}}},Relay.prototype.read=function(t,a){},Relay.prototype.write=function(t,a){},Relay.prototype.writeOne=function(t,a,e){},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("ddzy188-pro",function(t,a,e){e.exports=Relay}):"object"==typeof module&&"object"==typeof module.exports&&(module.exports=Relay)}(this)}]);