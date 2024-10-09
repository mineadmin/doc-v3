import {
  ElTag
} from "./chunk-YQCMJL54.js";
import "./chunk-P3X5CLXH.js";
import {
  Fragment,
  computed,
  createBaseVNode,
  createElementBlock,
  createVNode,
  defineComponent,
  getCurrentInstance,
  getCurrentScope,
  h,
  init_vue_runtime_esm_bundler,
  inject,
  isRef,
  isVNode,
  markRaw,
  mergeProps,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onScopeDispose,
  openBlock,
  ref,
  resolveComponent,
  shallowRef,
  unref,
  vShow,
  watch,
  withDirectives
} from "./chunk-74HL2VAL.js";
import "./chunk-V4OQ3NZ2.js";

// node_modules/.pnpm/@mineadmin+pro-table@1.0.19_element-plus@2.8.3_vue@3.5.7_/node_modules/@mineadmin/pro-table/dist/index.es.js
init_vue_runtime_esm_bundler();
var En = Object.defineProperty;
var Dn = (t, e, n) => e in t ? En(t, e, { enumerable: true, configurable: true, writable: true, value: n }) : t[e] = n;
var De = (t, e, n) => Dn(t, typeof e != "symbol" ? e + "" : e, n);
var Lt = (t) => !!(t && t.constructor && t.call && t.apply);
function Te(t) {
  return typeof t == "function" ? t() : unref(t);
}
var Fn = typeof window < "u" && typeof document < "u";
function Bn(t, e = true, n) {
  getCurrentInstance() ? onMounted(t, n) : e ? t() : nextTick(t);
}
var Hn = Fn ? window.document : void 0;
function Ve(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(t, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function yt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ve(Object(n), true).forEach(function(o) {
      Xn(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ve(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function He(t) {
  return He = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, He(t);
}
function Xn(t, e, n) {
  return e in t ? Object.defineProperty(t, e, { value: n, enumerable: true, configurable: true, writable: true }) : t[e] = n, t;
}
function Dt() {
  return Dt = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
      var n = arguments[e];
      for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (t[o] = n[o]);
    }
    return t;
  }, Dt.apply(this, arguments);
}
function Yn(t, e) {
  if (t == null) return {};
  var n, o, r = function(i, s) {
    if (i == null) return {};
    var l, h2, p = {}, f = Object.keys(i);
    for (h2 = 0; h2 < f.length; h2++) l = f[h2], s.indexOf(l) >= 0 || (p[l] = i[l]);
    return p;
  }(t, e);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(t);
    for (o = 0; o < a.length; o++) n = a[o], e.indexOf(n) >= 0 || Object.prototype.propertyIsEnumerable.call(t, n) && (r[n] = t[n]);
  }
  return r;
}
function Tt(t) {
  if (typeof window < "u" && window.navigator) return !!navigator.userAgent.match(t);
}
var xt = Tt(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
var le = Tt(/Edge/i);
var Ge = Tt(/firefox/i);
var oe = Tt(/safari/i) && !Tt(/chrome/i) && !Tt(/android/i);
var hn = Tt(/iP(ad|od|hone)/i);
var pn = Tt(/chrome/i) && Tt(/android/i);
var fn = { capture: false, passive: false };
function k(t, e, n) {
  t.addEventListener(e, n, !xt && fn);
}
function M(t, e, n) {
  t.removeEventListener(e, n, !xt && fn);
}
function ge(t, e) {
  if (e) {
    if (e[0] === ">" && (e = e.substring(1)), t) try {
      if (t.matches) return t.matches(e);
      if (t.msMatchesSelector) return t.msMatchesSelector(e);
      if (t.webkitMatchesSelector) return t.webkitMatchesSelector(e);
    } catch {
      return false;
    }
    return false;
  }
}
function Ln(t) {
  return t.host && t !== document && t.host.nodeType ? t.host : t.parentNode;
}
function gt(t, e, n, o) {
  if (t) {
    n = n || document;
    do {
      if (e != null && (e[0] === ">" ? t.parentNode === n && ge(t, e) : ge(t, e)) || o && t === n) return t;
      if (t === n) break;
    } while (t = Ln(t));
  }
  return null;
}
var re;
var Ue = /\s+/g;
function ct(t, e, n) {
  if (t && e) if (t.classList) t.classList[n ? "add" : "remove"](e);
  else {
    var o = (" " + t.className + " ").replace(Ue, " ").replace(" " + e + " ", " ");
    t.className = (o + (n ? " " + e : "")).replace(Ue, " ");
  }
}
function S(t, e, n) {
  var o = t && t.style;
  if (o) {
    if (n === void 0) return document.defaultView && document.defaultView.getComputedStyle ? n = document.defaultView.getComputedStyle(t, "") : t.currentStyle && (n = t.currentStyle), e === void 0 ? n : n[e];
    e in o || e.indexOf("webkit") !== -1 || (e = "-webkit-" + e), o[e] = n + (typeof n == "string" ? "" : "px");
  }
}
function Wt(t, e) {
  var n = "";
  if (typeof t == "string") n = t;
  else do {
    var o = S(t, "transform");
    o && o !== "none" && (n = o + " " + n);
  } while (!e && (t = t.parentNode));
  var r = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
  return r && new r(n);
}
function Ke(t, e, n) {
  if (t) {
    var o = t.getElementsByTagName(e), r = 0, a = o.length;
    if (n) for (; r < a; r++) n(o[r], r);
    return o;
  }
  return [];
}
function St() {
  var t = document.scrollingElement;
  return t || document.documentElement;
}
function q(t, e, n, o, r) {
  if (t.getBoundingClientRect || t === window) {
    var a, i, s, l, h2, p, f;
    if (t !== window && t.parentNode && t !== St() ? (i = (a = t.getBoundingClientRect()).top, s = a.left, l = a.bottom, h2 = a.right, p = a.height, f = a.width) : (i = 0, s = 0, l = window.innerHeight, h2 = window.innerWidth, p = window.innerHeight, f = window.innerWidth), (e || n) && t !== window && (r = r || t.parentNode, !xt)) do
      if (r && r.getBoundingClientRect && (S(r, "transform") !== "none" || n && S(r, "position") !== "static")) {
        var P = r.getBoundingClientRect();
        i -= P.top + parseInt(S(r, "border-top-width")), s -= P.left + parseInt(S(r, "border-left-width")), l = i + a.height, h2 = s + a.width;
        break;
      }
    while (r = r.parentNode);
    if (o && t !== window) {
      var m = Wt(r || t), I = m && m.a, B = m && m.d;
      m && (l = (i /= B) + (p /= B), h2 = (s /= I) + (f /= I));
    }
    return { top: i, left: s, bottom: l, right: h2, width: f, height: p };
  }
}
function Je(t, e, n) {
  for (var o = At(t, true), r = q(t)[e]; o; ) {
    if (!(r >= q(o)[n])) return o;
    if (o === St()) break;
    o = At(o, false);
  }
  return false;
}
function Vt(t, e, n, o) {
  for (var r = 0, a = 0, i = t.children; a < i.length; ) {
    if (i[a].style.display !== "none" && i[a] !== y.ghost && (o || i[a] !== y.dragged) && gt(i[a], n.draggable, t, false)) {
      if (r === e) return i[a];
      r++;
    }
    a++;
  }
  return null;
}
function Xe(t, e) {
  for (var n = t.lastElementChild; n && (n === y.ghost || S(n, "display") === "none" || e && !ge(n, e)); ) n = n.previousElementSibling;
  return n || null;
}
function ht(t, e) {
  var n = 0;
  if (!t || !t.parentNode) return -1;
  for (; t = t.previousElementSibling; ) t.nodeName.toUpperCase() === "TEMPLATE" || t === y.clone || e && !ge(t, e) || n++;
  return n;
}
function Ze(t) {
  var e = 0, n = 0, o = St();
  if (t) do {
    var r = Wt(t), a = r.a, i = r.d;
    e += t.scrollLeft * a, n += t.scrollTop * i;
  } while (t !== o && (t = t.parentNode));
  return [e, n];
}
function At(t, e) {
  if (!t || !t.getBoundingClientRect) return St();
  var n = t, o = false;
  do
    if (n.clientWidth < n.scrollWidth || n.clientHeight < n.scrollHeight) {
      var r = S(n);
      if (n.clientWidth < n.scrollWidth && (r.overflowX == "auto" || r.overflowX == "scroll") || n.clientHeight < n.scrollHeight && (r.overflowY == "auto" || r.overflowY == "scroll")) {
        if (!n.getBoundingClientRect || n === document.body) return St();
        if (o || e) return n;
        o = true;
      }
    }
  while (n = n.parentNode);
  return St();
}
function Ce(t, e) {
  return Math.round(t.top) === Math.round(e.top) && Math.round(t.left) === Math.round(e.left) && Math.round(t.height) === Math.round(e.height) && Math.round(t.width) === Math.round(e.width);
}
function mn(t, e) {
  return function() {
    if (!re) {
      var n = arguments;
      n.length === 1 ? t.call(this, n[0]) : t.apply(this, n), re = setTimeout(function() {
        re = void 0;
      }, e);
    }
  };
}
function vn(t, e, n) {
  t.scrollLeft += e, t.scrollTop += n;
}
function Qe(t) {
  var e = window.Polymer, n = window.jQuery || window.Zepto;
  return e && e.dom ? e.dom(t).cloneNode(true) : n ? n(t).clone(true)[0] : t.cloneNode(true);
}
function tn(t, e, n) {
  var o = {};
  return Array.from(t.children).forEach(function(r) {
    var a, i, s, l;
    if (gt(r, e.draggable, t, false) && !r.animated && r !== n) {
      var h2 = q(r);
      o.left = Math.min((a = o.left) !== null && a !== void 0 ? a : 1 / 0, h2.left), o.top = Math.min((i = o.top) !== null && i !== void 0 ? i : 1 / 0, h2.top), o.right = Math.max((s = o.right) !== null && s !== void 0 ? s : -1 / 0, h2.right), o.bottom = Math.max((l = o.bottom) !== null && l !== void 0 ? l : -1 / 0, h2.bottom);
    }
  }), o.width = o.right - o.left, o.height = o.bottom - o.top, o.x = o.left, o.y = o.top, o;
}
var dt = "Sortable" + (/* @__PURE__ */ new Date()).getTime();
function jn() {
  var t, e = [];
  return { captureAnimationState: function() {
    e = [], this.options.animation && [].slice.call(this.el.children).forEach(function(n) {
      if (S(n, "display") !== "none" && n !== y.ghost) {
        e.push({ target: n, rect: q(n) });
        var o = yt({}, e[e.length - 1].rect);
        if (n.thisAnimationDuration) {
          var r = Wt(n, true);
          r && (o.top -= r.f, o.left -= r.e);
        }
        n.fromRect = o;
      }
    });
  }, addAnimationState: function(n) {
    e.push(n);
  }, removeAnimationState: function(n) {
    e.splice(function(o, r) {
      for (var a in o) if (o.hasOwnProperty(a)) {
        for (var i in r) if (r.hasOwnProperty(i) && r[i] === o[a][i]) return Number(a);
      }
      return -1;
    }(e, { target: n }), 1);
  }, animateAll: function(n) {
    var o = this;
    if (!this.options.animation) return clearTimeout(t), void (typeof n == "function" && n());
    var r = false, a = 0;
    e.forEach(function(i) {
      var s = 0, l = i.target, h2 = l.fromRect, p = q(l), f = l.prevFromRect, P = l.prevToRect, m = i.rect, I = Wt(l, true);
      I && (p.top -= I.f, p.left -= I.e), l.toRect = p, l.thisAnimationDuration && Ce(f, p) && !Ce(h2, p) && (m.top - p.top) / (m.left - p.left) == (h2.top - p.top) / (h2.left - p.left) && (s = function(B, N, G, J) {
        return Math.sqrt(Math.pow(N.top - B.top, 2) + Math.pow(N.left - B.left, 2)) / Math.sqrt(Math.pow(N.top - G.top, 2) + Math.pow(N.left - G.left, 2)) * J.animation;
      }(m, f, P, o.options)), Ce(p, h2) || (l.prevFromRect = h2, l.prevToRect = p, s || (s = o.options.animation), o.animate(l, m, p, s)), s && (r = true, a = Math.max(a, s), clearTimeout(l.animationResetTimer), l.animationResetTimer = setTimeout(function() {
        l.animationTime = 0, l.prevFromRect = null, l.fromRect = null, l.prevToRect = null, l.thisAnimationDuration = null;
      }, s), l.thisAnimationDuration = s);
    }), clearTimeout(t), r ? t = setTimeout(function() {
      typeof n == "function" && n();
    }, a) : typeof n == "function" && n(), e = [];
  }, animate: function(n, o, r, a) {
    if (a) {
      S(n, "transition", ""), S(n, "transform", "");
      var i = Wt(this.el), s = i && i.a, l = i && i.d, h2 = (o.left - r.left) / (s || 1), p = (o.top - r.top) / (l || 1);
      n.animatingX = !!h2, n.animatingY = !!p, S(n, "transform", "translate3d(" + h2 + "px," + p + "px,0)"), this.forRepaintDummy = function(f) {
        return f.offsetWidth;
      }(n), S(n, "transition", "transform " + a + "ms" + (this.options.easing ? " " + this.options.easing : "")), S(n, "transform", "translate3d(0,0,0)"), typeof n.animated == "number" && clearTimeout(n.animated), n.animated = setTimeout(function() {
        S(n, "transition", ""), S(n, "transform", ""), n.animated = false, n.animatingX = false, n.animatingY = false;
      }, a);
    }
  } };
}
var jt = [];
var xe = { initializeByDefault: true };
var ie = { mount: function(t) {
  for (var e in xe) xe.hasOwnProperty(e) && !(e in t) && (t[e] = xe[e]);
  jt.forEach(function(n) {
    if (n.pluginName === t.pluginName) throw "Sortable: Cannot mount plugin ".concat(t.pluginName, " more than once");
  }), jt.push(t);
}, pluginEvent: function(t, e, n) {
  var o = this;
  this.eventCanceled = false, n.cancel = function() {
    o.eventCanceled = true;
  };
  var r = t + "Global";
  jt.forEach(function(a) {
    e[a.pluginName] && (e[a.pluginName][r] && e[a.pluginName][r](yt({ sortable: e }, n)), e.options[a.pluginName] && e[a.pluginName][t] && e[a.pluginName][t](yt({ sortable: e }, n)));
  });
}, initializePlugins: function(t, e, n, o) {
  for (var r in jt.forEach(function(i) {
    var s = i.pluginName;
    if (t.options[s] || i.initializeByDefault) {
      var l = new i(t, e, t.options);
      l.sortable = t, l.options = t.options, t[s] = l, Dt(n, l.defaults);
    }
  }), t.options) if (t.options.hasOwnProperty(r)) {
    var a = this.modifyOption(t, r, t.options[r]);
    a !== void 0 && (t.options[r] = a);
  }
}, getEventProperties: function(t, e) {
  var n = {};
  return jt.forEach(function(o) {
    typeof o.eventProperties == "function" && Dt(n, o.eventProperties.call(e[o.pluginName], t));
  }), n;
}, modifyOption: function(t, e, n) {
  var o;
  return jt.forEach(function(r) {
    t[r.pluginName] && r.optionListeners && typeof r.optionListeners[e] == "function" && (o = r.optionListeners[e].call(t[r.pluginName], n));
  }), o;
} };
var zn = ["evt"];
var lt = function(t, e) {
  var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = n.evt, r = Yn(n, zn);
  ie.pluginEvent.bind(y)(t, e, yt({ dragEl: d, parentEl: L, ghostEl: D, rootEl: X, nextEl: Xt, lastDownEl: me, cloneEl: j, cloneHidden: Nt, dragStarted: Qt, putSortable: K, activeSortable: y.active, originalEvent: o, oldIndex: $t, oldDraggableIndex: ae, newIndex: ut, newDraggableIndex: Pt, hideGhostForTarget: yn, unhideGhostForTarget: Sn, cloneNowHidden: function() {
    Nt = true;
  }, cloneNowShown: function() {
    Nt = false;
  }, dispatchSortableEvent: function(a) {
    nt({ sortable: e, name: a, originalEvent: o });
  } }, r));
};
function nt(t) {
  (function(e) {
    var n = e.sortable, o = e.rootEl, r = e.name, a = e.targetEl, i = e.cloneEl, s = e.toEl, l = e.fromEl, h2 = e.oldIndex, p = e.newIndex, f = e.oldDraggableIndex, P = e.newDraggableIndex, m = e.originalEvent, I = e.putSortable, B = e.extraEventProperties;
    if (n = n || o && o[dt]) {
      var N, G = n.options, J = "on" + r.charAt(0).toUpperCase() + r.substr(1);
      !window.CustomEvent || xt || le ? (N = document.createEvent("Event")).initEvent(r, true, true) : N = new CustomEvent(r, { bubbles: true, cancelable: true }), N.to = s || o, N.from = l || o, N.item = a || o, N.clone = i, N.oldIndex = h2, N.newIndex = p, N.oldDraggableIndex = f, N.newDraggableIndex = P, N.originalEvent = m, N.pullMode = I ? I.lastPutMode : void 0;
      var tt = yt(yt({}, B), ie.getEventProperties(r, n));
      for (var ot in tt) N[ot] = tt[ot];
      o && o.dispatchEvent(N), G[J] && G[J].call(n, N);
    }
  })(yt({ putSortable: K, cloneEl: j, targetEl: d, rootEl: X, oldIndex: $t, oldDraggableIndex: ae, newIndex: ut, newDraggableIndex: Pt }, t));
}
var d;
var L;
var D;
var X;
var Xt;
var me;
var j;
var Nt;
var $t;
var ut;
var ae;
var Pt;
var se;
var K;
var Bt;
var mt;
var _e;
var Oe;
var en;
var nn;
var Qt;
var zt;
var Jt;
var ce;
var Q;
var qt = false;
var be = false;
var we = [];
var Zt = false;
var ue = false;
var Me = [];
var Ye = false;
var de = [];
var Se = typeof document < "u";
var he = hn;
var on = le || xt ? "cssFloat" : "float";
var qn = Se && !pn && !hn && "draggable" in document.createElement("div");
var gn = function() {
  if (Se) {
    if (xt) return false;
    var t = document.createElement("x");
    return t.style.cssText = "pointer-events:auto", t.style.pointerEvents === "auto";
  }
}();
var bn = function(t, e) {
  var n = S(t), o = parseInt(n.width) - parseInt(n.paddingLeft) - parseInt(n.paddingRight) - parseInt(n.borderLeftWidth) - parseInt(n.borderRightWidth), r = Vt(t, 0, e), a = Vt(t, 1, e), i = r && S(r), s = a && S(a), l = i && parseInt(i.marginLeft) + parseInt(i.marginRight) + q(r).width, h2 = s && parseInt(s.marginLeft) + parseInt(s.marginRight) + q(a).width;
  if (n.display === "flex") return n.flexDirection === "column" || n.flexDirection === "column-reverse" ? "vertical" : "horizontal";
  if (n.display === "grid") return n.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal";
  if (r && i.float && i.float !== "none") {
    var p = i.float === "left" ? "left" : "right";
    return !a || s.clear !== "both" && s.clear !== p ? "horizontal" : "vertical";
  }
  return r && (i.display === "block" || i.display === "flex" || i.display === "table" || i.display === "grid" || l >= o && n[on] === "none" || a && n[on] === "none" && l + h2 > o) ? "vertical" : "horizontal";
};
var wn = function(t) {
  function e(r, a) {
    return function(i, s, l, h2) {
      var p = i.options.group.name && s.options.group.name && i.options.group.name === s.options.group.name;
      if (r == null && (a || p)) return true;
      if (r == null || r === false) return false;
      if (a && r === "clone") return r;
      if (typeof r == "function") return e(r(i, s, l, h2), a)(i, s, l, h2);
      var f = (a ? i : s).options.group.name;
      return r === true || typeof r == "string" && r === f || r.join && r.indexOf(f) > -1;
    };
  }
  var n = {}, o = t.group;
  o && He(o) == "object" || (o = { name: o }), n.name = o.name, n.checkPull = e(o.pull, true), n.checkPut = e(o.put), n.revertClone = o.revertClone, t.group = n;
};
var yn = function() {
  !gn && D && S(D, "display", "none");
};
var Sn = function() {
  !gn && D && S(D, "display", "");
};
Se && !pn && document.addEventListener("click", function(t) {
  if (be) return t.preventDefault(), t.stopPropagation && t.stopPropagation(), t.stopImmediatePropagation && t.stopImmediatePropagation(), be = false, false;
}, true);
var Ht = function(t) {
  if (d) {
    t = t.touches ? t.touches[0] : t;
    var e = (r = t.clientX, a = t.clientY, we.some(function(s) {
      var l = s[dt].options.emptyInsertThreshold;
      if (l && !Xe(s)) {
        var h2 = q(s), p = r >= h2.left - l && r <= h2.right + l, f = a >= h2.top - l && a <= h2.bottom + l;
        return p && f ? i = s : void 0;
      }
    }), i);
    if (e) {
      var n = {};
      for (var o in t) t.hasOwnProperty(o) && (n[o] = t[o]);
      n.target = n.rootEl = e, n.preventDefault = void 0, n.stopPropagation = void 0, e[dt]._onDragOver(n);
    }
  }
  var r, a, i;
};
var $n = function(t) {
  d && d.parentNode[dt]._isOutsideThisEl(t.target);
};
function y(t, e) {
  if (!t || !t.nodeType || t.nodeType !== 1) throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(t));
  this.el = t, this.options = e = Dt({}, e), t[dt] = this;
  var n = { group: null, sort: true, disabled: false, store: null, handle: null, draggable: /^[uo]l$/i.test(t.nodeName) ? ">li" : ">*", swapThreshold: 1, invertSwap: false, invertedSwapThreshold: null, removeCloneOnHide: true, direction: function() {
    return bn(t, this.options);
  }, ghostClass: "sortable-ghost", chosenClass: "sortable-chosen", dragClass: "sortable-drag", ignore: "a, img", filter: null, preventOnFilter: true, animation: 0, easing: null, setData: function(a, i) {
    a.setData("Text", i.textContent);
  }, dropBubble: false, dragoverBubble: false, dataIdAttr: "data-id", delay: 0, delayOnTouchOnly: false, touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1, forceFallback: false, fallbackClass: "sortable-fallback", fallbackOnBody: false, fallbackTolerance: 0, fallbackOffset: { x: 0, y: 0 }, supportPointer: y.supportPointer !== false && "PointerEvent" in window && !oe, emptyInsertThreshold: 5 };
  for (var o in ie.initializePlugins(this, t, n), n) !(o in e) && (e[o] = n[o]);
  for (var r in wn(e), this) r.charAt(0) === "_" && typeof this[r] == "function" && (this[r] = this[r].bind(this));
  this.nativeDraggable = !e.forceFallback && qn, this.nativeDraggable && (this.options.touchStartThreshold = 1), e.supportPointer ? k(t, "pointerdown", this._onTapStart) : (k(t, "mousedown", this._onTapStart), k(t, "touchstart", this._onTapStart)), this.nativeDraggable && (k(t, "dragover", this), k(t, "dragenter", this)), we.push(this.el), e.store && e.store.get && this.sort(e.store.get(this) || []), Dt(this, jn());
}
function pe(t, e, n, o, r, a, i, s) {
  var l, h2, p = t[dt], f = p.options.onMove;
  return !window.CustomEvent || xt || le ? (l = document.createEvent("Event")).initEvent("move", true, true) : l = new CustomEvent("move", { bubbles: true, cancelable: true }), l.to = e, l.from = t, l.dragged = n, l.draggedRect = o, l.related = r || e, l.relatedRect = a || q(e), l.willInsertAfter = s, l.originalEvent = i, t.dispatchEvent(l), f && (h2 = f.call(p, l, i)), h2;
}
function Pe(t) {
  t.draggable = false;
}
function Wn() {
  Ye = false;
}
function Vn(t) {
  for (var e = t.tagName + t.className + t.src + t.href + t.textContent, n = e.length, o = 0; n--; ) o += e.charCodeAt(n);
  return o.toString(36);
}
function fe(t) {
  return setTimeout(t, 0);
}
function Ne(t) {
  return clearTimeout(t);
}
y.prototype = { constructor: y, _isOutsideThisEl: function(t) {
  this.el.contains(t) || t === this.el || (zt = null);
}, _getDirection: function(t, e) {
  return typeof this.options.direction == "function" ? this.options.direction.call(this, t, e, d) : this.options.direction;
}, _onTapStart: function(t) {
  if (t.cancelable) {
    var e = this, n = this.el, o = this.options, r = o.preventOnFilter, a = t.type, i = t.touches && t.touches[0] || t.pointerType && t.pointerType === "touch" && t, s = (i || t).target, l = t.target.shadowRoot && (t.path && t.path[0] || t.composedPath && t.composedPath()[0]) || s, h2 = o.filter;
    if (function(p) {
      de.length = 0;
      for (var f = p.getElementsByTagName("input"), P = f.length; P--; ) {
        var m = f[P];
        m.checked && de.push(m);
      }
    }(n), !d && !(/mousedown|pointerdown/.test(a) && t.button !== 0 || o.disabled) && !l.isContentEditable && (this.nativeDraggable || !oe || !s || s.tagName.toUpperCase() !== "SELECT") && !((s = gt(s, o.draggable, n, false)) && s.animated || me === s)) {
      if ($t = ht(s), ae = ht(s, o.draggable), typeof h2 == "function") {
        if (h2.call(this, t, s, this)) return nt({ sortable: e, rootEl: l, name: "filter", targetEl: s, toEl: n, fromEl: n }), lt("filter", e, { evt: t }), void (r && t.cancelable && t.preventDefault());
      } else if (h2 && (h2 = h2.split(",").some(function(p) {
        if (p = gt(l, p.trim(), n, false)) return nt({ sortable: e, rootEl: p, name: "filter", targetEl: s, fromEl: n, toEl: n }), lt("filter", e, { evt: t }), true;
      }))) return void (r && t.cancelable && t.preventDefault());
      o.handle && !gt(l, o.handle, n, false) || this._prepareDragStart(t, i, s);
    }
  }
}, _prepareDragStart: function(t, e, n) {
  var o, r = this, a = r.el, i = r.options, s = a.ownerDocument;
  if (n && !d && n.parentNode === a) {
    var l = q(n);
    if (X = a, L = (d = n).parentNode, Xt = d.nextSibling, me = n, se = i.group, y.dragged = d, Bt = { target: d, clientX: (e || t).clientX, clientY: (e || t).clientY }, en = Bt.clientX - l.left, nn = Bt.clientY - l.top, this._lastX = (e || t).clientX, this._lastY = (e || t).clientY, d.style["will-change"] = "all", o = function() {
      lt("delayEnded", r, { evt: t }), y.eventCanceled ? r._onDrop() : (r._disableDelayedDragEvents(), !Ge && r.nativeDraggable && (d.draggable = true), r._triggerDragStart(t, e), nt({ sortable: r, name: "choose", originalEvent: t }), ct(d, i.chosenClass, true));
    }, i.ignore.split(",").forEach(function(h2) {
      Ke(d, h2.trim(), Pe);
    }), k(s, "dragover", Ht), k(s, "mousemove", Ht), k(s, "touchmove", Ht), k(s, "mouseup", r._onDrop), k(s, "touchend", r._onDrop), k(s, "touchcancel", r._onDrop), Ge && this.nativeDraggable && (this.options.touchStartThreshold = 4, d.draggable = true), lt("delayStart", this, { evt: t }), !i.delay || i.delayOnTouchOnly && !e || this.nativeDraggable && (le || xt)) o();
    else {
      if (y.eventCanceled) return void this._onDrop();
      k(s, "mouseup", r._disableDelayedDrag), k(s, "touchend", r._disableDelayedDrag), k(s, "touchcancel", r._disableDelayedDrag), k(s, "mousemove", r._delayedDragTouchMoveHandler), k(s, "touchmove", r._delayedDragTouchMoveHandler), i.supportPointer && k(s, "pointermove", r._delayedDragTouchMoveHandler), r._dragStartTimer = setTimeout(o, i.delay);
    }
  }
}, _delayedDragTouchMoveHandler: function(t) {
  var e = t.touches ? t.touches[0] : t;
  Math.max(Math.abs(e.clientX - this._lastX), Math.abs(e.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag();
}, _disableDelayedDrag: function() {
  d && Pe(d), clearTimeout(this._dragStartTimer), this._disableDelayedDragEvents();
}, _disableDelayedDragEvents: function() {
  var t = this.el.ownerDocument;
  M(t, "mouseup", this._disableDelayedDrag), M(t, "touchend", this._disableDelayedDrag), M(t, "touchcancel", this._disableDelayedDrag), M(t, "mousemove", this._delayedDragTouchMoveHandler), M(t, "touchmove", this._delayedDragTouchMoveHandler), M(t, "pointermove", this._delayedDragTouchMoveHandler);
}, _triggerDragStart: function(t, e) {
  e = e || t.pointerType == "touch" && t, !this.nativeDraggable || e ? this.options.supportPointer ? k(document, "pointermove", this._onTouchMove) : k(document, e ? "touchmove" : "mousemove", this._onTouchMove) : (k(d, "dragend", this), k(X, "dragstart", this._onDragStart));
  try {
    document.selection ? fe(function() {
      document.selection.empty();
    }) : window.getSelection().removeAllRanges();
  } catch {
  }
}, _dragStarted: function(t, e) {
  if (qt = false, X && d) {
    lt("dragStarted", this, { evt: e }), this.nativeDraggable && k(document, "dragover", $n);
    var n = this.options;
    !t && ct(d, n.dragClass, false), ct(d, n.ghostClass, true), y.active = this, t && this._appendGhost(), nt({ sortable: this, name: "start", originalEvent: e });
  } else this._nulling();
}, _emulateDragOver: function() {
  if (mt) {
    this._lastX = mt.clientX, this._lastY = mt.clientY, yn();
    for (var t = document.elementFromPoint(mt.clientX, mt.clientY), e = t; t && t.shadowRoot && (t = t.shadowRoot.elementFromPoint(mt.clientX, mt.clientY)) !== e; ) e = t;
    if (d.parentNode[dt]._isOutsideThisEl(t), e) do {
      if (e[dt] && e[dt]._onDragOver({ clientX: mt.clientX, clientY: mt.clientY, target: t, rootEl: e }) && !this.options.dragoverBubble)
        break;
      t = e;
    } while (e = e.parentNode);
    Sn();
  }
}, _onTouchMove: function(t) {
  if (Bt) {
    var e = this.options, n = e.fallbackTolerance, o = e.fallbackOffset, r = t.touches ? t.touches[0] : t, a = D && Wt(D, true), i = D && a && a.a, s = D && a && a.d, l = he && Q && Ze(Q), h2 = (r.clientX - Bt.clientX + o.x) / (i || 1) + (l ? l[0] - Me[0] : 0) / (i || 1), p = (r.clientY - Bt.clientY + o.y) / (s || 1) + (l ? l[1] - Me[1] : 0) / (s || 1);
    if (!y.active && !qt) {
      if (n && Math.max(Math.abs(r.clientX - this._lastX), Math.abs(r.clientY - this._lastY)) < n) return;
      this._onDragStart(t, true);
    }
    if (D) {
      a ? (a.e += h2 - (_e || 0), a.f += p - (Oe || 0)) : a = { a: 1, b: 0, c: 0, d: 1, e: h2, f: p };
      var f = "matrix(".concat(a.a, ",").concat(a.b, ",").concat(a.c, ",").concat(a.d, ",").concat(a.e, ",").concat(a.f, ")");
      S(D, "webkitTransform", f), S(D, "mozTransform", f), S(D, "msTransform", f), S(D, "transform", f), _e = h2, Oe = p, mt = r;
    }
    t.cancelable && t.preventDefault();
  }
}, _appendGhost: function() {
  if (!D) {
    var t = this.options.fallbackOnBody ? document.body : X, e = q(d, true, he, true, t), n = this.options;
    if (he) {
      for (Q = t; S(Q, "position") === "static" && S(Q, "transform") === "none" && Q !== document; ) Q = Q.parentNode;
      Q !== document.body && Q !== document.documentElement ? (Q === document && (Q = St()), e.top += Q.scrollTop, e.left += Q.scrollLeft) : Q = St(), Me = Ze(Q);
    }
    ct(D = d.cloneNode(true), n.ghostClass, false), ct(D, n.fallbackClass, true), ct(D, n.dragClass, true), S(D, "transition", ""), S(D, "transform", ""), S(D, "box-sizing", "border-box"), S(D, "margin", 0), S(D, "top", e.top), S(D, "left", e.left), S(D, "width", e.width), S(D, "height", e.height), S(D, "opacity", "0.8"), S(D, "position", he ? "absolute" : "fixed"), S(D, "zIndex", "100000"), S(D, "pointerEvents", "none"), y.ghost = D, t.appendChild(D), S(D, "transform-origin", en / parseInt(D.style.width) * 100 + "% " + nn / parseInt(D.style.height) * 100 + "%");
  }
}, _onDragStart: function(t, e) {
  var n = this, o = t.dataTransfer, r = n.options;
  lt("dragStart", this, { evt: t }), y.eventCanceled ? this._onDrop() : (lt("setupClone", this), y.eventCanceled || ((j = Qe(d)).removeAttribute("id"), j.draggable = false, j.style["will-change"] = "", this._hideClone(), ct(j, this.options.chosenClass, false), y.clone = j), n.cloneId = fe(function() {
    lt("clone", n), y.eventCanceled || (n.options.removeCloneOnHide || X.insertBefore(j, d), n._hideClone(), nt({ sortable: n, name: "clone" }));
  }), !e && ct(d, r.dragClass, true), e ? (be = true, n._loopId = setInterval(n._emulateDragOver, 50)) : (M(document, "mouseup", n._onDrop), M(document, "touchend", n._onDrop), M(document, "touchcancel", n._onDrop), o && (o.effectAllowed = "move", r.setData && r.setData.call(n, o, d)), k(document, "drop", n), S(d, "transform", "translateZ(0)")), qt = true, n._dragStartId = fe(n._dragStarted.bind(n, e, t)), k(document, "selectstart", n), Qt = true, oe && S(document.body, "user-select", "none"));
}, _onDragOver: function(t) {
  var e, n, o, r, a = this.el, i = t.target, s = this.options, l = s.group, h2 = y.active, p = se === l, f = s.sort, P = K || h2, m = this, I = false;
  if (!Ye) {
    if (t.preventDefault !== void 0 && t.cancelable && t.preventDefault(), i = gt(i, s.draggable, a, true), st("dragOver"), y.eventCanceled) return I;
    if (d.contains(t.target) || i.animated && i.animatingX && i.animatingY || m._ignoreWhileAnimating === i) return et(false);
    if (be = false, h2 && !s.disabled && (p ? f || (o = L !== X) : K === this || (this.lastPutMode = se.checkPull(this, h2, d, t)) && l.checkPut(this, h2, d, t))) {
      if (r = this._getDirection(t, i) === "vertical", e = q(d), st("dragOverValid"), y.eventCanceled) return I;
      if (o) return L = X, ft(), this._hideClone(), st("revert"), y.eventCanceled || (Xt ? X.insertBefore(d, Xt) : X.appendChild(d)), et(true);
      var B = Xe(a, s.draggable);
      if (!B || function(x, U, R) {
        var Y = q(Xe(R.el, R.options.draggable)), at = tn(R.el, R.options, D), c = 10;
        return U ? x.clientX > at.right + c || x.clientY > Y.bottom && x.clientX > Y.left : x.clientY > at.bottom + c || x.clientX > Y.right && x.clientY > Y.top;
      }(t, r, this) && !B.animated) {
        if (B === d) return et(false);
        if (B && a === t.target && (i = B), i && (n = q(i)), pe(X, a, d, e, i, n, t, !!i) !== false) return ft(), B && B.nextSibling ? a.insertBefore(d, B.nextSibling) : a.appendChild(d), L = a, wt(), et(true);
      } else if (B && function(x, U, R) {
        var Y = q(Vt(R.el, 0, R.options, true)), at = tn(R.el, R.options, D), c = 10;
        return U ? x.clientX < at.left - c || x.clientY < Y.top && x.clientX < Y.right : x.clientY < at.top - c || x.clientY < Y.bottom && x.clientX < Y.left;
      }(t, r, this)) {
        var N = Vt(a, 0, s, true);
        if (N === d) return et(false);
        if (n = q(i = N), pe(X, a, d, e, i, n, t, false) !== false) return ft(), a.insertBefore(d, N), L = a, wt(), et(true);
      } else if (i.parentNode === a) {
        n = q(i);
        var G, J, tt, ot = d.parentNode !== a, rt = !function(x, U, R) {
          var Y = R ? x.left : x.top, at = R ? x.right : x.bottom, c = R ? x.width : x.height, u = R ? U.left : U.top, v = R ? U.right : U.bottom, T = R ? U.width : U.height;
          return Y === u || at === v || Y + c / 2 === u + T / 2;
        }(d.animated && d.toRect || e, i.animated && i.toRect || n, r), pt = r ? "top" : "left", $ = Je(i, "top", "top") || Je(d, "top", "top"), Z = $ ? $.scrollTop : void 0;
        if (zt !== i && (J = n[pt], Zt = false, ue = !rt && s.invertSwap || ot), G = function(x, U, R, Y, at, c, u, v) {
          var T = Y ? x.clientY : x.clientX, g = Y ? R.height : R.width, E = Y ? R.top : R.left, O = Y ? R.bottom : R.right, A = false;
          if (!u) {
            if (v && ce < g * at) {
              if (!Zt && (Jt === 1 ? T > E + g * c / 2 : T < O - g * c / 2) && (Zt = true), Zt) A = true;
              else if (Jt === 1 ? T < E + ce : T > O - ce) return -Jt;
            } else if (T > E + g * (1 - at) / 2 && T < O - g * (1 - at) / 2) return function(H) {
              return ht(d) < ht(H) ? 1 : -1;
            }(U);
          }
          return (A = A || u) && (T < E + g * c / 2 || T > O - g * c / 2) ? T > E + g / 2 ? 1 : -1 : 0;
        }(t, i, n, r, rt ? 1 : s.swapThreshold, s.invertedSwapThreshold == null ? s.swapThreshold : s.invertedSwapThreshold, ue, zt === i), G !== 0) {
          var W = ht(d);
          do
            W -= G, tt = L.children[W];
          while (tt && (S(tt, "display") === "none" || tt === D));
        }
        if (G === 0 || tt === i) return et(false);
        zt = i, Jt = G;
        var _t = i.nextElementSibling, Et = false, bt = pe(X, a, d, e, i, n, t, Et = G === 1);
        if (bt !== false) return bt !== 1 && bt !== -1 || (Et = bt === 1), Ye = true, setTimeout(Wn, 30), ft(), Et && !_t ? a.appendChild(d) : i.parentNode.insertBefore(d, Et ? _t : i), $ && vn($, 0, Z - $.scrollTop), L = d.parentNode, J === void 0 || ue || (ce = Math.abs(J - q(i)[pt])), wt(), et(true);
      }
      if (a.contains(d)) return et(false);
    }
    return false;
  }
  function st(x, U) {
    lt(x, m, yt({ evt: t, isOwner: p, axis: r ? "vertical" : "horizontal", revert: o, dragRect: e, targetRect: n, canSort: f, fromSortable: P, target: i, completed: et, onMove: function(R, Y) {
      return pe(X, a, d, e, R, q(R), t, Y);
    }, changed: wt }, U));
  }
  function ft() {
    st("dragOverAnimationCapture"), m.captureAnimationState(), m !== P && P.captureAnimationState();
  }
  function et(x) {
    return st("dragOverCompleted", { insertion: x }), x && (p ? h2._hideClone() : h2._showClone(m), m !== P && (ct(d, K ? K.options.ghostClass : h2.options.ghostClass, false), ct(d, s.ghostClass, true)), K !== m && m !== y.active ? K = m : m === y.active && K && (K = null), P === m && (m._ignoreWhileAnimating = i), m.animateAll(function() {
      st("dragOverAnimationComplete"), m._ignoreWhileAnimating = null;
    }), m !== P && (P.animateAll(), P._ignoreWhileAnimating = null)), (i === d && !d.animated || i === a && !i.animated) && (zt = null), s.dragoverBubble || t.rootEl || i === document || (d.parentNode[dt]._isOutsideThisEl(t.target), !x && Ht(t)), !s.dragoverBubble && t.stopPropagation && t.stopPropagation(), I = true;
  }
  function wt() {
    ut = ht(d), Pt = ht(d, s.draggable), nt({ sortable: m, name: "change", toEl: a, newIndex: ut, newDraggableIndex: Pt, originalEvent: t });
  }
}, _ignoreWhileAnimating: null, _offMoveEvents: function() {
  M(document, "mousemove", this._onTouchMove), M(document, "touchmove", this._onTouchMove), M(document, "pointermove", this._onTouchMove), M(document, "dragover", Ht), M(document, "mousemove", Ht), M(document, "touchmove", Ht);
}, _offUpEvents: function() {
  var t = this.el.ownerDocument;
  M(t, "mouseup", this._onDrop), M(t, "touchend", this._onDrop), M(t, "pointerup", this._onDrop), M(t, "touchcancel", this._onDrop), M(document, "selectstart", this);
}, _onDrop: function(t) {
  var e = this.el, n = this.options;
  ut = ht(d), Pt = ht(d, n.draggable), lt("drop", this, { evt: t }), L = d && d.parentNode, ut = ht(d), Pt = ht(d, n.draggable), y.eventCanceled || (qt = false, ue = false, Zt = false, clearInterval(this._loopId), clearTimeout(this._dragStartTimer), Ne(this.cloneId), Ne(this._dragStartId), this.nativeDraggable && (M(document, "drop", this), M(e, "dragstart", this._onDragStart)), this._offMoveEvents(), this._offUpEvents(), oe && S(document.body, "user-select", ""), S(d, "transform", ""), t && (Qt && (t.cancelable && t.preventDefault(), !n.dropBubble && t.stopPropagation()), D && D.parentNode && D.parentNode.removeChild(D), (X === L || K && K.lastPutMode !== "clone") && j && j.parentNode && j.parentNode.removeChild(j), d && (this.nativeDraggable && M(d, "dragend", this), Pe(d), d.style["will-change"] = "", Qt && !qt && ct(d, K ? K.options.ghostClass : this.options.ghostClass, false), ct(d, this.options.chosenClass, false), nt({ sortable: this, name: "unchoose", toEl: L, newIndex: null, newDraggableIndex: null, originalEvent: t }), X !== L ? (ut >= 0 && (nt({ rootEl: L, name: "add", toEl: L, fromEl: X, originalEvent: t }), nt({ sortable: this, name: "remove", toEl: L, originalEvent: t }), nt({ rootEl: L, name: "sort", toEl: L, fromEl: X, originalEvent: t }), nt({ sortable: this, name: "sort", toEl: L, originalEvent: t })), K && K.save()) : ut !== $t && ut >= 0 && (nt({ sortable: this, name: "update", toEl: L, originalEvent: t }), nt({ sortable: this, name: "sort", toEl: L, originalEvent: t })), y.active && (ut != null && ut !== -1 || (ut = $t, Pt = ae), nt({ sortable: this, name: "end", toEl: L, originalEvent: t }), this.save())))), this._nulling();
}, _nulling: function() {
  lt("nulling", this), X = d = L = D = Xt = j = me = Nt = Bt = mt = Qt = ut = Pt = $t = ae = zt = Jt = K = se = y.dragged = y.ghost = y.clone = y.active = null, de.forEach(function(t) {
    t.checked = true;
  }), de.length = _e = Oe = 0;
}, handleEvent: function(t) {
  switch (t.type) {
    case "drop":
    case "dragend":
      this._onDrop(t);
      break;
    case "dragenter":
    case "dragover":
      d && (this._onDragOver(t), function(e) {
        e.dataTransfer && (e.dataTransfer.dropEffect = "move"), e.cancelable && e.preventDefault();
      }(t));
      break;
    case "selectstart":
      t.preventDefault();
  }
}, toArray: function() {
  for (var t, e = [], n = this.el.children, o = 0, r = n.length, a = this.options; o < r; o++) gt(t = n[o], a.draggable, this.el, false) && e.push(t.getAttribute(a.dataIdAttr) || Vn(t));
  return e;
}, sort: function(t, e) {
  var n = {}, o = this.el;
  this.toArray().forEach(function(r, a) {
    var i = o.children[a];
    gt(i, this.options.draggable, o, false) && (n[r] = i);
  }, this), e && this.captureAnimationState(), t.forEach(function(r) {
    n[r] && (o.removeChild(n[r]), o.appendChild(n[r]));
  }), e && this.animateAll();
}, save: function() {
  var t = this.options.store;
  t && t.set && t.set(this);
}, closest: function(t, e) {
  return gt(t, e || this.options.draggable, this.el, false);
}, option: function(t, e) {
  var n = this.options;
  if (e === void 0) return n[t];
  var o = ie.modifyOption(this, t, e);
  n[t] = o !== void 0 ? o : e, t === "group" && wn(n);
}, destroy: function() {
  lt("destroy", this);
  var t = this.el;
  t[dt] = null, M(t, "mousedown", this._onTapStart), M(t, "touchstart", this._onTapStart), M(t, "pointerdown", this._onTapStart), this.nativeDraggable && (M(t, "dragover", this), M(t, "dragenter", this)), Array.prototype.forEach.call(t.querySelectorAll("[draggable]"), function(e) {
    e.removeAttribute("draggable");
  }), this._onDrop(), this._disableDelayedDragEvents(), we.splice(we.indexOf(this.el), 1), this.el = t = null;
}, _hideClone: function() {
  if (!Nt) {
    if (lt("hideClone", this), y.eventCanceled) return;
    S(j, "display", "none"), this.options.removeCloneOnHide && j.parentNode && j.parentNode.removeChild(j), Nt = true;
  }
}, _showClone: function(t) {
  if (t.lastPutMode === "clone") {
    if (Nt) {
      if (lt("showClone", this), y.eventCanceled) return;
      d.parentNode != X || this.options.group.revertClone ? Xt ? X.insertBefore(j, Xt) : X.appendChild(j) : X.insertBefore(j, d), this.options.group.revertClone && this.animate(d, j), S(j, "display", ""), Nt = false;
    }
  } else this._hideClone();
} }, Se && k(document, "touchmove", function(t) {
  (y.active || qt) && t.cancelable && t.preventDefault();
}), y.utils = { on: k, off: M, css: S, find: Ke, is: function(t, e) {
  return !!gt(t, e, t, false);
}, extend: function(t, e) {
  if (t && e) for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
  return t;
}, throttle: mn, closest: gt, toggleClass: ct, clone: Qe, index: ht, nextTick: fe, cancelNextTick: Ne, detectDirection: bn, getChild: Vt }, y.get = function(t) {
  return t[dt];
}, y.mount = function() {
  for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
  e[0].constructor === Array && (e = e[0]), e.forEach(function(o) {
    if (!o.prototype || !o.prototype.constructor) throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(o));
    o.utils && (y.utils = yt(yt({}, y.utils), o.utils)), ie.mount(o);
  });
}, y.create = function(t, e) {
  return new y(t, e);
}, y.version = "1.15.2";
var te;
var Le;
var Ae;
var Ie;
var ye;
var ee;
var z = [];
var je = false;
function ve() {
  z.forEach(function(t) {
    clearInterval(t.pid);
  }), z = [];
}
function rn() {
  clearInterval(ee);
}
var ke = mn(function(t, e, n, o) {
  if (e.scroll) {
    var r, a = (t.touches ? t.touches[0] : t).clientX, i = (t.touches ? t.touches[0] : t).clientY, s = e.scrollSensitivity, l = e.scrollSpeed, h2 = St(), p = false;
    Le !== n && (Le = n, ve(), te = e.scroll, r = e.scrollFn, te === true && (te = At(n, true)));
    var f = 0, P = te;
    do {
      var m = P, I = q(m), B = I.top, N = I.bottom, G = I.left, J = I.right, tt = I.width, ot = I.height, rt = void 0, pt = void 0, $ = m.scrollWidth, Z = m.scrollHeight, W = S(m), _t = m.scrollLeft, Et = m.scrollTop;
      m === h2 ? (rt = tt < $ && (W.overflowX === "auto" || W.overflowX === "scroll" || W.overflowX === "visible"), pt = ot < Z && (W.overflowY === "auto" || W.overflowY === "scroll" || W.overflowY === "visible")) : (rt = tt < $ && (W.overflowX === "auto" || W.overflowX === "scroll"), pt = ot < Z && (W.overflowY === "auto" || W.overflowY === "scroll"));
      var bt = rt && (Math.abs(J - a) <= s && _t + tt < $) - (Math.abs(G - a) <= s && !!_t), st = pt && (Math.abs(N - i) <= s && Et + ot < Z) - (Math.abs(B - i) <= s && !!Et);
      if (!z[f]) for (var ft = 0; ft <= f; ft++) z[ft] || (z[ft] = {});
      z[f].vx == bt && z[f].vy == st && z[f].el === m || (z[f].el = m, z[f].vx = bt, z[f].vy = st, clearInterval(z[f].pid), bt == 0 && st == 0 || (p = true, z[f].pid = setInterval((function() {
        o && this.layer === 0 && y.active._onTouchMove(ye);
        var et = z[this.layer].vy ? z[this.layer].vy * l : 0, wt = z[this.layer].vx ? z[this.layer].vx * l : 0;
        typeof r == "function" && r.call(y.dragged.parentNode[dt], wt, et, t, ye, z[this.layer].el) !== "continue" || vn(z[this.layer].el, wt, et);
      }).bind({ layer: f }), 24))), f++;
    } while (e.bubbleScroll && P !== h2 && (P = At(P, false)));
    je = p;
  }
}, 30);
var an = function(t) {
  var e = t.originalEvent, n = t.putSortable, o = t.dragEl, r = t.activeSortable, a = t.dispatchSortableEvent, i = t.hideGhostForTarget, s = t.unhideGhostForTarget;
  if (e) {
    var l = n || r;
    i();
    var h2 = e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e, p = document.elementFromPoint(h2.clientX, h2.clientY);
    s(), l && !l.el.contains(p) && (a("spill"), this.onSpill({ dragEl: o, putSortable: n }));
  }
};
function Re() {
}
function Fe() {
}
function Gn(t, e, n = {}) {
  let o;
  const { document: r = Hn, ...a } = n, i = { onUpdate: (p) => {
    (function(f, P, m) {
      const I = isRef(f), B = I ? [...Te(f)] : Te(f);
      if (m >= 0 && m < B.length) {
        const N = B.splice(P, 1)[0];
        nextTick(() => {
          B.splice(m, 0, N), I && (f.value = B);
        });
      }
    })(e, p.oldIndex, p.newIndex);
  } }, s = () => {
    const p = typeof t == "string" ? r == null ? void 0 : r.querySelector(t) : function(f) {
      var P;
      const m = Te(f);
      return (P = m == null ? void 0 : m.$el) != null ? P : m;
    }(t);
    p && o === void 0 && (o = new y(p, { ...i, ...a }));
  }, l = () => {
    o == null || o.destroy(), o = void 0;
  };
  var h2;
  return Bn(s), h2 = l, getCurrentScope() && onScopeDispose(h2), { stop: l, start: s, option: (p, f) => {
    if (f === void 0) return o == null ? void 0 : o.option(p);
    o == null || o.option(p, f);
  } };
}
Re.prototype = { startIndex: null, dragStart: function(t) {
  var e = t.oldDraggableIndex;
  this.startIndex = e;
}, onSpill: function(t) {
  var e = t.dragEl, n = t.putSortable;
  this.sortable.captureAnimationState(), n && n.captureAnimationState();
  var o = Vt(this.sortable.el, this.startIndex, this.options);
  o ? this.sortable.el.insertBefore(e, o) : this.sortable.el.appendChild(e), this.sortable.animateAll(), n && n.animateAll();
}, drop: an }, Dt(Re, { pluginName: "revertOnSpill" }), Fe.prototype = { onSpill: function(t) {
  var e = t.dragEl, n = t.putSortable || this.sortable;
  n.captureAnimationState(), e.parentNode && e.parentNode.removeChild(e), n.animateAll();
}, drop: an }, Dt(Fe, { pluginName: "removeOnSpill" }), y.mount(new function() {
  function t() {
    for (var e in this.defaults = { scroll: true, forceAutoScrollFallback: false, scrollSensitivity: 30, scrollSpeed: 10, bubbleScroll: true }, this) e.charAt(0) === "_" && typeof this[e] == "function" && (this[e] = this[e].bind(this));
  }
  return t.prototype = { dragStarted: function(e) {
    var n = e.originalEvent;
    this.sortable.nativeDraggable ? k(document, "dragover", this._handleAutoScroll) : this.options.supportPointer ? k(document, "pointermove", this._handleFallbackAutoScroll) : n.touches ? k(document, "touchmove", this._handleFallbackAutoScroll) : k(document, "mousemove", this._handleFallbackAutoScroll);
  }, dragOverCompleted: function(e) {
    var n = e.originalEvent;
    this.options.dragOverBubble || n.rootEl || this._handleAutoScroll(n);
  }, drop: function() {
    this.sortable.nativeDraggable ? M(document, "dragover", this._handleAutoScroll) : (M(document, "pointermove", this._handleFallbackAutoScroll), M(document, "touchmove", this._handleFallbackAutoScroll), M(document, "mousemove", this._handleFallbackAutoScroll)), rn(), ve(), clearTimeout(re), re = void 0;
  }, nulling: function() {
    ye = Le = te = je = ee = Ae = Ie = null, z.length = 0;
  }, _handleFallbackAutoScroll: function(e) {
    this._handleAutoScroll(e, true);
  }, _handleAutoScroll: function(e, n) {
    var o = this, r = (e.touches ? e.touches[0] : e).clientX, a = (e.touches ? e.touches[0] : e).clientY, i = document.elementFromPoint(r, a);
    if (ye = e, n || this.options.forceAutoScrollFallback || le || xt || oe) {
      ke(e, this.options, i, n);
      var s = At(i, true);
      !je || ee && r === Ae && a === Ie || (ee && rn(), ee = setInterval(function() {
        var l = At(document.elementFromPoint(r, a), true);
        l !== s && (s = l, ve()), ke(e, o.options, l, n);
      }, 10), Ae = r, Ie = a);
    } else {
      if (!this.options.bubbleScroll || At(i, true) === St()) return void ve();
      ke(e, this.options, At(i, false), false);
    }
  } }, Dt(t, { pluginName: "scroll", initializeByDefault: true });
}()), y.mount(Fe, Re);
var Un = class {
  constructor(e, n = {}) {
    De(this, "dom", null);
    De(this, "options", { noPrint: void 0 });
    if (this.options = this.extend({ noPrint: ".no-print" }, n), typeof e == "string") try {
      this.dom = document.querySelector(e);
    } catch {
      this.dom = document.createElement("div"), this.dom.innerHTML = e;
    }
    else this.isDOM(e), this.dom = this.isDOM(e) ? e : e.$el;
    this.init();
  }
  init() {
    this.writeIframe(this.getStyle() + this.getHtml());
  }
  extend(e, n) {
    for (let o in n) e[o] = n[o];
    return e;
  }
  getStyle() {
    var o;
    let e = "", n = document.querySelectorAll("style,link");
    for (let r = 0; r < n.length; r++) e += n[r].outerHTML;
    return e += "<style>" + (((o = this.options) == null ? void 0 : o.noPrint) ?? ".no-print") + "{ display: none; }</style>", e += "<style>html, body{ background-color: #fff; }</style>", e;
  }
  getHtml() {
    var r;
    const e = document.querySelectorAll("input"), n = document.querySelectorAll("textarea"), o = document.querySelectorAll("select");
    for (let a = 0; a < e.length; a++) e[a].type === "checkbox" || e[a].type === "radio" ? e[a].checked === true ? e[a].setAttribute("checked", "checked") : e[a].removeAttribute("checked") : (e[a].type, e[a].setAttribute("value", e[a].value));
    for (let a = 0; a < n.length; a++) n[a].type === "textarea" && (n[a].innerHTML = n[a].value);
    for (let a = 0; a < o.length; a++) if (o[a].type === "select-one") {
      let i = o[a].children;
      for (let s in i) i[s].tagName === "OPTION" && (((r = i[s]) == null ? void 0 : r.selected) === true ? i[s].setAttribute("selected", "selected") : i[s].removeAttribute("selected"));
    }
    return this.dom.outerHTML;
  }
  writeIframe(e) {
    let n, o, r = document.createElement("iframe"), a = document.body.appendChild(r);
    r.id = "myIframe", r.setAttribute("style", "position:absolute; width:0; height:0; top:-10px; left:-10px;"), n = a.contentWindow ?? a.contentDocument, o = a.contentDocument ?? a.contentWindow.document, o.open(), o.write(e), o.close();
    const i = this;
    r.onload = () => {
      i.toPrint(n), setTimeout(() => {
        document.body.removeChild(r);
      }, 100);
    };
  }
  toPrint(e) {
    try {
      setTimeout(() => {
        e.focus();
        try {
          e.document.execCommand("print", false, null) || e.print();
        } catch {
          e.print();
        }
        e.close();
      }, 10);
    } catch {
    }
  }
  isDOM(e) {
    return typeof HTMLElement == "object" ? e instanceof HTMLElement : e && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
  }
};
function Kn() {
  var n;
  const t = inject("MaProTableOptions"), { renderPlugins: e = [] } = (n = t.value) == null ? void 0 : n.provider;
  return { getPluginByName: (o) => e.find((r) => r.name === o), getPlugins: () => e, addPlugin: (o) => {
    e.find((r) => r.name === o.name) || e.push(o);
  }, removePlugin: (o) => {
    const r = e.findIndex((a) => a.name === o);
    r !== -1 && e.splice(r, 1);
  } };
}
var Rt = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [o, r] of e) n[o] = r;
  return n;
};
var Jn = { name: "IcBaselineDragIndicator" };
var Zn = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var Qn = [createBaseVNode("path", { fill: "currentColor", d: "M11 18c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2m-2-8c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0-6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m6 4c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2" }, null, -1)];
var to = Rt(Jn, [["render", function(t, e, n, o, r, a) {
  return openBlock(), createElementBlock("svg", Zn, Qn);
}]]);
var eo = { name: "RiMoreLine" };
var no = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var oo = [createBaseVNode("path", { fill: "currentColor", d: "M4.5 10.5c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S6 12.825 6 12s-.675-1.5-1.5-1.5m15 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5S21 12.825 21 12s-.675-1.5-1.5-1.5m-7.5 0c-.825 0-1.5.675-1.5 1.5s.675 1.5 1.5 1.5s1.5-.675 1.5-1.5s-.675-1.5-1.5-1.5" }, null, -1)];
var ro = Rt(eo, [["render", function(t, e, n, o, r, a) {
  return openBlock(), createElementBlock("svg", no, oo);
}]]);
var ao = { name: "IcOutlineRefresh" };
var io = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var lo = [createBaseVNode("path", { fill: "currentColor", d: "M17.65 6.35A7.96 7.96 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z" }, null, -1)];
var so = Rt(ao, [["render", function(t, e, n, o, r, a) {
  return openBlock(), createElementBlock("svg", io, lo);
}]]);
var co = { name: "IcOutlineSettings" };
var uo = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var ho = [createBaseVNode("path", { fill: "currentColor", d: "M19.43 12.98c.04-.32.07-.64.07-.98c0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.566.566 0 0 0-.18-.03c-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98c0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03c.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64zm-1.98-1.71c.04.31.05.52.05.73c0 .21-.02.43-.05.73l-.14 1.13l.89.7l1.08.84l-.7 1.21l-1.27-.51l-1.04-.42l-.9.68c-.43.32-.84.56-1.25.73l-1.06.43l-.16 1.13l-.2 1.35h-1.4l-.19-1.35l-.16-1.13l-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7l-1.06.43l-1.27.51l-.7-1.21l1.08-.84l.89-.7l-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13l-.89-.7l-1.08-.84l.7-1.21l1.27.51l1.04.42l.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43l.16-1.13l.2-1.35h1.39l.19 1.35l.16 1.13l1.06.43c.43.18.83.41 1.23.71l.91.7l1.06-.43l1.27-.51l.7 1.21l-1.07.85l-.89.7zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4m0 6c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2" }, null, -1)];
var po = Rt(co, [["render", function(t, e, n, o, r, a) {
  return openBlock(), createElementBlock("svg", uo, ho);
}]]);
var fo = { name: "IcOutlinePrint" };
var mo = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var vo = [createBaseVNode("path", { fill: "currentColor", d: "M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3M8 5h8v3H8zm8 12v2H8v-4h8zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4z" }, null, -1), createBaseVNode("circle", { cx: "18", cy: "11.5", r: "1", fill: "currentColor" }, null, -1)];
var go = Rt(fo, [["render", function(t, e, n, o, r, a) {
  return openBlock(), createElementBlock("svg", mo, vo);
}]]);
var bo = { name: "IcRoundSearch" };
var wo = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var yo = [createBaseVNode("path", { fill: "currentColor", d: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0c.41-.41.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" }, null, -1)];
var So = Rt(bo, [["render", function(t, e, n, o, r, a) {
  return openBlock(), createElementBlock("svg", wo, yo);
}]]);
var Eo = { name: "IcRoundFirstPage" };
var Do = { xmlns: "http://www.w3.org/2000/svg", width: "1.5em", height: "1.5em", viewBox: "0 0 24 24" };
var To = [createBaseVNode("path", { fill: "currentColor", d: "M17.7 15.89L13.82 12l3.89-3.89A.996.996 0 1 0 16.3 6.7l-4.59 4.59a.996.996 0 0 0 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0a.993.993 0 0 0-.01-1.4M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1" }, null, -1)];
var Co = Rt(Eo, [["render", function(t, e, n, o, r, a) {
  return openBlock(), createElementBlock("svg", Do, To);
}]]);
var xo = { name: "IcRoundLastPage" };
var _o = { xmlns: "http://www.w3.org/2000/svg", width: "1.5em", height: "1.5em", viewBox: "0 0 24 24" };
var Oo = [createBaseVNode("path", { fill: "currentColor", d: "M6.29 8.11L10.18 12l-3.89 3.89A.996.996 0 1 0 7.7 17.3l4.59-4.59a.996.996 0 0 0 0-1.41L7.7 6.7a.996.996 0 0 0-1.41 0c-.38.39-.38 1.03 0 1.41M17 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1" }, null, -1)];
var Mo = Rt(xo, [["render", function(t, e, n, o, r, a) {
  return openBlock(), createElementBlock("svg", _o, Oo);
}]]);
function Be(t) {
  return typeof t == "function" || Object.prototype.toString.call(t) === "[object Object]" && !isVNode(t);
}
var ln = defineComponent({ name: "MaProTable", props: { options: { type: Object, default: () => ({ tableOptions: {}, searchOptions: {}, searchFormOptions: {} }) }, schema: { type: Object, default: () => ({ searchItems: [], tableColumns: [] }) } }, emits: ["row-drag-sort", "search-submit", "search-reset"], setup(t, { slots: e, emit: n, expose: o }) {
  var U, R, Y, at;
  const r = inject("MaProTableOptions"), a = ref(false), i = `_${Math.floor(1e5 * Math.random() + 2e4 * Math.random() + 5e3 * Math.random())}`, s = getCurrentInstance(), l = ref(t.options), h2 = ref(t.schema), p = shallowRef(((U = h2.value) == null ? void 0 : U.tableColumns) ?? []), f = ref(((R = l.value) == null ? void 0 : R.requestOptions) ?? {}), P = ref(true), m = ref(((at = (Y = l.value) == null ? void 0 : Y.requestOptions) == null ? void 0 : at.requestParams) ?? {}), I = shallowRef([]), B = ref(), N = computed(() => {
    var c;
    return ((c = f.value) == null ? void 0 : c.autoRequest) ?? true;
  }), G = async () => {
    var T, g;
    const { pageName: c = "page", sizeName: u = "page_size", size: v = 10 } = ((g = (T = l.value) == null ? void 0 : T.requestOptions) == null ? void 0 : g.requestPage) ?? {};
    m.value[c] = 1, m.value[u] = v, B.value = { pageName: c, sizeName: u, size: v }, await nextTick(() => {
      var E, O;
      return pt(((O = (E = $()) == null ? void 0 : E.getSearchForm) == null ? void 0 : O.call(E)) ?? {});
    }), N.value && Z().setPagination({ total: 0, onChange: async (E, O) => {
      m.value[c] = E, m.value[u] = O, await rt();
    } });
  }, J = ref([]), { actionBtnPosition: tt = "auto" } = l.value, ot = computed(() => (() => {
    var v, T;
    const { header: c, toolbar: u } = l.value;
    return { headerShowFun: typeof (c == null ? void 0 : c.show) == "function" ? c.show : () => (c == null ? void 0 : c.show) !== false, toolbarShowFun: typeof (u == null ? void 0 : u.show) == "function" ? u.show : () => (u == null ? void 0 : u.show) !== false, toolRefreshShowFun: typeof (u == null ? void 0 : u.refresh) == "function" ? u.refresh : () => (u == null ? void 0 : u.refresh) !== false, toolSearchShowFun: typeof (u == null ? void 0 : u.search) == "function" ? u.search : () => (u == null ? void 0 : u.search) !== false, toolPrintShowFun: typeof (u == null ? void 0 : u.print) == "function" ? u.print : () => (u == null ? void 0 : u.print) !== false, toolSettingShowFun: typeof (u == null ? void 0 : u.setting) == "function" ? u.setting : () => (u == null ? void 0 : u.setting) !== false, searchIsShow: ((T = (v = $()) == null ? void 0 : v.getShowState) == null ? void 0 : T.call(v)) ?? true };
  })()), rt = async () => {
    var c, u, v, T, g, E, O;
    if ((c = f.value) != null && c.api) if (N.value) {
      const { response: A, data: H, total: b } = await (async () => new Promise((C, F) => {
        var _;
        Z().setLoadingState(true), (_ = f.value) == null || _.api(m.value).then((it) => {
          var Mt, Gt, Ut, Kt;
          const Ot = it.data[((Gt = (Mt = f.value) == null ? void 0 : Mt.response) == null ? void 0 : Gt.dataKey) ?? "list"] ?? [], Ee = it.data[((Kt = (Ut = f.value) == null ? void 0 : Ut.response) == null ? void 0 : Kt.totalKey) ?? "total"] ?? 0;
          Z().setLoadingState(false), C({ response: it.data, data: Ot, total: Ee });
        }).catch(() => {
          Z().setLoadingState(false), F({ response: null, data: [], total: 0 });
        });
      }))();
      Z().setData(((v = (u = f.value) == null ? void 0 : u.responseDataHandler) == null ? void 0 : v.call(u, A)) ?? H), b > 0 && Z().setPagination(Object.assign(((g = (T = l.value) == null ? void 0 : T.tableOptions) == null ? void 0 : g.pagination) ?? {}, { total: b })), I.value = H;
    } else I.value = [];
    else {
      const A = ((O = (E = l.value) == null ? void 0 : E.tableOptions) == null ? void 0 : O.data) ?? [];
      Z().setData(A), I.value = A;
    }
  }, pt = async (c, u = false) => {
    m.value = Object.assign(m.value, c), u && await rt();
  }, $ = () => {
    var c;
    return (c = s == null ? void 0 : s.proxy) == null ? void 0 : c.$refs[`MaSearchRef${i}`];
  }, Z = () => {
    var c;
    return (c = s == null ? void 0 : s.proxy) == null ? void 0 : c.$refs[`MaTableRef${i}`];
  }, W = async () => {
    var O, A, H, b, C, F, _;
    await nextTick();
    const { headerShowFun: c, toolbarShowFun: u } = ot.value, v = ((O = document.querySelector(`.mineadmin-pro-table .ma-pro-table-search${i}`)) == null ? void 0 : O.offsetHeight) ?? 0, T = ((A = document.querySelector(`.mineadmin-pro-table .ma-pro-table-header${i}`)) == null ? void 0 : A.offsetHeight) ?? 0, g = ((H = document.querySelector(`.mineadmin-pro-table .ma-pro-table-tool${i}`)) == null ? void 0 : H.offsetHeight) ?? 0, E = ((b = document.querySelector(`.mineadmin-pro-table .mine-ptt${i} .mineadmin-pagination`)) == null ? void 0 : b.offsetHeight) ?? -35;
    Z().setOptions({ adaptionOffsetBottom: (((F = (C = h2.value) == null ? void 0 : C.searchItems) == null ? void 0 : F.length) > 0 && $().getShowState() ? v : -12) + (c() ? T + 30 : 0) + (u() ? g + 10 : 0) + E + (((_ = l == null ? void 0 : l.value) == null ? void 0 : _.adaptionOffsetBottom) ?? 0) + 16 });
  }, _t = () => {
    var c;
    return createVNode("div", null, [(c = e.actions) == null ? void 0 : c.call(e)]);
  }, Et = () => {
    var v, T, g;
    const { header: c } = l.value, { headerShowFun: u } = ot.value;
    return createVNode(Fragment, null, [u() && createVNode("div", { className: `mine-card mineadmin-pro-table-header ma-pro-table-header${i}` }, [((v = e.tableHeader) == null ? void 0 : v.call(e)) ?? createVNode(Fragment, null, [createVNode("div", { className: "mineadmin-pro-table-header-title" }, [((T = e.headerTitle) == null ? void 0 : T.call(e)) ?? createVNode(Fragment, null, [createVNode("div", { className: "main-title" }, [Lt(c == null ? void 0 : c.mainTitle) ? c.mainTitle() : (c == null ? void 0 : c.mainTitle) ?? "表格主标题"]), createVNode("div", { className: "secondary-title" }, [Lt(c == null ? void 0 : c.subTitle) ? c.subTitle() : (c == null ? void 0 : c.subTitle) ?? ""])])]), createVNode("div", { className: "mineadmin-pro-table-header-actions" }, [["auto", "header"].includes(tt) && _t(), (g = e.headerRight) == null ? void 0 : g.call(e)])])])]);
  }, bt = () => {
    var O, A, H, b, C, F;
    const { headerShowFun: c, toolbarShowFun: u, toolRefreshShowFun: v, toolSearchShowFun: T, toolPrintShowFun: g, toolSettingShowFun: E } = ot.value;
    return createVNode("div", { className: `mineadmin-pro-table-toolbar ma-pro-table-tool${i}` }, [createVNode("div", { class: "mineadmin-pro-table-toolbar-content" }, [(O = e.toolbarLeft) == null ? void 0 : O.call(e), (!c() || tt === "table") && u() && _t()]), createVNode("div", null, [(A = e.beforeToolbar) == null ? void 0 : A.call(e), ((H = e.toolbar) == null ? void 0 : H.call(e)) ?? createVNode(Fragment, null, [v() && createVNode(resolveComponent("el-button"), { circle: true, onClick: async () => await rt() }, { default: () => [createVNode(so, null, null)] }), T() && ((C = (b = h2.value) == null ? void 0 : b.searchItems) == null ? void 0 : C.length) > 0 && createVNode(resolveComponent("el-button"), { circle: true, onClick: async () => {
      $().setShowState(!$().getShowState()), document.querySelector(`.ma-pro-table-search${i}`).style.display = $().getShowState() ? "block" : "none", await W();
    } }, { default: () => [createVNode(So, null, null)] }), g() && createVNode(resolveComponent("el-button"), { circle: true, onClick: () => new Un(document.querySelector(`#ma-table${i}`)) }, { default: () => [createVNode(go, null, null)] }), E() && createVNode(resolveComponent("el-dropdown"), { "max-height": 350, "hide-on-click": false, trigger: "click" }, { default: () => createVNode(resolveComponent("el-button"), { circle: true, style: { "margin-left": "12px" } }, { default: () => [createVNode(po, null, null)] }), dropdown: () => createVNode(resolveComponent("el-dropdown-menu"), { class: `mine-cols-setting${i}` }, { default: () => [P.value && p.value.map((_) => {
      const it = Lt(_.label) ? _.label() : _.label ?? "unknown";
      return createVNode(resolveComponent("el-dropdown-item"), null, { default: () => [createVNode("div", { className: "mine-pro-table-col-setting" }, [createVNode("div", { class: "settings-list" }, [createVNode(resolveComponent("el-switch"), { modelValue: _.hide, "onUpdate:modelValue": (Ot) => _.hide = Ot, size: "small", "active-value": false, "inactive-value": true }, null), createVNode("div", { className: "label" }, [it])]), createVNode("div", { class: "setting-fixed" }, [createVNode(resolveComponent("el-link"), { underline: false, type: (_ == null ? void 0 : _.fixed) === "left" ? "primary" : void 0, onClick: () => {
        _.fixed = (_ == null ? void 0 : _.fixed) !== "left" ? "left" : void 0;
      } }, { default: () => [createVNode(Co, null, null)] }), createVNode(resolveComponent("el-link"), { underline: false, type: (_ == null ? void 0 : _.fixed) === "right" ? "primary" : void 0, onClick: () => {
        _.fixed = (_ == null ? void 0 : _.fixed) !== "right" ? "right" : void 0;
      } }, { default: () => [createVNode(Mo, null, null)] })])])] });
    })] }) })]), (F = e.afterToolbar) == null ? void 0 : F.call(e)])]);
  }, st = (c, u) => {
    c.map((v, T) => {
      var E, O, A, H;
      const g = Lt(v == null ? void 0 : v.prop) ? v.prop(T) : (v == null ? void 0 : v.prop) ?? "";
      if (((E = v == null ? void 0 : v.children) == null ? void 0 : E.length) > 0) st(v.children, u);
      else if (v != null && v.cellRenderTo) {
        const b = u(v.cellRenderTo.name);
        b && ((O = v.cellRenderTo) != null && O.props ? (H = (A = v.cellRenderTo) == null ? void 0 : A.props) != null && H.prop || (v.cellRenderTo.props.prop = g) : v.cellRenderTo.props = { prop: g }, v.cellRender = (C) => b.render(C, v.cellRenderTo.props, x.value));
      }
    });
  }, ft = () => {
    const c = p.value.find((g) => (g == null ? void 0 : g.type) === "sort"), u = p.value.find((g) => (g == null ? void 0 : g.type) === "operation"), v = p.value.find((g) => (g == null ? void 0 : g.type) === "selection"), T = p.value.find((g) => (g == null ? void 0 : g.type) === "index");
    c && (c != null && c.label || c != null && c.headerRender || (c.label = "行排序"), c.width = (c == null ? void 0 : c.width) ?? "50px", c.showOverflowTooltip = false, c.cellRender = () => createVNode("div", { className: "mine-cell-flex-center mine-cursor-resize" }, [createVNode(to, null, null)])), u && (u != null && u.label || u != null && u.headerRender || (u.label = "操作"), u.showOverflowTooltip = false, u != null && u.cellRender || (u.cellRender = (g) => ((E, O) => {
      const { type: A = "dropdown" } = (O == null ? void 0 : O.operationConfigure) ?? {}, H = (b) => {
        var C;
        return createVNode(Fragment, null, [(b == null ? void 0 : b.icon) && ((C = r.value.provider) == null ? void 0 : C.icon) && h(markRaw(r.value.provider.icon), { style: "margin-right: 2px;", name: Lt(b.icon) ? b.icon(E) : b.icon }), Lt(b.text) ? b.text(E) : (b == null ? void 0 : b.text) ?? "unknown"]);
      };
      return createVNode("div", { className: "mine-operation-scroll" }, A === "dropdown" ? [createVNode(resolveComponent("el-dropdown"), { "hide-on-click": false, onCommand: (b) => {
        var C;
        return (C = b.onClick) == null ? void 0 : C.call(b, E, x.value);
      } }, { default: () => [createVNode(resolveComponent("el-link"), { underline: false }, { default: () => [createVNode(ro, null, null)] })], dropdown: () => {
        let b;
        return createVNode(resolveComponent("el-dropdown-menu"), null, Be(b = J.value.map((C) => {
          var it, Ot;
          let F;
          const _ = ((it = C == null ? void 0 : C.disabled) == null ? void 0 : it.call(C, E)) ?? false;
          return (((Ot = C == null ? void 0 : C.show) == null ? void 0 : Ot.call(C, E)) ?? true) && createVNode(resolveComponent("el-dropdown-item"), { disabled: _, command: C }, { default: () => [createVNode(resolveComponent("el-link"), mergeProps({ underline: false }, C == null ? void 0 : C.linkProps, { disabled: _ }), Be(F = H(C)) ? F : { default: () => [F] })] });
        })) ? b : { default: () => [b] });
      } })] : [J.value.map((b) => {
        var F, _;
        let C;
        return (((F = b == null ? void 0 : b.show) == null ? void 0 : F.call(b, E)) ?? true) && createVNode(resolveComponent("el-link"), mergeProps({ underline: false }, b == null ? void 0 : b.linkProps, { disabled: ((_ = b == null ? void 0 : b.disabled) == null ? void 0 : _.call(b, E)) ?? false, onClick: () => {
          var it;
          return (it = b == null ? void 0 : b.onClick) == null ? void 0 : it.call(b, E, x.value);
        } }), Be(C = H(b)) ? C : { default: () => [C] });
      })]);
    })(g, u))), v && (v.label = (v == null ? void 0 : v.label) ?? "多选"), T && (T.label = (T == null ? void 0 : T.label) ?? "#");
  }, et = () => {
    var v, T, g, E, O, A, H, b, C;
    const { toolbarShowFun: c } = ot.value, { getPluginByName: u } = Kn();
    return st(p.value, u), ft(), (() => {
      var _, it;
      const { rowContextMenu: F } = l.value;
      ((F == null ? void 0 : F.enabled) ?? false) === true && ((_ = r.value.provider) != null && _.contextMenu) && (l.value.tableOptions || (l.value.tableOptions = {}), l.value.tableOptions.on = ((it = l.value.tableOptions) == null ? void 0 : it.on) ?? {}, l.value.tableOptions.on.onRowContextmenu = (Ot, Ee, Mt) => {
        var Ut, Kt;
        Mt.preventDefault(), Mt.stopPropagation();
        const Gt = [];
        (Ut = F == null ? void 0 : F.items) == null || Ut.map((Ft, No) => {
          Ft.onClick = () => {
            var ze;
            (ze = Ft == null ? void 0 : Ft.onMenuClick) == null || ze.call(Ft, { row: Ot, column: Ee, proxy: x.value }, Mt);
          }, Gt.push(Ft);
        }), (Kt = r.value.provider) == null || Kt.contextMenu({ x: Mt.x, y: Mt.y, zIndex: 1050, iconFontClass: "", customClass: "mine-contextmenu", items: Gt });
      });
    })(), createVNode(Fragment, null, [((T = (v = h2.value) == null ? void 0 : v.searchItems) == null ? void 0 : T.length) > 0 && withDirectives(createVNode("div", { className: `mineadmin-pro-table-search mine-card ma-pro-table-search${i}` }, [createVNode(resolveComponent("ma-search"), { ref: `MaSearchRef${i}`, options: l.value.searchOptions, "form-options": l.value.searchFormOptions, "search-items": h2.value.searchItems, onFold: async () => await W(), onSearch: async (F) => await pt(F, true), onReset: async (F) => await pt(F, true) }, { default: ((g = e.search) == null ? void 0 : g.call(e)) ?? void 0, actions: ((E = e.searchActions) == null ? void 0 : E.call(e)) ?? void 0, beforeActions: ((O = e.searchBeforeActions) == null ? void 0 : O.call(e)) ?? void 0, afterActions: ((A = e.searchAfterActions) == null ? void 0 : A.call(e)) ?? void 0 })]), [[vShow, (((H = l.value.searchOptions) == null ? void 0 : H.show) ?? true) && ot.value.searchIsShow]]), (b = e.middle) == null ? void 0 : b.call(e), createVNode("div", { className: `mine-card mine-ptt${i}` }, [c() && bt(), P.value && createVNode(resolveComponent("ma-table"), { id: `ma-table${i}`, class: "ma-pro-table", ref: `MaTableRef${i}`, options: l.value.tableOptions, columns: p.value, onSetDataCallback: (F) => I.value = F }, { default: ((C = e.default) == null ? void 0 : C.call(e)) ?? void 0, ...e })])]);
  }, wt = () => createVNode("div", { className: "mineadmin-pro-table" }, [Et(), et()]);
  onMounted(async () => {
    var v, T;
    a.value = true, await G(), await rt(), Z().setOptions({ adaption: true }), window.addEventListener("resize", W), await W();
    const c = (v = p.value) == null ? void 0 : v.find((g) => (g == null ? void 0 : g.type) === "operation");
    J.value.push(...((T = c == null ? void 0 : c.operationConfigure) == null ? void 0 : T.actions) ?? []), J.value = ((g, E, O = false) => g ? g.slice().sort(O === true ? (A, H) => E(H) - E(A) : (A, H) => E(A) - E(H)) : [])(J.value, (g) => g.order);
    const u = ref(document.querySelector(`.mine-ptt${i} tbody`));
    watch(() => P.value, (g) => {
      if (g) {
        u.value = document.querySelector(`.mine-ptt${i} tbody`);
        const E = JSON.parse(JSON.stringify(I.value));
        Gn(u, E, { handle: ".mine-cursor-resize", animation: 300, onEnd: async () => {
          var O, A, H;
          await nextTick(() => I.value = E), (H = (A = (O = l.value) == null ? void 0 : O.on) == null ? void 0 : A.rowDragSort) == null || H.call(A, E), n("row-drag-sort", E);
        } });
      }
    }, { immediate: true });
  }), onBeforeUnmount(() => {
    window.removeEventListener("resize", W);
  });
  const x = ref({ getSearchRef: () => $(), getTableRef: () => Z(), setSearchForm: (c) => {
    var u, v;
    return (v = (u = $()) == null ? void 0 : u.setSearchForm) == null ? void 0 : v.call(u, c);
  }, getSearchForm: () => {
    var c, u;
    return (u = (c = $()) == null ? void 0 : c.getSearchForm) == null ? void 0 : u.call(c);
  }, refresh: async () => await rt(), requestData: rt, changeApi: async (c, u = true) => {
    f.value.api = c, f.value.autoRequest = u, await G(), await rt();
  }, setRequestParams: pt });
  return o({ ...x.value }), () => r.value.ssr ? a.value && wt() : wt();
} });
var Po = [{ name: "tag", render: (t, e, n) => h(ElTag, e, { default: () => t.row[e == null ? void 0 : e.prop] }) }];
var Ro = { install(t, e) {
  t.component(ln.name, ln);
  const n = ref(e ?? { ssr: false, provider: { app: t } });
  n.value.provider.renderPlugins = Po, t.provide("MaProTableOptions", n);
} };
export {
  Ro as MaProTable,
  Ro as default,
  Kn as useProTableRenderPlugin
};
/*! Bundled license information:

@mineadmin/pro-table/dist/index.es.js:
  (**!
   * Sortable 1.15.2
   * @author	RubaXa   <trash@rubaxa.org>
   * @author	owenm    <owen23355@gmail.com>
   * @license MIT
   *)
*/
//# sourceMappingURL=@mineadmin_pro-table.js.map
