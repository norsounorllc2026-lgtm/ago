/* =============================================================================
   AGO SHELL — shared by every American Griot One page
   =============================================================================
   Lives at:  https://norsounorllc2026-lgtm.github.io/ago/shell/ago-shell.js
   Each page loads it with ONE line, placed just before </body>:

     <script src="https://norsounorllc2026-lgtm.github.io/ago/shell/ago-shell.js"
             data-page="hot-16" data-back="#backAgo"></script>

   Options on that line:
     data-page    this page's name (same names as the Wix page addresses)
     data-back    the page's existing back button (it is restyled and rewired,
                  so the page layout does not move). Leave out if none.
     data-member  "on" (default) shows the Sign in / Sign up button (Account once signed in); "off" hides it;
                  "compact" shows only initials for a signed-in member on narrow screens
     data-footer  "on" (default) adds the "More from AGO" strip; "off" leaves it out
     data-band    "on" (default) draws the red-black-green line at the top

   What it gives every page
     1. The same AGO back button: asks the Wix page code to open the landing page,
        and only opens it directly if the page code does not confirm within 1.2 s.
     2. The AGO brand frame (colors named --ago-*, so a page's own theme is untouched).
     3. Members: the Sign in / Sign up button, and window.AGO.member for page scripts.
     4. window.AGO.call(name, ...args): calls an allowed backend function through the
        Wix page code (this is how AI and member features reach the backend).
     5. --ago-screen-h: the visitor's real screen height (inside Wix, 100vh means the
        height of the Wix box, not the phone), for layouts that must fit the screen.

   If this file ever fails to load, each page's old back button is still there and
   still works — the shell only takes it over once it has loaded.
   ========================================================================== */
