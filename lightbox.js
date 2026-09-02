(function () {
  "use strict";

  var overlay, imgEl, counterEl;
  var photos = [];
  var idx = 0;

  function build() {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay is-hidden";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML =
      '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-prev" aria-label="Previous photo">&larr;</button>' +
      '<div class="lightbox-figure">' +
      '<img alt="">' +
      '<span class="lightbox-counter"></span>' +
      "</div>" +
      '<button class="lightbox-next" aria-label="Next photo">&rarr;</button>';
    document.body.appendChild(overlay);

    imgEl = overlay.querySelector("img");
    counterEl = overlay.querySelector(".lightbox-counter");

    overlay.querySelector(".lightbox-close").addEventListener("click", close);
    overlay.querySelector(".lightbox-prev").addEventListener("click", prev);
    overlay.querySelector(".lightbox-next").addEventListener("click", next);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
  }

  function show() {
    imgEl.src = photos[idx].src;
    imgEl.alt = photos[idx].alt || "";
    counterEl.textContent = photos.length > 1 ? (idx + 1) + " / " + photos.length : "";
  }

  function open(list, startIdx) {
    photos = list;
    idx = startIdx || 0;
    show();
    overlay.classList.remove("is-hidden");
  }

  function close() {
    overlay.classList.add("is-hidden");
  }

  function next() {
    idx = (idx + 1) % photos.length;
    show();
  }

  function prev() {
    idx = (idx - 1 + photos.length) % photos.length;
    show();
  }

  document.addEventListener("DOMContentLoaded", build);

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest && e.target.closest(".item-photo.has-lightbox");
    if (!trigger || !overlay) return;
    var raw = trigger.getAttribute("data-photos") || "";
    var list = raw.split("|").filter(Boolean).map(function (src) {
      return { src: src, alt: trigger.querySelector("img") ? trigger.querySelector("img").alt : "" };
    });
    if (!list.length) return;
    open(list, 0);
  });

  document.addEventListener("keydown", function (e) {
    if (!overlay || overlay.classList.contains("is-hidden")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });
})();
