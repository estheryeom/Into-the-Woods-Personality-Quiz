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

   ADDING A NEW CHAPTER
   - Copy a <section> in index.html, give it a new id and new data-choice keys.
   - Add those keys to ANSWERS, and point an earlier answer's "next" at it.
   ========================================================= */

// ---------------------------------------------------------
// The 10 personality types (short names for the meters)
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
};

// ---------------------------------------------------------
// Every possible answer
// ---------------------------------------------------------
const ANSWERS = {
  // ----- Page 1: which "Let's start" button? -----
  direct: {
    text: "Clicked the big button in the middle",
    points: { trailblazer: 2, scout: 1 },
    outcome: "Saturday, 7 a.m. You're first at the trailhead. Your friends show up late with iced coffees, and the trail climbs into the pines.",
    next: "page-name",
  },
  quirky: {
    text: "Clicked the small button in the top-right corner",
    points: { bard: 2, lonewolf: 1 },
    outcome: "You show up humming, in a hat nobody asked for. Your friends pretend not to know you. The trail winds into the pines.",
    next: "page-name",
  },
  reliant: {
    text: "Found the tiny button next to the big one",
    points: { tattletale: 2, medic: 1 },
    outcome: "Your friend planned everything, even the bear spray they tucked in your bag \"just in case.\" You follow the group into the pines.",
    next: "page-name",
  },
  carefree: {
    text: "Clicked the medium button at the bottom",
    points: { camper: 2, mystic: 1 },
    outcome: "Saturday morning. Bag packed in a hurry, hair still wet, you meet up with your friends at the trailhead. Whatever you forgot, you'll figure it out. Still, what a beautiful day.",
    next: "page-name",
  },

  // ----- Page 2: the bear -----
  run: {
    text: "Ran away and left your friends behind",
    points: { lonewolf: 3, survivalist: 1 },
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
    points: { trailblazer: 2, bard: 1 },
    outcome: "You bark. Your friends join in. The bear tilts its head. For one glorious second, it works. Then it charges.",
    next: "page2-5",
  },
  snacks: {
    text: "Offered the bear your snacks",
    points: { camper: 2, medic: 1 },
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
    points: { nightwatch: 2 },
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
    points: { lonewolf: 2, scout: 1 },
    outcome: "The screen flickers, shows 1%, and goes black.",
    next: "page4",
  },
  friends: {
    text: "Trusted that you could find your friends",
    points: { medic: 2, trailblazer: 1 },
    outcome: "You call their names for an hour. Nobody answers.",
    next: "page5",
  },

  // ----- Page 4: the phone dies -----
  throw: {
    text: "Threw your dead phone at the ground",
    points: { bard: 2, trailblazer: 1 },
    outcome: "The screen cracks. That felt great for two whole seconds.",
    next: "page5",
  },
  shelter: {
    text: "Decided to find shelter before dark",
    points: { survivalist: 2, scout: 1 },
    outcome: "You look for anything that could block the wind.",
    next: "page5",
  },
  retrace: {
    text: "Retraced your steps, trusting your sense of direction",
    points: { trailblazer: 2, mystic: 1 },
    outcome: "You're sure you came this way. Pretty sure.",
    next: "page5",
  },
  stay: {
    text: "Stayed right where you were so you couldn't get more lost",
    points: { scout: 2, tattletale: 1 },
    outcome: "You sit on a rock. Technically, this is what the experts say to do.",
    next: "page5",
  },

  // ----- Page 5: the fallen tree -----
  leaves: {
    text: "Shed a single tear and gathered dry leaves for a cushion",
    points: { camper: 2 },
    outcome: "Your leaf pile is cozy. Well, cozy-ish.",
    next: "page6",
  },
  fire: {
    text: "Started a fire, thanks to survival shows",
    points: { mystic: 2, trailblazer: 1 },
    outcome: "Three blisters and a lot of swearing later, you have a small, smoky fire.",
    next: "page6",
  },
  paws: {
    text: "Noticed the paw prints around the tree",
    points: { nightwatch: 2, survivalist: 1 },
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
    points: { camper: 2, bard: 1 },
    outcome: "The gum stopped tasting like anything an hour ago. Then you hear something.",
    next: "page7",
  },
  hoard: {
    text: "Secretly kept your trail mix to yourself",
    points: { lonewolf: 2, survivalist: 1 },
    outcome: "You eat it one piece at a time so the bag doesn't crinkle. Nobody's here. Then you hear something.",
    next: "page7",
  },

  // ----- Page 6.5: the mushrooms kick in -----
  listen: {
    text: "Listened to what the trees had to say",
    points: { bard: 2, mystic: 1 },
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
    points: { trailblazer: 3 },
    outcome: "You march at them, stick raised. Nothing there. And now you can't see your shelter.",
    next: "page9",
  },
  pretend: {
    text: "Pretended to be asleep",
    points: { camper: 2, bard: 1 },
    outcome: "You count to five hundred and peek. The shapes are gone. Or somewhere you can't see.",
    next: "page10",
  },

  // ----- Page 8: the voice -----
  follow: {
    text: "Followed the voice that sounded like your friend",
    points: { medic: 1, camper: 1 },
    outcome: "The voice stays just ahead of you, then stops. You're alone, and your shelter is gone.",
    next: "page9",
  },
  question: {
    text: "Tested the voice with a question only your friend would know",
    points: { scout: 2, nightwatch: 1 },
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
    points: { trailblazer: 2, survivalist: 1 },
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
    points: { nightwatch: 2 },
    outcome: "The branch cracks, and you slide back down. Something tiny falls out of a knot in the trunk and bonks you on the head.",
    next: "page-key",
  },
  bolt: {
    text: "Ran blindly into the dark",
    points: { lonewolf: 2, mystic: 1 },
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
    points: { scout: 3 },
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
    outcome: "You hold it up, and the star shines brighter, like it's happy to be found. You knew it.",
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
    points: { camper: 2, mystic: 1 },
    outcome: "\"One cheeseburger, please.\" Nothing. But the star flickers, like it's laughing at you.",
    next: "page-door",
  },

  // ----- Chapter 10: the tiny door -----
  tapwand: {
    text: "Tried the star key in the tiny door",
    points: { mystic: 2, camper: 1 },
    outcome: "It fits. Click. The door swings open, and warm light spills out, along with the smell of cinnamon toast.",
    next: "page-fairy",
  },
  pick: {
    text: "Gave up on the key and kicked the tiny door open",
    points: { trailblazer: 2, lonewolf: 1 },
    outcome: "One kick. The tiny door bangs open, and warm light spills out, along with the smell of cinnamon toast.",
    next: "page-fairy",
  },
  decoration: {
    text: "Decided the tiny door was just a decoration",
    points: { scout: 2, lonewolf: 1 },
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
    points: { scout: 2, survivalist: 1 },
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
    points: { bard: 2, mystic: 1 },
    outcome: "He teaches you a spell for finding lost things. You spin three times, feeling ridiculous, and stop facing a porch light. \"HEY! We've got one!\"",
    next: "page11",
  },
  stayhere: {
    text: "Asked the fairy if you could stay",
    points: { camper: 2, lonewolf: 1 },
    outcome: "\"Absolutely not. You'd track mud everywhere.\" He gives you a thimble of tea that warms you to your toes, then points past you. \"Your ride's here.\"",
    next: "page11",
  },

  // ----- Page 11: rescued -----
  blame: {
    text: "Told the ranger the hike was your friend's idea",
    points: { tattletale: 3 },
    next: "result",
  },
  askfriends: {
    text: "Asked if your friends were okay",
    points: { medic: 2 },
    next: "result",
  },
  handled: {
    text: "Insisted you had it handled",
    points: { lonewolf: 2, trailblazer: 1 },
    next: "result",
  },
  food: {
    text: "Asked if there was any food",
    points: { camper: 1, survivalist: 1 },
    next: "result",
  },
};

