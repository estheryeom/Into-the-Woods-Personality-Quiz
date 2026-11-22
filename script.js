/* =========================================================
   Into the Woods — quiz logic

   HOW IT WORKS
   1. Every button in index.html has a data-choice, like "run".
   2. ANSWERS (below) says what each choice means:
        - text:    a short label for the choice (just for reference)
        - points:  which personality TYPES it adds points to
        - outcome: (optional) what happens next. It's shown at the
                   top of the next page, so the story flows.
        - next:    which page to show next
   3. At the end we add up the points. The type with the most
      points is your result. The second-highest is your "streak".

   POINTS: an answer only gives points to types it truly fits.
   It's fine if some types (like the Lone Wolf) come up rarely.
   Don't tack on a +1 just to even out the totals.

   HOW COMMON EACH TYPE SHOULD BE (roughly, if people answered at
   random). Based on how common the closest Myers-Briggs types are in
   the general US population (Myers-Briggs Foundation sample):
     Field Medic   ~22%  (ESFJ, ENFJ, half of ISFJ: the most common)
     Happy Camper  ~13%  (ISFP, INFP)      Survivalist  ~12%  (ISTJ)
     Eagle Scout    ~9%  (ESTJ)            Glamper       ~9%  (ESFP)
     Campfire Bard  ~8%  (ENFP)            Night Watch   ~7%  (INFJ, INTJ, INTP)
     Tattletale     ~7%  (half of ISFJ)    Lone Wolf     ~5%  (ISTP)
     Mushroom Mystic ~4% (ESTP)            Schemer       ~3%  (ENTP)
     Trailblazer    ~2%  (ENTJ: the rarest)
   If you change points, re-check the mix stays close to this.

   ADDING A NEW CHAPTER
   - Copy a <section> in index.html, give it a new id and new data-choice keys.
   - Add those keys to ANSWERS, and point an earlier answer's "next" at it.
   ========================================================= */

// ---------------------------------------------------------
// The 12 personality types (short names for the meters)
// ---------------------------------------------------------
const TYPES = {
  scout:       "The Eagle Scout",
  survivalist: "The Survivalist",
  nightwatch:  "The Night Watch",
  trailblazer: "The Trailblazer",
  lonewolf:    "The Lone Wolf",
  bard:        "The Campfire Bard",
  mystic:      "The Mushroom Mystic",
  medic:       "The Field Medic",
  tattletale:  "The Tattletale",
  camper:      "The Happy Camper",
  glamper:     "The Glamper",
  schemer:     "The Schemer",
};

// ---------------------------------------------------------
// Every possible answer
// ---------------------------------------------------------
const ANSWERS = {
  // ----- Page 1: which "Let's start" button? -----
  // Every button gives +0.25 to 3 types, and the 4 buttons cover all 12
  // types between them, so everyone starts with the same small head start.
  direct: {
    text: "Clicked the big button in the middle",
    points: { scout: 0.25, survivalist: 0.25, trailblazer: 0.25 },
    outcome: "Saturday, 7 a.m. The second everyone's at the trailhead, you're already walking. Your friends hurry to keep up as the trail climbs into the pines.",
    next: "page-name",
  },
  quirky: {
    text: "Clicked the small button in the top-right corner",
    points: { bard: 0.25, lonewolf: 0.25, mystic: 0.25 },
    outcome: "You show up humming, in a hat nobody asked for. Your friends pretend not to know you. The trail winds into the pines.",
    next: "page-name",
  },
  reliant: {
    text: "Found the tiny button next to the big one",
    points: { nightwatch: 0.25, tattletale: 0.25, medic: 0.25 },
    outcome: "Your friend planned everything, even the bear spray they tucked in your bag \"just in case.\" You follow the group into the pines.",
    next: "page-name",
  },
  carefree: {
    text: "Clicked the medium button at the bottom",
    points: { camper: 0.25, glamper: 0.25, schemer: 0.25 },
    outcome: "Saturday morning. You meet up with your friends at the trailhead. Whatever you forgot to pack, you'll figure it out. The sky is blue, the air smells like pine. What a beautiful day.",
    next: "page-name",
  },

  // ----- Wake-up question (no story, just a question about you) -----
  // No outcome on purpose: page 2 still opens with the start button's story.
  alarm5: {
    text: "Woke up at 5:00, with a backup alarm and a bag packed the night before",
    points: { scout: 2 },
    next: "page2",
  },
  callround: {
    text: "Woke up at 5:45 to call everyone and make sure they were up",
    points: { medic: 3 },
    next: "page2",
  },
  glowup: {
    text: "Woke up at 6:00 for skincare, an outfit and an iced coffee",
    points: { glamper: 2 },
    next: "page2",
  },
  omw: {
    text: "Woke up at 6:50 and texted \"omw!!\" from bed",
    points: { camper: 2, schemer: 1 },
    next: "page2",
  },

  // ----- Page 2: the bear -----
  run: {
    text: "Ran away and left your friends behind",
    points: { lonewolf: 2, survivalist: 2 },
    outcome: "You sprint until the yelling fades. No bear behind you. Also, no trail.",
    next: "page3",
  },
  small: {
    text: "Made yourself small, hoping the bear wouldn't see you",
    points: { nightwatch: 2, survivalist: 1 },
    outcome: "You hold your breath behind a bush. The bear huffs and wanders off. So, apparently, did your friends.",
    next: "page3",
  },
  bark: {
    text: "Barked, and got your friends to bark too",
    points: { bard: 2, trailblazer: 1 },
    outcome: "You bark. Your friends join in. The bear tilts its head. For one glorious second, it works. Then it charges.",
    next: "page2-5",
  },
  snacks: {
    text: "Offered the bear your snacks",
    points: { camper: 2, schemer: 1 },
    outcome: "The bear eats your gummy worms, bag and all. Then it looks at you like you're dessert.",
    next: "page2-5",
  },

  // ----- Page 2.5: which way do you run? -----
  straight: {
    text: "Ran straight ahead without looking back",
    points: { survivalist: 2, lonewolf: 1 },
    outcome: "You run until your legs give out. Behind you: nothing but trees.",
    next: "page3",
  },
  left: {
    text: "Turned left",
    points: { mystic: 2 },
    outcome: "You crash through some ferns and tumble down a slope. Which way was up again?",
    next: "page3",
  },
  right: {
    text: "Turned right",
    points: { survivalist: 2, nightwatch: 1 },
    outcome: "You run until the crashing fades. No bear. No friends either.",
    next: "page3",
  },
  help: {
    text: "Turned around to help your friends",
    points: { medic: 3 },
    outcome: "You blast the bear spray. Most of it hits the bear. Some hits you. When you can see again, everyone is gone.",
    next: "page3",
  },

  // ----- Page 3: lost in the woods -----
  phone: {
    text: "Kept using your dying phone to find a way out",
    points: { lonewolf: 2, glamper: 1 },
    outcome: "The screen {{flickers}}, shows 1%, and goes black.",
    next: "page4",
  },
  friends: {
    text: "Trusted that you could find your friends",
    points: { medic: 2, trailblazer: 1 },
    outcome: "You call their names for an hour. Nobody answers.",
    next: "page-camp",
  },

  // ----- Page 4: the phone dies -----
  throw: {
    text: "Threw your dead phone at the ground",
    points: { glamper: 2, bard: 1 },
    outcome: "The screen cracks. That felt great for two whole seconds.",
    next: "page-camp",
  },
  shelter: {
    text: "Decided to find shelter before dark",
    points: { survivalist: 2, scout: 1 },
    outcome: "You look for anything that could block the wind.",
    next: "page-camp",
  },
  retrace: {
    text: "Retraced your steps, trusting your sense of direction",
    points: { trailblazer: 1, mystic: 1 },
    outcome: "You're sure you came this way. Pretty sure.",
    next: "page-camp",
  },
  stay: {
    text: "Stayed right where you were so you couldn't get more lost",
    points: { scout: 2, tattletale: 1 },
    outcome: "You sit on a rock. Technically, this is what the experts say to do.",
    next: "page-camp",
  },

  // ----- Page 4.5: the empty campsite -----
  raid: {
    text: "Took the backpack, finders keepers",
    points: { schemer: 2, lonewolf: 1 },
    outcome: "You yank the backpack off the branch. Inside: a sleeve of cookies and a headlamp. The headlamp is dead. The cookies are not. You keep walking.",
    next: "page5",
  },
  iou: {
    text: "Borrowed one granola bar and left a sorry note",
    points: { tattletale: 3 },
    outcome: "\"Sorry! I borrowed 1 granola bar (oat & honey).\" You tuck the note under a rock and keep walking.",
    next: "page5",
  },
  tentnap: {
    text: "Rescued a real pillow from the torn tent",
    points: { glamper: 2, camper: 1 },
    outcome: "The tent is a lost cause: ripped wide open and soaked through. But the pillow is dry. You hug it to your chest and keep walking.",
    next: "page5",
  },
  backstory: {
    text: "Looked through their stuff to figure out who lives there",
    points: { bard: 2, mystic: 1 },
    outcome: "A crossword, three harmonicas and a photo of a goat in a sweater. You decide it belongs to a retired magician, and leave before he gets back.",
    next: "page5",
  },

  // ----- Page 5: the fallen tree -----
  leaves: {
    text: "Shed a single tear and gathered dry leaves for a cushion",
    points: { camper: 2, glamper: 1 },
    outcome: "Your leaf pile is cozy. Well, cozy-ish.",
    next: "page6",
  },
  fire: {
    text: "Started a fire, thanks to survival shows",
    points: { mystic: 2, trailblazer: 1 },
    outcome: "Three blisters and a lot of swearing later, you have a small, [[smoky fire]].",
    next: "page6",
  },
  paws: {
    text: "Noticed the paw prints around the tree",
    points: { nightwatch: 2, tattletale: 1 },
    outcome: "The paw prints are old. Probably. You sit where you can see anything coming.",
    next: "page6",
  },
  birdcall: {
    text: "Used your friend group's weird bird call: \"BAKAAAH BAKAAAH\"",
    points: { bard: 2, medic: 1 },
    outcome: "Your bird call echoes through the trees. Nothing answers.",
    next: "page6",
  },

  // ----- Page 6: hungry and thirsty -----
  ration: {
    text: "Rationed the granola bar and water you packed",
    points: { scout: 2, survivalist: 1 },
    outcome: "One third of a granola bar. Three sips of water. Then you hear something.",
    next: "page7",
  },
  forage: {
    text: "Ate random berries and mushrooms because of a reel",
    points: { mystic: 2 },
    outcome: "The mushrooms taste like a basement. You eat them anyway.",
    next: "page6-5",
  },
  gum: {
    text: "Chewed your last piece of gum and called it dinner",
    points: { camper: 3 },
    outcome: "The gum stopped tasting like anything an hour ago. Then you hear something.",
    next: "page7",
  },
  hoard: {
    text: "Secretly kept your trail mix to yourself",
    points: { schemer: 2, survivalist: 1 },
    outcome: "You eat it one piece at a time so the bag doesn't crinkle. Nobody's here. Then you hear something.",
    next: "page7",
  },

  // ----- Page 6.5: the mushrooms kick in -----
  listen: {
    text: "Listened to what the trees had to say",
    points: { bard: 2 },
    outcome: "The trees mostly want to talk about you. Then, all at once, they go quiet.",
    next: "page7",
  },
  purge: {
    text: "Made yourself throw up the mushrooms",
    points: { survivalist: 2 },
    outcome: "You feel awful, but a bit more like yourself. Mostly.",
    next: "page7",
  },
  carve: {
    text: "Carved a note blaming the influencer",
    points: { tattletale: 3 },
    outcome: "Big, shaky letters. At least they'll know who to blame.",
    next: "page7",
  },
  more: {
    text: "Ate more mushrooms, for science",
    points: { mystic: 3 },
    outcome: "The forest gets much, much louder.",
    next: "page7",
  },

  // ----- Page 7: shadows -----
  callout: {
    text: "Called out to the shadows, hoping they were your friends",
    points: { medic: 2 },
    outcome: "Your voice cracks. The shapes don't move.",
    next: "page8",
  },
  freeze: {
    text: "Froze and gripped the bear spray",
    points: { nightwatch: 2, survivalist: 1 },
    outcome: "Your thumb finds the trigger. The shapes don't move either.",
    next: "page8",
  },
  stick: {
    text: "Grabbed a stick and walked straight at the shadows",
    points: { trailblazer: 2 },
    outcome: "You march at them, stick raised. Nothing there. And now you can't see your shelter.",
    next: "page9",
  },
  pretend: {
    text: "Pretended to be asleep",
    points: { schemer: 2, camper: 1 },
    outcome: "You count to five hundred and peek. The shapes are gone. Or somewhere you can't see.",
    next: "page10",
  },

  // ----- Page 8: the voice -----
  follow: {
    text: "Followed the voice that sounded like your friend",
    points: { medic: 2, camper: 1 },
    outcome: "The voice stays just ahead of you, then stops. You're alone, and your shelter is gone.",
    next: "page9",
  },
  question: {
    text: "Tested the voice with a question only your friend would know",
    points: { schemer: 2, nightwatch: 1 },
    outcome: "\"What's our group chat called?\" Silence. Then, right behind your ear: \"Come here.\" You run.",
    next: "page9",
  },
  nicetry: {
    text: "Told the voice \"Nice try\" and stayed put",
    points: { survivalist: 2, lonewolf: 1 },
    outcome: "It calls your name for an hour. Then it stops.",
    next: "page10",
  },
  rocks: {
    text: "Threw rocks at the voice",
    points: { trailblazer: 2 },
    outcome: "The second rock hits something with a soft thunk. The voice stops mid-word, and something big crashes away.",
    next: "page10",
  },

  // ----- Page 9: out in the dark (each one finds the key) -----
  lightright: {
    text: "Headed right, toward a faint light",
    points: { scout: 2, trailblazer: 1 },
    outcome: "The light bobs and drifts like no firefly should. Then it winks out, and something glints in the moss where it was.",
    next: "page-key",
  },
  water: {
    text: "Followed the sound of running water",
    points: { survivalist: 2 },
    outcome: "You slide down to a creek. The water is ice cold and perfect. On the bank, something twinkles in the moonlight.",
    next: "page-key",
  },
  climb: {
    text: "Climbed a tree to look around",
    points: { nightwatch: 1, bard: 1 },
    outcome: "The branch cracks, and you slide back down. Something tiny falls out of a knot in the trunk and bonks you on the head.",
    next: "page-key",
  },
  bolt: {
    text: "Ran blindly into the dark",
    points: { lonewolf: 2 },
    outcome: "A root trips you, face-first into the dirt. Something tiny and hard pokes your cheek.",
    next: "page-key",
  },

  // ----- Page 10: the longest night (each one finds the key) -----
  watch: {
    text: "Stayed up on watch all night",
    points: { nightwatch: 3 },
    outcome: "Around 3 a.m., you spot something you've been staring past all night: a tiny glint by your foot.",
    next: "page-key",
  },
  sing: {
    text: "Sang every song you know, loudly",
    points: { bard: 3 },
    outcome: "Fourth chorus in, a tiny voice nearby says, \"Oh, come ON.\" Something glints by your foot that wasn't there before.",
    next: "page-key",
  },
  sleep: {
    text: "Curled up and went to sleep",
    points: { camper: 3 },
    outcome: "You dream of tiny lights whispering about you. You wake to something small resting on your chest.",
    next: "page-key",
  },
  sos: {
    text: "Spelled out SOS with sticks and rocks",
    points: { scout: 2, trailblazer: 1 },
    outcome: "Someone has added a tiny pebble smiley face next to your SOS. Beside it, something glints.",
    next: "page-key",
  },

  // ----- Chapter 9: the star key (everyone finds it) -----
  // (Keys still say "wand" so old share links keep working.)
  toy: {
    text: "Decided the star key was from a dollhouse",
    points: { scout: 2, survivalist: 1 },
    outcome: "You pocket it. The star gives off a tiny spark. Static. Obviously.",
    next: "page-door",
  },
  fairywand: {
    text: "Knew it was a real fairy's key",
    points: { bard: 2, mystic: 1 },
    outcome: "You hold it up, and the ((star)) shines brighter, like it's happy to be found. You knew it.",
    next: "page-door",
  },
  evidence: {
    text: "Treated the star key as evidence",
    points: { tattletale: 2, nightwatch: 1 },
    outcome: "You pinch it by the edges like a detective. Someone small dropped this. Then you spot the next clue.",
    next: "page-door",
  },
  burger: {
    text: "Wished on the key's star for a cheeseburger",
    points: { glamper: 2, camper: 1 },
    outcome: "\"One cheeseburger, please.\" Nothing. But the star flickers, like it's laughing at you.",
    next: "page-door",
  },

  // ----- Chapter 10: the tiny door -----
  tapwand: {
    text: "Tried the star key in the tiny door",
    points: { mystic: 2 },
    outcome: "It fits. Click. The door swings open, and warm light spills out, along with the smell of cinnamon rolls.",
    next: "page-fairy",
  },
  pick: {
    text: "Gave up on the key and kicked the tiny door open",
    points: { lonewolf: 2, trailblazer: 1 },
    outcome: "One kick. The tiny door bangs open, and warm light spills out, along with the smell of cinnamon rolls.",
    next: "page-fairy",
  },
  decoration: {
    text: "Decided the tiny door was just a decoration",
    points: { scout: 2 },
    outcome: "You leave it alone. Minutes later, a flashlight lands on your face. \"HEY! We've got one!\"",
    next: "page11",
  },
  nope: {
    text: "Stayed far away from the tiny door",
    points: { nightwatch: 2, survivalist: 1 },
    outcome: "You scoot away, backward, right into someone's legs. A flashlight clicks on. \"Search and rescue! You're okay!\"",
    next: "page11",
  },

  // ----- Chapter 10½: the fairy's favor -----
  wayhome: {
    text: "Asked the fairy for the way out",
    points: { scout: 2, trailblazer: 1 },
    outcome: "He snaps his fingers, and glowing mushrooms pop up in a path. It's a very short walk. A flashlight hits your face. \"HEY! We've got one!\"",
    next: "page11",
  },
  findfriends: {
    text: "Asked the fairy to find your friends",
    points: { medic: 3 },
    outcome: "He confers with a moth. \"They're fine. They're at the ranger station, eating your snacks.\" Glowing mushrooms light the way. \"HEY! We've got one!\"",
    next: "page11",
  },
  spell: {
    text: "Asked the fairy to teach you a spell",
    points: { bard: 2, schemer: 1 },
    outcome: "He teaches you a spell for finding lost things. You spin three times, feeling ridiculous, and stop facing a porch light. \"HEY! We've got one!\"",
    next: "page11",
  },
  stayhere: {
    text: "Asked the fairy if you could stay",
    points: { glamper: 2, camper: 1 },
    outcome: "\"Absolutely not. You'd track mud everywhere.\" He gives you a thimble of tea that warms you to your toes, then points past you. \"Your ride's here.\"",
    next: "page11",
  },

  // ----- Page 11: rescued -----
  blame: {
    text: "Told the ranger the hike was your friend's idea",
    points: { tattletale: 3, schemer: 1 },
    outcome: "The ranger writes down your friend's name. Your friend, ten feet away, hears every word. You get a ride home and sleep for eleven hours.",
    next: "result",
  },
  askfriends: {
    text: "Asked if your friends were okay",
    points: { medic: 3 },
    outcome: "\"They're fine. One of them cried a little.\" You get a ride home and sleep for eleven hours.",
    next: "result",
  },
  handled: {
    text: "Insisted you had it handled",
    points: { lonewolf: 2, trailblazer: 1 },
    outcome: "\"Sure you did.\" She hands you a second foil blanket anyway. You get a ride home and sleep for eleven hours.",
    next: "result",
  },
  food: {
    text: "Asked if there was any food",
    points: { glamper: 2, camper: 1 },
    outcome: "She finds you a granola bar. You eat it in two bites and ask about a second one. You get a ride home and sleep for eleven hours.",
    next: "result",
  },
};

