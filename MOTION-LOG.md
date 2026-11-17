# Motion Log

**Student:** Maryam Urooj  
**Shop name:** Sweet Treats Bakery  
**Live site:** Not published yet

## Motion sentences

| # | Req | Trigger | Element | Property | Duration / delay | Easing | Job | Tool |
|---|---|---|---|---|---|---|---|---|
| 1 | R1 | Hover or focus | Menu card | translateY 0 to -6px | 450ms | ease-out | Feedback | transition |
| 2 | R2 | Page loads | Headline words | Opacity and translateY | 900ms, staggered delays | ease-out | Orientation | @keyframes |
| 3 | R3 | Page is open | Pink flag | Rotation | 2s, repeating | ease-in-out | Delight | @keyframes |
| 4 | R3 | Page is open | OPEN sign | Rotation | 2s, repeating | ease-in-out | Delight | @keyframes |
| 5 | R4 | Scrolling to menu | Menu cards | Opacity and translateY | Medium duration, staggered delays | ease-out | Storytelling | IntersectionObserver |
| 6 | R5 | Scrolling through baking steps | Dough | Scale and fill color | 900ms | ease-out | Storytelling | IntersectionObserver |
| 7 | R6 | Clicking Add to Order | Button | Scale | 450ms | ease-out | Feedback | element.animate() |
| 8 | R6 | First animation finishes | Cart counter | Scale | 450ms | ease-in-out | Status | element.animate() |

## Easing choices (R7)

1. **Ease-out:** I used ease-out for the menu cards because it makes them appear smoothly and slow down at the end.
2. **Ease-in-out:** I used ease-in-out for the pink flag and OPEN sign because it makes them move gently back and forth.
3. **Ease:** I used ease for the dough color change because it makes the color change smoothly when the dough is baked.

## What I saw in the X-ray

When I opened Motion X-ray, I could see the timing, delays, and easing of my headline animation. The words appeared one after another. I could see the different delays more clearly than when I watched the animation at normal speed.

## Checks

- [ ] (R8) Reduced motion emulated in DevTools: what still moves, and what stops?
- [ ] (R8) Pause button stops every infinite loop, and works from the keyboard
- [ ] (R8) Every :hover effect also happens on :focus-visible
- [ ] (R8) Nothing flashes more than 3 times per second
- [ ] (R9) Paint flashing checked: my animations use transform and opacity
- [ ] (R9) No `transition: all` anywhere
- [ ] (R4) With JavaScript disabled, every card is still visible
