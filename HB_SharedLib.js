'use strict';

var HB_Shared = HB_Shared || {};

HB_Shared.DASH_GRID_COLS = {
    pc: 5,
    tablet: 4,
    mobile: 2,
};

HB_Shared.DASH_UNIT_PX = {
    pc: 8,
    tablet: 7,
    mobile: 6,
};

HB_Shared.DASH_CELL = {
    pc: { w: 10, h: 10 },
    tablet: { w: 8, h: 8 },
    mobile: { w: 5, h: 5 },
};

HB_Shared.DASH_GAP_PX = 0;

function hbModeGet(){
    var w = 0;
    if(typeof window !== 'undefined' && window && window.innerWidth){
        w = Math.floor(Number(window.innerWidth) || 0);
    }
    if(w <= 0) { return 'pc'; }
    if(w <= 768) { return 'mobile'; }
    if(w <= 1024) { return 'tablet'; }
    return 'pc';
}

function hbDashCellGet(mode){
    var m = mode || hbModeGet();
    var v = HB_Shared.DASH_CELL[m];
    if(!v) { v = HB_Shared.DASH_CELL.pc; }
    return { w: Math.floor(Number(v.w) || 10), h: Math.floor(Number(v.h) || 10) };
}

function hbDashUnitPxGet(mode){
    var m = mode || hbModeGet();
    var v = HB_Shared.DASH_UNIT_PX[m];
    if(!v) { v = HB_Shared.DASH_UNIT_PX.pc; }
    v = Math.floor(Number(v) || 0);
    if(!isFinite(v) || v <= 0) { v = 8; }
    return v;
}

function hbDashGridColsGet(mode, containerW){
    var m = mode || hbModeGet();
    var base = HB_Shared.DASH_GRID_COLS[m];
    if(!base) { base = HB_Shared.DASH_GRID_COLS.pc; }
    base = Math.floor(Number(base) || 0);
    if(!isFinite(base) || base <= 0) { base = 4; }

    var cw = Math.floor(Number(containerW) || 0);
    if(isFinite(cw) && cw > 0){
        var px = hbDashPxGet(m);
        var gap = hbDashGapPxGet();
        var denom = px.w + gap;
        if(!isFinite(denom) || denom <= 0) { denom = 1; }
        var dyn = Math.floor((cw + gap) / denom);
        if(!isFinite(dyn) || dyn < 1) { dyn = 1; }
        return dyn;
    }

    return base;
}

function hbDashGapPxGet(){
    var g = Math.floor(Number(HB_Shared.DASH_GAP_PX) || 0);
    if(!isFinite(g) || g < 0) { g = 0; }
    return g;
}

function hbDashPxGet(mode){
    var cell = hbDashCellGet(mode);
    var unit = hbDashUnitPxGet(mode);
    var w = cell.w * unit;
    var h = cell.h * unit;
    if(w < 32) { w = 32; }
    if(h < 32) { h = 32; }
    return { w: w, h: h };
}

function hbEsc(s){
    var t = String(typeof s === 'undefined' ? '' : s);
    var out = '';
    for(var i = 0; i < t.length; i += 1){
        var ch = t[i];
        if(ch === '&') { out += '&amp;'; continue; }
        if(ch === '<') { out += '&lt;'; continue; }
        if(ch === '>') { out += '&gt;'; continue; }
        if(ch === '"') { out += '&quot;'; continue; }
        if(ch === "'") { out += '&#39;'; continue; }
        out += ch;
    }
    return out;
}
function hbItemGetById(id){
    var key = String(id || '');
    if(!key) { return null; }
    var cat = (typeof HB_ITEM_CATALOG !== 'undefined') ? HB_ITEM_CATALOG : null;
    if(!cat) { console.error('HB_ITEM_CATALOG_MISSING'); return null; }

    if(typeof cat.length === 'number'){
        for(var i = 0; i < cat.length; i += 1){
            var it = cat[i];
            if(it && String(it.id || '') === key) { return it; }
        }
        console.error('HB_ITEM_NOT_FOUND', key);
        return null;
    }

    if(cat[key]) { return cat[key]; }

    for(var k in cat){
        if(!Object.prototype.hasOwnProperty.call(cat, k)) { continue; }
        var it2 = cat[k];
        if(it2 && String(it2.id || '') === key) { return it2; }
    }

    console.error('HB_ITEM_NOT_FOUND', key);
    return null;
}

function hbItemWidgetHtmlGet(id){
    var it = hbItemGetById(id);
    if(!it) { return ''; }
    var v = String(it.WidgetHTML || '');
    if(!v) { console.error('HB_ITEM_WIDGETHTML_MISSING', String(id||'')); }
    return v;
}

function hbItemFullHtmlGet(id){
    var it = hbItemGetById(id);
    if(!it) { return ''; }
    var v = String(it.FullHTML || '');
    if(!v) { console.error('HB_ITEM_FULLHTML_MISSING', String(id||'')); }
    return v;
}

function hbItemWidgetUrlGet(id){
    return hbItemWidgetHtmlGet(id);
}

function hbItemFullUrlGet(id){
    return hbItemFullHtmlGet(id);
}

function hbDashSpanGet(id){
    var it = hbItemGetById(id);
    var w = 1;
    var h = 1;
    if(it){
        w = Math.floor(Number(it.dashSpanW) || 1);
        h = Math.floor(Number(it.dashSpanH) || 1);
    }
    if(w < 1) { w = 1; }
    if(h < 1) { h = 1; }
    if(w > 6) { w = 6; }
    if(h > 6) { h = 6; }
    return { w:w, h:h };
}

function hbDashGridFromCfg(cfg){
    var list = (cfg && cfg.dash && Array.isArray(cfg.dash.grid)) ? cfg.dash.grid : [];
    var out = [];
    var seen = {};
    for(var i = 0; i < list.length; i += 1){
        var g = list[i];
        if(!g || typeof g !== 'object') { continue; }
        var id = String(g.id || '').trim();
        if(!id) { continue; }
        if(seen[id]) { continue; }
        var it = hbItemGetById(id);
        if(!it || !it.hasWidget) { continue; }
        var c = Math.floor(Number(g.c) || 0);
        var r = Math.floor(Number(g.r) || 0);
        if(c < 0) { c = 0; }
        if(r < 0) { r = 0; }
        out.push({ id:id, c:c, r:r });
        seen[id] = 1;
    }
    return out;
}