// Answers from pages that were taken out of the quiz. Old share links may
// still have them, so they're quietly dropped instead of breaking the link.
//   carousel, saga, timeline, nexttrip: the group chat (removed)
const RETIRED_CHOICES = ["carousel", "saga", "timeline", "nexttrip"];

// ---------------------------------------------------------
// Extra story lines that depend on your WHOLE path, not just
// your last answer. Each function returns a list of sentences
// to show after the last answer's outcome.
// ---------------------------------------------------------
const STORY_EXTRAS = {
  page6: () => [
    picked("snacks") && t("extra.snacks", "You miss your gummy worms. Worth it? Unclear."),
  ],

  page8: () => [
    picked("birdcall") && t("extra.birdcall", "Somewhere in the dark, something does your bird call. Perfectly. A little too perfectly."),
    ateMushrooms() && t("extra.treesListening", "The trees are breathing slower now, like they're listening too."),
  ],

  page11: () => {
    const lines = [];

    const openedDoor = visited("page-fairy");

    // Where was the ranger station?
    if (openedDoor) {
      lines.push(t("extra.station.door", "\"You were forty feet from our station all night,\" the ranger says. You don't mention the fairy."));
    } else if (picked("lightright")) {
      lines.push(t("extra.station.light", "The ranger points at a porch light through the trees: the ranger station, forty feet away. \"You were headed right for it.\""));
    } else if (visited("page9")) {
      lines.push(t("extra.station.wandered", "Right behind your fallen tree, through the branches, is the ranger station's porch light. Forty feet away. If only you'd gone right."));
    } else {
      lines.push(t("extra.station.stayed", "Past your fallen tree, a porch light glows: the ranger station, forty feet away. \"Staying put was the right call,\" the ranger says."));
    }

    // How did they find you?
    if (picked("sing")) lines.push(t("extra.sing", "\"We heard you singing from the parking lot. All of it.\""));
    if (picked("sos")) lines.push(t("extra.sos", "\"Nice SOS. Who drew the smiley face?\""));

    // What were the shadows?
    if (ateMushrooms()) {
      lines.push(t("extra.shapes.mushrooms", "She eyes the purple stains on your fingers. \"Did you eat the mushrooms? Okay. Medic's coming.\" The shapes in the trees? \"Buddy, those are trees.\""));
    } else if (visited("page8")) {
      lines.push(t("extra.shapes.voice", "\"Your friends found the station hours ago.\" You ask who was calling your name out there. She stops smiling. \"Nobody from our team.\""));
    } else {
      lines.push(t("extra.shapes.deer", "The tall shapes in the trees? \"Probably deer,\" the ranger says. She doesn't sound sure."));
    }

    // Little callbacks
    if (picked("fire")) lines.push(t("extra.fire", "\"Also, please never start a fire out here again.\""));
    if (picked("ration")) lines.push(t("extra.ration", "You offer the ranger your last third of granola bar. She declines."));
    if (picked("hoard")) lines.push(t("extra.hoard", "Your secret trail mix crinkles in your pocket. You say nothing."));

    // The empty campsite was the rangers' supply camp
    if (picked("raid")) lines.push(t("extra.raid", "\"Also, someone cleaned out our supply camp up the trail. Cookies, a headlamp...\" You chew very, very quietly."));
    if (picked("iou")) lines.push(t("extra.iou", "\"And whoever left a sorry note at our supply camp over one granola bar: very polite. We appreciated it.\""));
    if (picked("tentnap")) lines.push(t("extra.tentnap", "\"Weird thing. Somebody dug through our wrecked supply tent just to take the pillow.\" The pillow is under your arm right now."));

    // The tiny door: a little surprise, or a little regret
    if (openedDoor) {
      if (ateMushrooms()) lines.push(t("extra.fairyTold", "You tell the ranger about the fairy. She looks at your purple fingers. \"Sure, bud.\""));
      if (picked("pick")) {
        lines.push(t("extra.note.kicked", "In your pocket, where the key was, there's a note smaller than a stamp: \"Thanks for the key. You owe me a door. — F.\""));
      } else {
        lines.push(t("extra.note.thanks", "In your pocket, where the key was, there's a note smaller than a stamp: \"Thanks for the key. I haven't seen a human dance in a while. — F.\""));
      }
    } else {
      lines.push(t("extra.door.wave", "As you leave, the tiny door opens a crack. A fairy with a lantern gives you a small, disappointed wave. He could have walked you out hours ago."));
      lines.push(t("extra.door.keyGone", "You reach for the key in your pocket. It's gone."));
    }

    return lines;
  },
};

