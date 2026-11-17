
/* Sweet Treats Bakery — ITE-270 Final */

/* STEP 1: Helpers */
const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const motionPreference = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
);

let reduced = motionPreference.matches;
let paused = false;

/* STEP 7: Announcement */
const toast = $('#toast');
let toastTimer;

function announce(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

/* STEP 5 — R4: Scroll reveal */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('pending');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

function setupReveals() {
  $$('.reveal').forEach(element => {
    element.classList.remove('pending');
    revealObserver.unobserve(element);

    if (!reduced &&
        element.getBoundingClientRect().top >
        window.innerHeight) {
      element.classList.add('pending');
      revealObserver.observe(element);
    }
  });
}

setupReveals();

/* STEP 6 — R5: OPTION A
   Pinned picture changes on scroll */

const STORY_MARGIN = '-45% 0px -45% 0px';

const stage = $('#stage');
const stageLabel = $('#stageLabel');
const storySteps = $$('.step');

function selectStoryStep(step) {
  if (!stage || !stageLabel || !step) return;

  const name = step.dataset.step;

  stage.dataset.step = name;
  stageLabel.textContent =
    name.charAt(0).toUpperCase() + name.slice(1);
}

const storyObserver = new IntersectionObserver(
  entries => {
    if (reduced) return;

    const visible = entries.filter(
      entry => entry.isIntersecting
    );

    if (visible.length === 0) return;

    const middle = window.innerHeight / 2;

    visible.sort((a, b) => {
      const centerA =
        a.boundingClientRect.top +
        a.boundingClientRect.height / 2;

      const centerB =
        b.boundingClientRect.top +
        b.boundingClientRect.height / 2;

      return Math.abs(centerA - middle) -
             Math.abs(centerB - middle);
    });

    selectStoryStep(visible[0].target);
  },
  { rootMargin: STORY_MARGIN }
);

storySteps.forEach(step => {
  storyObserver.observe(step);
});

/* Update initial state and handle fast scrolling */
function syncStory() {
  if (!storySteps.length || !stage) return;

  if (reduced) {
    selectStoryStep(storySteps[0]);
    return;
  }

  const middle = window.innerHeight / 2;
  let closest = storySteps[0];
  let distance = Infinity;

  storySteps.forEach(step => {
    const rect = step.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const difference = Math.abs(center - middle);

    if (difference < distance) {
      distance = difference;
      closest = step;
    }
  });

  selectStoryStep(closest);
}

let storyFrame = false;

window.addEventListener('scroll', () => {
  if (storyFrame) return;

  storyFrame = true;

  requestAnimationFrame(() => {
    syncStory();
    storyFrame = false;
  });
}, { passive: true });

window.addEventListener('resize', syncStory);

syncStory();

/* Motion X-ray: show observation band */
if (window.motionXray) {
  window.motionXray.zone(STORY_MARGIN);
}

/* STEP 7 — R6: Add to Order
   Two chained animations */


/* STEP 7 — Add to Order Animation (R6) */

let count = 0;

$$('.add').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    const name = card?.querySelector('h3')?.textContent || 'Treat';
    const counter = $('#count');
    const cart = $('#cart');

    // Update the order number
    count++;

    if (counter) {
      counter.hidden = false;
      counter.textContent = count;
    }

    if (cart) {
      cart.setAttribute(
        'aria-label',
        `Your order, ${count} items`
      );
    }

    // Announce to screen readers
    announce(`${name} added. ${count} in your order.`);

    // Respect reduced motion and pause
    if (
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('paused')
    ) return;

    // First animation: button grows
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

    // Second animation: cart number bounces
    first.finished.then(() => {
      if (
        counter &&
        !document.documentElement.classList.contains('paused')
      ) {
        counter.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.4)' },
            { transform: 'scale(1)' }
          ],
          {
            duration: 450,
            easing: 'cubic-bezier(.34, 1.56, .64, 1)'
          }
        );
      }
    }).catch(() => {});
  });
});


/* STEP 9 — R8: Pause Motion */
const pauseButton = $('#pauseBtn');

if (pauseButton) {
  pauseButton.addEventListener('click', () => {
    paused = !paused;

    document.documentElement.classList.toggle(
      'paused',
      paused
    );

    pauseButton.setAttribute(
      'aria-pressed',
      String(paused)
    );

    pauseButton.textContent =
      paused ? 'Play motion' : 'Pause motion';

    document.getAnimations().forEach(animation => {
      if (paused) {
        animation.pause();
      } else {
        animation.play();
      }
    });
  });
}

/* Reduced Motion can change during testing */
function updateReducedMotion(event) {
  reduced = event.matches;
  setupReveals();
  syncStory();

  if (reduced) {
    document.getAnimations().forEach(animation => {
      animation.cancel();
    });
  }
}

motionPreference.addEventListener(
  'change',
  updateReducedMotion
);
