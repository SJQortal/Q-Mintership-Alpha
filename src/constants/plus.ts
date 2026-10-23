/**
 * The few things that differ between Q-Mintership and its testground build,
 * Q-Mintership+ (built and tested first in SJQortal/Q-Apps-Plus, then offered
 * here; https://github.com/SJQortal/Q-Apps-Plus/blob/main/docs/RELEASE.md).
 * Every screen takes these from here, so the two builds differ in this file:
 *
 * - the app's name, and the name written into copied `qortal://APP/…` links;
 * - how the copy names Q-Mintership 3 (the boards this version replaces,
 *   kept in legacy/), and its link;
 * - the browser storage prefix (all Q-Apps on a node share one origin, so
 *   Q-Mintership and Q-Mintership+ keep separate settings);
 * - the repository links shown in Settings → About.
 *
 * index.html takes its title and theme key from here too (vite.config.ts).
 * The changelog (constants/changelog.ts) is written per build.
 *
 * The QDN identifiers of the records are NOT here: they are shared data
 * (https://github.com/SJQortal/Q-Apps-Plus/blob/main/docs/apps/Q-Mintership%2B.md
 * → Data contract), and both builds read and write the same ones.
 */

/** The name this build is published under, and shown in the header and About. */
export const APP_NAME = 'Q-Mintership';

/**
 * The app name in copied `qortal://APP/<name>/…` links. Hub never decodes the
 * app name, so a `+` would be written literally
 * (https://github.com/SJQortal/Q-Apps-Plus/blob/main/docs/QORTAL.md → Deep links).
 */
export const LINK_APP_NAME = 'Q-Mintership';

/** Q-Mintership 3, the boards this version replaces (legacy/). */
export const ORIGINAL_APP_NAME = 'Q-Mintership 3';

/**
 * Opens Q-Mintership 3 from Settings → About, if it is ever published under
 * a name of its own; null hides the link (its boards are read in History).
 */
export const ORIGINAL_APP_LINK: string | null = null;

/**
 * How the copy names Q-Mintership 3 (the + build says "the original app").
 * At the start of a sentence, pass it through sentenceStart().
 */
export const ORIGINAL_WORDS = {
  /** In a sentence: "cards from Q-Mintership 3". */
  app: 'Q-Mintership 3',
  /** The same, by name. */
  named: 'Q-Mintership 3',
  /** Before a noun: "Q-Mintership 3 cards". */
  adjective: 'Q-Mintership 3',
  /** Its encrypted board. */
  adminBoard: "Q-Mintership 3's Minter Admin board",
  /** The title of one of its cards' pages. */
  card: 'Q-Mintership 3 card',
  /** When its Admin Board cards were proposed: "Proposed before Q-Mintership 4.0.0." */
  era: 'before Q-Mintership 4.0.0',
} as const satisfies Record<string, string>;

/** Prefix of every localStorage key this build writes. */
export const STORAGE_PREFIX = 'qmintership-';

/** localStorage key for the chosen theme. Must match STORAGE_KEY in index.html. */
export const THEME_STORAGE_KEY = `${STORAGE_PREFIX}ui-theme`;

/** The repository links in Settings → About, in order: this build's is Q-Mintership's own. */
export const ABOUT_LINKS: ReadonlyArray<{ title: string; url: string }> = [
  { title: 'Source code', url: 'https://gitea.qortal.link/crowetic/Q-Mintership-Alpha' },
];
