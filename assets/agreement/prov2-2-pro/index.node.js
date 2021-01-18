module.exports=function(t){var e={};function r(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(s,n,function(e){return t[e]}.bind(null,n));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(module,exports){function Relay(t,e){this.addrmin=100,this.addrmax=130,this.validate=e,this.button=[0,1,2,3],this.options=t;var r=this;r.checksAddress=[],t.defaultCheck.forEach(function(t){r["analysis"+t.address]=t.analysis,r.checksAddress.push(t.address)})}Relay.prototype.find=function(t,e){t&&"string"==typeof t&&(t=parseInt(t)),e&&"string"==typeof e&&(e=parseInt(e));t||this.addrmin,e||this.addrmax,this.validate;var r=this.options.name,s=this.options.defaultCheck,n=this.options.defaultOperate,a=[];return void 0!==this.options.attribute&&(a=this.options.attribute),{cmd:"AAAAAAAAAA5656560F",resolve:function(t,e,o){if(t.length<10)return o(400);var l=t.substr(8,2);return e({shortAddress:l,name:r+l,checks:s,operates:n,attribute:a})},changeAddr:!0}},Relay.prototype.changeAddr=function(t){for("number"==typeof t.shortAddress&&(t.shortAddress=t.shortAddress.toString(16));t.shortAddress.length<2;)t.shortAddress="0"+t.shortAddress;for("number"==typeof t.oldAddr&&(t.oldAddr=t.oldAddr.toString(16));t.oldAddr.length<2;)t.oldAddr="0"+t.oldAddr;var e="00000000"+t.oldAddr+"F8E7D600000000"+t.shortAddress,r=(this.validate,this.options.name),s=this.options.defaultCheck,n=this.options.defaultOperate,a=[];return void 0!==this.options.attribute&&(a=this.options.attribute),{cmd:e+",AAAAAAAAAA5656560F",resolve:function(e,o,l){var i=e.split(",")[1];return i.length<10?l(400):i.substr(8,2).toUpperCase()!=t.shortAddress.toUpperCase()?l(402):o({shortAddress:t.shortAddress,name:r+t.shortAddress,checks:s,operates:n,attribute:a})}}},Relay.prototype.read=function(t,e){},Relay.prototype.write=function(t,e,r){var s=e;for(0===r?r="00":1===r&&(r="01"),r=r.toString(16);r.length<2;)r="0"+r;for(t=t.toString(16);t.length<2;)t="0"+t;for(e=e.toString(16);e.length<2;)e="0"+e;this.validate;var n="00000000"+t+"00"+e+r+"0F",a="00000000"+t+"8686860F";this.validate,this.options.name,this.options.defaultCheck,this.options.defaultOperate;return{cmd:n+","+a,resolve:function(t,e,r){var n=t.split(",")[1];if(n.length<20)return r(400);0==s?s=10:1==s?s=12:2==s&&(s=14);var a=n.substr(s,2);return"01"===a?a=1:"00"===a&&(a=0),e(a)}}},Relay.prototype.encode=function(t,e,r){for(var s=this.validate.crc16(t+"0300320003"),n=this.validate.crc16(t+"0300380003"),a=this.validate.crc16(t+"04000A0002"),o=[{begin:3,reslength:2},{begin:5,reslength:2},{begin:7,reslength:2}],l={},i=0;i<e.length;i++)l[e[i].key]=e[i].value;for(var d=parseInt(l["读取周期"]).toString(16),u=parseInt(l["Heartbeat"]).toString(16);d.length<4;)d="0"+d;for(;u.length<4;)u="0"+u;function p(t){return!!/^\d+(\.\d+)?$/.test(t)}function h(e,r,s,n,a,o,l){for(a=a.toString(16);a.length<2;)a="0"+a;var i="";r.forEach(function(t){var e=s.split(",");"dy"===l&&(void 0!==e[0]&&p(e[0])||(e[0]=200),void 0!==e[1]&&p(e[1])?parseFloat(e[1])<.01?e[1]=.01:parseFloat(e[1])>1&&(e[1]=1):e[1]=.01,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&p(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&p(e[3])?parseFloat(e[3])>=380&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&p(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=380:parseFloat(e[4])>380&&(e[4]=380):e[4]=380,e[4]=100*parseFloat(e[4])),"dl"===l&&(void 0!==e[0]&&p(e[0])||(e[0]=200),void 0!==e[1]&&p(e[1])?parseFloat(e[1])<.01?e[1]=.01:parseFloat(e[1])>1&&(e[1]=1):e[1]=.01,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&p(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&p(e[3])?parseFloat(e[3])>=10&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&p(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=10:parseFloat(e[4])>10&&(e[4]=10):e[4]=10,e[4]=100*parseFloat(e[4])),"dn"===l&&(void 0!==e[0]&&p(e[0])||(e[0]=200),void 0!==e[1]&&p(e[1])?parseFloat(e[1])<.1?e[1]=.1:parseFloat(e[1])>1&&(e[1]=1):e[1]=.1,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&p(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&p(e[3])?parseFloat(e[3])>=10&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&p(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=2e4:parseFloat(e[4])>10&&(e[4]=2e4):e[4]=2e4,e[4]=100*parseFloat(e[4])),console.log(JSON.stringify(e));let r=parseInt(e[0]).toString(16);for(;r.length<2;)r="0"+r;let n=parseInt(e[1]).toString(16);for(;n.length<2;)n="0"+n;parseInt(e[2])>1&&(t.reslength=parseInt(t.reslength)-parseInt(e[2])+1);var a=parseInt(2*t.reslength);let o=parseInt(e[3]).toString(16);for(;o.length<a;)o="0"+o;let d=parseInt(e[4]).toString(16);for(;d.length<a;)d="0"+d;for(t.begin=t.begin.toString(16);t.begin.length<2;)t.begin="0"+t.begin;for(t.reslength=t.reslength.toString(16);t.reslength.length<2;)t.reslength="0"+t.reslength;for(var u=t.begin+t.reslength+r+n+o+d,h=(parseInt(u.length/2)+1).toString(16);h.length<2;)h="0"+h;i+=u=h+u});for(var h=parseInt(i.length/2).toString(16);h.length<2;)h="0"+h;for(var c=r.length.toString(16);c.length<2;)c="0"+c;var g="00"+n+d+u+h+c+i+e;if(g.length>128){let e=1;for(var f=parseInt(g.length/128)+1,v=e+""+f;g.length>128;){var y=g.substr(0,128);g=g.substr(128),v=o.push(t+a+v+y),e+=1}g.length>0&&o.push(t+a+f+""+f+g)}else o.push(t+a+"11"+g);return o}var c=[];return c=h(s,o,l.dy,r,0,c,"dy"),c=h(n,o,l.dl,r,1,c,"dl"),{cmd:(c=h(a,[{begin:3,reslength:2}],l.dn,r,2,c,"dn")).join(","),try:5}},Relay.prototype.decode=function(result){var ret={};if(26===result.length||22===result.length){var code=result.substr(2,2);let data="";if("00"===code||"01"===code){data=result.substr(10,12);const valid=this.validate.crc16(result.substr(4,18)).toUpperCase();if(valid!==result.substr(4,22).toUpperCase())return null;if("00"===code){const j=50;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}if("01"===code){const j=56;for(let i=0;i<3;i++){const code=parseInt(j)+i;let d=data.substr(4*i,4);const analysis=this["analysis"+code.toString(16)];var analyze=null;analysis&&eval(analysis),analyze&&(d=analyze(d)),ret[code.toString(16)]=d}}}if("02"===code){data=result.substr(10,8);const valid=this.validate.crc16(result.substr(4,14)).toLowerCase();if(valid!==result.substr(4,18).toLowerCase())return null;const code="a";var analysis=this["analysis"+code],analyze=null;analysis&&eval(analysis),analyze&&(data=analyze(data)),ret[code]=data}return ret}return null},Relay.prototype.navi=function(t){if(t){return t.substr(0,2)}return null},module.exports=Relay}]);
