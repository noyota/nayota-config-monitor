this["prov2-2-pro"]=function(t){var e={};function r(a){if(e[a])return e[a].exports;var s=e[a]={i:a,l:!1,exports:{}};return t[a].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=t,r.c=e,r.d=function(t,e,a){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(a,s,function(e){return t[e]}.bind(null,s));return a},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(module,exports,__webpack_require__){"use strict";function Relay(t,e){this.addrmin=100,this.addrmax=130,this.validate=e,this.button=[0,1,2,3],this.options=t;var r=this;r.checksAddress=[],t.defaultCheck.forEach(function(t){r["analysis"+t.address]=t.analysis,r.checksAddress.push(t.address)})}Relay.prototype.find=function(t,e){t&&"string"==typeof t&&(t=parseInt(t)),e&&"string"==typeof e&&(e=parseInt(e));t||this.addrmin,e||this.addrmax,this.validate;var r=this.options.name,a=this.options.defaultCheck,s=this.options.defaultOperate,n=[];return void 0!==this.options.attribute&&(n=this.options.attribute),{cmd:"AAAAAAAAAA5656560F",resolve:function(t,e,o){if(t.length<10)return o(400);var i=t.substr(8,2);return e({shortAddress:i,name:r+i,checks:a,operates:s,attribute:n})},changeAddr:!0}},Relay.prototype.changeAddr=function(t){for("number"==typeof t.shortAddress&&(t.shortAddress=t.shortAddress.toString(16));t.shortAddress.length<2;)t.shortAddress="0"+t.shortAddress;for("number"==typeof t.oldAddr&&(t.oldAddr=t.oldAddr.toString(16));t.oldAddr.length<2;)t.oldAddr="0"+t.oldAddr;var e="00000000"+t.oldAddr+"F8E7D600000000"+t.shortAddress,r=(this.validate,this.options.name),a=this.options.defaultCheck,s=this.options.defaultOperate,n=[];return void 0!==this.options.attribute&&(n=this.options.attribute),{cmd:e+",AAAAAAAAAA5656560F",resolve:function(e,o,i){var l=e.split(",")[1];return l.length<10?i(400):l.substr(8,2).toUpperCase()!=t.shortAddress.toUpperCase()?i(402):o({shortAddress:t.shortAddress,name:r+t.shortAddress,checks:a,operates:s,attribute:n})}}},Relay.prototype.read=function(t,e){},Relay.prototype.write=function(t,e,r){var a=e;for(0===r?r="00":1===r&&(r="01"),r=r.toString(16);r.length<2;)r="0"+r;for(t=t.toString(16);t.length<2;)t="0"+t;for(e=e.toString(16);e.length<2;)e="0"+e;this.validate;var s="00000000"+t+"00"+e+r+"0F",n="00000000"+t+"8686860F";this.validate,this.options.name,this.options.defaultCheck,this.options.defaultOperate;return{cmd:s+","+n,resolve:function(t,e,r){var s=t.split(",")[1];if(s.length<20)return r(400);0==a?a=10:1==a?a=12:2==a&&(a=14);var n=s.substr(a,2);return"01"===n?n=1:"00"===n&&(n=0),e(n)}}},Relay.prototype.encode=function(t,e,r){for(var a=this.validate.crc16(t+"0300320003"),s=this.validate.crc16(t+"0300380003"),n=this.validate.crc16(t+"04000A0002"),o=[{begin:3,reslength:2},{begin:5,reslength:2},{begin:7,reslength:2}],i={},l=0;l<e.length;l++)i[e[l].key]=e[l].value;for(var d=parseInt(i["读取周期"]).toString(16),u=parseInt(i["Heartbeat"]).toString(16);d.length<4;)d="0"+d;for(;u.length<4;)u="0"+u;function p(t){return!!/^\d+(\.\d+)?$/.test(t)}function h(e,r,a,s,n,o,i){for(n=n.toString(16);n.length<2;)n="0"+n;var l="";r.forEach(function(t){var e=a.split(",");"dy"===i&&(void 0!==e[0]&&p(e[0])||(e[0]=200),void 0!==e[1]&&p(e[1])?parseFloat(e[1])<.01?e[1]=.01:parseFloat(e[1])>1&&(e[1]=1):e[1]=.01,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&p(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&p(e[3])?parseFloat(e[3])>=380&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&p(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=380:parseFloat(e[4])>380&&(e[4]=380):e[4]=380,e[4]=100*parseFloat(e[4])),"dl"===i&&(void 0!==e[0]&&p(e[0])||(e[0]=200),void 0!==e[1]&&p(e[1])?parseFloat(e[1])<.01?e[1]=.01:parseFloat(e[1])>1&&(e[1]=1):e[1]=.01,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&p(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&p(e[3])?parseFloat(e[3])>=10&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&p(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=10:parseFloat(e[4])>10&&(e[4]=10):e[4]=10,e[4]=100*parseFloat(e[4])),"dn"===i&&(void 0!==e[0]&&p(e[0])||(e[0]=200),void 0!==e[1]&&p(e[1])?parseFloat(e[1])<.1?e[1]=.1:parseFloat(e[1])>1&&(e[1]=1):e[1]=.1,e[1]=100*parseFloat(e[1]),void 0!==e[2]&&p(e[2])?parseInt(t.reslength)<parseInt(e[2])&&(e[2]=t.reslength):e[2]=1,void 0!==e[3]&&p(e[3])?parseFloat(e[3])>=10&&(e[3]=0):e[3]=0,e[3]=100*parseFloat(e[3]),void 0!==e[4]&&p(e[4])?parseFloat(e[4])<parseFloat(e[3])?e[4]=2e4:parseFloat(e[4])>10&&(e[4]=2e4):e[4]=2e4,e[4]=100*parseFloat(e[4])),console.log(JSON.stringify(e));for(var r=parseInt(e[0]).toString(16);r.length<2;)r="0"+r;for(var s=parseInt(e[1]).toString(16);s.length<2;)s="0"+s;parseInt(e[2])>1&&(t.reslength=parseInt(t.reslength)-parseInt(e[2])+1);for(var n=parseInt(2*t.reslength),o=parseInt(e[3]).toString(16);o.length<n;)o="0"+o;for(var d=parseInt(e[4]).toString(16);d.length<n;)d="0"+d;for(t.begin=t.begin.toString(16);t.begin.length<2;)t.begin="0"+t.begin;for(t.reslength=t.reslength.toString(16);t.reslength.length<2;)t.reslength="0"+t.reslength;for(var u=t.begin+t.reslength+r+s+o+d,h=(parseInt(u.length/2)+1).toString(16);h.length<2;)h="0"+h;l+=u=h+u});for(var h=parseInt(l.length/2).toString(16);h.length<2;)h="0"+h;for(var g=r.length.toString(16);g.length<2;)g="0"+g;var c="00"+s+d+u+h+g+l+e;if(c.length>128){for(var f=1,v=parseInt(c.length/128)+1,y=f+""+v;c.length>128;){var b=c.substr(0,128);c=c.substr(128),y=o.push(t+n+y+b),f+=1}c.length>0&&o.push(t+n+v+""+v+c)}else o.push(t+n+"11"+c);return o}var g=[];return g=h(a,o,i.dy,r,0,g,"dy"),g=h(s,o,i.dl,r,1,g,"dl"),{cmd:(g=h(n,[{begin:3,reslength:2}],i.dn,r,2,g,"dn")).join(","),try:5}},Relay.prototype.decode=function(result){var ret={};if(26===result.length||22===result.length){var code=result.substr(2,2),data="";if("00"===code||"01"===code){data=result.substr(10,12);var valid=this.validate.crc16(result.substr(4,18)).toUpperCase();if(valid!==result.substr(4,22).toUpperCase())return null;if("00"===code)for(var j=50,i=0;i<3;i++){var _code=parseInt(j)+i,d=data.substr(4*i,4),_analysis=this["analysis"+_code.toString(16)],analyze=null;_analysis&&eval(_analysis),analyze&&(d=analyze(d)),ret[_code.toString(16)]=d}if("01"===code)for(var _j=56,_i=0;_i<3;_i++){var _code2=parseInt(_j)+_i,_d=data.substr(4*_i,4),_analysis2=this["analysis"+_code2.toString(16)],analyze=null;_analysis2&&eval(_analysis2),analyze&&(_d=analyze(_d)),ret[_code2.toString(16)]=_d}}if("02"===code){data=result.substr(10,8);var _valid=this.validate.crc16(result.substr(4,14)).toLowerCase();if(_valid!==result.substr(4,18).toLowerCase())return null;var _code3="a",analysis=this["analysis"+_code3],analyze=null;analysis&&eval(analysis),analyze&&(data=analyze(data)),ret[_code3]=data}return ret}return null},Relay.prototype.navi=function(t){return t?t.substr(0,2):null},module.exports=Relay}]);