(function () {
  'use strict';
  if (window.AGO && window.AGO.version) return;            // loaded twice: keep the first

  /* ---- 1. SETTINGS (the only place the site address lives) ------------------ */
  var SITE = 'https://americangriot1.wixsite.com/american-griot-one';   // change once if you add your own domain
  var HOME = 'american-griot-one';
  var ACK_WAIT = 1200;          // ms to wait for the Wix page code before opening the page directly
  var CALL_WAIT = 90000;        // ms before a backend/AI call gives up
  var SECTIONS = [
    ['home', 'Timeline'], ['hot-16', 'Hot 16'], ['culture-tree', 'Culture Tree'],
    ['red-carpet', 'Red Carpet'], ['i-55-corridor', 'I-55 Corridor'],
    ['black-monopoly', 'Black Wall Street'], ['american-capitalism', 'American Capitalism']
  ];

  var me = document.currentScript;
  function attr(n, d) { var v = me && me.getAttribute(n); return v == null || v === '' ? d : v; }
  var OPT = {
    page: attr('data-page', ''),
    back: attr('data-back', ''),
    member: attr('data-member', 'on') !== 'off',
    compact: attr('data-member', 'on') === 'compact',     // icon only on narrow screens (tight headers)
    footer: attr('data-footer', 'on') !== 'off',
    band: attr('data-band', 'on') !== 'off'
  };
  var inFrame = window.parent !== window;

  function urlFor(key) { return key === HOME ? SITE : SITE + '/' + key; }

  /* ---- 2. BRAND FRAME (styles) ---------------------------------------------- */
  var CSS = [
    ':root{--ago-black:#0B0B0B;--ago-ivory:#E9E6DF;--ago-gold:#D4A84A;--ago-red:#B3261E;--ago-green:#2F8F5B;',
    '--ago-line:rgba(212,168,74,.5);--ago-font:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;',
    '--ago-serif:"DM Serif Display",Georgia,"Times New Roman",serif}',
    '.ago-band{position:fixed;left:0;right:0;top:0;height:3px;z-index:2147483000;pointer-events:none;',
    'background:linear-gradient(90deg,var(--ago-black) 0 38%,var(--ago-red) 38% 46%,var(--ago-black) 46% 47%,var(--ago-green) 47% 60%,var(--ago-black) 60% 100%)}',
    '.ago-back.ago-back,.ago-member.ago-member{box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;',
    'gap:7px!important;height:34px!important;min-height:34px!important;padding:0 14px 0 5px!important;margin-top:0!important;margin-bottom:0!important;',
    'border-radius:999px!important;background:var(--ago-black)!important;color:var(--ago-ivory)!important;border:1px solid var(--ago-line)!important;',
    'font:600 13px/1 var(--ago-font)!important;letter-spacing:.01em!important;text-transform:none!important;text-decoration:none!important;',
    'white-space:nowrap!important;cursor:pointer!important;box-shadow:none!important;-webkit-tap-highlight-color:transparent;vertical-align:middle;',
    'width:auto!important;max-width:100%;transition:border-color .15s ease}',
    '.ago-back.ago-back:hover,.ago-member.ago-member:hover{border-color:var(--ago-gold)!important}',
    '.ago-back.ago-back::before,.ago-back.ago-back::after{content:none!important;display:none!important}',
    '@media (max-width:520px){.ago-member.ago-compact.is-in .ago-mtxt{display:none}.ago-member.ago-compact.is-in.ago-member{padding-right:4px!important}}',
    '.ago-back:focus-visible,.ago-member:focus-visible,.ago-foot button:focus-visible,.ago-foot a:focus-visible{outline:2px solid var(--ago-gold);outline-offset:2px}',
    '.ago-arrow{font-size:17px;line-height:1;margin:0 -2px 0 4px;color:var(--ago-gold)}',
    '.ago-mark{display:inline-grid;place-items:center;height:24px;padding:0 8px;border-radius:999px;background:var(--ago-gold);',
    'color:var(--ago-black);font:400 13px/1 var(--ago-serif);letter-spacing:.06em}',
    '.ago-member.ago-member{padding:0 12px 0 4px!important;margin-left:8px!important}',
    '.ago-avatar{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#1c1c1c;',
    'border:1px solid var(--ago-line);color:var(--ago-gold);font:700 11px/1 var(--ago-font)}',
    '.ago-member.is-in .ago-avatar{background:var(--ago-gold);color:var(--ago-black);border-color:var(--ago-gold)}',
    '.ago-member.ago-float{position:absolute!important;top:12px;right:12px;z-index:60;margin:0!important}',
    '.ago-hide{display:none!important}',
    '@media (max-width:420px){.ago-back .ago-txt,.ago-member.is-in .ago-mtxt{display:none}.ago-back.ago-back{padding-right:6px!important}.ago-member.is-in.ago-member{padding-right:4px!important}}',
    '.ago-avatar svg{width:14px;height:14px;display:block}',
    '.ago-foot{margin:36px 0 0;background:var(--ago-black);color:var(--ago-ivory);font:14px/1.4 var(--ago-font);position:relative;clear:both}',
    '.ago-foot::before{content:"";display:block;height:3px;background:linear-gradient(90deg,var(--ago-black) 0 38%,var(--ago-red) 38% 46%,var(--ago-black) 46% 47%,var(--ago-green) 47% 60%,var(--ago-black) 60% 100%)}',
    '.ago-foot-in{max-width:1100px;margin:0 auto;padding:16px 18px 20px;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px}',
    '.ago-foot-h{font:400 16px/1 var(--ago-serif);color:var(--ago-gold);margin-right:6px;white-space:nowrap}',
    '.ago-foot button,.ago-foot a{all:unset;cursor:pointer;color:var(--ago-ivory);font:500 13px/1 var(--ago-font);padding:8px 12px;',
    'border:1px solid #2a2a2a;border-radius:999px;white-space:nowrap}',
    '.ago-foot button:hover,.ago-foot a:hover{border-color:var(--ago-gold);color:#fff}',
    '.ago-foot .ago-home{border-color:var(--ago-line)}',
    '@media (prefers-reduced-motion:reduce){.ago-back,.ago-member{transition:none}}'
  ].join('');

  function addStyles() {
    var s = document.createElement('style');
    s.id = 'ago-shell-css';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
    if (!document.querySelector('link[href*="DM+Serif+Display"]')) {
      var f = document.createElement('link');
      f.rel = 'stylesheet';
      f.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap';
      (document.head || document.documentElement).appendChild(f);
    }
  }

  /* ---- 3. MESSAGES WITH THE WIX PAGE CODE ----------------------------------- */
  function post(msg) {
    if (!inFrame) return;
    msg.source = 'ago';
    try { window.parent.postMessage(msg, '*'); } catch (e) { /* ignore */ }
  }

  var acked = false, navTimer = null, member = null, memberCbs = [], calls = {}, callN = 0;

  window.addEventListener('message', function (e) {
    if (e.source !== window.parent && e.source !== window.top) return;   // only the Wix page may talk to us
    var m = e.data;
    if (!m || typeof m !== 'object') return;
    if ((m.source === 'agoPage' || m.source === 'i55Page') && m.type === 'ack') { acked = true; return; }
    if (m.source !== 'agoPage') return;
    if (m.type === 'member') setMember(m.member);
    else if (m.type === 'screen') setScreen(m);
    else if (m.type === 'reply' && calls[m.id]) {
      var c = calls[m.id]; delete calls[m.id];
      if (m.error) c.reject(new Error(m.error)); else c.resolve(m.result);
    }
  });

  /* ---- 4. NAVIGATION -------------------------------------------------------- */
  function go(key) {
    key = key || HOME;
    if (!inFrame) { location.href = urlFor(key); return; }
    acked = false;
    post({ type: 'nav', page: key });
    clearTimeout(navTimer);
    navTimer = setTimeout(function () {
      if (acked) return;                                   // the page code is already opening it
      var u = urlFor(key);
      try { window.top.location.href = u; } catch (err) { window.open(u, '_blank', 'noopener'); }
    }, ACK_WAIT);
  }

  // One capture-phase listener: runs before any old back-button code, so only this one acts.
  window.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-ago-go]') : null;
    if (!t) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    go(t.getAttribute('data-ago-go'));
  }, true);

  function adoptBack(el) {
    el.classList.add('ago-back');
    el.hidden = false;
    el.removeAttribute('hidden');
    el.style.removeProperty('display');
    el.setAttribute('data-ago-go', HOME);
    el.setAttribute('aria-label', 'Back to American Griot One');
    el.innerHTML = '<span class="ago-arrow" aria-hidden="true">‹</span><span class="ago-mark">AGO</span>' +
      '<span class="ago-txt">American Griot One</span>';
    if (el.tagName === 'A') { el.href = urlFor(HOME); el.target = '_top'; }
    return el;
  }

  /* ---- 5. MEMBERS ----------------------------------------------------------- */
  var chip = null;
  function buildChip(after) {
    chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'ago-member ago-hide' + (OPT.compact ? ' ago-compact' : '');
    chip.innerHTML = '<span class="ago-avatar" aria-hidden="true"></span><span class="ago-mtxt"></span>';
    chip.addEventListener('click', function () { post({ type: member && member.loggedIn ? 'account' : 'login' }); });
    if (after && after.parentNode) after.parentNode.insertBefore(chip, after.nextSibling);
    else { chip.classList.add('ago-float'); document.body.appendChild(chip); }
  }
  function initials(name) {
    var p = String(name || '').trim().split(/\s+/).filter(Boolean);
    return ((p[0] || '?')[0] + (p[1] ? p[1][0] : '')).toUpperCase();
  }
  function setMember(m) {
    member = m && m.loggedIn
      ? { loggedIn: true, name: String(m.name || 'Member').slice(0, 40) }
      : { loggedIn: false };
    if (chip) {
      chip.classList.remove('ago-hide');
      chip.classList.toggle('is-in', member.loggedIn);
      var av = chip.querySelector('.ago-avatar');
      if (member.loggedIn) av.textContent = initials(member.name);
      else av.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="5" r="3"/><path d="M2 14.5c0-3.3 2.7-5 6-5s6 1.7 6 5z"/></svg>';
      chip.querySelector('.ago-mtxt').textContent = member.loggedIn ? member.name : 'Sign in / Sign up';
      chip.setAttribute('aria-label', member.loggedIn ? 'Your account (' + member.name + ')' : 'Sign in / Sign up');
      chip.title = member.loggedIn ? 'Account settings' : 'Sign in / Sign up';
    }
    memberCbs.forEach(function (cb) { try { cb(member); } catch (e) { console.error(e); } });
    try { document.dispatchEvent(new CustomEvent('ago:member', { detail: member })); } catch (e) { /* old browser */ }
  }

  /* ---- 6. SCREEN SIZE ------------------------------------------------------- */
  function setScreen(m) {
    var h = parseInt(m.height, 10), w = parseInt(m.width, 10);
    if (h > 200) document.documentElement.style.setProperty('--ago-screen-h', h + 'px');
    if (w > 200) document.documentElement.style.setProperty('--ago-screen-w', w + 'px');
    // Inside a Wix box, CSS @media sees the box, not the phone (a tall box always looks "portrait").
    // These classes on <html> describe the REAL screen, for pages that need it:
    //   ago-phone-land = phone held sideways · ago-phone-port = phone held upright
    if (h > 200 && w > 200) {
      var c = document.documentElement.classList;
      c.toggle('ago-phone-land', w > h && w <= 940 && h <= 700);
      c.toggle('ago-phone-port', h >= w && w <= 600);
    }
  }
  var rT = null;
  window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { post({ type: 'screen' }); }, 250); });

  /* ---- 7. FOOTER: "More from AGO" ------------------------------------------- */
  function buildFooter() {
    var f = document.createElement('nav');
    f.className = 'ago-foot';
    f.setAttribute('aria-label', 'More from American Griot One');
    var h = '<div class="ago-foot-in"><span class="ago-foot-h">More from AGO</span>';
    h += inFrame ? '<button type="button" class="ago-home" data-ago-go="' + HOME + '">‹ All sections</button>'
                 : '<a class="ago-home" href="' + urlFor(HOME) + '">‹ All sections</a>';
    SECTIONS.forEach(function (s) {
      if (s[0] === OPT.page) return;
      h += inFrame ? '<button type="button" data-ago-go="' + s[0] + '">' + s[1] + '</button>'
                   : '<a href="' + urlFor(s[0]) + '">' + s[1] + '</a>';
    });
    f.innerHTML = h + '</div>';
    document.body.appendChild(f);
  }

  /* ---- 8. PUBLIC API for page scripts --------------------------------------- */
  window.AGO = {
    version: '1.0',
    inFrame: inFrame,
    page: OPT.page,
    go: go,
    login: function () { post({ type: 'login' }); },
    account: function () { post({ type: 'account' }); },
    logout: function () { post({ type: 'logout' }); },
    /** Scrolls the Wix page so the top of this box is at the top of the screen. */
    scrollToMe: function () { post({ type: 'scroll' }); },
    get member() { return member; },
    onMember: function (cb) { if (typeof cb === 'function') { memberCbs.push(cb); if (member) cb(member); } },
    /** AGO.call('aiAsk', 'explain', 'text') → Promise. Works only for names the page code allows. */
    call: function (method) {
      var args = Array.prototype.slice.call(arguments, 1);
      return new Promise(function (resolve, reject) {
        if (!inFrame) return reject(new Error('This only works on the American Griot One site.'));
        var id = ++callN;
        calls[id] = { resolve: resolve, reject: reject };
        post({ type: 'call', id: id, method: String(method), args: args });
        setTimeout(function () {
          if (calls[id]) { delete calls[id]; reject(new Error('The page did not answer. Is its page code installed?')); }
        }, CALL_WAIT);
      });
    }
  };

  /* ---- 9. START ------------------------------------------------------------- */
  function start() {
    addStyles();
    if (OPT.band) { var b = document.createElement('div'); b.className = 'ago-band'; b.setAttribute('aria-hidden', 'true'); document.body.appendChild(b); }
    var backEl = null;
    if (OPT.back) { try { backEl = document.querySelector(OPT.back); } catch (e) { backEl = null; } }
    if (backEl) adoptBack(backEl);
    if (OPT.member && inFrame) buildChip(backEl);
    if (OPT.footer) buildFooter();
    post({ type: 'hello', page: OPT.page });               // page code answers with member + screen size
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
