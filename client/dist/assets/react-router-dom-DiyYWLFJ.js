import{r as c,a as K}from"./react-D8ek_KWF.js";import"./react-dom-RQgP6e1v.js";import{R as D,N as A,u as z,a as G,b as B,c as E,D as M,d as X}from"./react-router-BPDGJUDi.js";import{c as q,s as L,b as k,i as V,d as O}from"./@remix-run-BSEpXHBb.js";/**
 * React Router DOM v6.27.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function S(){return S=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},S.apply(this,arguments)}function W(e,t){if(e==null)return{};var n={},a=Object.keys(e),o,i;for(i=0;i<a.length;i++)o=a[i],!(t.indexOf(o)>=0)&&(n[o]=e[o]);return n}function H(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function J(e,t){return e.button===0&&(!t||t==="_self")&&!H(e)}const Q=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],Y=["aria-current","caseSensitive","className","end","style","to","viewTransition","children"],Z="6";try{window.__reactRouterVersion=Z}catch{}const $=c.createContext({isTransitioning:!1}),ee="startTransition",_=K[ee];function fe(e){let{basename:t,children:n,future:a,window:o}=e,i=c.useRef();i.current==null&&(i.current=q({window:o,v5Compat:!0}));let s=i.current,[p,h]=c.useState({action:s.action,location:s.location}),{v7_startTransition:r}=a||{},d=c.useCallback(m=>{r&&_?_(()=>h(m)):h(m)},[h,r]);return c.useLayoutEffect(()=>s.listen(d),[s,d]),c.createElement(D,{basename:t,children:n,location:p.location,navigationType:p.action,navigator:s,future:a})}const te=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",ne=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,ae=c.forwardRef(function(t,n){let{onClick:a,relative:o,reloadDocument:i,replace:s,state:p,target:h,to:r,preventScrollReset:d,viewTransition:m}=t,w=W(t,Q),{basename:x}=c.useContext(A),v,g=!1;if(typeof r=="string"&&ne.test(r)&&(v=r,te))try{let f=new URL(window.location.href),l=r.startsWith("//")?new URL(f.protocol+r):new URL(r),y=L(l.pathname,x);l.origin===f.origin&&y!=null?r=y+l.search+l.hash:g=!0}catch{}let R=z(r,{relative:o}),C=re(r,{replace:s,state:p,target:h,preventScrollReset:d,relative:o,viewTransition:m});function u(f){a&&a(f),f.defaultPrevented||C(f)}return c.createElement("a",S({},w,{href:v||R,onClick:g||i?a:u,ref:n,target:h}))}),he=c.forwardRef(function(t,n){let{"aria-current":a="page",caseSensitive:o=!1,className:i="",end:s=!1,style:p,to:h,viewTransition:r,children:d}=t,m=W(t,Y),w=E(h,{relative:m.relative}),x=B(),v=c.useContext(M),{navigator:g,basename:R}=c.useContext(A),C=v!=null&&oe(w)&&r===!0,u=g.encodeLocation?g.encodeLocation(w).pathname:w.pathname,f=x.pathname,l=v&&v.navigation&&v.navigation.location?v.navigation.location.pathname:null;o||(f=f.toLowerCase(),l=l?l.toLowerCase():null,u=u.toLowerCase()),l&&R&&(l=L(l,R)||l);const y=u!=="/"&&u.endsWith("/")?u.length-1:u.length;let T=f===u||!s&&f.startsWith(u)&&f.charAt(y)==="/",N=l!=null&&(l===u||!s&&l.startsWith(u)&&l.charAt(u.length)==="/"),b={isActive:T,isPending:N,isTransitioning:C},j=T?a:void 0,P;typeof i=="function"?P=i(b):P=[i,T?"active":null,N?"pending":null,C?"transitioning":null].filter(Boolean).join(" ");let I=typeof p=="function"?p(b):p;return c.createElement(ae,S({},m,{"aria-current":j,className:P,ref:n,style:I,to:h,viewTransition:r}),typeof d=="function"?d(b):d)});var U;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(U||(U={}));var F;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(F||(F={}));function ie(e){let t=c.useContext(X);return t||V(!1),t}function re(e,t){let{target:n,replace:a,state:o,preventScrollReset:i,relative:s,viewTransition:p}=t===void 0?{}:t,h=G(),r=B(),d=E(e,{relative:s});return c.useCallback(m=>{if(J(m,n)){m.preventDefault();let w=a!==void 0?a:k(r)===k(d);h(e,{replace:w,state:o,preventScrollReset:i,relative:s,viewTransition:p})}},[r,h,d,a,o,n,e,i,s,p])}function oe(e,t){t===void 0&&(t={});let n=c.useContext($);n==null&&V(!1);let{basename:a}=ie(U.useViewTransitionState),o=E(e,{relative:t.relative});if(!n.isTransitioning)return!1;let i=L(n.currentLocation.pathname,a)||n.currentLocation.pathname,s=L(n.nextLocation.pathname,a)||n.nextLocation.pathname;return O(o.pathname,s)!=null||O(o.pathname,i)!=null}export{fe as B,ae as L,he as N};
//# sourceMappingURL=react-router-dom-DiyYWLFJ.js.map
