(function () {
  var TG = "https://t.me/hochunout",
    VK = "https://vk.com/hochunout",
    TEL = "+79641847373";
  function $(s, r) {
    return (r || document).querySelector(s);
  }
  function $$(s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  }
  function toast(t) {
    var e = $(".toast");
    if (!e) {
      e = document.createElement("div");
      e.className = "toast";
      document.body.appendChild(e);
    }
    e.textContent = t;
    e.classList.add("on");
    setTimeout(function () {
      e.classList.remove("on");
    }, 2600);
  }
  function fmt(n) {
    return n.toLocaleString("ru-RU") + " ₽";
  }
  /* burger */
  var bg = $(".burger"),
    mn = $("nav.menu");
  if (bg)
    bg.addEventListener("click", function () {
      mn.classList.toggle("on");
    });
  /* reveal */
  var io = new IntersectionObserver(
    function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("v");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  $$(".rv-in").forEach(function (e) {
    io.observe(e);
  });
  /* modal */
  var md = document.createElement("div");
  md.className = "modal";
  md.innerHTML =
    '<div class="mb"><button class="x" aria-label="Закрыть">×</button><h3 id="mt">Заказать</h3><p id="mp">Выберите удобный способ связи — ответим быстро.</p><a class="btn p" href="tel:' +
    TEL +
    '">📞 Позвонить +7 964 184 73 73</a><a class="btn d" target="_blank" rel="noopener" href="' +
    TG +
    '">✈️ Написать в Telegram</a><a class="btn g" target="_blank" rel="noopener" href="' +
    VK +
    '">ВКонтакте</a></div>';
  document.body.appendChild(md);
  md.addEventListener("click", function (e) {
    if (e.target === md || e.target.className === "x") md.classList.remove("on");
  });
  window.openOrder = function (title, msg) {
    $("#mt", md).textContent = title || "Заказать";
    $("#mp", md).textContent = msg || "Выберите удобный способ связи — ответим быстро.";
    md.classList.add("on");
  };
  $$("[data-order]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      openOrder(b.getAttribute("data-order"));
    });
  });
  /* trade-in form */
  var tf = $("#tradein-form");
  if (tf)
    tf.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(tf);
      var t =
        "Хочу оценить телефон по Trade-in:\nМодель: " +
        d.get("model") +
        "\nСостояние: " +
        d.get("cond") +
        "\nАккумулятор: " +
        (d.get("bat") || "—") +
        "%\nКоробка: " +
        d.get("box") +
        "\nИмя: " +
        d.get("name") +
        "\nТелефон: " +
        d.get("phone");
      var done = function () {
        toast("Текст заявки скопирован — вставьте его в Telegram");
        setTimeout(function () {
          window.open(TG, "_blank");
        }, 700);
      };
      if (navigator.clipboard && navigator.clipboard.writeText)
        navigator.clipboard.writeText(t).then(done, done);
      else done();
    });
  /* catalog */
  var cat = $("#catalog");
  if (cat && window.IPHONES) {
    var st = { f: "all", q: "", s: "def" },
      list = window.IPHONES;
    var chips = $("#chips");
    var series = [
      ["all", "Все"],
      ["18", "iPhone 18"],
      ["17", "iPhone 17"],
      ["16", "iPhone 16"],
      ["15", "iPhone 15"],
      ["14", "iPhone 14"],
      ["duo", "Duo"],
    ];
    chips.innerHTML = series
      .map(function (s) {
        return (
          '<button class="chip' +
          (s[0] === "all" ? " on" : "") +
          '" data-f="' +
          s[0] +
          '">' +
          s[1] +
          "</button>"
        );
      })
      .join("");
    chips.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", chips).forEach(function (c) {
        c.classList.remove("on");
      });
      b.classList.add("on");
      st.f = b.dataset.f;
      draw();
    });
    $("#q").addEventListener("input", function (e) {
      st.q = e.target.value.toLowerCase();
      draw();
    });
    $("#sort").addEventListener("change", function (e) {
      st.s = e.target.value;
      draw();
    });
    var minP = function (m) {
      var a = [];
      m.g.forEach(function (g) {
        g.p.forEach(function (x) {
          a.push(x[1]);
        });
      });
      return Math.min.apply(null, a);
    };
    function draw() {
      var r = list.filter(function (m) {
        return (st.f === "all" || m.s === st.f) && m.n.toLowerCase().indexOf(st.q) > -1;
      });
      if (st.s === "asc")
        r.sort(function (a, b) {
          return minP(a) - minP(b);
        });
      if (st.s === "desc")
        r.sort(function (a, b) {
          return minP(b) - minP(a);
        });
      cat.innerHTML = r.length
        ? r
            .map(function (m, i) {
              var det = m.g
                .map(function (g) {
                  return (
                    '<div class="grp"><h5>' +
                    g.l +
                    "</h5>" +
                    g.p
                      .map(function (x) {
                        return (
                          "<div><span>" +
                          (x[0] || "Все цвета") +
                          "</span><b>" +
                          fmt(x[1]) +
                          "</b></div>"
                        );
                      })
                      .join("") +
                    "</div>"
                  );
                })
                .join("");
              return (
                '<article class="pc rv-in v"><div class="im"><img src="' +
                m.i +
                '" alt="' +
                m.n +
                '" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.innerHTML=\'<span style=font-size:70px>📱</span>\'"></div><div class="bd"><h3>' +
                m.n +
                '</h3><div class="nt">' +
                m.t +
                '</div><div class="sp">' +
                m.sp.join("<br>") +
                '</div><div class="pr">от<b>' +
                fmt(minP(m)) +
                '</b></div><div class="ac"><button class="btn g sm" data-tg>Цены и цвета</button><button class="btn p sm" data-buy="' +
                m.n +
                '">Заказать</button></div></div><div class="det">' +
                det +
                "</div></article>"
              );
            })
            .join("")
        : '<div class="empty">Ничего не найдено. Попробуйте другой запрос или позвоните нам — подскажем по наличию.</div>';
    }
    cat.addEventListener("click", function (e) {
      var t = e.target.closest("[data-tg]");
      if (t) {
        t.closest(".pc").classList.toggle("open");
        return;
      }
      var b = e.target.closest("[data-buy]");
      if (b)
        openOrder(
          "Заказать " + b.dataset.buy,
          "Скажите модель, память и цвет — подтвердим наличие и цену.",
        );
    });
    draw();
  }
})();
