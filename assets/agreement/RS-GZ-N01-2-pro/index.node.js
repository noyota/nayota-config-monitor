module.exports=function(t){var e={};function r(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(s,n,function(e){return t[e]}.bind(null,n));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(module,exports){function Eightlu(t,e){this.addrmin=1,this.addrmax=40,this.validate=e,this.options=t;var r=this;this.readTime=60,this.upTime=120,r.checksAddress=[],t.defaultCheck.forEach(function(t){r["analysis"+t.address]=t.analysis,r.checksAddress.push(t.address)})}Eightlu.prototype.find=function(){var t=this.options.name,e=this.options.defaultCheck,r=this.options.defaultOperate,s=[];return null!=this.options.attribute&&(s=this.options.attribute),{cmd:"FDFDFD0000E988",resolve:function(n,a,o){if(n.length<14)return o(400);if("FDFDFD"!==(n=n.toUpperCase()).substr(0,6))return o(402);var i=n.substr(8,2);return a({shortAddress:i,name:t+i,checks:e,operates:r,attribute:s})},changeAddr:!0}},Eightlu.prototype.changeAddr=function(t){for("number"==typeof t.shortAddress&&(t.shortAddress=t.shortAddress.toString(16));t.shortAddress.length<2;)t.shortAddress="0"+t.shortAddress;var e="fdfdfd00"+t.shortAddress;e=this.validate.crc16(e);var r=this.options.name,s=this.options.defaultCheck,n=this.options.defaultOperate,a=[];return null!=this.options.attribute&&(a=this.options.attribute),{cmd:e,resolve:function(e,o,i){return e.length<14?i(400):"FDFDFD"!==(e=e.toUpperCase()).substr(0,6)?i(402):o({shortAddress:t.shortAddress,name:r+t.shortAddress,checks:s,operates:n,attribute:a})}}},Eightlu.prototype.encode=function(t,e,r){for(var s=this.validate.crc16(t+"0300000002"),n=[{begin:3,reslength:2},{begin:5,reslength:2}],a={},o=0;o<e.length;o++)a[e[o].key]=e[o].value;for(var i=parseInt(a["读取周期"]).toString(16),l=parseInt(a["Heartbeat"]).toString(16);i.length<4;)i="0"+i;for(;l.length<4;)l="0"+l;function d(t){return!!/^\d+(\.\d+)?$/.test(t)}function u(e,r,s,n,a,o,u){for(a=a.toString(16);a.length<2;)a="0"+a;var h="";r.forEach(function(t){var e=s.split(",");"sd"===u&&(void 0!==e[0]&&d(e[0])||(e[0]=200),void 0!==e[1]&&d(e[1])?parseFloat(e[1])<.3?e[1]=.3:parseFloat(e[1])>1&&(e[1]=1):e[1]=.3,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&d(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&d(e[3])?parseFloat(e[3])>=100&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&d(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=100:parseFloat(e[4])>100&&(e[4]=100):e[4]=100,e[4]=100*parseFloat(e[4])),"wd"===u&&(void 0!==e[0]&&d(e[0])||(e[0]=200),void 0!==e[1]&&d(e[1])?parseFloat(e[1])<.3?e[1]=.3:parseFloat(e[1])>1&&(e[1]=1):e[1]=.3,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&d(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&d(e[3])?parseFloat(e[3])>=100&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&d(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=100:parseFloat(e[4])>100&&(e[4]=100):e[4]=100,e[4]=100*parseFloat(e[4]));let r=parseInt(e[0]).toString(16);for(;r.length<2;)r="0"+r;let n=parseInt(e[1]).toString(16);for(;n.length<2;)n="0"+n;parseInt(e[2])>1&&(t.reslength=parseInt(t.reslength)-parseInt(e[2])+1);var a=parseInt(2*t.reslength);let o=parseInt(e[3]).toString(16);for(;o.length<a;)o="0"+o;let i=parseInt(e[4]).toString(16);for(;i.length<a;)i="0"+i;for(t.begin=t.begin.toString(16);t.begin.length<2;)t.begin="0"+t.begin;for(t.reslength=t.reslength.toString(16);t.reslength.length<2;)t.reslength="0"+t.reslength;for(var l=t.begin+t.reslength+r+n+o+i,c=(parseInt(l.length/2)+1).toString(16);c.length<2;)c="0"+c;h+=l=c+l});for(var c=parseInt(h.length/2).toString(16);c.length<2;)c="0"+c;for(var p=r.length.toString(16);p.length<2;)p="0"+p;var f="00"+n+i+l+c+p+h+e;if(f.length>128){for(var g=1,v=parseInt(f.length/128)+1,b=g+""+v;f.length>128;){var y=f.substr(0,128);f=f.substr(128),b=o.push(t+a+b+y),g+=1}f.length>0&&o.push(t+a+v+""+v+f)}else o.push(t+a+"11"+f);return o}var h=[];return h=u(s,n,a.sd,r,0,h),{cmd:(h=u(s,n,a.wd,r,1,h)).join(","),try:5}},Eightlu.prototype.decode=function(result){var ret=[];if(22===result.length){var code=result.substr(2,2);const valid=this.validate.crc16(result.substr(4,14)).toUpperCase();if(valid!==result.substr(4,18).toUpperCase())return null;if("00"===code){const code=1;let d=result.substr(10,4);const analysis=this["analysis"+code.toString(16)],analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}else if("01"===code){const code=2;let d=result.substr(14,4);const analysis=this["analysis"+code.toString(16)],analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}return ret}return null},Eightlu.prototype.read=function(addr,code){null==code?code=this.checksAddress:"string"==typeof code&&(code=[code]);var analysis=[],_this=this;for(code.forEach(function(t){analysis.push(_this["analysis"+t])});addr.length<2;)addr="0"+addr;var commond1=this.validate.crc16(addr+"0300060001"),cmd=[];return cmd.push(commond1),{cmd:cmd.join(","),resolve:function(result,success,error){var data=result.split(",");if(data.length!==cmd.length)return error(400);for(var res={},allChecks={},i=0;i<data.length;i++){var item=data[i];if(item.length<14)return error(400);var addrback=item.substr(0,2);if(addrback!==addr.toLowerCase())return error(403);var func=item.substr(2,2);if("03"!==func)return error(401);var func2=item.substr(4,2);if("02"!==func2)return error(402);allChecks[0]=item.substr(6,4),code.forEach(function(item,index){var analyze=null;eval(analysis[index]),allChecks[item]&&analyze&&(res[item]=analyze(allChecks[item]))})}success(res)}}},module.exports=Eightlu}]);
