!function(t, e) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("d3-collection"), require("d3-selection")) : "function" == typeof define && define.amd ? define(["d3-collection", "d3-selection"], e) : (t.d3 = t.d3 || {},
  t.d3.tip = e(t.d3, t.d3))
}(this, function(l, i) {
  "use strict";
  return function() {
      var u = function() {
          return "n"
      }
        , c = function() {
          return [0, 0]
      }
        , a = function() {
          return " "
      }
        , p = document.body
        , n = t()
        , r = null
        , y = null
        , d = null;
      function h(t) {
          var e;
          e = t.node(),
          (r = e ? "svg" === e.tagName.toLowerCase() ? e : e.ownerSVGElement : null) && (y = r.createSVGPoint(),
          p.appendChild(n))
      }
      h.show = function() {
          var t = Array.prototype.slice.call(arguments);
          t[t.length - 1]instanceof SVGElement && (d = t.pop());
          var e, n = a.apply(this, t), r = c.apply(this, t), o = u.apply(this, t), l = v(), i = x.length, s = document.documentElement.scrollTop || p.scrollTop, f = document.documentElement.scrollLeft || p.scrollLeft;
          for (l.html(n).style("opacity", 1).style("pointer-events", "all"); i--; )
              l.classed(x[i], !1);
          return e = m.get(o).apply(this),
          l.classed(o, !0).style("top", e.top + r[0] + s + "px").style("left", e.left + r[1] + f + "px"),
          h
      }
      ,
      h.hide = function() {
          return v().style("opacity", 0).style("pointer-events", "none"),
          h
      }
      ,
      h.attr = function(t, e) {
          if (arguments.length < 2 && "string" == typeof t)
              return v().attr(t);
          var n = Array.prototype.slice.call(arguments);
          return i.selection.prototype.attr.apply(v(), n),
          h
      }
      ,
      h.style = function(t, e) {
          if (arguments.length < 2 && "string" == typeof t)
              return v().style(t);
          var n = Array.prototype.slice.call(arguments);
          return i.selection.prototype.style.apply(v(), n),
          h
      }
      ,
      h.direction = function(t) {
          return arguments.length ? (u = null == t ? t : o(t),
          h) : u
      }
      ,
      h.offset = function(t) {
          return arguments.length ? (c = null == t ? t : o(t),
          h) : c
      }
      ,
      h.html = function(t) {
          return arguments.length ? (a = null == t ? t : o(t),
          h) : a
      }
      ,
      h.rootElement = function(t) {
          return arguments.length ? (p = null == t ? t : o(t),
          h) : p
      }
      ,
      h.destroy = function() {
          return n && (v().remove(),
          n = null),
          h
      }
      ;
      var m = l.map({
          n: function() {
              var t = e(this);
              return {
                  top: t.n.y - n.offsetHeight,
                  left: t.n.x - n.offsetWidth / 2
              }
          },
          s: function() {
              var t = e(this);
              return {
                  top: t.s.y,
                  left: t.s.x - n.offsetWidth / 2
              }
          },
          e: function() {
              var t = e(this);
              return {
                  top: t.e.y - n.offsetHeight / 2,
                  left: t.e.x
              }
          },
          w: function() {
              var t = e(this);
              return {
                  top: t.w.y - n.offsetHeight / 2,
                  left: t.w.x - n.offsetWidth
              }
          },
          nw: function() {
              var t = e(this);
              return {
                  top: t.nw.y - n.offsetHeight,
                  left: t.nw.x - n.offsetWidth
              }
          },
          ne: function() {
              var t = e(this);
              return {
                  top: t.ne.y - n.offsetHeight,
                  left: t.ne.x
              }
          },
          sw: function() {
              var t = e(this);
              return {
                  top: t.sw.y,
                  left: t.sw.x - n.offsetWidth
              }
          },
          se: function() {
              var t = e(this);
              return {
                  top: t.se.y,
                  left: t.se.x
              }
          }
      })
        , x = m.keys();
      function t() {
          var t = i.select(document.createElement("div"));
          return t.style("position", "absolute").style("top", 0).style("opacity", 0).style("pointer-events", "none").style("box-sizing", "border-box"),
          t.node()
      }
      function v() {
          return null == n && (n = t(),
          p.appendChild(n)),
          i.select(n)
      }
      function e(t) {
          for (var e = d || t; null == e.getScreenCTM && null != e.parentNode; )
              e = e.parentNode;
          var n = {}
            , r = e.getScreenCTM()
            , o = e.getBBox()
            , l = o.width
            , i = o.height
            , s = o.x
            , f = o.y;
          return y.x = s,
          y.y = f,
          n.nw = y.matrixTransform(r),
          y.x += l,
          n.ne = y.matrixTransform(r),
          y.y += i,
          n.se = y.matrixTransform(r),
          y.x -= l,
          n.sw = y.matrixTransform(r),
          y.y -= i / 2,
          n.w = y.matrixTransform(r),
          y.x += l,
          n.e = y.matrixTransform(r),
          y.x -= l / 2,
          y.y -= i / 2,
          n.n = y.matrixTransform(r),
          y.y += i,
          n.s = y.matrixTransform(r),
          n
      }
      function o(t) {
          return "function" == typeof t ? t : function() {
              return t
          }
      }
      return h
  }
});