// ---------------------------------------------------------
// The 12 results
//
//   image:     a real photo (no AI) from Wikimedia Commons, saved in /images
//   strengths: [title, detail] x6. Sincere, with one playful line.
//   watchouts: [title, detail] x6. Deliberately blunt. No sugarcoating.
//   core:      who you are at heart (3 trait words + a sentence)
//   drive:     what motivates you
//   wiring:    how you tend to think and react
//   stress:    what you turn into when things go badly
//   need:      what would actually help you grow
// ---------------------------------------------------------
const RESULTS = {
  scout: {
    name: "The Eagle Scout",
    tagline: "Has a laminated map. Has a backup laminated map.",
    image: {
      src: "images/scout.jpg",
      alt: "Two fluffy white bald eagle chicks sitting in their nest",
      credit: "Dave Menke, U.S. Fish & Wildlife Service (public domain)",
    },
    description:
      "You're the one who plans the trip, writes the packing list, and knows exactly where the first-aid kit is. In a crisis you don't panic, you organize. Under all that competence is a quieter belief: if you stop holding everything together, it will all fall apart, and it will be your fault. That belief makes you the most dependable person in most rooms. It also makes it very hard for you to rest.",
    strengths: [
      ["Organized and thorough", "You think things through ahead of time, so nothing important gets forgotten."],
      ["Calm in a crisis", "While everyone else screams, you're handing out jobs. \"You, get water. You, stop crying.\""],
      ["Dependable when it counts", "When you say you'll do something, people know it will get done."],
      ["Always prepared", "You plan for the problems other people don't see coming."],
      ["Follows through", "You finish what you start, long after everyone else has lost interest."],
      ["Makes chaos manageable", "You can turn a messy, overwhelming situation into steps people can actually follow."],
    ],
    watchouts: [
      ["Control freak in a fleece", "You call it \"being organized.\" Everyone else calls it being bossed around, and they've stopped telling you."],
      ["Your plan is not a personality", "When the plan falls apart, so do you. You'd rather be miserable on schedule than happy off-script."],
      ["Martyr mode", "You take on everyone's job, refuse help, then quietly resent them for not helping. You built that trap yourself."],
      ["The silent scorekeeper", "You remember every time someone dropped the ball. You never say it out loud, but it leaks out in your tone, and people feel it."],
      ["Rest feels like failure", "A free afternoon with nothing planned makes you anxious. That isn't discipline. That's a problem."],
      ["Plan police", "\"We said we'd leave at 7:00. It is 7:04.\" Your friends hear this in their nightmares."],
    ],
    core: [["Practical", "Structured", "Decisive"], "You like clear plans, clear roles and getting things done the proven way."],
    drive: "Being capable and doing well. Every merit badge counts, and you secretly keep track of all of them.",
    wiring: "Highly organized and dependable. You're the kind of person who finishes what they start, and expects everyone else to as well.",
    stress: "You tighten your grip: more lists, more rules, more doing it all yourself. You get short with anyone who is \"slowing things down.\"",
    need: "To be valued for who you are, not for what you get done. And to let someone else hold the map for once.",
  },
  survivalist: {
    name: "The Survivalist",
    tagline: "Hopes for the best. Packs for the worst.",
    image: {
      src: "images/survivalist.jpg",
      alt: "A chipmunk on a tree stump with its cheeks stuffed full of food",
      credit: "Ashley Lee, CC BY 4.0",
    },
    description:
      "You've already imagined everything that could go wrong, which is exactly why you're still standing. Somewhere along the way you learned that the world won't look after you, so you look after yourself, with water, a charger and a plan B. It keeps you safe. It also keeps you braced for a disaster that, most days, never shows up.",
    strengths: [
      ["Prepared for anything", "You think ahead and make sure you have what you need before you need it."],
      ["Practical and resourceful", "You can fix anything with duct tape, a paperclip and pure spite."],
      ["Not easily fooled", "You ask questions and check the facts before you believe something."],
      ["Steady when it all goes wrong", "When things fall apart, you're the one who already has a plan B."],
      ["Fiercely loyal", "It takes a while to get in, but once someone's in your circle, you'd walk through fire for them."],
      ["Spots trouble early", "You catch problems while they're still small and cheap to fix."],
    ],
    watchouts: [
      ["Anxiety wearing a backpack", "You call it \"being realistic.\" It's worry. You've been worried so long you think it's your personality."],
      ["The fun-killer", "Someone says \"let's go to the beach\" and you list the rip currents. People have quietly stopped inviting you."],
      ["Everyone is on trial", "You treat people like they have to pass a test before you'll trust them. Most of them gave up trying."],
      ["Hoarder energy", "The snacks, the cables, the grudges. You keep all of it \"just in case.\""],
      ["Pessimism dressed up as wisdom", "Being right about the bad stuff once doesn't make you right about everything. You just never count the times nothing went wrong."],
      ["Missing your own life", "You're so busy preparing for the worst day that you keep skipping the good ones."],
    ],
    core: [["Responsible", "Careful", "Loyal"], "You stay loyal to what has worked before and trust facts and experience over hype."],
    drive: "Feeling secure. You scan for risks, prepare for them, and are fiercely loyal once someone earns your trust.",
    wiring: "Very conscientious, with a healthy dose of worry. Sometimes the useful kind that packs the flashlight. Sometimes the kind that keeps you up at 2 a.m.",
    stress: "You go into lockdown: more checking, more doubting, less trusting. Everyone starts to look like a threat, even the people who love you.",
    need: "Proof that you can relax and still be safe. People who show up consistently, so your guard can finally come down.",
  },
  nightwatch: {
    name: "The Night Watch",
    tagline: "Noticed the paw prints. Noticed the shadows. Noticed you noticing.",
    image: {
      src: "images/nightwatch.jpg",
      alt: "A barred owl perched on a branch, staring straight at the camera",
      credit: "Dick Daniels, CC BY-SA 3.0",
    },
    description:
      "You see what other people miss: the change in someone's tone, the snapped branch, the detail that doesn't add up. You'd rather watch from the edge than charge in, and you take in a lot before you say a word. That makes you wiser than you get credit for. It also means you spend a lot of time living inside your own head, where every scenario plays out twice.",
    strengths: [
      ["Highly observant", "You pick up on small details that everyone else walks right past."],
      ["Reads people well", "\"You said 'I'm fine' with a period at the end. You are not fine.\""],
      ["Thinks before acting", "You take in the whole situation before you make a move."],
      ["A great listener", "People feel heard around you, so they tend to open up."],
      ["Hard to fool", "Fake smiles, sketchy deals, voices in the woods. You can tell when something's off."],
      ["Deep thinker", "You don't settle for the surface answer. You want to understand why."],
    ],
    watchouts: [
      ["Overthinking is your full-time job", "You've rehearsed conversations that will never happen and replayed ones from years ago. That's not insight. It's a loop."],
      ["All thought, no action", "You figured out the answer an hour ago and said nothing. Being right in silence helps nobody."],
      ["A little paranoid", "Not every pause in a text means something. Most people aren't thinking about you nearly as much as you think."],
      ["Exhausted all the time", "You never switch off, and you're tired constantly. You call it \"just how I am.\" It doesn't have to be."],
      ["Watching instead of living", "You stand at the edge of every party analyzing it. Life is happening, and you're taking notes on it."],
      ["Seeing danger everywhere", "The scary shadow in your room was a coat rack. It is always a coat rack."],
    ],
    core: [["Insightful", "Perceptive", "Thoughtful"], "You have a strong sense for what's going on beneath the surface."],
    drive: "Understanding. You observe before engaging, save your energy, and want to make sense of something before acting on it.",
    wiring: "Curious and imaginative, and more sensitive to stress than most, which is partly why you notice so much.",
    stress: "You withdraw and over-analyze. You go quiet, pull away from people, and build worst-case theories in the dark.",
    need: "Permission to act before you're 100% sure. And a few people safe enough that you can stop scanning the room around them.",
  },
  trailblazer: {
    name: "The Trailblazer",
    tagline: "No path? Great. Now there is.",
    image: {
      src: "images/trailblazer.jpg",
      alt: "A fluffy white mountain goat kid standing on a rocky slope",
      credit: "Charles J. Sharp, CC BY-SA 4.0",
    },
    description:
      "You don't wait for permission, and you don't wait for a plan. When everyone else freezes, you're already moving, and people follow because you look like you know where you're going. Underneath is a rule you made for yourself a long time ago: never look weak, never be the one who needs saving. Your confidence is your biggest strength, and occasionally your biggest problem.",
    strengths: [
      ["Takes charge", "When nobody knows what to do, you step up and give the group a direction."],
      ["Brave and decisive", "You order at a restaurant in four seconds. Your friends take twenty minutes and still pick wrong."],
      ["Protective of your crew", "You stand up for your friends without being asked."],
      ["Gets things moving", "You turn talk into action while everyone else is still debating."],
      ["Resilient", "You bounce back from setbacks faster than almost anyone you know."],
      ["Honest and direct", "People always know exactly where they stand with you."],
    ],
    watchouts: [
      ["Steamroller", "You don't lead people, you drag them. Half your group follows you because arguing with you is too much work."],
      ["Can't admit you're wrong", "You weren't lost. You were \"taking the scenic route.\" For three hours. Everyone knew."],
      ["Reckless", "You skip the risks because thinking about them feels slow. Other people pay for that more often than you do."],
      ["Bad listener", "You're planning your answer while people are still talking. They've noticed."],
      ["Everything is a competition", "Even game night. Even the hike. People don't want to compete with you. They want to hang out with you."],
      ["Allergic to feelings", "You'd rather be angry than sad, because angry feels strong. Your friends have no idea what's actually going on with you."],
    ],
    core: [["Bold", "Strategic", "Driven"], "You see the goal and go straight at it."],
    drive: "Staying in control. You're strong-willed and protective, and you'd rather take charge than be told what to do.",
    wiring: "Steady under pressure and hard to rattle. More focused on getting it done than on keeping everyone happy.",
    stress: "You get louder, faster and more controlling. You push harder exactly when you should stop, and people get run over.",
    need: "To learn that letting someone else lead isn't losing. And at least one person strong enough to tell you no.",
  },
  lonewolf: {
    name: "The Lone Wolf",
    tagline: "Didn't get lost. Went solo.",
    image: {
      src: "images/lonewolf.jpg",
      alt: "A Mexican wolf pup with its head tipped back, howling",
      credit: "U.S. Fish & Wildlife Service (public domain)",
    },
    description:
      "You trust yourself more than anyone else, and honestly, your track record backs that up. You'd rather handle things alone than wait for a group to agree. Somewhere along the way, needing people started to feel risky, so you decided not to. It works, right up until the night you really could use someone and nobody knows to come looking.",
    strengths: [
      ["Self-reliant", "You trust yourself to figure things out without waiting for help."],
      ["Cool under pressure", "Total chaos all around you, and you're just quietly finishing your snack."],
      ["Doesn't need approval", "You make your own choices without worrying what everyone else thinks."],
      ["Comfortable on your own", "You enjoy your own company and know when you need space."],
      ["Clear-headed", "You don't get swept up in group panic or group hype."],
      ["Hands-on problem solver", "You fix things in the moment with whatever's in front of you."],
    ],
    watchouts: [
      ["You'd leave your friends with the bear", "Maybe not literally. But when it gets hard, you save yourself first, and people remember."],
      ["Emotionally unavailable", "Your \"close\" friends don't really know you. You've made sure of that."],
      ["Too proud to ask for help", "You'll carry 17 grocery bags in one trip before asking anyone. That's not strength. It's stubbornness."],
      ["Ghosting isn't a boundary", "Disappearing for a week without a word feels like rejection to the people who care about you. Because it is."],
      ["Selfish when it counts", "Your snacks, your time, your plans. \"Looking out for myself\" often means nobody else gets let in."],
      ["Lonely, and calling it freedom", "You say you like being alone. Some of that is true. Some of it is just safer than getting hurt."],
    ],
    core: [["Independent", "Hands-on", "Free-spirited"], "You solve problems in the moment and value your freedom above almost everything."],
    drive: "Self-sufficiency. You guard your time, your energy and your resources.",
    wiring: "Straightforward and self-directed. You make decisions on your own terms, not to please the crowd.",
    stress: "You cut people off and go fully solo. You stop answering texts and tell yourself nobody would notice anyway.",
    need: "One or two people you let all the way in. And to find out that being needed doesn't have to mean being trapped.",
  },
  bard: {
    name: "The Campfire Bard",
    tagline: "Got lost in the woods. Got a great story out of it.",
    image: {
      src: "images/bard.jpg",
      alt: "A green grasshopper peeking out from a clover leaf, like it is about to start a song",
      credit: "Colette Gemmell, CC BY 4.0",
    },
    description:
      "You turn every disaster into a story, and everyone wants to sit next to you at the campfire. You think in pictures and possibilities, and you'd rather take the interesting path than the correct one. Deep down, you want to be seen, really seen, for who you are. When people get you, you light up. When they don't, it hurts a lot more than you let on.",
    strengths: [
      ["Creative and imaginative", "You see stories and ideas where other people see ordinary life."],
      ["Lifts the mood", "Lost, cold and hungry? You've already made up a song about it, and it slaps."],
      ["Sees possibilities", "You can find something interesting, or even fun, in a bad situation."],
      ["A natural storyteller", "You make people laugh and pull them into whatever you're talking about."],
      ["Emotionally honest", "You say the feeling out loud, so other people feel allowed to as well."],
      ["Makes people feel less alone", "Your stories make people realize their weird experiences are normal."],
    ],
    watchouts: [
      ["All starts, no finishes", "You have twelve brilliant ideas and zero finished ones. Starting is the fun part. Finishing is the part you skip."],
      ["Procrastination royalty", "You call it \"waiting for inspiration.\" Everyone else calls it missing the deadline. Again."],
      ["Main character syndrome", "Every story somehow comes back to you. People love the show, but some of them would like a turn."],
      ["Drama magnet", "A small problem becomes a three-act tragedy. You don't just feel things, you perform them."],
      ["Thin skin", "One lukewarm reaction to your idea and you're crushed for a week. Not everyone who disagrees with you is attacking you."],
      ["Allergic to responsibility", "Bills, chores, emails. You let the boring stuff pile up until someone else has to deal with it."],
    ],
    core: [["Imaginative", "Enthusiastic", "Full of ideas"], "You connect with people through stories and possibilities."],
    drive: "Being authentically yourself. You're creative and expressive, and you want your life to mean something.",
    wiring: "Very open to new ideas, art and experiences. Your imagination is always switched on, and so are your feelings.",
    stress: "You spiral. You feel deeply misunderstood and either disappear into your head or turn the volume all the way up.",
    need: "People who take your ideas seriously, and just enough structure that your best ideas actually get finished.",
  },
  mystic: {
    name: "The Mushroom Mystic",
    tagline: "Watched one reel. Now an expert.",
    image: {
      src: "images/mystic.jpg",
      alt: "A tiny snail crawling along a branch covered in little orange mushrooms",
      credit: "Chainfoto, CC0",
    },
    description:
      "You're curious, fearless about new experiences, and a little too confident in what you learned on the internet. You'd rather try something and see what happens than sit around wondering. Part of that is pure love of life. Part of it is that sitting still with a boring or uncomfortable feeling is the one thing you really can't stand.",
    strengths: [
      ["Adventurous and curious", "You want to know how things work, and the best way to find out is to try."],
      ["Adapts fast", "When plans change, you roll with it instead of getting stuck."],
      ["Fearless about new things", "You'll try the weird gas-station snack that nobody else will touch."],
      ["Brings the energy", "An ordinary day turns into an adventure when you're around."],
      ["Optimistic", "You genuinely believe things will work out, and it's contagious."],
      ["Learns by doing", "You pick up new skills faster by trying them than most people do by studying."],
    ],
    watchouts: [
      ["Confidently wrong", "One reel and you're an expert. You ate the mushrooms. You will eat the mushrooms again."],
      ["Acts first, Googles later", "You searched \"are these berries poisonous\" after you ate them."],
      ["Running from boredom", "You chase the next thrill because sitting with a hard feeling scares you more than any bear."],
      ["Unreliable", "You said yes to three plans and showed up to the most exciting one. Your friends make backup plans for you now."],
      ["Consequences are for later", "\"Future me will deal with it.\" Future you is tired of cleaning up after you."],
      ["Shallow commitment", "Hobbies, plans, sometimes people. You're all in for two weeks, then gone when the shine wears off."],
    ],
    core: [["Energetic", "Action-oriented", "Spontaneous"], "You learn by doing and live in the moment."],
    drive: "New experiences. You hate missing out, and sometimes skip right past the risks to get to the fun part.",
    wiring: "Wide open to anything new, and not very interested in rules, schedules or reading the instructions.",
    stress: "You get scattered and impulsive, chasing distractions and saying yes to things you'll regret, just to avoid feeling stuck.",
    need: "Something worth staying for. And one friend who's allowed to say, \"Maybe don't eat that.\"",
  },
  medic: {
    name: "The Field Medic",
    tagline: "Ran toward the bear. For a friend.",
    image: {
      src: "images/medic.jpg",
      alt: "A Saint Bernard puppy sitting in a pile of autumn leaves",
      credit: "dbking, CC BY 2.0",
    },
    description:
      "Your first thought in a crisis is \"Is everyone okay?\" You'd give away your last snack, or walk back toward danger, if it meant nobody got left behind. People feel safe around you. But a lot of your sense of worth is tied up in being needed, and you rarely let anyone take care of you in return.",
    strengths: [
      ["Fiercely loyal", "When someone you care about needs you, you show up. No questions asked."],
      ["Selfless and generous", "You share what you have without being asked and without keeping score."],
      ["Makes people feel safe", "People can tell you anything, and they do. Constantly."],
      ["Brave for others", "You'll face things that scare you if it means protecting someone else."],
      ["Emotionally intelligent", "You notice when someone's hurting, often before they've admitted it to themselves."],
      ["The glue", "Groups hold together better with you in them."],
    ],
    watchouts: [
      ["People-pleaser to the bone", "You say yes when you mean no, then wonder why you're exhausted and secretly resentful."],
      ["Doormat", "People take advantage of how nice you are. Some of them know exactly what they're doing, and you keep letting them."],
      ["Helping as a hiding spot", "Fixing everyone else's problems is a great way to never look at your own."],
      ["Way too trusting", "You'd follow a creepy voice into the woods because it sounded like a friend. You give fourth chances to people who didn't deserve a second."],
      ["Needs to be needed", "When nobody needs you, you feel lost. That's not generosity. That's a hook."],
      ["Forgetting yourself", "You remembered everyone's water bottle except your own."],
    ],
    core: [["Warm", "Protective", "Devoted"], "You'd do almost anything for the people you care about."],
    drive: "Being there for others. You're generous and caring, and helping people is where you find meaning.",
    wiring: "Kind, trusting and cooperative, and reliable enough that people know you'll actually show up.",
    stress: "You overgive, then crash. You feel unappreciated and might snap at the very people you've been taking care of.",
    need: "To be cared for without having to earn it. And to say \"no\" without a three-paragraph explanation.",
  },
  tattletale: {
    name: "The Tattletale",
    tagline: "Survived the woods. Filed a full report.",
    image: {
      src: "images/tattletale.jpg",
      alt: "A meerkat standing up tall on sentry duty, keeping an eye on everything",
      credit: "Mathias Appel (public domain, CC0)",
    },
    description:
      "You believe rules exist for a reason, and when someone breaks one, somebody should know. In your mind it isn't snitching, it's accountability. Underneath is a harsh inner critic that holds you to the same impossible standard. You're not trying to get people in trouble. You're trying to make the world make sense.",
    strengths: [
      ["Strong sense of right and wrong", "You know where the line is, and you don't cross it."],
      ["Remembers every detail", "\"Actually, on March 3rd at 4:15, you said...\" You have receipts. Sometimes literally."],
      ["Holds people accountable", "Things run more smoothly when someone makes sure everyone does their part."],
      ["Honest", "People can count on you to tell them the truth, even when it's hard to hear."],
      ["Fair", "You want the same rules for everyone, including yourself."],
      ["Makes things better", "You notice what's broken and push until it gets fixed."],
    ],
    watchouts: [
      ["It's snitching", "You call it accountability. Everyone else calls it snitching, and they've started keeping things from you."],
      ["Blame first, fix later", "When something goes wrong, you're hunting for who's at fault while everyone else is putting out the fire."],
      ["Self-righteous", "Being right matters more to you than being kind. You win the argument and lose the friend."],
      ["Exhausting to be around", "People edit themselves around you so they don't get called out. That isn't respect. It's fear."],
      ["Rigid", "\"That's not how we do it\" doesn't settle anything. Rules are tools, not commandments."],
      ["Harshest on yourself", "The critic you aim at other people is twice as loud in your own head, and it never lets you off."],
    ],
    core: [["Conscientious", "Principled", "Fair"], "You're very aware of the rules and want everyone to do the right thing."],
    drive: "Doing things the right way. You have a strong inner critic and a sharp eye for what's wrong.",
    wiring: "Highly organized and responsible, and it really bothers you when things are unfair or out of place.",
    stress: "You get critical and controlling, nitpicking everything and everyone, yourself most of all.",
    need: "To accept that \"good enough\" is sometimes good enough. And people who stay even when you're wrong.",
  },
  camper: {
    name: "The Happy Camper",
    tagline: "Lost in the woods? More like a free night of camping.",
    image: {
      src: "images/camper.jpg",
      alt: "A capybara lounging in the grass, completely relaxed",
      credit: "Wilfredor (public domain, CC0)",
    },
    description:
      "Not much rattles you. Bears, shadows, a dead phone: you figure it'll all work itself out, and annoyingly, it usually does. You go with the flow and keep the peace. But some of that calm is avoidance. If you never want anything too badly, nobody can let you down.",
    strengths: [
      ["Calm in chaos", "The tent's on fire, and you're like, \"Well, at least it's warm.\""],
      ["Easy to be around", "People relax around you because you don't bring drama or stress."],
      ["Adapts to anything", "You make the best of whatever situation you end up in."],
      ["The peacemaker", "When friends start arguing, you're the one who brings everyone back together."],
      ["Accepting", "You take people as they are, without judging them."],
      ["Actually present", "You live in the moment and enjoy it, which most people can't do."],
    ],
    watchouts: [
      ["Lazy, and calling it chill", "Being relaxed is great. Letting everyone else carry the work while you nap isn't."],
      ["Can't make a decision to save your life", "\"Where do you want to eat?\" \"I don't mind.\" You do mind. You just don't want to be responsible for the answer."],
      ["Conflict coward", "You'd rather swallow a problem for a year than have one uncomfortable conversation."],
      ["No opinions, no backbone", "You agree with whoever's in the room. People don't know what you actually think, because you never say it."],
      ["Ignoring problems until they explode", "Unpaid bill? Weird noise in the car? Friend who seems off? \"Later.\" Later is now a disaster."],
      ["Drifting through your own life", "You go along with everything, so you end up living a life other people chose for you."],
    ],
    core: [["Gentle", "Easygoing", "Present"], "You live in the moment and avoid unnecessary conflict."],
    drive: "Peace and harmony. You're accepting of others and would rather keep things calm than rock the boat.",
    wiring: "Emotionally steady and hard to rattle, plus warm and easy to get along with.",
    stress: "You check out: sleep, scroll, numb out, and pretend the problem isn't there until it's too big to ignore.",
    need: "To know that what you want matters. And a gentle push to act before \"later\" turns into \"too late.\"",
  },
  glamper: {
    name: "The Glamper",
    tagline: "Brought a ring light. There's no outlet.",
    image: {
      src: "images/glamper.jpg",
      alt: "A fluffy pure-white kitten (not a grown cat) with one gold eye and one blue eye, gazing straight at the camera",
      credit: "Firman MPH via Pixabay (CC0)",
    },
    description:
      "You came to the woods with a skincare routine, a throw blanket and strong opinions about the tent. You love beautiful things, good food and being comfortable, and you're not going to apologize for it. Under all the complaining is something softer: you make places feel nice because feeling cared for matters to you more than you admit. Things only get rough when life stops being comfortable, because that's the part you've had the least practice with.",
    strengths: [
      ["Great taste", "You know what looks good, tastes good and feels good, and everyone's life is a little nicer for it."],
      ["Makes anywhere cozy", "Give you ten minutes and the tent is a boutique hotel. Fairy lights included."],
      ["Knows what you want", "You don't pretend to be fine with things you're not. People always know where you stand."],
      ["Brings the good stuff", "Real coffee, decent snacks, the nice blanket. Everyone mocks your packing until they need something from it."],
      ["Self-care pro", "You rest, you hydrate, you set boundaries. Most people could learn a thing or two from you."],
      ["Fun once you're comfy", "Get you warm and fed, and you're the best company at the campsite."],
    ],
    watchouts: [
      ["Complaining is your cardio", "The bugs, the dirt, the cold, the bugs again. Everyone else is cold too. They're just not narrating it."],
      ["High maintenance", "You call it having standards. Your friends call it the 40-minute delay while you found a flattering angle."],
      ["Pics or it didn't happen", "You spent the whole sunset filming the sunset. You were there. You just didn't see it."],
      ["Bails when it gets hard", "The second things get ugly or uncomfortable, you want out. Most growth is uncomfortable, so you keep skipping it."],
      ["Your comfort, their problem", "Someone always ends up carrying your extra bag or giving up the good sleeping spot. You rarely notice who."],
      ["Your feed is happier than you are", "You'd rather look like you're having a great time than admit you're not. People can tell."],
    ],
    core: [["Refined", "Expressive", "Comfort-loving"], "You care how things look and feel, and you make the world a little prettier."],
    drive: "Comfort and beauty. You want life to feel good and look good, and you secretly like being a little envied.",
    wiring: "Very tuned in to your senses: textures, smells, sounds, vibes. Easily delighted, and just as easily annoyed.",
    stress: "You get whiny and sulky, retreat to whatever comfort you can find, and make sure everyone knows how much you're suffering.",
    need: "Proof that you can handle hard, unglamorous things and come out fine. And friends who like you with bed hair and no filter.",
  },
  schemer: {
    name: "The Schemer",
    tagline: "Didn't bring snacks. Has everyone's snacks.",
    image: {
      src: "images/schemer.jpg",
      alt: "A fluffy baby red fox standing in the woods, glancing back at the camera",
      credit: "Tognopop's grandfather (public domain)",
    },
    description:
      "You always have an angle. You read the room, work out what everyone wants, and somehow walk away with exactly what you came for, and people thank you for it. It isn't that you don't care about them. Somewhere along the way you learned that asking straight out gets you a no, so you stopped asking and started arranging. It works beautifully. The cost is that nobody, sometimes not even you, is sure when you're being real.",
    strengths: [
      ["Strategic", "You're three moves ahead while everyone else is still working out the first one."],
      ["Charming", "You could talk a bear out of its lunch, then get it to carry the bag for you."],
      ["Resourceful", "Whatever you need, you know who has it and exactly how to get it."],
      ["Reads people fast", "Five minutes after meeting someone, you know what they want and what they're afraid of."],
      ["Born negotiator", "Deals, trades, compromises. You find the version where everyone thinks they won."],
      ["Gets things done through people", "You can't fix the car. But you know who can, and they'll do it for free."],
    ],
    watchouts: [
      ["It's manipulation", "You call it networking, or persuasion, or \"just helping things along.\" It's manipulation, and more people have noticed than you think."],
      ["Everything's a transaction", "You keep a quiet tally of favors. Your friends have started to wonder if they're friends or assets."],
      ["Hard to trust", "You've told so many convenient versions of the truth that people don't know which one is real."],
      ["Never your fault", "When the plan blows up, it was somehow someone else's idea. It was not someone else's idea."],
      ["Allergic to asking directly", "You'll spend an hour setting up the perfect situation instead of saying one honest sentence: \"Can I have that?\""],
      ["Nobody really knows you", "If you're always playing an angle, people only ever meet the angle. That gets lonely."],
    ],
    core: [["Clever", "Persuasive", "Resourceful"], "You see how things really work, and you use it to get what you want."],
    drive: "Getting what you want without having to ask for it. Being outsmarted is your worst nightmare.",
    wiring: "Sharp, social and strategic. You're always reading the room and quietly working out your next move.",
    stress: "You scheme harder: more secrets, more spin, more playing people against each other, until the whole plan collapses on you.",
    need: "To find out that just asking often works. And people you can be completely honest with, who stay anyway.",
  },
};

