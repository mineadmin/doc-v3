import {
  ElAutocomplete,
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMention,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSelectV2,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTimeSelect,
  ElTransfer,
  ElTreeSelect,
  vLoading
} from "./chunk-RQF5J35G.js";
import "./chunk-2U45QGTX.js";
import {
  Fragment,
  createVNode,
  defineComponent,
  getCurrentInstance,
  h,
  init_vue_runtime_esm_bundler,
  inject,
  isVNode,
  mergeProps,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  resolveComponent,
  resolveDirective,
  vShow,
  withDirectives
} from "./chunk-74HL2VAL.js";
import "./chunk-V4OQ3NZ2.js";

// node_modules/.pnpm/@mineadmin+form@1.0.17_element-plus@2.8.3_vue@3.5.7_/node_modules/@mineadmin/form/dist/index.es.js
init_vue_runtime_esm_bundler();
var re = { Radio: ElRadioGroup, Checkbox: ElCheckboxGroup, CheckboxButton: ElCheckboxGroup, Input: ElInput, Mention: ElMention, Autocomplete: ElAutocomplete, InputNumber: ElInputNumber, Select: ElSelect, Cascader: ElCascader, Switch: ElSwitch, Slider: ElSlider, TimePicker: ElTimePicker, DatePicker: ElDatePicker, Rate: ElRate, ColorPicker: ElColorPicker, Transfer: ElTransfer, TimeSelect: ElTimeSelect, SelectV2: ElSelectV2, TreeSelect: ElTreeSelect, RadioButton: ElRadioGroup };
var qe = typeof global == "object" && global && global.Object === Object && global;
var Je = typeof self == "object" && self && self.Object === Object && self;
var N = qe || Je || Function("return this")();
var _ = N.Symbol;
var fe = Object.prototype;
var Ke = fe.hasOwnProperty;
var Qe = fe.toString;
var j = _ ? _.toStringTag : void 0;
var Xe = Object.prototype.toString;
var Ye = "[object Null]";
var Ze = "[object Undefined]";
var ne = _ ? _.toStringTag : void 0;
function ve(e) {
  return e == null ? e === void 0 ? Ze : Ye : ne && ne in Object(e) ? function(t) {
    var r = Ke.call(t, j), n = t[j];
    try {
      t[j] = void 0;
      var o = true;
    } catch {
    }
    var l = Qe.call(t);
    return o && (r ? t[j] = n : delete t[j]), l;
  }(e) : function(t) {
    return Xe.call(t);
  }(e);
}
var et = "[object Symbol]";
function D(e) {
  return typeof e == "symbol" || function(t) {
    return t != null && typeof t == "object";
  }(e) && ve(e) == et;
}
var B = Array.isArray;
var tt = 1 / 0;
var oe = _ ? _.prototype : void 0;
var ae = oe ? oe.toString : void 0;
function de(e) {
  if (typeof e == "string") return e;
  if (B(e)) return function(r, n) {
    for (var o = -1, l = r == null ? 0 : r.length, s = Array(l); ++o < l; ) s[o] = n(r[o], o, r);
    return s;
  }(e, de) + "";
  if (D(e)) return ae ? ae.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -tt ? "-0" : t;
}
function I(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var rt = "[object AsyncFunction]";
var nt = "[object Function]";
var ot = "[object GeneratorFunction]";
var at = "[object Proxy]";
var ie;
var L = N["__core-js_shared__"];
var le = (ie = /[^.]+$/.exec(L && L.keys && L.keys.IE_PROTO || "")) ? "Symbol(src)_1." + ie : "";
var it = Function.prototype.toString;
var lt = /^\[object .+?Constructor\]$/;
var st = Function.prototype;
var ut = Object.prototype;
var ct = st.toString;
var pt = ut.hasOwnProperty;
var ft = RegExp("^" + ct.call(pt).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
function vt(e) {
  if (!I(e) || (t = e, le && le in t)) return false;
  var t, r = function(n) {
    if (!I(n)) return false;
    var o = ve(n);
    return o == nt || o == ot || o == rt || o == at;
  }(e) ? ft : lt;
  return r.test(function(n) {
    if (n != null) {
      try {
        return it.call(n);
      } catch {
      }
      try {
        return n + "";
      } catch {
      }
    }
    return "";
  }(e));
}
function U(e, t) {
  var r = function(n, o) {
    return n == null ? void 0 : n[o];
  }(e, t);
  return vt(r) ? r : void 0;
}
var se = function() {
  try {
    var e = U(Object, "defineProperty");
    return e({}, "", {}), e;
  } catch {
  }
}();
var dt = 9007199254740991;
var ht = /^(?:0|[1-9]\d*)$/;
function mt(e, t) {
  var r = typeof e;
  return !!(t = t ?? dt) && (r == "number" || r != "symbol" && ht.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function he(e, t) {
  return e === t || e != e && t != t;
}
var yt = Object.prototype.hasOwnProperty;
function gt(e, t, r) {
  var n = e[t];
  yt.call(e, t) && he(n, r) && (r !== void 0 || t in e) || function(o, l, s) {
    l == "__proto__" && se ? se(o, l, { configurable: true, enumerable: true, value: s, writable: true }) : o[l] = s;
  }(e, t, r);
}
var _t = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var bt = /^\w*$/;
var O = U(Object, "create");
var wt = Object.prototype.hasOwnProperty;
var jt = Object.prototype.hasOwnProperty;
function d(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
function F(e, t) {
  for (var r = e.length; r--; ) if (he(e[r][0], t)) return r;
  return -1;
}
d.prototype.clear = function() {
  this.__data__ = O ? O(null) : {}, this.size = 0;
}, d.prototype.delete = function(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}, d.prototype.get = function(e) {
  var t = this.__data__;
  if (O) {
    var r = t[e];
    return r === "__lodash_hash_undefined__" ? void 0 : r;
  }
  return wt.call(t, e) ? t[e] : void 0;
}, d.prototype.has = function(e) {
  var t = this.__data__;
  return O ? t[e] !== void 0 : jt.call(t, e);
}, d.prototype.set = function(e, t) {
  var r = this.__data__;
  return this.size += this.has(e) ? 0 : 1, r[e] = O && t === void 0 ? "__lodash_hash_undefined__" : t, this;
};
var Ot = Array.prototype.splice;
function g(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
g.prototype.clear = function() {
  this.__data__ = [], this.size = 0;
}, g.prototype.delete = function(e) {
  var t = this.__data__, r = F(t, e);
  return !(r < 0) && (r == t.length - 1 ? t.pop() : Ot.call(t, r, 1), --this.size, true);
}, g.prototype.get = function(e) {
  var t = this.__data__, r = F(t, e);
  return r < 0 ? void 0 : t[r][1];
}, g.prototype.has = function(e) {
  return F(this.__data__, e) > -1;
}, g.prototype.set = function(e, t) {
  var r = this.__data__, n = F(r, e);
  return n < 0 ? (++this.size, r.push([e, t])) : r[n][1] = t, this;
};
var St = U(N, "Map");
function k(e, t) {
  var r, n, o = e.__data__;
  return ((n = typeof (r = t)) == "string" || n == "number" || n == "symbol" || n == "boolean" ? r !== "__proto__" : r === null) ? o[typeof t == "string" ? "string" : "hash"] : o.map;
}
function h2(e) {
  var t = -1, r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
h2.prototype.clear = function() {
  this.size = 0, this.__data__ = { hash: new d(), map: new (St || g)(), string: new d() };
}, h2.prototype.delete = function(e) {
  var t = k(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}, h2.prototype.get = function(e) {
  return k(this, e).get(e);
}, h2.prototype.has = function(e) {
  return k(this, e).has(e);
}, h2.prototype.set = function(e, t) {
  var r = k(this, e), n = r.size;
  return r.set(e, t), this.size += r.size == n ? 0 : 1, this;
};
var Et = "Expected a function";
function G(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function") throw new TypeError(Et);
  var r = function() {
    var n = arguments, o = t ? t.apply(this, n) : n[0], l = r.cache;
    if (l.has(o)) return l.get(o);
    var s = e.apply(this, n);
    return r.cache = l.set(o, s) || l, s;
  };
  return r.cache = new (G.Cache || h2)(), r;
}
G.Cache = h2;
var ue;
var V;
var A;
var Ct = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var Pt = /\\(\\)?/g;
var xt = (ue = function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(Ct, function(r, n, o, l) {
    t.push(o ? l.replace(Pt, "$1") : n || r);
  }), t;
}, V = G(ue, function(e) {
  return A.size === 500 && A.clear(), e;
}), A = V.cache, V);
function me(e, t) {
  return B(e) ? e : function(r, n) {
    if (B(r)) return false;
    var o = typeof r;
    return !(o != "number" && o != "symbol" && o != "boolean" && r != null && !D(r)) || bt.test(r) || !_t.test(r) || n != null && r in Object(n);
  }(e, t) ? [e] : xt(function(r) {
    return r == null ? "" : de(r);
  }(e));
}
var zt = 1 / 0;
function ye(e) {
  if (typeof e == "string" || D(e)) return e;
  var t = e + "";
  return t == "0" && 1 / e == -zt ? "-0" : t;
}
function Ft(e, t, r) {
  var n = e == null ? void 0 : function(o, l) {
    for (var s = 0, v = (l = me(l, o)).length; o != null && s < v; ) o = o[ye(l[s++])];
    return s && s == v ? o : void 0;
  }(e, t);
  return n === void 0 ? r : n;
}
function kt(e, t, r) {
  return e == null ? e : function(n, o, l) {
    if (!I(n)) return n;
    for (var s = -1, v = (o = me(o, n)).length, b = v - 1, p = n; p != null && ++s < v; ) {
      var c = ye(o[s]), m = l;
      if (c === "__proto__" || c === "constructor" || c === "prototype") return n;
      if (s != b) {
        var w = p[c];
        (m = void 0) == void 0 && (m = I(w) ? w : mt(o[s + 1]) ? [] : {});
      }
      gt(p, c, m), p = p[c];
    }
    return n;
  }(e, t, r);
}
function R(e) {
  return typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !isVNode(e);
}
var ce = defineComponent({ name: "MaForm", props: { modelValue: { type: Object, default: () => ({}) }, options: { type: Object, default: () => ({}) }, items: { type: Array, default: () => [] } }, directives: { Loading: vLoading }, setup(e, { slots: t, attrs: r, expose: n }) {
  const o = ref(e.modelValue), l = ref(e.options), s = ref(e.items), v = inject("MaFormOptions"), b = ref(false), p = ref(), c = ref(false), m = () => {
    c.value = window.innerWidth < 768;
  };
  onMounted(async () => {
    b.value = true, window.addEventListener("resize", m);
  }), onBeforeUnmount(() => {
    b.value = false, window.removeEventListener("resize", m);
  });
  const w = (i, a) => h(i, { modelValue: Ft(o.value, a.prop), "onUpdate:modelValue": (u) => kt(o.value, a.prop, u), ...a == null ? void 0 : a.renderProps }, (a == null ? void 0 : a.renderSlots) ?? null), ge = (i) => {
    if (typeof i.render == "string") {
      const a = i.render[0].toUpperCase().concat(i.render.substring(1, i.render.length));
      if (re[a]) return w(re[a], i);
    } else if (typeof i.render == "function") {
      const a = i.render;
      return w(a(i, o.value), i);
    }
  }, H = () => {
    const { layout: i } = l.value;
    return s.value.map((a) => {
      let u;
      const { label: T, prop: S, itemProps: J, hide: E, show: C, cols: P } = a, M = typeof E == "function" ? E : () => E === true, x = () => withDirectives(createVNode(ElFormItem, mergeProps({ ref: `formItemRef-${a.prop}`, label: T, prop: S }, J), { default: () => [a.render ? ge(a) : null] }), [[vShow, M(a, o.value) !== true]]);
      return createVNode(Fragment, null, [(typeof C == "function" ? C : () => C !== false)(a, o.value) && (i === void 0 || i === "flex" ? createVNode(resolveComponent("el-col"), P, R(u = x()) ? u : { default: () => [u] }) : x())]);
    });
  }, _e = () => {
    var K;
    let i, a;
    const { layout: u, flex: T, grid: S, loading: J, loadingConfig: E, containerClass: C, footerSlot: P, ...M } = l.value, { style: x } = S ?? {};
    return createVNode(Fragment, null, [createVNode(ElForm, mergeProps({ model: o, ref: p }, M, r), { default: () => {
      var Q;
      return [((Q = t.default) == null ? void 0 : Q.call(t)) ?? (u === void 0 || u === "flex" ? createVNode(resolveComponent("el-row"), mergeProps({ gutter: c.value ? 0 : 15 }, T), R(i = H()) ? i : { default: () => [i] }) : createVNode(resolveComponent("el-space"), mergeProps({ style: x ?? "width: 100%" }, S), R(a = H()) ? a : { default: () => [a] }))];
    } }), ((K = t.footer) == null ? void 0 : K.call(t)) ?? (P ? h(P) : null)]);
  }, W = () => {
    const { loading: i, loadingConfig: a, containerClass: u } = l.value;
    return withDirectives(createVNode("div", { className: ["mineadmin-form", u], "element-loading-svg": (a == null ? void 0 : a.svg) ?? '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248m452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248M828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0"/></svg>', "element-loading-svg-view-box": (a == null ? void 0 : a.viewBox) ?? "-9, -9, 50, 50", "element-loading-text": (a == null ? void 0 : a.text) ?? null, "element-loading-spinner": (a == null ? void 0 : a.spinner) ?? null, "element-loading-background": (a == null ? void 0 : a.spinner) ?? null, "element-loading-custom-class": (a == null ? void 0 : a.customClass) ?? null }, [_e()]), [[resolveDirective("loading"), i]]);
  }, q = (i) => s.value = i;
  return n({ setLoadingState: (i) => l.value.loading = i, setOptions: (i) => l.value = Object.assign(l.value, i), getOptions: () => l.value, setItems: q, getItems: () => s.value, appendItem: (i) => s.value.push(i), removeItem: (i) => q(s.value.filter((a) => a.prop !== i)), getItemByProp: (i) => {
    var a;
    return ((a = s.value.filter((u) => u.prop === i)) == null ? void 0 : a[0]) ?? null;
  }, isMobileState: () => c.value, getElFormRef: () => p.value }), () => v.ssr ? b.value && W() : W();
} });
function Mt(e) {
  return new Promise((t, r) => {
    const n = getCurrentInstance();
    onMounted(async () => {
      await nextTick(() => {
        if (n && n.refs[e]) {
          const o = n.refs[e];
          t({ ...o });
        } else r("[@mineadmin/form]: not found ref for ma-form component");
      });
    });
  });
}
var $t = { install(e, t) {
  e.component(ce.name, ce), e.provide("MaFormOptions", t ?? { ssr: false });
} };
export {
  $t as MaForm,
  $t as default,
  Mt as useForm
};
//# sourceMappingURL=@mineadmin_form.js.map