// ---------------------------------------------------------
// Extra story lines that depend on your WHOLE path, not just
// your last answer. Each function returns a list of sentences
// to show after the last answer's outcome.
// ---------------------------------------------------------
const STORY_EXTRAS = {
  page6: () => [
    picked("snacks") && "You miss your gummy worms. Worth it? Unclear.",
  ],

  page8: () => [
    picked("birdcall") && "Somewhere in the dark, something does your bird call. Perfectly. A little too perfectly.",
    ateMushrooms() && "The trees are breathing slower now, like they're listening too.",
  ],

  page11: () => {
    const lines = [];

    const openedDoor = visited("page-fairy");

    // Where was the ranger station?
    if (openedDoor) {
      lines.push("\"You were forty feet from our station all night,\" the ranger says. You don't mention the fairy.");
    } else if (picked("lightright")) {
      lines.push("The ranger points at a porch light through the trees: the ranger station, forty feet away. \"You were headed right for it.\"");
    } else if (visited("page9")) {
      lines.push("Right behind your fallen tree, through the branches, is the ranger station's porch light. Forty feet away. If only you'd gone right.");
    } else {
      lines.push("Past your fallen tree, a porch light glows: the ranger station, forty feet away. \"Staying put was the right call,\" the ranger says.");
    }

    // How did they find you?
    if (picked("sing")) lines.push("\"We heard you singing from the parking lot. All of it.\"");
    if (picked("sos")) lines.push("\"Nice SOS. Who drew the smiley face?\"");

    // What were the shadows?
    if (ateMushrooms()) {
      lines.push("She eyes the purple stains on your fingers. \"Did you eat the mushrooms? Okay. Medic's coming.\" The shapes in the trees? \"Buddy, those are trees.\"");
    } else if (visited("page8")) {
      lines.push("\"Your friends found the station hours ago.\" You ask who was calling your name out there. She stops smiling. \"Nobody from our team.\"");
    } else {
      lines.push("The tall shapes in the trees? \"Probably deer,\" the ranger says. She doesn't sound sure.");
    }

    // Little callbacks
    if (picked("fire")) lines.push("\"Also, please never start a fire out here again.\"");
    if (picked("ration")) lines.push("You offer the ranger your last third of granola bar. She declines.");
    if (picked("hoard")) lines.push("Your secret trail mix crinkles in your pocket. You say nothing.");

    // The tiny door: a little surprise, or a little regret
    if (openedDoor) {
      if (ateMushrooms()) lines.push("You tell the ranger about the fairy. She looks at your purple fingers. \"Sure, bud.\"");
      if (picked("pick")) {
        lines.push("In your pocket, where the key was, there's a note smaller than a stamp: \"Thanks for the key. You owe me a door. — F.\"");
      } else {
        lines.push("In your pocket, where the key was, there's a note smaller than a stamp: \"Thanks for the key. I haven't seen a human dance in a while. — F.\"");
      }
    } else {
      lines.push("As you leave, the tiny door opens a crack. A fairy with a lantern gives you a small, disappointed wave. He could have walked you out hours ago.");
      lines.push("You reach for the key in your pocket. It's gone.");
    }

    return lines;
  },
};

