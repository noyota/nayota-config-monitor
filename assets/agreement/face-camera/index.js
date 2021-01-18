this["face-camera"]=function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e,r){"use strict";t.exports=function(t){return t&&t.__esModule?t:{default:t}}},function(t,e,r){"use strict";function n(e){"@babel/helpers - typeof";return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=n=function(t){return typeof t}:t.exports=n=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(e)}t.exports=n},function(t,e,r){"use strict";var n=r(0),o=n(r(3)),i=n(r(6)),u=n(r(7)),s=n(r(8)),c=n(r(9)),a=n(r(11)),f=n(r(12)),l=r(14).EventEmitter,p=r(15),h=r(16),v=function(t){function e(t,r){var n;return(0,u.default)(this,e),n=(0,c.default)(this,(0,a.default)(e).call(this)),r.route("/face-camera/records").post(h(function(){var t=(0,i.default)(o.default.mark(function t(e,r){var i,u;return o.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:i=e.body,u=i.mac,n.emit("node".concat(u),{0:JSON.stringify(i),1:i.faceId,2:i.role}),r.json({});case 4:case"end":return t.stop()}},t)}));return function(e,r){return t.apply(this,arguments)}}())),n}return(0,f.default)(e,t),(0,s.default)(e,[{key:"config",value:function(){var t=(0,i.default)(o.default.mark(function t(e){var r;return o.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.attribute.filter(function(t){return"url"===t.key})[0].value,t.next=3,new Promise(function(t,n){p.post({url:"".concat(e.url,"/linmu/server/url"),form:{url:r}},function(t,e,r){t&&n(t),JSON.parse(r).success?e():n("参数错误")})});case 3:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}()},{key:"write",value:function(t,e,r,n){}}]),e}(l);t.exports=v},function(t,e,r){"use strict";t.exports=r(4)},function(t,e,r){"use strict";(function(t){var e=r(0)(r(1)),n=function(t){var r,n=Object.prototype,o=n.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},u=i.iterator||"@@iterator",s=i.asyncIterator||"@@asyncIterator",c=i.toStringTag||"@@toStringTag";function a(t,e,r,n){var o=e&&e.prototype instanceof d?e:d,i=Object.create(o.prototype),u=new S(n||[]);return i._invoke=function(t,e,r){var n=l;return function(o,i){if(n===h)throw new Error("Generator is already running");if(n===v){if("throw"===o)throw i;return N()}for(r.method=o,r.arg=i;;){var u=r.delegate;if(u){var s=j(u,r);if(s){if(s===y)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===l)throw n=v,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=h;var c=f(t,e,r);if("normal"===c.type){if(n=r.done?v:p,c.arg===y)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n=v,r.method="throw",r.arg=c.arg)}}}(t,r,u),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=a;var l="suspendedStart",p="suspendedYield",h="executing",v="completed",y={};function d(){}function m(){}function g(){}var b={};b[u]=function(){return this};var w=Object.getPrototypeOf,x=w&&w(w(k([])));x&&x!==n&&o.call(x,u)&&(b=x);var L=g.prototype=d.prototype=Object.create(b);function _(t){["next","throw","return"].forEach(function(e){t[e]=function(t){return this._invoke(e,t)}})}function O(t){var r;this._invoke=function(n,i){function u(){return new Promise(function(r,u){!function r(n,i,u,s){var c=f(t[n],t,i);if("throw"!==c.type){var a=c.arg,l=a.value;return l&&"object"===(0,e.default)(l)&&o.call(l,"__await")?Promise.resolve(l.__await).then(function(t){r("next",t,u,s)},function(t){r("throw",t,u,s)}):Promise.resolve(l).then(function(t){a.value=t,u(a)},function(t){return r("throw",t,u,s)})}s(c.arg)}(n,i,r,u)})}return r=r?r.then(u,u):u()}}function j(t,e){var n=t.iterator[e.method];if(n===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=r,j(t,e),"throw"===e.method))return y;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return y}var o=f(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,y;var i=o.arg;return i?i.done?(e[t.resultName]=i.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,y):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,y)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function S(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function k(t){if(t){var e=t[u];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,i=function e(){for(;++n<t.length;)if(o.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=r,e.done=!0,e};return i.next=i}}return{next:N}}function N(){return{value:r,done:!0}}return m.prototype=L.constructor=g,g.constructor=m,g[c]=m.displayName="GeneratorFunction",t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===m||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,c in t||(t[c]="GeneratorFunction")),t.prototype=Object.create(L),t},t.awrap=function(t){return{__await:t}},_(O.prototype),O.prototype[s]=function(){return this},t.AsyncIterator=O,t.async=function(e,r,n,o){var i=new O(a(e,r,n,o));return t.isGeneratorFunction(r)?i:i.next().then(function(t){return t.done?t.value:i.next()})},_(L),L[c]="Generator",L[u]=function(){return this},L.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=k,S.prototype={constructor:S,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(P),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return s.type="throw",s.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var u=this.tryEntries[i],s=u.completion;if("root"===u.tryLoc)return n("end");if(u.tryLoc<=this.prev){var c=o.call(u,"catchLoc"),a=o.call(u,"finallyLoc");if(c&&a){if(this.prev<u.catchLoc)return n(u.catchLoc,!0);if(this.prev<u.finallyLoc)return n(u.finallyLoc)}else if(c){if(this.prev<u.catchLoc)return n(u.catchLoc,!0)}else{if(!a)throw new Error("try statement without catch or finally");if(this.prev<u.finallyLoc)return n(u.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var u=i?i.completion:{};return u.type=t,u.arg=e,i?(this.method="next",this.next=i.finallyLoc,y):this.complete(u)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),y},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),y}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:k(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),y}},t}("object"===(0,e.default)(t)?t.exports:{});try{regeneratorRuntime=n}catch(t){Function("r","regeneratorRuntime = r")(n)}}).call(this,r(5)(t))},function(t,e,r){"use strict";t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e,r){"use strict";function n(t,e,r,n,o,i,u){try{var s=t[i](u),c=s.value}catch(t){return void r(t)}s.done?e(c):Promise.resolve(c).then(n,o)}t.exports=function(t){return function(){var e=this,r=arguments;return new Promise(function(o,i){var u=t.apply(e,r);function s(t){n(u,o,i,s,c,"next",t)}function c(t){n(u,o,i,s,c,"throw",t)}s(void 0)})}}},function(t,e,r){"use strict";t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,r){"use strict";function n(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}t.exports=function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}},function(t,e,r){"use strict";var n=r(1),o=r(10);t.exports=function(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?o(t):e}},function(t,e,r){"use strict";t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},function(t,e,r){"use strict";function n(e){return t.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},n(e)}t.exports=n},function(t,e,r){"use strict";var n=r(13);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&n(t,e)}},function(t,e,r){"use strict";function n(e,r){return t.exports=n=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},n(e,r)}t.exports=n},function(t,e,r){"use strict";var n,o=r(0)(r(1)),i="object"===("undefined"==typeof Reflect?"undefined":(0,o.default)(Reflect))?Reflect:null,u=i&&"function"==typeof i.apply?i.apply:function(t,e,r){return Function.prototype.apply.call(t,e,r)};n=i&&"function"==typeof i.ownKeys?i.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var s=Number.isNaN||function(t){return t!=t};function c(){c.init.call(this)}t.exports=c,c.EventEmitter=c,c.prototype._events=void 0,c.prototype._eventsCount=0,c.prototype._maxListeners=void 0;var a=10;function f(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+(0,o.default)(t))}function l(t){return void 0===t._maxListeners?c.defaultMaxListeners:t._maxListeners}function p(t,e,r,n){var o,i,u;if(f(r),void 0===(i=t._events)?(i=t._events=Object.create(null),t._eventsCount=0):(void 0!==i.newListener&&(t.emit("newListener",e,r.listener?r.listener:r),i=t._events),u=i[e]),void 0===u)u=i[e]=r,++t._eventsCount;else if("function"==typeof u?u=i[e]=n?[r,u]:[u,r]:n?u.unshift(r):u.push(r),(o=l(t))>0&&u.length>o&&!u.warned){u.warned=!0;var s=new Error("Possible EventEmitter memory leak detected. "+u.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");s.name="MaxListenersExceededWarning",s.emitter=t,s.type=e,s.count=u.length,function(t){console&&console.warn&&console.warn(t)}(s)}return t}function h(t,e,r){var n={fired:!1,wrapFn:void 0,target:t,type:e,listener:r},o=function(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}.bind(n);return o.listener=r,n.wrapFn=o,o}function v(t,e,r){var n=t._events;if(void 0===n)return[];var o=n[e];return void 0===o?[]:"function"==typeof o?r?[o.listener||o]:[o]:r?function(t){for(var e=new Array(t.length),r=0;r<e.length;++r)e[r]=t[r].listener||t[r];return e}(o):d(o,o.length)}function y(t){var e=this._events;if(void 0!==e){var r=e[t];if("function"==typeof r)return 1;if(void 0!==r)return r.length}return 0}function d(t,e){for(var r=new Array(e),n=0;n<e;++n)r[n]=t[n];return r}Object.defineProperty(c,"defaultMaxListeners",{enumerable:!0,get:function(){return a},set:function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");a=t}}),c.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},c.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||s(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},c.prototype.getMaxListeners=function(){return l(this)},c.prototype.emit=function(t){for(var e=[],r=1;r<arguments.length;r++)e.push(arguments[r]);var n="error"===t,o=this._events;if(void 0!==o)n=n&&void 0===o.error;else if(!n)return!1;if(n){var i;if(e.length>0&&(i=e[0]),i instanceof Error)throw i;var s=new Error("Unhandled error."+(i?" ("+i.message+")":""));throw s.context=i,s}var c=o[t];if(void 0===c)return!1;if("function"==typeof c)u(c,this,e);else{var a=c.length,f=d(c,a);for(r=0;r<a;++r)u(f[r],this,e)}return!0},c.prototype.addListener=function(t,e){return p(this,t,e,!1)},c.prototype.on=c.prototype.addListener,c.prototype.prependListener=function(t,e){return p(this,t,e,!0)},c.prototype.once=function(t,e){return f(e),this.on(t,h(this,t,e)),this},c.prototype.prependOnceListener=function(t,e){return f(e),this.prependListener(t,h(this,t,e)),this},c.prototype.removeListener=function(t,e){var r,n,o,i,u;if(f(e),void 0===(n=this._events))return this;if(void 0===(r=n[t]))return this;if(r===e||r.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete n[t],n.removeListener&&this.emit("removeListener",t,r.listener||e));else if("function"!=typeof r){for(o=-1,i=r.length-1;i>=0;i--)if(r[i]===e||r[i].listener===e){u=r[i].listener,o=i;break}if(o<0)return this;0===o?r.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(r,o),1===r.length&&(n[t]=r[0]),void 0!==n.removeListener&&this.emit("removeListener",t,u||e)}return this},c.prototype.off=c.prototype.removeListener,c.prototype.removeAllListeners=function(t){var e,r,n;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[t]),this;if(0===arguments.length){var o,i=Object.keys(r);for(n=0;n<i.length;++n)"removeListener"!==(o=i[n])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=r[t]))this.removeListener(t,e);else if(void 0!==e)for(n=e.length-1;n>=0;n--)this.removeListener(t,e[n]);return this},c.prototype.listeners=function(t){return v(this,t,!0)},c.prototype.rawListeners=function(t){return v(this,t,!1)},c.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):y.call(t,e)},c.prototype.listenerCount=y,c.prototype.eventNames=function(){return this._eventsCount>0?n(this._events):[]}},function(t,e){!function(){t.exports=this.request}()},function(t,e,r){"use strict";t.exports=function(t){return function(){var e,r=t.apply(void 0,arguments),n=(e=arguments.length-1)<0||arguments.length<=e?void 0:arguments[e];return Promise.resolve(r).catch(n)}}}]);