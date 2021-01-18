module.exports=function(t){var e={};function r(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(n,s,function(e){return t[e]}.bind(null,s));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(module,exports){function Relay(t,e){this.addrmin=1,this.addrmax=40,this.validate=e,this.button=[0,1,2,3],this.options=t;var r=this;r.checksAddress=[],t.defaultCheck.forEach(function(t){r["analysis"+t.address]=t.analysis,r.checksAddress.push(t.address)})}function rmDb(t){return t}Relay.prototype.find=function(t,e){t&&"string"==typeof t&&(t=parseInt(t)),e&&"string"==typeof e&&(e=parseInt(e));for(var r=t||this.addrmin,n=e||this.addrmax,s="";r<=n;){for(var a=r.toString(16);a.length<2;)a="0"+a;s+=this.validate.crc16(a+"0300020001")+",",r++}var o=this.validate,i=this.options.name,l=this.options.defaultCheck,d=this.options.defaultOperate,u=[];return void 0!==this.options.attribute&&(u=this.options.attribute),{cmd:s.substr(0,s.length-1),resolve:function(t,e,r){if((t=rmDb(t)).length<14)return r(400);var n=t.substr(0,t.length-4);if(o.crc16(n)!==t)return r(401);if("03"!==t.substr(2,2))return r(402);var s=t.substr(0,2);return e({shortAddress:s,name:i+s,checks:l,operates:d,attribute:u})},changeAddr:!0}},Relay.prototype.changeAddr=function(t){for("number"==typeof t.shortAddress&&(t.shortAddress=t.shortAddress.toString(16));t.shortAddress.length<2;)t.shortAddress="0"+t.shortAddress;for("number"==typeof t.oldAddr&&(t.oldAddr=t.oldAddr.toString(16));t.oldAddr.length<2;)t.oldAddr="0"+t.oldAddr;var e=t.oldAddr+"06002F00"+t.shortAddress;e=this.validate.crc16(e);var r=this.validate,n=this.options.name,s=this.options.defaultCheck,a=[];return void 0!==this.options.attribute&&(a=this.options.attribute),{cmd:e,resolve:function(e,o,i){if((e=rmDb(e)).length<16)return i(400);var l=e.substr(0,e.length-4);return r.crc16(l).toUpperCase()!==e.toUpperCase()?i(401):"06"!==e.substr(2,2)?i(402):o({shortAddress:t.shortAddress,name:n+t.shortAddress,checks:s,attribute:a})}}},Relay.prototype.read=function(addr,code){null==code?code=this.checksAddress:"string"==typeof code&&(code=[code]);var analysis=[],_this=this,cmd=[];for(code.forEach(function(t){analysis.push(_this["analysis"+t])}),"number"==typeof addr&&(addr=addr.toString(16));addr.length<2;)addr="0"+addr;var commond1=this.validate.crc16(addr+"03000D0001");cmd.push(commond1);var validate=this.validate;return{cmd:cmd.join(","),resolve:function(result,success,error){for(var data=result.split(","),res={},allChecks={},i=0;i<data.length;i++){var item=rmDb(data[i]),data1=item.substr(0,item.length-4),validatedata=validate.crc16(data1).toLowerCase();if(validatedata!==item.toLowerCase())return error(401);var addrback=item.substr(0,2);if(addrback.toLowerCase()!==addr.toLowerCase())return error(403);const func=item.substr(2,2);if("03"!==func)return error(402);allChecks[1]=item.substr(6,4),code.forEach(function(item,index){var analyze=null;eval(analysis[index]),allChecks[item]&&analyze&&(res[item]=analyze(allChecks[item]))}),success(res)}}}},Relay.prototype.encode=function(t,e,r){var n=this.validate.crc16(t+"03000D0001"),s={};console.log(e);for(var a=0;a<e.length;a++)s[e[a].key]=e[a].value;for(var o=parseInt(s["读取周期"]).toString(16),i=parseInt(s.Heartbeat).toString(16);o.length<4;)o="0"+o;for(;i.length<4;)i="0"+i;function l(t){return!!/^\d+(\.\d+)?$/.test(t)}var d=[];return{cmd:(d=function(e,r,n,s,a,d,u){for(a=a.toString(16);a.length<2;)a="0"+a;var c="";console.log(n),r.forEach(function(t){var e=n.split(",");"jw"===u&&(void 0!==e[0]&&l(e[0])||(e[0]=200),void 0!==e[1]&&l(e[1])?parseFloat(e[1])<1?e[1]=1:parseFloat(e[1])>1&&(e[1]=1):e[1]=1,e[1]=parseFloat(e[1]),void 0!==e[2]&&l(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&l(e[3])?parseFloat(e[3])>=1e3&&(e[3]=0):e[3]=0,e[3]=parseFloat(e[3]),void 0!==e[4]&&l(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=1e3:parseFloat(e[4])>1e3&&(e[4]=1e3):e[4]=1e3,e[4]=parseFloat(e[4]));let r=parseInt(e[0]).toString(16);for(;r.length<2;)r="0"+r;let s=parseInt(e[1]).toString(16);for(;s.length<2;)s="0"+s;parseInt(e[2])>1&&(t.reslength=parseInt(t.reslength)-parseInt(e[2])+1);var a=parseInt(2*t.reslength);let o=parseInt(e[3]).toString(16);for(;o.length<a;)o="0"+o;let i=parseInt(e[4]).toString(16);for(;i.length<a;)i="0"+i;for(t.begin=t.begin.toString(16);t.begin.length<2;)t.begin="0"+t.begin;for(t.reslength=t.reslength.toString(16);t.reslength.length<2;)t.reslength="0"+t.reslength;for(var d=t.begin+t.reslength+r+s+o+i,h=(parseInt(d.length/2)+1).toString(16);h.length<2;)h="0"+h;c+=d=h+d});for(var h=parseInt(c.length/2).toString(16);h.length<2;)h="0"+h;for(var f=r.length.toString(16);f.length<2;)f="0"+f;var p="00"+s+o+i+h+f+c+e;if(p.length>128){let e=1;for(var g=parseInt(p.length/128)+1,v=e+""+g;p.length>128;){var b=p.substr(0,128);p=p.substr(128),v=d.push(t+a+v+b),e+=1}p.length>0&&d.push(t+a+g+""+g+p)}else d.push(t+a+"11"+p);return d}(n,[{begin:3,reslength:2}],s.jw,r,0,d,"jw")).join(","),try:5}},Relay.prototype.decode=function(result){const code=this.checksAddress;var analysis=[],_this=this;code.forEach(function(t){analysis.push(_this["analysis"+t])}),result=rmDb(result);var ret={};if(console.log(result+"-----"+result.length),18===result.length){var code1=result.substr(2,2);let data="";data=result.substr(10,4);const valid=this.validate.crc16(result.substr(4,10)).toUpperCase();return valid!==result.substr(4,14).toUpperCase()?null:(ret[1]=data,code.forEach(function(item,index){var analyze=null;eval(analysis[index]),ret[item]&&analyze&&(ret[item]=analyze(ret[item]))}),console.log(ret),ret)}return null},Relay.prototype.navi=function(t){if(t){return t.substr(0,2)}return null},module.exports=Relay}]);