// ---------------------------------------------------------
// Quiz state: the list of choices the player has made
// ---------------------------------------------------------
let history = [];
let playerName = ""; // typed on the name page, used when the voice calls you

// ---------------------------------------------------------
// HOW you answer counts too, not just what you pick:
//   - Taking more than 2 minutes on a question = dragging your feet.
//     Each slow question adds +0.25 to the Happy Camper (the laziest type),
//     up to 3 questions (+0.75 at most).
//   - Pressing "back" more than 3 times in total (same question or
//     different ones) = picky perfectionist. That adds +0.5 to the Glamper
//     (high standards, wants everything just right), once.
// These are small nudges on top of your answers.
// ---------------------------------------------------------
const SLOW_MS = 2 * 60 * 1000;
const MAX_SLOW_COUNTED = 3;
const SLOW_POINTS = { camper: 0.25 };
const BACK_LIMIT = 3; // more than this many presses = perfectionist
const BACK_POINTS = { glamper: 0.5 };

let habits = { slow: new Set(), back: 0 }; // slow: page ids, back: number of presses
let pageShownAt = 0;
let hiddenAt = null;

// Don't count time while the tab is in the background
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    hiddenAt = Date.now();
  } else if (hiddenAt !== null) {
    pageShownAt += Date.now() - hiddenAt;
    hiddenAt = null;
  }
});

function slowCount() {
  return Math.min(habits.slow.size, MAX_SLOW_COUNTED);
}

function isSecondGuesser() {
  return habits.back > BACK_LIMIT;
}

// Small helpers for the story
function picked(choiceKey) {
  return history.includes(choiceKey);
}

function visited(pageId) {
  return history.some((key) => pageOfChoice(key) === pageId);
}

function ateMushrooms() {
  return visited("page6-5");
}

// Which page a choice's button lives on, e.g. "callout" -> "page7"
function pageOfChoice(choiceKey) {
  const button = document.querySelector(`[data-choice="${choiceKey}"]`);
  return button ? button.closest(".page").id : null;
}

// ---------------------------------------------------------
// Fill in the story text at the top of a page:
// what happened after your last answer, plus any path-based extras
// ---------------------------------------------------------
function fillStory(pageId) {
  const storyBox = document.querySelector(`#${CSS.escape(pageId)} .story`);
  if (!storyBox) return;

  // The latest answer that has a story line. (The wake-up question has none,
  // so page 2 still opens with what happened after the start button.)
  let lastKey;
  for (let i = history.length - 1; i >= 0 && !lastKey; i--) {
    if (ANSWERS[history[i]].outcome) lastKey = history[i];
  }
  const lastAnswer = ANSWERS[lastKey];
  const lines = [];
  if (lastAnswer && lastAnswer.outcome) lines.push(lastAnswer.outcome);
  if (STORY_EXTRAS[pageId]) lines.push(...STORY_EXTRAS[pageId]().filter(Boolean));

  storyBox.innerHTML = "";
  lines.forEach((line) => {
    const p = document.createElement("p");
    // Words wrapped in {{double braces}} get the red flicker effect.
    // Words wrapped in [[double brackets]] sit on a little smoking campfire.
    // Words wrapped in ((double parens)) get a glowing star behind them.
    line.split(/(\{\{.+?\}\}|\[\[.+?\]\]|\(\(.+?\)\))/).forEach((part) => {
      if (part.startsWith("{{")) {
        const span = document.createElement("span");
        span.className = "flicker-word";
        span.textContent = part.slice(2, -2);
        p.appendChild(span);
      } else if (part.startsWith("[[")) {
        p.appendChild(makeCampfireWord(part.slice(2, -2)));
      } else if (part.startsWith("((")) {
        p.appendChild(makeStarWord(part.slice(2, -2)));
      } else if (part) {
        p.append(part);
      }
    });
    storyBox.appendChild(p);
  });
  storyBox.hidden = lines.length === 0;

  // Little doodles on either side of the answer's outcome line
  const sideDoodles = ANSWER_SIDE_DOODLES[lastKey];
  if (sideDoodles && lastAnswer && lastAnswer.outcome && storyBox.firstChild) {
    addSideDoodles(storyBox.firstChild, sideDoodles);
  }

  // Doodle cover over the question (click to read)
  const heading = document.querySelector(`#${CSS.escape(pageId)} .question`);
  removeQuestionCover(heading);
  const stickers = ANSWER_COVERS[lastKey] || STORY_COVERS[pageId];
  if (stickers && heading) addQuestionCover(heading, stickers);

  // Page 11 (the ranger): sparkles twinkle around the story, gone in 8 seconds
  if (pageId === "page11" && lines.length) addSparkles(storyBox);
}

// Sparkles that twinkle around an element (story lines, result photo,
// result name), then fade away. They sit in a layer over the element
// and remove themselves after 8s.
function addSparkles(storyBox, COUNT = 18) {
  // Showing the same thing again (e.g. switching language) restarts them
  storyBox.querySelectorAll(":scope > .story-sparkles").forEach((old) => old.remove());
  storyBox.classList.add("story-sparkled");
  const layer = document.createElement("div");
  layer.className = "story-sparkles";
  layer.setAttribute("aria-hidden", "true");

  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement("span");
    s.className = "story-sparkle";
    // Spread them around the edges: top, right, bottom, left.
    // Each one sits fully OUTSIDE the box, so it never covers a letter.
    // Top/bottom ones are smaller: there's less room between lines.
    const side = i % 4;
    const size = side % 2 ? 8 + Math.random() * 8 : 6 + Math.random() * 5;
    const out = -(size + 1 + Math.random() * 3);
    // Keep them within the box's length (no hanging off the corners)
    const along = `calc(${(Math.random() * 100).toFixed(1)}% - ${(size / 2).toFixed(1)}px)`;
    if (side === 0) { s.style.left = along; s.style.top = `${out}px`; }
    if (side === 1) { s.style.top = along; s.style.right = `${out}px`; }
    if (side === 2) { s.style.left = along; s.style.bottom = `${out}px`; }
    if (side === 3) { s.style.top = along; s.style.left = `${out}px`; }
    s.style.width = s.style.height = `${size}px`;
    s.style.animationDelay = `${(Math.random() * 1.6).toFixed(2)}s`;
    layer.appendChild(s);
  }
  storyBox.appendChild(layer);

  setTimeout(() => {
    layer.remove();
    // Going back and forth can start a new batch; only tidy up if none is left
    if (!storyBox.querySelector(".story-sparkles")) storyBox.classList.remove("story-sparkled");
  }, 8000);
}