// ---------------------------------------------------------
// The 10 results
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
};

// ---------------------------------------------------------
// Quiz state: the list of choices the player has made
// ---------------------------------------------------------
let history = [];
let playerName = ""; // typed on the name page, used when the voice calls you

// ---------------------------------------------------------
// HOW you answer counts too, not just what you pick:
//   - Taking more than 1 min 30 sec on a question = indecisiveness.
//     Each slow question adds +0.5 to the Night Watch (overthinking) and
//     +0.5 to the Happy Camper (putting off decisions), up to 3 questions.
//   - Pressing "back" on more than 3 different questions = second-guessing.
//     That adds +0.5 to the Survivalist (anxious, extra careful) and +0.5 to
//     the Night Watch (overthinking). Going back on the same question again
//     only counts once.
// These are small nudges on top of your answers. They can't outvote them.
// ---------------------------------------------------------
const SLOW_MS = 90 * 1000;
const MAX_SLOW_COUNTED = 3;
const SLOW_POINTS = { nightwatch: 0.5, camper: 0.5 };
const BACK_LIMIT = 3; // more than this many questions = second-guesser
const BACK_POINTS = { survivalist: 0.5, nightwatch: 0.5 };

let habits = { slow: new Set(), back: new Set() }; // page ids
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
  return habits.back.size > BACK_LIMIT;
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

  const lastAnswer = ANSWERS[history[history.length - 1]];
  const lines = [];
  if (lastAnswer && lastAnswer.outcome) lines.push(lastAnswer.outcome);
  if (STORY_EXTRAS[pageId]) lines.push(...STORY_EXTRAS[pageId]().filter(Boolean));

  storyBox.innerHTML = "";
  lines.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    storyBox.appendChild(p);
  });
  storyBox.hidden = lines.length === 0;
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
    "A tiny fairy stands in the splintered doorway, in an acorn cap and a maple-leaf cardigan, holding what's left of his hinge. \"That was my DOOR.\" Then he spots the star key in your pocket, and his glare wobbles. \"...You found my key. Thank you, I suppose.\" He crosses his arms. \"Rules are rules. I still owe you one favor. Don't be weird about it.\" What do you ask for?",
};

