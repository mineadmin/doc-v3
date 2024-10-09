import {
  ElEmpty,
  ElPagination,
  ElTable,
  ElTableColumn,
  vLoading
} from "./chunk-YQCMJL54.js";
import "./chunk-P3X5CLXH.js";
import {
  Fragment,
  computed,
  createVNode,
  defineComponent,
  getCurrentInstance,
  init_vue_runtime_esm_bundler,
  inject,
  isVNode,
  mergeProps,
  onBeforeUnmount,
  onMounted,
  ref,
  resolveDirective,
  vShow,
  watch,
  withDirectives
} from "./chunk-74HL2VAL.js";
import "./chunk-V4OQ3NZ2.js";

// node_modules/.pnpm/@mineadmin+table@1.0.22_element-plus@2.8.3_vue@3.5.7_/node_modules/@mineadmin/table/dist/index.es.js
init_vue_runtime_esm_bundler();
var P = defineComponent({ name: "MaTable", props: { options: { type: Object, default: () => ({}) }, columns: { type: Array, default: () => [] } }, directives: { Loading: vLoading }, emits: ["set-data-callback"], setup(r, { slots: a, attrs: u, emit: m, expose: w }) {
  const t = ref(r.options), d = ref(r.columns), H = inject("MaTableOptions"), y = ref(false), x = ref(), h = () => {
    const { adaptionOffsetBottom: e } = t.value, n = window.innerHeight - (e ?? 70);
    t.value.height = `${n}px`;
  };
  onMounted(async () => {
    y.value = true;
  }), watch(() => {
    var e;
    return (e = t.value) == null ? void 0 : e.adaption;
  }, (e) => {
    e && (window.addEventListener("resize", h), h());
  }, { immediate: true }), watch(() => {
    var e;
    return (e = t.value) == null ? void 0 : e.adaptionOffsetBottom;
  }, () => {
    var e;
    (e = t.value) != null && e.adaption && h();
  }, { immediate: true }), onBeforeUnmount(() => {
    y.value = false, window.removeEventListener("resize", h);
  });
  const N = computed(() => {
    var n;
    const { pagination: e } = t.value;
    return withDirectives(createVNode("div", { className: "mineadmin-pagination" }, [createVNode("div", { class: "mineadmin-pagination-left" }, [(n = a == null ? void 0 : a.pageLeft) == null ? void 0 : n.call(a)]), e && createVNode("div", { class: "mineadmin-el-page" }, [createVNode(ElPagination, mergeProps(e, { size: (e == null ? void 0 : e.size) ?? "default", pagerCount: (e == null ? void 0 : e.pagerCount) ?? 5, layout: (e == null ? void 0 : e.layout) ?? "total, prev, pager, next, sizes, jumper" }), null)])]), [[vShow, a.pageLeft || e]]);
  }), T = (e, n) => {
    var M, B, z;
    if (e != null && e.hide && (e == null ? void 0 : e.hide) instanceof Function && e.hide(u) || e != null && e.hide && typeof (e == null ? void 0 : e.hide) == "boolean" && e.hide) return;
    const l = typeof e.prop == "function" ? e.prop(n) : e.prop;
    let o = { default: (s) => {
      var p, g, f;
      return ((p = e == null ? void 0 : e.cellRender) == null ? void 0 : p.call(e, Object.assign(s, { options: t.value, attrs: u }))) ?? ((g = a == null ? void 0 : a[`column-${l}`]) == null ? void 0 : g.call(a, s)) ?? ((f = a == null ? void 0 : a.default) == null ? void 0 : f.call(a, s));
    }, header: (s) => {
      var p, g, f;
      return ((p = e == null ? void 0 : e.headerRender) == null ? void 0 : p.call(e, Object.assign(s, { options: t.value, attrs: u }))) ?? ((g = a == null ? void 0 : a[`header-${l}`]) == null ? void 0 : g.call(a, s)) ?? ((f = a == null ? void 0 : a.header) == null ? void 0 : f.call(a, s));
    }, filterIcon: (s) => {
      var p;
      return (p = a == null ? void 0 : a.filterIcon) == null ? void 0 : p.call(a, s);
    } };
    const { label: O, prop: _, children: c, cellRender: v, headerRender: ee, ...I } = e;
    return c && c.length > 0 && (o = c == null ? void 0 : c.map(T)), createVNode(ElTableColumn, mergeProps({ key: n }, I, { label: typeof O == "function" ? O() : O, prop: l, align: (e == null ? void 0 : e.align) ?? ((M = t.value) == null ? void 0 : M.columnAlign) ?? "center", headerAlign: (e == null ? void 0 : e.headerAlign) ?? ((B = t.value) == null ? void 0 : B.headerAlign) ?? "center", showOverflowTooltip: (e == null ? void 0 : e.showOverflowTooltip) ?? ((z = t.value) == null ? void 0 : z.showOverflowTooltip) ?? true }), typeof (L = o) == "function" || Object.prototype.toString.call(L) === "[object Object]" && !isVNode(L) ? o : { default: () => [o] });
    var L;
  }, V = () => {
    const { on: e, pagination: n, ...l } = t.value;
    return createVNode(Fragment, null, [createVNode(ElTable, mergeProps({ ref: x }, e, l, u), { default: () => {
      var o;
      return [createVNode(Fragment, null, [(o = d.value) == null ? void 0 : o.map(T)])];
    }, append: () => {
      var o;
      return (o = a.append) == null ? void 0 : o.call(a);
    }, empty: () => {
      var o;
      return ((o = a.empty) == null ? void 0 : o.call(a)) ?? createVNode(ElEmpty, null, null);
    } }), N.value]);
  }, j = () => {
    const { loading: e, loadingConfig: n, height: l, maxHeight: o } = t.value;
    return withDirectives(createVNode("div", { className: "mineadmin-table", "element-loading-svg": (n == null ? void 0 : n.svg) ?? '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248m452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248M828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0"/></svg>', "element-loading-svg-view-box": (n == null ? void 0 : n.viewBox) ?? "-9, -9, 50, 50", "element-loading-text": (n == null ? void 0 : n.text) ?? null, "element-loading-spinner": (n == null ? void 0 : n.spinner) ?? null, "element-loading-background": (n == null ? void 0 : n.spinner) ?? null, "element-loading-custom-class": (n == null ? void 0 : n.customClass) ?? null }, [V()]), [[resolveDirective("loading"), e]]);
  }, E = (e) => d.value = e;
  return w({ setData: (e) => {
    t.value.data = e, m("set-data-callback", e);
  }, setPagination: (e) => {
    var n;
    return t.value.pagination = Object.assign(((n = t.value) == null ? void 0 : n.pagination) ?? {}, e);
  }, setLoadingState: (e) => t.value.loading = e, setOptions: (e) => t.value = Object.assign(t.value, e), getOptions: () => t.value, setColumns: E, getColumns: () => d.value, appendColumn: (e) => d.value.push(e), removeColumn: (e) => E(d.value.filter((n, l) => (typeof n.prop == "function" ? n.prop(l) : n.prop) !== e)), getColumnByProp: (e) => {
    var n;
    return ((n = d.value.filter((l, o) => (typeof l.prop == "function" ? l.prop(o) : l.prop) !== e)) == null ? void 0 : n[0]) ?? null;
  }, getElTableRef: () => x.value }), () => H.ssr ? y.value && j() : j();
} });
function te(r) {
  return new Promise(async (a, u) => {
    const m = getCurrentInstance();
    onMounted(async () => {
      if (m && m.refs[r]) {
        const w = m.refs[r];
        a({ ...w });
      } else u("[@mineadmin/table]: not found ref for ma-table component");
    });
  });
}
var oe = { install(r, a) {
  r.component(P.name, P), r.provide("MaTableOptions", a ?? { ssr: false });
} };
export {
  oe as MaTable,
  oe as default,
  te as useTable
};
//# sourceMappingURL=@mineadmin_table.js.map
