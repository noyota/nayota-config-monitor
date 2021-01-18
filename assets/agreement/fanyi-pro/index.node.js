module.exports=function(t){var e={};function r(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(s,n,function(e){return t[e]}.bind(null,n));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(module,exports){function Relay(t,e){this.addrmin=1,this.addrmax=40,this.validate=e,this.button=[0,1,2,3],this.options=t;var r=this;r.checksAddress=[],t.defaultCheck.forEach(function(t){r["analysis"+t.address]=t.analysis,r.checksAddress.push(t.address)})}Relay.prototype.find=function(t,e){t&&"string"==typeof t&&(t=parseInt(t)),e&&"string"==typeof e&&(e=parseInt(e));for(var r=t||this.addrmin,s=e||this.addrmax,n="";r<=s;){for(var a=r.toString(16);a.length<2;)a="0"+a;n+=this.validate.crc16(a+"0300010001")+",",r++}this.validate;var o=this.options.name,i=this.options.defaultCheck,l=this.options.defaultOperate,d=[];return void 0!==this.options.attribute&&(d=this.options.attribute),{cmd:n.substr(0,n.length-1),resolve:function(t,e,r){if(t.length<14)return r(400);if("03"!=t.substr(2,2))return r(402);var s=t.substr(0,2);return e({shortAddress:s,name:o+s,checks:i,operates:l,attribute:d})},changeAddr:!1}},Relay.prototype.changeAddr=function(t){for("number"==typeof t.shortAddress&&(t.shortAddress=t.shortAddress.toString(16));t.shortAddress.length<2;)t.shortAddress="0"+t.shortAddress;var e="5F100101"+t.shortAddress+"00005E";e=this.validate.crc16(e);var r=this.options.name,s=this.options.defaultCheck,n=this.options.defaultOperate,a=[];return null!=this.options.attribute&&(a=this.options.attribute),{cmd:e,resolve:function(e,o,i){return e.length<16?i(400):"100101"!==(e=e.toUpperCase()).substr(2,6)?i(402):e.substr(8,2).toUpperCase()!==t.shortAddress.toUpperCase()?i(403):o({shortAddress:t.shortAddress,name:r+t.shortAddress,checks:s,operates:n,attribute:a})}}},Relay.prototype.read=function(addr,code){null==code?code=this.checksAddress:"string"==typeof code&&(code=[code]);var analysis=[],_this=this;for(code.forEach(function(t){analysis.push(_this["analysis"+t])});addr.length<2;)addr="0"+addr;for(codeone=code.toString(16);codeone.length<2;)codeone="0"+codeone;var commond1=this.validate.crc16(addr+"0100000004"),cmd=[];cmd.push(commond1);var validate=this.validate;return{cmd:cmd.join(","),resolve:function(result,success,error){var data=result.split(",");if(data.length!==cmd.length)return error(400);for(var res={},allChecks={},i=0;i<data.length;i++){var item=data[i];if(item.length<12)return error(400);if(item=item.substr(0,result.length-4),validatedata=validate.crc16(item),validatedata.toLowerCase()!=result.toLowerCase())return error(401);var addrback=item.substr(0,2);if(addrback!=addr.toLowerCase())return error(403);var func2=item.substr(2,2);if("01"!=func2)return error(402);allChecks[1]=item.substr(6,2),code.forEach(function(item,index){var analyze=null;eval(analysis[index]),allChecks[item]&&analyze&&(res[item]=analyze(allChecks[item]))})}success(res)}}},Relay.prototype.write=function(t,e,r){for(t=t.toString(16);t.length<2;)t="0"+t;for(e=(e=parseInt(e)).toString(16);e.length<2;)e="0"+e;r=r?"01":"00";var s=this.validate.crc16(t+"0600"+e+"00"+r);this.validate;return console.log("commond="+s),{cmd:s,resolve:function(e,r,s){if(e.length<16)return s(400);if(e.substr(0,2).toLowerCase()!=t.toLowerCase())return s(403);if("06"!=e.substr(2,2))return s(402);var n=e.substr(10,2);return"01"==n?n=1:"00"==n&&(n=0),r(n)}}},Relay.prototype.encode=function(t,e,r){for(var s=this.validate.crc16(t+"0300000002"),n=[{begin:3,reslength:2},{begin:5,reslength:2}],a={},o=0;o<e.length;o++)a[e[o].key]=e[o].value;for(var i=parseInt(a["读取周期"]).toString(16),l=parseInt(a["Heartbeat"]).toString(16);i.length<4;)i="0"+i;for(;l.length<4;)l="0"+l;function d(t){return!!/^\d+(\.\d+)?$/.test(t)}function u(e,r,s,n,a,o,u){for(a=a.toString(16);a.length<2;)a="0"+a;var c="";r.forEach(function(t){var e=s.split(",");"sd"===u&&(void 0!==e[0]&&d(e[0])||(e[0]=200),void 0!==e[1]&&d(e[1])?parseFloat(e[1])<.3?e[1]=.3:parseFloat(e[1])>1&&(e[1]=1):e[1]=.3,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&d(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&d(e[3])?parseFloat(e[3])>=100&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&d(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=100:parseFloat(e[4])>100&&(e[4]=100):e[4]=100,e[4]=100*parseFloat(e[4])),"wd"===u&&(void 0!==e[0]&&d(e[0])||(e[0]=200),void 0!==e[1]&&d(e[1])?parseFloat(e[1])<.3?e[1]=.3:parseFloat(e[1])>1&&(e[1]=1):e[1]=.3,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&d(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&d(e[3])?parseFloat(e[3])>=100&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&d(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=100:parseFloat(e[4])>100&&(e[4]=100):e[4]=100,e[4]=100*parseFloat(e[4]));let r=parseInt(e[0]).toString(16);for(;r.length<2;)r="0"+r;let n=parseInt(e[1]).toString(16);for(;n.length<2;)n="0"+n;parseInt(e[2])>1&&(t.reslength=parseInt(t.reslength)-parseInt(e[2])+1);var a=parseInt(2*t.reslength);let o=parseInt(e[3]).toString(16);for(;o.length<a;)o="0"+o;let i=parseInt(e[4]).toString(16);for(;i.length<a;)i="0"+i;for(t.begin=t.begin.toString(16);t.begin.length<2;)t.begin="0"+t.begin;for(t.reslength=t.reslength.toString(16);t.reslength.length<2;)t.reslength="0"+t.reslength;for(var l=t.begin+t.reslength+r+n+o+i,h=(parseInt(l.length/2)+1).toString(16);h.length<2;)h="0"+h;c+=l=h+l});for(var h=parseInt(c.length/2).toString(16);h.length<2;)h="0"+h;for(var p=r.length.toString(16);p.length<2;)p="0"+p;var f="00"+n+i+l+h+p+c+e;if(f.length>128){let e=1;for(var g=parseInt(f.length/128)+1,v=e+""+g;f.length>128;){var y=f.substr(0,128);f=f.substr(128),v=o.push(t+a+v+y),e+=1}f.length>0&&o.push(t+a+g+""+g+f)}else o.push(t+a+"11"+f);return o}var c=[];return c=u(s,n,a.sd,r,0,c,"sd"),{cmd:(c=u(s,n,a.wd,r,1,c,"wd")).join(","),try:5}},Relay.prototype.decode=function(result){var ret={};if(26===result.length||22===result.length){var code=result.substr(2,2);let data="";if("00"===code||"01"===code){data=result.substr(10,12);const valid=this.validate.crc16(result.substr(4,18)).toUpperCase();if(valid!==result.substr(4,22).toUpperCase())return null;if("00"===code){const j=50;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}if("01"===code){const j=56;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}return ret}return null}return null},Relay.prototype.navi=function(t){if(t){return t.substr(0,2)}return null},module.exports=Relay}]);
