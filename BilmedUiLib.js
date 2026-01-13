(function(global){
    //console.warn('BilmedUiLib LOADED');

    var BilmedTheme = {};

var __BILMED_THEME_ID = null;
    var __BILMED_T = null;
    var __BILMED_ENTRY_THEME_ID = null;
    var __BILMED_ENTRY_T = null;

    function __bilmed_setCurrentThemeId(themeId){
        var id = themeId || BilmedTheme.getDefaultThemeId();
        __BILMED_THEME_ID = id;
        __BILMED_T = BilmedTheme.get(id);
        return __BILMED_T;
    }

    function __bilmed_getCurrentTheme(){
        if(!__BILMED_T) {
            __bilmed_setCurrentThemeId(BilmedTheme.getDefaultThemeId());
        }
        return __BILMED_T;
    }
    function __bilmed_clamp01(x){
        if(x < 0) { return 0; }
        if(x > 1) { return 1; }
        return x;
    }

    function __bilmed_toHex2(n){
        var s = Math.round(n).toString(16);
        if(s.length === 1) { return "0" + s; }
        return s;
    }

    function __bilmed_rgbToHex(c){
        return "#" + __bilmed_toHex2(c.r) + __bilmed_toHex2(c.g) + __bilmed_toHex2(c.b);
    }

    function __bilmed_colorToCss(c){
        if(!c) { return ""; }
        if(c.a != null && c.a < 0.999) {
            return "rgba(" + Math.round(c.r) + "," + Math.round(c.g) + "," + Math.round(c.b) + "," + c.a + ")";
        }
        return __bilmed_rgbToHex(c);
    }


    function __bilmed_parseHexColor(s){
        var v = String(s || "").trim();
        if(v.charAt(0) !== "#") { return null; }
        v = v.slice(1);

        if(v.length === 3) {
            return {
                r: parseInt(v.charAt(0) + v.charAt(0), 16),
                g: parseInt(v.charAt(1) + v.charAt(1), 16),
                b: parseInt(v.charAt(2) + v.charAt(2), 16),
                a: 1
            };
        }

        if(v.length === 6) {
            return {
                r: parseInt(v.slice(0, 2), 16),
                g: parseInt(v.slice(2, 4), 16),
                b: parseInt(v.slice(4, 6), 16),
                a: 1
            };
        }

        return null;
    }

    function __bilmed_parseRgbaColor(s){
        var v = String(s || "").trim();
        var re = new RegExp("^rgba?\\(\\s*([0-9.]+)\\s*,\\s*([0-9.]+)\\s*,\\s*([0-9.]+)(?:\\s*,\\s*([0-9.]+))?\\s*\\)$", "i");
        var m = re.exec(v);
        if(!m) { return null; }

        var r = Number(m[1]);
        var g = Number(m[2]);
        var b = Number(m[3]);
        var a = (m[4] == null) ? 1 : Number(m[4]);

        if(!isFinite(r) || !isFinite(g) || !isFinite(b) || !isFinite(a)) { return null; }

        return {
            r: Math.max(0, Math.min(255, Math.round(r))),
            g: Math.max(0, Math.min(255, Math.round(g))),
            b: Math.max(0, Math.min(255, Math.round(b))),
            a: Math.max(0, Math.min(1, a))
        };
    }

    function __bilmed_parseColor(s){
        var h = __bilmed_parseHexColor(s);
        if(h) { return h; }

        var r = __bilmed_parseRgbaColor(s);
        if(r) { return r; }

        return null;
    }

    function __bilmed_mix(c1, c2, c1Weight){
        var w1 = __bilmed_clamp01(Number(c1Weight));
        var w2 = 1 - w1;

        return {
            r: (c1.r * w1) + (c2.r * w2),
            g: (c1.g * w1) + (c2.g * w2),
            b: (c1.b * w1) + (c2.b * w2),
            a: (c1.a * w1) + (c2.a * w2)
        };
    }

    function __bilmed_header2BgFromHeader(headerBg){
        var c = __bilmed_parseColor(headerBg);
        if(!c) {
            return headerBg;
        }

        var white = { r: 255, g: 255, b: 255, a: 1 };
        var mixed = __bilmed_mix(c, white, 0.88);

        if(mixed.a >= 0.999) {
            return __bilmed_rgbToHex(mixed);
        }

        return "rgba(" + Math.round(mixed.r) + "," + Math.round(mixed.g) + "," + Math.round(mixed.b) + "," + mixed.a + ")";
    }

    function __bilmed_borderSoft(border){
        var c = __bilmed_parseColor(border);
        if(!c) {
            return border;
        }

        var a = c.a;
        a = a * 0.70;
        a = Math.max(0, Math.min(1, a));

        return "rgba(" + Math.round(c.r) + "," + Math.round(c.g) + "," + Math.round(c.b) + "," + a + ")";
    }
    function __bilmed_supportsColorMix(){
        try {
            return typeof CSS !== 'undefined' && !!CSS.supports && CSS.supports('background', 'color-mix(in srgb, #000 10%, #fff)');
        } catch(e) {
            return 0;
        }
    }

    function __bilmed_isNearWhiteColor(v){
        var c = __bilmed_parseColor(v);
        if(!c) { return 0; }
        if(c.a != null && c.a < 0.95) { return 0; }
        return c.r >= 245 && c.g >= 245 && c.b >= 245;
    }

    function __bilmed_deriveTintBg(surfaceRaw, pageBg, header2Bg){
        if(__bilmed_supportsColorMix()) {
            if(__bilmed_isNearWhiteColor(surfaceRaw)) {
                return 'color-mix(in srgb, var(--bilmed-page-bg) 92%, var(--bilmed-header2-bg) 8%)';
            }
            return 'color-mix(in srgb, var(--bilmed-surface-bg-raw) 88%, var(--bilmed-page-bg) 12%)';
        }

        var p = __bilmed_parseColor(pageBg);
        var h2 = __bilmed_parseColor(header2Bg);
        var s = __bilmed_parseColor(surfaceRaw);

        if(__bilmed_isNearWhiteColor(surfaceRaw)) {
            if(p && h2) { return __bilmed_colorToCss(__bilmed_mix(h2, p, 0.08)); }
            return surfaceRaw;
        }

        if(s && p) { return __bilmed_colorToCss(__bilmed_mix(s, p, 0.88)); }
        return surfaceRaw;
    }



    BilmedTheme.list = function(){
        return [
            { id: "rahat", name: "Rahat", meta: "Günlük uzun kullanım" },
            { id: "sakin", name: "Sakin", meta: "Gece / düşük uyarım" },
            { id: "canli", name: "Canlı", meta: "Hızlı algı / vurgu" },
            { id: "kurumsal", name: "Bilmed Kurumsal", meta: "Bilmed kurumsal mavi" },
            { id: "kontrast", name: "Kontrast", meta: "Erişilebilir" }
        ];
    };

    BilmedTheme.getDefaultThemeId = function(){
        return "kurumsal";
    };

    BilmedTheme.get = function(themeId){
        var themes = {
            rahat: {
                id: "rahat",
                headerBg: "#F8FAFC",
                headerFg: "#0F172A",
                headerBorder: "#E2E8F0",
                pageBg: "#F8FAFC",
                avatarBg: "#FFFFFF",
                avatarFg: "#0F172A",
                avatarBorder: "rgba(15,23,42,0.18)",
                gearBg: "#FFFFFF",
                gearFg: "#0F172A",
                gearBorder: "rgba(15,23,42,0.18)",
                surfaceBg: "#FFFFFF",
                surfaceBorder: "rgba(15,23,42,0.12)",
                surfaceText: "#0F172A",
                mutedText: "rgba(15,23,42,0.7)"
            },
            sakin: {
                id: "sakin",
                headerBg: "#0F172A",
                headerFg: "#E5E7EB",
                headerBorder: "#1E293B",
                pageBg: "#0B1220",
                avatarBg: "#111827",
                avatarFg: "#E5E7EB",
                avatarBorder: "rgba(148,163,184,0.35)",
                gearBg: "#111827",
                gearFg: "#E5E7EB",
                gearBorder: "rgba(148,163,184,0.35)",
                surfaceBg: "#0F172A",
                surfaceBorder: "rgba(148,163,184,0.25)",
                surfaceText: "#E5E7EB",
                mutedText: "rgba(229,231,235,0.72)"
            },
            canli: {
                id: "canli",
                headerBg: "#991B1B",
                headerFg: "#FFFFFF",
                headerBorder: "rgba(255,255,255,0.18)",
                pageBg: "#FFF7ED",
                avatarBg: "#FFFFFF",
                avatarFg: "#0F172A",
                avatarBorder: "rgba(255,255,255,0.55)",
                gearBg: "#FFFFFF",
                gearFg: "#0F172A",
                gearBorder: "rgba(255,255,255,0.55)",
                surfaceBg: "#FFFFFF",
                surfaceBorder: "rgba(15,23,42,0.12)",
                surfaceText: "#0F172A",
                mutedText: "rgba(15,23,42,0.7)"
            },
            kurumsal: {
                id: "kurumsal",
                headerBg: "#0A3A6A",
                headerFg: "#FFFFFF",
                headerBorder: "rgba(255,255,255,0.15)",
                pageBg: "#F1F7FB",
                avatarBg: "#FFFFFF",
                avatarFg: "#0A3A6A",
                avatarBorder: "#1FA3D7",
                gearBg: "#FFFFFF",
                gearFg: "#0A3A6A",
                gearBorder: "#1FA3D7",
                surfaceBg: "#FFFFFF",
                surfaceBorder: "#D6E4EF",
                surfaceText: "#0F172A",
                mutedText: "rgba(15,23,42,0.7)"
            },
            kontrast: {
                id: "kontrast",
                headerBg: "#061B2E",
                headerFg: "#FFFFFF",
                headerBorder: "rgba(255,255,255,0.20)",
                pageBg: "#F7FAFD",
                avatarBg: "#FFFFFF",
                avatarFg: "#061B2E",
                avatarBorder: "#2BB3FF",
                gearBg: "#FFFFFF",
                gearFg: "#061B2E",
                gearBorder: "#2BB3FF",
                surfaceBg: "#FFFFFF",
                surfaceBorder: "rgba(6,27,46,0.32)",
                surfaceText: "#061B2E",
                mutedText: "rgba(6,27,46,0.72)"
            }
        };

        var id = themeId || BilmedTheme.getDefaultThemeId();
        var base = themes[id] || themes[BilmedTheme.getDefaultThemeId()];

        var ui = {};
        ui.railBg = __bilmed_header2BgFromHeader(base.headerBg);
        ui.railBorder = __bilmed_borderSoft(base.headerBorder);
        ui.railItemBg = "rgba(255,255,255,0.70)";
        ui.railItemBorder = "rgba(0,0,0,0.10)";

        ui.miniBg = base.surfaceBg;
        ui.miniBorder = base.surfaceBorder;

        var __bgc = __bilmed_parseColor(base.surfaceBg) || { r: 255, g: 255, b: 255, a: 1 };
        var __fgc = __bilmed_parseColor(base.surfaceText) || { r: 15, g: 23, b: 42, a: 1 };

        function __mixCssFgToBg(fgWeight){
            var mixed = __bilmed_mix(__fgc, __bgc, __bilmed_clamp01(fgWeight));
            mixed.a = 1;
            return __bilmed_colorToCss(mixed);
        }

        var __acc = __bilmed_parseColor(base.headerBg) || __fgc;

        function __mixCssAccentToBg(accWeight){
            var mixed = __bilmed_mix(__acc, __bgc, __bilmed_clamp01(accWeight));
            mixed.a = 1;
            return __bilmed_colorToCss(mixed);
        }

        var __wIdle = 0.10;
        var __wHover = 0.14;
        var __wSel = 0.20;
        var __wBorder = 0.16;

        if(id === "kurumsal" || id === "canli"){
            __wIdle = 0.22;
            __wHover = 0.30;
            __wSel = 0.40;
            __wBorder = 0.28;
        }

        if(id === "kontrast"){
            __wIdle = 0.28;
            __wHover = 0.40;
            __wSel = 0.55;
            __wBorder = 0.36;
        }

        if(id === "kurumsal" || id === "canli" || id === "kontrast"){
            ui.miniRowIdleBg = __mixCssAccentToBg(__wIdle);
            ui.miniRowHoverBg = __mixCssAccentToBg(__wHover);
            ui.miniRowSelectedBg = __mixCssAccentToBg(__wSel);
            ui.miniRowBorder = __mixCssAccentToBg(__wBorder);
        } else {
            ui.miniRowIdleBg = __mixCssFgToBg(__wIdle);
            ui.miniRowHoverBg = __mixCssFgToBg(__wHover);
            ui.miniRowSelectedBg = __mixCssFgToBg(__wSel);
            ui.miniRowBorder = __mixCssFgToBg(__wBorder);
        }

        ui.ctrlBg = base.gearBg;
        ui.ctrlFg = base.gearFg;
        ui.ctrlBorder = base.gearBorder;
        ui.ctrlHoverBg = base.gearBg;
        ui.ctrlActiveBg = base.gearBg;

        ui.miniCtrlBg = base.surfaceBg;
        ui.miniCtrlFg = base.surfaceText;
        ui.miniCtrlBorder = base.surfaceBorder;

        if(id === "kurumsal" || id === "canli"){
            ui.miniCtrlBg = __mixCssAccentToBg(0.08);
            ui.miniCtrlBorder = __mixCssAccentToBg(0.22);
        }

        if(id === "kontrast"){
            ui.miniCtrlBg = __mixCssAccentToBg(0.10);
            ui.miniCtrlBorder = base.avatarBorder;
        }

        base.ui = ui;
        return base;
    };
    BilmedTheme.apply = function(doc, cfg){
        var d = doc || document;
        var c = cfg || {};

        if(c.themeId) {
            __bilmed_setCurrentThemeId(c.themeId);
        }

        var t = __bilmed_getCurrentTheme();
        var themeId = __BILMED_THEME_ID || BilmedTheme.getDefaultThemeId();

        var root = d.documentElement;

        root.style.setProperty('--bilmed-header-bg', t.headerBg);
        root.style.setProperty('--bilmed-header-fg', t.headerFg);
        root.style.setProperty('--bilmed-header-border', t.headerBorder);

        var __bilmed_header2Bg = __bilmed_header2BgFromHeader(t.headerBg);

        root.style.setProperty('--bilmed-header2-bg', __bilmed_header2Bg);
        root.style.setProperty('--bilmed-header2-fg', t.headerFg);
        root.style.setProperty('--bilmed-header2-border', __bilmed_borderSoft(t.headerBorder));

        root.style.setProperty('--bilmed-page-bg', t.pageBg);

        root.style.setProperty('--bilmed-avatar-bg', t.avatarBg);
        root.style.setProperty('--bilmed-avatar-fg', t.avatarFg);
        root.style.setProperty('--bilmed-avatar-border', t.avatarBorder);

        root.style.setProperty('--bilmed-gear-bg', t.gearBg);
        root.style.setProperty('--bilmed-gear-fg', t.gearFg);
        root.style.setProperty('--bilmed-gear-border', t.gearBorder);

        root.style.setProperty('--bilmed-surface-bg-raw', t.surfaceBg);
        root.style.setProperty('--bilmed-surface-bg', t.surfaceBg);
        root.style.setProperty('--bilmed-tint-bg', __bilmed_deriveTintBg(t.surfaceBg, t.pageBg, __bilmed_header2Bg));
        root.style.setProperty('--bilmed-surface-border', t.surfaceBorder);
        root.style.setProperty('--bilmed-surface-text', t.surfaceText);
        root.style.setProperty('--bilmed-muted-text', t.mutedText);

        __bilmed_applyMiniUiColors(d, t, themeId);
    };

    if(!global.__bilmed_mini_rows_ready_hook) {
        global.__bilmed_mini_rows_ready_hook = 1;
        document.addEventListener('HB_MINI_ROWS_READY', function(){
            BilmedTheme.apply(document);
        });
    }



        



function __bilmed_resetMiniRowHoverBound(d){
    var rows = d.querySelectorAll('.hbMenuTitleRow');
    for(var i = 0; i < rows.length; i += 1){
        rows[i].__bilmed_hover_bound = 0;
    }
}

function __bilmed_bindMiniRowHover(el, t){
            if(!el || !el.addEventListener || !t || !t.ui) { return; }
            if(el.__bilmed_hover_bound) { return; }
            el.__bilmed_hover_bound = 1;

            function isSel(){
                return (el.getAttribute && el.getAttribute("data-selected") === "1");
            }
            function isHover(){
                return (el.getAttribute && el.getAttribute("data-hovered") === "1");
            }
            function setBg(bg){
                if(el && el.style) {
                    el.style.background = bg || "";
                    var fg = t && t.ui ? (t.ui.railItemFg || "") : "";
                    var fgOnDark = t && t.ui ? (t.ui.railItemFgOnDark || "#ffffff") : "#ffffff";
                    var c = __bilmed_parseColor(bg || "");
                    var useDark = 0;
                    if(c){
                        var a = (typeof c.a === "number") ? c.a : 1;
                        if(a >= 0.15){
                            var y = (0.299*c.r + 0.587*c.g + 0.114*c.b) / 255;
                            if(y < 0.48){ useDark = 1; }
                        }
                    }
                    el.style.color = useDark ? fgOnDark : fg;
                }
            }
            function applyState(state){
                if(!t || !t.ui) { return; }
                if(isSel()){
                    setBg(t.ui.miniRowSelectedBg || t.ui.miniRowHoverBg || t.ui.miniRowIdleBg || "");
                    return;
                }
                if(isHover()){
                    setBg(t.ui.miniRowHoverBg || t.ui.miniRowIdleBg || "");
                    return;
                }
                if(state === "hover"){
                    setBg(t.ui.miniRowHoverBg || t.ui.miniRowIdleBg || "");
                    return;
                }
                setBg(t.ui.miniRowIdleBg || "");

            }

            el.__bilmed_applyMiniState = applyState;
            el.addEventListener("mouseenter", function(){ applyState("hover"); });
            el.addEventListener("mouseleave", function(){
            var list2 = el.parentNode ? el.parentNode.querySelectorAll(".hbMenuTitleRow") : null;
            if(list2){
                for(var q=0;q<list2.length;q+=1){
                    if(list2[q] && list2[q].__bilmed_applyMiniState){ list2[q].__bilmed_applyMiniState("idle"); }
                }
            }

            applyState("idle"); });
            el.addEventListener("mousedown", function(){ applyState("hover"); });
            el.addEventListener("mouseup", function(){ applyState("hover"); });
            el.addEventListener("click", function(){

            if(el && el.setAttribute) { el.setAttribute("data-selected", "1"); }
                    var list = el.parentNode ? el.parentNode.querySelectorAll(".hbMenuTitleRow") : null;
                    if(list){
                        for(var k=0;k<list.length;k+=1){
                            if(list[k] !== el && list[k] && list[k].setAttribute) { list[k].setAttribute("data-selected", "0"); }
                        }
            }

            applyState("idle");
            });


            var mo = new MutationObserver(function(){
                applyState("idle");
            });
            mo.observe(el, { attributes:true, attributeFilter:["data-selected","data-hovered"] });


            applyState("idle");

    }

    function __bilmed_makeDerivedBg(baseCss, amount){

            var c = __bilmed_parseColor(baseCss);
            var d = __bilmed_parseColor("#000000");
            if(!c || !d) { return baseCss; }
            var m = __bilmed_mix(c, d, amount);
            return __bilmed_colorToCss(m);
    }

    function __bilmed_bindRailBtnHover(el, t){
            if(!el || !el.addEventListener || !t || !t.ui) { return; }
            if(el.__bilmed_hover_bound) { return; }
            el.__bilmed_hover_bound = 1;

            var idle = t.ui.railItemBg || "";
//CETCET    var hover = t.ui.railItemHoverBg || __bilmed_makeDerivedBg(idle, 0.08);
            var hover = t.ui.railItemHoverBg || __bilmed_makeDerivedBg(idle, 0.7);
//CETCET    var active = t.ui.railItemActiveBg || __bilmed_makeDerivedBg(idle, 0.14);
            var active = t.ui.railItemActiveBg || __bilmed_makeDerivedBg(idle, 0.7);
//CETCET    var selected = t.ui.railItemSelectedBg || __bilmed_makeDerivedBg(idle, 0.10);
            var selected = t.ui.railItemSelectedBg || __bilmed_makeDerivedBg(idle, 0.6);

            function isSel(){
                return (el.getAttribute && el.getAttribute("data-selected") === "1");
            }
            function isHover(){
                return (el.getAttribute && el.getAttribute("data-hovered") === "1");
            }
            function setBg(bg){
                if(el && el.style) { el.style.background = bg || ""; }
            }
            function applyState(state){
                if(isSel()){
                    setBg(selected || hover || idle);
                    return;
                }
                if(state === "active"){
                    setBg(active || hover || idle);
                    return;
                }
                if(isHover()){
                    setBg(hover || idle);
                    return;
                }
                if(state === "hover"){

                    setBg(hover || idle);
                    return;
                }
                setBg(idle);
            }

            el.addEventListener("mouseenter", function(){ applyState("hover"); });
            el.addEventListener("mouseleave", function(){ applyState("idle"); });
            el.addEventListener("mousedown", function(){ applyState("active"); });
            el.addEventListener("mouseup", function(){ applyState("hover"); });
            el.addEventListener("click", function(){ applyState("idle"); });


            var mo = new MutationObserver(function(){ applyState("idle"); });
            mo.observe(el, { attributes:true, attributeFilter:["data-selected","data-hovered"] });


            applyState("idle");

    }

    function __bilmed_applyMiniUiColors(doc, t, themeId){
        var d = doc || document;
        if(!d || !t || !t.ui) { 
            return; 
        }

        var rail = d.getElementById("hbMiniRail");
        if(rail && rail.style) {
            if(t.ui.railBg) { rail.style.background = t.ui.railBg; }
            if(t.ui.railBorder) { rail.style.borderColor = t.ui.railBorder; }
        }

        var panel = d.getElementById("hbMiniPanel");
        if(panel && panel.style) {
            if(t.ui.miniBg) { panel.style.background = t.ui.miniBg; }
            if(t.ui.miniBorder) { panel.style.borderColor = t.ui.miniBorder; }
        }

        var btn1 = d.getElementById("hbMiniCollapseBtn");
        if(btn1 && btn1.style) {
            if(t.ui.miniCtrlBg) { btn1.style.background = t.ui.miniCtrlBg; }
            if(t.ui.miniCtrlBorder) { btn1.style.borderColor = t.ui.miniCtrlBorder; }
            if(t.ui.miniCtrlFg) { btn1.style.color = t.ui.miniCtrlFg; }
        }

        var btn2 = d.getElementById("hbMiniExpandBtn");
        if(btn2 && btn2.style) {
            if(t.ui.miniCtrlBg) { btn2.style.background = t.ui.miniCtrlBg; }
            if(t.ui.miniCtrlBorder) { btn2.style.borderColor = t.ui.miniCtrlBorder; }
            if(t.ui.miniCtrlFg) { btn2.style.color = t.ui.miniCtrlFg; }
        }

        var rows = d.querySelectorAll(".hbMenuTitleRow");
        for(var i = 0; i < rows.length; i += 1){
            var el = rows[i];
            if(!el) { continue; }
            if(el.style) {
                if(t.ui.miniRowBorder) { el.style.borderColor = t.ui.miniRowBorder; }
            }
            __bilmed_bindMiniRowHover(el, t);
        }


        for(var i2=0;i2<rows.length;i2+=1){
            var r2 = rows[i2];
            if(r2 && r2.__bilmed_applyMiniState){ r2.__bilmed_applyMiniState("idle"); }
        }



        var railBtns = d.querySelectorAll(".hbItemRailBtn");
        for(var j = 0; j < railBtns.length; j += 1){
            var rb = railBtns[j];
            if(!rb) { continue; }
            if(rb.style) {
                if(t.ui.railItemBorder) { rb.style.borderColor = t.ui.railItemBorder; }
            }
            __bilmed_bindRailBtnHover(rb, t);
        }


        __bilmed_patchHbMiniSelection(d, t);

        
}


function __bilmed_patchHbMiniSelection(doc, t){
        var d = doc || document;
        var w;
        w = d.defaultView || window;
        if(!w) { return; }
        var f = w.__hb_itemsSetRailSelected;
        if(!f || f.__bilmed_patched_sel) { return; }

        function applyMiniSelected(){

                var sid = "";

                    if(w.HB_ITEM_STATE && w.HB_ITEM_STATE.selectedId != null) { sid = String(w.HB_ITEM_STATE.selectedId || ""); }


                var nodes = d.querySelectorAll(".hbMenuTitleRow[data-hb-item-id]");
                for(var i=0;i<nodes.length;i+=1){
                    var el = nodes[i];
                    if(!el || !el.getAttribute || !el.setAttribute) { continue; }
                    var id = String(el.getAttribute("data-hb-item-id") || "");
                    el.setAttribute("data-selected", (sid && id === sid) ? "1" : "0");
                    if(el.__bilmed_applyMiniState){ el.__bilmed_applyMiniState("idle"); }
                }

        }

        var wrapped = function(){
            var r;
            r = f.apply(this, arguments);
            applyMiniSelected();
            return r;
        };
        wrapped.__bilmed_patched_sel = 1;
        f.__bilmed_patched_sel = 1;
        w.__hb_itemsSetRailSelected = wrapped;


            applyMiniSelected();

    }

    var BilmedConfig = {};

    BilmedConfig._k = function(pid){
        return "BILMED_THEME_CFG::" + String(pid);
    };

    BilmedConfig.load = function(pid){
        var raw = localStorage.getItem(BilmedConfig._k(pid));
        if(!raw) {
            return {};
        }

            return JSON.parse(raw) || {};

    };

    BilmedConfig.save = function(pid, cfg){
        localStorage.setItem(BilmedConfig._k(pid), JSON.stringify(cfg || {}));
    };

    function __ensureUi(doc){
        var d = doc || document;
        if(d.getElementById("bilmedThemeBackdrop")) {
            return;
        }

        var st = d.createElement("style");
        st.textContent =
            "#bilmedThemeBackdrop{position:fixed;inset:0;background:transparent;display:none;align-items:center;justify-content:center;padding:14px;box-sizing:border-box;z-index:99999}" +
            "#bilmedThemeModal{width:min(820px,100%);max-height:min(720px,100%);background:var(--bilmed-surface-bg);color:var(--bilmed-surface-text);border:1px solid var(--bilmed-surface-border);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}" +
            "#bilmedThemeHeader{display:flex;align-items:center;padding:12px;border-bottom:1px solid var(--bilmed-surface-border)}" +
            "#bilmedThemeTitle{font-weight:800;font-size:0.9rem}" +
            "#bilmedThemeSpacer{flex:1}" +
            "#bilmedThemeSave,#bilmedThemeClose{margin-left:8px;border:1px solid var(--bilmed-surface-border);background:transparent;color:var(--bilmed-surface-text);border-radius:12px;padding:7px 12px;cursor:pointer;font-weight:800;font-size:0.78rem}" +
            "#bilmedThemeBody{padding:12px;overflow:auto}" +
            "#bilmedThemeGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}" +
            "@media (max-width:640px){#bilmedThemeGrid{grid-template-columns:1fr}}" +
            ".bilmedCard{border:1px solid var(--bilmed-surface-border);border-radius:14px;cursor:pointer;background:#fff;overflow:hidden}" +
            ".bilmedCardInner{padding:10px}" +
            ".bilmedNameRow{display:flex;align-items:center;gap:10px;margin-bottom:8px}" +
            ".bilmedName{font-weight:900;font-size:0.82rem;flex:1;color:#0f172a}" +
            ".bilmedMark{width:18px;height:18px;border-radius:6px;border:1px solid rgba(15,23,42,0.14);display:grid;place-items:center;font-size:0.75rem;opacity:0;transform:scale(0.95);transition:opacity 120ms ease,transform 120ms ease;background:#fff;color:#0f172a}" +
            ".bilmedCard[data-selected='1'] .bilmedMark{opacity:1;transform:scale(1)}" +
            ".bilmedPreview{border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,0.08)}" +
            ".bilmedPvTop{height:44px;display:flex;align-items:center;padding:0 10px;box-sizing:border-box}" +
                        ".bilmedPvTop2{height:30px;display:flex;align-items:center;padding:0 10px;box-sizing:border-box;gap:8px}.bilmedPv2Left{display:flex;align-items:center;gap:6px}.bilmedPv2Chip{width:34px;height:18px;border-radius:8px;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.10)}.bilmedPv2Spacer{flex:1}.bilmedPv2Right{display:flex;align-items:center;gap:8px}.bilmedPv2Menu{width:30px;height:22px;border-radius:9px;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.10);display:grid;place-items:center}.bilmedPv2MenuDots{display:flex;align-items:center;gap:4px}.bilmedPv2Dot{width:3.6px;height:3.6px;border-radius:50%;background:currentColor;opacity:0.9}" +
            ".bilmedPvLogo{width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,0.2);display:grid;place-items:center;overflow:hidden}" +
            ".bilmedPvLogo img{width:100%;height:100%;object-fit:contain;display:block}" +
            ".bilmedPvPatient{display:flex;align-items:center;gap:6px;margin-left:10px;min-width:0}.bilmedPvSpacer{flex:1}.bilmedPvDoc{display:flex;align-items:center;gap:8px;min-width:0}" +
            ".bilmedPvAvatar{width:28px;height:28px;border-radius:50%;border:1px solid rgba(0,0,0,0.18);background:#fff;color:#0f172a;display:grid;place-items:center;font-weight:900;font-size:0.6875rem;flex:0 0 auto}" +
            ".bilmedPvText{font-size:0.75rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}" +
            ".bilmedPvBody{display:flex;gap:10px;padding:10px;box-sizing:border-box}.bilmedPvRail{width:44px;border-radius:12px;border:1px solid rgba(0,0,0,0.10);overflow:hidden;display:flex;flex-direction:column}.bilmedPvMini{flex:1;border-radius:12px;border:1px solid rgba(0,0,0,0.10);overflow:hidden;display:flex;flex-direction:column;min-width:0}.bilmedPvCtlRow{height:22px;display:flex;align-items:center;justify-content:flex-end;gap:6px;padding:0 8px;box-sizing:border-box}.bilmedPvCtl{width:22px;height:14px;border-radius:7px;border:1px solid rgba(0,0,0,0.12);background:rgba(255,255,255,0.70)}.bilmedPvRailList{padding:8px;display:flex;flex-direction:column;gap:8px;box-sizing:border-box}.bilmedPvDot{width:18px;height:18px;border-radius:8px;border:1px solid rgba(0,0,0,0.10);background:rgba(255,255,255,0.70)}.bilmedPvMiniList{padding:8px 10px 10px 10px;display:flex;flex-direction:column;gap:8px;box-sizing:border-box}.bilmedPvRow{height:16px;border-radius:8px;border:1px solid rgba(0,0,0,0.08);display:flex;align-items:center;gap:8px;padding:0 8px;box-sizing:border-box}.bilmedPvRowIcon{width:14px;height:14px;border-radius:6px;border:1px solid rgba(0,0,0,0.10);background:rgba(255,255,255,0.70);flex:0 0 auto}.bilmedPvRowText{height:8px;border-radius:6px;flex:1;opacity:0.85}" +
            ".bilmedMeta{margin-top:8px;font-size:0.75rem;color:rgba(15,23,42,0.7)}.bilmedPvFrame{display:flex;min-height:78px;background:var(--bilmed-page-bg)}.bilmedPvLeft{width:25%;min-width:0;border-right:1px solid rgba(0,0,0,0.06);display:flex;flex-direction:column}.bilmedPvLeftHead{height:30px;display:flex;align-items:center;gap:6px;padding:0 8px;box-sizing:border-box;border-bottom:1px solid rgba(0,0,0,0.06)}.bilmedPvLeftBtn{height:18px;width:18px;border-radius:7px;border:1px solid rgba(0,0,0,0.10);background:rgba(255,255,255,0.65)}.bilmedPvRail{width:26px;flex:0 0 auto;border-right:1px solid rgba(0,0,0,0.06);display:flex;flex-direction:column;gap:6px;padding:8px 6px;box-sizing:border-box}.bilmedPvRailI{height:14px;width:14px;border-radius:5px;background:rgba(15,23,42,0.12)}.bilmedPvMini{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;padding:8px;box-sizing:border-box}.bilmedPvRow{height:12px;border-radius:6px;background:rgba(15,23,42,0.10)}.bilmedPvMain{flex:1;min-width:0;display:flex;flex-direction:column}.bilmedPvMainBody{display:none}";

        d.head.appendChild(st);

        var backdrop = d.createElement("div");
        backdrop.id = "bilmedThemeBackdrop";

        var modal = d.createElement("div");
        modal.id = "bilmedThemeModal";

        var header = d.createElement("div");
        header.id = "bilmedThemeHeader";

        var title = d.createElement("div");
        title.id = "bilmedThemeTitle";
        title.textContent = "Görünüm Ayarları";

        var spacer = d.createElement("div");
        spacer.id = "bilmedThemeSpacer";

        var btnSave = d.createElement("button");
        btnSave.id = "bilmedThemeSave";
        btnSave.type = "button";
        btnSave.textContent = "Kaydet";

        var btnClose = d.createElement("button");
        btnClose.id = "bilmedThemeClose";
        btnClose.type = "button";
        btnClose.textContent = "Çık";

        header.appendChild(title);
        header.appendChild(spacer);
        header.appendChild(btnSave);
        header.appendChild(btnClose);

        var body = d.createElement("div");
        body.id = "bilmedThemeBody";

        var grid = d.createElement("div");
        grid.id = "bilmedThemeGrid";

        body.appendChild(grid);

        modal.appendChild(header);
        modal.appendChild(body);
        backdrop.appendChild(modal);
        d.body.appendChild(backdrop);
    }

    function __uiOpen(doc, state){
        var d = doc || document;

        __ensureUi(d);

        var backdrop = d.getElementById("bilmedThemeBackdrop");
        var modal = d.getElementById("bilmedThemeModal");
        var grid = d.getElementById("bilmedThemeGrid");
        var btnSave = d.getElementById("bilmedThemeSave");
        var btnClose = d.getElementById("bilmedThemeClose");

        function freezeModalVars(){
            if(!modal) { return; }
            var root = d.documentElement;
            if(!root) { return; }
            var cs;
            cs = d.defaultView.getComputedStyle(root);
            if(!cs) { return; }

            var vars = [
                "--bilmed-header-bg",
                "--bilmed-header-fg",
                "--bilmed-header-border",
                "--bilmed-header2-bg",
                "--bilmed-header2-fg",
                "--bilmed-header2-border",
                "--bilmed-avatar-bg",
                "--bilmed-avatar-fg",
                "--bilmed-avatar-border",
                "--bilmed-page-bg",
                "--bilmed-surface-bg",
                "--bilmed-surface-border",
                "--bilmed-surface-text",
                "--bilmed-muted-text"
            ];

            for(var i = 0; i < vars.length; i += 1){
                var k = vars[i];
                var v = "";
                v = cs.getPropertyValue(k);
                if(v && modal.style) {
                    modal.style.setProperty(k, v);
                }
            }
        }

        var startCfg = BilmedConfig.load(state.personelId);
        if(!startCfg.themeId) {
            startCfg.themeId = BilmedTheme.getDefaultThemeId();
        }

        var workingCfg = JSON.parse(JSON.stringify(startCfg));

        freezeModalVars();

        __BILMED_ENTRY_THEME_ID = __BILMED_THEME_ID;
        __BILMED_ENTRY_T = __BILMED_T;

        function closeWithoutSave(){
            __bilmed_setCurrentThemeId(__BILMED_ENTRY_THEME_ID);
            BilmedTheme.apply(d);
            backdrop.style.display = "none";
        }

        function saveAndClose(){
            BilmedConfig.save(state.personelId, workingCfg);
            backdrop.style.display = "none";
        }

        btnClose.onclick = function(){
            closeWithoutSave();
        };

        btnSave.onclick = function(){
            saveAndClose();
        };

        backdrop.onclick = function(ev){
            if(ev.target === backdrop) {
                closeWithoutSave();
            }
        };

        d.defaultView.onkeydown = function(ev){
            if(ev.key === "Escape" && backdrop.style.display === "flex") {
                closeWithoutSave();
            }
        };

        function renderThemes(){
            grid.innerHTML = "";
            var list = BilmedTheme.list();
            for(var i = 0; i < list.length; i += 1){
                (function(it){
                    var t = BilmedTheme.get(it.id);

                    var card = d.createElement("div");
                    card.className = "bilmedCard";
                    card.setAttribute("data-theme-id", it.id);
                    card.setAttribute("data-selected", workingCfg.themeId === it.id ? "1" : "0");

                    var inner = d.createElement("div");
                    inner.className = "bilmedCardInner";

                    var nameRow = d.createElement("div");
                    nameRow.className = "bilmedNameRow";

                    var name = d.createElement("div");
                    name.className = "bilmedName";
                    name.textContent = it.name;

                    var mark = d.createElement("div");
                    mark.className = "bilmedMark";
                    mark.textContent = "✓";

                    nameRow.appendChild(name);
                    nameRow.appendChild(mark);

                    var pv = d.createElement("div");
                    pv.className = "bilmedPreview";

                    var pvTop = d.createElement("div");
                    pvTop.className = "bilmedPvTop";
                    pvTop.style.background = t.headerBg;
                    pvTop.style.color = t.headerFg;
                    pvTop.style.borderBottom = "1px solid " + t.headerBorder;

                    var pvLogo = d.createElement("div");
                    pvLogo.className = "bilmedPvLogo";

                    var img = d.createElement("img");
                    img.src = "logolar/bilmed-logo.png";
                    img.alt = "Bilmed";

                    pvLogo.appendChild(img);

                    var pvPatient = d.createElement("div");
                    pvPatient.className = "bilmedPvPatient";

                    var pvPatientAvatar = d.createElement("div");
                    pvPatientAvatar.className = "bilmedPvAvatar";
                    pvPatientAvatar.style.background = t.avatarBg;
                    pvPatientAvatar.style.color = t.avatarFg;
                    pvPatientAvatar.style.borderColor = t.avatarBorder;
                    pvPatientAvatar.textContent = "MU";

                    var pvPatientText = d.createElement("div");
                    pvPatientText.className = "bilmedPvText";
                    pvPatientText.textContent = "Hasta";

                    pvPatient.appendChild(pvPatientAvatar);
                    pvPatient.appendChild(pvPatientText);

                    var pvSpacer = d.createElement("div");
                    pvSpacer.className = "bilmedPvSpacer";

                    var pvDoc = d.createElement("div");
                    pvDoc.className = "bilmedPvDoc";

                    var pvAvatar = d.createElement("div");
                    pvAvatar.className = "bilmedPvAvatar";
                    pvAvatar.style.background = t.avatarBg;
                    pvAvatar.style.color = t.avatarFg;
                    pvAvatar.style.borderColor = t.avatarBorder;
                    pvAvatar.textContent = "DR";

                    var pvText = d.createElement("div");
                    pvText.className = "bilmedPvText";
                    pvText.textContent = "Dr";

                    pvDoc.appendChild(pvAvatar);
                    pvDoc.appendChild(pvText);

                    pvTop.appendChild(pvLogo);
                    pvTop.appendChild(pvPatient);
                    pvTop.appendChild(pvSpacer);
                    pvTop.appendChild(pvDoc);

                    var pvFrame = d.createElement("div");
                    pvFrame.className = "bilmedPvFrame";
                    pvFrame.style.background = t.pageBg;

                    var pvLeft = d.createElement("div");
                    pvLeft.className = "bilmedPvLeft";
                    pvLeft.style.background = t.pageBg;
                    pvLeft.style.borderRight = "1px solid " + __bilmed_borderSoft(t.headerBorder);

                    pvLeft.style.boxSizing = "border-box";
                    var pvRail = d.createElement("div");
                    pvRail.className = "bilmedPvRail";
                    pvRail.style.background = t.ui.railBg;
                    pvRail.style.borderRight = "1px solid " + t.ui.railBorder;

                    for(var ri = 0; ri < 4; ri += 1){
                        var rI = d.createElement("div");
                        rI.className = "bilmedPvRailI";
                        rI.style.background = t.ui.railItemBg;
                        rI.style.border = "1px solid " + t.ui.railItemBorder;
                        pvRail.appendChild(rI);
                    }

                    var pvMini = d.createElement("div");
                    pvMini.className = "bilmedPvMini";
                    pvMini.style.background = t.ui.miniBg;
                    pvMini.style.border = "1px solid " + t.ui.miniBorder;


                    var pvMiniCtlRow = d.createElement("div");
                    pvMiniCtlRow.className = "bilmedPvCtlRow";
                    pvMiniCtlRow.style.background = "transparent";

                    var pvBtn1 = d.createElement("button");
                    pvBtn1.className = "bilmedPvCtl";
                    pvBtn1.type = "button";
                    pvBtn1.style.background = t.ui.miniCtrlBg;
                    pvBtn1.style.color = t.ui.miniCtrlFg;
                    pvBtn1.style.borderColor = t.ui.miniCtrlBorder;

                    var pvBtn2 = d.createElement("button");
                    pvBtn2.className = "bilmedPvCtl";
                    pvBtn2.type = "button";
                    pvBtn2.style.background = t.ui.miniCtrlBg;
                    pvBtn2.style.color = t.ui.miniCtrlFg;
                    pvBtn2.style.borderColor = t.ui.miniCtrlBorder;

                    pvMiniCtlRow.appendChild(pvBtn1);
                    pvMiniCtlRow.appendChild(pvBtn2);
                    pvMini.appendChild(pvMiniCtlRow);

                    for(var mi = 0; mi < 3; mi += 1){
                        var row = d.createElement("div");
                        row.className = "bilmedPvRow";
                        if(mi === 1){
                            row.style.background = t.ui.miniRowSelectedBg;
                        } else {
                            row.style.background = t.ui.miniRowIdleBg;
                        }
                        row.style.border = "1px solid " + t.ui.miniRowBorder;
                        pvMini.appendChild(row);
                    }

                                        var pvLeftBody = d.createElement("div");
                    pvLeftBody.style.display = "flex";
                    pvLeftBody.style.flex = "1";
                    pvLeftBody.style.minHeight = "0";
                    pvLeftBody.appendChild(pvRail);
                    pvLeftBody.appendChild(pvMini);
                    pvLeft.appendChild(pvLeftBody);

                    var pvMain = d.createElement("div");
                    pvMain.className = "bilmedPvMain";
                    var pvTop2 = d.createElement("div");
                    pvTop2.className = "bilmedPvTop2";
                    pvTop2.style.background = __bilmed_header2BgFromHeader(t.headerBg);
                    pvTop2.style.color = t.headerFg;
                    pvTop2.style.borderBottom = "1px solid " + __bilmed_borderSoft(t.headerBorder);

                    var pv2Left = d.createElement("div");
                    pv2Left.className = "bilmedPv2Left";

                    for(var ci = 0; ci < 4; ci += 1) {
                        var chip = d.createElement("div");
                        chip.className = "bilmedPv2Chip";
                        pv2Left.appendChild(chip);
                    }

                    var pv2Spacer = d.createElement("div");
                    pv2Spacer.className = "bilmedPv2Spacer";

                    var pv2Right = d.createElement("div");
                    pv2Right.className = "bilmedPv2Right";

                    var pv2Menu = d.createElement("div");
                    pv2Menu.className = "bilmedPv2Menu";

                    var pv2Dots = d.createElement("div");
                    pv2Dots.className = "bilmedPv2MenuDots";

                    for(var di = 0; di < 3; di += 1) {
                        var dot = d.createElement("div");
                        dot.className = "bilmedPv2Dot";
                        pv2Dots.appendChild(dot);
                    }

                    pv2Menu.appendChild(pv2Dots);

                    pv2Right.appendChild(pv2Menu);

                    pvTop2.appendChild(pv2Left);
                    pvTop2.appendChild(pv2Spacer);
                    pvTop2.appendChild(pv2Right);
                    pvFrame.appendChild(pvLeft);
                    pvFrame.appendChild(pvMain);
                    pv.appendChild(pvTop);
                    pv.appendChild(pvTop2);
                    pv.appendChild(pvFrame);



                    var meta = d.createElement("div");
                    meta.className = "bilmedMeta";
                    meta.textContent = it.meta;

                    inner.appendChild(nameRow);
                    inner.appendChild(pv);
                    inner.appendChild(meta);

                    card.appendChild(inner);

                    card.onclick = function(){
                        workingCfg.themeId = it.id;
                        __bilmed_resetMiniRowHoverBound(d);
                        BilmedTheme.apply(d, workingCfg);
                        renderThemes();
                    };

                    grid.appendChild(card);
                })(list[i]);
            }
        }

        renderThemes();
        BilmedTheme.apply(d, workingCfg);

        backdrop.style.display = "flex";
    }

    function BilmedThema(personelId, doc, modalDialog){
        var d = doc || document;

        var cfg = BilmedConfig.load(personelId);
        if(!cfg.themeId) {
            cfg.themeId = BilmedTheme.getDefaultThemeId();
        }

        BilmedTheme.apply(d, cfg);

        if(modalDialog === true) {
            __uiOpen(d, { personelId: personelId });
        }

        return cfg;
    }
    global.BilmedThema = BilmedThema;
    global.BilmedTheme = BilmedTheme;
    global.BilmedConfig = BilmedConfig;
})(window);
