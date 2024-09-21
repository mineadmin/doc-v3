import {
  init_vue_runtime_esm_bundler,
  vue_runtime_esm_bundler_exports
} from "./chunk-74HL2VAL.js";
import {
  __commonJS,
  __toCommonJS
} from "./chunk-V4OQ3NZ2.js";

// node_modules/.pnpm/@imengyu+vue3-context-menu@1.4.2/node_modules/@imengyu/vue3-context-menu/lib/vue3-context-menu.umd.js
var require_vue3_context_menu_umd = __commonJS({
  "node_modules/.pnpm/@imengyu+vue3-context-menu@1.4.2/node_modules/@imengyu/vue3-context-menu/lib/vue3-context-menu.umd.js"(exports, module) {
    (function(R, e) {
      typeof exports == "object" && typeof module < "u" ? e(exports, (init_vue_runtime_esm_bundler(), __toCommonJS(vue_runtime_esm_bundler_exports))) : typeof define == "function" && define.amd ? define(["exports", "vue"], e) : (R = typeof globalThis < "u" ? globalThis : R || self, e(R["vue3-context-menu"] = {}, R.Vue));
    })(exports, function(R, e) {
      "use strict";
      let V = null;
      function Me() {
        return V !== null;
      }
      function ye(n) {
        V && ue(), V = n;
      }
      function ce(n) {
        n === V && (V = null);
      }
      function ue() {
        V && (V.closeMenu(), V = null);
      }
      const E = { defaultDirection: "br", defaultMinWidth: 100, defaultMaxWidth: 600, defaultZindex: 100, defaultZoom: 1, defaultAdjustPadding: { x: 0, y: 10 } };
      function F(n, t) {
        let r = n.offsetTop;
        return n.offsetParent != null && n.offsetParent != t && (r -= n.offsetParent.scrollTop, r += F(n.offsetParent, t)), r;
      }
      function L(n, t) {
        let r = n.offsetLeft;
        return n.offsetParent != null && n.offsetParent != t && (r -= n.offsetParent.scrollLeft, r += L(n.offsetParent, t)), r;
      }
      function Se(n, t, r, a) {
        return { x: L(n, a) + t, y: F(n, a) + r };
      }
      const oe = "mx-menu-default-container", xe = "mx-menu-container-";
      let Be = 0;
      function de(n) {
        const { getContainer: t, zIndex: r } = n;
        if (t) {
          const d = typeof t == "function" ? t() : t;
          if (d) {
            let f = d.getAttribute("id");
            return f || (f = xe + Be++, d.setAttribute("id", f)), { eleId: f, container: d, isNew: false };
          }
        }
        let a = document.getElementById(oe);
        return a || (a = document.createElement("div"), a.setAttribute("id", oe), a.setAttribute("class", "mx-menu-ghost-host fullscreen"), document.body.appendChild(a)), a.style.zIndex = (r == null ? void 0 : r.toString()) || E.defaultZindex.toString(), { eleId: oe, container: a, isNew: true };
      }
      function we(n) {
        return typeof n == "number" ? `${n}px` : n;
      }
      const A = e.defineComponent({ props: { vnode: { type: null }, data: { type: null, default: null } }, setup(n) {
        const { vnode: t, data: r } = e.toRefs(n);
        return () => typeof t.value == "function" ? t.value(r.value) : t.value;
      } }), U = (n, t) => {
        const r = n.__vccOpts || n;
        for (const [a, d] of t) r[a] = d;
        return r;
      }, Ie = {}, We = { class: "mx-checked-mark", "aria-hidden": "true", viewBox: "0 0 1024 1024" }, Pe = [e.createElementVNode("path", { d: "M129.3,428.6L52,512l345,372.5l575-620.8l-69.5-75L400.4,718.2L129.3,428.6z" }, null, -1)];
      function Oe(n, t) {
        return e.openBlock(), e.createElementBlock("svg", We, Pe);
      }
      const $e = U(Ie, [["render", Oe]]), Re = {}, Ee = { class: "mx-right-arrow", "aria-hidden": "true", viewBox: "0 0 1024 1024" }, ve = [e.createElementVNode("path", { d: "M307.018 49.445c11.517 0 23.032 4.394 31.819 13.18L756.404 480.18c8.439 8.438 13.181 19.885 13.181 31.82s-4.741 23.38-13.181 31.82L338.838 961.376c-17.574 17.573-46.065 17.573-63.64-0.001-17.573-17.573-17.573-46.065 0.001-63.64L660.944 512 275.198 126.265c-17.574-17.573-17.574-46.066-0.001-63.64C283.985 53.839 295.501 49.445 307.018 49.445z" }, null, -1)];
      function Ne(n, t) {
        return e.openBlock(), e.createElementBlock("svg", Ee, ve);
      }
      const fe = U(Re, [["render", Ne]]), je = { class: "mx-item-row" }, _e = ["xlink:href"], Ae = { key: 1, class: "label" }, He = { class: "mx-item-row" }, Ve = { class: "mx-shortcut" }, J = e.defineComponent({ __name: "ContextMenuItem", props: { disabled: { type: Boolean, default: false }, hidden: { type: Boolean, default: false }, customRender: { type: Function, default: null }, customClass: { type: String, default: "" }, clickHandler: { type: Function, default: null }, label: { type: [String, Object, Function], default: "" }, icon: { type: [String, Object, Function], default: "" }, iconFontClass: { type: String, default: "iconfont" }, checked: { type: Boolean, default: false }, shortcut: { type: String, default: "" }, svgIcon: { type: String, default: "" }, svgProps: { type: Object, default: null }, preserveIconWidth: { type: Boolean, default: true }, showRightArrow: { type: Boolean, default: false }, hasChildren: { type: Boolean, default: false }, clickClose: { type: Boolean, default: true }, clickableWhenHasChildren: { type: Boolean, default: false }, rawMenuItem: { type: Object, default: void 0 } }, emits: ["click", "subMenuOpen", "subMenuClose"], setup(n, { expose: t, emit: r }) {
        const a = n, d = r, { clickHandler: f, clickClose: y, clickableWhenHasChildren: i, disabled: p, hidden: g, label: o, icon: S, iconFontClass: I, showRightArrow: B, shortcut: v, hasChildren: $ } = e.toRefs(a), b = e.ref(false), l = e.ref(false), c = e.ref(), C = e.inject("globalOptions"), k = e.inject("globalHasSlot"), W = e.inject("globalRenderSlot"), u = e.inject("globalCloseMenu"), M = e.inject("menuContext"), w = { getSubMenuInstance: () => {
        }, showSubMenu: () => b.value ? (M.markActiveMenuItem(w, true), true) : $.value ? (_(), true) : false, hideSubMenu: () => {
          M.closeOtherSubMenu();
        }, isDisabledOrHidden: () => p.value || g.value, getElement: () => c.value, focus: () => l.value = true, blur: () => l.value = false, click: N };
        e.provide("menuItemInstance", w), e.onMounted(() => {
          M.isMenuItemDataCollectedFlag() ? e.nextTick(() => {
            let h = 0;
            const P = M.getElement();
            if (P) {
              let H = 0;
              for (let T = 0; T < P.children.length; T++) {
                const K = P.children[T];
                if (K.getAttribute("data-type") === "ContextMenuItem") {
                  if (K === c.value) {
                    h = H;
                    break;
                  }
                  H++;
                }
              }
            }
            M.addChildMenuItem(w, h);
          }) : M.addChildMenuItem(w);
        }), e.onBeforeUnmount(() => {
          M.removeChildMenuItem(w);
        });
        function N(h) {
          if (!p.value) {
            if (h) {
              const P = h.target;
              if (P.classList.contains("mx-context-no-clickable") || C.value.ignoreClickClassName && P.classList.contains(C.value.ignoreClickClassName)) return;
              if (C.value.clickCloseClassName && P.classList.contains(C.value.clickCloseClassName)) {
                h.stopPropagation(), u(a.rawMenuItem);
                return;
              }
            }
            $.value ? i.value ? (typeof f.value == "function" && f.value(h), d("click", h)) : b.value || _() : (typeof f.value == "function" && f.value(h), d("click", h), y.value && u(a.rawMenuItem));
          }
        }
        function _(h) {
          l.value = false, M.checkCloseOtherSubMenuTimeOut() || M.closeOtherSubMenu(), p.value || (M.markActiveMenuItem(w), $.value && (h || M.markThisOpenedByKeyBoard(), M.addOpenedSubMenu(z), b.value = true, e.nextTick(() => d("subMenuOpen", w))));
        }
        function z() {
          l.value = false, b.value = false, d("subMenuClose", w);
        }
        function O() {
          return { disabled: p.value, label: o.value, icon: S.value, iconFontClass: I.value, showRightArrow: B.value, clickClose: y.value, clickableWhenHasChildren: i.value, shortcut: v.value, theme: C.value.theme, isOpen: b, hasChildren: $, onClick: N, onMouseEnter: _, closeMenu: u };
        }
        return t(w), (h, P) => e.unref(g) ? e.createCommentVNode("", true) : (e.openBlock(), e.createElementBlock("div", { key: 0, class: "mx-context-menu-item-wrapper", ref_key: "menuItemRef", ref: c, "data-type": "ContextMenuItem" }, [e.unref(k)("itemRender") ? (e.openBlock(), e.createBlock(e.unref(A), { key: 0, vnode: () => e.unref(W)("itemRender", O()) }, null, 8, ["vnode"])) : n.customRender ? (e.openBlock(), e.createBlock(e.unref(A), { key: 1, vnode: n.customRender, data: O() }, null, 8, ["vnode", "data"])) : (e.openBlock(), e.createElementBlock("div", { key: 2, class: e.normalizeClass(["mx-context-menu-item", e.unref(p) ? "disabled" : "", l.value ? "keyboard-focus" : "", n.customClass ? " " + n.customClass : "", b.value ? "open" : ""]), onClick: N, onMouseenter: _ }, [e.renderSlot(h.$slots, "default", {}, () => [e.createElementVNode("div", je, [e.createElementVNode("div", { class: e.normalizeClass(["mx-icon-placeholder", n.preserveIconWidth ? "preserve-width" : ""]) }, [e.renderSlot(h.$slots, "icon", {}, () => [e.unref(k)("itemIconRender") ? (e.openBlock(), e.createBlock(e.unref(A), { key: 0, vnode: () => e.unref(W)("itemIconRender", O()) }, null, 8, ["vnode"])) : typeof n.svgIcon == "string" && n.svgIcon ? (e.openBlock(), e.createElementBlock("svg", e.mergeProps({ key: 1, class: "icon svg" }, n.svgProps), [e.createElementVNode("use", { "xlink:href": n.svgIcon }, null, 8, _e)], 16)) : typeof e.unref(S) != "string" ? (e.openBlock(), e.createBlock(e.unref(A), { key: 2, vnode: e.unref(S), data: e.unref(S) }, null, 8, ["vnode", "data"])) : typeof e.unref(S) == "string" && e.unref(S) !== "" ? (e.openBlock(), e.createElementBlock("i", { key: 3, class: e.normalizeClass(e.unref(S) + " icon " + e.unref(I) + " " + e.unref(C).iconFontClass) }, null, 2)) : e.createCommentVNode("", true)]), n.checked ? e.renderSlot(h.$slots, "check", { key: 0 }, () => [e.unref(k)("itemCheckRender") ? (e.openBlock(), e.createBlock(e.unref(A), { key: 0, vnode: () => e.unref(W)("itemCheckRender", O()) }, null, 8, ["vnode"])) : e.createCommentVNode("", true), e.createVNode($e)]) : e.createCommentVNode("", true)], 2), e.renderSlot(h.$slots, "label", {}, () => [e.unref(k)("itemLabelRender") ? (e.openBlock(), e.createBlock(e.unref(A), { key: 0, vnode: () => e.unref(W)("itemLabelRender", O()) }, null, 8, ["vnode"])) : typeof e.unref(o) == "string" ? (e.openBlock(), e.createElementBlock("span", Ae, e.toDisplayString(e.unref(o)), 1)) : (e.openBlock(), e.createBlock(e.unref(A), { key: 2, vnode: e.unref(o), data: e.unref(o) }, null, 8, ["vnode", "data"]))])]), e.createElementVNode("div", He, [e.unref(v) ? e.renderSlot(h.$slots, "shortcut", { key: 0 }, () => [e.unref(k)("itemShortcutRender") ? (e.openBlock(), e.createBlock(e.unref(A), { key: 0, vnode: () => e.unref(W)("itemShortcutRender", O()) }, null, 8, ["vnode"])) : e.createCommentVNode("", true), e.createElementVNode("span", Ve, e.toDisplayString(e.unref(v)), 1)]) : e.createCommentVNode("", true), e.unref(B) ? e.renderSlot(h.$slots, "rightArrow", { key: 1 }, () => [e.unref(k)("itemRightArrowRender") ? (e.openBlock(), e.createBlock(e.unref(A), { key: 0, vnode: () => e.unref(W)("itemRightArrowRender", O()) }, null, 8, ["vnode"])) : e.createCommentVNode("", true), e.createVNode(fe)]) : e.createCommentVNode("", true)])])], 34)), e.unref(C).menuTransitionProps ? (e.openBlock(), e.createBlock(e.Transition, e.normalizeProps(e.mergeProps({ key: 3 }, e.unref(C).menuTransitionProps)), { default: e.withCtx(() => [b.value ? e.renderSlot(h.$slots, "submenu", { key: 0 }) : e.createCommentVNode("", true)]), _: 3 }, 16)) : b.value ? e.renderSlot(h.$slots, "submenu", { key: 4 }) : e.createCommentVNode("", true)], 512));
      } }), Fe = e.defineComponent({ name: "ContextMenuSperator", components: { VNodeRender: A }, setup() {
        const n = e.inject("globalHasSlot"), t = e.inject("globalRenderSlot");
        return { globalHasSlot: n, globalRenderSlot: t };
      } }), Le = { key: 1, class: "mx-context-menu-item-sperator mx-context-no-clickable" };
      function Te(n, t, r, a, d, f) {
        const y = e.resolveComponent("VNodeRender");
        return n.globalHasSlot("separatorRender") ? (e.openBlock(), e.createBlock(y, { key: 0, vnode: () => n.globalRenderSlot("separatorRender", {}) }, null, 8, ["vnode"])) : (e.openBlock(), e.createElementBlock("div", Le));
      }
      const Q = U(Fe, [["render", Te]]), De = e.defineComponent({ name: "ContextSubMenu", components: { ContextMenuItem: J, ContextMenuSeparator: Q, ContextMenuIconRight: fe }, props: { items: { type: Object, default: null }, maxWidth: { type: [String, Number], default: 0 }, minWidth: { type: [String, Number], default: 0 }, adjustPosition: { type: Boolean, default: true }, direction: { type: String, default: "br" } }, setup(n) {
        const t = e.inject("menuContext"), r = e.inject("globalOptions"), a = e.inject("globalHasSlot"), d = e.inject("globalRenderSlot"), { zIndex: f, getParentWidth: y, getParentHeight: i, getZoom: p } = t, { adjustPosition: g } = e.toRefs(n), o = e.ref(), S = e.ref(), I = e.ref(), B = e.ref(), v = [], $ = e.inject("globalSetCurrentSubMenu"), b = [];
        let l = null, c = 0;
        function C() {
          l && l.blur();
        }
        function k(s, m) {
          if (s) {
            for (let j = m !== void 0 ? m : 0; j < b.length; j++) if (!b[j].isDisabledOrHidden()) {
              W(j);
              break;
            }
          } else for (let j = m !== void 0 ? m : b.length - 1; j >= 0; j--) if (!b[j].isDisabledOrHidden()) {
            W(j);
            break;
          }
        }
        function W(s) {
          if (l && C(), s !== void 0 && (l = b[Math.max(0, Math.min(s, b.length - 1))]), !!l && (l.focus(), Y.value)) {
            const m = l.getElement();
            m && (h.value = Math.min(Math.max(-P.value, -m.offsetTop - m.offsetHeight + D.value), 0));
          }
        }
        function u() {
          $(M);
        }
        const M = { isTopLevel: () => t.getParentContext() === null, closeSelfAndActiveParent: () => {
          const s = _.getParentContext();
          if (s) {
            s.closeOtherSubMenu();
            const m = s.getSubMenuInstanceContext();
            if (m) return m.focusCurrentItem(), true;
          }
          return false;
        }, closeCurrentSubMenu: () => {
          var s;
          return (s = _.getParentContext()) == null ? void 0 : s.closeOtherSubMenu();
        }, moveCurrentItemFirst: () => k(true), moveCurrentItemLast: () => k(false), moveCurrentItemDown: () => k(true, l ? b.indexOf(l) + 1 : 0), moveCurrentItemUp: () => k(false, l ? b.indexOf(l) - 1 : 0), focusCurrentItem: () => W(), openCurrentItemSubMenu: () => l ? l == null ? void 0 : l.showSubMenu() : false, triggerCurrentItemClick: (s) => l == null ? void 0 : l.click(s) };
        let w = false, N = false;
        const _ = { zIndex: f + 1, container: t.container, adjustPadding: r.value.adjustPadding || E.defaultAdjustPadding, getParentWidth: () => {
          var s;
          return ((s = S.value) == null ? void 0 : s.offsetWidth) || 0;
        }, getParentHeight: () => {
          var s;
          return ((s = S.value) == null ? void 0 : s.offsetHeight) || 0;
        }, getParentX: () => x.value.x, getParentY: () => x.value.y, getParentAbsX: () => S.value ? L(S.value, t.container) : 0, getParentAbsY: () => S.value ? F(S.value, t.container) : 0, getPositon: () => [0, 0], getZoom: () => r.value.zoom || E.defaultZoom, addOpenedSubMenu(s) {
          v.push(s);
        }, closeOtherSubMenu() {
          v.forEach((s) => s()), v.splice(0, v.length), $(M);
        }, checkCloseOtherSubMenuTimeOut() {
          return c ? (clearTimeout(c), c = 0, true) : false;
        }, closeOtherSubMenuWithTimeOut() {
          c = setTimeout(() => {
            c = 0, this.closeOtherSubMenu();
          }, 200);
        }, addChildMenuItem: (s, m) => {
          m === void 0 ? b.push(s) : b.splice(m, 0, s);
        }, removeChildMenuItem: (s) => {
          b.splice(b.indexOf(s), 1), s.getSubMenuInstance = () => {
          };
        }, markActiveMenuItem: (s, m = false) => {
          C(), l = s, m && W();
        }, markThisOpenedByKeyBoard: () => {
          w = true;
        }, isOpenedByKeyBoardFlag: () => w ? (w = false, true) : false, isMenuItemDataCollectedFlag: () => N, getElement: () => S.value || null, getParentContext: () => t, getSubMenuInstanceContext: () => M };
        e.provide("menuContext", _);
        const z = { getChildItem: (s) => b[s], getMenuDimensions: () => o.value ? { width: o.value.offsetWidth, height: o.value.offsetHeight } : { width: 0, height: 0 }, getSubmenuRoot: () => o.value, getMenu: () => S.value, getScrollValue: () => h.value, setScrollValue: (s) => h.value = s, getScrollHeight: () => P.value, getMaxHeight: () => D.value, getPosition: () => x.value, setPosition: (s, m) => {
          x.value.x = s, x.value.y = m;
        } }, O = e.inject("menuItemInstance", void 0);
        O && (O.getSubMenuInstance = () => z);
        const h = e.ref(0), P = e.ref(0);
        function H(s) {
          s ? h.value = Math.min(Math.max(h.value - 50, -P.value), 0) : h.value = Math.min(h.value + 50, 0);
        }
        function T(s) {
          s.preventDefault(), s.stopPropagation(), H(s.deltaY > 0);
        }
        function K(s) {
          r.value.mouseScroll && (s.preventDefault(), s.stopPropagation(), H(s.deltaY > 0));
        }
        const Y = e.ref(false), x = e.ref({ x: 0, y: 0 }), D = e.ref(0);
        return e.onMounted(() => {
          const s = t.getPositon();
          x.value = { x: (s[0] ?? r.value.xOffset ?? 0) / p(), y: (s[1] ?? r.value.yOffset ?? 0) / p() }, $(M), e.nextTick(() => {
            var j, ge;
            const m = S.value;
            if (m && I.value) {
              const { container: Z } = t, se = (y == null ? void 0 : y()) ?? 0, ke = (i == null ? void 0 : i()) ?? 0, ne = typeof t.adjustPadding == "number" ? t.adjustPadding : ((j = t.adjustPadding) == null ? void 0 : j.x) ?? 0, te = typeof t.adjustPadding == "number" ? t.adjustPadding : ((ge = t.adjustPadding) == null ? void 0 : ge.y) ?? 0, X = ke > 0 ? te : 0, on = document.documentElement.scrollHeight / p(), ln = document.documentElement.scrollWidth / p(), sn = Math.min(ln, Z.offsetWidth), re = Math.min(on, Z.offsetHeight);
              let ie = L(m, Z), ae = F(m, Z);
              n.direction.includes("l") ? x.value.x -= m.offsetWidth + ne : n.direction.includes("r") ? x.value.x += se + ne : (x.value.x += se / 2, x.value.x -= (m.offsetWidth + ne) / 2), n.direction.includes("t") ? x.value.y -= (m.offsetHeight + te * 2) / p() : n.direction.includes("b") ? x.value.y -= te / p() : (x.value.y += ke / 2 / p(), x.value.y -= (m.offsetHeight + te) / 2 / p()), g.value && e.nextTick(() => {
                ie = L(m, Z), ae = F(m, Z);
                const rn = ie + m.offsetWidth - sn, be = ae + m.offsetHeight + X * 2 - re;
                if (Y.value = be > 0, P.value = m.offsetHeight - re + X * 2, rn > 0) {
                  const G = se + m.offsetWidth - ne, q = ie;
                  G > q ? x.value.x -= q : x.value.x -= G;
                }
                if (Y.value) {
                  const G = be, q = ae;
                  G > q ? x.value.y -= q - X : x.value.y -= G - X, D.value = re - X * 2;
                } else D.value = 0;
              });
            }
            m == null || m.focus({ preventScroll: true }), t.isOpenedByKeyBoardFlag() && k(true), N = true;
          });
        }), e.onBeforeUnmount(() => {
          O && (O.getSubMenuInstance = () => {
          });
        }), { submenuRoot: o, menu: S, scroll: I, options: r, zIndex: f, constOptions: E, scrollValue: h, upScrollButton: B, overflow: Y, position: x, scrollHeight: P, maxHeight: D, ...z, globalHasSlot: a, globalRenderSlot: d, onScroll: H, onSubMenuBodyClick: u, onMouseWhell: K, onMouseWhellMx: T, solveNumberOrStringSize: we };
      } }), un = "", ze = { key: 0, class: "mx-context-menu-updown placeholder" }, Ke = { key: 1, class: "mx-context-menu-updown placeholder" }, Ye = { class: "mx-context-menu-scroll", ref: "scroll" };
      function Ze(n, t, r, a, d, f) {
        const y = e.resolveComponent("ContextMenuSeparator"), i = e.resolveComponent("ContextSubMenu", true), p = e.resolveComponent("ContextMenuItem"), g = e.resolveComponent("ContextMenuIconRight");
        return e.openBlock(), e.createElementBlock("div", { ref: "submenuRoot", class: e.normalizeClass(["mx-context-menu", n.options.customClass ? n.options.customClass : "", n.options.theme ?? ""]), style: e.normalizeStyle({ maxWidth: n.maxWidth ? n.solveNumberOrStringSize(n.maxWidth) : `${n.constOptions.defaultMaxWidth}px`, minWidth: n.minWidth ? n.solveNumberOrStringSize(n.minWidth) : `${n.constOptions.defaultMinWidth}px`, maxHeight: n.overflow && n.maxHeight > 0 ? `${n.maxHeight}px` : void 0, zIndex: n.zIndex, left: `${n.position.x}px`, top: `${n.position.y}px` }), "data-type": "ContextSubMenu", onClick: t[4] || (t[4] = (...o) => n.onSubMenuBodyClick && n.onSubMenuBodyClick(...o)), onWheel: t[5] || (t[5] = (...o) => n.onMouseWhell && n.onMouseWhell(...o)) }, [e.createElementVNode("div", { class: e.normalizeClass(["mx-context-menu-items"]), ref: "menu", style: e.normalizeStyle({ top: `${n.scrollValue}px` }) }, [e.renderSlot(n.$slots, "default", {}, () => [n.overflow && n.options.updownButtonSpaceholder ? (e.openBlock(), e.createElementBlock("div", ze)) : e.createCommentVNode("", true), (e.openBlock(true), e.createElementBlock(e.Fragment, null, e.renderList(n.items, (o, S) => (e.openBlock(), e.createElementBlock(e.Fragment, { key: S }, [o.hidden !== true && o.divided === "up" ? (e.openBlock(), e.createBlock(y, { key: 0 })) : e.createCommentVNode("", true), o.hidden !== true && o.divided === "self" ? (e.openBlock(), e.createBlock(y, { key: 1 })) : (e.openBlock(), e.createBlock(p, { key: 2, clickHandler: o.onClick ? (I) => o.onClick(I) : void 0, disabled: o.disabled, hidden: o.hidden, icon: o.icon, iconFontClass: o.iconFontClass, svgIcon: o.svgIcon, svgProps: o.svgProps, label: o.label, customRender: o.customRender, customClass: o.customClass, checked: o.checked, shortcut: o.shortcut, clickClose: o.clickClose, clickableWhenHasChildren: o.clickableWhenHasChildren, preserveIconWidth: o.preserveIconWidth !== void 0 ? o.preserveIconWidth : n.options.preserveIconWidth, showRightArrow: o.children && o.children.length > 0, hasChildren: o.children && o.children.length > 0, rawMenuItem: o, onSubMenuOpen: (I) => {
          var B;
          return (B = o.onSubMenuOpen) == null ? void 0 : B.call(o, I);
        }, onSubMenuClose: (I) => {
          var B;
          return (B = o.onSubMenuClose) == null ? void 0 : B.call(o, I);
        } }, e.createSlots({ _: 2 }, [o.children && o.children.length > 0 ? { name: "submenu", fn: e.withCtx(() => [e.createVNode(i, { items: o.children, maxWidth: o.maxWidth, minWidth: o.minWidth, adjustPosition: o.adjustSubMenuPosition !== void 0 ? o.adjustSubMenuPosition : n.options.adjustPosition, direction: o.direction !== void 0 ? o.direction : n.options.direction }, null, 8, ["items", "maxWidth", "minWidth", "adjustPosition", "direction"])]), key: "0" } : void 0]), 1032, ["clickHandler", "disabled", "hidden", "icon", "iconFontClass", "svgIcon", "svgProps", "label", "customRender", "customClass", "checked", "shortcut", "clickClose", "clickableWhenHasChildren", "preserveIconWidth", "showRightArrow", "hasChildren", "rawMenuItem", "onSubMenuOpen", "onSubMenuClose"])), o.hidden !== true && (o.divided === "down" || o.divided === true) ? (e.openBlock(), e.createBlock(y, { key: 3 })) : e.createCommentVNode("", true)], 64))), 128)), n.overflow && n.options.updownButtonSpaceholder ? (e.openBlock(), e.createElementBlock("div", Ke)) : e.createCommentVNode("", true)])], 4), e.createElementVNode("div", Ye, [e.withDirectives(e.createElementVNode("div", { ref: "upScrollButton", class: e.normalizeClass("mx-context-menu-updown mx-context-no-clickable up" + (n.overflow && n.scrollValue < 0 ? "" : " disabled")), onClick: t[0] || (t[0] = (o) => n.onScroll(false)), onWheel: t[1] || (t[1] = (...o) => n.onMouseWhellMx && n.onMouseWhellMx(...o)) }, [e.createVNode(g)], 34), [[e.vShow, n.overflow]]), e.withDirectives(e.createElementVNode("div", { class: e.normalizeClass("mx-context-menu-updown mx-context-no-clickable down" + (n.overflow && n.scrollValue > -n.scrollHeight ? "" : " disabled")), onClick: t[2] || (t[2] = (o) => n.onScroll(true)), onWheel: t[3] || (t[3] = (...o) => n.onMouseWhellMx && n.onMouseWhellMx(...o)) }, [e.createVNode(g)], 34), [[e.vShow, n.overflow]])], 512)], 38);
      }
      const ee = U(De, [["render", Ze]]), Ue = { class: "mx-menu-ghost-host" }, me = e.defineComponent({ __name: "ContextSubMenuWrapper", props: { options: { type: Object, default: null }, show: { type: Object, default: null }, container: { type: Object, default: null }, isFullScreenContainer: { type: Boolean, default: true } }, emits: ["close", "closeAnimFinished"], setup(n, { expose: t, emit: r }) {
        const a = n, d = r, f = e.useSlots(), y = e.ref(), { options: i, show: p, container: g } = e.toRefs(a);
        e.onMounted(() => {
          p.value && I();
        }), e.onBeforeUnmount(() => {
          b();
        }), e.watch(p, (u) => {
          u ? I() : (ce(o), b());
        });
        const o = { closeMenu: B, isClosed: v, getMenuRef: () => y.value, getMenuDimensions: () => {
          var u;
          return ((u = y.value) == null ? void 0 : u.getMenuDimensions()) ?? { width: 0, height: 0 };
        } };
        let S = false;
        function I() {
          $(), ye(o);
        }
        function B(u) {
          S = true, d("close", u), i.value.menuTransitionProps || d("closeAnimFinished"), ce(o);
        }
        function v() {
          return S;
        }
        function $() {
          setTimeout(() => {
            document.addEventListener("click", k, true), document.addEventListener("contextmenu", k, true), document.addEventListener("scroll", C, true), !a.isFullScreenContainer && g.value && g.value.addEventListener("scroll", C, true), i.value.keyboardControl !== false && document.addEventListener("keydown", c);
          }, 50);
        }
        function b() {
          document.removeEventListener("contextmenu", k, true), document.removeEventListener("click", k, true), document.removeEventListener("scroll", C, true), !a.isFullScreenContainer && g.value && g.value.removeEventListener("scroll", C, true), i.value.keyboardControl !== false && document.removeEventListener("keydown", c);
        }
        const l = e.ref();
        e.provide("globalSetCurrentSubMenu", (u) => l.value = u);
        function c(u) {
          var w, N, _, z, O, h, P, H, T, K, Y, x, D;
          let M = true;
          switch (u.key) {
            case "Escape": {
              ((w = l.value) == null ? void 0 : w.isTopLevel()) === false ? (N = l.value) == null || N.closeCurrentSubMenu() : B();
              break;
            }
            case "ArrowDown":
              (_ = l.value) == null || _.moveCurrentItemDown();
              break;
            case "ArrowUp":
              (z = l.value) == null || z.moveCurrentItemUp();
              break;
            case "Home":
              (O = l.value) == null || O.moveCurrentItemFirst();
              break;
            case "End":
              (h = l.value) == null || h.moveCurrentItemLast();
              break;
            case "ArrowLeft": {
              (P = l.value) != null && P.closeSelfAndActiveParent() || (T = (H = i.value).onKeyFocusMoveLeft) == null || T.call(H);
              break;
            }
            case "ArrowRight":
              (K = l.value) != null && K.openCurrentItemSubMenu() || (x = (Y = i.value).onKeyFocusMoveRight) == null || x.call(Y);
              break;
            case "Enter":
              (D = l.value) == null || D.triggerCurrentItemClick(u);
              break;
            default:
              M = false;
              break;
          }
          M && l.value && (u.stopPropagation(), u.preventDefault());
        }
        function C() {
          i.value.closeWhenScroll !== false && B();
        }
        function k(u) {
          W(u.target, u);
        }
        function W(u, M) {
          var w, N;
          for (; u; ) {
            if (u.classList && u.classList.contains("mx-menu-host")) return;
            u = u.parentNode;
          }
          i.value.clickCloseOnOutside !== false ? (b(), B()) : (N = (w = i.value).onClickOnOutside) == null || N.call(w, M);
        }
        return e.provide("globalOptions", i), e.provide("globalCloseMenu", B), e.provide("globalIsFullScreenContainer", a.isFullScreenContainer), e.provide("globalHasSlot", (u) => f[u] !== void 0), e.provide("globalRenderSlot", (u, M) => e.renderSlot(f, u, { ...M }, () => [e.h("span", "Render slot failed")], false)), e.provide("menuContext", { zIndex: i.value.zIndex || E.defaultZindex, container: g.value, adjustPadding: { x: 0, y: 0 }, getParentAbsY: () => i.value.x, getParentAbsX: () => i.value.y, getZoom: () => i.value.zoom || E.defaultZoom, getParentX: () => 0, getParentY: () => 0, getParentWidth: () => 0, getParentHeight: () => 0, getPositon: () => [i.value.x, i.value.y], closeOtherSubMenuWithTimeOut: () => {
        }, checkCloseOtherSubMenuTimeOut: () => false, addOpenedSubMenu: () => {
        }, closeOtherSubMenu: () => {
        }, getParentContext: () => null, getSubMenuInstanceContext: () => null, getElement: () => null, addChildMenuItem: () => {
        }, removeChildMenuItem: () => {
        }, markActiveMenuItem: () => {
        }, markThisOpenedByKeyBoard: () => {
        }, isOpenedByKeyBoardFlag: () => false, isMenuItemDataCollectedFlag: () => false }), t(o), (u, M) => (e.openBlock(), e.createElementBlock("div", Ue, [e.unref(i).menuTransitionProps ? (e.openBlock(), e.createBlock(e.Transition, e.mergeProps({ key: 0, appear: "" }, e.unref(i).menuTransitionProps, { onAfterLeave: M[0] || (M[0] = (w) => d("closeAnimFinished")) }), { default: e.withCtx(() => [e.unref(p) ? (e.openBlock(), e.createBlock(ee, { key: 0, ref_key: "submenuInstance", ref: y, class: "mx-menu-host", items: e.unref(i).items, adjustPosition: e.unref(i).adjustPosition, maxWidth: e.unref(i).maxWidth || e.unref(E).defaultMaxWidth, minWidth: e.unref(i).minWidth || e.unref(E).defaultMinWidth, direction: e.unref(i).direction || e.unref(E).defaultDirection }, { default: e.withCtx(() => [e.renderSlot(u.$slots, "default")]), _: 3 }, 8, ["items", "adjustPosition", "maxWidth", "minWidth", "direction"])) : e.createCommentVNode("", true)]), _: 3 }, 16)) : e.unref(p) ? (e.openBlock(), e.createBlock(ee, { key: 1, ref_key: "submenuInstance", ref: y, class: "mx-menu-host", items: e.unref(i).items, adjustPosition: e.unref(i).adjustPosition, maxWidth: e.unref(i).maxWidth || e.unref(E).defaultMaxWidth, minWidth: e.unref(i).minWidth || e.unref(E).defaultMinWidth, direction: e.unref(i).direction || e.unref(E).defaultDirection }, { default: e.withCtx(() => [e.renderSlot(u.$slots, "default")]), _: 3 }, 8, ["items", "adjustPosition", "maxWidth", "minWidth", "direction"])) : e.createCommentVNode("", true)]));
      } }), dn = "", he = e.defineComponent({ name: "ContextMenu", emits: ["update:show", "close"], props: { options: { type: Object, default: null }, show: { type: Boolean, default: false } }, setup(n, t) {
        const { options: r, show: a } = e.toRefs(n), d = e.ref(null);
        return t.expose({ closeMenu: () => t.emit("update:show", false), isClosed: () => !a.value, getMenuRef: () => {
          var f;
          return (f = d.value) == null ? void 0 : f.getMenuRef();
        }, getMenuDimensions: () => {
          var f;
          return ((f = d.value) == null ? void 0 : f.getMenuDimensions()) ?? { width: 0, height: 0 };
        } }), () => {
          const { isNew: f, container: y, eleId: i } = de(r.value);
          return [e.h(e.Teleport, { to: `#${i}` }, [e.h(me, { ref: d, options: r, show: a, container: y, isFullScreenContainer: !f, onClose: (p) => {
            var g, o;
            t.emit("update:show", false), t.emit("close"), (o = (g = r.value).onClose) == null || o.call(g, p);
          } }, t.slots)])];
        };
      } }), pe = e.defineComponent({ name: "ContextMenuGroup", props: { disabled: { type: Boolean, default: false }, hidden: { type: Boolean, default: false }, clickHandler: { type: Function, default: null }, label: { type: String, default: "" }, icon: { type: String, default: "" }, iconFontClass: { type: String, default: "iconfont" }, checked: { type: Boolean, default: false }, shortcut: { type: String, default: "" }, svgIcon: { type: String, default: "" }, svgProps: { type: Object, default: null }, preserveIconWidth: { type: Boolean, default: true }, showRightArrow: { type: Boolean, default: false }, clickClose: { type: Boolean, default: true }, adjustSubMenuPosition: { type: Boolean, default: void 0 }, maxWidth: { type: [String, Number], default: 0 }, minWidth: { type: [String, Number], default: 0 } }, setup(n, t) {
        const r = e.inject("globalOptions"), { adjustSubMenuPosition: a, maxWidth: d, minWidth: f } = e.toRefs(n), y = typeof a.value < "u" ? a.value : r.value.adjustPosition, i = e.ref(), p = e.ref();
        return t.expose({ getSubMenuRef: () => i.value, getMenuItemRef: () => p.value }), () => e.h(J, { ...n, ref: p, showRightArrow: true, maxWidth: void 0, minWidth: void 0, adjustSubMenuPosition: void 0, hasChildren: typeof t.slots.default !== void 0 }, t.slots.default ? { submenu: () => e.h(ee, { ref: i, maxWidth: d.value, minWidth: f.value, adjustPosition: y }, { default: t.slots.default }) } : void 0);
      } });
      function Xe(n, t, r, a) {
        const d = e.ref(true), f = e.h(me, { options: n, show: d, container: t, isFullScreenContainer: !r, onCloseAnimFinished: () => {
          e.render(null, t);
        }, onClose: (y) => {
          var i;
          (i = n.onClose) == null || i.call(n, y), d.value = false;
        } }, a);
        return e.render(f, t), f.component;
      }
      function Ce(n, t) {
        const r = de(n);
        return Xe(n, r.container, r.isNew, t).exposed;
      }
      const le = { install(n) {
        n.config.globalProperties.$contextmenu = Ce, n.component("ContextMenu", he), n.component("ContextMenuItem", J), n.component("ContextMenuGroup", pe), n.component("ContextMenuSperator", Q), n.component("ContextMenuSeparator", Q), n.component("ContextSubMenu", ee);
      }, showContextMenu(n, t) {
        return Ce(n, t);
      }, isAnyContextMenuOpen() {
        return Me();
      }, closeContextMenu: ue, transformMenuPosition: Se }, Ge = {}, qe = { class: "mx-menu-bar-icon-menu", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "200", height: "200" }, Je = [e.createElementVNode("path", { d: "M133.310936 296.552327l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949 0-19.781623-15.997312-35.950949-35.950949-35.950949L133.310936 224.650428c-19.781623 0-35.950949 16.169326-35.950949 35.950949C97.359987 280.383 113.529313 296.552327 133.310936 296.552327z" }, null, -1), e.createElementVNode("path", { d: "M890.51705 476.135058 133.310936 476.135058c-19.781623 0-35.950949 16.169326-35.950949 35.950949 0 19.781623 16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949C926.467999 492.304384 910.298673 476.135058 890.51705 476.135058z" }, null, -1), e.createElementVNode("path", { d: "M890.51705 727.447673 133.310936 727.447673c-19.781623 0-35.950949 15.997312-35.950949 35.950949s16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-15.997312 35.950949-35.950949S910.298673 727.447673 890.51705 727.447673z" }, null, -1)];
      function Qe(n, t) {
        return e.openBlock(), e.createElementBlock("svg", qe, Je);
      }
      const en = U(Ge, [["render", Qe]]), nn = ["onClick", "onMouseenter"], tn = e.defineComponent({ __name: "MenuBar", props: { options: { type: Object, default: null } }, setup(n) {
        const t = n, r = e.ref(), a = e.ref(false), d = e.ref([]), f = e.ref(null);
        function y() {
          a.value = true;
        }
        function i() {
          a.value = false;
        }
        e.onMounted(() => {
          d.value = t.options.items || [];
        }), e.watch(() => t.options, () => {
          d.value = t.options.items || [];
        });
        let p = null, g = -1;
        function o() {
          g < d.value.length - 1 ? g++ : g = 0, B(g, d.value[g]);
        }
        function S() {
          g > 0 ? g-- : g = d.value.length - 1, B(g, d.value[g]);
        }
        function I(l) {
          const c = t.options.barPopDirection ?? "bl";
          let C = 0, k = 0;
          return c.startsWith("b") ? k = F(l) + l.offsetHeight : c.startsWith("t") ? k = F(l) : k = F(l) + l.offsetHeight / 2, c.endsWith("l") ? C = L(l) : c.startsWith("r") ? C = L(l) + l.offsetWidth : C = L(l) + l.offsetWidth / 2, { x: C, y: k };
        }
        function B(l, c) {
          var k;
          if (g = l, !c.children) return;
          p && (p.closeMenu(), p = null, a.value = true), f.value = c;
          const C = (k = r.value) == null ? void 0 : k.children[l];
          if (C) {
            const { x: W, y: u } = I(C);
            p = le.showContextMenu({ ...t.options, items: c.children, x: W, y: u, onKeyFocusMoveLeft() {
              S();
            }, onKeyFocusMoveRight() {
              o();
            }, onClose() {
              f.value == c && (a.value = false, f.value = null);
            } });
          }
        }
        function v() {
          g = 0;
          const l = r.value;
          if (l) {
            const { x: c, y: C } = I(l);
            p = le.showContextMenu({ ...t.options, x: c, y: C });
          }
        }
        function $(l, c) {
          c ? (a.value = true, B(l, c), c.onClick && (c.clickableWhenHasChildren === true && c.children && c.children.length > 0 || !c.children || c.children.length === 0) && c.onClick()) : v();
        }
        function b(l, c) {
          a.value && B(l, c);
        }
        return (l, c) => (e.openBlock(), e.createElementBlock("div", { class: e.normalizeClass(["mx-menu-bar", n.options.theme ?? "", n.options.mini ? "mini" : ""]), onFocus: y, onBlur: i }, [e.renderSlot(l.$slots, "prefix"), n.options.mini ? (e.openBlock(), e.createElementBlock("div", { key: 0, ref_key: "menuBarContent", ref: r, class: "mx-menu-bar-content" }, [e.createElementVNode("div", { class: "mx-menu-bar-item", onClick: c[0] || (c[0] = (C) => $(0, null)) }, [e.createVNode(en)])], 512)) : (e.openBlock(), e.createElementBlock("div", { key: 1, ref_key: "menuBarContent", ref: r, class: "mx-menu-bar-content" }, [(e.openBlock(true), e.createElementBlock(e.Fragment, null, e.renderList(d.value, (C, k) => (e.openBlock(), e.createElementBlock("div", { key: k, class: e.normalizeClass(["mx-menu-bar-item", C == f.value ? "active" : ""]), onClick: (W) => $(k, C), onMouseenter: (W) => b(k, C) }, e.toDisplayString(C.label), 43, nn))), 128))], 512)), e.renderSlot(l.$slots, "suffix")], 34));
      } }), pn = "";
      R.ContextMenu = he, R.ContextMenuGroup = pe, R.ContextMenuItem = J, R.ContextMenuSeparator = Q, R.MenuBar = tn, R.default = le, Object.defineProperties(R, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
    });
  }
});
export default require_vue3_context_menu_umd();
//# sourceMappingURL=@imengyu_vue3-context-menu.js.map
