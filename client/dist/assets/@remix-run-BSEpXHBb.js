/**
 * @remix-run/router v1.20.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function x(){return x=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},x.apply(this,arguments)}var v;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(v||(v={}));const I="popstate";function oe(e){e===void 0&&(e={});function t(a,r){let{pathname:i,search:o,hash:s}=a.location;return B("",{pathname:i,search:o,hash:s},r.state&&r.state.usr||null,r.state&&r.state.key||"default")}function n(a,r){return typeof r=="string"?r:U(r)}return A(t,n,null,e)}function y(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function M(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function k(){return Math.random().toString(36).substr(2,8)}function O(e,t){return{usr:e.state,key:e.key,idx:t}}function B(e,t,n,a){return n===void 0&&(n=null),x({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?R(t):t,{state:n,key:t&&t.key||a||k()})}function U(e){let{pathname:t="/",search:n="",hash:a=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),a&&a!=="#"&&(t+=a.charAt(0)==="#"?a:"#"+a),t}function R(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let a=e.indexOf("?");a>=0&&(t.search=e.substr(a),e=e.substr(0,a)),e&&(t.pathname=e)}return t}function A(e,t,n,a){a===void 0&&(a={});let{window:r=document.defaultView,v5Compat:i=!1}=a,o=r.history,s=v.Pop,l=null,c=f();c==null&&(c=0,o.replaceState(x({},o.state,{idx:c}),""));function f(){return(o.state||{idx:null}).idx}function u(){s=v.Pop;let h=f(),d=h==null?null:h-c;c=h,l&&l({action:s,location:m.location,delta:d})}function p(h,d){s=v.Push;let g=B(m.location,h,d);c=f()+1;let E=O(g,c),P=m.createHref(g);try{o.pushState(E,"",P)}catch(W){if(W instanceof DOMException&&W.name==="DataCloneError")throw W;r.location.assign(P)}i&&l&&l({action:s,location:m.location,delta:1})}function $(h,d){s=v.Replace;let g=B(m.location,h,d);c=f();let E=O(g,c),P=m.createHref(g);o.replaceState(E,"",P),i&&l&&l({action:s,location:m.location,delta:0})}function w(h){let d=r.location.origin!=="null"?r.location.origin:r.location.href,g=typeof h=="string"?h:U(h);return g=g.replace(/ $/,"%20"),y(d,"No window.location.(origin|href) available to create URL for href: "+g),new URL(g,d)}let m={get action(){return s},get location(){return e(r,o)},listen(h){if(l)throw new Error("A history only accepts one active listener");return r.addEventListener(I,u),l=h,()=>{r.removeEventListener(I,u),l=null}},createHref(h){return t(r,h)},createURL:w,encodeLocation(h){let d=w(h);return{pathname:d.pathname,search:d.search,hash:d.hash}},push:p,replace:$,go(h){return o.go(h)}};return m}var j;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(j||(j={}));function ce(e,t,n){return n===void 0&&(n="/"),N(e,t,n,!1)}function N(e,t,n,a){let r=typeof t=="string"?R(t):t,i=ee(r.pathname||"/",n);if(i==null)return null;let o=H(e);z(o);let s=null;for(let l=0;s==null&&l<o.length;++l){let c=Z(i);s=X(o[l],c,a)}return s}function H(e,t,n,a){t===void 0&&(t=[]),n===void 0&&(n=[]),a===void 0&&(a="");let r=(i,o,s)=>{let l={relativePath:s===void 0?i.path||"":s,caseSensitive:i.caseSensitive===!0,childrenIndex:o,route:i};l.relativePath.startsWith("/")&&(y(l.relativePath.startsWith(a),'Absolute route path "'+l.relativePath+'" nested under path '+('"'+a+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),l.relativePath=l.relativePath.slice(a.length));let c=S([a,l.relativePath]),f=n.concat(l);i.children&&i.children.length>0&&(y(i.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+c+'".')),H(i.children,t,f,c)),!(i.path==null&&!i.index)&&t.push({path:c,score:K(c,i.index),routesMeta:f})};return e.forEach((i,o)=>{var s;if(i.path===""||!((s=i.path)!=null&&s.includes("?")))r(i,o);else for(let l of T(i.path))r(i,o,l)}),t}function T(e){let t=e.split("/");if(t.length===0)return[];let[n,...a]=t,r=n.endsWith("?"),i=n.replace(/\?$/,"");if(a.length===0)return r?[i,""]:[i];let o=T(a.join("/")),s=[];return s.push(...o.map(l=>l===""?i:[i,l].join("/"))),r&&s.push(...o),s.map(l=>e.startsWith("/")&&l===""?"/":l)}function z(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Q(t.routesMeta.map(a=>a.childrenIndex),n.routesMeta.map(a=>a.childrenIndex)))}const _=/^:[\w-]+$/,q=3,D=2,F=1,G=10,J=-2,b=e=>e==="*";function K(e,t){let n=e.split("/"),a=n.length;return n.some(b)&&(a+=J),t&&(a+=D),n.filter(r=>!b(r)).reduce((r,i)=>r+(_.test(i)?q:i===""?F:G),a)}function Q(e,t){return e.length===t.length&&e.slice(0,-1).every((a,r)=>a===t[r])?e[e.length-1]-t[t.length-1]:0}function X(e,t,n){let{routesMeta:a}=e,r={},i="/",o=[];for(let s=0;s<a.length;++s){let l=a[s],c=s===a.length-1,f=i==="/"?t:t.slice(i.length)||"/",u=C({path:l.relativePath,caseSensitive:l.caseSensitive,end:c},f),p=l.route;if(!u&&c&&n&&!a[a.length-1].route.index&&(u=C({path:l.relativePath,caseSensitive:l.caseSensitive,end:!1},f)),!u)return null;Object.assign(r,u.params),o.push({params:r,pathname:S([i,u.pathname]),pathnameBase:re(S([i,u.pathnameBase])),route:p}),u.pathnameBase!=="/"&&(i=S([i,u.pathnameBase]))}return o}function C(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,a]=Y(e.path,e.caseSensitive,e.end),r=t.match(n);if(!r)return null;let i=r[0],o=i.replace(/(.)\/+$/,"$1"),s=r.slice(1);return{params:a.reduce((c,f,u)=>{let{paramName:p,isOptional:$}=f;if(p==="*"){let m=s[u]||"";o=i.slice(0,i.length-m.length).replace(/(.)\/+$/,"$1")}const w=s[u];return $&&!w?c[p]=void 0:c[p]=(w||"").replace(/%2F/g,"/"),c},{}),pathname:i,pathnameBase:o,pattern:e}}function Y(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),M(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let a=[],r="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(o,s,l)=>(a.push({paramName:s,isOptional:l!=null}),l?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(a.push({paramName:"*"}),r+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?r+="\\/*$":e!==""&&e!=="/"&&(r+="(?:(?=\\/|$))"),[new RegExp(r,t?void 0:"i"),a]}function Z(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return M(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function ee(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,a=e.charAt(n);return a&&a!=="/"?null:e.slice(n)||"/"}function te(e,t){t===void 0&&(t="/");let{pathname:n,search:a="",hash:r=""}=typeof e=="string"?R(e):e;return{pathname:n?n.startsWith("/")?n:ne(n,t):t,search:ie(a),hash:le(r)}}function ne(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(r=>{r===".."?n.length>1&&n.pop():r!=="."&&n.push(r)}),n.length>1?n.join("/"):"/"}function L(e,t,n,a){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(a)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function ae(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function he(e,t){let n=ae(e);return t?n.map((a,r)=>r===n.length-1?a.pathname:a.pathnameBase):n.map(a=>a.pathnameBase)}function ue(e,t,n,a){a===void 0&&(a=!1);let r;typeof e=="string"?r=R(e):(r=x({},e),y(!r.pathname||!r.pathname.includes("?"),L("?","pathname","search",r)),y(!r.pathname||!r.pathname.includes("#"),L("#","pathname","hash",r)),y(!r.search||!r.search.includes("#"),L("#","search","hash",r)));let i=e===""||r.pathname==="",o=i?"/":r.pathname,s;if(o==null)s=n;else{let u=t.length-1;if(!a&&o.startsWith("..")){let p=o.split("/");for(;p[0]==="..";)p.shift(),u-=1;r.pathname=p.join("/")}s=u>=0?t[u]:"/"}let l=te(r,s),c=o&&o!=="/"&&o.endsWith("/"),f=(i||o===".")&&n.endsWith("/");return!l.pathname.endsWith("/")&&(c||f)&&(l.pathname+="/"),l}const S=e=>e.join("/").replace(/\/\/+/g,"/"),re=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),ie=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,le=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function fe(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const V=["post","put","patch","delete"];new Set(V);const se=["get",...V];new Set(se);export{v as A,fe as a,U as b,oe as c,C as d,he as g,y as i,S as j,ce as m,R as p,ue as r,ee as s};
//# sourceMappingURL=@remix-run-BSEpXHBb.js.map
