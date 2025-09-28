const MAX_HEALTH = 18;
const MAX_CYCLE = 12;

const EVENTS = [
  {
    id: "ghost-bazaar",
    title: "Ghost Bazaar in the Rain",
    description:
      "Neon awnings drip static as outlaw vendors peddle miracles. A hunched runner offers medfoam, while code-sprites whisper currency alchemy.",
    signal: "Rain hisses on synth tarps as the Ghost Bazaar beckons.",
    options: [
      {
        label: "Buy medfoam • -6 Cred +5 Vitals +1 Heat",
        effects: { cred: -6, health: 5, heat: 1 },
        outcome:
          "Medfoam hisses into your veins, stitching ruptured nerves while corp tracers note the illicit purchase.",
      },
      {
        label: "Hack the vendors • +3 Cred +1 Heat",
        effects: { cred: 3, heat: 1 },
        outcome:
          "You reroute the bazaar's ledgers, siphoning cred as spectral merchants glitch in outrage.",
      },
      {
        label: "Shadow-trade info • +1 Edge +1 Heat",
        effects: { edge: 1, heat: 1 },
        outcome:
          "A whisper network feeds you deep cuts on corp patrols, but your name sparks across their threat boards.",
      },
      {
        label: "Slip past unseen • -2 Heat",
        effects: { heat: -2 },
        outcome:
          "You ghost through the dripping labyrinth, leaving only rumors and evaporating footprints behind.",
      },
    ],
  },
  {
    id: "metro-leviathan",
    title: "Metro Leviathan",
    description:
      "A maglev serpent roars beneath the city, its cargo hold stuffed with corporate secrets and armed drones.",
    signal: "The tunnel's heartbeat syncs with yours as the Leviathan howls past.",
    options: [
      {
        label: "Leap aboard • -4 Vitals +4 Cred +1 Edge",
        effects: { health: -4, cred: 4, edge: 1 },
        outcome:
          "You vault onto the speeding car, scraping skin and stealing data caches fat with cred.",
      },
      {
        label: "Sabotage rails • +2 Heat +5 Cred",
        effects: { heat: 2, cred: 5 },
        outcome:
          "The maglev's guidance glitches under your code spike, and its black budget spills into your coffers.",
      },
      {
        label: "Ride the turbulence • -2 Heat",
        effects: { heat: -2 },
        outcome:
          "You disappear into maintenance shafts, letting the train's noise erase your trace signature.",
      },
      {
        label: "Scout from afar • +1 Edge",
        effects: { edge: 1 },
        outcome:
          "From a safe perch you catalogue security routines, banking intel for a future raid.",
      },
    ],
  },
  {
    id: "signal-cathedral",
    title: "Signal Cathedral",
    description:
      "An abandoned telecom tower thrums with worshippers coding psalms to forgotten AIs. Their ritual invites interference.",
    signal: "You taste ozone as hymns of machine saints vibrate through the steel spire.",
    options: [
      {
        label: "Join the chant • +2 Edge -1 Heat",
        effects: { edge: 2, heat: -1 },
        outcome:
          "Your voice threads with theirs, exchanging philosophy for tactical heuristics that smooth your aura.",
      },
      {
        label: "Harvest relic cores • +4 Cred +2 Heat",
        effects: { cred: 4, heat: 2 },
        outcome:
          "You pry relic chips from altars, drawing a surge of cred and the wrathful gaze of watching satellites.",
      },
      {
        label: "Trace the liturgy • -3 Vitals +3 Edge",
        effects: { health: -3, edge: 3 },
        outcome:
          "The code-song scrapes your neurons raw, but it leaves behind razor-sharp pattern recognition.",
      },
      {
        label: "Disrupt the broadcast • -2 Heat +2 Cred",
        effects: { heat: -2, cred: 2 },
        outcome:
          "You shatter their transmission, looting the donation stream while your notoriety cools.",
      },
    ],
  },
  {
    id: "skyline-chase",
    title: "Skyline Chase",
    description:
      "Corp drones rip across the skyline, sweeping for rogue frequencies. An open maintenance bay yawns nearby.",
    signal: "Jetwash scorches your coat as searchlights comb the city canyons.",
    options: [
      {
        label: "Hijack a drone • +4 Cred +1 Heat",
        effects: { cred: 4, heat: 1 },
        outcome:
          "You spike a drone's guidance, selling it mid-air to scavengers with a wink and a cutthroat grin.",
      },
      {
        label: "Dive for cover • -2 Vitals -3 Heat",
        effects: { health: -2, heat: -3 },
        outcome:
          "You tumble through a vent, bruised but invisible as the dragnet roars overhead.",
      },
      {
        label: "Broadcast false leads • -1 Edge -2 Heat",
        effects: { edge: -1, heat: -2 },
        outcome:
          "You scatter ghost signals that lure the drones elsewhere, sacrificing swagger for silence.",
      },
      {
        label: "Ride the wake • +2 Edge +2 Heat",
        effects: { edge: 2, heat: 2 },
        outcome:
          "You parkour through the jetstream, earning street legend status and the corp's growing fixation.",
      },
    ],
  },
  {
    id: "abyss-hotel",
    title: "Abyss Hotel Penthouse",
    description:
      "A decadent penthouse hosts a midnight auction of forbidden memories. The air reeks of perfume and betrayal.",
    signal: "Strings of glass butterflies shimmer as hush-money changes hands.",
    options: [
      {
        label: "Auction stolen intel • +6 Cred +2 Heat",
        effects: { cred: 6, heat: 2 },
        outcome:
          "Your data-lure fetches a fortune, but buyers trace your silhouette for revenge.",
      },
      {
        label: "Sample the wares • +4 Vitals -3 Cred",
        effects: { health: 4, cred: -3 },
        outcome:
          "You inhale a memory of sunlight, healing scorched synapses while your cred slips away.",
      },
      {
        label: "Blackmail a magnate • +2 Edge +1 Heat",
        effects: { edge: 2, heat: 1 },
        outcome:
          "You corner a trembling exec with evidence, and their hush payment sharpens your legend.",
      },
      {
        label: "Crash the servers • -2 Heat -2 Cred",
        effects: { heat: -2, cred: -2 },
        outcome:
          "You overload the auction feed, scattering the crowd and covering your tracks in static.",
      },
    ],
  },
  {
    id: "dream-forge",
    title: "Dream Forge Refuge",
    description:
      "In a subterranean makerspace, renegade artists weave armor from lucid dreams. They welcome you with solder-burned smiles.",
    signal: "Warm light and ozone wrap you in a moment of impossible peace.",
    options: [
      {
        label: "Commission gear • -5 Cred +1 Edge -1 Heat",
        effects: { cred: -5, edge: 1, heat: -1 },
        outcome:
          "The artisans lace your coat with memory-metal, tightening your profile while cooling your trail.",
      },
      {
        label: "Share war stories • +2 Edge",
        effects: { edge: 2 },
        outcome:
          "You swap scars and strategies, walking out with swagger borrowed from fellow legends.",
      },
      {
        label: "Volunteer repairs • +3 Vitals",
        effects: { health: 3 },
        outcome:
          "You tinker alongside them, the quiet work mending both circuitry and sinew.",
      },
      {
        label: "Donate spoils • -4 Cred -2 Heat",
        effects: { cred: -4, heat: -2 },
        outcome:
          "You hand over contraband, earning heartfelt nods and a much colder heat signature.",
      },
    ],
  },
];

