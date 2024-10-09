import {
  ElButton
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
  init_vue_runtime_esm_bundler,
  inject,
  mergeProps,
  onBeforeUnmount,
  onMounted,
  openBlock,
  ref,
  resolveComponent
} from "./chunk-74HL2VAL.js";
import "./chunk-V4OQ3NZ2.js";

// node_modules/.pnpm/@mineadmin+search@1.0.19_element-plus@2.8.3_vue@3.5.7_/node_modules/@mineadmin/search/dist/index.es.js
init_vue_runtime_esm_bundler();
var q = { name: "HeroiconsMagnifyingGlass" };
var y = (r, l) => {
  const m = r.__vccOpts || r;
  for (const [d, v] of l) m[d] = v;
  return m;
};
var J = { xmlns: "http://www.w3.org/2000/svg", width: "1.2em", height: "1.2em", viewBox: "0 0 20 20" };
var Q = [createBaseVNode("path", { fill: "currentColor", fillRule: "evenodd", d: "M9 3.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11M2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9", clipRule: "evenodd" }, null, -1)];
var X = y(q, [["render", function(r, l, m, d, v, g) {
  return openBlock(), createElementBlock("svg", J, Q);
}]]);
var Y = { name: "CarbonZoomReset" };
var ee = { xmlns: "http://www.w3.org/2000/svg", width: "1.2em", height: "1.2em", viewBox: "0 0 32 32" };
var ae = [createBaseVNode("path", { fill: "currentColor", d: "M22.448 21A10.86 10.86 0 0 0 25 14A10.99 10.99 0 0 0 6 6.466V2H4v8h8V8H7.332a8.977 8.977 0 1 1-2.1 8h-2.04A11.01 11.01 0 0 0 14 25a10.86 10.86 0 0 0 7-2.552L28.586 30L30 28.586Z" }, null, -1)];
var te = y(Y, [["render", function(r, l, m, d, v, g) {
  return openBlock(), createElementBlock("svg", ee, ae);
}]]);
var le = { name: "MaterialSymbolsKeyboardArrowUp" };
var oe = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var se = [createBaseVNode("path", { fill: "currentColor", d: "m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z" }, null, -1)];
var ne = y(le, [["render", function(r, l, m, d, v, g) {
  return openBlock(), createElementBlock("svg", oe, se);
}]]);
var re = { name: "MaterialSymbolsKeyboardArrowDown" };
var ue = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var ie = [createBaseVNode("path", { fill: "currentColor", d: "m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" }, null, -1)];
var ce = y(re, [["render", function(r, l, m, d, v, g) {
  return openBlock(), createElementBlock("svg", ue, ie);
}]]);
var P = defineComponent({ name: "MaSearch", props: { options: { type: Object, default: () => ({}) }, formOptions: { type: Object, default: () => ({}) }, searchItems: { type: Array, default: () => [] } }, emits: ["search", "reset", "fold"], setup(r, { slots: l, attrs: m, emit: d, expose: v }) {
  var I;
  const g = inject("MaSearchOptions"), B = ref(false), b = `_${Math.floor(1e5 * Math.random() + 2e4 * Math.random() + 5e3 * Math.random())}`, A = getCurrentInstance(), o = ref(r.options), w = ref(r.formOptions), i = ref(r.searchItems), c = ref(((I = o.value) == null ? void 0 : I.defaultValue) ?? {}), $ = () => {
    var e;
    return (e = A == null ? void 0 : A.proxy) == null ? void 0 : e.$refs[`maFormSearchRef${b}`];
  }, _ = () => o.value.fold, C = () => {
    o.value.fold = !o.value.fold;
    const e = o.value.foldRows;
    i.value.map((a, u) => {
      u > (e ? e - 1 : 1) && a.prop !== "__MaSearchAction" && (a.show = o.value.fold, i.value[u] = a);
    }), d("fold", o.value.fold);
  }, z = () => {
    var n, t;
    const { text: e } = o.value, a = _() ? ((n = e == null ? void 0 : e.isFoldBtn) == null ? void 0 : n.call(e)) ?? "折叠" : ((t = e == null ? void 0 : e.notFoldBtn) == null ? void 0 : t.call(e)) ?? "展开", u = _() ? createVNode(ne, null, null) : createVNode(ce, null, null);
    return createVNode(resolveComponent("el-link"), { type: "primary", underline: false, onClick: () => C() }, { default: () => a, icon: () => createVNode("div", { className: "fold-icon" }, [u]) });
  }, H = () => {
    var a, u, n;
    const { text: e } = o.value;
    return createVNode("div", { className: "mineadmin-list-search-action" }, [((a = l.actions) == null ? void 0 : a.call(l)) ?? createVNode("div", { className: "search-actions" }, [createVNode("div", { className: "actions-first" }, [(u = l.beforeActions) == null ? void 0 : u.call(l)]), createVNode(ElButton, { type: "primary", plain: true, onClick: () => (delete c.value.__MaSearchAction, void d("search", c.value)) }, { default: () => {
      var t;
      return ((t = e == null ? void 0 : e.searchBtn) == null ? void 0 : t.call(e)) ?? "搜索";
    }, icon: () => createVNode(X, null, null) }), createVNode(ElButton, { onClick: () => {
      var t, N;
      return (N = (t = $()) == null ? void 0 : t.getElFormRef()) == null || N.resetFields(), delete c.value.__MaSearchAction, void d("reset", c.value);
    } }, { default: () => {
      var t;
      return ((t = e == null ? void 0 : e.resetBtn) == null ? void 0 : t.call(e)) ?? "重置";
    }, icon: () => createVNode(te, null, null) }), createVNode("div", { className: "actions-end" }, [(n = l.afterActions) == null ? void 0 : n.call(l)])]), z()]);
  }, p = computed(() => {
    const { cols: e } = o.value;
    switch (f.value) {
      case "xl":
        return (e == null ? void 0 : e.xl) ?? 4;
      case "lg":
        return (e == null ? void 0 : e.lg) ?? 3;
      case "md":
        return (e == null ? void 0 : e.md) ?? 2;
      case "sm":
        return (e == null ? void 0 : e.sm) ?? 2;
      case "xs":
        return (e == null ? void 0 : e.xs) ?? 1;
    }
  });
  computed(() => ({ display: "grid", gridGap: "10px 0px", gridTemplateColumns: `repeat(${p.value}, minmax(0, 1fr))` }));
  const O = (e, a = 1, u = 0) => {
    let n = a, t = u;
    return e ? { gridColumnStart: p.value - n - t + 1, gridColumnEnd: `span ${n + t}`, marginLeft: t !== 0 ? `calc(((100% + 10px) / ${n + t}) * ${t})` : "unset" } : { gridColumn: `span ${n + t > p.value ? p.value : n + t}/span ${n + t > p.value ? p.value : n + t}`, marginLeft: t !== 0 ? `calc(((100% + 10px) / ${n + t}) * ${t})` : "unset" };
  }, k = () => {
    R("__MaSearchAction") || i.value.push({ prop: "__MaSearchAction", render: () => H() }), i.value.map((a, u) => {
      a.prop !== "__MaSearchAction" ? (a.renderProps === void 0 ? a.renderProps = { class: "mine-w-full" } : a.renderProps.class = "mine-w-full", a.cols === void 0 ? a.cols = { style: O(false, a == null ? void 0 : a.span, a == null ? void 0 : a.offset) } : a.cols.style = O(false, a == null ? void 0 : a.span, a == null ? void 0 : a.offset)) : (a.itemProps = { labelWidth: "0px" }, a.cols = { style: O(true, 1) }), i.value[u] = a;
    }), w.value.flex = { style: { display: "grid" } };
    const { show: e } = o.value;
    return createVNode(Fragment, null, [(typeof e == "function" ? e : () => e !== false)() && createVNode("div", { className: `mineadmin-list-search-panel sp-${b}` }, [createVNode(resolveComponent("ma-form"), mergeProps({ ref: `maFormSearchRef${b}`, modelValue: c.value, "onUpdate:modelValue": (a) => c.value = a, options: w.value, items: i.value }, m), { default: l != null && l.default ? () => {
      var a;
      return (a = l.default) == null ? void 0 : a.call(l);
    } : null })])]);
  }, f = ref(), F = () => {
    let e = window.innerWidth;
    switch (!!e) {
      case e < 768:
        f.value = "xs";
        break;
      case (e >= 768 && e < 992):
        f.value = "sm";
        break;
      case (e >= 992 && e < 1200):
        f.value = "md";
        break;
      case (e >= 1200 && e < 1920):
        f.value = "lg";
        break;
      case e >= 1920:
        f.value = "xl";
    }
  };
  onMounted(() => {
    var e;
    B.value = true, o.value.fold = ((e = o.value) == null ? void 0 : e.fold) ?? false, C(), F(), window.addEventListener("resize", F);
  }), onBeforeUnmount(() => {
    window.removeEventListener("resize", F);
  });
  const L = (e) => i.value = e, R = (e) => {
    var a;
    return ((a = i.value.filter((u) => u.prop === e)) == null ? void 0 : a[0]) ?? null;
  };
  return v({ getMaFormRef: $, setSearchForm: (e) => {
    c.value = Object.assign(c.value, e);
  }, getSearchForm: () => (delete c.value.__MaSearchAction, c.value), foldToggle: C, getFold: _, setShowState: (e) => o.value.show = e, getShowState: () => {
    var e;
    return ((e = o.value) == null ? void 0 : e.show) ?? true;
  }, setOptions: (e) => o.value = Object.assign(o.value, e), getOptions: () => o.value, setFormOptions: (e) => w.value = Object.assign(o.value, e), getFormOptions: () => w.value, setItems: L, getItems: () => i.value, appendItem: (e) => i.value.push(e), removeItem: (e) => L(i.value.filter((a) => a.prop !== e)), getItemByProp: R }), () => g.ssr ? B.value && k() : k();
} });
var ve = { install(r, l) {
  r.component(P.name, P), r.provide("MaSearchOptions", l ?? { ssr: false });
} };
export {
  ve as MaSearch,
  ve as default
};
//# sourceMappingURL=@mineadmin_search.js.map