// A word with a tiny campfire under it, smoke drifting up through the letters
function makeCampfireWord(text) {
  const span = document.createElement("span");
  span.className = "campfire-word";
  span.textContent = text;

  // Smoke puffs, each on its own delay so they rise one after another
  for (let i = 0; i < 5; i++) {
    const puff = document.createElement("span");
    puff.className = "smoke-puff";
    puff.style.setProperty("--i", i);
    puff.setAttribute("aria-hidden", "true");
    span.appendChild(puff);
  }

  const fire = document.createElement("span");
  fire.className = "campfire";
  fire.setAttribute("aria-hidden", "true");
  fire.innerHTML = `
    <svg viewBox="0 0 40 30">
      <path class="flame flame-outer" d="M20 3c4 6 9 9 9 15a9 9 0 0 1-18 0c0-4 3-6 4-10 1 3 2 4 3 4 0-3 1-6 2-9z"/>
      <path class="flame flame-inner" d="M20 12c2 3 5 5 5 8a5 5 0 0 1-10 0c0-2 2-4 3-6 0 2 1 2 1 2 0-1 0-3 1-4z"/>
      <path class="campfire-logs" d="M6 23L34 28M34 23L6 28"/>
      <path class="campfire-spark" d="M8 8l2 2M32 8l-2 2"/>
    </svg>`;
  span.appendChild(fire);
  return span;
}

// A word with a soft gold star glowing behind it (same gold as the star key)
function makeStarWord(text) {
  const span = document.createElement("span");
  span.className = "star-word";

  const star = document.createElement("span");
  star.className = "star-behind";
  star.setAttribute("aria-hidden", "true");
  star.innerHTML = `
    <svg viewBox="0 0 40 40">
      <path class="star-rays" d="M20 0v4M20 36v4M0 20h4M36 20h4"/>
      <path class="star-shape" d="M20 6l4.1 8.6 9.4 1.2-6.9 6.5 1.8 9.3L20 27l-8.4 4.6 1.8-9.3-6.9-6.5 9.4-1.2z"/>
    </svg>`;
  span.appendChild(star);

  const word = document.createElement("span");
  word.className = "star-text";
  word.textContent = text;
  span.appendChild(word);
  return span;
}

// ---------------------------------------------------------
// Doodle cover: hides the question (not the story lines) behind
// black-and-white doodles until you click it
// ---------------------------------------------------------

const DOODLE_PAW = `
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <path d="M30 32c-9 0-16 7-15 14 1 6 8 7 15 5 7 2 14 1 15-5 1-7-6-14-15-14z"/>
    <ellipse cx="14" cy="26" rx="5" ry="7" transform="rotate(-25 14 26)"/>
    <ellipse cx="24" cy="15" rx="5" ry="7.5" transform="rotate(-8 24 15)"/>
    <ellipse cx="37" cy="15" rx="5" ry="7.5" transform="rotate(10 37 15)"/>
    <ellipse cx="47" cy="27" rx="5" ry="7" transform="rotate(28 47 27)"/>
  </svg>`;

const DOODLE_COFFEE = `
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <path d="M14 26h28l-3 24c-.5 3-3 5-6 5H23c-3 0-5.5-2-6-5z"/>
    <path d="M41 31c6-1 9 2 8 6s-5 6-9 5"/>
    <path d="M12 26c0-2 1-3 3-3h26c2 0 3 1 3 3"/>
    <path d="M17 38h22"/>
    <path d="M22 18c-3-3 3-5 0-9M29 18c-3-3 3-5 0-9M36 18c-3-3 3-5 0-9"/>
  </svg>`;

const DOODLE_BEAR_PAW = `
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <path d="M12 40c0-8 8-12 18-12s18 4 18 12c0 7-6 10-10 9-3-1-5-2-8-2s-5 1-8 2c-4 1-10-2-10-9z"/>
    <ellipse cx="10" cy="27" rx="4" ry="5" transform="rotate(-30 10 27)"/>
    <ellipse cx="19" cy="19" rx="4" ry="5" transform="rotate(-15 19 19)"/>
    <ellipse cx="30" cy="16" rx="4" ry="5"/>
    <ellipse cx="41" cy="19" rx="4" ry="5" transform="rotate(15 41 19)"/>
    <ellipse cx="50" cy="27" rx="4" ry="5" transform="rotate(30 50 27)"/>
    <path d="M7 21l-3-5M17 13l-2-5M30 10V4M43 13l2-5M53 21l3-5"/>
  </svg>`;

const DOODLE_CLAW = `
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <path d="M12 6c5 14 7 28 3 46"/>
    <path d="M27 4c5 16 6 32 2 52"/>
    <path d="M42 6c5 14 6 27 2 44"/>
  </svg>`;

const DOODLE_PHONE = `
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <rect x="17" y="4" width="26" height="52" rx="5"/>
    <path d="M17 13h26M17 46h26M26 8.5h8"/>
    <circle cx="30" cy="51" r="2"/>
    <path d="M23 21h14M23 27h10M23 33h12"/>
  </svg>`;

// [doodle, left %, top %, size rem, rotation deg]
const PAW_COFFEE_STICKERS = [
  [DOODLE_PAW, 3, 8, 2.6, -18],
  [DOODLE_PAW, 9, 58, 1.6, 12],
  [DOODLE_COFFEE, 15, 52, 2.4, 10],
  [DOODLE_PAW, 20, 10, 1.5, -35],
  [DOODLE_PAW, 27, 4, 2, 25],
  [DOODLE_PAW, 32, 62, 1.7, -10],
  [DOODLE_COFFEE, 40, 60, 2.1, -12],
  [DOODLE_PAW, 46, 2, 1.6, 30],
  [DOODLE_PAW, 55, 58, 2.2, -30],
  [DOODLE_COFFEE, 64, 2, 2.3, 14],
  [DOODLE_PAW, 68, 62, 1.5, 22],
  [DOODLE_PAW, 74, 8, 1.8, -20],
  [DOODLE_PAW, 78, 50, 2.5, 20],
  [DOODLE_PAW, 85, 64, 1.6, -28],
  [DOODLE_COFFEE, 89, 6, 2.6, -8],
  [DOODLE_PAW, 94, 48, 1.7, 15],
];

const BEAR_STICKERS = [
  [DOODLE_BEAR_PAW, 3, 8, 2.6, -15],
  [DOODLE_CLAW, 9, 55, 2.2, 20],
  [DOODLE_BEAR_PAW, 17, 58, 1.7, 10],
  [DOODLE_CLAW, 22, 4, 2, -25],
  [DOODLE_BEAR_PAW, 30, 10, 1.6, 25],
  [DOODLE_BEAR_PAW, 35, 60, 2.1, -12],
  [DOODLE_CLAW, 44, 2, 2.3, 15],
  [DOODLE_BEAR_PAW, 52, 58, 1.8, 30],
  [DOODLE_CLAW, 60, 55, 2, -18],
  [DOODLE_BEAR_PAW, 64, 4, 2.2, -20],
  [DOODLE_BEAR_PAW, 72, 60, 1.6, 18],
  [DOODLE_CLAW, 77, 6, 1.9, 25],
  [DOODLE_BEAR_PAW, 84, 52, 2.5, -8],
  [DOODLE_CLAW, 90, 4, 2.4, -12],
  [DOODLE_BEAR_PAW, 95, 58, 1.6, 22],
];

const PHONE_STICKERS = [
  [DOODLE_PHONE, 3, 6, 2.6, -15],
  [DOODLE_PHONE, 10, 56, 1.8, 18],
  [DOODLE_PHONE, 19, 8, 1.6, 25],
  [DOODLE_PHONE, 27, 58, 2.2, -10],
  [DOODLE_PHONE, 35, 2, 1.9, 12],
  [DOODLE_PHONE, 44, 60, 1.6, -25],
  [DOODLE_PHONE, 53, 4, 2.3, -18],
  [DOODLE_PHONE, 61, 56, 1.9, 22],
  [DOODLE_PHONE, 69, 6, 1.6, 30],
  [DOODLE_PHONE, 77, 54, 2.4, -12],
  [DOODLE_PHONE, 85, 4, 2, 15],
  [DOODLE_PHONE, 94, 52, 1.7, -22],
];

// Which pages get a cover, and which doodles go on it
const STORY_COVERS = {
  page2: PAW_COFFEE_STICKERS,
  "page2-5": BEAR_STICKERS,   // right after the bear answer
  page3: BEAR_STICKERS,
};

// ---------------------------------------------------------
// Side doodles: a small drawing to the left and right of a story line
// ---------------------------------------------------------

const DOODLE_BERRIES = `
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <path class="doodle-leaf" d="M30 7c0 8-4 13-9 19M30 7c1 8 5 13 9 20M30 7c0 12 0 22-1 29"/>
    <path class="doodle-leaf" d="M30 9c5-6 13-6 17-3-4 6-12 7-17 3z"/>
    <circle class="doodle-berry" cx="20" cy="32" r="8"/>
    <circle class="doodle-berry" cx="40" cy="33" r="8"/>
    <circle class="doodle-berry" cx="29" cy="45" r="9"/>
    <path class="doodle-shine" d="M16 29c1-2 2-3 4-3M36 30c1-2 2-3 4-3M24 42c1-2 3-3 5-3"/>
  </svg>`;

const DOODLE_MUSHROOMS = `
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <path class="doodle-stem" d="M25 54c-1-7 0-14 1-20h8c1 6 2 13 1 20"/>
    <path class="doodle-cap" d="M14 35c0-11 8-18 16-18s16 7 16 18z"/>
    <circle class="doodle-spot" cx="24" cy="27" r="2.2"/>
    <circle class="doodle-spot" cx="33" cy="23" r="1.8"/>
    <circle class="doodle-spot" cx="38" cy="30" r="1.6"/>
    <path class="doodle-stem" d="M10 54c0-4 0-7 1-10h4c1 3 1 6 1 10"/>
    <path class="doodle-cap" d="M5 45c0-6 4-9 8-9s8 3 8 9z"/>
    <circle class="doodle-spot" cx="12" cy="40" r="1.4"/>
    <path class="doodle-stem" d="M45 54c0-5 0-8 1-11h4c1 3 1 6 1 11"/>
    <path class="doodle-cap" d="M40 44c0-6 4-10 8-10s8 4 8 10z"/>
    <circle class="doodle-spot" cx="50" cy="39" r="1.4"/>
    <path d="M4 54h52"/>
  </svg>`;

const DOODLE_CINNAMON_rolls = `
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <path class="doodle-steam steam-1" d="M22 14c-3-2 3-4 0-6s3-4 0-6"/>
    <path class="doodle-steam steam-2" d="M30 12c-3-2 3-4 0-6s3-4 0-6"/>
    <path class="doodle-steam steam-3" d="M38 14c-3-2 3-4 0-6s3-4 0-6"/>
    <!-- side of the roll, a little darker (more baked) -->
    <path class="doodle-bun doodle-bun-side" d="M7 28v9c0 8 10 14 23 14s23-6 23-14v-9"/>
    <path class="doodle-layer" d="M11 41c3 4 8 6 12 7"/>
    <!-- top of the roll, seen at an angle, with a bold 2½-turn swirl -->
    <ellipse class="doodle-bun" cx="30" cy="28" rx="23" ry="12"/>
    <path class="doodle-swirl" d="M30 28a3.5 1.75 0 0 1 7 0a7 3.5 0 0 1-14 0a10.5 5.25 0 0 1 21 0a14 7 0 0 1-28 0a17.5 8.75 0 0 1 35 0"/>
    <!-- thick icing draped over the front edge, dripping down the side -->
    <path class="doodle-icing" d="M12 31c2 4 7 7 13 8v7a2 2 0 0 0 4 0v-6.5c3 0 6 0 9-.5v10a2 2 0 0 0 4 0v-11c3-1 6-3 8-6-3 1-5-1-8 0s-6 3-10 2-6-3-10-2-6 2-10 0z"/>
    <!-- powdered sugar -->
    <circle class="doodle-sugar" cx="47" cy="44" r="1"/>
    <circle class="doodle-sugar" cx="16" cy="46" r="1"/>
    <circle class="doodle-sugar" cx="34" cy="49" r="1"/>
  </svg>`;

// Answer you just picked -> [left doodle, right doodle] around its outcome line
const ANSWER_SIDE_DOODLES = {
  forage: [DOODLE_BERRIES, DOODLE_MUSHROOMS],   // "The mushrooms taste like a basement..."
  tapwand: [DOODLE_CINNAMON_rolls, DOODLE_CINNAMON_rolls], // "...the smell of cinnamon rolls."
  pick: [DOODLE_CINNAMON_rolls, DOODLE_CINNAMON_rolls],    // "...the smell of cinnamon rolls."
};

function addSideDoodles(p, [leftSvg, rightSvg]) {
  const text = document.createElement("span");
  text.className = "side-doodle-text";
  text.append(...p.childNodes);

  const makeDoodle = (svg) => {
    const d = document.createElement("span");
    d.className = "side-doodle";
    d.setAttribute("aria-hidden", "true");
    d.innerHTML = svg;
    return d;
  };

  p.classList.add("side-doodled");
  p.append(makeDoodle(leftSvg), text, makeDoodle(rightSvg));
}

// Overrides by the answer you just picked (wins over STORY_COVERS)
const ANSWER_COVERS = {
  run: PHONE_STICKERS,     // "Ran away and left your friends behind"
  small: PHONE_STICKERS,   // "Made yourself small..."
};

// The cover sits in a wrapper around the question (not inside it), so
// rewriting the question text (language switch, variants) never wipes it.
function questionCoverWrap(heading) {
  let wrap = heading.parentElement;
  if (!wrap.classList.contains("question-cover-wrap")) {
    wrap = document.createElement("div");
    wrap.className = "question-cover-wrap";
    heading.before(wrap);
    wrap.appendChild(heading);
  }
  return wrap;
}

function removeQuestionCover(heading) {
  const wrap = heading && heading.parentElement;
  if (!wrap || !wrap.classList.contains("question-cover-wrap")) return;
  wrap.classList.remove("question-covered");
  wrap.querySelectorAll(":scope > .story-cover").forEach((c) => c.remove());
}

function addQuestionCover(heading, stickers) {
  const wrap = questionCoverWrap(heading);
  wrap.classList.add("question-covered");

  const cover = document.createElement("button");
  cover.type = "button";
  cover.className = "story-cover";

  stickers.forEach(([svg, left, top, size, rotate]) => {
    const sticker = document.createElement("span");
    sticker.className = "story-sticker";
    sticker.innerHTML = svg;
    sticker.style.cssText = `left:${left}%;top:${top}%;width:${size}rem;height:${size}rem;transform:rotate(${rotate}deg)`;
    cover.appendChild(sticker);
  });

  const label = document.createElement("span");
  label.className = "story-cover-label";
  label.textContent = t("story.clickToRead", "CLICK TO READ");
  cover.appendChild(label);

  cover.addEventListener("click", () => {
    wrap.classList.remove("question-covered");
    cover.remove();
    heading.focus();
  });

  wrap.appendChild(cover);
}