const state = {
  maxHealth: MAX_HEALTH,
  health: MAX_HEALTH,
  edge: 0,
  cred: 0,
  heat: 0,
  cycle: 1,
  lastEventId: null,
  isOver: false,
  currentEvent: null,
};

const statEls = {
  health: document.getElementById("stat-health"),
  edge: document.getElementById("stat-edge"),
  cred: document.getElementById("stat-cred"),
  heat: document.getElementById("stat-heat"),
};
const cycleLabel = document.getElementById("cycle-label");
const eventTitle = document.getElementById("event-title");
const eventDescription = document.getElementById("event-description");
const optionButtons = Array.from(document.querySelectorAll(".option-button"));
const logEl = document.getElementById("log");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");

const restartButtons = [
  document.getElementById("restart-button"),
  document.getElementById("overlay-restart"),
];

restartButtons.forEach((button) => {
  if (button) {
    button.addEventListener("click", () => startGame());
  }
});

optionButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (state.isOver || !state.currentEvent) return;
    const index = Number(event.currentTarget.dataset.index);
    const choice = state.currentEvent.options[index];
    if (!choice) return;
    resolveChoice(choice);
  });
});

function startGame() {
  state.maxHealth = MAX_HEALTH;
  state.health = MAX_HEALTH;
  state.edge = 3;
  state.cred = 15;
  state.heat = 0;
  state.cycle = 1;
  state.lastEventId = null;
  state.isOver = false;
  state.currentEvent = null;
  overlay.classList.add("hidden");
  logEl.innerHTML = "";
  logMessage("Boot sequence: synthlines humming, citywide feed unlocked.");
  updateStats();
  presentEvent();
}

