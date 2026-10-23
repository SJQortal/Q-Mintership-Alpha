# Q-Mintership

Who joins the MINTER group (694), and so who mints QORT. MINTER members at level 5+ and Minter Admins nominate; Minter Admins approve, reject, or let it expire. Published on QDN as `qortal://APP/Q-Mintership`.

Version 4.0 is a rewrite on React 19.3 + MUI 9.4. It was first published as **Q-Mintership+** (on QDN from 14 October 2026, 1.0.0 on 20 October), where Minter Admins used it for real nominations, decisions and polls. Q-Mintership 3 (the boards, v3.0.7 as published on QDN) is kept in `legacy/` with its README and CHANGELOG; its cards, polls and comments stay readable in History.

## How it works

| Step | Who | What happens | On chain |
|---|---|---|---|
| 1. Propose nomination | a MINTER member at level 5+, or a Minter Admin | Pick a community member, write a short reason (optional `qortal://` links). Others support an open nomination instead of nominating twice. Nobody nominates themselves. | a small QDN record |
| 2. Accept | the nominee (recommended) | One step sends their join request, so approval makes them a minter at once. | JOIN_GROUP |
| 3. First approval | the first Minter Admin to approve | The invite and their own approval, as one guided step. The clock starts here. | GROUP_INVITE + GROUP_APPROVAL |
| 4. Answers | the other Minter Admins | Approve, Reject, or do nothing. Only each admin's latest confirmed answer counts. Considering says "I'm looking at it" without answering. | GROUP_APPROVAL |
| 5. Done | Core | At 40% of MINTER's admin rows Core applies it. As many rejections end it (approvals are counted first). Otherwise it expires about 8.5 days after the invite. | automatic |

The other MINTER changes (remove a member, ban, lift a ban, make or remove a Minter Admin, cancel an approved invite, decline a join request) are proposed from **+ Propose**, each on a page of its own, with the proposer's own approval in the same step. Every Hub confirmation is explained before it opens, with its fee, and every write re-checks the chain first.

## What's in it

- **Home by status:** not in MINTER yet, nominated, member, former member or Minter Admin, with real numbers, the one thing to do next, and what changed since the last visit.
- **Decisions:** one place for nominations, removals, bans and admin changes, by type or most urgent first, with `k of n`, a live countdown, who approved, rejected or is considering, and what an admin change would do to every waiting decision before it is signed.
- **Talk:** public comments on every decision and nomination, advisory Yes/No votes from the community, and Minter Admin polls, notes and comments encrypted to the Minter Admins. Hub alerts (opt-in, in Settings) for nominations, support and replies; turning them on or off also removes Q-Mintership 3's alert rules for its boards.
- **History:** every MINTER change on chain, filtered by type and period, plus Q-Mintership 3's boards, read-only. Minter Admins also see the closed Minter Admin polls among the changes, and read Q-Mintership 3's encrypted Admin Board there, each card decrypted for them and marked as proposed before 4.0.0.
- **Explorer:** look up any account, name or transaction (read-only): an account's overview, transactions in plain words, the Q-Assets it holds (with what buyers would pay for them now), Minter Profile and names. Minter Admins, Dev Admins and level 5+ members also see connections between accounts (payments, Q-Asset trades, sponsorships, level moves and names, with an Account report to save as Markdown), Compare and QORT summaries.
- **Activity:** each Minter Admin's participation, computed live from the chain.
- **Phones and GO:** a bottom bar, sheets, forms that stay above the keyboard, safe areas and a compact landscape layout.
- **Big screens:** Settings → Appearance → Page width. Full window spreads the pages across the window, with decisions, nominations and sections side by side; Comfortable (the default) keeps a centred column.
- **Q-Minter:** Home links the Q-Minter Guide's minting overview and the history of minting for every status, as Q-Mintership 3.0.7 did.
- **Four themes** (Hub 3.0, Q-Mintership Classic, Black, White), following Hub's light/dark switch.

What's new lists everything (Settings → About, from `src/constants/changelog.ts`).

## Develop and test

```bash
npm ci
npm run dev           # Vite; Qortal calls need Hub (or the mocks in tests)
npm test              # vitest; every Qortal request and Core read is mocked, and any POST fails the test
npm run lint
npm run build         # tsc + vite build into dist/
node e2e/screens.mjs  # every screen × 5 sizes × 4 themes: console errors, overflow, unlabelled buttons, axe (needs Playwright)
```

Optional, against a node of your own (all read-only unless noted):

