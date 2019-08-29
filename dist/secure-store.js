!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define("SecureStore",[],r):"object"==typeof exports?exports.SecureStore=r():t.SecureStore=r()}(window,function(){return function(t){var r={};function e(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{enumerable:!0,get:n})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,r){if(1&r&&(t=e(t)),8&r)return t;if(4&r&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&r&&"string"!=typeof t)for(var o in t)e.d(n,o,function(r){return t[r]}.bind(null,o));return n},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},e.p="",e(e.s=0)}([function(t,r,e){const n=e(1),o=e(2);t.exports={Store:class{constructor(t,r){if(!t||!r)throw new Error("Store name and passphrase required");this.store=new n.Store(t,t),this.passphrase=r}async init(){let t=await n.get("__key",this.store);t||(t=await o.genEncryptedMasterKey(this.passphrase),await n.set("__key",t,this.store)),this.encMasterKey=t;try{this.key=await o.decryptMasterKey(this.passphrase,this.encMasterKey)}catch(t){throw new Error(t.message)}}async updatePassphrase(t,r){try{const e=await o.updatePassphraseKey(t,r,this.encMasterKey);await n.set("__key",e,this.store),this.encMasterKey=e}catch(t){throw new Error(t.message)}}async set(t,r){return r=await o.encrypt(this.key,r),n.set(t,r,this.store)}async get(t){return new Promise(async(r,e)=>{let i;try{i=await n.get(t,this.store)}catch(t){e(t)}if(!i)return r(i);r(await o.decrypt(this.key,i))})}del(t){return n.del(t,this.store)}keys(){return n.keys(this.store)}clear(){return n.clear(this.store)}}}},function(t,r,e){"use strict";e.r(r),e.d(r,"Store",function(){return n}),e.d(r,"get",function(){return s}),e.d(r,"set",function(){return a}),e.d(r,"del",function(){return u}),e.d(r,"clear",function(){return f}),e.d(r,"keys",function(){return h});class n{constructor(t="keyval-store",r="keyval"){this.storeName=r,this._dbp=new Promise((e,n)=>{const o=indexedDB.open(t,1);o.onerror=()=>n(o.error),o.onsuccess=()=>e(o.result),o.onupgradeneeded=()=>{o.result.createObjectStore(r)}})}_withIDBStore(t,r){return this._dbp.then(e=>new Promise((n,o)=>{const i=e.transaction(this.storeName,t);i.oncomplete=()=>n(),i.onabort=i.onerror=()=>o(i.error),r(i.objectStore(this.storeName))}))}}let o;function i(){return o||(o=new n),o}function s(t,r=i()){let e;return r._withIDBStore("readonly",r=>{e=r.get(t)}).then(()=>e.result)}function a(t,r,e=i()){return e._withIDBStore("readwrite",e=>{e.put(r,t)})}function u(t,r=i()){return r._withIDBStore("readwrite",r=>{r.delete(t)})}function f(t=i()){return t._withIDBStore("readwrite",t=>{t.clear()})}function h(t=i()){const r=[];return t._withIDBStore("readonly",t=>{(t.openKeyCursor||t.openCursor).call(t).onsuccess=function(){this.result&&(r.push(this.result.key),this.result.continue())}}).then(()=>r)}},function(t,r,e){(function(r){const e=(t,e="raw",n="AES-GCM")=>{const o="raw"===e?r.from(t,"base64"):t;return window.crypto.subtle.importKey(e,o,{name:n},!0,["encrypt","decrypt"])},n=async(t,r="raw")=>{const e=await window.crypto.subtle.exportKey(r,t);return"raw"===r?new Uint8Array(e):e},o=async(t,r,e)=>{const n=await window.crypto.subtle.encrypt(e,t,r);return new Uint8Array(n)},i=async(t,r,e)=>{try{const n=await window.crypto.subtle.decrypt(e,t,r);return new Uint8Array(n)}catch(t){if("Unsupported state or unable to authenticate data"===t.message)throw new Error("Unable to decrypt data")}},s=t=>{if(!t.type||"secret"!==t.type)throw new Error("Invalid key type")},a=(t=16)=>{const e=window.crypto.getRandomValues(new Uint8Array(t));return r.from(e)},u=async(t,e,n="hex")=>{s(t);const i={iv:a("AES-GCM"===t.algorithm.name?12:16),plaintext:r.from(JSON.stringify(e))},u={name:t.algorithm.name,iv:i.iv},f=await o(t,i.plaintext,u);return{ciphertext:r.from(f).toString(n),iv:r.from(i.iv).toString(n)}},f=async(t,e,n="hex")=>{s(t);const o={ciphertext:Object.prototype.hasOwnProperty.call(e,"ciphertext")?r.from(e.ciphertext,n):"",iv:Object.prototype.hasOwnProperty.call(e,"iv")?r.from(e.iv,n):""},a={name:t.algorithm.name,iv:o.iv};try{const e=await i(t,o.ciphertext,a);return JSON.parse(r.from(e).toString())}catch(t){throw new Error("Unable to decrypt data")}},h=(t=16,r="hex")=>{return r&&(t=>{if("hex"!==t&&"base64"!==t)throw new Error("Invalid encoding")})(r),a(t).toString(r)},c=async(t,e,n,o)=>{n<1e4&&console.warn("Less than 10000 :(");const i=await window.crypto.subtle.importKey("raw","string"==typeof t?r.from(t):t,"PBKDF2",!1,["deriveBits","deriveKey"]),s=await window.crypto.subtle.deriveBits({name:"PBKDF2",salt:e||new Uint8Array([]),iterations:n||1e5,hash:o||"SHA-256"},i,128);return new Uint8Array(s)},p=async(t,n=a(16),o=1e5,i="SHA-256")=>{(t=>{if("string"!=typeof t||""===t)throw new Error("Not a valid value")})(t);const s=await c(t,n,o,i),u=await e(s);return{derivationParams:{salt:r.from(n).toString("hex"),iterations:o,hashAlgo:i},key:u}},l=async(t,n)=>{if(!n.encryptedMasterKey||!n.derivationParams)throw new Error("Missing properties from master key");const{derivationParams:o,encryptedMasterKey:i}=n,{salt:s,iterations:a,hashAlgo:u}=o,h="string"==typeof s?r.from(s,"hex"):s,p=await c(t,h,a,u),l=await e(p);try{const t=await f(l,i),e=r.from(t,"hex");return window.crypto.subtle.importKey("raw",e,{name:"AES-GCM"},!0,["encrypt","decrypt"])}catch(t){throw new Error("Wrong passphrase")}};t.exports={genAESKey:(t,r="AES-GCM",e=128)=>window.crypto.subtle.generateKey({name:r,length:e},t||!0,["decrypt","encrypt"]),importKey:e,exportKey:n,encrypt:u,decrypt:f,encryptBuffer:o,decryptBuffer:i,genEncryptedMasterKey:async(t,r,e,n)=>{const o=await p(t,r,e,n),i=await h(32,"hex"),s=await u(o.key,i);return{derivationParams:o.derivationParams,encryptedMasterKey:s}},decryptMasterKey:l,updatePassphraseKey:async(t,e,o,i,s,a)=>{const f=await l(t,o),h=await p(e,i,s,a),c=r.from(await n(f)).toString("hex"),y=await u(h.key,c);return{derivationParams:h.derivationParams,encryptedMasterKey:y}},_genRandomBuffer:a,_genRandomBufferAsStr:h}}).call(this,e(3).Buffer)},function(t,r,e){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
var n=e(5),o=e(6),i=e(7);function s(){return u.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function a(t,r){if(s()<r)throw new RangeError("Invalid typed array length");return u.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(r)).__proto__=u.prototype:(null===t&&(t=new u(r)),t.length=r),t}function u(t,r,e){if(!(u.TYPED_ARRAY_SUPPORT||this instanceof u))return new u(t,r,e);if("number"==typeof t){if("string"==typeof r)throw new Error("If encoding is specified then the first argument must be a string");return c(this,t)}return f(this,t,r,e)}function f(t,r,e,n){if("number"==typeof r)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&r instanceof ArrayBuffer?function(t,r,e,n){if(r.byteLength,e<0||r.byteLength<e)throw new RangeError("'offset' is out of bounds");if(r.byteLength<e+(n||0))throw new RangeError("'length' is out of bounds");r=void 0===e&&void 0===n?new Uint8Array(r):void 0===n?new Uint8Array(r,e):new Uint8Array(r,e,n);u.TYPED_ARRAY_SUPPORT?(t=r).__proto__=u.prototype:t=p(t,r);return t}(t,r,e,n):"string"==typeof r?function(t,r,e){"string"==typeof e&&""!==e||(e="utf8");if(!u.isEncoding(e))throw new TypeError('"encoding" must be a valid string encoding');var n=0|y(r,e),o=(t=a(t,n)).write(r,e);o!==n&&(t=t.slice(0,o));return t}(t,r,e):function(t,r){if(u.isBuffer(r)){var e=0|l(r.length);return 0===(t=a(t,e)).length?t:(r.copy(t,0,0,e),t)}if(r){if("undefined"!=typeof ArrayBuffer&&r.buffer instanceof ArrayBuffer||"length"in r)return"number"!=typeof r.length||(n=r.length)!=n?a(t,0):p(t,r);if("Buffer"===r.type&&i(r.data))return p(t,r.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,r)}function h(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function c(t,r){if(h(r),t=a(t,r<0?0:0|l(r)),!u.TYPED_ARRAY_SUPPORT)for(var e=0;e<r;++e)t[e]=0;return t}function p(t,r){var e=r.length<0?0:0|l(r.length);t=a(t,e);for(var n=0;n<e;n+=1)t[n]=255&r[n];return t}function l(t){if(t>=s())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+s().toString(16)+" bytes");return 0|t}function y(t,r){if(u.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var e=t.length;if(0===e)return 0;for(var n=!1;;)switch(r){case"ascii":case"latin1":case"binary":return e;case"utf8":case"utf-8":case void 0:return j(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*e;case"hex":return e>>>1;case"base64":return F(t).length;default:if(n)return j(t).length;r=(""+r).toLowerCase(),n=!0}}function g(t,r,e){var n=!1;if((void 0===r||r<0)&&(r=0),r>this.length)return"";if((void 0===e||e>this.length)&&(e=this.length),e<=0)return"";if((e>>>=0)<=(r>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return x(this,r,e);case"utf8":case"utf-8":return R(this,r,e);case"ascii":return T(this,r,e);case"latin1":case"binary":return U(this,r,e);case"base64":return S(this,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return M(this,r,e);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function w(t,r,e){var n=t[r];t[r]=t[e],t[e]=n}function d(t,r,e,n,o){if(0===t.length)return-1;if("string"==typeof e?(n=e,e=0):e>2147483647?e=2147483647:e<-2147483648&&(e=-2147483648),e=+e,isNaN(e)&&(e=o?0:t.length-1),e<0&&(e=t.length+e),e>=t.length){if(o)return-1;e=t.length-1}else if(e<0){if(!o)return-1;e=0}if("string"==typeof r&&(r=u.from(r,n)),u.isBuffer(r))return 0===r.length?-1:v(t,r,e,n,o);if("number"==typeof r)return r&=255,u.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(t,r,e):Uint8Array.prototype.lastIndexOf.call(t,r,e):v(t,[r],e,n,o);throw new TypeError("val must be string, number or Buffer")}function v(t,r,e,n,o){var i,s=1,a=t.length,u=r.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||r.length<2)return-1;s=2,a/=2,u/=2,e/=2}function f(t,r){return 1===s?t[r]:t.readUInt16BE(r*s)}if(o){var h=-1;for(i=e;i<a;i++)if(f(t,i)===f(r,-1===h?0:i-h)){if(-1===h&&(h=i),i-h+1===u)return h*s}else-1!==h&&(i-=i-h),h=-1}else for(e+u>a&&(e=a-u),i=e;i>=0;i--){for(var c=!0,p=0;p<u;p++)if(f(t,i+p)!==f(r,p)){c=!1;break}if(c)return i}return-1}function m(t,r,e,n){e=Number(e)||0;var o=t.length-e;n?(n=Number(n))>o&&(n=o):n=o;var i=r.length;if(i%2!=0)throw new TypeError("Invalid hex string");n>i/2&&(n=i/2);for(var s=0;s<n;++s){var a=parseInt(r.substr(2*s,2),16);if(isNaN(a))return s;t[e+s]=a}return s}function b(t,r,e,n){return z(j(r,t.length-e),t,e,n)}function A(t,r,e,n){return z(function(t){for(var r=[],e=0;e<t.length;++e)r.push(255&t.charCodeAt(e));return r}(r),t,e,n)}function E(t,r,e,n){return A(t,r,e,n)}function _(t,r,e,n){return z(F(r),t,e,n)}function P(t,r,e,n){return z(function(t,r){for(var e,n,o,i=[],s=0;s<t.length&&!((r-=2)<0);++s)e=t.charCodeAt(s),n=e>>8,o=e%256,i.push(o),i.push(n);return i}(r,t.length-e),t,e,n)}function S(t,r,e){return 0===r&&e===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(r,e))}function R(t,r,e){e=Math.min(t.length,e);for(var n=[],o=r;o<e;){var i,s,a,u,f=t[o],h=null,c=f>239?4:f>223?3:f>191?2:1;if(o+c<=e)switch(c){case 1:f<128&&(h=f);break;case 2:128==(192&(i=t[o+1]))&&(u=(31&f)<<6|63&i)>127&&(h=u);break;case 3:i=t[o+1],s=t[o+2],128==(192&i)&&128==(192&s)&&(u=(15&f)<<12|(63&i)<<6|63&s)>2047&&(u<55296||u>57343)&&(h=u);break;case 4:i=t[o+1],s=t[o+2],a=t[o+3],128==(192&i)&&128==(192&s)&&128==(192&a)&&(u=(15&f)<<18|(63&i)<<12|(63&s)<<6|63&a)>65535&&u<1114112&&(h=u)}null===h?(h=65533,c=1):h>65535&&(h-=65536,n.push(h>>>10&1023|55296),h=56320|1023&h),n.push(h),o+=c}return function(t){var r=t.length;if(r<=B)return String.fromCharCode.apply(String,t);var e="",n=0;for(;n<r;)e+=String.fromCharCode.apply(String,t.slice(n,n+=B));return e}(n)}r.Buffer=u,r.SlowBuffer=function(t){+t!=t&&(t=0);return u.alloc(+t)},r.INSPECT_MAX_BYTES=50,u.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),r.kMaxLength=s(),u.poolSize=8192,u._augment=function(t){return t.__proto__=u.prototype,t},u.from=function(t,r,e){return f(null,t,r,e)},u.TYPED_ARRAY_SUPPORT&&(u.prototype.__proto__=Uint8Array.prototype,u.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&u[Symbol.species]===u&&Object.defineProperty(u,Symbol.species,{value:null,configurable:!0})),u.alloc=function(t,r,e){return function(t,r,e,n){return h(r),r<=0?a(t,r):void 0!==e?"string"==typeof n?a(t,r).fill(e,n):a(t,r).fill(e):a(t,r)}(null,t,r,e)},u.allocUnsafe=function(t){return c(null,t)},u.allocUnsafeSlow=function(t){return c(null,t)},u.isBuffer=function(t){return!(null==t||!t._isBuffer)},u.compare=function(t,r){if(!u.isBuffer(t)||!u.isBuffer(r))throw new TypeError("Arguments must be Buffers");if(t===r)return 0;for(var e=t.length,n=r.length,o=0,i=Math.min(e,n);o<i;++o)if(t[o]!==r[o]){e=t[o],n=r[o];break}return e<n?-1:n<e?1:0},u.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},u.concat=function(t,r){if(!i(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return u.alloc(0);var e;if(void 0===r)for(r=0,e=0;e<t.length;++e)r+=t[e].length;var n=u.allocUnsafe(r),o=0;for(e=0;e<t.length;++e){var s=t[e];if(!u.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers');s.copy(n,o),o+=s.length}return n},u.byteLength=y,u.prototype._isBuffer=!0,u.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var r=0;r<t;r+=2)w(this,r,r+1);return this},u.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var r=0;r<t;r+=4)w(this,r,r+3),w(this,r+1,r+2);return this},u.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var r=0;r<t;r+=8)w(this,r,r+7),w(this,r+1,r+6),w(this,r+2,r+5),w(this,r+3,r+4);return this},u.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?R(this,0,t):g.apply(this,arguments)},u.prototype.equals=function(t){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===u.compare(this,t)},u.prototype.inspect=function(){var t="",e=r.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,e).match(/.{2}/g).join(" "),this.length>e&&(t+=" ... ")),"<Buffer "+t+">"},u.prototype.compare=function(t,r,e,n,o){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===r&&(r=0),void 0===e&&(e=t?t.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),r<0||e>t.length||n<0||o>this.length)throw new RangeError("out of range index");if(n>=o&&r>=e)return 0;if(n>=o)return-1;if(r>=e)return 1;if(this===t)return 0;for(var i=(o>>>=0)-(n>>>=0),s=(e>>>=0)-(r>>>=0),a=Math.min(i,s),f=this.slice(n,o),h=t.slice(r,e),c=0;c<a;++c)if(f[c]!==h[c]){i=f[c],s=h[c];break}return i<s?-1:s<i?1:0},u.prototype.includes=function(t,r,e){return-1!==this.indexOf(t,r,e)},u.prototype.indexOf=function(t,r,e){return d(this,t,r,e,!0)},u.prototype.lastIndexOf=function(t,r,e){return d(this,t,r,e,!1)},u.prototype.write=function(t,r,e,n){if(void 0===r)n="utf8",e=this.length,r=0;else if(void 0===e&&"string"==typeof r)n=r,e=this.length,r=0;else{if(!isFinite(r))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");r|=0,isFinite(e)?(e|=0,void 0===n&&(n="utf8")):(n=e,e=void 0)}var o=this.length-r;if((void 0===e||e>o)&&(e=o),t.length>0&&(e<0||r<0)||r>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return m(this,t,r,e);case"utf8":case"utf-8":return b(this,t,r,e);case"ascii":return A(this,t,r,e);case"latin1":case"binary":return E(this,t,r,e);case"base64":return _(this,t,r,e);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return P(this,t,r,e);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},u.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var B=4096;function T(t,r,e){var n="";e=Math.min(t.length,e);for(var o=r;o<e;++o)n+=String.fromCharCode(127&t[o]);return n}function U(t,r,e){var n="";e=Math.min(t.length,e);for(var o=r;o<e;++o)n+=String.fromCharCode(t[o]);return n}function x(t,r,e){var n=t.length;(!r||r<0)&&(r=0),(!e||e<0||e>n)&&(e=n);for(var o="",i=r;i<e;++i)o+=N(t[i]);return o}function M(t,r,e){for(var n=t.slice(r,e),o="",i=0;i<n.length;i+=2)o+=String.fromCharCode(n[i]+256*n[i+1]);return o}function I(t,r,e){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+r>e)throw new RangeError("Trying to access beyond buffer length")}function O(t,r,e,n,o,i){if(!u.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>o||r<i)throw new RangeError('"value" argument is out of bounds');if(e+n>t.length)throw new RangeError("Index out of range")}function Y(t,r,e,n){r<0&&(r=65535+r+1);for(var o=0,i=Math.min(t.length-e,2);o<i;++o)t[e+o]=(r&255<<8*(n?o:1-o))>>>8*(n?o:1-o)}function C(t,r,e,n){r<0&&(r=4294967295+r+1);for(var o=0,i=Math.min(t.length-e,4);o<i;++o)t[e+o]=r>>>8*(n?o:3-o)&255}function D(t,r,e,n,o,i){if(e+n>t.length)throw new RangeError("Index out of range");if(e<0)throw new RangeError("Index out of range")}function k(t,r,e,n,i){return i||D(t,0,e,4),o.write(t,r,e,n,23,4),e+4}function L(t,r,e,n,i){return i||D(t,0,e,8),o.write(t,r,e,n,52,8),e+8}u.prototype.slice=function(t,r){var e,n=this.length;if((t=~~t)<0?(t+=n)<0&&(t=0):t>n&&(t=n),(r=void 0===r?n:~~r)<0?(r+=n)<0&&(r=0):r>n&&(r=n),r<t&&(r=t),u.TYPED_ARRAY_SUPPORT)(e=this.subarray(t,r)).__proto__=u.prototype;else{var o=r-t;e=new u(o,void 0);for(var i=0;i<o;++i)e[i]=this[i+t]}return e},u.prototype.readUIntLE=function(t,r,e){t|=0,r|=0,e||I(t,r,this.length);for(var n=this[t],o=1,i=0;++i<r&&(o*=256);)n+=this[t+i]*o;return n},u.prototype.readUIntBE=function(t,r,e){t|=0,r|=0,e||I(t,r,this.length);for(var n=this[t+--r],o=1;r>0&&(o*=256);)n+=this[t+--r]*o;return n},u.prototype.readUInt8=function(t,r){return r||I(t,1,this.length),this[t]},u.prototype.readUInt16LE=function(t,r){return r||I(t,2,this.length),this[t]|this[t+1]<<8},u.prototype.readUInt16BE=function(t,r){return r||I(t,2,this.length),this[t]<<8|this[t+1]},u.prototype.readUInt32LE=function(t,r){return r||I(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},u.prototype.readUInt32BE=function(t,r){return r||I(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},u.prototype.readIntLE=function(t,r,e){t|=0,r|=0,e||I(t,r,this.length);for(var n=this[t],o=1,i=0;++i<r&&(o*=256);)n+=this[t+i]*o;return n>=(o*=128)&&(n-=Math.pow(2,8*r)),n},u.prototype.readIntBE=function(t,r,e){t|=0,r|=0,e||I(t,r,this.length);for(var n=r,o=1,i=this[t+--n];n>0&&(o*=256);)i+=this[t+--n]*o;return i>=(o*=128)&&(i-=Math.pow(2,8*r)),i},u.prototype.readInt8=function(t,r){return r||I(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},u.prototype.readInt16LE=function(t,r){r||I(t,2,this.length);var e=this[t]|this[t+1]<<8;return 32768&e?4294901760|e:e},u.prototype.readInt16BE=function(t,r){r||I(t,2,this.length);var e=this[t+1]|this[t]<<8;return 32768&e?4294901760|e:e},u.prototype.readInt32LE=function(t,r){return r||I(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},u.prototype.readInt32BE=function(t,r){return r||I(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},u.prototype.readFloatLE=function(t,r){return r||I(t,4,this.length),o.read(this,t,!0,23,4)},u.prototype.readFloatBE=function(t,r){return r||I(t,4,this.length),o.read(this,t,!1,23,4)},u.prototype.readDoubleLE=function(t,r){return r||I(t,8,this.length),o.read(this,t,!0,52,8)},u.prototype.readDoubleBE=function(t,r){return r||I(t,8,this.length),o.read(this,t,!1,52,8)},u.prototype.writeUIntLE=function(t,r,e,n){(t=+t,r|=0,e|=0,n)||O(this,t,r,e,Math.pow(2,8*e)-1,0);var o=1,i=0;for(this[r]=255&t;++i<e&&(o*=256);)this[r+i]=t/o&255;return r+e},u.prototype.writeUIntBE=function(t,r,e,n){(t=+t,r|=0,e|=0,n)||O(this,t,r,e,Math.pow(2,8*e)-1,0);var o=e-1,i=1;for(this[r+o]=255&t;--o>=0&&(i*=256);)this[r+o]=t/i&255;return r+e},u.prototype.writeUInt8=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,1,255,0),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[r]=255&t,r+1},u.prototype.writeUInt16LE=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):Y(this,t,r,!0),r+2},u.prototype.writeUInt16BE=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):Y(this,t,r,!1),r+2},u.prototype.writeUInt32LE=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[r+3]=t>>>24,this[r+2]=t>>>16,this[r+1]=t>>>8,this[r]=255&t):C(this,t,r,!0),r+4},u.prototype.writeUInt32BE=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):C(this,t,r,!1),r+4},u.prototype.writeIntLE=function(t,r,e,n){if(t=+t,r|=0,!n){var o=Math.pow(2,8*e-1);O(this,t,r,e,o-1,-o)}var i=0,s=1,a=0;for(this[r]=255&t;++i<e&&(s*=256);)t<0&&0===a&&0!==this[r+i-1]&&(a=1),this[r+i]=(t/s>>0)-a&255;return r+e},u.prototype.writeIntBE=function(t,r,e,n){if(t=+t,r|=0,!n){var o=Math.pow(2,8*e-1);O(this,t,r,e,o-1,-o)}var i=e-1,s=1,a=0;for(this[r+i]=255&t;--i>=0&&(s*=256);)t<0&&0===a&&0!==this[r+i+1]&&(a=1),this[r+i]=(t/s>>0)-a&255;return r+e},u.prototype.writeInt8=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,1,127,-128),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[r]=255&t,r+1},u.prototype.writeInt16LE=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8):Y(this,t,r,!0),r+2},u.prototype.writeInt16BE=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[r]=t>>>8,this[r+1]=255&t):Y(this,t,r,!1),r+2},u.prototype.writeInt32LE=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,4,2147483647,-2147483648),u.TYPED_ARRAY_SUPPORT?(this[r]=255&t,this[r+1]=t>>>8,this[r+2]=t>>>16,this[r+3]=t>>>24):C(this,t,r,!0),r+4},u.prototype.writeInt32BE=function(t,r,e){return t=+t,r|=0,e||O(this,t,r,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),u.TYPED_ARRAY_SUPPORT?(this[r]=t>>>24,this[r+1]=t>>>16,this[r+2]=t>>>8,this[r+3]=255&t):C(this,t,r,!1),r+4},u.prototype.writeFloatLE=function(t,r,e){return k(this,t,r,!0,e)},u.prototype.writeFloatBE=function(t,r,e){return k(this,t,r,!1,e)},u.prototype.writeDoubleLE=function(t,r,e){return L(this,t,r,!0,e)},u.prototype.writeDoubleBE=function(t,r,e){return L(this,t,r,!1,e)},u.prototype.copy=function(t,r,e,n){if(e||(e=0),n||0===n||(n=this.length),r>=t.length&&(r=t.length),r||(r=0),n>0&&n<e&&(n=e),n===e)return 0;if(0===t.length||0===this.length)return 0;if(r<0)throw new RangeError("targetStart out of bounds");if(e<0||e>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-r<n-e&&(n=t.length-r+e);var o,i=n-e;if(this===t&&e<r&&r<n)for(o=i-1;o>=0;--o)t[o+r]=this[o+e];else if(i<1e3||!u.TYPED_ARRAY_SUPPORT)for(o=0;o<i;++o)t[o+r]=this[o+e];else Uint8Array.prototype.set.call(t,this.subarray(e,e+i),r);return i},u.prototype.fill=function(t,r,e,n){if("string"==typeof t){if("string"==typeof r?(n=r,r=0,e=this.length):"string"==typeof e&&(n=e,e=this.length),1===t.length){var o=t.charCodeAt(0);o<256&&(t=o)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!u.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255);if(r<0||this.length<r||this.length<e)throw new RangeError("Out of range index");if(e<=r)return this;var i;if(r>>>=0,e=void 0===e?this.length:e>>>0,t||(t=0),"number"==typeof t)for(i=r;i<e;++i)this[i]=t;else{var s=u.isBuffer(t)?t:j(new u(t,n).toString()),a=s.length;for(i=0;i<e-r;++i)this[i+r]=s[i%a]}return this};var K=/[^+\/0-9A-Za-z-_]/g;function N(t){return t<16?"0"+t.toString(16):t.toString(16)}function j(t,r){var e;r=r||1/0;for(var n=t.length,o=null,i=[],s=0;s<n;++s){if((e=t.charCodeAt(s))>55295&&e<57344){if(!o){if(e>56319){(r-=3)>-1&&i.push(239,191,189);continue}if(s+1===n){(r-=3)>-1&&i.push(239,191,189);continue}o=e;continue}if(e<56320){(r-=3)>-1&&i.push(239,191,189),o=e;continue}e=65536+(o-55296<<10|e-56320)}else o&&(r-=3)>-1&&i.push(239,191,189);if(o=null,e<128){if((r-=1)<0)break;i.push(e)}else if(e<2048){if((r-=2)<0)break;i.push(e>>6|192,63&e|128)}else if(e<65536){if((r-=3)<0)break;i.push(e>>12|224,e>>6&63|128,63&e|128)}else{if(!(e<1114112))throw new Error("Invalid code point");if((r-=4)<0)break;i.push(e>>18|240,e>>12&63|128,e>>6&63|128,63&e|128)}}return i}function F(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(K,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function z(t,r,e,n){for(var o=0;o<n&&!(o+e>=r.length||o>=t.length);++o)r[o+e]=t[o];return o}}).call(this,e(4))},function(t,r){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(t){"object"==typeof window&&(e=window)}t.exports=e},function(t,r,e){"use strict";r.byteLength=function(t){var r=f(t),e=r[0],n=r[1];return 3*(e+n)/4-n},r.toByteArray=function(t){var r,e,n=f(t),s=n[0],a=n[1],u=new i(function(t,r,e){return 3*(r+e)/4-e}(0,s,a)),h=0,c=a>0?s-4:s;for(e=0;e<c;e+=4)r=o[t.charCodeAt(e)]<<18|o[t.charCodeAt(e+1)]<<12|o[t.charCodeAt(e+2)]<<6|o[t.charCodeAt(e+3)],u[h++]=r>>16&255,u[h++]=r>>8&255,u[h++]=255&r;2===a&&(r=o[t.charCodeAt(e)]<<2|o[t.charCodeAt(e+1)]>>4,u[h++]=255&r);1===a&&(r=o[t.charCodeAt(e)]<<10|o[t.charCodeAt(e+1)]<<4|o[t.charCodeAt(e+2)]>>2,u[h++]=r>>8&255,u[h++]=255&r);return u},r.fromByteArray=function(t){for(var r,e=t.length,o=e%3,i=[],s=0,a=e-o;s<a;s+=16383)i.push(h(t,s,s+16383>a?a:s+16383));1===o?(r=t[e-1],i.push(n[r>>2]+n[r<<4&63]+"==")):2===o&&(r=(t[e-2]<<8)+t[e-1],i.push(n[r>>10]+n[r>>4&63]+n[r<<2&63]+"="));return i.join("")};for(var n=[],o=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,u=s.length;a<u;++a)n[a]=s[a],o[s.charCodeAt(a)]=a;function f(t){var r=t.length;if(r%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var e=t.indexOf("=");return-1===e&&(e=r),[e,e===r?0:4-e%4]}function h(t,r,e){for(var o,i,s=[],a=r;a<e;a+=3)o=(t[a]<<16&16711680)+(t[a+1]<<8&65280)+(255&t[a+2]),s.push(n[(i=o)>>18&63]+n[i>>12&63]+n[i>>6&63]+n[63&i]);return s.join("")}o["-".charCodeAt(0)]=62,o["_".charCodeAt(0)]=63},function(t,r){r.read=function(t,r,e,n,o){var i,s,a=8*o-n-1,u=(1<<a)-1,f=u>>1,h=-7,c=e?o-1:0,p=e?-1:1,l=t[r+c];for(c+=p,i=l&(1<<-h)-1,l>>=-h,h+=a;h>0;i=256*i+t[r+c],c+=p,h-=8);for(s=i&(1<<-h)-1,i>>=-h,h+=n;h>0;s=256*s+t[r+c],c+=p,h-=8);if(0===i)i=1-f;else{if(i===u)return s?NaN:1/0*(l?-1:1);s+=Math.pow(2,n),i-=f}return(l?-1:1)*s*Math.pow(2,i-n)},r.write=function(t,r,e,n,o,i){var s,a,u,f=8*i-o-1,h=(1<<f)-1,c=h>>1,p=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,l=n?0:i-1,y=n?1:-1,g=r<0||0===r&&1/r<0?1:0;for(r=Math.abs(r),isNaN(r)||r===1/0?(a=isNaN(r)?1:0,s=h):(s=Math.floor(Math.log(r)/Math.LN2),r*(u=Math.pow(2,-s))<1&&(s--,u*=2),(r+=s+c>=1?p/u:p*Math.pow(2,1-c))*u>=2&&(s++,u/=2),s+c>=h?(a=0,s=h):s+c>=1?(a=(r*u-1)*Math.pow(2,o),s+=c):(a=r*Math.pow(2,c-1)*Math.pow(2,o),s=0));o>=8;t[e+l]=255&a,l+=y,a/=256,o-=8);for(s=s<<o|a,f+=o;f>0;t[e+l]=255&s,l+=y,s/=256,f-=8);t[e+l-y]|=128*g}},function(t,r){var e={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==e.call(t)}}])});
//# sourceMappingURL=secure-store.js.map