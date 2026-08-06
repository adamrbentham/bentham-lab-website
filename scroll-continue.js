(function () {
  "use strict";

  var PAGE_ORDER = [
    "index.html",
    "research.html",
    "people.html",
    "publications.html",
    "recognition.html",
    "join.html",
    "contact.html"
  ];

  var body = document.body;
  var currentPage = body.getAttribute("data-page");
  if (!currentPage || PAGE_ORDER.indexOf(currentPage) === -1) return;

  var mainEl = document.querySelector("main");
  var footerEl = document.querySelector("footer.site-footer");
  var tailScript = document.querySelector("body > script:last-of-type");
  if (!mainEl || !footerEl) return;

  var chain = [currentPage];
  var loading = false;
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var navLinks = document.querySelectorAll(".main-nav a");

  function nextOf(page) {
    var i = PAGE_ORDER.indexOf(page);
    if (i === -1 || i === PAGE_ORDER.length - 1) return null;
    return PAGE_ORDER[i + 1];
  }

  function setActiveNav(page) {
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === page) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  function observeMarker(marker) {
    if ("IntersectionObserver" in window) {
      var revealObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
      );
      revealObs.observe(marker);

      var spyObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var page = entry.target.getAttribute("data-page");
              var title = entry.target.getAttribute("data-title");
              if (title) document.title = title;
              if (window.history && window.history.pushState) {
                window.history.replaceState(
                  null,
                  "",
                  page === "index.html" ? "./" : page
                );
              }
              setActiveNav(page);
            }
          });
        },
        { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
      );
      spyObs.observe(marker);
    } else {
      marker.classList.add("is-visible");
    }
  }

  function loadNext() {
    var last = chain[chain.length - 1];
    var next = nextOf(last);
    if (!next || loading) return;
    loading = true;

    fetch(next)
      .then(function (res) {
        if (!res.ok) throw new Error("fetch failed: " + next);
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var nextMain = doc.querySelector("main");
        var nextFooter = doc.querySelector("footer.site-footer");
        if (!nextMain) {
          loading = false;
          return;
        }

        var marker = document.createElement("div");
        marker.className = "loaded-page" + (reduceMotion ? " is-visible" : "");
        marker.setAttribute("data-page", next);
        marker.setAttribute("data-title", doc.title || "");

        var pageBreak = document.createElement("div");
        pageBreak.className = "page-break container";
        pageBreak.setAttribute("role", "presentation");
        pageBreak.setAttribute("aria-hidden", "true");
        pageBreak.innerHTML =
          '<span class="page-break-rule"></span>' +
          '<svg class="page-break-mark" viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="20" cy="10" r="7.5" fill="none" stroke="#e2966f" stroke-width="1.3" stroke-dasharray="2.6 2.6"/>' +
          '<circle cx="20" cy="10" r="2.2" fill="#e2966f"/>' +
          "</svg>" +
          '<span class="page-break-rule"></span>';
        marker.appendChild(pageBreak);

        while (nextMain.firstChild) {
          marker.appendChild(nextMain.firstChild);
        }

        if (footerEl) footerEl.remove();
        mainEl.appendChild(marker);

        if (nextFooter) {
          if (tailScript) {
            document.body.insertBefore(nextFooter, tailScript);
          } else {
            document.body.appendChild(nextFooter);
          }
          footerEl = nextFooter;
        }

        chain.push(next);
        observeMarker(marker);
        loading = false;
        checkScroll();
      })
      .catch(function () {
        loading = false;
      });
  }

  function checkScroll() {
    var scrollBottom = window.scrollY + window.innerHeight;
    if (scrollBottom >= document.body.offsetHeight - 800) {
      loadNext();
    }
  }

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  checkScroll();
})();
