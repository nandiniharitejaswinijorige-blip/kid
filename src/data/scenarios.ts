import type { ScenarioCategory, ScenarioGuide } from '../types/kidhero';

export interface CategoryMeta {
  id: ScenarioCategory;
  title: string;
  subtitle: string;
  imageUrl: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export const CATEGORY_META: Record<ScenarioCategory, CategoryMeta> = {
  safety: {
    id: 'safety',
    title: 'Safety & Emergencies',
    subtitle: 'Stay calm, spot safe helpers, and know what to do first.',
    imageUrl: '/src/assets/images/cat_safety_helpers_1795453703948.jpg',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-800',
    accentBorder: 'border-sky-200',
  },
  feelings: {
    id: 'feelings',
    title: 'Big Feelings & Friends',
    subtitle: 'Cool down strong emotions and handle tricky friend moments.',
    imageUrl: '/src/assets/images/cat_feelings_friends_1795453704115.jpg',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-800',
    accentBorder: 'border-emerald-200',
  },
  school: {
    id: 'school',
    title: 'School & Daily Life',
    subtitle: 'Turn messy mornings and forgotten tasks into easy wins.',
    imageUrl: '/src/assets/images/cat_school_routines_1795453704459.jpg',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-800',
    accentBorder: 'border-amber-200',
  },
};

export const SCENARIO_GUIDES: ScenarioGuide[] = [
  // 1. SAFETY: I'm Lost in Public
  {
    id: 'lost-in-public',
    title: "I'm Lost in Public",
    shortDescription: 'Freeze your feet, look around for a safe helper, and call your grown-up.',
    category: 'safety',
    iconName: 'Compass',
    estimatedMinutes: 3,
    starReward: 20,
    startStepId: 'stop-breathe',
    steps: {
      'stop-breathe': {
        id: 'stop-breathe',
        title: 'Step 1: Freeze Your Feet',
        prompt: 'Stop walking right where you are. Staying in one spot makes it much easier for your grown-up to find you.',
        helperTip: 'Take 2 slow belly breaths. You are safe and you have a plan.',
        interactiveType: 'breathing',
        breathingConfig: {
          inhaleSec: 4,
          holdSec: 2,
          exhaleSec: 4,
          cycles: 2,
          label: 'Calm Freeze Breath',
        },
        nextStepId: 'where-are-you',
      },
      'where-are-you': {
        id: 'where-are-you',
        title: 'Step 2: Where Are You Right Now?',
        prompt: 'Look around without walking away. What kind of place are you in?',
        interactiveType: 'choice',
        choices: [
          {
            label: 'Inside a store, mall, or library',
            nextStepId: 'indoors-helper',
            tone: 'primary',
          },
          {
            label: 'Outside at a park, zoo, or street',
            nextStepId: 'outdoors-helper',
            tone: 'calm',
          },
        ],
      },
      'indoors-helper': {
        id: 'indoors-helper',
        title: 'Spot a Store Helper',
        prompt: 'Look for a worker wearing a name tag, store vest, or standing behind a cash register or Info Desk.',
        helperTip: 'Never leave the building to search the parking lot. Stay inside where it is bright and busy.',
        interactiveType: 'choice',
        choices: [
          {
            label: 'I see a worker with a name tag',
            nextStepId: 'safe-info-share',
            tone: 'primary',
          },
          {
            label: "I don't see a worker nearby",
            nextStepId: 'parent-with-kids',
            tone: 'secondary',
          },
        ],
      },
      'outdoors-helper': {
        id: 'outdoors-helper',
        title: 'Find a Safe Family or Officer',
        prompt: 'Look for a police officer, park ranger, or a parent who is with their own children.',
        helperTip: 'Say clearly: "I am lost. Can you please help me call my parent?"',
        interactiveType: 'choice',
        choices: [
          {
            label: 'I found a safe helper',
            nextStepId: 'safe-info-share',
            tone: 'primary',
          },
        ],
      },
      'parent-with-kids': {
        id: 'parent-with-kids',
        title: 'Look for a Parent With Kids',
        prompt: 'Stay right where you are and call out loudly for your grown-up, or ask a mom or dad who is with their kids for help finding a store desk.',
        helperTip: 'Do not go into a back room or car with anyone.',
        interactiveType: 'choice',
        choices: [
          {
            label: 'Ready to show my Safe Info',
            nextStepId: 'safe-info-share',
            tone: 'primary',
          },
        ],
      },
      'safe-info-share': {
        id: 'safe-info-share',
        title: 'Call Using Your Safe Info',
        prompt: 'Show your helper the emergency phone number below so they can call your grown-up right away.',
        helperTip: 'Stay right next to the helper at the counter until you see your grown-up.',
        interactiveType: 'safe-info-peek',
        nextStepId: 'done',
      },
      done: {
        id: 'done',
        title: 'Awesome Safety Thinking!',
        prompt: 'You practiced staying put, picking a safe helper, and using your Safe Info card.',
        interactiveType: 'finish',
        celebrationMessage: 'Knowing what to do makes you a real-life safety hero!',
      },
    },
  },

  // 2. SAFETY: Someone Got Hurt
  {
    id: 'someone-hurt',
    title: 'Someone Got Hurt',
    shortDescription: 'Check if it is a small scrape or a big emergency, and get help fast.',
    category: 'safety',
    iconName: 'HeartPulse',
    estimatedMinutes: 3,
    starReward: 20,
    startStepId: 'check-safety',
    steps: {
      'check-safety': {
        id: 'check-safety',
        title: 'Step 1: Check That You Are Safe',
        prompt: 'Before you run over, look around for dangers like cars, broken glass, or hot things.',
        helperTip: 'A good helper keeps themselves safe first so they can get help.',
        interactiveType: 'choice',
        choices: [
          {
            label: 'It is safe to look closer',
            nextStepId: 'how-bad',
            tone: 'primary',
          },
        ],
      },
      'how-bad': {
        id: 'how-bad',
        title: 'Step 2: Small Ouch or Big Emergency?',
        prompt: 'How hurt is the person right now?',
        interactiveType: 'choice',
        choices: [
          {
            label: "Small scrape, bump, or skinned knee (they're talking fine)",
            nextStepId: 'small-ouch',
            tone: 'calm',
          },
          {
            label: "Big emergency (can't get up, trouble breathing, lots of blood)",
            nextStepId: 'big-emergency',
            tone: 'primary',
          },
        ],
      },
      'small-ouch': {
        id: 'small-ouch',
        title: 'Small Scrape Care Plan',
        prompt: 'Check off these gentle first-aid steps with a grown-up:',
        interactiveType: 'checklist',
        checklistItems: [
          'Tell a trusted adult what happened',
          'Wash hands and rinse the scrape with cool clean water',
          'Put on a clean bandage or cool ice pack wrapped in a cloth',
        ],
        nextStepId: 'done',
      },
      'big-emergency': {
        id: 'big-emergency',
        title: 'Get Help Immediately',
        prompt: 'Yell loudly for the nearest adult. If no adult is around, dial 911 (or your local emergency number) on a phone—even a locked phone can make an emergency call.',
        helperTip: 'Tell the operator: your name, what happened, and where you are.',
        interactiveType: 'safe-info-peek',
        nextStepId: 'calm-wait',
      },
      'calm-wait': {
        id: 'calm-wait',
        title: 'Stay Calm While Help Comes',
        prompt: 'Speak softly to the hurt person and let them know help is on the way. Take slow breaths while you wait.',
        interactiveType: 'breathing',
        breathingConfig: {
          inhaleSec: 4,
          holdSec: 4,
          exhaleSec: 4,
          cycles: 2,
          label: 'Steady Helper Breathing',
        },
        nextStepId: 'done',
      },
      done: {
        id: 'done',
        title: 'Brave Helper Complete!',
        prompt: 'You know how to check for danger, tell small scrapes from big emergencies, and get adult help fast.',
        interactiveType: 'finish',
        celebrationMessage: 'Staying calm helps everyone around you!',
      },
    },
  },

  // 3. SAFETY: Strangers & Online Safety
  {
    id: 'strangers-online',
    title: 'Strangers & Online Safety',
    shortDescription: 'Know tricky rules for protecting your body, secrets, and private info.',
    category: 'safety',
    iconName: 'ShieldCheck',
    estimatedMinutes: 3,
    starReward: 20,
    startStepId: 'where-happening',
    steps: {
      'where-happening': {
        id: 'where-happening',
        title: 'Where Is This Happening?',
        prompt: 'Choose the situation you want to practice or solve right now.',
        interactiveType: 'choice',
        choices: [
          {
            label: 'In person (someone I do not know or feel unsure about)',
            nextStepId: 'in-person-rule',
            tone: 'primary',
          },
          {
            label: 'Online (in a game, tablet, or message)',
            nextStepId: 'online-rule',
            tone: 'calm',
          },
        ],
      },
      'in-person-rule': {
        id: 'in-person-rule',
        title: 'Remember: No, Go, Yell, Tell!',
        prompt: 'Safe grown-ups do NOT ask kids for help finding lost pets, offer surprise rides, or ask you to keep secrets from your parents.',
        helperTip: 'Practice these 4 power steps right now:',
        interactiveType: 'checklist',
        checklistItems: [
          'NO: Say "No!" in a strong, loud voice',
          'GO: Back up or run toward a busy, bright place',
          'YELL: Shout "You are not my parent!" so people look',
          'TELL: Tell your parent or teacher right away',
        ],
        nextStepId: 'done',
      },
      'online-rule': {
        id: 'online-rule',
        title: 'Protect Your Private Treasure',
        prompt: 'Never share your real name, school, home address, password, or photos with people you only know on a screen.',
        helperTip: 'If someone asks weird questions or makes you feel uncomfortable, stop typing!',
        interactiveType: 'checklist',
        checklistItems: [
          'Do not reply to the message',
          'Close or put down the screen',
          'Show a parent or trusted adult right away (you will NOT get in trouble)',
        ],
        nextStepId: 'done',
      },
      done: {
        id: 'done',
        title: 'Safety Shield Activated!',
        prompt: 'You practiced trusting your gut feelings and keeping your private info safe.',
        interactiveType: 'finish',
        celebrationMessage: 'Remember: Safe adults NEVER ask kids to keep secrets from parents.',
      },
    },
  },

  // 4. FEELINGS: Feeling Angry or Scared
  {
    id: 'angry-or-scared',
    title: 'Feeling Angry or Scared',
    shortDescription: 'Ride out the big wave with 4-4-4 box breathing and pick a calm next move.',
    category: 'feelings',
    iconName: 'Wind',
    estimatedMinutes: 3,
    starReward: 15,
    startStepId: 'box-breathe',
    steps: {
      'box-breathe': {
        id: 'box-breathe',
        title: 'Step 1: Box Breathing Reset',
        prompt: 'Big feelings are like ocean waves—they rise up, and then they pass. Follow the glowing circle to calm your body.',
        helperTip: 'Breathe in through your nose, hold gently, and blow out like cooling warm soup.',
        interactiveType: 'breathing',
        breathingConfig: {
          inhaleSec: 4,
          holdSec: 4,
          exhaleSec: 4,
          holdAfterSec: 4,
          cycles: 3,
          label: '4-4-4-4 Box Breathing',
        },
        nextStepId: 'name-feeling',
      },
      'name-feeling': {
        id: 'name-feeling',
        title: 'Step 2: Name It to Tame It',
        prompt: 'Which feeling is visiting you most right now?',
        interactiveType: 'choice',
        choices: [
          {
            label: 'My hands feel tight and hot (Angry / Frustrated)',
            nextStepId: 'cool-anger',
            tone: 'primary',
          },
          {
            label: 'My tummy feels fluttery (Scared / Worried)',
            nextStepId: 'calm-worry',
            tone: 'calm',
          },
        ],
      },
      'cool-anger': {
        id: 'cool-anger',
        title: 'Let Out Steam Safely',
        prompt: 'It is okay to feel mad, and it is never okay to hit or break things. Try one safe body reset:',
        interactiveType: 'checklist',
        checklistItems: [
          'Squeeze both fists tight for 5 seconds, then let them go floppy',
          'Take a cool sip of water',
          'Say: "I feel frustrated because ___" or ask for 5 minutes of quiet space',
        ],
        nextStepId: 'done',
      },
      'calm-worry': {
        id: 'calm-worry',
        title: '5-4-3-2-1 Grounding Look',
        prompt: 'Bring your brain back to right here, right now by spotting safe things around you:',
        interactiveType: 'checklist',
        checklistItems: [
          'Spot 3 blue or green things in the room',
          'Feel both of your feet flat on the floor',
          'Tell a trusted grown-up or write down what is worrying you',
        ],
        nextStepId: 'done',
      },
      done: {
        id: 'done',
        title: 'Wave Surfer Complete!',
        prompt: 'Your brain and body slowed down together. You handled a big feeling like a true KidHero.',
        interactiveType: 'finish',
        celebrationMessage: 'Feelings are visitors—you are the captain of your choices.',
      },
    },
  },

  // 5. FEELINGS: Dealing with a Bully
  {
    id: 'dealing-with-bully',
    title: 'Dealing with a Bully',
    shortDescription: 'Stand tall, protect your peace, and bring in trusted adults on your team.',
    category: 'feelings',
    iconName: 'Shield',
    estimatedMinutes: 3,
    starReward: 20,
    startStepId: 'first-truth',
    steps: {
      'first-truth': {
        id: 'first-truth',
        title: 'First: It Is Never Your Fault',
        prompt: 'Someone being mean on purpose is their mistake, not yours. Let us pick what is happening so you have a smart plan.',
        interactiveType: 'choice',
        choices: [
          {
            label: 'Someone is teasing or pushing me right now',
            nextStepId: 'in-moment-action',
            tone: 'primary',
          },
          {
            label: 'It keeps happening at school or on a device',
            nextStepId: 'repeat-action',
            tone: 'calm',
          },
        ],
      },
      'in-moment-action': {
        id: 'in-moment-action',
        title: 'Use Your Calm Shield',
        prompt: 'Bullies want a big upset reaction. Stay calm, keep your voice flat, and move toward safety:',
        interactiveType: 'checklist',
        checklistItems: [
          'Look them in the eye and say firmly: "Stop. Leave me alone."',
          'Walk away right away toward a teacher, coach, or group of friends',
          'Do NOT hit back or say mean words back',
        ],
        nextStepId: 'tell-team',
      },
      'repeat-action': {
        id: 'repeat-action',
        title: 'Build Your Adult Team',
        prompt: 'Reporting bullying is NOT tattling—tattling is trying to get someone in trouble; reporting is keeping people safe.',
        interactiveType: 'checklist',
        checklistItems: [
          'Remember or write down WHO, WHAT, and WHERE it happened',
          'If online, ask an adult to save a screenshot and block the person',
          'Tell your parent and your teacher today',
        ],
        nextStepId: 'tell-team',
      },
      'tell-team': {
        id: 'tell-team',
        title: 'Practice What to Say',
        prompt: 'Try saying this out loud once so it feels easy: "Someone keeps bothering me, and I need help making it stop."',
        helperTip: 'If the first adult is busy, tell another trusted adult until someone helps.',
        interactiveType: 'choice',
        choices: [
          {
            label: 'I practiced my brave voice!',
            nextStepId: 'done',
            tone: 'primary',
          },
        ],
      },
      done: {
        id: 'done',
        title: 'Brave Voice Unlocked!',
        prompt: 'You have a clear plan to stay safe, walk with buddies, and speak up to your adult team.',
        interactiveType: 'finish',
        celebrationMessage: 'You deserve kindness and safety every single day.',
      },
    },
  },

  // 6. FEELINGS: Making Friends
  {
    id: 'making-friends',
    title: 'Making Friends',
    shortDescription: 'Beat shy butterflies and try friendly openers that start great conversations.',
    category: 'feelings',
    iconName: 'Users',
    estimatedMinutes: 3,
    starReward: 15,
    startStepId: 'calm-butterflies',
    steps: {
      'calm-butterflies': {
        id: 'calm-butterflies',
        title: 'Step 1: Settle Shy Butterflies',
        prompt: 'Almost everyone feels a little nervous walking up to someone new. Take one calm breath first.',
        interactiveType: 'breathing',
        breathingConfig: {
          inhaleSec: 3,
          holdSec: 2,
          exhaleSec: 4,
          cycles: 2,
          label: 'Confidence Breath',
        },
        nextStepId: 'pick-opener',
      },
      'pick-opener': {
        id: 'pick-opener',
        title: 'Step 2: Pick a Friendly Opener',
        prompt: 'Which kind of moment are you in right now?',
        interactiveType: 'choice',
        choices: [
          {
            label: 'Kids are already playing a game nearby',
            nextStepId: 'join-game',
            tone: 'primary',
          },
          {
            label: 'Sitting next to someone at lunch or class',
            nextStepId: 'start-chat',
            tone: 'calm',
          },
        ],
      },
      'join-game': {
        id: 'join-game',
        title: 'How to Join a Game',
        prompt: 'Watch the game for 10 seconds first so you see the rules, then smile and ask:',
        helperTip: '"That looks fun! Can I play on the next round?"',
        interactiveType: 'checklist',
        checklistItems: [
          'Say your name with a friendly wave',
          'Follow the game rules and take turns',
          'If they say the game is full right now, smile and look for another group—that happens sometimes!',
        ],
        nextStepId: 'done',
      },
      'start-chat': {
        id: 'start-chat',
        title: 'Easy Conversation Starters',
        prompt: 'Pick one easy question or compliment to try today:',
        interactiveType: 'checklist',
        checklistItems: [
          'Give a real compliment: "Cool backpack!" or "Awesome drawing!"',
          'Ask a fun question: "What is your favorite game or book?"',
          'Listen closely when they answer!',
        ],
        nextStepId: 'done',
      },
      done: {
        id: 'done',
        title: 'Friendship Explorer!',
        prompt: 'Small friendly moments are how every great friendship starts.',
        interactiveType: 'finish',
        celebrationMessage: 'A warm smile and a simple question go a long way!',
      },
    },
  },

  // 7. SCHOOL: Forgot My Homework
  {
    id: 'forgot-homework',
    title: 'Forgot My Homework',
    shortDescription: 'Fix a forgotten assignment calmly without panicking or hiding it.',
    category: 'school',
    iconName: 'BookOpen',
    estimatedMinutes: 2,
    starReward: 15,
    startStepId: 'where-now',
    steps: {
      'where-now': {
        id: 'where-now',
        title: 'Where Are You Right Now?',
        prompt: 'Every kid forgets homework sometimes! Let us check where you are so we can fix it fast.',
        interactiveType: 'choice',
        choices: [
          {
            label: 'Still at home before leaving',
            nextStepId: 'still-home',
            tone: 'primary',
          },
          {
            label: 'Already at school or on the bus',
            nextStepId: 'at-school',
            tone: 'calm',
          },
        ],
      },
      'still-home': {
        id: 'still-home',
        title: '60-Second Backpack Sweep',
        prompt: 'Check the 3 most common hiding spots before you panic:',
        interactiveType: 'checklist',
        checklistItems: [
          'Check inside your homework folder and front backpack pocket',
          'Check the kitchen table and your study desk',
          'Put it straight into your main backpack zipper right now',
        ],
        nextStepId: 'done',
      },
      'at-school': {
        id: 'at-school',
        title: 'Own It Like a Hero',
        prompt: 'Telling the truth early feels way better than worrying all day. Teachers respect honesty!',
        helperTip: 'Tell your teacher before class starts: "I left my homework on my desk at home. May I bring it tomorrow?"',
        interactiveType: 'checklist',
        checklistItems: [
          'Take 1 deep breath—one missed paper does not ruin your whole week',
          'Tell your teacher honestly right when you arrive',
          'Put a sticky note or reminder in your bag to pack it tonight',
        ],
        nextStepId: 'done',
      },
      done: {
        id: 'done',
        title: 'Problem Solved Calmly!',
        prompt: 'Mistakes happen to everyone—owning up and making a plan shows real maturity.',
        interactiveType: 'finish',
        celebrationMessage: 'Tip: Pack your bag the night before to make mornings breezy!',
      },
    },
  },

  // 8. SCHOOL: Messy Room Overwhelm
  {
    id: 'messy-room',
    title: 'Messy Room Overwhelm',
    shortDescription: 'Break a giant messy room into 4 tiny 2-minute missions you can actually finish.',
    category: 'school',
    iconName: 'Sparkles',
    estimatedMinutes: 4,
    starReward: 20,
    startStepId: 'shrink-mountain',
    steps: {
      'shrink-mountain': {
        id: 'shrink-mountain',
        title: 'Step 1: Shrink the Mountain',
        prompt: 'Never look at the whole messy room at once! Pick ONE type of thing at a time and do 5 items fast.',
        interactiveType: 'choice',
        choices: [
          {
            label: 'Ready for the 4-Step Room Sprint!',
            nextStepId: 'room-sprint',
            tone: 'primary',
          },
        ],
      },
      'room-sprint': {
        id: 'room-sprint',
        title: 'Step 2: Tap Each Micro-Mission Done',
        prompt: 'Do these 4 tiny rounds in order—you will be amazed how fast the floor appears:',
        interactiveType: 'checklist',
        checklistItems: [
          'Round 1: Grab all trash & wrappers and toss them in the bin',
          'Round 2: Toss dirty clothes into the laundry hamper',
          'Round 3: Stack books & school papers into one neat pile',
          'Round 4: Scoop toys & games into their basket or shelf',
        ],
        nextStepId: 'done',
      },
      done: {
        id: 'done',
        title: 'Room Rescue Champion!',
        prompt: 'Look at that clear floor! Breaking big jobs into tiny steps works for anything.',
        interactiveType: 'finish',
        celebrationMessage: 'High five! One small round at a time beats any giant mess.',
      },
    },
  },

  // 9. SCHOOL: Morning Rush
  {
    id: 'morning-rush',
    title: 'Morning Rush',
    shortDescription: 'Beat the clock without forgetting shoes, water bottle, or homework.',
    category: 'school',
    iconName: 'Sun',
    estimatedMinutes: 3,
    starReward: 15,
    startStepId: 'launch-pad',
    steps: {
      'launch-pad': {
        id: 'launch-pad',
        title: 'Step 1: Morning Launch Checklist',
        prompt: 'Move step-by-step down the launch list so everyone gets out the door feeling calm:',
        interactiveType: 'checklist',
        checklistItems: [
          'Get dressed & put shoes by the front door',
          'Eat breakfast & brush teeth',
          'Grab packed backpack, lunchbox, and filled water bottle',
        ],
        nextStepId: 'quick-breath',
      },
      'quick-breath': {
        id: 'quick-breath',
        title: 'Step 2: 10-Second Doorway Check',
        prompt: 'Pause for one big breath at the door. Touch your backpack, lunch, and smile—you are ready for a great day!',
        interactiveType: 'choice',
        choices: [
          {
            label: 'Everything is packed and ready!',
            nextStepId: 'done',
            tone: 'primary',
          },
        ],
      },
      done: {
        id: 'done',
        title: 'Smooth Launch!',
        prompt: 'You beat the morning rush with zero stress.',
        interactiveType: 'finish',
        celebrationMessage: 'Have an awesome day at school!',
      },
    },
  },
];
