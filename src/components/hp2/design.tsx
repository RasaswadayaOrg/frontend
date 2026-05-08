// HP2 Design System — shared tokens + CSS for all redesigned pages.
// Inject <DesignStyles /> once in any page using this design system.
// All CSS is a plain string so server + client render identical markup
// (no styled-jsx, no template literals → no hydration mismatch).

export const TOKENS = {
  BG:     "#07060A",
  SURF:   "#15121D",
  SURF2:  "#1E1A2B",
  LINE:   "rgba(196,181,253,0.10)",
  TEXT:   "#F5F3FA",
  MUTED:  "#9B95B5",
  ACCENT: "#A78BFA",
  AI:     "#C4B5FD",
  PINK:   "#F0A6F8",
  HOT:    "#FF7AC6",
} as const;

const T = TOKENS;

export const DESIGN_CSS =
  // ── Root + container ──
  ".hp2 { font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, system-ui, sans-serif; letter-spacing: -0.005em; background: " + T.BG + "; color: " + T.TEXT + "; min-height: 100vh; position: relative; isolation: isolate; overflow-x: clip; }" +

  // ── Ambient violet aurora — drifts across every HP2 page ──
  ".hp2::before, .hp2::after { content: ''; position: fixed; z-index: -1; pointer-events: none; border-radius: 50%; filter: blur(80px); will-change: transform; }" +
  ".hp2::before { top: -20vh; left: -15vw; width: 80vw; height: 80vh; background: radial-gradient(circle, hsla(258, 75%, 32%, 0.55) 0%, hsla(258, 60%, 22%, 0.30) 35%, transparent 70%); animation: hp2-drift-a 28s ease-in-out infinite alternate; }" +
  ".hp2::after { bottom: -25vh; right: -20vw; width: 70vw; height: 70vh; background: radial-gradient(circle, hsla(290, 55%, 28%, 0.40) 0%, hsla(290, 50%, 20%, 0.18) 40%, transparent 70%); animation: hp2-drift-b 36s ease-in-out infinite alternate; }" +
  "@keyframes hp2-drift-a { 0% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(8%,6%,0) scale(1.10); } 100% { transform: translate3d(-4%,10%,0) scale(1.04); } }" +
  "@keyframes hp2-drift-b { 0% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-10%,-8%,0) scale(1.14); } 100% { transform: translate3d(6%,-4%,0) scale(1.06); } }" +
  "@media (prefers-reduced-motion: reduce) { .hp2::before, .hp2::after { animation: none; } }" +

  ".hp2-container { max-width: 1280px; margin: 0 auto; padding: 0 20px; position: relative; }" +
  "@media (min-width: 640px) { .hp2-container { padding: 0 28px; } }" +
  "@media (min-width: 768px) { .hp2-container { padding: 0 48px; } }" +

  // ── Headings ──
  ".hp2-page-head { padding: 120px 0 56px; }" +
  "@media (max-width: 640px) { .hp2-page-head { padding: 96px 0 40px; } }" +
  ".hp2-page-head__kicker { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: " + T.MUTED + "; margin: 0 0 14px; font-weight: 500; }" +
  ".hp2-page-head__title { font-family: var(--font-outfit); font-size: clamp(40px, 7vw, 96px); line-height: 0.98; letter-spacing: -0.04em; font-weight: 600; margin: 0 0 20px; max-width: 18ch; }" +
  ".hp2-page-head__title em { font-style: normal; color: " + T.ACCENT + "; }" +
  ".hp2-page-head__lede { color: " + T.MUTED + "; font-size: clamp(15px, 1.3vw, 19px); line-height: 1.55; max-width: 580px; margin: 0; }" +

  // ── Cover hero (top of every subpage) ──
  ".hp2-cover { position: relative; isolation: isolate; padding: 110px 0 56px; min-height: 320px; overflow: hidden; }" +
  "@media (max-width: 640px) { .hp2-cover { padding: 88px 0 40px; min-height: 240px; } }" +
  ".hp2-cover__media { position: absolute; inset: 0; z-index: -2; }" +
  ".hp2-cover__media--violet { " +
    "background-color: #15121D; " +
    "background-image: " +
      "radial-gradient(60% 80% at 18% 28%, rgba(167,139,250,0.55), transparent 62%), " +
      "radial-gradient(50% 70% at 82% 18%, rgba(240,166,248,0.42), transparent 60%), " +
      "radial-gradient(70% 90% at 60% 95%, rgba(124,58,237,0.55), transparent 70%), " +
      "linear-gradient(180deg, #1E1A2B 0%, #15121D 100%); " +
  "}" +
  ".hp2-cover__media--blue { " +
    "background-color: #15121D; " +
    "background-image: " +
      "radial-gradient(55% 75% at 80% 25%, rgba(96,165,250,0.45), transparent 60%), " +
      "radial-gradient(60% 80% at 20% 80%, rgba(167,139,250,0.50), transparent 65%), " +
      "linear-gradient(180deg, #18142A 0%, #15121D 100%); " +
  "}" +
  ".hp2-cover__media--pink { " +
    "background-color: #15121D; " +
    "background-image: " +
      "radial-gradient(55% 75% at 75% 30%, rgba(240,166,248,0.55), transparent 62%), " +
      "radial-gradient(50% 70% at 15% 75%, rgba(167,139,250,0.45), transparent 60%), " +
      "linear-gradient(180deg, #20142A 0%, #15121D 100%); " +
  "}" +
  ".hp2-cover__media--green { " +
    "background-color: #15121D; " +
    "background-image: " +
      "radial-gradient(55% 75% at 78% 25%, rgba(52,211,153,0.32), transparent 58%), " +
      "radial-gradient(60% 80% at 18% 78%, rgba(167,139,250,0.50), transparent 65%), " +
      "linear-gradient(180deg, #14182A 0%, #15121D 100%); " +
  "}" +
  // grain + dark fade-down so the cover blends into the page bg
  ".hp2-cover::after { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; background: linear-gradient(180deg, rgba(7,6,10,0.18) 0%, rgba(7,6,10,0.55) 55%, rgba(7,6,10,0.95) 92%, " + T.BG + " 100%); }" +
  ".hp2-cover__inner { position: relative; max-width: 760px; }" +
  ".hp2-cover__kicker { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: " + T.AI + "; margin: 0 0 14px; font-weight: 600; padding: 6px 12px; border-radius: 999px; background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.28); backdrop-filter: blur(8px); }" +
  ".hp2-cover__title { font-family: var(--font-outfit); font-size: clamp(34px, 5.5vw, 64px); line-height: 1.02; letter-spacing: -0.035em; font-weight: 600; margin: 0 0 14px; max-width: 16ch; color: " + T.TEXT + "; }" +
  ".hp2-cover__title em { font-style: normal; color: " + T.AI + "; }" +
  ".hp2-cover__lede { color: " + T.MUTED + "; font-size: clamp(14px, 1.15vw, 16px); line-height: 1.55; max-width: 540px; margin: 0; }" +

  ".hp2-section { padding: 64px 0 80px; border-top: 1px solid " + T.LINE + "; }" +
  "@media (max-width: 640px) { .hp2-section { padding: 48px 0 60px; } }" +
  ".hp2-section--first { border-top: none; }" +
  ".hp2-section__kicker { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: " + T.MUTED + "; margin: 0 0 14px; font-weight: 500; }" +
  ".hp2-section__title { font-family: var(--font-outfit); font-size: clamp(28px, 4vw, 52px); line-height: 1.05; letter-spacing: -0.035em; font-weight: 500; margin: 0 0 36px; }" +
  ".hp2-row-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 32px; flex-wrap: wrap; }" +

  // ── Buttons ──
  ".hp2-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }" +
  ".hp2-cta-row--center { justify-content: center; }" +
  ".hp2-btn { display: inline-flex; align-items: center; justify-content: center; height: 46px; padding: 0 22px; border-radius: 999px; font-size: 14px; font-weight: 500; letter-spacing: -0.005em; transition: transform .25s ease, background .25s ease, color .25s ease, border-color .25s ease; text-decoration: none; cursor: pointer; }" +
  ".hp2-btn--primary { background: " + T.TEXT + "; color: #0a0a0b; }" +
  ".hp2-btn--primary:hover { transform: translateY(-1px); background: #fff; }" +
  ".hp2-btn--ghost { color: " + T.TEXT + "; border: 1px solid " + T.LINE + "; background: transparent; }" +
  ".hp2-btn--ghost:hover { border-color: rgba(255,255,255,0.3); }" +
  ".hp2-btn--accent { background: " + T.ACCENT + "; color: #0a0a0b; }" +
  ".hp2-btn--accent:hover { background: " + T.AI + "; transform: translateY(-1px); }" +
  ".hp2-btn--sm { height: 38px; padding: 0 16px; font-size: 13px; }" +

  ".hp2-link { font-size: 14px; color: " + T.MUTED + "; transition: color .2s ease; text-decoration: none; }" +
  ".hp2-link:hover { color: " + T.TEXT + "; }" +

  // ── Form controls ──
  ".hp2-input { width: 100%; height: 46px; padding: 0 18px; border-radius: 999px; background: " + T.SURF + "; border: 1px solid " + T.LINE + "; color: " + T.TEXT + "; font-size: 14px; font-family: inherit; transition: border-color .2s ease, background .2s ease; outline: none; }" +
  ".hp2-input:focus { border-color: " + T.ACCENT + "; background: " + T.SURF2 + "; }" +
  ".hp2-input::placeholder { color: " + T.MUTED + "; }" +
  ".hp2-search { position: relative; }" +
  ".hp2-search__icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: " + T.MUTED + "; pointer-events: none; }" +
  ".hp2-search .hp2-input { padding-left: 46px; }" +
  ".hp2-select { appearance: none; -webkit-appearance: none; padding-right: 40px;" +
  " background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%239B95B5' d='M6 8L0 0h12z'/%3E%3C/svg%3E\");" +
  " background-repeat: no-repeat; background-position: right 18px center; background-size: 10px 6px; }" +

  // ── Filter chips ──
  ".hp2-chips { display: flex; flex-wrap: wrap; gap: 8px; }" +
  ".hp2-chip { display: inline-flex; align-items: center; height: 36px; padding: 0 16px; border-radius: 999px; background: " + T.SURF + "; border: 1px solid " + T.LINE + "; color: " + T.MUTED + "; font-size: 13px; font-weight: 500; transition: color .2s ease, border-color .2s ease, background .2s ease; text-decoration: none; }" +
  ".hp2-chip:hover { color: " + T.TEXT + "; border-color: rgba(255,255,255,0.18); background: " + T.SURF2 + "; }" +
  ".hp2-chip.is-active { background: " + T.TEXT + "; color: #0a0a0b; border-color: " + T.TEXT + "; }" +

  // ── Generic media card (events, products, generic) ──
  ".hp2-card-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }" +
  "@media (min-width: 600px) { .hp2-card-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }" +
  "@media (min-width: 1000px) { .hp2-card-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }" +
  "@media (min-width: 1280px) { .hp2-card-grid--4 { grid-template-columns: repeat(4, 1fr); } }" +

  ".hp2-card { display: flex; flex-direction: column; border-radius: 18px; overflow: hidden; background: " + T.SURF + "; border: 1px solid " + T.LINE + "; text-decoration: none; transition: transform .35s cubic-bezier(.2,.7,.2,1), border-color .35s ease, box-shadow .35s ease; }" +
  ".hp2-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.18); box-shadow: 0 20px 40px -20px rgba(167,139,250,0.18); }" +
  ".hp2-card__img { position: relative; aspect-ratio: 16/10; overflow: hidden; background: " + T.SURF2 + "; }" +
  ".hp2-card__img img { transition: transform .6s cubic-bezier(.2,.7,.2,1); }" +
  ".hp2-card:hover .hp2-card__img img { transform: scale(1.04); }" +
  ".hp2-card__cat { position: absolute; top: 12px; left: 12px; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; padding: 5px 10px; border-radius: 6px; background: rgba(11,11,12,0.78); color: " + T.TEXT + "; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }" +
  ".hp2-card__body { padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 10px; flex: 1; }" +
  ".hp2-card__title { font-family: var(--font-outfit); font-size: 18px; font-weight: 500; letter-spacing: -0.01em; color: " + T.TEXT + "; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; transition: color .2s ease; }" +
  ".hp2-card:hover .hp2-card__title { color: " + T.ACCENT + "; }" +
  ".hp2-card__meta { display: flex; flex-direction: column; gap: 4px; margin-top: auto; }" +
  ".hp2-card__meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: " + T.MUTED + "; }" +
  ".hp2-card__price { font-family: var(--font-outfit); font-size: 17px; font-weight: 600; color: " + T.TEXT + "; margin-top: 6px; }" +

  // ── Artist / avatar card ──
  ".hp2-artist-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }" +
  "@media (min-width: 700px) { .hp2-artist-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; } }" +
  "@media (min-width: 1000px) { .hp2-artist-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }" +
  ".hp2-artist { display: flex; flex-direction: column; gap: 14px; text-decoration: none; }" +
  ".hp2-artist__photo { position: relative; aspect-ratio: 1/1; border-radius: 18px; overflow: hidden; background: " + T.SURF2 + "; box-shadow: 0 0 0 1px " + T.LINE + " inset; transition: transform .4s cubic-bezier(.2,.7,.2,1); }" +
  ".hp2-artist:hover .hp2-artist__photo { transform: translateY(-4px); }" +
  ".hp2-artist__photo img { transition: transform .6s cubic-bezier(.2,.7,.2,1); }" +
  ".hp2-artist:hover .hp2-artist__photo img { transform: scale(1.05); }" +
  ".hp2-artist__name { font-family: var(--font-outfit); font-size: 16px; font-weight: 500; letter-spacing: -0.01em; color: " + T.TEXT + "; transition: color .2s ease; }" +
  ".hp2-artist:hover .hp2-artist__name { color: " + T.ACCENT + "; }" +
  ".hp2-artist__genre { font-size: 13px; color: " + T.MUTED + "; }" +

  // ── Empty / loading ──
  ".hp2-empty { padding: 80px 0; text-align: center; border: 1px dashed " + T.LINE + "; border-radius: 20px; }" +
  ".hp2-empty__title { font-family: var(--font-outfit); font-size: 20px; font-weight: 500; color: " + T.TEXT + "; margin-bottom: 8px; }" +
  ".hp2-empty__lede { font-size: 14px; color: " + T.MUTED + "; }" +

  // ── Pagination ──
  ".hp2-pager { display: flex; gap: 6px; justify-content: center; padding-top: 32px; }" +
  ".hp2-pager__btn { display: inline-flex; align-items: center; justify-content: center; min-width: 38px; height: 38px; padding: 0 12px; border-radius: 10px; background: " + T.SURF + "; border: 1px solid " + T.LINE + "; color: " + T.MUTED + "; font-size: 13px; font-weight: 500; transition: all .2s ease; text-decoration: none; }" +
  ".hp2-pager__btn:hover { color: " + T.TEXT + "; border-color: rgba(255,255,255,0.18); }" +
  ".hp2-pager__btn.is-active { background: " + T.TEXT + "; color: #0a0a0b; border-color: " + T.TEXT + "; }" +
  ".hp2-pager__btn--disabled { opacity: 0.4; pointer-events: none; }" +

  // ── Floating top nav ──
  ".hp2-nav-wrap { position: sticky; top: 0; z-index: 50; padding: 16px 20px;" +
  " background: linear-gradient(180deg, rgba(14,8,32,0.97) 0%, rgba(10,5,24,0.90) 65%, transparent 100%);" +
  " backdrop-filter: blur(16px) saturate(160%); -webkit-backdrop-filter: blur(16px) saturate(160%);" +
  " border-bottom: 1px solid rgba(139,92,246,0.10);" +
  " box-shadow: 0 1px 32px rgba(109,40,217,0.10); }" +
  "@media (min-width: 640px) { .hp2-nav-wrap { padding: 20px 28px; } }" +
  "@media (min-width: 768px) { .hp2-nav-wrap { padding: 24px 48px; } }" +
  ".hp2-nav { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; }" +
  ".hp2-nav__brand { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 12px rgba(167,139,250,0.35); }" +
  ".hp2-nav__brand-mark { width: 14px; height: 14px; border-radius: 50%; background: " + T.BG + "; }" +
  ".hp2-nav__pills { display: flex; gap: 2px; padding: 5px; border-radius: 999px;" +
  " background: rgba(26,12,52,0.80); backdrop-filter: blur(20px) saturate(160%);" +
  " -webkit-backdrop-filter: blur(20px) saturate(160%);" +
  " box-shadow: 0 0 0 1px rgba(139,92,246,0.22) inset, 0 4px 20px rgba(109,40,217,0.12); }" +
  "@media (max-width: 820px) { .hp2-nav__pills { display: none; } }" +
  ".hp2-nav__pill { display: inline-flex; align-items: center; height: 34px; padding: 0 15px;" +
  " border-radius: 999px; color: rgba(245,243,250,0.82); font-size: 13.5px; font-weight: 500;" +
  " letter-spacing: -0.005em; text-decoration: none;" +
  " transition: background 0.25s ease, color 0.25s ease; }" +
  ".hp2-nav__pill:hover { background: rgba(139,92,246,0.20); color: " + T.TEXT + "; }" +
  ".hp2-nav__pill.is-active { background: rgba(139,92,246,0.28); color: " + T.AI + "; box-shadow: 0 0 0 1px rgba(167,139,250,0.30) inset; }" +
  ".hp2-nav__cta { display: inline-flex; align-items: center; height: 38px; padding: 0 20px; border-radius: 999px;" +
  " background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); color: #2e1065; font-size: 14px; font-weight: 600;" +
  " letter-spacing: -0.01em; text-decoration: none; transition: box-shadow .25s ease, transform .2s ease; flex-shrink: 0;" +
  " box-shadow: 0 0 0 1px rgba(139,92,246,0.20), 0 4px 14px rgba(109,40,217,0.18); }" +
  ".hp2-nav__cta:hover { box-shadow: 0 0 0 1px rgba(139,92,246,0.40), 0 6px 20px rgba(109,40,217,0.28); transform: translateY(-1px); }" +
  ".hp2-nav__menu-btn { display: none; background: rgba(26,12,52,0.70); border: 1px solid rgba(139,92,246,0.22); width: 40px; height: 40px; border-radius: 12px; color: " + T.TEXT + "; cursor: pointer; align-items: center; justify-content: center; }" +
  "@media (max-width: 820px) { .hp2-nav__menu-btn { display: inline-flex; } }" +

  // ── LiveSearchBar (per-page inline search with suggest dropdown) ──
  ".hp2-livesearch { position: relative; }" +
  ".hp2-livesearch__drop { position: absolute; top: calc(100% + 8px); left: 0; right: 0; min-width: 300px;" +
  " background: " + T.SURF + "; border: 1px solid rgba(139,92,246,0.22); border-radius: 16px;" +
  " box-shadow: 0 20px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.06) inset;" +
  " overflow: hidden; z-index: 80; animation: hp2FadeUp .16s ease; }" +
  "@keyframes hp2FadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }" +
  ".hp2-livesearch__cat { padding: 10px 14px 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: " + T.MUTED + "; }" +
  ".hp2-livesearch__item { display: flex; align-items: center; gap: 10px; padding: 8px 14px; text-decoration: none; transition: background .12s ease; }" +
  ".hp2-livesearch__item:hover { background: " + T.SURF2 + "; }" +
  ".hp2-livesearch__thumb { width: 34px; height: 34px; border-radius: 8px; object-fit: cover; background: " + T.SURF2 + "; flex-shrink: 0; }" +
  ".hp2-livesearch__name { display: block; font-size: 13px; font-weight: 500; color: " + T.TEXT + "; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px; }" +
  ".hp2-livesearch__sub { display: block; font-size: 11px; color: " + T.MUTED + "; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px; }" +
  ".hp2-livesearch__footer { padding: 10px 14px; border-top: 1px solid " + T.LINE + "; display: flex; justify-content: space-between; }" +
  ".hp2-livesearch__all { font-size: 12px; font-weight: 500; color: " + T.AI + "; text-decoration: none; }" +
  ".hp2-livesearch__all:hover { text-decoration: underline; }" +
  ".hp2-livesearch__empty { padding: 20px 16px; font-size: 13px; color: " + T.MUTED + "; text-align: center; }" +
  ".hp2-livesearch__loading { padding: 18px; display: flex; gap: 8px; justify-content: center; }" +
  ".hp2-livesearch__dot { width: 6px; height: 6px; border-radius: 50%; background: " + T.AI + "; opacity: 0.4; animation: hp2Pulse 1.2s ease infinite; }" +
  ".hp2-livesearch__dot:nth-child(2) { animation-delay: .2s; } .hp2-livesearch__dot:nth-child(3) { animation-delay: .4s; }" +
  "@keyframes hp2Pulse { 0%,100% { opacity:.3; transform:scale(.9); } 50% { opacity:1; transform:scale(1.1); } }" +

  // Mobile drawer
  ".hp2-drawer { position: fixed; inset: 0; z-index: 100; pointer-events: none;" +
  " visibility: hidden; transition: visibility 0s linear .3s; }" +
  ".hp2-drawer.is-open { pointer-events: auto; visibility: visible; transition: visibility 0s linear 0s; }" +
  ".hp2-drawer__bg { position: absolute; inset: 0; background: rgba(7,6,10,0.7); backdrop-filter: blur(8px); opacity: 0; transition: opacity .3s ease; }" +
  ".hp2-drawer.is-open .hp2-drawer__bg { opacity: 1; }" +
  ".hp2-drawer__panel { position: absolute; top: 0; right: 0; bottom: 0; width: min(360px, 86%); background: " + T.SURF + "; border-left: 1px solid " + T.LINE + "; padding: 24px 24px 32px; transform: translateX(100%); transition: transform .35s cubic-bezier(.2,.7,.2,1); display: flex; flex-direction: column; }" +
  ".hp2-drawer.is-open .hp2-drawer__panel { transform: translateX(0); }" +
  ".hp2-drawer__head { display: flex; justify-content: flex-end; margin-bottom: 24px; }" +
  ".hp2-drawer__close { width: 36px; height: 36px; border-radius: 10px; background: " + T.SURF2 + "; border: 1px solid " + T.LINE + "; color: " + T.TEXT + "; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }" +
  ".hp2-drawer__links { display: flex; flex-direction: column; gap: 4px; }" +
  ".hp2-drawer__link { display: block; padding: 14px 16px; border-radius: 12px; font-family: var(--font-outfit); font-size: 17px; font-weight: 500; letter-spacing: -0.01em; color: " + T.TEXT + "; text-decoration: none; transition: background .2s ease; }" +
  ".hp2-drawer__link:hover { background: " + T.SURF2 + "; }" +
  ".hp2-drawer__link.is-active { background: rgba(167,139,250,0.14); color: " + T.AI + "; }" +
  ".hp2-drawer__cta { margin-top: 20px; }" +

  // ── Footer (full footer, used by Frame) ──
  ".hp2-footer { border-top: 1px solid " + T.LINE + "; background: " + T.SURF + "; }" +
  ".hp2-footer__top { padding: 64px 0 48px; display: grid; grid-template-columns: 1fr; gap: 40px; }" +
  "@media (min-width: 768px) { .hp2-footer__top { grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; padding: 72px 0 56px; } }" +
  ".hp2-footer__brand-mark { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: " + T.ACCENT + "; margin-bottom: 18px; }" +
  ".hp2-footer__brand-inner { width: 16px; height: 16px; border-radius: 50%; background: " + T.BG + "; }" +
  ".hp2-footer__brand-name { font-family: var(--font-outfit); font-size: 22px; font-weight: 600; letter-spacing: -0.025em; color: " + T.TEXT + "; margin-bottom: 12px; }" +
  ".hp2-footer__tagline { font-size: 14px; color: " + T.MUTED + "; line-height: 1.65; max-width: 280px; margin-bottom: 24px; }" +
  ".hp2-footer__social { display: flex; gap: 10px; }" +
  ".hp2-footer__social-link { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid " + T.LINE + "; color: " + T.MUTED + "; font-size: 13px; font-weight: 600; text-decoration: none; transition: border-color .25s ease, color .25s ease, background .25s ease; }" +
  ".hp2-footer__social-link:hover { border-color: " + T.ACCENT + "; color: " + T.ACCENT + "; background: rgba(167,139,250,0.08); }" +
  ".hp2-footer__col-title { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: " + T.TEXT + "; font-weight: 600; margin-bottom: 18px; }" +
  ".hp2-footer__links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }" +
  ".hp2-footer__link { font-size: 14px; color: " + T.MUTED + "; text-decoration: none; transition: color .2s ease; }" +
  ".hp2-footer__link:hover { color: " + T.TEXT + "; }" +
  ".hp2-footer__bottom { padding: 22px 0; border-top: 1px solid " + T.LINE + "; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }" +
  ".hp2-footer__legal { font-size: 13px; color: " + T.MUTED + "; }" +
  ".hp2-footer__legal a { color: " + T.MUTED + "; text-decoration: none; transition: color .2s; }" +
  ".hp2-footer__legal a:hover { color: " + T.TEXT + "; }" +
  ".hp2-footer__locale { display: flex; align-items: center; gap: 6px; font-size: 13px; color: " + T.MUTED + "; }";