function presentEvent() {
  if (state.isOver) return;

  const event = pickEvent();
  state.currentEvent = event;

  cycleLabel.textContent = `Cycle ${state.cycle}`;
  eventTitle.textContent = event.title;
  eventDescription.textContent = event.description;

  optionButtons.forEach((button, index) => {
    const choice = event.options[index];
    button.disabled = false;
    button.textContent = choice ? choice.label : "";
  });

  if (event.signal) {
    logMessage(event.signal);
  }
}

function pickEvent() {
  let candidate = null;
  do {
    candidate = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  } while (candidate.id === state.lastEventId && EVENTS.length > 1);
  state.lastEventId = candidate.id;
  return candidate;
}

function resolveChoice(choice) {
  optionButtons.forEach((button) => (button.disabled = true));

  applyEffects(choice.effects || {});
  logMessage(choice.outcome);
  updateStats();

  if (checkEndConditions()) {
    return;
  }

  state.cycle += 1;
  if (state.cycle > MAX_CYCLE) {
    celebrateVictory();
    return;
  }

  setTimeout(() => {
    presentEvent();
  }, 250);
}

function applyEffects(effects) {
  if (effects.health) {
    state.health = clamp(
      state.health + effects.health,
      0,
      state.maxHealth
    );
  }
  if (effects.edge) {
    state.edge = Math.max(0, state.edge + effects.edge);
  }
  if (effects.cred) {
    state.cred = Math.max(0, Math.round(state.cred + effects.cred));
  }
  if (effects.heat) {
    state.heat = Math.max(0, state.heat + effects.heat);
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateStats() {
  statEls.health.textContent = `${state.health}/${state.maxHealth}`;
  statEls.edge.textContent = state.edge;
  statEls.cred.textContent = state.cred;
  statEls.heat.textContent = state.heat;

  if (state.health <= state.maxHealth * 0.3) {
    statEls.health.style.color = "var(--danger)";
  } else {
    statEls.health.style.color = "var(--accent)";
  }
}

function logMessage(text) {
  if (!text) return;
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.textContent = text;
  logEl.prepend(entry);
  while (logEl.children.length > 12) {
    logEl.removeChild(logEl.lastChild);
  }
}

function checkEndConditions() {
  if (state.health <= 0) {
    endRun(
      "Signal Lost",
      "Your vitals flatline under neon rain. The city mutters your name like an unfinished prayer."
    );
    return true;
  }

  if (state.heat >= 10) {
    endRun(
      "Trace Locked",
      "Corp strike teams triangulate your position; obsidian gunships blot out the midnight stars."
    );
    return true;
  }

  return false;
}

function celebrateVictory() {
  state.isOver = true;
  const legendTone = state.edge >= 8
    ? "You ascend as a myth, a cipher whispered at every street altar."
    : "You vanish between the alley lights, legend enough to keep the city restless.";
  const wealthTone = state.cred >= 30
    ? "Cred chimes like rain in your pockets."
    : "You're not rich, but the city owes you favors.";
  endRun("Run Complete", `${legendTone} ${wealthTone}`);
}

function endRun(title, message) {
  state.isOver = true;
  overlayTitle.textContent = title;
  overlayText.textContent = message;
  overlay.classList.remove("hidden");
}

window.addEventListener("load", () => {
  startGame();
});
