/* Recent moments: desktop navigation for the horizontal gallery.
   Adds prev/next buttons beside the heading, edge fades with a hover
   arrow, and a thin clickable/draggable progress line. Only runs on
   devices with a fine pointer that can hover (mouse/trackpad), so touch
   devices keep the native swipe behaviour unchanged. */
(function () {
  "use strict";

  var desktop = window.matchMedia("(hover: hover) and (pointer: fine)");

  function init(gallery) {
    if (gallery.dataset.navReady) return;
    gallery.dataset.navReady = "1";

    var section = gallery.closest("section");
    var heading = section && section.querySelector("h2");

    // Wrap the gallery so fades and the hover arrow can sit over its edges.
    var wrap = document.createElement("div");
    wrap.className = "gallery-wrap";
    gallery.parentNode.insertBefore(wrap, gallery);
    wrap.appendChild(gallery);

    var fadeL = document.createElement("div");
    fadeL.className = "gallery-fade gallery-fade--left";
    var fadeR = document.createElement("div");
    fadeR.className = "gallery-fade gallery-fade--right";
    wrap.appendChild(fadeL);
    wrap.appendChild(fadeR);

    var hoverPrev = makeButton("gallery-hover-arrow gallery-hover-arrow--left", "Previous moments", "‹");
    var hoverNext = makeButton("gallery-hover-arrow gallery-hover-arrow--right", "Next moments", "›");
    // The hover arrows duplicate the heading buttons, so hide them from
    // keyboard and screen-reader users to avoid repeated controls.
    [hoverPrev, hoverNext].forEach(function (b) {
      b.tabIndex = -1;
      b.setAttribute("aria-hidden", "true");
    });
    wrap.appendChild(hoverPrev);
    wrap.appendChild(hoverNext);

    // Heading row with prev/next buttons.
    var headPrev = makeButton("gallery-nav-btn", "Previous moments", "‹");
    var headNext = makeButton("gallery-nav-btn", "Next moments", "›");
    if (heading) {
      var row = document.createElement("div");
      row.className = "gallery-head";
      heading.parentNode.insertBefore(row, heading);
      row.appendChild(heading);
      var nav = document.createElement("div");
      nav.className = "gallery-nav";
      nav.appendChild(headPrev);
      nav.appendChild(headNext);
      row.appendChild(nav);
    }

    // Progress line.
    var track = document.createElement("div");
    track.className = "gallery-progress";
    var thumb = document.createElement("div");
    thumb.className = "gallery-progress-thumb";
    track.appendChild(thumb);
    wrap.parentNode.insertBefore(track, wrap.nextSibling);

    // Keyboard: arrow keys scroll when the strip has focus.
    gallery.tabIndex = 0;
    gallery.setAttribute("role", "region");
    gallery.setAttribute("aria-label", "Recent moments, scroll horizontally");

    function step() {
      var item = gallery.querySelector(".gallery-item");
      if (!item) return gallery.clientWidth;
      var gap = parseFloat(getComputedStyle(gallery).columnGap) || 0;
      var w = item.getBoundingClientRect().width + gap;
      return Math.max(1, Math.floor(gallery.clientWidth / w)) * w;
    }

    function go(dir) {
      gallery.scrollBy({ left: dir * step(), behavior: "smooth" });
    }

    headPrev.addEventListener("click", function () { go(-1); });
    headNext.addEventListener("click", function () { go(1); });
    hoverPrev.addEventListener("click", function () { go(-1); });
    hoverNext.addEventListener("click", function () { go(1); });

    gallery.addEventListener("keydown", function (e) {
      if (e.target !== gallery) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });

    // Click or drag on the progress line.
    var dragging = false;
    function seek(clientX) {
      var r = track.getBoundingClientRect();
      var max = gallery.scrollWidth - gallery.clientWidth;
      var tw = thumb.getBoundingClientRect().width;
      var usable = Math.max(1, r.width - tw);
      var frac = (clientX - r.left - tw / 2) / usable;
      gallery.scrollLeft = Math.min(1, Math.max(0, frac)) * max;
    }
    track.addEventListener("pointerdown", function (e) {
      dragging = true;
      track.setPointerCapture(e.pointerId);
      gallery.style.scrollSnapType = "none";
      gallery.style.scrollBehavior = "auto";
      seek(e.clientX);
    });
    track.addEventListener("pointermove", function (e) { if (dragging) seek(e.clientX); });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      gallery.style.scrollBehavior = "";
      gallery.style.scrollSnapType = "";
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    function update() {
      var max = gallery.scrollWidth - gallery.clientWidth;
      var overflow = max > 2;
      wrap.parentNode.classList.toggle("gallery-overflows", overflow);
      var atStart = gallery.scrollLeft <= 2;
      var atEnd = gallery.scrollLeft >= max - 2;
      headPrev.disabled = !overflow || atStart;
      headNext.disabled = !overflow || atEnd;
      wrap.classList.toggle("at-start", atStart);
      wrap.classList.toggle("at-end", atEnd);
      var visible = overflow ? gallery.clientWidth / gallery.scrollWidth : 1;
      thumb.style.width = (visible * 100) + "%";
      var pos = overflow ? (gallery.scrollLeft / max) * (1 - visible) : 0;
      thumb.style.left = (pos * 100) + "%";
    }

    gallery.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    Array.prototype.forEach.call(gallery.querySelectorAll("img"), function (img) {
      if (!img.complete) img.addEventListener("load", update);
    });
    update();
  }

  function makeButton(cls, label, glyph) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.setAttribute("aria-label", label);
    b.textContent = glyph;
    return b;
  }

  function run() {
    if (!desktop.matches) return;
    document.documentElement.classList.add("has-gallery-nav");
    Array.prototype.forEach.call(document.querySelectorAll(".gallery"), init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
