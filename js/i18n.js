/* ─────────────────────────────────────────
   GÜTE — client-side i18n
   Two translation channels:
   1) TEXT NODES  — simple strings looked up in window.GUTE_I18N by
      their exact English text (nav, headings, teasers, form, etc.).
   2) RICH BLOCKS — any element with data-i18n="key" has its full
      innerHTML swapped from window.GUTE_I18N[key][lang]. Use this for
      paragraphs that contain <strong>, <sup> citations, etc., where the
      whole block must be translated as a unit (word order + markup).
   English is the source of truth in the HTML.
   lang codes: en · es · zh-hans · zh-hant
   ───────────────────────────────────────── */
(function () {
  var DICT = window.GUTE_I18N || {};
  var LANGS = { "en": "en", "es": "es", "zh-hans": "zh-Hans", "zh-hant": "zh-Hant" };
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, SELECT: 1, OPTION: 1, TEXTAREA: 1 };

  var nodes = [];   // { node, raw }
  var phs = [];     // { el, raw }
  var blocks = [];  // { el, orig, key }
  var collected = false;

  function collect() {
    // 1) rich blocks
    var bel = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < bel.length; i++) {
      blocks.push({ el: bel[i], orig: bel[i].innerHTML, key: bel[i].getAttribute("data-i18n") });
    }
    // 2) simple text nodes (skip anything inside a data-i18n block, and skip tags)
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        if (p && SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (n.parentElement && n.parentElement.closest("[data-i18n]")) return NodeFilter.FILTER_REJECT;
        return DICT[n.nodeValue.trim()] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var t; while ((t = walker.nextNode())) nodes.push({ node: t, raw: t.nodeValue });
    // 3) placeholders
    var pel = document.querySelectorAll("[placeholder]");
    for (var j = 0; j < pel.length; j++) {
      var ph = pel[j].getAttribute("placeholder");
      if (ph && DICT[ph.trim()]) phs.push({ el: pel[j], raw: ph });
    }
    collected = true;
  }

  function trText(raw, lang) {
    if (lang === "en") return raw;
    var s = raw.trim(), e = DICT[s], v = e && e[lang];
    if (v == null) return raw;
    var i = raw.indexOf(s);
    return raw.slice(0, i) + v + raw.slice(i + s.length);
  }

  function ensureCJK() {
    if (document.getElementById("gute-cjk")) return;
    var l = document.createElement("link");
    l.id = "gute-cjk"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap";
    document.head.appendChild(l);
  }

  function apply(lang) {
    if (!LANGS[lang]) lang = "en";
    if (!collected) collect();
    if (lang.indexOf("zh") === 0) ensureCJK();

    for (var b = 0; b < blocks.length; b++) {
      var o = blocks[b];
      if (lang === "en") { o.el.innerHTML = o.orig; continue; }
      var entry = DICT[o.key], val = entry && entry[lang];
      o.el.innerHTML = (val != null) ? val : o.orig;
    }
    for (var i = 0; i < nodes.length; i++) nodes[i].node.nodeValue = trText(nodes[i].raw, lang);
    for (var p = 0; p < phs.length; p++) phs[p].el.setAttribute("placeholder", trText(phs[p].raw, lang));

    document.documentElement.setAttribute("lang", LANGS[lang]);
    try { localStorage.setItem("gute-lang", lang); } catch (e) {}
    var sw = document.getElementById("langSwitch");
    if (sw && sw.value !== lang) sw.value = lang;
  }

  window.GUTE_setLang = apply;

  document.addEventListener("DOMContentLoaded", function () {
    var saved = "en";
    try { saved = localStorage.getItem("gute-lang") || "en"; } catch (e) {}
    var sw = document.getElementById("langSwitch");
    if (sw) sw.addEventListener("change", function () { apply(sw.value); });
    apply(saved);
  });
})();
