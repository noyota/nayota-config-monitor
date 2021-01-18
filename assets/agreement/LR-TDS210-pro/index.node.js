module.exports=function(t){var e={};function r(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(n,s,function(e){return t[e]}.bind(null,s));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(module,exports){function Relay(t,e){this.addrmin=1,this.addrmax=40,this.validate=e,this.button=[0,1,2,3],this.options=t;var r=this;r.checksAddress=[],t.defaultCheck.forEach(function(t){r["analysis"+t.address]=t.analysis,r.checksAddress.push(t.address)})}Relay.prototype.find=function(t,e){t&&"string"==typeof t&&(t=parseInt(t)),e&&"string"==typeof e&&(e=parseInt(e));for(var r=t||this.addrmin,n=e||this.addrmax,s="";r<=n;){for(var a=r.toString(16);a.length<2;)a="0"+a;s+=this.validate.crc16(a+"0300000002")+",",r++}var o=this.validate,i=this.options.name,l=this.options.defaultCheck,d=this.options.defaultOperate,c=[];return void 0!==this.options.attribute&&(c=this.options.attribute),{cmd:s.substr(0,s.length-1),resolve:function(t,e,r){if(t.length<18)return r(400);var n=t.substr(0,t.length-4);if(validatedata=o.crc16(n),validatedata.toLowerCase()!=t.toLowerCase())return r(401);if("03"!=t.substr(2,2))return r(402);var s=t.substr(0,2);return e({shortAddress:s,name:i+s,checks:l,operates:d,attribute:c})},changeAddr:!1}},Relay.prototype.changeAddr=function(t){for("number"==typeof t.shortAddress&&(t.shortAddress=t.shortAddress.toString(16));t.shortAddress.length<2;)t.shortAddress="0"+t.shortAddress;var e="5F100101"+t.shortAddress+"00005E";e=this.validate.crc16(e);var r=this.options.name,n=this.options.defaultCheck,s=this.options.defaultOperate,a=[];return null!=this.options.attribute&&(a=this.options.attribute),{cmd:e,resolve:function(e,o,i){return e.length<16?i(400):"100101"!==(e=e.toUpperCase()).substr(2,6)?i(402):e.substr(8,2).toUpperCase()!==t.shortAddress.toUpperCase()?i(403):o({shortAddress:t.shortAddress,name:r+t.shortAddress,checks:n,operates:s,attribute:a})}}},Relay.prototype.read=function(addr,code){null==code?code=this.checksAddress:"string"==typeof code&&(code=[code]);var analysis=[],_this=this;code.forEach(function(t){analysis.push(_this["analysis"+t])});for(var cmd=[];addr.length<2;)addr="0"+addr;var validate=this.validate,codeone="";if(code.indexOf("0")>-1){codeone="0000";var commond1=this.validate.crc16(addr+"03"+codeone+"0002");cmd.push(commond1)}if(code.indexOf("2")>-1){codeone="0002";var commond2=this.validate.crc16(addr+"03"+codeone+"0002");cmd.push(commond2)}if(code.indexOf("3")>-1){codeone="0003";var commond3=this.validate.crc16(addr+"03"+codeone+"0002");cmd.push(commond3)}return{cmd:cmd.join(","),resolve:function(result,success,error){var data=result.split(",");if(data.length!==cmd.length)return error(400);for(var res={},allChecks={},i=0;i<data.length;i++){var item=data[i];if(console.log("item="+item),item.length<18)return error(400);var func1=item.substr(0,item.length-4);if(validatedata=validate.crc16(func1),validatedata.toLowerCase()!=item.toLowerCase())return error(401);var addrback=item.substr(0,2);if(addrback!=addr.toLowerCase())return error(403);var func2=item.substr(2,2);if("03"!=func2)return error(402);cmd[i]===commond1&&(allChecks[0]=item.substr(6,8)),cmd[i]===commond2&&(allChecks[2]=item.substr(6,4)),cmd[i]===commond3&&(allChecks[3]=item.substr(6,8)),code.forEach(function(item,index){var analyze=null;eval(analysis[index]),allChecks[item]&&analyze&&(res[item]=analyze(allChecks[item]))})}success(res)}}},Relay.prototype.write=function(t,e,r){for(t=t.toString(16);t.length<2;)t="0"+t;for(e=(e=parseInt(e)).toString(16);e.length<2;)e="0"+e;r=r?"01":"00";var n=this.validate.crc16(t+"0600"+e+"00"+r);this.validate;return console.log("commond="+n),{cmd:n,resolve:function(e,r,n){if(e.length<16)return n(400);if(e.substr(0,2).toLowerCase()!=t.toLowerCase())return n(403);if("06"!=e.substr(2,2))return n(402);var s=e.substr(10,2);return"01"==s?s=1:"00"==s&&(s=0),r(s)}}},Relay.prototype.encode=function(t,e,r){for(var n=this.validate.crc16(t+"0300000002"),s=[{begin:3,reslength:2},{begin:5,reslength:2}],a={},o=0;o<e.length;o++)a[e[o].key]=e[o].value;for(var i=parseInt(a["读取周期"]).toString(16),l=parseInt(a["Heartbeat"]).toString(16);i.length<4;)i="0"+i;for(;l.length<4;)l="0"+l;function d(t){return!!/^\d+(\.\d+)?$/.test(t)}function c(e,r,n,s,a,o,c){for(a=a.toString(16);a.length<2;)a="0"+a;var u="";r.forEach(function(t){var e=n.split(",");"sd"===c&&(void 0!==e[0]&&d(e[0])||(e[0]=200),void 0!==e[1]&&d(e[1])?parseFloat(e[1])<.3?e[1]=.3:parseFloat(e[1])>1&&(e[1]=1):e[1]=.3,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&d(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&d(e[3])?parseFloat(e[3])>=100&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&d(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=100:parseFloat(e[4])>100&&(e[4]=100):e[4]=100,e[4]=100*parseFloat(e[4])),"wd"===c&&(void 0!==e[0]&&d(e[0])||(e[0]=200),void 0!==e[1]&&d(e[1])?parseFloat(e[1])<.3?e[1]=.3:parseFloat(e[1])>1&&(e[1]=1):e[1]=.3,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&d(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&d(e[3])?parseFloat(e[3])>=100&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&d(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=100:parseFloat(e[4])>100&&(e[4]=100):e[4]=100,e[4]=100*parseFloat(e[4]));let r=parseInt(e[0]).toString(16);for(;r.length<2;)r="0"+r;let s=parseInt(e[1]).toString(16);for(;s.length<2;)s="0"+s;parseInt(e[2])>1&&(t.reslength=parseInt(t.reslength)-parseInt(e[2])+1);var a=parseInt(2*t.reslength);let o=parseInt(e[3]).toString(16);for(;o.length<a;)o="0"+o;let i=parseInt(e[4]).toString(16);for(;i.length<a;)i="0"+i;for(t.begin=t.begin.toString(16);t.begin.length<2;)t.begin="0"+t.begin;for(t.reslength=t.reslength.toString(16);t.reslength.length<2;)t.reslength="0"+t.reslength;for(var l=t.begin+t.reslength+r+s+o+i,h=(parseInt(l.length/2)+1).toString(16);h.length<2;)h="0"+h;u+=l=h+l});for(var h=parseInt(u.length/2).toString(16);h.length<2;)h="0"+h;for(var p=r.length.toString(16);p.length<2;)p="0"+p;var f="00"+s+i+l+h+p+u+e;if(f.length>128){let e=1;for(var g=parseInt(f.length/128)+1,v=e+""+g;f.length>128;){var m=f.substr(0,128);f=f.substr(128),v=o.push(t+a+v+m),e+=1}f.length>0&&o.push(t+a+g+""+g+f)}else o.push(t+a+"11"+f);return o}var u=[];return u=c(n,s,a.sd,r,0,u,"sd"),{cmd:(u=c(n,s,a.wd,r,1,u,"wd")).join(","),try:5}},Relay.prototype.decode=function(result){var ret={};if(26===result.length||22===result.length){var code=result.substr(2,2);let data="";if("00"===code||"01"===code){data=result.substr(10,12);const valid=this.validate.crc16(result.substr(4,18)).toUpperCase();if(valid!==result.substr(4,22).toUpperCase())return null;if("00"===code){const j=50;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}if("01"===code){const j=56;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}return ret}return null}return null},Relay.prototype.navi=function(t){if(t){return t.substr(0,2)}return null},module.exports=Relay}]);
