module.exports=function(t){var e={};function r(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)r.d(n,s,function(e){return t[e]}.bind(null,s));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e){!function(){function e(t,e){this.addrmin=1,this.addrmax=40,this.validate=e,this.button=[0,1,2,3],this.options=t;var r=this;JSON.parse(t.defaulttest).forEach(function(t){r["analysis"+t.address]=t.analysis})}function r(t,e,r,n){return(parseInt(parseInt(t,16)^parseInt(e,16)^parseInt(r,16)^parseInt(n,16))-3).toString(16)}e.prototype.find=function(){this.validate;var t=this.options.devicename,e=JSON.parse(this.options.defaulttest),n=JSON.parse(this.options.defaultbutton);return{cmd:"90 00 00 74 "+r("90","00","00","74")+" 97",resolve:function(r,s,o){if(r.length<12)return o(400);var d=r.substr(0,2);if("30"!=d)return o(401);if("74"!=(d=r.substr(6,8)))return o(402);var a=r.substr(2,6);return s({address:a,name:t+a,test:e,button:n})},changeAddr:!0}},e.prototype.changeAddr=function(t){for("number"==typeof t.address&&(t.address=t.address.toString(16));t.address.length<2;)t.address="0"+t.address;for("number"==typeof t.oldAddr&&(t.oldAddr=t.oldAddr.toString(16));t.oldAddr.length<2;)t.oldAddr="0"+t.oldAddr;var e="90 "+t.address+t.oldAddr+" 75 "+r("90",t.address,t.oldAddr,"75")+" 97",n=(this.validate,this.options.devicename),s=JSON.parse(this.options.defaulttest),o=JSON.parse(this.options.defaultbutton);return{cmd:e,resolve:function(e,r,d){if(e.length<12)return d(400);var a=e.substr(0,2);return"30"!=a?d(401):e.substr(2,4)!=t.address?d(402):e.substr(4,6)!=t.oldAddr?d(402):"75"!=(a=e.substr(6,8))?d(404):r({address:t.address+" "+t.oldAddr,name:n+t.address,test:s,button:o})}}},e.prototype.readOne=function(t,e){},e.prototype.writeOne=function(t,e,n){if("number"==typeof t)for(t=t.toString(16);t.length<2;)t="0"+t;if("number"==typeof e)for(e=e.toString(16);e.length<2;)e="0"+e;return 0==n?{cmd:"90 "+t+" "+e+" 64 "+r("90",t,e,"64")+" 97",resolve:function(t,e,r){return 12!=t.length?r(401):"30"!=t.substr(0,2)?r(402):"64"!=t.substr(6,8)?r(403):(ad1=t.substr(2,4),ad2=t.substr(4,6),data=parseInt(ad1,16)+" "+parseInt(ad2,16),e({state:data}))}}:1==n?{cmd:"90 "+t+" "+e+" 00 "+r("90",t,e,"00")+" 97",resolve:function(t,e,r){return 12!=t.length?r(401):"30"!=t.substr(0,2)?r(402):"00"!=t.substr(6,8)?r(403):(ad1=t.substr(2,4),ad2=t.substr(4,6),data=parseInt(ad1,16)+" "+parseInt(ad2,16),e({state:data}))}}:2==n?{cmd:"90 "+t+" "+e+" DD "+r("90",t,e,"DD")+" 97",resolve:function(t,e,r){return 12!=t.length?r(401):"30"!=t.substr(0,2)?r(402):"DD"!=t.substr(6,8)?r(403):(ad1=t.substr(2,4),ad2=t.substr(4,6),data=parseInt(ad1,16)+" "+parseInt(ad2,16),e({state:data}))}}:void 0},"object"==typeof cordova&&"function"==typeof cordova.define?cordova.define("guanzhuang-pro",function(t,r,n){n.exports=e}):"object"==typeof t&&"object"==typeof t.exports&&(t.exports=e)}()}]);