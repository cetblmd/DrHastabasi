function URLParametreOku(param){
    var s = String(window.location.search || '');
    if(s){
        if(s.charAt(0) === '?') { s = s.slice(1); }
        var p = String(param || '').toLowerCase();
        var parts = s.split('&');
        for(var i = 0; i < parts.length; i += 1){
            var kv = parts[i].split('=');
            if(!kv || kv.length === 0) { continue; }
            var k = decodeURIComponent(String(kv[0] || '').replace(/\+/g, ' ')).toLowerCase();
            if(k !== p) { continue; }
            return decodeURIComponent(String(kv.slice(1).join('=') || '').replace(/\+/g, ' '));
        }
    }
    return '';
}

var HB_ITEM_CATALOG = {
    'laboratuvar': { id: 'laboratuvar', title: 'Laboratuvar', hasWidget: 1, WidgetHTML: 'Items/LabWidget.html', FullHTML: 'Items/LabFull.html', iconKey: 'lab', dashSpanW: 4, dashSpanH: 4, },
    'radyoloji': { id: 'radyoloji', title: 'Radyoloji', hasWidget: 1, WidgetHTML: 'Items/RadWidget.html', FullHTML: 'Items/RadFull.html', iconKey: 'xray', dashSpanW: 4, dashSpanH: 4, },
    'tani': { id: 'tani', title: 'Tanılar', hasWidget: 1, WidgetHTML: 'Items/TaniWidget.html', FullHTML: 'Items/TaniFull.html', iconKey: 'diagnosis', dashSpanW: 4, dashSpanH: 4, },
    'test1': { id: 'test1', title: 'test1', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 6, dashSpanH: 4, },
    'test2': { id: 'test2', title: 'test2', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 1, },
    'test3': { id: 'test3', title: 'test3', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 2, },
    'test4': { id: 'test4', title: 'test4', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 1, },
    'test5': { id: 'test5', title: 'test5', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 2, },
    'test6': { id: 'test6', title: 'test6', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 1, },
    'test7': { id: 'test7', title: 'test7', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 1, },
    'test8': { id: 'test8', title: 'test8', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 2, },
    'test9': { id: 'test9', title: 'test9', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 1, },
    'test10': { id: 'test10', title: 'test10', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 2, },
    'test11': { id: 'test11', title: 'test11', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 1, },
    'test12': { id: 'test12', title: 'test12', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 3, },
    'test13': { id: 'test13', title: 'test13', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 2, },
    'test14': { id: 'test14', title: 'test14', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 1, },
    'test15': { id: 'test15', title: 'test15', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 3, },
    'test16': { id: 'test16', title: 'test16', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 1, },
    'test17': { id: 'test17', title: 'test17', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 1, },
    'test18': { id: 'test18', title: 'test18', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 2, },
    'test19': { id: 'test19', title: 'test19', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 1, },
    'test20': { id: 'test20', title: 'test20', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 3, },
    'test21': { id: 'test21', title: 'test21', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 1, },
    'test22': { id: 'test22', title: 'test22', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 1, },
    'test23': { id: 'test23', title: 'test23', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 2, },
    'test24': { id: 'test24', title: 'test24', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 1, },
    'test25': { id: 'test25', title: 'test25', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 1, },
    'test26': { id: 'test26', title: 'test26', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 1, },
    'test27': { id: 'test27', title: 'test27', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 1, },
    'test28': { id: 'test28', title: 'test28', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 2, },
    'test29': { id: 'test29', title: 'test29', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 1, },
    'test30': { id: 'test30', title: 'test30', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 2, },
    'test31': { id: 'test31', title: 'test31', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 1, },
    'test32': { id: 'test32', title: 'test32', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 1, },
    'test33': { id: 'test33', title: 'test33', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 1, dashSpanH: 2, },
    'test34': { id: 'test34', title: 'test34', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 1, },
    'test35': { id: 'test35', title: 'test35', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 2, dashSpanH: 2, },
    'test36': { id: 'test36', title: 'test36', hasWidget: 1, WidgetHTML: 'Items/TestWidget.html', FullHTML: 'Items/TestFull.html', iconKey: 'test', dashSpanW: 3, dashSpanH: 2, },
};

