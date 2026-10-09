# just-clock

In-game clock sensor. **Purely scripted.** Namespace `just-clock:`.
min_engine 1.21.80, `@minecraft/server` 2.10.0.

## Content

Two commands registered in `system.beforeEvents.startup` via
`customCommandRegistry`:

- `/just-clock:whats-time` — HH:MM:SS plus the part-of-day name.
- `/just-clock:whats-moon-phase` — moon phase.

All logic is in `BP/scripts/main.js` (81 lines). Time comes from
`world.getTimeOfDay()` with a `+6000` offset.

## Structure

- `BP/scripts/main.js` — everything.
- `RP/` — only `manifest.json`, `pack_icon.png`, `texts/`. No textures or
  models, because the add-on adds nothing visual.

## Conventions

- Comment banners: `// === Time tables ===`, `// === Helpers ===`.
- Data tables are constant arrays of pairs: `STAGE_KEYS` (day stages),
  `MOON_KEYS` (8 phases).
- Results use `CustomCommandStatus.Success`, messages sent through
  `origin.sourceEntity.sendMessage({rawtext:[…]})` with `translate`.
- Uses `?.` and `padStart`.

## Known issues

- **Namespace inconsistency inside the project**: commands use `just-clock:`
  (hyphen), translation keys use `just_clock.time`, `just_clock.stage.*`,
  `just_clock.moon.*` (underscore). Intentional — don't normalise it.
- The script module declares `"entry": "main.js"` **without** the `scripts/`
  prefix; every other project uses `scripts/main.js`. Check the build before
  changing it.
- **`STAGE_KEYS` has 15 entries, not 14** — and the last one is a duplicate
  `morning` entry (`[23460, 24000, "morning"]`). Harmless, but it's why the
  count doesn't match the 14 distinct day stages.
- `package.json` is named `minecraft-scripting-samples` — a Mojang template
  leftover, not the project name.
- No README. Documentation lives in code comments only.
- `verify_all.py` is byte-identical to the one in `books`.