function fillQuestion(pageId) {
  const heading = document.querySelector(`#${CSS.escape(pageId)} .question`);
  if (!heading) return;
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
// Friends & foes: who each type gets along with (and who drives
// them up a tree), based on their core traits.
//   [type, why] — the type's photo comes from RESULTS
// ---------------------------------------------------------
const RELATIONS = {
  scout: {
    friends: [
      ["survivalist", "Finally, someone else who packed the backup batteries."],
      ["medic", "You run the plan, they keep everyone in one piece. Dream team."],
    ],
    foes: [
      ["mystic", "Every plan you make, they snack their way off of it."],
      ["lonewolf", "Your group itinerary is, to them, a suggestion for other people."],
    ],
  },
  survivalist: {
    friends: [
      ["scout", "You both trust preparation over luck. Your packs weigh the same."],
      ["nightwatch", "They spot the danger, you already have the gear for it."],
    ],
    foes: [
      ["camper", "Brought a hammock and zero snacks. Expects to share yours."],
      ["mystic", "You ration. They eat whatever grows on a log."],
    ],
  },
  nightwatch: {
    friends: [
      ["survivalist", "You notice the problem, they've already got a plan for it."],
      ["tattletale", "Two sets of eyes that miss nothing. Nobody gets away with anything."],
    ],
    foes: [
      ["bard", "You're trying to listen for footsteps. They're singing."],
      ["trailblazer", "They charge ahead before you've finished reading the room."],
    ],
  },
  trailblazer: {
    friends: [
      ["lonewolf", "Neither of you waits for permission. You just go."],
      ["mystic", "Always up for anything, and they actually keep up."],
    ],
    foes: [
      ["camper", "You want the summit. They want a nap at the bottom."],
      ["nightwatch", "Every time you move, they want to \"think about it first.\""],
    ],
  },
  lonewolf: {
    friends: [
      ["trailblazer", "They get it: freedom first, questions later."],
      ["camper", "Easygoing company that never asks where you're going."],
    ],
    foes: [
      ["tattletale", "You wander off for five minutes and they file a missing-person report."],
      ["scout", "They want a buddy system. You are the buddy system."],
    ],
  },
  bard: {
    friends: [
      ["camper", "The best audience a storyteller could ask for."],
      ["mystic", "They give you the wildest material for your next story."],
    ],
    foes: [
      ["nightwatch", "Shushes you right before the best part."],
      ["tattletale", "Fact-checks your story while you're still telling it."],
    ],
  },
  mystic: {
    friends: [
      ["bard", "They turn your strangest moments into legends."],
      ["trailblazer", "Says yes to every adventure, just like you."],
    ],
    foes: [
      ["scout", "Has a printed schedule. You have vibes."],
      ["survivalist", "Won't share snacks and hides the mushrooms from you."],
    ],
  },
  medic: {
    friends: [
      ["scout", "They keep the group organized, you keep the group okay."],
      ["camper", "Warm, gentle and kind, your kind of people."],
    ],
    foes: [
      ["lonewolf", "Refuses help, then shows up with a sprained ankle."],
      ["mystic", "You've treated them for \"just one bite\" three times this trip."],
    ],
  },
  tattletale: {
    friends: [
      ["nightwatch", "They see everything, and you make sure it gets reported."],
      ["scout", "Finally, someone who respects the rules as much as you do."],
    ],
    foes: [
      ["lonewolf", "Breaks every rule, then disappears before you can write it down."],
      ["bard", "That's not what happened and you both know it."],
    ],
  },
  camper: {
    friends: [
      ["bard", "Campfire stories and good vibes, all night long."],
      ["lonewolf", "Neither of you needs to talk. It's nice."],
    ],
    foes: [
      ["trailblazer", "Keeps saying \"just one more mile\" like that's a good thing."],
      ["survivalist", "Turns a relaxing night into a disaster drill."],
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
  document.getElementById("result-runnerup").textContent = `with a streak of ${TYPES[ranking[1]]}`;
  document.getElementById("result-description").textContent = result.description;

  const photo = document.getElementById("result-photo");
  photo.src = result.image.src;
  photo.alt = result.image.alt;
  document.getElementById("result-photo-credit").textContent = `Photo: ${result.image.credit}`;

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
  document.getElementById("all-types-link").href = `personalities.html?${resultQuery()}`;
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
  if (habits.back.size) query += `&back=${habits.back.size}`;
  return query;
}

// Read &slow=N&back=N from a shared link
function habitsFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const count = (name) => Math.min(Math.max(parseInt(params.get(name), 10) || 0, 0), 50);
  const fake = (n) => new Set(Array.from({ length: n }, (_, i) => `shared-${i}`));
  return { slow: fake(count("slow")), back: fake(count("back")) };
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
      `You spent more than a minute and a half on ${slow} question${slow === 1 ? "" : "s"}. ` +
      "When there's no obvious right answer, you stall: weighing, re-reading, waiting to feel sure. " +
      "That nudged your Night Watch (overthinking) and Happy Camper (putting off decisions) scores up a little."
    );
  }
  const back = habits.back.size;
  if (back) {
    const note = `You went back and reconsidered ${back} question${back === 1 ? "" : "s"}.`;
    notes.push(
      isSecondGuesser()
        ? `${note} Second-guessing yourself that often usually comes from being afraid of getting it wrong. That nudged your Survivalist (anxious, extra careful) and Night Watch (overthinking) scores up a little.`
        : `${note} Changing your mind a few times is just being thoughtful, so it didn't affect your result.`
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
  url.search = `?${resultQuery()}`;
  url.hash = "";
  return url.toString();
}

// Read ?path=... from the address bar. Returns the list of answers only if
// it's a real, complete run through the quiz; otherwise null.
function pathFromUrl() {
  const raw = new URLSearchParams(window.location.search).get("path");
  if (!raw) return null;
  const keys = raw.split(".");
  if (!keys.every((key) => Object.hasOwn(ANSWERS, key))) return null;
  if (ANSWERS[keys[keys.length - 1]].next !== "result") return null;
  return keys;
}

function shareText() {
  const name = RESULTS[calculateResult().ranking[0]].name;
  return `I got ${name} in the Into the Woods personality quiz! Which one are you?`;
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
  status.textContent = ok ? successMessage : `Copy this link to share: ${url}`;
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
  await copyShareLink("Link copied! Paste it anywhere, or pick an app below.");
}

// Every option copies the link too, so it's ready to paste wherever it opens.
// (Instagram has no way to pre-fill a message, so pasting is the only way.)
function onShareOption(event) {
  const messages = {
    copy: "Link copied! Paste it to your friends.",
    sms: "Link copied! Opening your messages…",
    whatsapp: "Link copied! Opening WhatsApp…",
    messenger: "Link copied! Paste it into a Messenger chat.",
    instagram: "Link copied! Paste it into an Instagram DM.",
  };
  copyShareLink(messages[event.currentTarget.dataset.share]);
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
    back.href = `index.html?${resultQuery()}&mine=1`;
    back.textContent = "← Back to my result";
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
      badge.textContent = "You";
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
    credit.textContent = `Photo: ${result.image.credit}`;

    body.append(name, tagline, traits, description, credit);
    card.append(img, body);
    container.appendChild(card);
  }
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

if (allPersonalities) {
  showAllPersonalities(allPersonalities);
} else {
  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => choose(button.dataset.choice));
  });

  // Back: undo the last choice and return to the page it was made on
  document.getElementById("back-btn").addEventListener("click", () => {
    const lastChoice = history.pop();
    if (!lastChoice) return;
    const pageId = pageOfChoice(lastChoice);
    habits.back.add(pageId); // each question counts once, however many times you go back
    showPage(pageId);
  });

  // Name page: save the name, put it into the story, then start chapter 1
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
      el.textContent = playerName;
    });
    showPage("page2");
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    history = [];
    habits = { slow: new Set(), back: new Set() };
    // Drop ?path=... so a refresh doesn't bring the old result back
    window.history.replaceState(null, "", window.location.pathname);
    document.getElementById("result-shared-note").hidden = true;
    showPage("page1");
  });

  document.getElementById("share-btn").addEventListener("click", shareResult);
  document.querySelectorAll("[data-share]").forEach((option) => {
    option.addEventListener("click", onShareOption);
  });

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