var __hb_svgIcons = {
    lab: "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'><path d='M10 2v6l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V2' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/><path d='M8 8h8' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M7.2 16h9.6' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' opacity='0.9'/></svg>",
    xray: "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'><path d='M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z' fill='none' stroke='currentColor' stroke-width='2' stroke-linejoin='round'/><path d='M8 8c1.2 0 2 1 2 2.2V14' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M16 8c-1.2 0-2 1-2 2.2V14' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M10 12h4' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/></svg>",
    diagnosis: "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'><path d='M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z' fill='none' stroke='currentColor' stroke-width='2' stroke-linejoin='round'/><path d='M9 8h6' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M9 12h6' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M9 16h4' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M7.8 12.1l1 1 2.1-2.1' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' opacity='0.9'/></svg>"
,test: "<svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'><path d='M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z' fill='none' stroke='currentColor' stroke-width='2' stroke-linejoin='round'/><path d='M9 8h6' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M9 12h6' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M9 16h4' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'/><path d='M7.8 12.1l1 1 2.1-2.1' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' opacity='0.9'/></svg>"
};
var HB_Cfg = (function(){
    var _ns = 'HB_UI_CFG::';

    function _numOrZero(v){
        var n = Number(v);
        if(!isFinite(n) || n <= 0) { return 0; }
        return Math.floor(n);
    }

    function _key(drid){
        return _ns + String(_numOrZero(drid));
    }

    function _lsGet(k){
        try {
            return String(localStorage.getItem(k) || '');
        } catch(e) {
            console.error('HB_CFG_LS_GET_FAIL', e);
            return '';
        }
    }

    function _lsSet(k, v){
        try {
            localStorage.setItem(k, String(v));
            return 1;
        } catch(e) {
            console.error('HB_CFG_LS_SET_FAIL', e);
            return 0;
        }
    }

    function _lsRemove(k){
        try {
            localStorage.removeItem(k);
            return 1;
        } catch(e) {
            console.error('HB_CFG_LS_REMOVE_FAIL', e);
            return 0;
        }
    }

    function _parseJson(raw){
        if(!raw) { return null; }
        try {
            return JSON.parse(raw);
        } catch(e) {
            console.error('HB_CFG_JSON_PARSE_FAIL', e);
            return null;
        }
    }

    function _toJson(obj){
        try {
            return JSON.stringify(obj || {});
        } catch(e) {
            console.error('HB_CFG_JSON_STRINGIFY_FAIL', e);
            return '';
        }
    }

    function _ensureRoot(obj){
        var o = (obj && typeof obj === 'object') ? obj : {};
        if(!o.v) { o.v = 1; }
        if(!o.menu) { o.menu = {}; }
        if(!o.dash) { o.dash = {}; }
        if(!o.theme) { o.theme = {}; }
        return o;
    }

    function getBlob(drid){
        var k = _key(drid);
        var raw = _lsGet(k);
        var obj = _parseJson(raw);
        return _ensureRoot(obj);
    }

    function saveBlob(drid, blob){
        var k = _key(drid);
        var o = _ensureRoot(blob);
        var raw = _toJson(o);
        if(!raw) { return 0; }
        return _lsSet(k, raw);
    }

    function removeBlob(drid){
        var k = _key(drid);
        return _lsRemove(k);
    }

    function _pathParts(path){
        var p = String(path || '').trim();
        if(!p) { return []; }
        return p.split('.').filter(function(x){ return !!String(x || '').trim(); });
    }

    function getPath(drid, path, defVal){
        var root = getBlob(drid);
        var parts = _pathParts(path);
        if(parts.length === 0) { return root; }

        var cur = root;
        var i = 0;

        for(i = 0; i < parts.length; i += 1){
            var k = parts[i];
            if(cur && typeof cur === 'object' && (k in cur)) {
                cur = cur[k];
            } else {
                return defVal;
            }
        }

        return cur;
    }

    function setPath(drid, path, val){
        var parts = _pathParts(path);
        if(parts.length === 0) {
            console.error('HB_CFG_SET_PATH_EMPTY');
            return 0;
        }

        var root = getBlob(drid);
        var cur = root;
        var i = 0;

        for(i = 0; i < parts.length - 1; i += 1){
            var k = parts[i];
            if(!cur[k] || typeof cur[k] !== 'object') {
                cur[k] = {};
            }
            cur = cur[k];
        }

        cur[parts[parts.length - 1]] = val;

        return saveBlob(drid, root);
    }

    function removePath(drid, path){
        var parts = _pathParts(path);
        if(parts.length === 0) {
            console.error('HB_CFG_REMOVE_PATH_EMPTY');
            return 0;
        }

        var root = getBlob(drid);
        var cur = root;
        var i = 0;

        for(i = 0; i < parts.length - 1; i += 1){
            var k = parts[i];
            if(!cur || typeof cur !== 'object' || !(k in cur)) {
                return 0;
            }
            cur = cur[k];
        }

        if(cur && typeof cur === 'object') {
            delete cur[parts[parts.length - 1]];
        }

        return saveBlob(drid, root);
    }

    function get(key, defVal){
        var k = String(key || '').trim();
        if(!k) { return defVal; }
        var raw = _lsGet(k);
        var obj = _parseJson(raw);
        if(obj == null) { return defVal; }
        return obj;
    }

    function set(key, val){
        var k = String(key || '').trim();
        if(!k) {
            console.error('HB_CFG_SET_KEY_EMPTY');
            return 0;
        }
        var raw = _toJson(val);
        if(!raw) { return 0; }
        return _lsSet(k, raw);
    }

    function remove(key){
        var k = String(key || '').trim();
        if(!k) {
            console.error('HB_CFG_REMOVE_KEY_EMPTY');
            return 0;
        }
        return _lsRemove(k);
    }

    function key(scope, name, drid){
        var s = String(scope || '').trim().toUpperCase();
        var n = String(name || '').trim().toUpperCase();
        var d = _numOrZero(drid);
        if(!s || !n) {
            console.error('HB_CFG_KEY_BAD', { scope: scope, name: name });
            return '';
        }
        return 'HB::' + String(d) + '::' + s + '::' + n;
    }

    return {
        getBlob: getBlob,
        saveBlob: saveBlob,
        removeBlob: removeBlob,
        getPath: getPath,
        setPath: setPath,
        removePath: removePath,
        get: get,
        set: set,
        remove: remove,
        key: key,
    };
})();


// Layout constants (shared)
var HB_LAYOUT_CONST = {
  ROW2_MOBILE: 0,
  ROW2_TABLET: 12,
  ROW2_PC: 22
};
function __hb_row2MaxSlotsFromConst(){
    var w = 0;
    try{
        if(typeof __hb_layoutViewportW === 'function') {
            w = Math.floor(Number(__hb_layoutViewportW() || 0));
        }
        if(!w || !isFinite(w) || w <= 0){
            w = Math.floor(Number(window.innerWidth || 0));
        }
        if(!w || !isFinite(w) || w <= 0){
            w = Math.floor(Number((window.screen && window.screen.width) ? window.screen.width : 0));
        }
    }catch(e){
        w = 0;
    }
    if(w > 0 && w <= 768) return (window.HB_LAYOUT_CONST ? HB_LAYOUT_CONST.ROW2_MOBILE : 14);
    if(w > 0 && w <= 1024) return (window.HB_LAYOUT_CONST ? HB_LAYOUT_CONST.ROW2_TABLET : 16);
    return (window.HB_LAYOUT_CONST ? HB_LAYOUT_CONST.ROW2_PC : 20);
}
