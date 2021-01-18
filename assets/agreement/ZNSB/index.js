this.ZNSB=function(t){var r={};function e(s){if(r[s])return r[s].exports;var o=r[s]={i:s,l:!1,exports:{}};return t[s].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=r,e.d=function(t,r,s){e.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:s})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,r){if(1&r&&(t=e(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(e.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var o in t)e.d(s,o,function(r){return t[r]}.bind(null,o));return s},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},e.p="",e(e.s=0)}([function(t,r,e){"use strict";function s(t,r){this.addrmin=1,this.addrmax=247,this.validate=r,this.button=[0,1,2,3],this.options=t;var e=this;e.checksAddress=[],t.defaultCheck.forEach(function(t){e["analysis"+t.address]=t.analysis,e.checksAddress.push(t.address)}),t.defaultOperate.forEach(function(t){e["analysis"+t.address]=t.analysis})}var o=function(t){return t};s.prototype.find=function(t,r){t&&"string"==typeof t&&(t=parseInt(t)),r&&"string"==typeof r&&(r=parseInt(r));for(var e=t||this.addrmin,s=r||this.addrmax,o="";e<=s;){for(var n=e.toString(16);n.length<2;)n="0"+n;o+=this.validate.crc16(n+"0300000002")+",",e++}var i=this.validate,a=this.options.name,u=this.options.defaultCheck,d=this.options.defaultOperate,c=[];return void 0!==this.options.attribute&&(c=this.options.attribute),{cmd:o.substr(0,o.length-1),timeout:5e3,resolve:function(t,r,e){if(t.length<18)return e(400);var s=t.substr(0,t.length-4);if(i.crc16(s).toLowerCase()!==t.toLowerCase())return e(401);if("03"!==t.substr(2,2))return e(402);var o=t.substr(0,2),n={shortAddress:o,name:a+o,checks:u,operates:d,attribute:c};return console.log(n),r(n)},changeAddr:!0}},s.prototype.changeAddr=function(t){for("number"==typeof t.shortAddress&&(t.shortAddress=t.shortAddress.toString(16));t.shortAddress.length<2;)t.shortAddress="0"+t.shortAddress;for("number"==typeof t.oldAddr&&(t.oldAddr=t.oldAddr.toString(16));t.oldAddr.length<2;)t.oldAddr="0"+t.oldAddr;var r=t.oldAddr+"100015000102"+t.shortAddress+"01";r=this.validate.crc16(r);var e=this.validate,s=this.options.name,o=this.options.defaultOperate,n=this.options.defaultCheck,i=[];return void 0!==this.options.attribute&&(i=this.options.attribute),{cmd:r,timeout:5e3,resolve:function(r,a,u){if(r.length<16)return u(400);var d=r.substr(0,r.length-4);return e.crc16(d).toUpperCase()!==r.toUpperCase()?u(401):"10"!==r.substr(2,2)?u(402):a({shortAddress:t.shortAddress,name:s+t.shortAddress,checks:n,operates:o,attribute:i})}}},s.prototype.read=function(t,r){null==r?r=this.checksAddress:"string"==typeof r&&(r=[r]);var e=[],s=this;for(["a"].forEach(function(t){r.push(t)});t.length<2;)t="0"+t;var n=this.validate.crc16(t+"03 00 00 00 02"),i=this.validate.crc16(t+"0100010001"),a=[];r.forEach(function(t){e.push(s["analysis"+t]),r.indexOf("0")>-1&&a.push(n),r.indexOf("1")>-1&&a.push(i)});var u=this.validate;return{cmd:a.join(","),timeout:5e3,resolve:function(e,s,d){var c=e.split(",");if(c.length!==a.length)return d(400);for(var f={},l={},h=0;h<c.length;h++){var p=o(c[h]);if(u.crc16(p.substr(0,p.length-4)).toLowerCase()!==p.toLowerCase())return d(401);if(p.substr(0,2)!==t.toLowerCase())return d(403);if(a[h]===n){if("03"!==p.substr(2,2))return d(402);l[0]=p.substr(6,8)}if(a[h]===i){if("03"!==p.substr(2,2))return d(402);l[1]=p.substr(6,8)}r.forEach(function(t,r){l[t]})}s(f)}}},s.prototype.write=function(t,r,e,s){for("number"==typeof t&&(t=t.toString(16));t.length<2;)t="0"+t;e=parseInt(e),console.log(e),1===e?e="FF":0===e&&(e="00");var n=this.validate;return{cmd:this.validate.crc16(t+"05000100"+e),timeout:15e3,resolve:function(r,e,s){var i=o(r);if(console.log(i.length),i.length<16)return s(400);if(n.crc16(i.substr(0,i.length-4)).toLowerCase()!==i.toLowerCase())return s(401);if(i.substr(0,2).toLowerCase()!==t.toLowerCase())return s(403);if("05"!==i.substr(2,2))return s(402);var a=i.substr(10,2);return"00"===a?a=0:"FF"===a&&(a=1),e(a)}}},s.prototype.navi=function(t){return t?t.substr(0,2):null},t.exports=s}]);