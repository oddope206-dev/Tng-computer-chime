# TNG Computer Chime

WebAudio/Tone.js recreation of the Star Trek: The Next Generation computer double-chime.

- **Play** the chime and tweak parameters live.
- Settings persist in the page URL for easy sharing.
- GitHub Pages deploy via Actions.

## Local preview
Open `index.html` in a browser and click **Play** (requires user gesture).

## Parameters
- `pitch1`, `pitch2` (Hz) — base frequencies
- `glide` — upward bend factor (1.00–1.12)
- `gap` — time between chirps
- `hipass` — filter cutoff (Hz)
- `wet`, `decay` — reverb amount and length
- `vol` — output volume in dB

## License
For personal/research use. This project recreates a UI chime for homage/fan use.
