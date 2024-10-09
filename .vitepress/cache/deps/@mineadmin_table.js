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

// node_modules/.pnpm/@mineadmin+table@1.0.19_element-plus@2.8.3_vue@3.5.7_/node_modules/@mineadmin/table/dist/index.es.js
init_vue_runtime_esm_bundler();
var k = defineComponent({ name: "MaTable", props: { options: { type: Object, default: () => ({}) }, columns: { type: Array, default: () => [] } }, directives: { Loading: vLoading }, emits: ["set-data-callback"], setup(r, { slots: e, attrs: p, emit: m, expose: b }) {
  const n = ref(r.options), d = ref(r.columns), P = inject("MaTableOptions"), w = ref(false), L = ref(), f = () => {
    const { adaptionOffsetBottom: a } = n.value, t = window.innerHeight - (a ?? 70);
    n.value.height = `${t}px`;
  };
  onMounted(async () => {
    w.value = true;
  }), watch(() => {
    var a;
    return (a = n.value) == null ? void 0 : a.adaption;
  }, (a) => {
    a && (window.addEventListener("resize", f), f());
  }, { immediate: true }), watch(() => {
    var a;
    return (a = n.value) == null ? void 0 : a.adaptionOffsetBottom;
  }, () => {
    var a;
    (a = n.value) != null && a.adaption && f();
  }, { immediate: true }), onBeforeUnmount(() => {
    w.value = false, window.removeEventListener("resize", f);
  });
  const D = computed(() => {
    var t;
    const { pagination: a } = n.value;
    return withDirectives(createVNode("div", { className: "mineadmin-pagination" }, [createVNode("div", { class: "mineadmin-pagination-left" }, [(t = e == null ? void 0 : e.pageLeft) == null ? void 0 : t.call(e)]), a && createVNode("div", { class: "mineadmin-el-page" }, [createVNode(ElPagination, mergeProps(a, { size: (a == null ? void 0 : a.size) ?? "default", pagerCount: (a == null ? void 0 : a.pagerCount) ?? 5, layout: (a == null ? void 0 : a.layout) ?? "total, prev, pager, next, sizes, jumper" }), null)])]), [[vShow, e.pageLeft || a]]);
  }), C = (a, t) => {
    var j, E, M;
    if (a != null && a.hide && (a == null ? void 0 : a.hide) instanceof Function && a.hide(p) || a != null && a.hide && typeof (a == null ? void 0 : a.hide) == "boolean" && a.hide) return;
    let i = { default: (s) => {
      var u, v, c;
      return ((u = a == null ? void 0 : a.cellRender) == null ? void 0 : u.call(a, Object.assign(s, { options: n.value, attrs: p }))) ?? ((v = e == null ? void 0 : e[`column-${a.prop}`]) == null ? void 0 : v.call(e, s)) ?? ((c = e == null ? void 0 : e.default) == null ? void 0 : c.call(e, s));
    }, header: (s) => {
      var u, v, c;
      return ((u = a == null ? void 0 : a.headerRender) == null ? void 0 : u.call(a, Object.assign(s, { options: n.value, attrs: p }))) ?? ((v = e == null ? void 0 : e[`header-${a.prop}`]) == null ? void 0 : v.call(e, s)) ?? ((c = e == null ? void 0 : e.header) == null ? void 0 : c.call(e, s));
    }, filterIcon: (s) => {
      var u;
      return (u = e == null ? void 0 : e.filterIcon) == null ? void 0 : u.call(e, s);
    } };
    const { children: l, ...V } = a;
    return l && l.length > 0 && (i = l == null ? void 0 : l.map(C)), createVNode(ElTableColumn, mergeProps({ key: t }, V, { align: (a == null ? void 0 : a.align) ?? ((j = n.value) == null ? void 0 : j.columnAlign) ?? "center", headerAlign: (a == null ? void 0 : a.headerAlign) ?? ((E = n.value) == null ? void 0 : E.headerAlign) ?? "center", showOverflowTooltip: (a == null ? void 0 : a.showOverflowTooltip) ?? ((M = n.value) == null ? void 0 : M.showOverflowTooltip) ?? true }), typeof (y = i) == "function" || Object.prototype.toString.call(y) === "[object Object]" && !isVNode(y) ? i : { default: () => [i] });
    var y;
  }, N = () => {
    const { on: a, pagination: t, ...i } = n.value;
    return createVNode(Fragment, null, [createVNode(ElTable, mergeProps({ ref: L }, a, i, p), { default: () => {
      var l;
      return [createVNode(Fragment, null, [(l = d.value) == null ? void 0 : l.map(C)])];
    }, append: () => {
      var l;
      return (l = e.append) == null ? void 0 : l.call(e);
    }, empty: () => {
      var l;
      return ((l = e.empty) == null ? void 0 : l.call(e)) ?? createVNode(ElEmpty, null, null);
    } }), D.value]);
  }, x = () => {
    const { loading: a, loadingConfig: t, height: i, maxHeight: l } = n.value;
    return withDirectives(createVNode("div", { className: "mineadmin-table", "element-loading-svg": (t == null ? void 0 : t.svg) ?? '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248m452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248M828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0"/></svg>', "element-loading-svg-view-box": (t == null ? void 0 : t.viewBox) ?? "-9, -9, 50, 50", "element-loading-text": (t == null ? void 0 : t.text) ?? null, "element-loading-spinner": (t == null ? void 0 : t.spinner) ?? null, "element-loading-background": (t == null ? void 0 : t.spinner) ?? null, "element-loading-custom-class": (t == null ? void 0 : t.customClass) ?? null }, [N()]), [[resolveDirective("loading"), a]]);
  }, T = (a) => d.value = a;
  return b({ setData: (a) => {
    n.value.data = a, m("set-data-callback", a);
  }, setPagination: (a) => {
    var t;
    return n.value.pagination = Object.assign(((t = n.value) == null ? void 0 : t.pagination) ?? {}, a);
  }, setLoadingState: (a) => n.value.loading = a, setOptions: (a) => n.value = Object.assign(n.value, a), getOptions: () => n.value, setColumns: T, getColumns: () => d.value, appendColumn: (a) => d.value.push(a), removeColumn: (a) => T(d.value.filter((t) => t.prop !== a)), getColumnByProp: (a) => {
    var t;
    return ((t = d.value.filter((i) => i.prop === a)) == null ? void 0 : t[0]) ?? null;
  }, getElTableRef: () => L.value }), () => P.ssr ? w.value && x() : x();
} });
function _(r) {
  return new Promise(async (e, p) => {
    const m = getCurrentInstance();
    onMounted(async () => {
      if (m && m.refs[r]) {
        const b = m.refs[r];
        e({ ...b });
      } else p("[@mineadmin/table]: not found ref for ma-table component");
    });
  });
}
var g = { install(r, e) {
  r.component(k.name, k), r.provide("MaTableOptions", e ?? { ssr: false });
} };
export {
  g as MaTable,
  g as default,
  _ as useTable
};
//# sourceMappingURL=@mineadmin_table.js.map
