# Into the Woods: A Personality Quiz

A choose-your-path story where every click, including *which* "Let's start" button you press, says something about your personality. You get lost in the woods after a bear encounter, survive the night, and get found by a rescue team. Then the quiz tells you who you are.

Built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## How to run it

Open `index.html` in any browser.

## The pattern

Every page is one chapter: a question with 2 to 4 answers. Each answer:

1. adds points toward one or more personality types,
2. shows a short "what happened next" passage at the top of the next page,
3. decides which chapter comes next.

## The story flow

```
Page 1 (pick a start button)
   │
Page 2: the bear
   ├── Run away / Make yourself small ──────────┐
   └── Bark / Snacks ─► Page 2.5: which way? ───┤
                                                ▼
Page 3: lost, phone dying
   ├── Use my phone ─► Page 4: the phone dies ──┐
   └── Find friends ────────────────────────────┤
                                                ▼
Page 5: the fallen tree (leaves / fire / paw prints / bird call)
                                                │
Page 6: hungry and thirsty
   ├── Ration / Gum / Hoard ────────────────────┐
   └── Eat berries & mushrooms ─► Page 6.5: hallucinations
                                                ▼
Page 7: shadows at the edge of the trees
   ├── Call out / Freeze ─► Page 8: the voice that sounds like your friend
   │                          ├── Follow it / Test it ─► Page 9
   │                          └── "Nice try" / "I'm telling!" ─► Page 10
   ├── Walk at them with a stick ─► Page 9
   └── Pretend to sleep ─► Page 10

Page 9: out in the dark (light to the right / water / climb a tree / run)
Page 10: the longest night (keep watch / sing / sleep / spell SOS)
                                                │
Page 11: the flashlight. Rescue team. "What happened out there?"
                                                │
                                             Result
```

### How the ending changes

The rescue scene is put together from your whole path (see `STORY_EXTRAS` in `script.js`):

- **Headed right toward the light:** you find the ranger station yourself.
- **Wandered somewhere else:** the ranger shows you the station was 40 feet from your shelter, and that heading right would have gotten you there.
- **Stayed in your shelter:** you still get rescued, and the ranger says staying put was the right call.
- **Ate the mushrooms:** the shadows were just trees.
- **Heard the voice:** your friends were at the station all along. Nobody on the rescue team was out there calling your name...
- **Neither:** the shadows were "probably deer."
- Little callbacks for starting a fire, rationing your granola bar, hiding trail mix and giving your snacks to the bear.

## The 10 personality types

Each type is matched to an MBTI / 16 Personalities type, an Enneagram type and a Big Five lean, shown on the results page.

| Type | Core idea | MBTI | Enneagram |
|---|---|---|---|
| **The Eagle Scout** | organized planner | ESTJ | 3, Achiever |
| **The Survivalist** | prepared for the worst | ISTJ | 6, Loyalist |
| **The Night Watch** | observant, on guard | INFJ | 5, Investigator |
| **The Trailblazer** | bold leader | ENTJ | 8, Challenger |
| **The Lone Wolf** | self-reliant, looks out for number one | ISTP | 5, Investigator |
| **The Campfire Bard** | creative storyteller | ENFP | 4, Individualist |
| **The Mushroom Mystic** | adventurous, overconfident | ESTP | 7, Enthusiast |
| **The Field Medic** | loyal caretaker | ISFJ | 2, Helper |
| **The Tattletale** | rule-follower, keeps the record straight | ESFJ | 1, Reformer |
| **The Happy Camper** | easygoing, unbothered | ISFP | 9, Peacemaker |

**Result = the type with the most points.** The second-highest is shown as your "streak." If two types tie, the one your most recent answers pointed to wins.

## Files

- `index.html`: every page of the quiz
- `style.css`: the forest theme, button sizes and phone layout
- `script.js`: answer data, story text, scoring and results

## Adding a chapter

1. Copy a `<section>` in `index.html`, give it a new `id` and new `data-choice` keys.
2. Add those keys to `ANSWERS` in `script.js` with `text`, `trait`, `points`, `outcome` and `next`.
3. Point an earlier answer's `next` at the new page.

## Ideas for next steps

- Add a "share your result" button
- Save past results with `localStorage`
