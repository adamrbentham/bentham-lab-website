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

  // One woven double-helix wavelength (3 periods), reused (and mirrored via
  // CSS) on both sides of the page-break mark. Generated to weave over/under
  // at each crossing rather than just overlapping sine waves.
  var HELIX_STRAND_A =
    "M0.0,34.0 L2.0,36.7 L4.0,39.4 L6.0,42.0 L8.0,44.4 L10.0,46.6 L12.0,48.6 L14.0,50.3 L16.0,51.8 L18.0,52.8 L20.0,53.6 L22.0,54.0 L24.0,54.0 L26.0,53.6 L28.0,52.8 L30.0,51.8 L32.0,50.3 L34.0,48.6 L36.0,46.6 L38.0,44.4 L40.0,42.0 L42.0,39.4 M50.0,28.6 L52.0,26.0 L54.0,23.6 L56.0,21.4 L58.0,19.4 L60.0,17.7 L62.0,16.2 L64.0,15.2 L66.0,14.4 L68.0,14.0 L70.0,14.0 L72.0,14.4 L74.0,15.2 L76.0,16.2 L78.0,17.7 L80.0,19.4 L82.0,21.4 L84.0,23.6 L86.0,26.0 L88.0,28.6 L90.0,31.3 L92.0,34.0 L94.0,36.7 L96.0,39.4 L98.0,42.0 L100.0,44.4 L102.0,46.6 L104.0,48.6 L106.0,50.3 L108.0,51.8 L110.0,52.8 L112.0,53.6 L114.0,54.0 L116.0,54.0 L118.0,53.6 L120.0,52.8 L122.0,51.8 L124.0,50.3 L126.0,48.6 L128.0,46.6 L130.0,44.4 L132.0,42.0 L134.0,39.4 M142.0,28.6 L144.0,26.0 L146.0,23.6 L148.0,21.4 L150.0,19.4 L152.0,17.7 L154.0,16.2 L156.0,15.2 L158.0,14.4 L160.0,14.0 L162.0,14.0 L164.0,14.4 L166.0,15.2 L168.0,16.2 L170.0,17.7 L172.0,19.4 L174.0,21.4 L176.0,23.6 L178.0,26.0 L180.0,28.6 L182.0,31.3 L184.0,34.0 L186.0,36.7 L188.0,39.4 L190.0,42.0 L192.0,44.4 L194.0,46.6 L196.0,48.6 L198.0,50.3 L200.0,51.8 L202.0,52.8 L204.0,53.6 L206.0,54.0 L208.0,54.0 L210.0,53.6 L212.0,52.8 L214.0,51.8 L216.0,50.3 L218.0,48.6 L220.0,46.6 L222.0,44.4 L224.0,42.0 L226.0,39.4 M234.0,28.6 L236.0,26.0 L238.0,23.6 L240.0,21.4 L242.0,19.4 L244.0,17.7 L246.0,16.2 L248.0,15.2 L250.0,14.4 L252.0,14.0 L254.0,14.0 L256.0,14.4 L258.0,15.2 L260.0,16.2 L262.0,17.7 L264.0,19.4 L266.0,21.4 L268.0,23.6 L270.0,26.0 L272.0,28.6 L274.0,31.3 L276.0,34.0";
  var HELIX_STRAND_B =
    "M4.0,28.6 L6.0,26.0 L8.0,23.6 L10.0,21.4 L12.0,19.4 L14.0,17.7 L16.0,16.2 L18.0,15.2 L20.0,14.4 L22.0,14.0 L24.0,14.0 L26.0,14.4 L28.0,15.2 L30.0,16.2 L32.0,17.7 L34.0,19.4 L36.0,21.4 L38.0,23.6 L40.0,26.0 L42.0,28.6 L44.0,31.3 L46.0,34.0 L48.0,36.7 L50.0,39.4 L52.0,42.0 L54.0,44.4 L56.0,46.6 L58.0,48.6 L60.0,50.3 L62.0,51.8 L64.0,52.8 L66.0,53.6 L68.0,54.0 L70.0,54.0 L72.0,53.6 L74.0,52.8 L76.0,51.8 L78.0,50.3 L80.0,48.6 L82.0,46.6 L84.0,44.4 L86.0,42.0 L88.0,39.4 M96.0,28.6 L98.0,26.0 L100.0,23.6 L102.0,21.4 L104.0,19.4 L106.0,17.7 L108.0,16.2 L110.0,15.2 L112.0,14.4 L114.0,14.0 L116.0,14.0 L118.0,14.4 L120.0,15.2 L122.0,16.2 L124.0,17.7 L126.0,19.4 L128.0,21.4 L130.0,23.6 L132.0,26.0 L134.0,28.6 L136.0,31.3 L138.0,34.0 L140.0,36.7 L142.0,39.4 L144.0,42.0 L146.0,44.4 L148.0,46.6 L150.0,48.6 L152.0,50.3 L154.0,51.8 L156.0,52.8 L158.0,53.6 L160.0,54.0 L162.0,54.0 L164.0,53.6 L166.0,52.8 L168.0,51.8 L170.0,50.3 L172.0,48.6 L174.0,46.6 L176.0,44.4 L178.0,42.0 L180.0,39.4 M188.0,28.6 L190.0,26.0 L192.0,23.6 L194.0,21.4 L196.0,19.4 L198.0,17.7 L200.0,16.2 L202.0,15.2 L204.0,14.4 L206.0,14.0 L208.0,14.0 L210.0,14.4 L212.0,15.2 L214.0,16.2 L216.0,17.7 L218.0,19.4 L220.0,21.4 L222.0,23.6 L224.0,26.0 L226.0,28.6 L228.0,31.3 L230.0,34.0 L232.0,36.7 L234.0,39.4 L236.0,42.0 L238.0,44.4 L240.0,46.6 L242.0,48.6 L244.0,50.3 L246.0,51.8 L248.0,52.8 L250.0,53.6 L252.0,54.0 L254.0,54.0 L256.0,53.6 L258.0,52.8 L260.0,51.8 L262.0,50.3 L264.0,48.6 L266.0,46.6 L268.0,44.4 L270.0,42.0 L272.0,39.4";
  var HELIX_SVG =
    '<svg viewBox="0 0 276 68" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="' + HELIX_STRAND_A + '" fill="none" stroke="#8fbfa0" stroke-width="2.2" stroke-linecap="round"/>' +
    '<path d="' + HELIX_STRAND_B + '" fill="none" stroke="#8fbfa0" stroke-width="2.2" stroke-linecap="round"/>' +
    "</svg>";

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
          '<span class="page-break-helix page-break-helix--mirror">' + HELIX_SVG + "</span>" +
          '<svg class="page-break-mark" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="22" cy="22" r="15" fill="none" stroke="#e2966f" stroke-width="2.4" stroke-dasharray="5 5"/>' +
          '<circle cx="22" cy="22" r="4.5" fill="#e2966f"/>' +
          "</svg>" +
          '<span class="page-break-helix">' + HELIX_SVG + "</span>";
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
