module.exports=function(e){var t={};function r(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(n,s,function(t){return e[t]}.bind(null,s));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(module,exports){function Relay(e,t){this.addrmin=1,this.addrmax=20,this.validate=t,this.button=[0,1,2,3,4,5,6,7],this.options=e;var r=this;r.checksAddress=[],e.defaultCheck.forEach(function(e){r["analysis"+e.address]=e.analysis,r.checksAddress.push(e.address)})}function rmDb(e){return e}Relay.prototype.find=function(e,t){e&&"string"==typeof e&&(e=parseInt(e)),t&&"string"==typeof t&&(t=parseInt(t));var r=this.options.name,n=this.options.defaultCheck,s=[];return void 0!==this.options.attribute&&(s=this.options.attribute),{cmd:"68AAAAAAAAAAAA681300DF16",resolve:function(e,t,o){if((e=rmDb(e)).length<44)return o(400);if("93"!=e.substr(24,2))return o(402);var a=e.substr(10,2);return t({shortAddress:a,name:r+a,checks:n,attribute:s})},changeAddr:!0}},Relay.prototype.changeAddr=function(e){for("number"==typeof e.shortAddress&&(e.shortAddress=e.shortAddress.toString(16));e.shortAddress.length<2;)e.shortAddress="0"+e.shortAddress;var t=(51+parseInt(e.shortAddress,16)).toString(16),r=(230+parseInt(t,16)).toString(16),n="68AAAAAAAAAAAA681506"+t+"3333333333"+r.substr(r.length-2,2)+"16",s=this.options.name,o=this.options.defaultCheck,a=[];return void 0!==this.options.attribute&&(a=this.options.attribute),{cmd:n,resolve:function(t,r,n){return(t=rmDb(t)).length<32?n(400):"95"!==t.substr(24,2)?n(402):r({shortAddress:e.shortAddress,name:s+e.shortAddress,checks:o,attribute:a})}}},Relay.prototype.read=function(addr,code){null==code?code=this.checksAddress:"string"==typeof code&&(code=[code]);var analysis=[],_this=this;for(code.forEach(function(e){analysis.push(_this["analysis"+e])});addr.length<2;)addr="0"+addr;var codeone="",cmd=[],db="";function getCommond(e){var t=e.substr(0,2),r=e.substr(2,2),n=e.substr(4,2),s=e.substr(6,2),o=(104+parseInt(addr,16)+104+17+4+parseInt(t,16)+parseInt(r,16)+parseInt(n,16)+parseInt(s,16)).toString(16),a=o.substr(o.length-2,2);return"68"+addr+"0000000000681104"+e+a+"16"}return code.indexOf("1")>-1&&(codeone="33343435",cmd.push(getCommond(codeone))),code.indexOf("2")>-1&&(codeone="33353435",cmd.push(getCommond(codeone))),code.indexOf("3")>-1&&(codeone="33363435",cmd.push(getCommond(codeone))),code.indexOf("4")>-1&&(codeone="33333433",cmd.push(getCommond(codeone))),code.indexOf("5")>-1&&(codeone="33343535",cmd.push(getCommond(codeone))),code.indexOf("6")>-1&&(codeone="33353535",cmd.push(getCommond(codeone))),code.indexOf("7")>-1&&(codeone="33363535",cmd.push(getCommond(codeone))),{cmd:cmd.join(","),resolve:function(result,success,error){var data=result.split(",");if(data.length!==cmd.length)return error(400);for(var res={},allChecks={},i=0;i<data.length;i++){var item=rmDb(data[i]);item=item.substr(0,item.length-4);var func=item.substr(24,2);if("91"!==func);else{var cheak=null;if("33343435"==item.substr(28,8)?cheak=1:"33353435"==item.substr(28,8)?cheak=2:"33363435"==item.substr(28,8)?cheak=3:"33333433"==item.substr(28,8)?cheak=4:"33343535"==item.substr(28,8)?cheak=5:"33353535"==item.substr(28,8)?cheak=6:"33363535"==item.substr(28,8)&&(cheak=7),code.indexOf("1")>-1&&1==cheak)if(data[i].length<44);else{let e=item.substr(36,2),t=item.substr(38,2);for(e=(parseInt(e,16)-51).toString(16),t=(parseInt(t,16)-51).toString(16);e.length<2;)e="0"+e;for(;t.length<2;)t="0"+t;allChecks[1]=t+e}else if(code.indexOf("2")>-1&&2==cheak)if(data[i].length<44);else{let e=item.substr(36,2),t=item.substr(38,2);for(e=(parseInt(e,16)-51).toString(16),t=(parseInt(t,16)-51).toString(16);e.length<2;)e="0"+e;for(;t.length<2;)t="0"+t;allChecks[2]=t+e}else if(code.indexOf("3")>-1&&3==cheak)if(data[i].length<44);else{let e=item.substr(36,2),t=item.substr(38,2);for(e=(parseInt(e,16)-51).toString(16),t=(parseInt(t,16)-51).toString(16);e.length<2;)e="0"+e;for(;t.length<2;)t="0"+t;allChecks[3]=t+e}else if(code.indexOf("4")>-1&&4==cheak)if(data[i].length<48);else{let e=item.substr(36,2),t=item.substr(38,2),r=item.substr(40,2),n=item.substr(42,2);for(e=(parseInt(e,16)-51).toString(16),t=(parseInt(t,16)-51).toString(16),r=(parseInt(r,16)-51).toString(16),n=(parseInt(n,16)-51).toString(16);e.length<2;)e="0"+e;for(;t.length<2;)t="0"+t;for(;r.length<2;)r="0"+r;for(;n.length<2;)n="0"+n;allChecks[4]=n+r+t+e}else if(code.indexOf("5")>-1&&5==cheak)if(data[i].length<46);else{let e=item.substr(36,2),t=item.substr(38,2),r=item.substr(40,2);for(e=(parseInt(e,16)-51).toString(16),t=(parseInt(t,16)-51).toString(16),r=(parseInt(r,16)-51).toString(16);e.length<2;)e="0"+e;for(;t.length<2;)t="0"+t;for(;r.length<2;)r="0"+r;allChecks[5]=r+t+e}else if(code.indexOf("6")>-1&&6==cheak)if(data[i].length<46);else{let e=item.substr(36,2),t=item.substr(38,2),r=item.substr(40,2);for(e=(parseInt(e,16)-51).toString(16),t=(parseInt(t,16)-51).toString(16),r=(parseInt(r,16)-51).toString(16);e.length<2;)e="0"+e;for(;t.length<2;)t="0"+t;for(;r.length<2;)r="0"+r;allChecks[6]=r+t+e}else if(code.indexOf("7")>-1&&7==cheak)if(data[i].length<46);else{let e=item.substr(36,2),t=item.substr(38,2),r=item.substr(40,2);for(e=(parseInt(e,16)-51).toString(16),t=(parseInt(t,16)-51).toString(16),r=(parseInt(r,16)-51).toString(16);e.length<2;)e="0"+e;for(;t.length<2;)t="0"+t;for(;r.length<2;)r="0"+r;allChecks[7]=r+t+e}}}code.forEach(function(item,index){var analyze=null;eval(analysis[index]),allChecks[item]&&analyze&&(res[item]=analyze(allChecks[item]))}),success(res)}}},Relay.prototype.encode=function(e,t,r){for(var n=this.validate.crc16(e+"0300000002"),s=[{begin:3,reslength:2},{begin:5,reslength:2}],o={},a=0;a<t.length;a++)o[t[a].key]=t[a].value;for(var i=parseInt(o["读取周期"]).toString(16),l=parseInt(o["上报周期"]).toString(16);i.length<4;)i="0"+i;for(;l.length<4;)l="0"+l;function d(e){return!!/^\d+(\.\d+)?$/.test(e)}function u(t,r,n,s,o,a,u){for(o=o.toString(16);o.length<2;)o="0"+o;var c="";r.forEach(function(e){var t=n.split(",");"sd"===u&&(void 0!==t[0]&&d(t[0])||(t[0]=200),void 0!==t[1]&&d(t[1])?parseFloat(t[1])<.3?t[1]=.3:parseFloat(t[1])>1&&(t[1]=1):t[1]=.3,t[1]=100*parseFloat(t[1]),void 0!==t[2]&&d(t[2])?parseInt(e.reslength)<parseInt(t[2])&&(t[2]=e.reslength):t[2]=1,void 0!==t[3]&&d(t[3])?parseFloat(t[3])>=100&&(t[3]=0):t[3]=0,t[3]=100*parseFloat(t[3]),void 0!==t[4]&&d(t[4])?parseFloat(t[4])<parseFloat(t[3])?t[4]=100:parseFloat(t[4])>100&&(t[4]=100):t[4]=100,t[4]=100*parseFloat(t[4])),"wd"===u&&(void 0!==t[0]&&d(t[0])||(t[0]=200),void 0!==t[1]&&d(t[1])?parseFloat(t[1])<.3?t[1]=.3:parseFloat(t[1])>1&&(t[1]=1):t[1]=.3,t[1]=100*parseFloat(t[1]),void 0!==t[2]&&d(t[2])?parseInt(e.reslength)<parseInt(t[2])&&(t[2]=e.reslength):t[2]=1,void 0!==t[3]&&d(t[3])?parseFloat(t[3])>=100&&(t[3]=0):t[3]=0,t[3]=100*parseFloat(t[3]),void 0!==t[4]&&d(t[4])?parseFloat(t[4])<parseFloat(t[3])?t[4]=100:parseFloat(t[4])>100&&(t[4]=100):t[4]=100,t[4]=100*parseFloat(t[4]));let r=parseInt(t[0]).toString(16);for(;r.length<2;)r="0"+r;let s=parseInt(t[1]).toString(16);for(;s.length<2;)s="0"+s;parseInt(t[2])>1&&(e.reslength=parseInt(e.reslength)-parseInt(t[2])+1);var o=parseInt(2*e.reslength);let a=parseInt(t[3]).toString(16);for(;a.length<o;)a="0"+a;let i=parseInt(t[4]).toString(16);for(;i.length<o;)i="0"+i;for(e.begin=e.begin.toString(16);e.begin.length<2;)e.begin="0"+e.begin;for(e.reslength=e.reslength.toString(16);e.reslength.length<2;)e.reslength="0"+e.reslength;for(var l=e.begin+e.reslength+r+s+a+i,h=(parseInt(l.length/2)+1).toString(16);h.length<2;)h="0"+h;c+=l=h+l});for(var h=parseInt(c.length/2).toString(16);h.length<2;)h="0"+h;for(var g=r.length.toString(16);g.length<2;)g="0"+g;var f="00"+s+i+l+h+g+c+t;if(f.length>128){let t=1;for(var p=parseInt(f.length/128)+1,m=t+""+p;f.length>128;){var b=f.substr(0,128);f=f.substr(128),m=a.push(e+o+m+b),t+=1}f.length>0&&a.push(e+o+p+""+p+f)}else a.push(e+o+"11"+f);return a}var c=[];return c=u(n,s,o.sd,r,0,c,"sd"),{cmd:(c=u(n,s,o.wd,r,1,c,"wd")).join(","),try:5}},Relay.prototype.decode=function(result){var ret={};if(26===result.length||22===result.length){var code=result.substr(2,2);let data="";if("00"===code||"01"===code){data=result.substr(10,12);const valid=this.validate.crc16(result.substr(4,18)).toLowerCase();if(valid!==result.substr(4,22).toLowerCase())return null;if("00"===code){const j=50;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}if("01"===code){const j=56;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}return ret}return null}return null},Relay.prototype.navi=function(e){if(e){return e.substr(0,2)}return null},module.exports=Relay}]);