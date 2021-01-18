this.ST2020=function(e){var t={};function r(s){if(t[s])return t[s].exports;var a=t[s]={i:s,l:!1,exports:{}};return e[s].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)r.d(s,a,function(t){return e[t]}.bind(null,a));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(module,exports,__webpack_require__){"use strict";function Relay(e,t){this.addrmin=1,this.addrmax=20,this.validate=t,this.button=[0,1,2,3],this.options=e;var r=this;r.checksAddress=[],e.defaultCheck.forEach(function(e){r["analysis"+e.address]=e.analysis,r.checksAddress.push(e.address)}),e.defaultOperate.forEach(function(e){r["analysis"+e.address]=e.analysis})}function rmDb(e){return e}Relay.prototype.find=function(e,t){e&&"string"==typeof e&&(e=parseInt(e)),t&&"string"==typeof t&&(t=parseInt(t));for(var r=e||this.addrmin,s=t||this.addrmax,a="";r<=s;){for(var o=r.toString(16);o.length<2;)o="0"+o;a+=this.validate.crc16(o+"0300000001")+",",r++}var n=this.validate,i=this.options.name,d=this.options.defaultCheck,u=this.options.defaultOperate,l=[];return void 0!==this.options.attribute&&(l=this.options.attribute),{cmd:a.substr(0,a.length-1),resolve:function(e,t,r){if((e=rmDb(e)).length<14)return r(400);var s=e.substr(0,e.length-4);if(n.crc16(s).toLowerCase()!==e.toLowerCase())return r(401);if("03"!==e.substr(2,2))return r(402);var a=e.substr(0,2);return t({shortAddress:a,name:i+a,checks:d,operates:u,attribute:l})},changeAddr:!0}},Relay.prototype.changeAddr=function(e){for("number"==typeof e.shortAddress&&(e.shortAddress=e.shortAddress.toString(16));e.shortAddress.length<2;)e.shortAddress="0"+e.shortAddress;for("number"==typeof e.oldAddr&&(e.oldAddr=e.oldAddr.toString(16));e.oldAddr.length<2;)e.oldAddr="0"+e.oldAddr;var t,r,s=this.validate,a=this.options.name,o=this.options.defaultCheck,n=this.options.defaultOperate,i=[],d={};void 0!==this.options.attribute&&(i=this.options.attribute).forEach(function(e){d[e.key]=e.value}),t=d["最低温度"]?d["最低温度"]:20,t=this.validate.numToHexStr(t,4),r=d["最高温度"]?d["最高温度"]:30,r=this.validate.numToHexStr(r,4);var u=e.oldAddr+"100003000608"+t+r+"410000"+e.shortAddress;return{cmd:u=this.validate.crc16(u),resolve:function(t,r,d){if((t=rmDb(t)).length<16)return d(400);var u=t.substr(0,t.length-4);return s.crc16(u).toUpperCase()!==t.toUpperCase()?d(401):"10"!==t.substr(2,2)?d(402):r({shortAddress:e.shortAddress,name:a+e.shortAddress,checks:o,operates:n,attribute:i})}}},Relay.prototype.read=function(addr,code){null==code?code=this.checksAddress:"string"==typeof code&&(code=[code]);var analysis=[],_this=this;for(code=["0","1","2","3","4","5","6"],code.forEach(function(e){analysis.push(_this["analysis"+e])}),"number"==typeof addr&&(addr=addr.toString(16));addr.length<2;)addr="0"+addr;var commond=this.validate.crc16(addr+"0300000013"),validate=this.validate;return{cmd:commond,resolve:function resolve(result,success,error){var item=rmDb(result),res={},allChecks={};if(""!==item){var validatedata=validate.crc16(item.substr(0,item.length-4));if(validatedata.toLowerCase()!==item.toLowerCase())return error(401);var addrback=item.substr(0,2);if(addrback.toLowerCase()!==addr.toLowerCase())return error(403);var func=item.substr(2,2);if("03"!==func)return error(402);allChecks[1]=item.substr(6,4),allChecks[2]=item.substr(14,4);var data=validate.hex_to_bin(item.substr(26,4));allChecks[3]=data.substr(1,4),allChecks[4]=data.substr(5,2),allChecks[5]=data.substr(7,1),allChecks[6]=data.substr(8,1)}code.forEach(function(item,index){var analyze=null;eval(analysis[index]),allChecks[item]&&analyze?res[item]=analyze(allChecks[item]):res[item]=allChecks[item]}),success(res)}}},Relay.prototype.write=function(e,t,r,s){for("number"==typeof e&&(e=e.toString(16));e.length<2;)e="0"+e;var a;"number"==typeof(t=parseInt(t))&&(t=t.toString(16));var o=r,n="";if("2"===t)r=parseInt(r),r=this.validate.numToHexStr(r,4),a="0002",n=this.validate.crc16(e+"100002000102"+r);else{var i,d,u="00",l="0001";s.forEach(function(e){"3"===e.shortAddress?("3"===t&&(e.value=r),0===e.value&&(l="1000"),1===e.value&&(l="0100"),2===e.value&&(l="0010"),3===e.value&&(l="0001")):"4"===e.shortAddress?("4"===t&&(e.value=r),0===e.value&&(u="00"),1===e.value&&(u="01"),2===e.value&&(u="11")):"5"===e.shortAddress?("5"===t&&(e.value=r),i=e.value||0):"6"===e.shortAddress&&("6"===t&&(e.value=r),d=e.value||0)}),r="0"+l+u+i+d+"0000000",r=this.validate.bin_to_hex(r),a="0005",n=this.validate.crc16(e+"06"+a+r)}var c=this.validate;return{cmd:n,resolve:function(t,r,s){var a=rmDb(t);if(a.length<16)return s(400);if(c.crc16(a.substr(0,a.length-4)).toLowerCase()!==a.toLowerCase())return s(401);if(a.substr(0,2).toLowerCase()!==e.toLowerCase())return s(403);var n=a.substr(2,2);return"06"!==n&&"10"!==n?s(402):r(o)}}},Relay.prototype.decode=function(e){return e},Relay.prototype.navi=function(e){return e?e.substr(0,2):null},module.exports=Relay}]);