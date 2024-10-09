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

// node_modules/.pnpm/@mineadmin+search@1.0.13_element-plus@2.8.3_vue@3.5.7_/node_modules/@mineadmin/search/dist/index.es.js
init_vue_runtime_esm_bundler();
var Z = { name: "HeroiconsMagnifyingGlass" };
var M = (r, o) => {
  const m = r.__vccOpts || r;
  for (const [d, p] of o) m[d] = p;
  return m;
};
var D = { xmlns: "http://www.w3.org/2000/svg", width: "1.2em", height: "1.2em", viewBox: "0 0 20 20" };
var q = [createBaseVNode("path", { fill: "currentColor", fillRule: "evenodd", d: "M9 3.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11M2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9", clipRule: "evenodd" }, null, -1)];
var J = M(Z, [["render", function(r, o, m, d, p, c) {
  return openBlock(), createElementBlock("svg", D, q);
}]]);
var Q = { name: "CarbonZoomReset" };
var X = { xmlns: "http://www.w3.org/2000/svg", width: "1.2em", height: "1.2em", viewBox: "0 0 32 32" };
var Y = [createBaseVNode("path", { fill: "currentColor", d: "M22.448 21A10.86 10.86 0 0 0 25 14A10.99 10.99 0 0 0 6 6.466V2H4v8h8V8H7.332a8.977 8.977 0 1 1-2.1 8h-2.04A11.01 11.01 0 0 0 14 25a10.86 10.86 0 0 0 7-2.552L28.586 30L30 28.586Z" }, null, -1)];
var ee = M(Q, [["render", function(r, o, m, d, p, c) {
  return openBlock(), createElementBlock("svg", X, Y);
}]]);
var ae = { name: "MaterialSymbolsKeyboardArrowUp" };
var te = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var oe = [createBaseVNode("path", { fill: "currentColor", d: "m12 10.8l-4.6 4.6L6 14l6-6l6 6l-1.4 1.4z" }, null, -1)];
var le = M(ae, [["render", function(r, o, m, d, p, c) {
  return openBlock(), createElementBlock("svg", te, oe);
}]]);
var se = { name: "MaterialSymbolsKeyboardArrowDown" };
var ne = { xmlns: "http://www.w3.org/2000/svg", width: "1.3em", height: "1.3em", viewBox: "0 0 24 24" };
var re = [createBaseVNode("path", { fill: "currentColor", d: "m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z" }, null, -1)];
var ue = M(se, [["render", function(r, o, m, d, p, c) {
  return openBlock(), createElementBlock("svg", ne, re);
}]]);
var E = defineComponent({ name: "MaSearch", props: { options: { type: Object, default: () => ({}) }, formOptions: { type: Object, default: () => ({}) }, searchItems: { type: Array, default: () => [] } }, emits: ["search", "reset", "fold"], setup(r, { slots: o, attrs: m, emit: d, expose: p }) {
  const c = ref({}), P = inject("MaSearchOptions"), B = ref(false), S = `_${Math.floor(1e5 * Math.random() + 2e4 * Math.random() + 5e3 * Math.random())}`, C = getCurrentInstance(), l = ref(r.options), g = ref(r.formOptions), i = ref(r.searchItems), _ = () => {
    var e;
    return (e = C == null ? void 0 : C.proxy) == null ? void 0 : e.$refs[`maFormSearchRef${S}`];
  }, b = () => l.value.fold, A = () => {
    l.value.fold = !l.value.fold;
    const e = l.value.foldRows;
    i.value.map((a, u) => {
      u > (e ? e - 1 : 1) && a.prop !== "__MaSearchAction" && (a.show = l.value.fold, i.value[u] = a);
    }), d("fold", l.value.fold);
  }, j = () => {
    var n, t;
    const { text: e } = l.value, a = b() ? ((n = e == null ? void 0 : e.isFoldBtn) == null ? void 0 : n.call(e)) ?? "折叠" : ((t = e == null ? void 0 : e.notFoldBtn) == null ? void 0 : t.call(e)) ?? "展开", u = b() ? createVNode(le, null, null) : createVNode(ue, null, null);
    return createVNode(resolveComponent("el-link"), { type: "primary", underline: false, onClick: () => A() }, { default: () => a, icon: () => createVNode("div", { className: "fold-icon" }, [u]) });
  }, V = () => {
    var a, u, n;
    const { text: e } = l.value;
    return createVNode("div", { className: "mineadmin-list-search-action" }, [((a = o.actions) == null ? void 0 : a.call(o)) ?? createVNode("div", { className: "search-actions" }, [createVNode("div", { className: "actions-first" }, [(u = o.beforeActions) == null ? void 0 : u.call(o)]), createVNode(ElButton, { type: "primary", plain: true, onClick: () => (delete c.value.__MaSearchAction, void d("search", c.value)) }, { default: () => {
      var t;
      return ((t = e == null ? void 0 : e.searchBtn) == null ? void 0 : t.call(e)) ?? "搜索";
    }, icon: () => createVNode(J, null, null) }), createVNode(ElButton, { onClick: () => {
      var t, L;
      return (L = (t = _()) == null ? void 0 : t.getElFormRef()) == null || L.resetFields(), delete c.value.__MaSearchAction, void d("reset", c.value);
    } }, { default: () => {
      var t;
      return ((t = e == null ? void 0 : e.resetBtn) == null ? void 0 : t.call(e)) ?? "重置";
    }, icon: () => createVNode(ee, null, null) }), createVNode("div", { className: "actions-end" }, [(n = o.afterActions) == null ? void 0 : n.call(o)])]), j()]);
  }, v = computed(() => {
    const { cols: e } = l.value;
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
  computed(() => ({ display: "grid", gridGap: "10px 0px", gridTemplateColumns: `repeat(${v.value}, minmax(0, 1fr))` }));
  const O = (e, a = 1, u = 0) => {
    let n = a, t = u;
    return e ? { gridColumnStart: v.value - n - t + 1, gridColumnEnd: `span ${n + t}`, marginLeft: t !== 0 ? `calc(((100% + 10px) / ${n + t}) * ${t})` : "unset" } : { gridColumn: `span ${n + t > v.value ? v.value : n + t}/span ${n + t > v.value ? v.value : n + t}`, marginLeft: t !== 0 ? `calc(((100% + 10px) / ${n + t}) * ${t})` : "unset" };
  }, F = () => {
    i.value.map((a, u) => {
      a.prop !== "__MaSearchAction" ? (a.renderProps === void 0 ? a.renderProps = { class: "mine-w-full" } : a.renderProps.class = "mine-w-full", a.cols === void 0 ? a.cols = { style: O(false, a == null ? void 0 : a.span, a == null ? void 0 : a.offset) } : a.cols.style = O(false, a == null ? void 0 : a.span, a == null ? void 0 : a.offset)) : (a.itemProps = { labelWidth: "0px" }, a.cols = { style: O(true, 1) }), i.value[u] = a;
    }), g.value.flex = { style: { display: "grid" } };
    const { show: e } = l.value;
    return createVNode(Fragment, null, [(typeof e == "function" ? e : () => e !== false)() && createVNode("div", { className: `mineadmin-list-search-panel sp-${S}` }, [createVNode(resolveComponent("ma-form"), mergeProps({ ref: `maFormSearchRef${S}`, modelValue: c.value, "onUpdate:modelValue": (a) => c.value = a, options: g.value, items: i.value }, m), { default: o != null && o.default ? () => {
      var a;
      return (a = o.default) == null ? void 0 : a.call(o);
    } : null })])]);
  }, f = ref(), $ = () => {
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
    B.value = true, l.value.fold = ((e = l.value) == null ? void 0 : e.fold) ?? false, A(), $(), i.value.push({ prop: "__MaSearchAction", render: () => V() }), window.addEventListener("resize", $);
  }), onBeforeUnmount(() => {
    window.removeEventListener("resize", $);
  });
  const k = (e) => i.value = e;
  return p({ getMaFormRef: _, foldToggle: A, getFold: b, setShowState: (e) => l.value.show = e, getShowState: () => {
    var e;
    return ((e = l.value) == null ? void 0 : e.show) ?? true;
  }, setOptions: (e) => l.value = Object.assign(l.value, e), getOptions: () => l.value, setFormOptions: (e) => g.value = Object.assign(l.value, e), getFormOptions: () => g.value, setItems: k, getItems: () => i.value, appendItem: (e) => i.value.push(e), removeItem: (e) => k(i.value.filter((a) => a.prop !== e)), getItemByProp: (e) => {
    var a;
    return ((a = i.value.filter((u) => u.prop === e)) == null ? void 0 : a[0]) ?? null;
  } }), () => P.ssr ? B.value && F() : F();
} });
var de = { install(r, o) {
  r.component(E.name, E), r.provide("MaSearchOptions", o ?? { ssr: false });
} };
export {
  de as MaSearch,
  de as default
};
//# sourceMappingURL=@mineadmin_search.js.map
