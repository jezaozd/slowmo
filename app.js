(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── появление блоков ── */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* ── шапка и мобильная кнопка ── */
  var hd = $('#hd'), fab = $('.fab'), hero = $('.hero'), ft = $('.ft');
  function onScroll() {
    var y = window.scrollY, h = hero.offsetHeight;
    hd.classList.toggle('solid', y > h - 80);
    var nearEnd = ft.getBoundingClientRect().top < window.innerHeight * 0.9;
    fab.classList.toggle('on', y > h * 0.6 && !nearEnd);
    light();
  }

  /* ── текст, который проявляется по мере чтения ── */
  var lit = $('#lit'), words = [];
  if (lit) {
    lit.innerHTML = lit.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="w">' + w + '</span>';
    }).join(' ');
    words = $$('.w', lit);
  }
  function light() {
    if (!words.length) return;
    var r = lit.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.86 - r.top) / (r.height + vh * 0.36);
    var n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
    for (var i = 0; i < words.length; i++) words[i].classList.toggle('lit', i < n);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ── московское время ── */
  var msk = $('#msk');
  function tick() {
    try {
      msk.textContent = new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit' }).format(new Date());
    } catch (e) {}
  }
  if (msk) { tick(); setInterval(tick, 15000); }

  /* ── меню ── */
  var burger = $('#burger'), menu = $('#menu');
  function setMenu(on) {
    menu.classList.toggle('on', on); hd.classList.toggle('open', on);
    burger.setAttribute('aria-expanded', on); menu.setAttribute('aria-hidden', !on);
    document.body.style.overflow = on ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('on')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ── филиалы ── */
  var tabs = $$('[data-tab]'), panels = $$('[data-panel]');
  function show(id) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === id;
      t.classList.toggle('on', on); t.setAttribute('aria-selected', on);
    });
    panels.forEach(function (p) {
      var on = p.dataset.panel === id;
      p.hidden = !on; p.classList.toggle('on', on);
      if (on) $('[data-gal]', p).scrollLeft = 0;
    });
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.tab); }); });
  $$('[data-go]').forEach(function (a) { a.addEventListener('click', function () { show(a.dataset.go); }); });

  /* ── галерея: перетаскивание мышью ── */
  $$('[data-gal]').forEach(function (g) {
    var down = false, sx = 0, sl = 0;
    g.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; sx = e.clientX; sl = g.scrollLeft; g.classList.add('drag');
    });
    window.addEventListener('pointermove', function (e) { if (down) g.scrollLeft = sl - (e.clientX - sx); });
    window.addEventListener('pointerup', function () { down = false; g.classList.remove('drag'); });
  });

  /* ── запись ── */
  var bk = $('#bk'), last = null;
  function setBk(on) {
    bk.classList.toggle('on', on); bk.setAttribute('aria-hidden', !on);
    document.body.style.overflow = on ? 'hidden' : '';
    if (on) { last = document.activeElement; $('.bk-x', bk).focus(); } else if (last) last.focus();
  }
  $$('[data-book]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false); setBk(true); }); });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', function () { setBk(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setBk(false); setMenu(false); } });

  /* ── сертификат: лёгкий наклон за курсором ── */
  var card = $('#card');
  if (card && window.matchMedia('(hover:hover)').matches) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 16 + 'deg');
      card.style.setProperty('--rx', (0.5 - (e.clientY - r.top) / r.height) * 12 + 'deg');
    });
    card.addEventListener('pointerleave', function () {
      card.style.removeProperty('--ry'); card.style.removeProperty('--rx');
    });
  }
})();