// ── Transactional / shell extras ──────────────────────────────────────────────
export const DESIGN_CSS_EXTRA =
  // Spinner
  "@keyframes hp2-spin { to { transform: rotate(360deg); } }" +
  ".hp2-spinner { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(167,139,250,0.18); border-top-color: " + T.ACCENT + "; animation: hp2-spin .8s linear infinite; }" +
  ".hp2-spinner--lg { width: 48px; height: 48px; }" +
  ".hp2-loading { display: flex; align-items: center; justify-content: center; min-height: 40vh; }" +

  // Alert / notice
  ".hp2-alert { display: flex; align-items: flex-start; gap: 10px; padding: 14px 16px; border-radius: 14px; font-size: 14px; line-height: 1.5; }" +
  ".hp2-alert--error { background: rgba(255,88,88,0.08); border: 1px solid rgba(255,88,88,0.22); color: #ff8888; }" +
  ".hp2-alert--success { background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.22); color: #34d399; }" +
  ".hp2-alert--info { background: rgba(167,139,250,0.08); border: 1px solid " + T.LINE + "; color: " + T.MUTED + "; }" +

  // Surface cards (transactional / no image)
  ".hp2-surf { background: " + T.SURF + "; border: 1px solid " + T.LINE + "; border-radius: 20px; }" +
  ".hp2-surf--2 { background: " + T.SURF2 + "; }" +
  ".hp2-surf__head { padding: 20px 24px; border-bottom: 1px solid " + T.LINE + "; }" +
  ".hp2-surf__body { padding: 24px; }" +
  ".hp2-surf__foot { padding: 16px 24px; border-top: 1px solid " + T.LINE + "; background: rgba(255,255,255,0.02); }" +

  // Form fields
  ".hp2-field { display: flex; flex-direction: column; gap: 6px; }" +
  ".hp2-label { font-size: 13px; font-weight: 500; color: " + T.MUTED + "; letter-spacing: 0.01em; }" +
  ".hp2-textarea { width: 100%; padding: 12px 18px; border-radius: 14px; background: " + T.SURF + "; border: 1px solid " + T.LINE + "; color: " + T.TEXT + "; font-size: 14px; font-family: inherit; line-height: 1.55; resize: vertical; min-height: 100px; transition: border-color .2s ease; outline: none; }" +
  ".hp2-textarea:focus { border-color: " + T.ACCENT + "; background: " + T.SURF2 + "; }" +
  ".hp2-textarea::placeholder { color: " + T.MUTED + "; }" +
  ".hp2-input--readonly { opacity: 0.5; cursor: not-allowed; }" +
  ".hp2-upload { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }" +
  ".hp2-upload__label { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px 18px; border-radius: 14px; border: 1px dashed rgba(167,139,250,0.3); color: " + T.MUTED + "; font-size: 13px; cursor: pointer; transition: border-color .2s ease, color .2s ease; }" +
  ".hp2-upload__label:hover { border-color: " + T.ACCENT + "; color: " + T.ACCENT + "; }" +
  ".hp2-upload--filled { border-color: " + T.ACCENT + "; color: " + T.AI + "; background: rgba(167,139,250,0.06); }" +

  // Status badges
  ".hp2-badge { display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 999px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }" +
  ".hp2-badge--pending { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }" +
  ".hp2-badge--approved, .hp2-badge--delivered { background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }" +
  ".hp2-badge--rejected, .hp2-badge--cancelled { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.25); }" +
  ".hp2-badge--processing { background: rgba(167,139,250,0.12); color: " + T.AI + "; border: 1px solid " + T.LINE + "; }" +

  // Quantity control
  ".hp2-qty { display: inline-flex; align-items: center; gap: 14px; height: 40px; padding: 0 16px; border-radius: 999px; background: " + T.SURF2 + "; border: 1px solid " + T.LINE + "; }" +
  ".hp2-qty__btn { color: " + T.MUTED + "; background: none; border: none; cursor: pointer; line-height: 1; display: flex; align-items: center; transition: color .15s ease; padding: 0; }" +
  ".hp2-qty__btn:hover { color: " + T.TEXT + "; }" +
  ".hp2-qty__btn:disabled { opacity: 0.3; cursor: not-allowed; }" +
  ".hp2-qty__val { font-size: 15px; font-weight: 600; color: " + T.TEXT + "; min-width: 20px; text-align: center; }" +

  // Checkout progress steps
  ".hp2-steps { display: flex; align-items: center; gap: 0; margin-bottom: 40px; }" +
  ".hp2-step { display: flex; align-items: center; gap: 8px; flex: 1; }" +
  ".hp2-step__num { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; font-size: 12px; font-weight: 700; flex-shrink: 0; }" +
  ".hp2-step--done .hp2-step__num { background: " + T.ACCENT + "; color: #0a0a0b; }" +
  ".hp2-step--active .hp2-step__num { background: " + T.TEXT + "; color: #0a0a0b; }" +
  ".hp2-step--idle .hp2-step__num { background: " + T.SURF2 + "; color: " + T.MUTED + "; border: 1px solid " + T.LINE + "; }" +
  ".hp2-step__label { font-size: 13px; font-weight: 500; }" +
  ".hp2-step--done .hp2-step__label, .hp2-step--active .hp2-step__label { color: " + T.TEXT + "; }" +
  ".hp2-step--idle .hp2-step__label { color: " + T.MUTED + "; }" +
  ".hp2-step__line { flex: 1; height: 1px; background: " + T.LINE + "; margin: 0 8px; }" +
  ".hp2-step--done .hp2-step__line { background: " + T.ACCENT + "; }" +

  // Profile sections
  ".hp2-avatar { display: flex; align-items: center; justify-content: center; border-radius: 50%; background: " + T.SURF2 + "; border: 2px solid " + T.LINE + "; flex-shrink: 0; overflow: hidden; }" +
  ".hp2-avatar--lg { width: 80px; height: 80px; }" +
  ".hp2-avatar--md { width: 48px; height: 48px; }" +
  ".hp2-preference-chip { display: inline-flex; align-items: center; height: 32px; padding: 0 14px; border-radius: 999px; border: 1px solid " + T.LINE + "; background: " + T.SURF2 + "; color: " + T.MUTED + "; font-size: 12px; font-weight: 500; cursor: pointer; transition: all .18s ease; user-select: none; }" +
  ".hp2-preference-chip:hover { border-color: rgba(167,139,250,0.35); color: " + T.TEXT + "; }" +
  ".hp2-preference-chip.is-selected { background: rgba(167,139,250,0.14); border-color: " + T.ACCENT + "; color: " + T.AI + "; }" +

  // Sticky summary card (cart / checkout)
  ".hp2-summary { position: sticky; top: 84px; }" +
  "@media (max-width: 768px) { .hp2-summary { position: static; } }" +

  // Search results sections
  ".hp2-results-section { margin-bottom: 48px; }" +
  ".hp2-results-section__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }" +
  ".hp2-results-count { font-size: 12px; color: " + T.MUTED + "; }" +

  // About page extras
  ".hp2-stat { display: flex; flex-direction: column; gap: 4px; padding: 24px; background: " + T.SURF + "; border: 1px solid " + T.LINE + "; border-radius: 18px; }" +
  ".hp2-stat__num { font-family: var(--font-outfit); font-size: 42px; font-weight: 600; letter-spacing: -0.04em; color: " + T.TEXT + "; line-height: 1; }" +
  ".hp2-stat__label { font-size: 13px; color: " + T.MUTED + "; }" +
  ".hp2-values-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }" +
  "@media (min-width: 640px) { .hp2-values-grid { grid-template-columns: repeat(2, 1fr); } }" +
  "@media (min-width: 1000px) { .hp2-values-grid { grid-template-columns: repeat(4, 1fr); } }" +
  ".hp2-value-card { padding: 24px; background: " + T.SURF + "; border: 1px solid " + T.LINE + "; border-radius: 18px; }" +
  ".hp2-value-card__icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(167,139,250,0.1); display: flex; align-items: center; justify-content: center; color: " + T.ACCENT + "; margin-bottom: 14px; }" +
  ".hp2-value-card__title { font-family: var(--font-outfit); font-size: 16px; font-weight: 500; color: " + T.TEXT + "; margin-bottom: 6px; }" +
  ".hp2-value-card__text { font-size: 13px; color: " + T.MUTED + "; line-height: 1.6; }" +

  // Marquee override for songs
  ".hp2-song-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }" +
  "@media (min-width: 600px) { .hp2-song-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }" +
  "@media (min-width: 900px) { .hp2-song-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }" +

  // Auth card
  ".hp2-auth-wrap { min-height: calc(100vh - 80px); display: flex; align-items: center; justify-content: center; padding: 40px 20px; }" +
  ".hp2-auth-card { width: 100%; max-width: 440px; background: " + T.SURF + "; border: 1px solid " + T.LINE + "; border-radius: 24px; overflow: hidden; box-shadow: 0 40px 80px -30px rgba(0,0,0,0.5); }" +

  // Two-column layout helper
  ".hp2-two-col { display: grid; grid-template-columns: 1fr; gap: 24px; }" +
  "@media (min-width: 900px) { .hp2-two-col { grid-template-columns: 2fr 1fr; gap: 32px; } }" +
  ".hp2-two-col--profile { grid-template-columns: 1fr; }" +
  "@media (min-width: 768px) { .hp2-two-col--profile { grid-template-columns: 1fr 2fr; gap: 32px; } }" +

  // Chat modal
  ".hp2-modal-bg { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; background: rgba(7,6,10,0.75); backdrop-filter: blur(10px); padding: 16px; }" +
  ".hp2-modal { background: " + T.SURF + "; border: 1px solid " + T.LINE + "; border-radius: 22px; overflow: hidden; box-shadow: 0 60px 120px -40px rgba(0,0,0,0.6); display: flex; flex-direction: column; max-height: 85vh; width: 100%; max-width: 720px; }" +
  ".hp2-modal__head { padding: 18px 22px; border-bottom: 1px solid " + T.LINE + "; display: flex; align-items: center; justify-content: space-between; }" +
  ".hp2-modal__title { font-family: var(--font-outfit); font-size: 18px; font-weight: 500; color: " + T.TEXT + "; }" +
  ".hp2-modal__close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 10px; border: 1px solid " + T.LINE + "; background: " + T.SURF2 + "; color: " + T.MUTED + "; cursor: pointer; transition: color .2s ease; }" +
  ".hp2-modal__close:hover { color: " + T.TEXT + "; }" +
  ".hp2-modal__body { padding: 22px; overflow-y: auto; flex: 1; }" +
  ".hp2-modal__foot { padding: 16px 22px; border-top: 1px solid " + T.LINE + "; display: flex; align-items: center; justify-content: flex-end; gap: 10px; background: " + T.SURF + "; }";

export const FULL_CSS = DESIGN_CSS + DESIGN_CSS_EXTRA;

export function DesignStyles() {
  return <style dangerouslySetInnerHTML={{ __html: FULL_CSS }} />;
}
