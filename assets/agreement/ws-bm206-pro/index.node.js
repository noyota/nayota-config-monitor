module.exports=function(t){var e={};function r(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(s,n,function(e){return t[e]}.bind(null,n));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(module,exports){function Relay(t,e){this.addrmin=1,this.addrmax=20,this.validate=e,this.button=[0,1,2,3],this.options=t;var r=this;r.checksAddress=[],t.defaultCheck.forEach(function(t){r["analysis"+t.address]=t.analysis,r.checksAddress.push(t.address)})}Relay.prototype.find=function(t,e){t&&"string"==typeof t&&(t=parseInt(t)),e&&"string"==typeof e&&(e=parseInt(e));t||this.addrmin,e||this.addrmax,this.validate;var r=this.options.name,s=this.options.defaultCheck,n=this.options.defaultOperate,o=[];return void 0!==this.options.attribute&&(o=this.options.attribute),{cmd:"FA0000016869FE",resolve:function(t,e,a){if(t.length<26)return a(400);var i=t.substr(12,2);return"69"!=t.substr(8,2)?a(403):e({shortAddress:i,name:r+i,checks:s,operates:n,attribute:o})},changeAddr:!0}},Relay.prototype.changeAddr=function(t){for("number"==typeof t.shortAddress&&(t.shortAddress=t.shortAddress.toString(16));t.shortAddress.length<2;)t.shortAddress="0"+t.shortAddress;var e=(parseInt(t.oldAddr,16)+3+106+parseInt(t.shortAddress,16)).toString(16),r=e.substr(e.length-2,e.length),s="FA00"+t.oldAddr+"036A00"+t.shortAddress+r+"FE",n=(this.validate,this.options.name),o=this.options.defaultCheck,a=this.options.defaultOperate,i=[];return void 0!==this.options.attribute&&(i=this.options.attribute),{cmd:s,resolve:function(e,r,s){return e.length<18?s(400):r({shortAddress:t.shortAddress,name:n+t.shortAddress,checks:o,operates:a,attribute:i})}}},Relay.prototype.read=function(addr,code){null==code?code=this.checksAddress:"string"==typeof code&&(code=[code]);var analysis=[],_this=this;for(code.forEach(function(t){analysis.push(_this["analysis"+t])});addr.length<2;)addr="0"+addr;var state="0180",v1=parseInt(parseInt(state,16)/256)+parseInt(state,16)%256,jiaoyantow=(parseInt(addr,16)+v1).toString(16),jiaoyan2=jiaoyantow.substr(jiaoyantow.length-2,2),commond1="FA00"+addr+"0180"+jiaoyan2+"FE",cmd=[];cmd.push(commond1);var validate=this.validate;return{cmd:cmd.join(","),resolve:function(result,success,error){var data=result.split(",");if(data.length!==cmd.length)return error(400);for(var res={},allChecks={},i=0;i<data.length;i++){var item=data[i];if(item.length<18)return error(400);var addrback=item.substr(0,2);if(addrback!=addr.toLowerCase())return error(403);var func=item.substr(2,2);if("03"!=func)return error(401);var func2=item.substr(4,2);if("04"!=func2)return error(402);allChecks[1]=item.substr(6,4),allChecks[2]=item.substr(10,4),code.forEach(function(item,index){var analyze=null;eval(analysis[index]),allChecks[item]&&analyze&&(res[item]=analyze(allChecks[item]))})}success(res)}}},Relay.prototype.write=function(t,e,r){var s=r;for(0==r?r="1002":1==r?r="1003":2==r?r="100b":3==r?r="100c":4==r?r="1007":5==r?r="1006":6==r?r="8601":7==r?r="8602":8==r&&(r="8603"),t=t.toString(16);t.length<2;)t="0"+t;var n=parseInt(parseInt(r,16)/256)+parseInt(r,16)%256,o=(parseInt(t,16)+2+n).toString(16),a=(parseInt(t,16)+n).toString(16),i=o.substr(o.length-2,2),d=a.substr(a.length-2,2);if(validate=this.validate,9==s)var u="FA00"+t+r+d+"FE";else u="FA00"+t+"02"+r+i+"FE";return console.log(u),{cmd:u,resolve:function(t,e,r){if(2==s||3==s){if("03"!=t.substr(8,2))return r(402);for(var n=t.substring(20,t.length-4).trim(),o=n.length,a="",i=0;i<o;i+=2)a+="%"+n.substr(i,2);return e(decodeURI(a))}if(0==s||1==s){if(t.length<14)return r(400);if("03"!=t.substr(8,2))return r(402);t.substr(12,2);return e(s)}if(6==s||7==s||8==s){if(t.length<16)return r(400);if("86"!=t.substr(8,2))return r(402);t.substr(10,2);return e(s)}if(4==s||5==s)return t.length<18?r(400):"03"!=t.substr(8,2)?r(402):e(t.substr(12,2))}}},Relay.prototype.encode=function(t,e,r){},Relay.prototype.decode=function(t){},Relay.prototype.navi=function(t){if(t){return t.substr(0,2)}return null},module.exports=Relay}]);