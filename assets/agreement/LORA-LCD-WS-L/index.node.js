module.exports=function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e){function r(t,e){this.options=t,this.he=e.he,this.numToHexStr=e.numToHexStr,t.defaultCheck.forEach(t=>{this["analysis"+t.address]=t.analysis})}r.prototype.config=function(t,e,r,n,o){const u=n.factor,s=n.bandwidth,a=n.codingrate;let i="aa000002"+t+u+s+e+parseInt(n.frequency,16).toString(16)+a+r;return{cmd:i="aa0000"+this.he(i)+"ff22"}},r.prototype.read=function(t,e){let r="aa"+t.loraAddr+"18";return r=this.he(r),{cmd:r="aa"+t.netAddr+r+"ff22",resolve:function(e,r,n){if(e.length<24)return n(400);const o=e.indexOf("aa"+t.netAddr.toLowerCase()),u=e.indexOf("ff22");if(o<0||u<0)return n(401);if("98"!==e.substring(12,14))return n(402);const s=e.substr(14,16);let a=s.substr(0,4),i=s.substr(4,4),f=s.substr(8,4);a=parseInt(a.substr(0,2),16)+parseInt(a.substr(2,2),16)/100,i=parseInt(i.substr(0,2),16)+parseInt(i.substr(2,2),16)/10,f=parseInt(f.substr(0,2),16)+parseInt(f.substr(2,2),16)/10,i>128&&(i=-(i-128)),a=Math.round(100*a)/100,i=Math.round(10*i)/10,f=Math.round(10*f)/10;let d=e.substr(12,2);return r({0:a,1:i,2:f,3:d=parseInt(d,16)})}}},r.prototype.decode=function(t,e){const r=t.indexOf("aa"+e.netAddr.toLowerCase()),n=t.indexOf("ff22");return r<0||n<0?"":(t=t.substring(r+6,n)).indexOf("aa"+e.loraAddr.toLowerCase())<0?"":{}},t.exports=r}]);