// ---------------------------------------------------------
// Falling leaves: after "pile up dry leaves", colored doodle
// leaves drift down and land on top of the next question.
// They stop once there's one full layer across the first line.
// ---------------------------------------------------------
const LEAF_SHAPES = [
  // maple
  `<svg viewBox="0 0 60 60" aria-hidden="true">
    <path class="leaf-fill" d="M30 4l5 14 11-6-3 13 13 1-11 9 5 9-14-3-4 11h-4l-4-11-14 3 5-9-11-9 13-1-3-13 11 6z"/>
    <path d="M30 56V22M30 40L17 29M30 40l13-11"/>
  </svg>`,
  // oval
  `<svg viewBox="0 0 60 60" aria-hidden="true">
    <path class="leaf-fill" d="M30 5c16 10 20 32 0 48C10 37 14 15 30 5z"/>
    <path d="M30 9v49M30 24l-7-5M30 24l7-5M30 35l-9-6M30 35l9-6"/>
  </svg>`,
  // round birch
  `<svg viewBox="0 0 60 60" aria-hidden="true">
    <path class="leaf-fill" d="M30 8c17 0 24 20 14 34-6 8-22 8-28 0C6 28 13 8 30 8z"/>
    <path d="M30 12v46M30 26l-8-6M30 26l8-6M30 37l-10-6M30 37l10-6"/>
  </svg>`,
];

const LEAF_COLORS = ["#f4a259", "#e76f51", "#f6c453", "#c9733a", "#9cbf5a", "#e9a1b0"];

let leafTimers = [];

function clearLeafPile() {
  leafTimers.forEach(clearTimeout);
  leafTimers = [];
  document.querySelectorAll(".leaf-pile").forEach((pile) => pile.remove());
  document.querySelectorAll(".has-leaves").forEach((q) => q.classList.remove("has-leaves"));
}

function dropLeaves(pageId) {
  const heading = document.querySelector(`#${CSS.escape(pageId)} .question`);
  if (!heading) return;

  // Make room above the question first, so the leaves sit on top of the
  // words instead of covering them (matters most on small phone screens)
  heading.classList.add("has-leaves");

  // Measure the first line of the question so leaves only land on words
  const range = document.createRange();
  range.selectNodeContents(heading);
  const firstLine = range.getClientRects()[0];
  const box = heading.getBoundingClientRect();
  if (!firstLine) return;

  const pile = document.createElement("div");
  pile.className = "leaf-pile";
  pile.setAttribute("aria-hidden", "true");
  heading.appendChild(pile);

  const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const leafPx = 1.9 * remPx;
  const step = leafPx * 0.8;   // slight overlap, still one layer
  const lineLeft = firstLine.left - box.left;
  const lineTop = firstLine.top - box.top;
  const count = Math.max(3, Math.floor((firstLine.width - leafPx * 0.3) / step));
  const spacing = (firstLine.width - leafPx * 0.3) / count;

  // Shuffle the landing spots so leaves fill in randomly
  const slots = [...Array(count).keys()].sort(() => Math.random() - 0.5);
  // Leaves fall on every device; only very old browsers without the
  // animation API get them placed straight onto the pile.
  const reduceMotion = typeof Element.prototype.animate !== "function";

  slots.forEach((slot, i) => {
    const timer = setTimeout(() => {
      const leaf = document.createElement("span");
      leaf.className = "falling-leaf";
      leaf.innerHTML = LEAF_SHAPES[Math.floor(Math.random() * LEAF_SHAPES.length)];
      leaf.style.setProperty("--leaf-color", LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]);

      const x = lineLeft + slot * spacing + (Math.random() - 0.5) * spacing * 0.3;
      const y = lineTop - leafPx * 0.92;   // resting just above the letters, not over them
      leaf.style.cssText += `left:${x}px;top:${y}px;width:${leafPx}px;height:${leafPx}px;`;

      // Leaves lie on their side when they land
      const rest = (Math.random() < 0.5 ? 90 : -90) + (Math.random() - 0.5) * 50;
      const restTransform = `translate(0, 0) rotate(${rest}deg)`;
      pile.appendChild(leaf);

      if (reduceMotion) {
        leaf.style.transform = restTransform;
        return;
      }

      // Start just above the top of the screen and flutter down
      const fallFrom = -(box.top + y + leafPx * 2);
      const sway = 25 + Math.random() * 35;
      const spin = Math.random() < 0.5 ? -1 : 1;
      leaf.animate(
        [
          { transform: `translate(${sway}px, ${fallFrom}px) rotate(${spin * 20}deg)` },
          { transform: `translate(${-sway}px, ${fallFrom * 0.7}px) rotate(${spin * -40}deg)` },
          { transform: `translate(${sway * 0.7}px, ${fallFrom * 0.4}px) rotate(${spin * 50}deg)` },
          { transform: `translate(${-sway * 0.4}px, ${fallFrom * 0.12}px) rotate(${rest - spin * 30}deg)` },
          { transform: restTransform },
        ],
        { duration: 2600 + Math.random() * 1400, easing: "cubic-bezier(.35,.1,.55,1)", fill: "forwards" }
      );
    }, reduceMotion ? 0 : i * 260 + Math.random() * 200);
    leafTimers.push(timer);
  });
}

// ---------------------------------------------------------
// Show one page and hide all the others
// ---------------------------------------------------------
// ---------------------------------------------------------
// Questions that change based on your path. Each function
// returns new question text, or nothing to keep the default
// text from index.html.
// ---------------------------------------------------------
const QUESTION_VARIANTS = {
  "page-fairy": () =>
    picked("pick") &&
    t("question.fairyKicked", "A tiny fairy stands in the splintered doorway, in an acorn cap and a maple-leaf cardigan, holding what's left of his hinge. \"That was my DOOR.\" Then he spots the star key in your pocket, and his glare wobbles. \"...You found my key. Thank you, I suppose.\" He crosses his arms. \"Rules are rules. I still owe you one favor. Don't be weird about it.\" What do you ask for?"),
};

function fillQuestion(pageId) {
  const heading = document.querySelector(`#${CSS.escape(pageId)} .question`);
  // Only pages with a variant get rewritten (so page 8 keeps its name <span>)
  if (!heading || !QUESTION_VARIANTS[pageId]) return;
  if (heading.dataset.default === undefined) heading.dataset.default = heading.textContent.trim();
  const variant = QUESTION_VARIANTS[pageId] && QUESTION_VARIANTS[pageId]();
  heading.textContent = variant || heading.dataset.default;
}

function showPage(pageId) {
  fillStory(pageId);
  fillQuestion(pageId);

  document.querySelectorAll(".page").forEach((page) => {
    page.hidden = page.id !== pageId;
  });

  // The tiny fairy pops up on some pages at random (see fairy.js)
  if (window.fairyOnPage) window.fairyOnPage(pageId);

  clearLeafPile();
  if (pageId === "page6" && history[history.length - 1] === "leaves") {
    requestAnimationFrame(() => dropLeaves(pageId));
  }

  // The back button shows on every question except the first and the result
  document.getElementById("back-btn").hidden = pageId === "page1" || pageId === "result";

  window.scrollTo(0, 0);

  // Start the clock for this question
  pageShownAt = Date.now();
  hiddenAt = document.hidden ? pageShownAt : null;

  // Move keyboard/screen-reader focus to the new question
  const heading = document.querySelector(`#${CSS.escape(pageId)} [tabindex="-1"]`);
  if (heading) heading.focus();

  // On the name page, put the cursor right in the text box
  if (pageId === "page-name") document.getElementById("name-input").focus();
}

// ---------------------------------------------------------
// Runs whenever any answer button is clicked
// ---------------------------------------------------------
function choose(choiceKey) {
  const answer = ANSWERS[choiceKey];

  // Took longer than 1:30 on this question? (The start page doesn't count:
  // people often open the quiz and wander off before starting.)
  const pageId = pageOfChoice(choiceKey);
  const awayNow = hiddenAt !== null ? Date.now() - hiddenAt : 0;
  if (pageId !== "page1" && Date.now() - pageShownAt - awayNow > SLOW_MS) {
    habits.slow.add(pageId);
  }

  history.push(choiceKey);

  if (answer.next === "result") {
    showResult();
  } else {
    showPage(answer.next);
  }
}

// ---------------------------------------------------------
// Friends & foes (3 each): who each type gets along with (and who drives
// them up a tree), based on their core traits.
//   [type, why] — the type's photo comes from RESULTS
// ---------------------------------------------------------
const RELATIONS = {
  scout: {
    friends: [
      ["survivalist", "Finally, someone else who packed the backup batteries."],
      ["medic", "You run the plan, they keep everyone in one piece. Dream team."],
      ["tattletale", "Someone else who actually reads the trail rules sign."],
    ],
    foes: [
      ["mystic", "Every plan you make, they snack their way off of it."],
      ["lonewolf", "Your group itinerary is, to them, a suggestion for other people."],
      ["glamper", "Packed three outfits and zero first-aid supplies."],
    ],
  },
  survivalist: {
    friends: [
      ["scout", "You both trust preparation over luck. Your packs weigh the same."],
      ["nightwatch", "They spot the danger, you already have the gear for it."],
      ["lonewolf", "Neither of you needs rescuing, and you respect that about each other."],
    ],
    foes: [
      ["camper", "Brought a hammock and zero snacks. Expects to share yours."],
      ["mystic", "You ration. They eat whatever grows on a log."],
      ["glamper", "Packed a hair dryer instead of a water filter. In the woods."],
    ],
  },
  nightwatch: {
    friends: [
      ["survivalist", "You notice the problem, they've already got a plan for it."],
      ["tattletale", "Two sets of eyes that miss nothing. Nobody gets away with anything."],
      ["medic", "They listen as well as you do, and they never push you to talk."],
    ],
    foes: [
      ["bard", "You're trying to listen for footsteps. They're singing."],
      ["trailblazer", "They charge ahead before you've finished reading the room."],
      ["schemer", "You can see every string they're pulling. It's exhausting."],
    ],
  },
  trailblazer: {
    friends: [
      ["lonewolf", "Neither of you waits for permission. You just go."],
      ["mystic", "Always up for anything, and they actually keep up."],
      ["scout", "They make the plan, you lead the charge. Things get done."],
    ],
    foes: [
      ["camper", "You want the summit. They want a nap at the bottom."],
      ["nightwatch", "Every time you move, they want to \"think about it first.\""],
      ["schemer", "Agrees with every word you say, then does what they wanted anyway."],
    ],
  },
  lonewolf: {
    friends: [
      ["trailblazer", "They get it: freedom first, questions later."],
      ["camper", "Easygoing company that never asks where you're going."],
      ["survivalist", "Self-sufficient and quiet. You trust that."],
    ],
    foes: [
      ["tattletale", "You wander off for five minutes and they file a missing-person report."],
      ["scout", "They want a buddy system. You are the buddy system."],
      ["medic", "Keeps checking in on you. Please stop checking in on you."],
    ],
  },
  bard: {
    friends: [
      ["camper", "The best audience a storyteller could ask for."],
      ["mystic", "They give you the wildest material for your next story."],
      ["glamper", "Finally, someone who appreciates a dramatic entrance."],
    ],
    foes: [
      ["nightwatch", "Shushes you right before the best part."],
      ["tattletale", "Fact-checks your story while you're still telling it."],
      ["survivalist", "Interrupts your ghost story to explain why that couldn't happen."],
    ],
  },
  mystic: {
    friends: [
      ["bard", "They turn your strangest moments into legends."],
      ["trailblazer", "Says yes to every adventure, just like you."],
      ["schemer", "Always has a plan, and you're always in."],
    ],
    foes: [
      ["scout", "Has a printed schedule. You have vibes."],
      ["survivalist", "Won't share snacks and hides the mushrooms from you."],
      ["tattletale", "Wrote down everything you ate. For the medic. And for the record."],
    ],
  },
  medic: {
    friends: [
      ["scout", "They keep the group organized, you keep the group okay."],
      ["camper", "Warm, gentle and kind, your kind of people."],
      ["nightwatch", "Quiet and thoughtful, and they actually let you help."],
    ],
    foes: [
      ["lonewolf", "Refuses help, then shows up with a sprained ankle."],
      ["mystic", "You've treated them for \"just one bite\" three times this trip."],
      ["schemer", "Knows exactly how nice you are, and runs a tab on it."],
    ],
  },
  tattletale: {
    friends: [
      ["nightwatch", "They see everything, and you make sure it gets reported."],
      ["scout", "Finally, someone who respects the rules as much as you do."],
      ["survivalist", "You both read the warning signs. Literally, every single one."],
    ],
    foes: [
      ["lonewolf", "Breaks every rule, then disappears before you can write it down."],
      ["bard", "That's not what happened and you both know it."],
      ["schemer", "You know they did it. You just can't prove it. Yet."],
    ],
  },
  camper: {
    friends: [
      ["bard", "Campfire stories and good vibes, all night long."],
      ["lonewolf", "Neither of you needs to talk. It's nice."],
      ["medic", "They bring the tea, you bring the calm. Perfect trade."],
    ],
    foes: [
      ["trailblazer", "Keeps saying \"just one more mile\" like that's a good thing."],
      ["survivalist", "Turns a relaxing night into a disaster drill."],
      ["scout", "Wakes you up at 6 a.m. for a \"fun\" sunrise hike."],
    ],
  },
  glamper: {
    friends: [
      ["bard", "You both believe life should be a little more cinematic."],
      ["schemer", "Somehow always finds you an outlet. You don't ask how."],
      ["camper", "Slow mornings, fuzzy socks, no alarms. Bliss."],
    ],
    foes: [
      ["survivalist", "Calls your hair dryer \"dead weight.\" It's emotional support."],
      ["trailblazer", "Wants to hike nine miles before breakfast. You want breakfast."],
      ["scout", "Their packing list has no room for your pillow."],
    ],
  },
  schemer: {
    friends: [
      ["glamper", "You get them the nice things. They never ask where from."],
      ["mystic", "Says yes to every plan and never asks what's in it for you."],
      ["camper", "Easygoing, never asks questions, always shares."],
    ],
    foes: [
      ["tattletale", "Writes down everything you say. Ruins everything."],
      ["nightwatch", "Saw through your plan before you'd finished making it."],
      ["trailblazer", "Two people trying to run the same group, and only one of you does it openly."],
    ],
  },
};

// ---------------------------------------------------------
// Add up the points and rank the types
// ---------------------------------------------------------
function calculateResult() {
  const scores = {};
  for (const type in TYPES) scores[type] = 0;

  history.forEach((choiceKey) => {
    const points = ANSWERS[choiceKey].points;
    for (const type in points) scores[type] += points[type];
  });

  // Small nudges for HOW you answered (see SLOW_POINTS / BACK_POINTS)
  for (const type in SLOW_POINTS) scores[type] += SLOW_POINTS[type] * slowCount();
  if (isSecondGuesser()) {
    for (const type in BACK_POINTS) scores[type] += BACK_POINTS[type];
  }

  // Sort types from highest to lowest score
  const ranking = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

  // Tie-breaker: if several types share the top score, the one your
  // most recent answers pointed to wins (how you ended matters most).
  const tied = ranking.filter((type) => scores[type] === scores[ranking[0]]);
  if (tied.length > 1) {
    for (let i = history.length - 1; i >= 0; i--) {
      const points = ANSWERS[history[i]].points;
      const best = tied.filter((type) => points[type]).sort((a, b) => points[b] - points[a])[0];
      if (best) {
        ranking.splice(ranking.indexOf(best), 1);
        ranking.unshift(best);
        break;
      }
    }
  }

  return { scores, ranking };
}

