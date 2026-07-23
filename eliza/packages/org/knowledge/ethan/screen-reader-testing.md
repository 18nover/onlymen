# Screen Reader Testing

## Overview

The screen reader pass is the core of every Ethan audit: a structured walk of
a screen or flow with VoiceOver (iOS) and TalkBack (Android), recorded finding
by finding. A checklist can't hear a bad announcement — only the pass can.
Every user-facing change gets at least the smoke pass; release candidates get
the full pass on all changed screens.

---

## Setup

### VoiceOver (iOS)
- Enable: Settings → Accessibility → VoiceOver, or triple-click side button
  (configure Accessibility Shortcut first).
- Essential gestures: swipe right/left (next/previous element), double-tap
  (activate), two-finger scrub (escape/back), three-finger swipe (scroll),
  rotor twist (navigation mode: headings, links, adjustable).
- Turn on the caption panel (Settings → Accessibility → VoiceOver → Caption
  Panel) so findings can be screenshotted with the spoken text visible.

### TalkBack (Android)
- Enable: Settings → Accessibility → TalkBack, or volume-keys shortcut.
- Essential gestures: swipe right/left, double-tap, swipe down-then-left
  (back), two-finger swipe (scroll), swipe up-then-right (TalkBack menu),
  reading controls via swipe up/down.
- Enable "Display speech output" in TalkBack developer settings for
  screenshot evidence.

Test on real devices when possible; the iOS Simulator's VoiceOver differs in
focus behavior from hardware, and the Android emulator needs TalkBack
side-loaded from the Play Store image.

---

## The smoke pass (every change, ~10 minutes)

1. **Cold read**: open the changed screen, swipe from the first element to
   the last. Every element announces a sensible name + role + state; nothing
   essential is skipped; nothing decorative is announced.
2. **Activate everything interactive**: double-tap each control. State changes
   are announced ("on"/"off", "selected"); async results are announced
   without stealing focus.
3. **Escape**: from any modal/sheet/viewer the screen reader user can get
   out (scrub gesture / back gesture / focusable close button).
4. **Reading order sanity**: order matches the visual logic — heading,
   content, actions; not layout-DOM order.

## The full pass (release candidates)

Everything in the smoke pass, plus:

5. **Forms**: every input announces its label, current value, and
   error state; submitting with errors moves focus (or announces) usefully.
6. **Dynamic content**: pull-to-refresh, pagination, live updates — new
   content is discoverable, announcements are polite (don't interrupt).
7. **Rotor / reading controls**: headings navigation lands on real section
   boundaries; adjustable controls (sliders) respond to increment/decrement.
8. **Both themes** and **largest Dynamic Type size** with the screen reader
   active — scaled text changes focus rects and can create clipped,
   unreachable elements.
9. **Interruptions**: incoming call / notification while focused inside a
   modal; focus is restored, not lost.

---

## Recording findings

One finding per line item, in this shape:

```
[Severity] WCAG <criterion> — <screen> / <element>
  Experienced: what the screen reader user hears/hits
  Expected: what a correct implementation announces/does
  Fix: the concrete RN API change
  Evidence: screenshot/recording ref with caption panel visible
```

Example:

```
[Blocker] WCAG 4.1.2 — Notification settings / channel toggles
  Experienced: "Push, button" — no state; toggling gives no feedback
  Expected: "Push notifications, switch, on" and announces "off" on toggle
  Fix: accessibilityRole="switch" + accessibilityState={{ checked }}
  Evidence: voiceover-notif-toggles.mp4
```

Findings feed the org review flow: file blockers as ESCALATE immediately,
bundle major/minor into the review verdict, and re-run the relevant pass
after fixes land. Sign-off requires a clean full pass on both screen readers.

---

## Platform gotchas

- **iOS groups nested touchables** unexpectedly; `accessible={true}` on a
  parent silently swallows children. Audit grouping any time a row has more
  than one action.
- **TalkBack double-announces** when both a parent and child carry labels —
  usually a missing `importantForAccessibility="no"` on the duplicate.
- **`accessibilityLiveRegion` is Android-only**; iOS needs
  `announceForAccessibility` — status messages must be tested per platform.
- **Order matters on Android**: `accessibilityState` changes announced only
  if the state object identity changes — memoized components can eat
  announcements.
- **Headings rotor on RN** requires `accessibilityRole="header"`; there is
  no heading *level* on mobile, so structure must be shallow and clear.
