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
Name page
   │
Wake-up question (no story): "Hike at 7 a.m. What time are you waking up?"
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
Chapter 9: everyone finds a thumbnail-sized key with a star that shines in the moonlight (dollhouse key / fairy key / evidence / cheeseburger wish)
                                                │
Chapter 10: a tiny door under the tree trunk (the star key fits it)
   ├── Try the key / Kick it open ─► Chapter 10½: the fairy's favor
   │                                                          (way out / find friends / a spell / stay)
   └── "Just a decoration" / "Absolutely not" ─► rescued right away
                                                ▼
Page 11: the flashlight. Rescue team. "What happened out there?"
                                                │
                                             Result
```

### How the ending changes

The rescue scene is put together from your whole path (see `STORY_EXTRAS` in `script.js`):

- **Opened the tiny door:** the fairy gets you to the station, and you find a note in your pocket: "Thanks for the key, it's not an actual spell."
- **Didn't open it:** as you leave, the fairy waves sadly from his doorway. He could have walked you out hours ago.
- **Headed right toward the light:** the ranger says you were headed straight for the station.
- **Wandered somewhere else:** the ranger shows you the station was 40 feet from your shelter, and that heading right would have gotten you there.
- **Stayed in your shelter:** you still get rescued, and the ranger says staying put was the right call.
- **Ate the mushrooms:** the shadows were just trees.
- **Heard the voice:** your friends were at the station all along. Nobody on the rescue team was out there calling your name...
- **Neither:** the shadows were "probably deer."
- Little callbacks for starting a fire, rationing your granola bar, hiding trail mix and giving your snacks to the bear.

## The 10 personality types

Each type's results page shows a real photo (no AI images), its strengths and watch-outs, and a "What makes you tick" section. That section borrows ideas from MBTI, the Enneagram and the Big Five, but describes them in plain words instead of showing test labels, since a story quiz can't really measure things like introversion vs. extraversion.

| Type | Core idea | Photo |
|---|---|---|
| **The Eagle Scout** | organized planner | bald eagle chicks |
| **The Survivalist** | prepared for the worst | chipmunk with stuffed cheeks |
| **The Night Watch** | observant, on guard | barred owl |
| **The Trailblazer** | bold leader | mountain goat kid |
| **The Lone Wolf** | self-reliant, looks out for number one | howling wolf pup |
| **The Campfire Bard** | creative storyteller | grasshopper (sings all summer instead of working) |
| **The Mushroom Mystic** | adventurous, overconfident | snail on tiny mushrooms |
| **The Field Medic** | loyal caretaker | Saint Bernard puppy |
| **The Tattletale** | rule-follower, keeps the record straight | meerkat on sentry duty |
| **The Happy Camper** | easygoing, unbothered | lounging capybara |

**Result = the type with the most points.** The second-highest is shown as your "streak." If two types tie, the one your most recent answers pointed to wins.

### How you answer counts too

- **Slow answers:** spending more than 2 minutes on a question (time with the tab in the background doesn't count) adds +0.25 to The Happy Camper (the laziest type). At most 3 slow questions count (+0.75 max).
- **Going back:** pressing "back" more than 3 times in total (same question or different ones) adds +0.5 to The Glamper (picky perfectionist), once.
- The result page has a "How you took the quiz" box that explains any of these nudges. Share links carry them too (`&slow=N&back=N`), so friends see the same result.

Each result has 6 strengths and 6 watch-outs. The watch-outs are written to be blunt on purpose.

## Files

- `index.html`: every page of the quiz
- `style.css`: the forest theme, button sizes and phone layout
- `script.js`: answer data, story text, scoring, results and sharing
- `personalities.html`: every personality side by side (built from `RESULTS` in `script.js`)
- `images/`: one photo per personality type (credits below)

## Adding a chapter

1. Copy a `<section>` in `index.html`, give it a new `id` and new `data-choice` keys.
2. Add those keys to `ANSWERS` in `script.js` with `text`, `points`, `outcome` and `next`.
3. Point an earlier answer's `next` at the new page.

## Ideas for next steps

- Save past results with `localStorage`

## Photo credits

All photos are real photographs from [Wikimedia Commons](https://commons.wikimedia.org/), saved in `images/`.

| File | Photographer | License | Source |
|---|---|---|---|
| `scout.jpg` | Dave Menke, U.S. Fish & Wildlife Service | Public domain | [link](https://commons.wikimedia.org/wiki/File:Bald_eagle_chicks_-_DPLA_-_3b7711bbef7b06dc32fc138bf95e138a.jpg) |
| `survivalist.jpg` | Ashley Lee | CC BY 4.0 | [link](https://commons.wikimedia.org/wiki/File:Chipmunk_with_Full_Cheeks.jpg) |
| `nightwatch.jpg` | Dick Daniels | CC BY-SA 3.0 | [link](https://commons.wikimedia.org/wiki/File:Barred_Owl_(Strix_varia)_RWD.jpg) |
| `trailblazer.jpg` | Charles J. Sharp | CC BY-SA 4.0 | [link](https://commons.wikimedia.org/wiki/File:Mountain_goat_(Oreamnos_americanus)_kid_Radium.jpg) |
| `lonewolf.jpg` | U.S. Fish & Wildlife Service | Public domain | [link](https://commons.wikimedia.org/wiki/File:Mexican_wolf_pup_(6411046205).jpg) |
| `bard.jpg` | Colette Gemmell | CC BY 4.0 | [link](https://commons.wikimedia.org/wiki/File:Grasshopper_in_Clover.jpg) |
| `mystic.jpg` | Chainfoto | CC0 | [link](https://commons.wikimedia.org/wiki/File:Snail_and_mushroom.jpg) |
| `medic.jpg` | dbking | CC BY 2.0 | [link](https://commons.wikimedia.org/wiki/File:St._Bernard_puppy.jpg) |
| `tattletale.jpg` | Mathias Appel | CC0 | [link](https://commons.wikimedia.org/wiki/File:Meerkat_Standing.jpg) |
| `camper.jpg` | Wilfredor | CC0 | [link](https://commons.wikimedia.org/wiki/File:Hydrochoeris_hydrochaeris_in_Brazil_in_Petr%C3%B3polis,_Rio_de_Janeiro,_Brazil_09.jpg) |
| `glamper.jpg` (white kitten) | Firman MPH (via Pixabay) | CC0 | [link](https://commons.wikimedia.org/wiki/File:A_white_kitten.jpg) |
| `schemer.jpg` | Tognopop's grandfather | Public domain | [link](https://commons.wikimedia.org/wiki/File:Red_fox_pup_in_a_forest_of_Haute-Normandie.jpg) |