// ---------------------------------------------------------
// Fill in the result page
// ---------------------------------------------------------
function showResult() {
  const { scores, ranking } = calculateResult();
  const topType = ranking[0];
  const result = RESULTS[topType];

  document.getElementById("result-name").textContent = result.name;
  document.getElementById("result-tagline").textContent = result.tagline;
  document.getElementById("result-runnerup").textContent = t("runnerUp", (name) => `with a streak of ${name}`, TYPES[ranking[1]]);
  document.getElementById("result-description").textContent = result.description;

  const photo = document.getElementById("result-photo");
  photo.src = result.image.src;
  photo.alt = result.image.alt;
  document.getElementById("result-photo-credit").textContent = t("photoCredit", (credit) => `Photo: ${credit}`, result.image.credit);

  // Sparkles around the personality name and photo (gone in 8 seconds)
  addSparkles(document.getElementById("result-name"), 14);
  addSparkles(photo.closest(".result-photo"), 22);

  fillList("result-strengths", result.strengths);
  fillList("result-watchouts", result.watchouts);

  // What makes you tick: trait words, then the plain-language details
  const [traitWords, coreLine] = result.core;
  const traits = document.getElementById("result-traits");
  traits.innerHTML = "";
  traitWords.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    traits.appendChild(li);
  });
  document.getElementById("result-core").textContent = coreLine;
  document.getElementById("result-drive").textContent = result.drive;
  document.getElementById("result-wiring").textContent = result.wiring;
  document.getElementById("result-stress").textContent = result.stress;
  document.getElementById("result-need").textContent = result.need;

  fillHabits();

  // Personality mix bars: your top 4 types
  const total = Object.values(scores).reduce((sum, n) => sum + n, 0);
  const meters = document.getElementById("result-meters");
  meters.innerHTML = "";
  ranking.slice(0, 4).forEach((type) => {
    const percent = Math.round((scores[type] / total) * 100);
    const meter = document.createElement("div");
    meter.className = type === topType ? "meter meter-top" : "meter";
    meter.innerHTML = `
      <div class="meter-label"><span>${TYPES[type]}</span><span>${percent}%</span></div>
      <div class="meter-track"><div class="meter-fill" style="width: ${percent}%"></div></div>
    `;
    meters.appendChild(meter);
  });

  // Friends & foes, each with that type's photo
  fillKin("result-friends", RELATIONS[topType].friends);
  fillKin("result-foes", RELATIONS[topType].foes);

  // The "all personalities" page gets your path too, so it can mark your
  // type and send you back to this exact result.
  document.getElementById("all-types-link").href = `personalities.html?${resultQuery()}${langParam()}`;
  document.getElementById("share-status").textContent = "";
  document.getElementById("share-options").hidden = true;

  showPage("result");
}

// ---------------------------------------------------------
// Sharing: your answers are saved in the link itself, e.g.
//   index.html?path=direct.run.left...
// Opening that link replays the answers and shows the same result page.
// ---------------------------------------------------------
function pathParam() {
  return history.join(".");
}

// The full query string for a result: your answers, plus how many questions
// you were slow on / went back on, so a shared link scores the same way.
function resultQuery() {
  let query = `path=${pathParam()}`;
  if (habits.slow.size) query += `&slow=${habits.slow.size}`;
  if (habits.back) query += `&back=${habits.back}`;
  return query;
}

// Read &slow=N&back=N from a shared link
function habitsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const count = (name) => Math.min(Math.max(parseInt(params.get(name), 10) || 0, 0), 50);
  const fake = (n) => new Set(Array.from({ length: n }, (_, i) => `shared-${i}`));
  return { slow: fake(count("slow")), back: count("back") };
}

// "How you took the quiz": explain the timing / back-button nudges
function fillHabits() {
  const box = document.getElementById("result-habits-box");
  const list = document.getElementById("result-habits");
  list.innerHTML = "";

  const notes = [];
  const slow = habits.slow.size;
  if (slow) {
    notes.push(
      t("habitsSlow", (n) =>
        `You spent more than 2 minutes on ${n} question${n === 1 ? "" : "s"}. ` +
        "No rush, right? It'll get done eventually. " +
        "That nudged your Happy Camper (in no hurry, ever) score up a little.",
      slow)
    );
  }
  const back = habits.back;
  if (back) {
    notes.push(
      t("habitsBack", (n, secondGuesser) => {
        const note = `You hit "back" ${n} time${n === 1 ? "" : "s"}.`;
        return secondGuesser
          ? `${note} Not quite right? Do it again. You want every answer to be just so. That nudged your Glamper (high standards, picky about the details) score up a little.`
          : `${note} Changing your mind a few times is just being thoughtful, so it didn't affect your result.`;
      }, back, isSecondGuesser())
    );
  }

  notes.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
  box.hidden = notes.length === 0;
}

function shareLink() {
  const url = new URL(window.location.href);
  url.search = `?${resultQuery()}${langParam()}`;
  url.hash = "";
  return url.toString();
}

// Read ?path=... from the address bar. Returns the list of answers only if
// it's a real, complete run through the quiz; otherwise null.
function pathFromUrl() {
  const raw = new URLSearchParams(window.location.search).get("path");
  if (!raw) return null;
  const keys = raw.split(".").filter((key) => !RETIRED_CHOICES.includes(key));
  if (!keys.length) return null;
  if (!keys.every((key) => Object.prototype.hasOwnProperty.call(ANSWERS, key))) return null;
  if (ANSWERS[keys[keys.length - 1]].next !== "result") return null;
  return keys;
}

function shareText() {
  const name = RESULTS[calculateResult().ranking[0]].name;
  return t("shareText", (type) => `I got ${type} in the Into the Woods personality quiz! Which one are you?`, name);
}

// Copy text to the clipboard. Falls back to the old trick for pages
// opened without https (where navigator.clipboard isn't allowed).
async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const box = document.createElement("textarea");
    box.value = value;
    box.setAttribute("readonly", "");
    box.style.position = "fixed";
    box.style.opacity = "0";
    document.body.appendChild(box);
    box.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    box.remove();
    return ok;
  }
}

async function copyShareLink(successMessage) {
  const status = document.getElementById("share-status");
  const url = shareLink();
  const ok = await copyText(`${shareText()} ${url}`);
  status.textContent = ok ? successMessage : t("copyFallback", (link) => `Copy this link to share: ${link}`, url);
}

const isPhone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Point each share option at the current result
function fillShareOptions() {
  const message = encodeURIComponent(`${shareText()} ${shareLink()}`);
  const link = encodeURIComponent(shareLink());
  const options = document.getElementById("share-options");
  options.querySelector('[data-share="sms"]').href = `sms:?&body=${message}`;
  options.querySelector('[data-share="whatsapp"]').href = `https://wa.me/?text=${message}`;
  // The Messenger app can take a link directly. On a computer we open
  // messenger.com instead, and the link is already copied for pasting.
  options.querySelector('[data-share="messenger"]').href = isPhone
    ? `fb-messenger://share/?link=${link}`
    : "https://www.messenger.com/new";
}

// "Share" button: copy the link right away, then show the options
async function shareResult() {
  fillShareOptions();
  document.getElementById("share-options").hidden = false;
  await copyShareLink(t("share.copied", "Link copied! Paste it anywhere, or pick an app below."));
}

// Every option copies the link too, so it's ready to paste wherever it opens.
// (Instagram has no way to pre-fill a message, so pasting is the only way.)
function onShareOption(event) {
  // KakaoTalk has no web link that pre-fills a message (that needs a Kakao
  // developer app key). On phones, the system share sheet lists KakaoTalk
  // and sends the message straight into a chat; otherwise we copy the link
  // and open the KakaoTalk app (phone) or just copy it (computer).
  if (event.currentTarget.dataset.share === "kakaotalk") {
    event.preventDefault();
    const status = document.getElementById("share-status");
    if (isPhone && navigator.share) {
      navigator
        .share({ text: shareText(), url: shareLink() })
        .then(() => { status.textContent = t("share.done", "Shared!"); })
        .catch((err) => {
          if (err && err.name === "AbortError") return; // they closed the sheet
          copyShareLink(t("share.kakaotalk", "Link copied! Paste it into a KakaoTalk chat."));
        });
      return;
    }
    copyShareLink(t("share.kakaotalk", "Link copied! Paste it into a KakaoTalk chat.")).then(() => {
      if (isPhone) window.location.href = "kakaotalk://launch";
    });
    return;
  }

  if (event.currentTarget.dataset.share === "igstory") {
    openStoryPoster(event.currentTarget);
    return;
  }

  const messages = {
    copy: "Link copied! Paste it to your friends.",
    sms: "Link copied! Opening your messages…",
    whatsapp: "Link copied! Opening WhatsApp…",
    messenger: "Link copied! Paste it into a Messenger chat.",
    instagram: "Link copied! Paste it into an Instagram DM.",
  };
  const key = event.currentTarget.dataset.share;
  copyShareLink(t(`share.${key}`, messages[key]));
}

// ---------------------------------------------------------
// Instagram Story poster: your result drawn on a 1080x1920 picture
// (the size of a story) with your type's photo.
// Websites can't post to Instagram directly, so on phones we hand the
// picture to the share sheet (pick Instagram -> Story), and the link is
// copied so it can go on a Link sticker. On a computer you save it.
// ---------------------------------------------------------
const POSTER_W = 1080;
const POSTER_H = 1920;
let storyBlob = null;
let storyBlobUrl = null;
let storyOpener = null;

// Split text into lines that fit `maxWidth`. Words that are too long on
// their own get broken letter by letter.
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  text.split(/\s+/).filter(Boolean).forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
      return;
    }
    if (line) lines.push(line);
    line = "";
    for (const ch of word) {
      if (ctx.measureText(line + ch).width > maxWidth && line) {
        lines.push(line);
        line = "";
      }
      line += ch;
    }
  });
  if (line) lines.push(line);
  return lines;
}

// Draw wrapped, centered text. Shrinks the font (down to `minSize`) so it
// fits in `maxLines`. Returns the y just below the last line.
function drawWrapped(ctx, text, { y, size, minSize = size, maxLines = 3, weight = "400", style = "normal", family, color, lineHeight = 1.25, maxWidth = 900 }) {
  let lines;
  for (;;) {
    ctx.font = `${style} ${weight} ${size}px ${family}`;
    lines = wrapText(ctx, text, maxWidth);
    if (lines.length <= maxLines || size <= minSize) break;
    size -= 4;
  }
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  lines.slice(0, maxLines).forEach((line, i) => {
    ctx.fillText(line, POSTER_W / 2, y + i * size * lineHeight);
  });
  return y + Math.min(lines.length, maxLines) * size * lineHeight;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// A four-point sparkle, like the ones on the result page
function drawSparkle(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x + r * 0.15, y - r * 0.15, x + r, y);
  ctx.quadraticCurveTo(x + r * 0.15, y + r * 0.15, x, y + r);
  ctx.quadraticCurveTo(x - r * 0.15, y + r * 0.15, x - r, y);
  ctx.quadraticCurveTo(x - r * 0.15, y - r * 0.15, x, y - r);
  ctx.fillStyle = color;
  ctx.fill();
}

