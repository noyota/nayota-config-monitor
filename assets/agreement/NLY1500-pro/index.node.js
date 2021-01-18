module.exports=function(t){var e={};function r(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(n,s,function(e){return t[e]}.bind(null,s));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(module,exports){function Relay(t,e){this.addrmin=1,this.addrmax=20,this.validate=e,this.button=[0,1,2,3,4,5,6,7],this.options=t;var r=this;r.checksAddress=[],t.defaultCheck.forEach(function(t){r["analysis"+t.address]=t.analysis,r.checksAddress.push(t.address)})}Relay.prototype.find=function(t,e){t&&"string"==typeof t&&(t=parseInt(t)),e&&"string"==typeof e&&(e=parseInt(e));var r=this.options.name,n=this.options.defaultCheck,s=[];return void 0!==this.options.attribute&&(s=this.options.attribute),{cmd:"68AAAAAAAAAAAA681300DF16",resolve:function(t,e,o){if(t.length<36)return o(400);if("93"!=t.substr(16,2))return o(402);var a=t.substr(32,2);return e({shortAddress:a,name:r+a,checks:n,attribute:s})},changeAddr:!0}},Relay.prototype.changeAddr=function(t){for("number"==typeof t.shortAddress&&(t.shortAddress=t.shortAddress.toString(16));t.shortAddress.length<2;)t.shortAddress="0"+t.shortAddress;var e=(51+parseInt(t.shortAddress,16)).toString(16),r=(230+parseInt(e,16)).toString(16),n="68AAAAAAAAAAAA6815063333333333"+e+r.substr(r.length-2,2)+"16",s=this.options.name,o=this.options.defaultCheck,a=[];return void 0!==this.options.attribute&&(a=this.options.attribute),{cmd:n,resolve:function(e,r,n){return e.length<24?n(400):"95"!==e.substr(16,2)?n(402):r({shortAddress:t.shortAddress,name:s+t.shortAddress,checks:o,attribute:a})}}},Relay.prototype.read=function(addr,code){null==code?code=this.checksAddress:"string"==typeof code&&(code=[code]);var analysis=[],_this=this;for(code.forEach(function(t){analysis.push(_this["analysis"+t])});addr.length<2;)addr="0"+addr;var codeone="",cmd=[];function getCommond(t){var e=t.substr(0,2),r=t.substr(2,2),n=t.substr(4,2),s=t.substr(6,2),o=(104+parseInt(addr,16)+104+17+4+parseInt(e,16)+parseInt(r,16)+parseInt(n,16)+parseInt(s,16)).toString(16),a=o.substr(o.length-2,2);return"680000000000"+addr+"681104"+t+a+"16"}return console.log(code),code.indexOf("1")>-1&&(codeone="33343435",cmd.push(getCommond(codeone))),code.indexOf("2")>-1&&(codeone="33333333",cmd.push(getCommond(codeone))),code.indexOf("3")>-1&&(codeone="33343535",cmd.push(getCommond(codeone))),{cmd:cmd.join(","),resolve:function(result,success,error){var data=result.split(",");if(data.length!==cmd.length)return error(400);for(var res={},allChecks={},i=0;i<data.length;i++){var item=data[i];item=item.substr(0,item.length-4);var func=item.substr(16,2);if("91"!==func)return error(402);var cheak=null;if("33343435"==item.substr(20,8)?cheak=1:"33333333"==item.substr(20,8)?cheak=2:"33343535"==item.substr(20,8)&&(cheak=3),code.indexOf("1")>-1&&1==cheak){if(result.length<36)return error(400);let t=item.substr(28,2),e=item.substr(30,2);for(t=(parseInt(t,16)-51).toString(16),e=(parseInt(e,16)-51).toString(16);t.length<2;)t="0"+t;for(;e.length<2;)e="0"+e;allChecks[1]=e+t}else if(code.indexOf("2")>-1&&2==cheak){if(result.length<40)return error(400);let t=item.substr(28,2),e=item.substr(30,2),r=item.substr(32,2),n=item.substr(34,2);for(t=(parseInt(t,16)-51).toString(16),e=(parseInt(e,16)-51).toString(16),r=(parseInt(r,16)-51).toString(16),n=(parseInt(n,16)-51).toString(16);t.length<2;)t="0"+t;for(;e.length<2;)e="0"+e;for(;r.length<2;)r="0"+r;for(;n.length<2;)n="0"+n;allChecks[2]=n+r+e+t}else if(code.indexOf("3")>-1&&3==cheak){if(result.length<38)return error(400);let t=item.substr(28,2),e=item.substr(30,2),r=item.substr(32,2);for(t=(parseInt(t,16)-51).toString(16),e=(parseInt(e,16)-51).toString(16),r=(parseInt(r,16)-51).toString(16);t.length<2;)t="0"+t;for(;e.length<2;)e="0"+e;for(;r.length<2;)r="0"+r;allChecks[3]=r+e+t}code.forEach(function(item,index){var analyze=null;eval(analysis[index]),allChecks[item]&&analyze&&(res[item]=analyze(allChecks[item]))})}success(res)}}},Relay.prototype.encode=function(t,e,r){for(var n=this.validate.crc16(t+"0300000002"),s=[{begin:3,reslength:2},{begin:5,reslength:2}],o={},a=0;a<e.length;a++)o[e[a].key]=e[a].value;for(var i=parseInt(o["读取周期"]).toString(16),l=parseInt(o["Heartbeat"]).toString(16);i.length<4;)i="0"+i;for(;l.length<4;)l="0"+l;function d(t){return!!/^\d+(\.\d+)?$/.test(t)}function u(e,r,n,s,o,a,u){for(o=o.toString(16);o.length<2;)o="0"+o;var c="";r.forEach(function(t){var e=n.split(",");"sd"===u&&(void 0!==e[0]&&d(e[0])||(e[0]=200),void 0!==e[1]&&d(e[1])?parseFloat(e[1])<.3?e[1]=.3:parseFloat(e[1])>1&&(e[1]=1):e[1]=.3,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&d(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&d(e[3])?parseFloat(e[3])>=100&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&d(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=100:parseFloat(e[4])>100&&(e[4]=100):e[4]=100,e[4]=100*parseFloat(e[4])),"wd"===u&&(void 0!==e[0]&&d(e[0])||(e[0]=200),void 0!==e[1]&&d(e[1])?parseFloat(e[1])<.3?e[1]=.3:parseFloat(e[1])>1&&(e[1]=1):e[1]=.3,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&d(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&d(e[3])?parseFloat(e[3])>=100&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&d(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=100:parseFloat(e[4])>100&&(e[4]=100):e[4]=100,e[4]=100*parseFloat(e[4]));let r=parseInt(e[0]).toString(16);for(;r.length<2;)r="0"+r;let s=parseInt(e[1]).toString(16);for(;s.length<2;)s="0"+s;parseInt(e[2])>1&&(t.reslength=parseInt(t.reslength)-parseInt(e[2])+1);var o=parseInt(2*t.reslength);let a=parseInt(e[3]).toString(16);for(;a.length<o;)a="0"+a;let i=parseInt(e[4]).toString(16);for(;i.length<o;)i="0"+i;for(t.begin=t.begin.toString(16);t.begin.length<2;)t.begin="0"+t.begin;for(t.reslength=t.reslength.toString(16);t.reslength.length<2;)t.reslength="0"+t.reslength;for(var l=t.begin+t.reslength+r+s+a+i,h=(parseInt(l.length/2)+1).toString(16);h.length<2;)h="0"+h;c+=l=h+l});for(var h=parseInt(c.length/2).toString(16);h.length<2;)h="0"+h;for(var g=r.length.toString(16);g.length<2;)g="0"+g;var p="00"+s+i+l+h+g+c+e;if(p.length>128){let e=1;for(var f=parseInt(p.length/128)+1,v=e+""+f;p.length>128;){var b=p.substr(0,128);p=p.substr(128),v=a.push(t+o+v+b),e+=1}p.length>0&&a.push(t+o+f+""+f+p)}else a.push(t+o+"11"+p);return a}var c=[];return c=u(n,s,o.sd,r,0,c,"sd"),{cmd:(c=u(n,s,o.wd,r,1,c,"wd")).join(","),try:5}},Relay.prototype.decode=function(result){var ret={};if(26===result.length||22===result.length){var code=result.substr(2,2);let data="";if("00"===code||"01"===code){data=result.substr(10,12);const valid=this.validate.crc16(result.substr(4,18)).toLowerCase();if(valid!==result.substr(4,22).toLowerCase())return null;if("00"===code){const j=50;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}if("01"===code){const j=56;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}return ret}return null}return null},Relay.prototype.navi=function(t){if(t){return t.substr(0,2)}return null},module.exports=Relay}]);
