# Tic Tac Toe

A two player Tic Tac Toe game for the browser. No frameworks, no build step —
just HTML, CSS and vanilla JavaScript.

**▶ Play it: https://marycrisestudillo.github.io/Tictactoe-Game/**

## Features

- **Two players, one screen.** X always opens. The game calls the win as soon
  as a line completes, and a full board with no line is a tie.
- **Replay.** Once a game ends, *Previous* and *Next* step back and forth
  through the moves so you can walk through how it played out.
- **Light and dark mode.** Follows your system setting until you pick a side
  with the toggle in the corner, after which your choice is remembered.
- **Confetti on a win**, coloured from the winning mark — pink for X, green
  for O, and both when it ends in a tie.
- **Responsive.** One centred layout that works from a 320px phone up to a
  desktop, and rearranges itself on short landscape screens so the board sits
  beside the controls.
- **Keyboard and screen reader friendly.** Every square is a real button, the
  turn indicator is a live region, and animation is skipped for anyone who has
  asked their system to reduce motion.

## How to play

Press **Start Game**, then take turns tapping squares. **Restart** clears the
board at any time. When someone wins, the replay controls appear beneath the
board.

## Running it locally

There is nothing to install or compile. Either open `index.html` directly, or
serve the folder if you prefer a real origin:

```sh
python3 -m http.server 3000
```

Then visit http://localhost:3000.

## How it is put together

| File | What it does |
| --- | --- |
| `index.html` | Markup, and the small inline script that sets the theme before first paint |
| `styles.css` | All styling, driven by custom properties for the two themes and for sizing |
| `script.js` | Game rules, turn handling and the replay |
| `theme.js` | Light/dark switching and the toggle tip |
| `confetti.js` | The canvas confetti burst |
| `images/` | The wordmarks, the X and O marks, and the background artwork |

A few notes on the approach:

- **Sizing comes from tokens, not breakpoints.** `clamp()` and `min()` do most
  of the work, so there is only one layout breakpoint in the whole stylesheet —
  the short landscape screens. The remaining media queries ask about the
  device rather than its width: whether it can hover, and whether the player
  has asked for reduced motion.
- **The board is a CSS grid** and its dividing lines are cell borders, so they
  stay aligned with the squares at every size.
- **Buttons share one base style.** Each variant only supplies its colours
  through custom properties.

The only external request is the Google Fonts stylesheet for *Montserrat
Alternates* and *Poppins*; the game itself has no dependencies.
