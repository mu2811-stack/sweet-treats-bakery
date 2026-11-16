/* ==========================================================================
   Crumbs & Co. starter  ·  ITE 270 Module 5
   Rule for this whole file: JavaScript decides WHEN. CSS decides HOW IT LOOKS.
   Most of your JavaScript should only add or remove a class, set a data
   attribute, or set a CSS custom property. The exception is STEP 7.
   ========================================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Small helper for STEP 7: shows a message and announces it to screen readers */
const toast = $('#toast');
let toastTimer;
function announce(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}


/* ---------- STEP 5: reveal on scroll (R4) ----------------------------------
   1. Make an IntersectionObserver. When an entry isIntersecting, remove
      'pending' from entry.target and stop observing it.
   2. Loop over $$('.reveal'). If an element's getBoundingClientRect().top is
      greater than innerHeight (below the fold), add 'pending' and observe it.
   3. Skip all of this if `reduced` is true.                                 */

if (!reduced) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        observer.unobserve(entry.target);
      }
    });
  });

  $$('.reveal').forEach((element) => {
    if (element.getBoundingClientRect().top > innerHeight) {
      element.classList.add('pending');
      observer.observe(element);
    }
  });
}


/* ---------- STEP 6, OPTION A: steps that change a sticky picture (R5) ------
   1. const STORY_MARGIN = '-45% 0px -45% 0px';   (a band in the middle of the screen)
   2. Observe every .step with { rootMargin: STORY_MARGIN }.
   3. When one isIntersecting, set $('#stage').dataset.step = entry.target.dataset.step
      and update #stageLabel's text.
   4. So you can SEE the band: window.motionXray && motionXray.zone(STORY_MARGIN);  */

const STORY_MARGIN = '-45% 0px -45% 0px';

if (!reduced) {
  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stage = $('#stage');
        const label = $('#stageLabel');

        if (stage) {
          stage.dataset.step = entry.target.dataset.step;
        }

        if (label) {
          label.textContent = entry.target.dataset.step;
        }
      }
    });
  }, { rootMargin: STORY_MARGIN });

  $$('.step').forEach((step) => {
    storyObserver.observe(step);
  });

  if (window.motionXray) {
    window.motionXray.zone(STORY_MARGIN);
  }
}


/* ---------- STEP 6, OPTION B: scroll progress for a product zoom (R5) ------
   On scroll (inside requestAnimationFrame):
     const r = zoom.getBoundingClientRect();
     const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
     zoom.style.setProperty('--p', p.toFixed(3));
   If `reduced`, set --p to 1 and skip the listener.                         */




/* ---------- STEP 7: click interaction with element.animate() (R6) ----------
   For every .add button:
     1. Update the count and announce(`${name} added. ${count} in your order.`)
     2. Animate something with element.animate([...keyframes], { duration, easing }).
        Ideas: fly a copy of the card's .art to #cart; pop the button; wiggle the cart.
     3. Chain a second animation with .finished.then(() => ...),
        for example a bounce on #count.
     4. If `reduced`, skip the travel and just update the count.             */

let count = 0;
$$('.add').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    const name = card?.querySelector('h3')?.textContent || 'Treat';

    count++;
    const counter = $('#count');

    if (counter) {
      counter.textContent = count;
    }

    announce(`${name} added. ${count} in your order.`);

    if (reduced) return;

    const first = button.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.15)' },
        { transform: 'scale(1)' }
      ],
      {
        duration: 450,
        easing: 'ease-out'
      }
    );

    first.finished.then(() => {
      if (counter) {
        counter.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.4)' },
            { transform: 'scale(1)' }
          ],
          {
            duration: 450,
            easing: 'ease-in-out'
          }
        );
      }
    });
  });
});


/* ---------- STEP 9: pause button (R8) ---------------------------------------
   Toggle the class 'paused' on document.documentElement, flip aria-pressed,
   and change the button text between "Pause motion" and "Play motion".     */

const pauseButton = $('#pauseBtn');
if(pauseButton) {
  pauseButton.addEventListener('click', () => {
    const paused = document.documentElement.classList.toggle('paused');

    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.textContent = paused ? 'Play motion' : 'Pause motion';

    document.getAnimations().forEach((animation) => {
      if (paused) {
        animation.pause();
      } else {
        animation.play();
      }
    });
  });
}
