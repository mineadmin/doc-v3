import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"MineAdmin Doc V3.0","text":"MineAdmin use manual and develop document","tagline":"My great project tagline","images":{"src":"https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp","alt":"VitePress"},"actions":[{"theme":"brand","text":"Markdown Examples","link":"/markdown-examples"},{"theme":"alt","text":"API Examples","link":"/api-examples"}]},"features":[{"title":"Feature A","details":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"},{"title":"Feature B","details":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"},{"title":"Feature C","details":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