```bash
npm run test:decode   # GROUP_APPROVAL bytes checked by the node's decode endpoint (QMP_DECODE_NODE, default 127.0.0.1:12391)
npm run test:live     # GET-only check of the data layer (QMP_LIVE_NODE)
npm run test:testnet  # every write on a private one-node testnet (Linux; see testnet/testnet.mjs: a Core jar, `unshare`, ~/.qmp-testnet)
```

Outside Hub, the dev server reads `localhost:12391` directly, signed out, so the read-only screens can be checked against real data.

## Publish

```bash
npm ci && npm run build
```

Then publish the contents of `dist/` as `APP` under the name `Q-Mintership`. To try a build in Hub first, zip the contents of `dist/` and open it with Hub's Dev Mode → Zip.

## Data

- **Chain writes** go through Hub (`SIGN_TRANSACTION`, `JOIN_GROUP` and the group transactions), never straight to the node: INVITE_TO_GROUP, KICK_FROM_GROUP, BAN_FROM_GROUP, CANCEL_GROUP_BAN, CANCEL_GROUP_INVITE, ADD_GROUP_ADMIN and REMOVE_GROUP_ADMIN (all with txGroupId 694), JOIN_GROUP and GROUP_APPROVAL.
- **New QDN records**, all prefixed `qmp-`:
  - `JSON`: `nomination`, `support`, `considering`, `comment`, `hide` and `vote`;
  - `DOCUMENT_PRIVATE`, encrypted to the Minter Admins: `adminpoll`, `adminvote`, `admincomment`, `adminshare`, `adminnote` and `macomment`.

  A record's publisher comes from QDN, never from its body.
- **Reads** are paged, bounded and cached GETs, never `limit=0`. Busy accounts in the Explorer are read in pages, two searches at a time.
- **Q-Mintership 3's data** (its cards, polls and comments) is read for History and the Explorer, and never written. It is read by its bodies, so 3.0.7's notification markers in the descriptions (`qmintership:…`) change nothing; 4.0's alerts match its own `qmp-` records, so alerts don't cross between 3.0.7 and 4.0. Its encrypted Admin Board (`MAIL_PRIVATE` `card-MAC-…` and its comments) is read for Minter Admins only, decrypted through Hub's `DECRYPT_DATA` for the signed-in admin; a card posted before they became one stays locked.

The full contract (every identifier, JSON shape, read and Hub request) and the test records are in [docs/apps/Q-Mintership+.md](https://github.com/SJQortal/Q-Apps-Plus/blob/main/docs/apps/Q-Mintership%2B.md).

## Notes for maintainers

- `src/rules/` holds the pure rules that follow Core: the threshold, the window, tallies, doubles, the admin-change projection. Each is pinned by tests.
- `src/writes/` holds every write, built from payload builders with tests.
- `src/data/` holds the reads, and `src/qortal/` the Hub requests.
- `src/hub-theme/` is the shared theme kit from [SJQortal/Q-Apps-Plus](https://github.com/SJQortal/Q-Apps-Plus), copied in, so it can be edited here like any other source.
- `src/constants/plus.ts` holds the few things that differ from the Q-Mintership+ build: the name, the link name, how the copy names Q-Mintership 3, the storage prefix and the About links. Every screen and `index.html` take them from there.
- **Q-Mintership 3** is no longer reachable once 4.0 is published under `Q-Mintership`, and doesn't need to be: its boards, the encrypted Admin Board included, are read in History. If it is ever published under a name of its own, its `qortal://APP/…` link in `ORIGINAL_APP_LINK` (`src/constants/plus.ts`) brings back a link to it in Settings.
- **Dropped from Q-Mintership 3:**
  - The forum: Q-Chat and Q-Mail cover discussion, and every decision and nomination has its own comments.
  - Polls and voting on cards: Minter Admins' answers on chain decide.
  - The broadcast after every action: Home's "Since your last visit" and Hub alerts replace it.
  - Stats snapshot publishing: Activity computes everything live.
  - The Stats page (Mintership Stats, refined in 3.0.6): Activity (MINTER's pulse, each Minter Admin's part, the level spread) and the Explorer cover what it showed; its per-nominator view of how many nominees became minters isn't rebuilt yet.
  - 3.0.7's notification prompt at sign-in: alerts are asked for only when turned on in Settings → Notifications.
  - 3.0.7's in-app preview of a `qortal://` link: links open in a new Hub tab.
  - Posting on the encrypted Admin Board: replaced by Minter Admin polls, notes and comments. Its old cards stay readable in History for Minter Admins.
- **Updates** are built and tested as Q-Mintership+ in [SJQortal/Q-Apps-Plus](https://github.com/SJQortal/Q-Apps-Plus), published there for the community first, then offered here as pull requests.