// A row of pine trees along the bottom edge
function drawTrees(ctx) {
  // Back row (lighter, shorter) then front row (darker, taller)
  [["#183022", 0.75, 70], ["#0c1711", 1, 0]].forEach(([shade, scale, shift]) => {
    ctx.fillStyle = shade;
    for (let x = -30 + shift; x < POSTER_W + 80; x += 140) {
      const h = (150 + ((x * 7 + shift) % 70)) * scale;
      const w = h * 0.42;
      const base = POSTER_H - 20;
      ctx.fillRect(x - w * 0.08, base - 4, w * 0.16, 30); // trunk
      // Three stacked tiers, like a doodled pine
      for (let tier = 0; tier < 3; tier++) {
        const top = base - h + tier * h * 0.26;
        const tierW = w * (0.55 + tier * 0.25);
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x + tierW, top + h * 0.42);
        ctx.lineTo(x - tierW, top + h * 0.42);
        ctx.closePath();
        ctx.fill();
      }
    }
  });
  ctx.fillRect(0, POSTER_H - 22, POSTER_W, 22); // ground
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function drawStoryPoster(photo) {
  const { ranking } = calculateResult();
  const topType = ranking[0];
  const result = RESULTS[topType];
  const ko = LANG === "ko";
  const body = '"Segoe UI", system-ui, -apple-system, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
  const display = ko ? '"Jua", sans-serif' : '"Henny Penny", fantasy, cursive';

  // Wait for the storybook fonts, or the canvas falls back to plain ones
  if (document.fonts && document.fonts.load) {
    await Promise.all([
      document.fonts.load(`80px ${display}`, ko ? "숲속으로" : "Into the Woods"),
      ko ? document.fonts.load('80px "Jua"', result.name) : null,
    ]).catch(() => {});
  }

  const canvas = document.createElement("canvas");
  canvas.width = POSTER_W;
  canvas.height = POSTER_H;
  const ctx = canvas.getContext("2d");

  // Same forest glow as the website
  const bg = ctx.createRadialGradient(540, 420, 60, 540, 700, 1500);
  bg.addColorStop(0, "#2a4a37");
  bg.addColorStop(0.45, "#1f3a2b");
  bg.addColorStop(1, "#0f1c15");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);

  // Doodles only in the margins, so they never sit on the words:
  // little stars along the top edge and down both sides
  const stars = [
    [90, 70, 14], [230, 120, 8], [400, 60, 10], [700, 95, 9], [830, 150, 11], [1040, 190, 8],
    [45, 380, 10], [1035, 460, 12], [40, 760, 8], [1040, 900, 9], [48, 1150, 12], [1030, 1300, 9],
    [42, 1480, 9], [1036, 1620, 11],
  ];
  stars.forEach(([x, y, r]) => drawSparkle(ctx, x, y, r, "rgba(255, 236, 170, 0.75)"));
  // Crescent moon in the top-right corner (a circle with a bite cut out)
  const moon = document.createElement("canvas");
  moon.width = moon.height = 120;
  const m = moon.getContext("2d");
  m.fillStyle = "rgba(255, 244, 205, 0.9)";
  m.beginPath();
  m.arc(60, 60, 44, 0, Math.PI * 2);
  m.fill();
  m.globalCompositeOperation = "destination-out";
  m.beginPath();
  m.arc(82, 46, 40, 0, Math.PI * 2);
  m.fill();
  ctx.drawImage(moon, 900, 40);
  drawTrees(ctx);

  const title = document.querySelector("#page1 .title").textContent.trim();
  const chapter = document.querySelector("#result > .chapter").textContent.trim();

  // Title, then "You made it out. You are…"
  ctx.shadowColor = "rgba(255, 236, 170, 0.45)";
  ctx.shadowBlur = 30;
  let y = drawWrapped(ctx, title, { y: 210, size: 96, maxLines: 1, family: display, color: "#f4efe2" });
  ctx.shadowBlur = 0;
  y = drawWrapped(ctx, chapter.toUpperCase(), { y: y + 40, size: 34, maxLines: 2, weight: "600", family: body, color: "#8fbf6a" });

  // Your type, big and gold
  y = drawWrapped(ctx, result.name, { y: y + 24, size: 104, minSize: 72, maxLines: 2, weight: "700", family: ko ? display : body, color: "#f2b84b", lineHeight: 1.12 });
  y = drawWrapped(ctx, result.tagline, { y: y + 22, size: 42, minSize: 34, maxLines: 3, style: "italic", family: body, color: "#c9d3c3", lineHeight: 1.3 });

  // The photo, big, with a soft frame. A long name or tagline makes it a bit
  // smaller, so everything stays clear of Instagram's reply bar at the bottom.
  const py = y + 50;
  const ph = Math.round(Math.max(420, Math.min(600, 1450 - py)));
  const pw = Math.round((ph * 4) / 3);
  const px = (POSTER_W - pw) / 2;
  if (photo) {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 14;
    roundRect(ctx, px, py, pw, ph, 36);
    ctx.fillStyle = "#1f3a2b";
    ctx.fill();
    ctx.restore();
    ctx.save();
    roundRect(ctx, px, py, pw, ph, 36);
    ctx.clip();
    // object-fit: cover, focused a bit above center (like the site)
    const scale = Math.max(pw / photo.naturalWidth, ph / photo.naturalHeight);
    const dw = photo.naturalWidth * scale;
    const dh = photo.naturalHeight * scale;
    ctx.drawImage(photo, px + (pw - dw) / 2, py + (ph - dh) * 0.4, dw, dh);
    ctx.restore();
    roundRect(ctx, px, py, pw, ph, 36);
    ctx.lineWidth = 7;
    ctx.strokeStyle = "rgba(143, 191, 106, 0.6)";
    ctx.stroke();
    // Sparkles hugging the photo's corners (outside it, not on any text)
    drawSparkle(ctx, px - 26, py + 30, 20, "#ffe066");
    drawSparkle(ctx, px + pw + 24, py + ph - 40, 24, "#ffe066");
    drawSparkle(ctx, px + pw + 10, py - 18, 12, "#fff4c4");
    y = py + ph;
  }

  // "with a streak of ..." and the trait words
  const runnerUp = document.getElementById("result-runnerup").textContent.trim();
  y = drawWrapped(ctx, runnerUp, { y: y + 40, size: 38, maxLines: 1, minSize: 30, family: body, color: "#8fbf6a" });

  const traits = (result.core && result.core[0]) || [];
  if (traits.length) {
    ctx.font = `600 32px ${body}`;
    const padX = 26;
    const chipH = 60;
    const gap = 16;
    const chips = traits.slice(0, 4).map((word) => ({ word, w: ctx.measureText(word).width + padX * 2 }));
    // Fit as many as possible on one centered row
    let row = chips;
    while (row.length > 1 && row.reduce((s, c) => s + c.w, 0) + gap * (row.length - 1) > 940) row = row.slice(0, -1);
    const rowW = row.reduce((s, c) => s + c.w, 0) + gap * (row.length - 1);
    let cx = (POSTER_W - rowW) / 2;
    const cy = y + 30;
    row.forEach(({ word, w }) => {
      roundRect(ctx, cx, cy, w, chipH, chipH / 2);
      ctx.fillStyle = "rgba(143, 191, 106, 0.18)";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(143, 191, 106, 0.6)";
      ctx.stroke();
      ctx.fillStyle = "#f4efe2";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(word, cx + w / 2, cy + chipH / 2 + 1);
      cx += w + gap;
    });
    y = cy + chipH;
  }

  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("no blob"))), "image/png");
    } catch (err) {
      reject(err); // e.g. opened as a file:// page, where photos "taint" the canvas
    }
  });
}

// The poster's photo comes from images/poster-photos/<type>.js: the same
// photo stored as text (made by images/make-poster-photos.ps1). Browsers
// always let a picture stored like that be saved, even when the quiz is
// opened straight from your computer, so the photo never goes missing.
function loadPosterPhoto(type) {
  return new Promise((resolve) => {
    const ready = () => window.POSTER_PHOTOS && window.POSTER_PHOTOS[type];
    if (ready()) return resolve(loadImage(ready()));
    const script = document.createElement("script");
    script.src = `images/poster-photos/${type}.js`;
    script.onload = () => resolve(ready() ? loadImage(ready()) : loadImage(RESULTS[type].image.src));
    script.onerror = () => resolve(loadImage(RESULTS[type].image.src)); // fall back to the normal photo
    document.head.appendChild(script);
  });
}

async function makeStoryPoster() {
  const photo = await loadPosterPhoto(calculateResult().ranking[0]);
  try {
    return await canvasToBlob(await drawStoryPoster(photo));
  } catch {
    return canvasToBlob(await drawStoryPoster(null)); // same poster, without the photo
  }
}

function storyFile() {
  return new File([storyBlob], "into-the-woods-story.png", { type: "image/png" });
}

function canShareImage() {
  try {
    return !!(navigator.canShare && navigator.canShare({ files: [storyFile()] }));
  } catch {
    return false;
  }
}

async function openStoryPoster(opener) {
  storyOpener = opener;
  const modal = document.getElementById("story-modal");
  const status = document.getElementById("share-status");
  status.textContent = t("story.making", "Making your poster…");

  // The link goes on Instagram's Link sticker, so copy it now
  copyText(`${shareText()} ${shareLink()}`);

  try {
    storyBlob = await makeStoryPoster();
  } catch {
    status.textContent = t("story.failed", "Couldn't make the poster on this browser. Try a screenshot instead!");
    return;
  }
  if (storyBlobUrl) URL.revokeObjectURL(storyBlobUrl);
  storyBlobUrl = URL.createObjectURL(storyBlob);

  document.getElementById("story-preview").src = storyBlobUrl;
  document.getElementById("story-save-btn").href = storyBlobUrl;
  const shareable = canShareImage();
  document.getElementById("story-share-btn").hidden = !shareable;
  document.getElementById("story-modal-tip").textContent = shareable
    ? t("story.tipShare", "Your link is copied! Tap Share, pick Instagram, then Story. Add a Link sticker and paste the link so friends can tap straight to the quiz.")
    : t("story.tipSave", "Your link is copied! Save the image, post it to your Instagram Story, then add a Link sticker and paste the link.");

  status.textContent = t("share.igstory", "Poster ready! Link copied for your Link sticker.");
  modal.hidden = false;
  document.getElementById(shareable ? "story-share-btn" : "story-save-btn").focus();
}

function closeStoryPoster() {
  const modal = document.getElementById("story-modal");
  if (modal.hidden) return;
  modal.hidden = true;
  if (storyOpener) storyOpener.focus();
}

async function shareStoryPoster() {
  const status = document.getElementById("share-status");
  try {
    // Image only: Instagram leaves itself out of the share sheet when text is added
    await navigator.share({ files: [storyFile()] });
    closeStoryPoster();
    status.textContent = t("share.done", "Shared!");
  } catch (err) {
    if (err && err.name === "AbortError") return; // they closed the sheet
    document.getElementById("story-save-btn").click(); // couldn't share: save it instead
  }
}

function wireStoryPoster() {
  const modal = document.getElementById("story-modal");
  document.getElementById("story-share-btn").addEventListener("click", shareStoryPoster);
  document.getElementById("story-close-btn").addEventListener("click", closeStoryPoster);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeStoryPoster(); // tapped the dark background
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeStoryPoster();
  });
}

// ---------------------------------------------------------
// The "All personalities" page (personalities.html)
// ---------------------------------------------------------
function showAllPersonalities(container) {
  const path = pathFromUrl();
  let yourType = null;
  if (path) {
    history = path;
    habits = habitsFromUrl();
    yourType = calculateResult().ranking[0];
    const back = document.getElementById("back-to-result");
    back.href = `index.html?${resultQuery()}&mine=1${langParam()}`;
    back.textContent = t("backToResult", "← Back to my result");
  }

  for (const type in RESULTS) {
    const result = RESULTS[type];
    const card = document.createElement("article");
    card.className = type === yourType ? "type-card type-card-you" : "type-card";
    card.id = type;

    const img = document.createElement("img");
    img.src = result.image.src;
    img.alt = result.image.alt;
    img.loading = "lazy";

    const body = document.createElement("div");
    body.className = "type-card-body";

    if (type === yourType) {
      const badge = document.createElement("span");
      badge.className = "you-badge";
      badge.textContent = t("youBadge", "You");
      body.appendChild(badge);
    }

    const name = document.createElement("h2");
    name.textContent = result.name;
    const tagline = document.createElement("p");
    tagline.className = "result-tagline";
    tagline.textContent = result.tagline;

    const traits = document.createElement("ul");
    traits.className = "traits";
    result.core[0].forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      traits.appendChild(li);
    });

    const description = document.createElement("p");
    description.className = "type-card-description";
    description.textContent = result.description;

    const credit = document.createElement("p");
    credit.className = "type-card-credit";
    credit.textContent = t("photoCredit", (text) => `Photo: ${text}`, result.image.credit);

    // Friends & foes live on their own page (friends.html?type=...)
    const kin = document.createElement("a");
    kin.className = "type-card-kin-link";
    kin.href = `friends.html?type=${type}${keepQuery()}`;
    kin.textContent = t("kinLink", "Friends and Foes →");

    body.append(name, tagline, traits, description, kin, credit);
    card.append(img, body);
    container.appendChild(card);
  }
}

// Carries your result (?path=...) and language from page to page, so the
// "You" badge and "Back to my result" keep working. Starts with "&".
function keepQuery() {
  const path = pathFromUrl();
  if (!path) return langParam();
  history = path;
  habits = habitsFromUrl();
  return `&${resultQuery()}${langParam()}`;
}

// ---------------------------------------------------------
// The "Friends and Foes" page (friends.html?type=scout)
// ---------------------------------------------------------
function showFriendsPage() {
  const asked = new URLSearchParams(window.location.search).get("type");
  const type = RESULTS[asked] ? asked : Object.keys(RESULTS)[0];
  const result = RESULTS[type];
  const query = keepQuery();

  const photo = document.getElementById("kin-photo");
  photo.src = result.image.src;
  photo.alt = result.image.alt;
  document.getElementById("kin-name").textContent = result.name;
  document.getElementById("kin-tagline").textContent = result.tagline;
  document.getElementById("kin-chapter").textContent = t("kinTitle", "Friends and Foes");
  document.title = `${t("kinTitle", "Friends and Foes")} — ${result.name}`;
  addSparkles(document.getElementById("kin-name"), 14);

  fillKin("result-friends", RELATIONS[type].friends);
  fillKin("result-foes", RELATIONS[type].foes);

  // Tap a friend or foe to see *their* friends and foes
  const others = [...RELATIONS[type].friends, ...RELATIONS[type].foes].map(([other]) => other);
  document.querySelectorAll("#friends-page .kin-card").forEach((card, i) => {
    const link = document.createElement("a");
    link.className = "kin-card kin-card-link";
    link.href = `friends.html?type=${others[i]}${query}`;
    link.append(...card.childNodes);
    card.replaceWith(link);
  });

  const back = document.getElementById("back-to-all");
  back.href = `personalities.html${query ? `?${query.slice(1)}` : ""}#${type}`;
  back.textContent = t("backToAll", "← All the personalities");
}

// Helper: turn [type, why] pairs into little photo cards
function fillKin(listId, pairs) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  pairs.forEach(([type, why]) => {
    const card = document.createElement("div");
    card.className = "kin-card";
    const img = document.createElement("img");
    img.src = RESULTS[type].image.src;
    img.alt = RESULTS[type].image.alt;
    const name = document.createElement("strong");
    name.textContent = TYPES[type];
    const detail = document.createElement("span");
    detail.className = "detail";
    detail.textContent = why;
    card.append(img, name, detail);
    list.appendChild(card);
  });
}

// Helper: turn [title, detail] pairs into <li> items
function fillList(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  items.forEach(([title, detail]) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");
    strong.textContent = title;
    const span = document.createElement("span");
    span.className = "detail";
    span.textContent = detail;
    li.append(strong, span);
    list.appendChild(li);
  });
}

// ---------------------------------------------------------
// Connect the buttons
// ---------------------------------------------------------
// script.js is shared by index.html (the quiz) and personalities.html,
// so only wire up the quiz when we're on the quiz page.
const allPersonalities = document.getElementById("all-personalities");

// KR picked? Swap in the Korean story and results (see ko.js)
applyKoreanData();

if (allPersonalities) {
  showAllPersonalities(allPersonalities);
} else if (document.getElementById("friends-page")) {
  showFriendsPage();
} else {
  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => choose(button.dataset.choice));
  });

  // Back: undo the last choice and return to the page it was made on
  document.getElementById("back-btn").addEventListener("click", () => {
    const lastChoice = history.pop();
    if (!lastChoice) return;
    const pageId = pageOfChoice(lastChoice);
    habits.back += 1; // every press counts, same question or not
    showPage(pageId);
  });

  // Name page: save the name, put it into the story, then ask the wake-up question
  const nameInput = document.getElementById("name-input");
  document.getElementById("name-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.value = "";
      nameInput.focus();
      return;
    }
    playerName = name;
    document.querySelectorAll(".player-name").forEach((el) => {
      el.textContent = LANG === "ko" ? koVocative(playerName) : playerName;
    });
    showPage("page-wake");
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    history = [];
    habits = { slow: new Set(), back: 0 };
    // Drop ?path=... so a refresh doesn't bring the old result back
    window.history.replaceState(null, "", window.location.pathname);
    document.getElementById("result-shared-note").hidden = true;
    showPage("page1");
  });

  document.getElementById("share-btn").addEventListener("click", shareResult);
  document.querySelectorAll("[data-share]").forEach((option) => {
    option.addEventListener("click", onShareOption);
  });
  wireStoryPoster();

  // Opened from a shared link (or "Back to my result")? Jump straight to that result.
  const sharedPath = pathFromUrl();
  if (sharedPath) {
    history = sharedPath;
    habits = habitsFromUrl();
    // "&mine=1" means you came back from the personalities page, so this
    // is your own result; otherwise it's a friend's shared link.
    const mine = new URLSearchParams(window.location.search).has("mine");
    document.getElementById("result-shared-note").hidden = mine;
    showResult();
  }
}
