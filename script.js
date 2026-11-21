/* =========================================================
   Into the Woods — quiz logic

   HOW IT WORKS
   1. Every button in index.html has a data-choice, like "run".
   2. ANSWERS (below) says what each choice means:
        - text:    how the choice is described on the results page
        - trait:   the personality hint shown on the results page
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
    trait: "Straightforward and direct",
    points: { trailblazer: 2, scout: 1 },
    outcome: "Saturday, 7 a.m. You're the first one at the trailhead, boots laced and ready to go. Your friends roll up twenty minutes late, holding iced coffees. The trail climbs into thick pine woods, and an hour in, nobody is talking much anymore.",
    next: "page2",
  },
  quirky: {
    text: "Clicked the small button in the top-right corner",
    trait: "A little aloof and quirky",
    points: { bard: 2, lonewolf: 1 },
    outcome: "You show up to the trailhead in a hat nobody asked for, already humming something. Your friends pretend not to know you. The trail winds into thick pine woods, and soon the parking lot is far behind you.",
    next: "page2",
  },
  reliant: {
    text: "Found the tiny button next to the big one",
    trait: "Relies on other people",
    points: { medic: 2, tattletale: 1 },
    outcome: "Your friend planned the whole trip: the route, the snacks, even the bear spray, which they tucked into your bag \"just in case.\" All you had to do was show up. The trail winds into thick pine woods, and you follow the group.",
    next: "page2",
  },
  carefree: {
    text: "Clicked the medium button at the bottom",
    trait: "Carefree",
    points: { camper: 2, mystic: 1 },
    outcome: "You said yes to this hike about four minutes before it started. No water bottle, no plan, flip-flops in your bag just in case. The trail winds into thick pine woods, and honestly? It's a beautiful day.",
    next: "page2",
  },

  // ----- Page 2: the bear -----
  run: {
    text: "Ran away and left your friends behind",
    trait: "Logistics matter to you. Very pragmatic.",
    points: { lonewolf: 3, survivalist: 1 },
    outcome: "You sprint without looking back. Branches whip your face, your lungs burn, and you don't stop until the yelling behind you fades. When you finally turn around, there's no bear. There's also no trail.",
    next: "page3",
  },
  small: {
    text: "Made yourself small, hoping the bear wouldn't see you",
    trait: "Very careful, but a bit cowardly",
    points: { nightwatch: 2, camper: 1 },
    outcome: "You crouch behind a bush and hold your breath. The bear sniffs the air, huffs and lumbers off. When you finally stand up, your legs are numb, and your friends are nowhere in sight. They must have run.",
    next: "page3",
  },
  bark: {
    text: "Barked, and got your friends to bark too",
    trait: "A leader, but without much of a plan",
    points: { trailblazer: 2, bard: 1 },
    outcome: "You bark. Your friends stare at you, then start barking too, a little unsure. The bear tilts its head. For one glorious second, it works. Then it charges.",
    next: "page2-5",
  },
  snacks: {
    text: "Offered the bear your snacks",
    trait: "Idealistic, and maybe a little naive",
    points: { medic: 1, camper: 1, mystic: 1 },
    outcome: "You hold out your bag of gummy worms with a shaky hand. The bear eats the whole thing, bag and all. Then it looks at you like you're dessert.",
    next: "page2-5",
  },

  // ----- Page 2.5: which way do you run? -----
  straight: {
    text: "Ran straight ahead without looking back",
    trait: "Doesn't hold a grudge (or just forgets)",
    points: { camper: 2 },
    outcome: "You run until your legs give out. When you finally stop and look back, there's nothing behind you but trees.",
    next: "page3",
  },
  left: {
    text: "Turned left",
    trait: "Imaginative and creative",
    points: { bard: 2 },
    outcome: "You veer left, crash through a wall of ferns and tumble down a little slope. When you climb back up, you can't tell which way you came from.",
    next: "page3",
  },
  right: {
    text: "Turned right",
    trait: "Makes logical decisions",
    points: { scout: 2 },
    outcome: "You cut right and keep running until the crashing behind you fades away. You stop, gasping, and listen. Nothing. No bear. No friends either.",
    next: "page3",
  },
  help: {
    text: "Turned around to help your friends",
    trait: "Idealistic, almost to the point of delusion",
    points: { medic: 3 },
    outcome: "You spin around and blast the bear spray. Most of it hits the bear. Some of it hits you. By the time you can see again, the bear is gone, and so is everyone else.",
    next: "page3",
  },

  // ----- Page 3: lost in the woods -----
  phone: {
    text: "Kept using your dying phone to find a way out",
    trait: "Anxious, but pragmatic",
    points: { survivalist: 1, nightwatch: 1 },
    outcome: "You hold the power button. The screen flickers, shows 1%, and goes black.",
    next: "page4",
  },
  friends: {
    text: "Trusted that you could find your friends",
    trait: "Brave and courageous",
    points: { medic: 1, trailblazer: 1 },
    outcome: "You walk for an hour, calling their names. Nobody answers. The trees all start to look the same.",
    next: "page5",
  },

  // ----- Page 4: the phone dies -----
  throw: {
    text: "Threw your dead phone at the ground",
    trait: "Easy to anger, anxious, and a little selfish",
    points: { lonewolf: 2, nightwatch: 1 },
    outcome: "The screen cracks. That felt great for about two seconds.",
    next: "page5",
  },
  shelter: {
    text: "Decided to find shelter before dark",
    trait: "Risk-averse. Sometimes you gotta take risks, and since you don't, you regret things easily. But you're often right.",
    points: { survivalist: 2, nightwatch: 1 },
    outcome: "You start scanning the woods for anything that could keep the wind off.",
    next: "page5",
  },
  retrace: {
    text: "Retraced your steps, trusting your sense of direction",
    trait: "Overzealous, but with great luck and intuition (you've made it this far). You give a lot of second chances.",
    points: { trailblazer: 1, mystic: 1, medic: 1 },
    outcome: "You're sure you came this way. Pretty sure. You keep walking anyway.",
    next: "page5",
  },
  stay: {
    text: "Stayed right where you were so you couldn't get more lost",
    trait: "Lazy, but smart",
    points: { camper: 2, survivalist: 1 },
    outcome: "You sit down on a rock. Technically, this is what the experts tell you to do.",
    next: "page5",
  },

  // ----- Page 5: the fallen tree -----
  leaves: {
    text: "Shed a single tear and gathered dry leaves for a cushion",
    trait: "Resourceful, but often has shallow thoughts",
    points: { camper: 1, survivalist: 1 },
    outcome: "Your leaf pile is surprisingly cozy. Well, cozy-ish. You curl up against the trunk as the last of the light disappears.",
    next: "page6",
  },
  fire: {
    text: "Started a fire, thanks to survival shows",
    trait: "You watch YouTube videos and call them documentaries",
    points: { mystic: 2, trailblazer: 1 },
    outcome: "Forty-five minutes, three blisters and a lot of swearing later, you have a small, smoky fire. The YouTube guy made it look a lot easier.",
    next: "page6",
  },
  paws: {
    text: "Noticed the paw prints around the tree",
    trait: "Very thorough. The friend who plans and organizes the events and trips.",
    points: { scout: 2, nightwatch: 1 },
    outcome: "You decide the paw prints are old (you hope), and you clear a spot on the far side of the trunk where you can see anything coming.",
    next: "page6",
  },
  birdcall: {
    text: "Used your friend group's weird bird call: \"BAKAAAH BAKAAAH\"",
    trait: "You don't care about consequences. It's your way or the highway.",
    points: { trailblazer: 2, bard: 1 },
    outcome: "Your bird call echoes through the trees. Nothing answers. You settle in beside the trunk to wait.",
    next: "page6",
  },

  // ----- Page 6: hungry and thirsty -----
  ration: {
    text: "Rationed the granola bar and water you packed",
    trait: "Prepared for the worst. Future you is always grateful.",
    points: { scout: 2, survivalist: 2 },
    outcome: "You eat exactly one third of the granola bar and take three small sips of water. Then you hear it.",
    next: "page7",
  },
  forage: {
    text: "Ate random berries and mushrooms because of a reel",
    trait: "Very confident in knowledge from the internet",
    points: { mystic: 3 },
    outcome: "The berries are sour. The mushrooms taste like a basement. You eat them anyway.",
    next: "page6-5",
  },
  gum: {
    text: "Chewed your last piece of gum and called it dinner",
    trait: "Makes the best of whatever's there",
    points: { camper: 2, bard: 1 },
    outcome: "You chew that gum for a long, long time. It stopped tasting like anything an hour ago. Then you hear it.",
    next: "page7",
  },
  hoard: {
    text: "Secretly kept your trail mix to yourself",
    trait: "Looks out for number one",
    points: { lonewolf: 2, survivalist: 1 },
    outcome: "You eat your trail mix in the dark, one piece at a time, so nobody hears the bag crinkle. Not that anyone's here. Then you hear it.",
    next: "page7",
  },

  // ----- Page 6.5: the mushrooms kick in -----
  listen: {
    text: "Listened to what the trees had to say",
    trait: "Wildly imaginative, open to anything",
    points: { bard: 2, mystic: 1 },
    outcome: "The trees have a lot to say, mostly about you. You nod along. Then the trees go quiet, all at once.",
    next: "page7",
  },
  purge: {
    text: "Made yourself throw up the mushrooms",
    trait: "Admits a mistake fast and fixes it",
    points: { survivalist: 2 },
    outcome: "You get most of it out. You feel awful, but a little more like yourself. Mostly.",
    next: "page7",
  },
  carve: {
    text: "Carved a note blaming the influencer",
    trait: "Makes sure everyone knows whose fault it was",
    points: { tattletale: 3 },
    outcome: "You carve it with a rock in big, shaky letters. If anyone finds it, at least they'll know who to blame.",
    next: "page7",
  },
  more: {
    text: "Ate more mushrooms, for science",
    trait: "Doubles down. Always.",
    points: { mystic: 3 },
    outcome: "For science. The forest gets much, much louder. You're no longer sure what's real.",
    next: "page7",
  },

  // ----- Page 7: shadows -----
  callout: {
    text: "Called out to the shadows, hoping they were your friends",
    trait: "Hopes for the best in everyone",
    points: { medic: 2 },
    outcome: "Your voice cracks. The shapes don't move. For a long moment, nothing answers.",
    next: "page8",
  },
  freeze: {
    text: "Froze and gripped the bear spray",
    trait: "Watches first, acts later",
    points: { nightwatch: 2, survivalist: 1 },
    outcome: "You stop breathing. Your thumb finds the trigger on the bear spray. The shapes don't move either.",
    next: "page8",
  },
  stick: {
    text: "Grabbed a stick and walked straight at the shadows",
    trait: "Faces fear head-on",
    points: { trailblazer: 3 },
    outcome: "You march right at them, stick raised. When you get there... nothing. Just more trees. And when you turn around, you can't see your shelter anymore.",
    next: "page9",
  },
  pretend: {
    text: "Pretended to be asleep",
    trait: "If you ignore a problem, maybe it'll leave",
    points: { camper: 2, nightwatch: 1 },
    outcome: "You squeeze your eyes shut and count to five hundred. When you finally peek, the shapes are gone. Or they moved somewhere you can't see.",
    next: "page10",
  },

  // ----- Page 8: the voice -----
  follow: {
    text: "Followed the voice that sounded like your friend",
    trait: "Trusts people, maybe too much",
    points: { medic: 2, camper: 1 },
    outcome: "The voice keeps moving, always just ahead of you, always just out of sight. Then it stops. Silence. You're alone, and your shelter is nowhere to be seen.",
    next: "page9",
  },
  question: {
    text: "Tested the voice with a question only your friend would know",
    trait: "Trust, but verify",
    points: { scout: 2, nightwatch: 1 },
    outcome: "\"What's the name of our group chat?\" Silence. Then, right behind your ear, in your friend's voice: \"Come here.\" You run.",
    next: "page9",
  },
  nicetry: {
    text: "Told the voice \"Nice try\" and stayed put",
    trait: "Not easily fooled",
    points: { survivalist: 2, lonewolf: 1 },
    outcome: "The voice keeps calling your name for almost an hour. Then, all at once, it stops.",
    next: "page10",
  },
  telling: {
    text: "Threatened to tell the park ranger on the voice",
    trait: "Authority is your weapon of choice",
    points: { tattletale: 3 },
    outcome: "The voice goes quiet. Then it laughs, low and long. Then the woods are completely silent. Apparently, it worked.",
    next: "page10",
  },

  // ----- Page 9: out in the dark -----
  lightright: {
    text: "Headed right, toward a faint light",
    trait: "Great instincts. Follows the right hunch.",
    points: { scout: 1, trailblazer: 1, mystic: 1 },
    outcome: "The light gets brighter with every step. You push through one last bush, and a flashlight hits you square in the face. \"HEY! We've got one!\" It's a search and rescue team, gearing up to go look for you. Behind them, a porch light glows on a little wooden building: the park ranger station. You found it yourself.",
    next: "page11",
  },
  water: {
    text: "Followed the sound of running water",
    trait: "Knows the basics of staying alive",
    points: { survivalist: 2 },
    outcome: "You slide down a muddy bank toward the sound. Just as you reach the creek, a flashlight beam swings across the water and lands right on your face. \"Don't move! Search and rescue!\"",
    next: "page11",
  },
  climb: {
    text: "Climbed a tree to look around",
    trait: "Gets the big picture before moving",
    points: { nightwatch: 2, bard: 1 },
    outcome: "Halfway up the tree, a flashlight beam finds you. Someone below calls out, \"Uh... are you stuck up there?\" It's a search and rescue team.",
    next: "page11",
  },
  bolt: {
    text: "Ran blindly into the dark",
    trait: "Gets out first, asks questions later",
    points: { lonewolf: 2, nightwatch: 1 },
    outcome: "You sprint through the dark and slam straight into someone's chest. A flashlight clicks on, right in your face. \"Whoa, whoa! Search and rescue! You're okay!\"",
    next: "page11",
  },

  // ----- Page 10: the longest night -----
  watch: {
    text: "Stayed up on watch all night",
    trait: "Always on guard",
    points: { nightwatch: 3 },
    outcome: "Hours pass. Every snapped twig makes you flinch. Then, sometime before dawn, a light sweeps across the trees and stops on your face. \"Found 'em!\"",
    next: "page11",
  },
  sing: {
    text: "Sang every song you know, loudly",
    trait: "Fights fear with noise and personality",
    points: { bard: 2, trailblazer: 1 },
    outcome: "You're on your fourth chorus when a flashlight beam hits you in the face. \"We could hear you from the parking lot,\" a voice says. It's search and rescue.",
    next: "page11",
  },
  sleep: {
    text: "Curled up and went to sleep",
    trait: "Can rest through anything",
    points: { camper: 3 },
    outcome: "You wake up to a flashlight shining straight into your eyes. \"Hey. Hey! Are you okay?\" Search and rescue has found you, drooling on a tree.",
    next: "page11",
  },
  sos: {
    text: "Spelled out SOS with sticks and rocks",
    trait: "Does the smart thing, even when scared",
    points: { scout: 3 },
    outcome: "You're placing the last rock on your giant SOS when a flashlight lands on your face. \"Nice work,\" a ranger says. \"We spotted that from the trail.\"",
    next: "page11",
  },

  // ----- Page 11: rescued -----
  blame: {
    text: "Told the ranger the hike was your friend's idea",
    trait: "Makes sure the record is accurate",
    points: { tattletale: 3 },
    next: "result",
  },
  askfriends: {
    text: "Asked if your friends were okay",
    trait: "Thinks of others first, even now",
    points: { medic: 2 },
    next: "result",
  },
  handled: {
    text: "Insisted you had it handled",
    trait: "Never admits needing help",
    points: { lonewolf: 2, trailblazer: 1 },
    next: "result",
  },
  food: {
    text: "Asked if there was any food",
    trait: "Priorities: correct",
    points: { camper: 2, mystic: 1 },
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
    picked("snacks") && "You think about the snacks you handed to the bear. Worth it? Unclear.",
  ],

  page8: () => [
    picked("birdcall") && "Somewhere in the dark, something does your bird call. \"BAKAAAH. BAKAAAH.\" Perfectly. A little too perfectly.",
    ateMushrooms() && "The trees around you are breathing slower now, like they're listening too.",
  ],

  page11: () => {
    const lines = [];

    // Where was the ranger station?
    if (picked("lightright")) {
      lines.push("A ranger looks you over. \"You were about forty feet from this station the whole night. You must have walked right past it.\"");
    } else if (visited("page9")) {
      lines.push("On the walk back, the ranger points at the fallen tree where you made your shelter. Just behind it, through a gap in the branches, is the porch light of the park ranger station. Forty feet away. If you'd headed right, toward the light, you would have walked straight into it.");
    } else {
      lines.push("The ranger helps you up and points past your fallen tree. Through a gap in the branches, you can see a porch light: the park ranger station. It was forty feet away the whole night. \"Staying put was the right call,\" she says. \"People who wander off usually end up a lot farther away.\"");
    }

    // What were the shadows?
    if (ateMushrooms()) {
      lines.push("She notices the purple stains on your fingers. \"Did you eat those berries? And... the mushrooms? Okay. We're having the medic take a look at you.\" And the figures you saw at the edge of the trees? \"Buddy, those are just trees.\"");
    } else if (visited("page8")) {
      lines.push("\"Your friends are fine, by the way. They found the station hours ago.\" You ask who was calling your name out there, in your friend's voice. The ranger stops smiling. \"Nobody from our team went out until twenty minutes ago.\"");
    } else {
      lines.push("And the tall figures at the edge of the trees? The ranger shrugs. \"Probably deer.\" She doesn't sound sure.");
    }

    // Little callbacks
    if (picked("fire")) lines.push("\"Also, please never start a fire out here again.\"");
    if (picked("ration")) lines.push("You still have a third of your granola bar. You offer it to the ranger. She politely declines.");
    if (picked("hoard")) lines.push("Your secret trail mix crinkles in your pocket. You say nothing.");

    return lines;
  },
};

// ---------------------------------------------------------
// The 10 results
// ---------------------------------------------------------
const RESULTS = {
  scout: {
    name: "The Eagle Scout",
    tagline: "Has a laminated map. Has a backup laminated map.",
    description:
      "You're the one who plans the trip, writes the packing list, and knows exactly where the first-aid kit is. In a crisis you don't panic, you organize. Rules and routines aren't boring to you; they're how everyone gets home in one piece. People rely on you, and quietly, you like being relied on.",
    strengths: ["Organized and thorough", "Calm, step-by-step problem-solver", "Dependable when it counts"],
    watchouts: ["Gets frustrated when people ignore the plan", "Can be rigid when the plan stops working", "Takes on everyone else's responsibilities"],
    mbti: ["ESTJ", "Practical, structured and decisive. Likes clear plans, clear roles and getting things done the proven way."],
    enneagram: ["Type 3, The Achiever", "Motivated by being capable and doing well. Every merit badge counts."],
    bigFive: "High Conscientiousness, high Extraversion",
  },
  survivalist: {
    name: "The Survivalist",
    tagline: "Hopes for the best. Packs for the worst.",
    description:
      "You've already imagined everything that could go wrong, which is exactly why you're still standing. You trust preparation over luck and supplies over promises. You can come across as cautious or even pessimistic, but when things fall apart, you're the one with water, a charger and a plan B.",
    strengths: ["Prepared for almost anything", "Practical and resourceful", "Not easily fooled"],
    watchouts: ["Expects the worst, even when things are fine", "Has trouble trusting new people", "Can regret the risks you never took"],
    mbti: ["ISTJ", "Responsible, careful and loyal to what has worked before. Trusts facts and experience over hype."],
    enneagram: ["Type 6, The Loyalist", "Security-minded. Scans for risks, prepares for them, and is fiercely loyal once trust is earned."],
    bigFive: "High Conscientiousness, moderate Neuroticism (the useful kind of worry)",
  },
  nightwatch: {
    name: "The Night Watch",
    tagline: "Noticed the paw prints. Noticed the shadows. Noticed you noticing.",
    description:
      "You see what other people miss: the change in someone's tone, the snapped branch, the detail that doesn't add up. You'd rather watch quietly from the edge than charge in, and you take in a lot before you act. Your gut is usually right, even if it keeps you up at night.",
    strengths: ["Highly observant", "Reads people and situations well", "Thinks before acting"],
    watchouts: ["Overthinks until it becomes anxiety", "Holds back when you should speak up", "Can wear yourself out staying on guard"],
    mbti: ["INFJ", "Insightful and perceptive, with a strong sense for what's going on beneath the surface."],
    enneagram: ["Type 5, The Investigator", "Observes before engaging, saves energy, and wants to understand something before acting on it."],
    bigFive: "High Openness, low Extraversion, higher Neuroticism",
  },
  trailblazer: {
    name: "The Trailblazer",
    tagline: "No path? Great. Now there is.",
    description:
      "You don't wait for permission, and you don't wait for a plan. When everyone else freezes, you're already moving, and people follow because you look like you know where you're going. You're direct, competitive and protective of your crew. Your confidence is your biggest strength, and occasionally your biggest problem.",
    strengths: ["Takes charge in a crisis", "Brave and decisive", "Protective of your people"],
    watchouts: ["Leaps before looking", "\"My way or the highway\"", "Hates admitting you were wrong"],
    mbti: ["ENTJ", "Bold, strategic and a natural commander. Sees the goal and goes straight at it."],
    enneagram: ["Type 8, The Challenger", "Strong-willed and protective. Would rather take control than feel controlled."],
    bigFive: "High Extraversion, low Agreeableness, low Neuroticism",
  },
  lonewolf: {
    name: "The Lone Wolf",
    tagline: "Didn't get lost. Went solo.",
    description:
      "You trust yourself more than anyone else, and honestly, your track record backs that up. You'd rather handle things alone than wait for a group to agree. You keep your cards close and your snacks closer, and you don't apologize for putting your own survival first.",
    strengths: ["Self-reliant", "Cool under pressure", "Doesn't need anyone's approval"],
    watchouts: ["Can leave people behind (sometimes with a bear)", "Hard for people to get close to", "Rarely asks for help, even when you need it"],
    mbti: ["ISTP", "Independent and hands-on. Solves problems in the moment and values freedom above almost everything."],
    enneagram: ["Type 5, The Investigator", "Self-sufficient and private. Guards your time, energy and resources."],
    bigFive: "Low Agreeableness, low Extraversion",
  },
  bard: {
    name: "The Campfire Bard",
    tagline: "Got lost in the woods. Got a great story out of it.",
    description:
      "You turn every disaster into a story, and everyone wants to sit next to you at the campfire. You think in pictures and possibilities, and you'd rather take the interesting path than the correct one. Life with you is never boring, though it's rarely on schedule.",
    strengths: ["Creative and imaginative", "Lifts the mood in bad situations", "Sees possibilities others don't"],
    watchouts: ["Gets distracted from what actually matters", "Can feel misunderstood", "Struggles with boring but necessary tasks"],
    mbti: ["ENFP", "Imaginative, enthusiastic and full of ideas. Connects with people through stories and possibilities."],
    enneagram: ["Type 4, The Individualist", "Creative and expressive, with a deep need to be authentically yourself."],
    bigFive: "High Openness, high Extraversion",
  },
  mystic: {
    name: "The Mushroom Mystic",
    tagline: "Watched one reel. Now an expert.",
    description:
      "You're curious, fearless about new experiences, and a little too confident in what you learned on the internet. You'd rather try something and see what happens than sit around wondering. It makes your life an adventure, and it occasionally ends in the medic's tent.",
    strengths: ["Adventurous and curious", "Adapts fast", "Brings energy to any situation"],
    watchouts: ["Overconfident with half the facts", "Acts first, Googles later", "Gets bored by caution"],
    mbti: ["ESTP", "Energetic and action-oriented. Learns by doing and lives in the moment."],
    enneagram: ["Type 7, The Enthusiast", "Chases new experiences and hates missing out, sometimes skipping right past the risks."],
    bigFive: "High Openness, low Conscientiousness",
  },
  medic: {
    name: "The Field Medic",
    tagline: "Ran toward the bear. For a friend.",
    description:
      "Your first thought in a crisis is \"Is everyone okay?\" You'd give away your last snack, or walk back toward danger, if it meant nobody got left behind. People feel safe around you. Just remember that the medic needs looking after too.",
    strengths: ["Fiercely loyal", "Selfless and generous", "Makes people feel safe"],
    watchouts: ["Neglects your own needs", "Too trusting (even of voices in the woods)", "Takes on other people's pain"],
    mbti: ["ISFJ", "Warm, protective and devoted to the people you care about."],
    enneagram: ["Type 2, The Helper", "Generous and caring. Finds meaning in being there for others."],
    bigFive: "High Agreeableness, high Conscientiousness",
  },
  tattletale: {
    name: "The Tattletale",
    tagline: "Survived the woods. Filed a full report.",
    description:
      "You believe rules exist for a reason, and when someone breaks one, somebody should know. In your mind it isn't snitching, it's accountability. You keep a clear record of who did what, which makes you an excellent witness and a slightly nerve-racking hiking buddy.",
    strengths: ["Strong sense of right and wrong", "Remembers every detail", "Holds people accountable"],
    watchouts: ["Quick to assign blame", "Leans on authority instead of your own judgment", "Friends may think twice before inviting you on the next hike"],
    mbti: ["ESFJ", "Social and conscientious, very aware of group rules, and wants everyone to do the right thing."],
    enneagram: ["Type 1, The Reformer", "Principled, with a strong inner critic and a sharp eye for what's wrong."],
    bigFive: "High Conscientiousness, higher Neuroticism",
  },
  camper: {
    name: "The Happy Camper",
    tagline: "Lost in the woods? More like a free night of camping.",
    description:
      "Not much rattles you. Bears, shadows, a dead phone: you figure it'll all work itself out, and annoyingly, it usually does. You go with the flow, keep the peace, and somehow get a decent night's sleep where anyone else would be panicking.",
    strengths: ["Calm in chaos", "Easy to be around", "Adapts to anything"],
    watchouts: ["Waits for problems to solve themselves", "Can be too passive", "Puts off decisions"],
    mbti: ["ISFP", "Gentle, easygoing and present. Lives in the moment and avoids unnecessary conflict."],
    enneagram: ["Type 9, The Peacemaker", "Easygoing and accepting. Prefers harmony to rocking the boat."],
    bigFive: "Low Neuroticism, high Agreeableness",
  },
};

// ---------------------------------------------------------
// Quiz state: the list of choices the player has made
// ---------------------------------------------------------
let history = [];

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
function showPage(pageId) {
  fillStory(pageId);

  document.querySelectorAll(".page").forEach((page) => {
    page.hidden = page.id !== pageId;
  });

  window.scrollTo(0, 0);

  // Move keyboard/screen-reader focus to the new question
  const heading = document.querySelector(`#${CSS.escape(pageId)} [tabindex="-1"]`);
  if (heading) heading.focus();
}

// ---------------------------------------------------------
// Runs whenever any answer button is clicked
// ---------------------------------------------------------
function choose(choiceKey) {
  const answer = ANSWERS[choiceKey];
  history.push(choiceKey);

  if (answer.next === "result") {
    showResult();
  } else {
    showPage(answer.next);
  }
}

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

  fillList("result-strengths", result.strengths);
  fillList("result-watchouts", result.watchouts);

  // Personality test matches
  const matches = document.getElementById("result-matches");
  matches.innerHTML = "";
  [
    ["MBTI / 16 Personalities", `${result.mbti[0]}: ${result.mbti[1]}`],
    ["Enneagram", `${result.enneagram[0]}: ${result.enneagram[1]}`],
    ["Big Five", result.bigFive],
  ].forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    matches.append(dt, dd);
  });

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

  // The trail: every choice you made and what it says about you
  const trail = document.getElementById("result-trail");
  trail.innerHTML = "";
  history.forEach((choiceKey) => {
    const answer = ANSWERS[choiceKey];
    const li = document.createElement("li");
    li.textContent = `${answer.text}: `;
    const trait = document.createElement("span");
    trait.className = "trait";
    trait.textContent = answer.trait;
    li.appendChild(trait);
    trail.appendChild(li);
  });

  showPage("result");
}

// Helper: turn an array of strings into <li> items
function fillList(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

// ---------------------------------------------------------
// Connect the buttons
// ---------------------------------------------------------
document.querySelectorAll("[data-choice]").forEach((button) => {
  button.addEventListener("click", () => choose(button.dataset.choice));
});

document.getElementById("restart-btn").addEventListener("click", () => {
  history = [];
  showPage("page1");
});
