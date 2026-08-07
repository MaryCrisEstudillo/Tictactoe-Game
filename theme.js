'use strict';

/* Dark / light theme.
   <html> already carries a data-theme, set by the inline script in <head> so
   there is no flash of the wrong colours. This adds the toggle and remembers
   the choice. */
(() => {
  const STORAGE_KEY = 'tictactoe-theme';
  const PAGE_COLOR = { light: '#ffffff', dark: '#14161a' };
  const HINT_DELAY = 500;   // let the title screen finish fading out first
  const HINT_TIMEOUT = 10000;
  const HINT_FADE = 300;    // matches the .hint transition

  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const hint = document.getElementById('theme-hint');
  const hintDismiss = document.getElementById('theme-hint-dismiss');
  const startBtn = document.getElementById('start');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  let hintTimer = null;
  let hintFadeTimer = null;

  /* Storage throws in some privacy modes, so nothing here may assume it works. */
  function readChoice() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveChoice(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* not fatal: the theme just will not survive a reload */
    }
  }

  function apply(theme) {
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    root.dataset.theme = theme;
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    if (themeColor) themeColor.content = PAGE_COLOR[theme];
  }

  /* ---- the hint ----------------------------------------------------------
     The toggle sits behind the title screen, so the nudge waits until the
     player has entered the game. It is not remembered: every visit that
     reaches the board gets it again, and it clears itself either way. */

  function showHint() {
    clearTimeout(hintFadeTimer);
    hint.hidden = false;
    /* Next frame, so the browser has a hidden -> shown state to animate from. */
    requestAnimationFrame(() => hint.classList.add('is-visible'));
    hintTimer = setTimeout(dismissHint, HINT_TIMEOUT);
  }

  function dismissHint() {
    clearTimeout(hintTimer);
    if (hint.hidden) return;

    hint.classList.remove('is-visible');
    hintFadeTimer = setTimeout(() => {
      hint.hidden = true;
    }, HINT_FADE);
  }

  apply(root.dataset.theme === 'dark' ? 'dark' : 'light');

  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    saveChoice(next);
    apply(next);
    dismissHint(); // they found it
  });

  hintDismiss.addEventListener('click', dismissHint);
  startBtn.addEventListener('click', () => setTimeout(showHint, HINT_DELAY));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') dismissHint();
  });

  /* Keep following the system, right up until the player picks a side. */
  systemDark.addEventListener('change', (event) => {
    if (!readChoice()) apply(event.matches ? 'dark' : 'light');
  });
})();
