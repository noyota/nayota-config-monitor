this["Screen-485-pro"]=function(t){var r={};function e(n){if(r[n])return r[n].exports;var s=r[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,e),s.l=!0,s.exports}return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,r){if(1&r&&(t=e(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var s in t)e.d(n,s,function(r){return t[r]}.bind(null,s));return n},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},e.p="",e(e.s=0)}([function(t,r,e){"use strict";function n(t,r){this.addrmin=1,this.addrmax=40,this.validate=r,this.button=[1,2,3,4];var e=this;this.options=t,t.defaultCheck.forEach(function(t){e["analysis"+t.address]=t.analysis})}function s(t){for(var r=0,e=t;e.length>=2;)r+=parseInt(e.substr(0,2),16),e=e.slice(2);var n=(255&r^165).toString(16);return n.length<2&&(n="0"+n),t+n}n.prototype.find=function(t,r){t&&"string"==typeof t&&(t=parseInt(t)),r&&"string"==typeof r&&(r=parseInt(r));for(var e=t||this.addrmin,n=r||this.addrmax,o="";e<=n;){for(var u=e.toString(16);u.length<2;)u="0"+u;o+=s("a0"+u+"0000000000")+",",e++}var i=this.options.name,a=this.options.defaultCheck,f=this.options.defaultOperate;return{cmd:o.substr(0,o.length-1),resolve:function(t,r,e){if(t.length<16)return e(400);var n=t.substr(0,t.length-2);return s(n).toLowerCase()!==t?e(401):"50"!==t.substr(0,2)?e(402):r({shortAddress:n=t.substr(2,2),name:i+n,checks:a,operates:f})},changeAddr:!1}},n.prototype.read=function(t,r){"number"==typeof t&&(t=t.toString(16));for(;t.length<2;)t="0"+t;return{cmd:s("A0"+t+"0000000000"),resolve:function(r,e,n){if(null==r||""===r)return n(400);if(r.substr(2,2)!==t.toLowerCase())return n(403);var o=r.substr(0,2);if("50"!==o&&"51"!==o)return n(401);if(s(r.substr(0,14)).toLowerCase()!==r)return n(402);var u=r.substr(6,8),i=u.substr(0,2);for(i=parseInt(i,16).toString(2);i.length<8;)i="0"+i;var a=parseInt(i.substr(2,1)),f=parseInt(i.substr(3,1)),l=parseInt(i.substr(6,2),2),p=parseInt(u.substr(4,2),16);return e({0:parseInt(u.substr(6,2),16),1:f,2:a,3:l,4:p})}}},n.prototype.write=function(t,r,e,n){for(t=t.toString(16);t.length<2;)t="0"+t;var o=0,u=0,i=0,a=25;n.forEach(function(t){"1"===t.shortAddress?o=t.value||0:"2"===t.shortAddress?u=t.value||0:"3"===t.shortAddress?i=t.value||0:"4"===t.shortAddress&&(a=t.value||25)}),"1"===r?o=e:"2"===r?u=e:"3"===r?i=e:"4"===r&&(0===e?a++:1===e?a--:a=e),a>30&&(a=30),a<16&&(a=16);var f=o.toString()+"_"+u.toString()+"_"+a.toString()+"_"+i.toString();return f=function(t){t=t.split("_");var r=parseInt(t[3]).toString(2);r.length<2&&(r="0"+r);for(var e=parseInt("00"+t[1]+t[0]+"00"+r,2).toString(16),n=parseInt(t[2]).toString(16);n.length<2;)n="0"+n;for(;e.length<2;)e="0"+e;return e+"00"+n+"00"}(f),{cmd:s("A1"+t+"00"+f),resolve:function(e,n,o){if(e.length<16)return o(400);if(e.substr(2,2)!==t)return o(401);var u=e.substr(0,2);if("50"!==u&&"51"!==u)return o(402);if(s(e.substr(0,14)).toLowerCase()!==e)return o(403);var i=e.substr(6,2);for(i=parseInt(i,16).toString(2);i.length<8;)i="0"+i;"1"===r?n(parseInt(i.substr(3,1))):"2"===r?n(parseInt(i.substr(2,1))):"3"===r?n(parseInt(i.substr(6,2),2)):"4"===r&&n(parseInt(e.substr(10,2),16))}}},t.exports=n}]);