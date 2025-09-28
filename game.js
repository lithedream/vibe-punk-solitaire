const CARD_LIBRARY = {
  "neon-strike": {
    name: "Neon Strike",
    type: "Attack",
    cost: 1,
    description: "Deal 4 integrity damage.",
    play(state) {
      dealDamage(state, 4, "Neon Strike slashes through the firewall.");
    },
  },
  "pulse-blade": {
    name: "Pulse Blade",
    type: "Attack",
    cost: 2,
    description: "Deal 7 integrity damage. If foe is exposed, +2.",
    play(state) {
      const bonus = state.challenge.exposed > 0 ? 2 : 0;
      dealDamage(
        state,
        7 + bonus,
        bonus > 0
          ? "Pulse Blade feasts on exposed code for +2 damage."
          : "Pulse Blade carves neon scars into the foe."
      );
    },
  },
  "hack-surge": {
    name: "Hack Surge",
    type: "Hack",
    cost: 1,
    description: "Apply System Lag (-2 enemy damage for 1 turn).",
    play(state) {
      state.challenge.lagTurns = Math.max(state.challenge.lagTurns, 1);
      logMessage("Enemy systems glitch. Incoming damage -2 for this cycle.");
    },
  },
  "shield-loop": {
    name: "Shield Loop",
    type: "Defense",
    cost: 1,
    description: "Gain 4 shield.",
    play(state) {
      state.player.shield += 4;
      logMessage("Shield Loop hums, +4 shield.");
    },
  },
  "med-patch": {
    name: "Med Patch",
    type: "Recovery",
    cost: 2,
    description: "Restore 5 HP.",
    play(state) {
      const prev = state.player.hp;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5);
      logMessage(`Vitals restored (${prev} → ${state.player.hp}).`);
    },
  },
  "overclock": {
    name: "Overclock",
    type: "Boost",
    cost: 0,
    description: "Gain +1 energy and draw 1 card.",
    play(state) {
      state.player.energy += 1;
      drawCards(state, 1);
      logMessage("Overclock engaged. +1 energy, +1 draw.");
    },
  },
  "data-leech": {
    name: "Data Leech",
    type: "Hack",
    cost: 1,
    description: "Deal 2 damage. Restore HP equal to damage dealt.",
    play(state) {
      const damage = dealDamage(state, 2, "Data Leech siphons corrupted energy.");
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + damage);
      logMessage(`Leech returns ${damage} HP.`);
    },
  },
  "glitch-bomb": {
    name: "Glitch Bomb",
    type: "Hack",
    cost: 2,
    description: "Deal 3 damage and apply 2 Expose (bonus damage taken).",
    play(state) {
      dealDamage(state, 3, "Glitch Bomb detonates in luminous static.");
      state.challenge.exposed += 2;
      logMessage("Enemy code destabilized. Future attacks +2 damage.");
    },
  },
  "quantum-key": {
    name: "Quantum Key",
    type: "Utility",
    cost: 1,
    description: "Draw 2 cards.",
    play(state) {
      drawCards(state, 2);
      logMessage("Quantum Key spawns two new options.");
    },
  },
  "feedback-field": {
    name: "Feedback Field",
    type: "Defense",
    cost: 1,
    description: "Gain 3 shield. Next attack returns 2 damage.",
    play(state) {
      state.player.shield += 3;
      state.player.reflect = Math.max(state.player.reflect, 2);
      logMessage("Feedback Field primed. Return 2 damage on next hit.");
    },
  },
};

const CHALLENGES = [
  {
    name: "Ghosted Firewall",
    integrity: 16,
    damage: 4,
    lore: "A haunted security cluster stitched from outlaw AI scraps.",
  },
  {
    name: "Enforcer Drone",
    integrity: 20,
    damage: 5,
    lore: "Corporate muscle with a badge forged out of fear.",
  },
  {
    name: "Archivist Mind",
    integrity: 24,
    damage: 6,
    lore: "Ancient librarian AI guarding secrets that burn through sanity.",
  },
  {
    name: "Hive of Static",
    integrity: 28,
    damage: 7,
    lore: "A swarm intelligence spun from broken streetlamps and paranoia.",
  },
  {
    name: "Executive Phantom",
    integrity: 32,
    damage: 8,
    lore: "Boardroom ghost hacking reality to keep profits immortal.",
  },
];

const REWARDS = [
  {
    id: "maxhp",
    name: "Nanite Surge",
    description: "+4 max HP and heal 4.",
    apply(state) {
      state.player.maxHp += 4;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 4);
      logMessage("Nanites refurbish your core. Max HP +4.");
    },
  },
  {
    id: "maxenergy",
    name: "Fusion Battery",
    description: "+1 max energy.",
    apply(state) {
      state.player.maxEnergy += 1;
      state.player.energy = state.player.maxEnergy;
      logMessage("Fusion Battery ignites. Max energy +1.");
    },
  },
  {
    id: "newcard",
    name: "Black Market Upload",
    description: "Gain a rare card.",
    apply(state) {
      const pool = ["glitch-bomb", "quantum-key", "feedback-field"];
      const choice = pool[Math.floor(Math.random() * pool.length)];
      state.player.deck.push(createCard(choice));
      logMessage(`${CARD_LIBRARY[choice].name} added to your deck.`);
    },
  },
  {
    id: "heal",
    name: "Street Doc",
    description: "Restore 8 HP.",
    apply(state) {
      const prev = state.player.hp;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 8);
      logMessage(`Street Doc patches ${state.player.hp - prev} HP.`);
    },
  },
  {
    id: "mod",
    name: "Neon Implant",
    description: "Gain permanent +1 shield at turn start.",
    apply(state) {
      state.player.mods.permaShield += 1;
      logMessage("Neon implant installed. Turn-start shield +1.");
      updateModsUI(state);
    },
  },
];

const state = {
  player: {
    maxHp: 28,
    hp: 28,
    shield: 0,
    energy: 3,
    maxEnergy: 3,
    deck: [],
    discard: [],
    hand: [],
    reflect: 0,
    mods: {
      permaShield: 0,
    },
  },
  challengeDeck: [],
  challenge: null,
  awaitingReward: false,
  turnHasJackIn: false,
};

const handEl = document.getElementById("hand");
const hpEl = document.getElementById("hp");
const shieldEl = document.getElementById("shield");
const energyEl = document.getElementById("energy");
const deckCountEl = document.getElementById("deck-count");
const discardCountEl = document.getElementById("discard-count");
const modsEl = document.getElementById("mods");
const challengeCardEl = document.getElementById("challenge-card");
const logEl = document.getElementById("log");
const drawButton = document.getElementById("draw-button");
const endTurnButton = document.getElementById("end-turn");
const restartButton = document.getElementById("restart");
const rewardOverlay = document.getElementById("reward-overlay");
const rewardOptionsEl = document.getElementById("reward-options");
const rewardDescriptionEl = document.getElementById("reward-description");
const continueButton = document.getElementById("continue-button");
const gameOverOverlay = document.getElementById("gameover-overlay");
const gameOverText = document.getElementById("gameover-text");
const playAgainButton = document.getElementById("play-again");

function createCard(id) {
  const template = CARD_LIBRARY[id];
  return {
    id,
    name: template.name,
    type: template.type,
    cost: template.cost,
    description: template.description,
    play: template.play,
    uid: `${id}-${Math.random().toString(36).slice(2, 8)}`,
  };
}

function buildStartingDeck() {
  const starter = [
    "neon-strike",
    "neon-strike",
    "neon-strike",
    "hack-surge",
    "hack-surge",
    "shield-loop",
    "shield-loop",
    "med-patch",
    "overclock",
    "data-leech",
    "pulse-blade",
  ];
  return starter.map(createCard);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function drawCards(gameState, amount) {
  for (let i = 0; i < amount; i += 1) {
    if (gameState.player.deck.length === 0) {
      if (gameState.player.discard.length === 0) {
        return;
      }
      gameState.player.deck = gameState.player.discard.splice(0);
      shuffle(gameState.player.deck);
      logMessage("Deck reshuffled from discard.");
    }
    const card = gameState.player.deck.shift();
    gameState.player.hand.push(card);
  }
  updateDeckCounts(gameState);
  renderHand(gameState);
}

function dealDamage(gameState, amount, message) {
  const bonus = gameState.challenge.exposed;
  const finalAmount = Math.max(0, amount + bonus);
  gameState.challenge.integrity -= finalAmount;
  if (bonus > 0) {
    logMessage(`Expose bonus bleeds ${bonus} extra integrity.`);
    gameState.challenge.exposed = Math.max(0, gameState.challenge.exposed - 1);
  }
  logMessage(`${message} (-${finalAmount} integrity)`);
  if (gameState.challenge.integrity <= 0) {
    logMessage(`${gameState.challenge.name} collapses.`);
    handleChallengeDefeated(gameState);
  }
  updateChallenge(gameState);
  return finalAmount;
}

function logMessage(text) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.textContent = text;
  logEl.prepend(entry);
}

function updateStats(gameState) {
  hpEl.textContent = `${gameState.player.hp} / ${gameState.player.maxHp}`;
  shieldEl.textContent = gameState.player.shield;
  energyEl.textContent = `${gameState.player.energy} / ${gameState.player.maxEnergy}`;
  updateDeckCounts(gameState);
  updateModsUI(gameState);
}

function updateDeckCounts(gameState) {
  deckCountEl.textContent = gameState.player.deck.length;
  discardCountEl.textContent = gameState.player.discard.length;
}

function updateModsUI(gameState) {
  const mods = [];
  if (gameState.player.mods.permaShield > 0) {
    mods.push(`Aegis +${gameState.player.mods.permaShield}`);
  }
  modsEl.textContent = mods.join(", ");
}

function renderHand(gameState) {
  handEl.innerHTML = "";
  gameState.player.hand.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.innerHTML = `
      <div class="cost">${card.cost}</div>
      <div class="title">${card.name}</div>
      <div class="type">${card.type}</div>
      <div class="description">${card.description}</div>
    `;
    cardEl.addEventListener("click", () => playCard(gameState, index));
    handEl.appendChild(cardEl);
  });
}

function updateChallenge(gameState) {
  if (!gameState.challenge) {
    challengeCardEl.innerHTML = `<p class="challenge-lore">No active threat.</p>`;
    return;
  }
  const { name, integrity, damage, lore, exposed, lagTurns } = gameState.challenge;
  challengeCardEl.innerHTML = `
    <div class="challenge-name">${name}</div>
    <div class="challenge-stats">
      <span>Integrity: ${Math.max(0, integrity)}</span>
      <span>Damage: ${Math.max(0, damage)}</span>
      <span>Expose: ${exposed}</span>
      <span>Lag: ${lagTurns}</span>
    </div>
    <div class="challenge-lore">${lore}</div>
  `;
}

function playCard(gameState, handIndex) {
  if (gameState.awaitingReward) {
    return;
  }
  const card = gameState.player.hand[handIndex];
  if (!card) return;
  if (card.cost > gameState.player.energy) {
    logMessage("Not enough juice to play that card.");
    return;
  }
  gameState.player.energy -= card.cost;
  gameState.player.hand.splice(handIndex, 1);
  gameState.player.discard.push(card);
  card.play(gameState);
  renderHand(gameState);
  updateStats(gameState);
}

function startChallenge(gameState) {
  if (gameState.challengeDeck.length === 0) {
    victory(gameState);
    return;
  }
  const next = gameState.challengeDeck.shift();
  gameState.challenge = {
    ...next,
    exposed: 0,
    lagTurns: 0,
  };
  logMessage(`New encounter: ${gameState.challenge.name}.`);
  updateChallenge(gameState);
  startTurn(gameState);
}

function startTurn(gameState) {
  gameState.turnHasJackIn = false;
  gameState.player.energy = gameState.player.maxEnergy;
  gameState.player.shield += gameState.player.mods.permaShield;
  discardHand(gameState);
  drawCards(gameState, 5);
  logMessage("New turn. Hand refreshed.");
  updateStats(gameState);
  endTurnButton.disabled = false;
}

function discardHand(gameState) {
  if (gameState.player.hand.length > 0) {
    gameState.player.discard.push(...gameState.player.hand);
    gameState.player.hand = [];
  }
}

function jackIn(gameState) {
  if (gameState.awaitingReward) {
    return;
  }
  if (gameState.turnHasJackIn) {
    logMessage("Neural link already hot this turn.");
    return;
  }
  drawCards(gameState, 1);
  gameState.turnHasJackIn = true;
  logMessage("Quick jack-in draws one more option.");
}

function endTurn(gameState) {
  if (gameState.awaitingReward) {
    return;
  }
  discardHand(gameState);
  gameState.player.energy = 0;
  resolveChallengeAttack(gameState);
  if (gameState.player.hp > 0) {
    startTurn(gameState);
  }
}

function resolveChallengeAttack(gameState) {
  if (!gameState.challenge) return;
  let damage = gameState.challenge.damage;
  if (gameState.challenge.lagTurns > 0) {
    damage = Math.max(0, damage - 2);
    gameState.challenge.lagTurns -= 1;
  }
  if (damage <= 0) {
    logMessage(`${gameState.challenge.name} sputters, dealing no damage.`);
    updateChallenge(gameState);
    return;
  }
  let mitigated = Math.max(0, damage - gameState.player.shield);
  const shieldSpent = Math.min(gameState.player.shield, damage);
  gameState.player.shield = Math.max(0, gameState.player.shield - damage);
  if (shieldSpent > 0) {
    logMessage(`Shield absorbs ${shieldSpent} damage.`);
  }
  if (mitigated > 0) {
    gameState.player.hp -= mitigated;
    logMessage(`${gameState.challenge.name} hits for ${mitigated}.`);
    if (gameState.player.reflect > 0) {
      const reflectDamage = gameState.player.reflect;
      logMessage(`Feedback Field returns ${reflectDamage} damage.`);
      dealDamage(gameState, reflectDamage, "Reflection feedback");
      gameState.player.reflect = 0;
    }
    if (gameState.player.hp <= 0) {
      gameState.player.hp = 0;
      gameOver(gameState, `${gameState.challenge.name} shuts you down.`);
    }
  }
  updateStats(gameState);
}

function handleChallengeDefeated(gameState) {
  if (!gameState.challenge) return;
  gameState.awaitingReward = true;
  gameState.challenge = null;
  presentRewards(gameState);
  updateChallenge(gameState);
}

function presentRewards(gameState) {
  rewardOptionsEl.innerHTML = "";
  rewardDescriptionEl.textContent = "Pick one upgrade to shape your run.";
  const options = pickRewards(3);
  gameState.currentRewards = options;
  options.forEach((reward, index) => {
    const optionEl = document.createElement("div");
    optionEl.className = "reward-card";
    optionEl.innerHTML = `
      <div class="title">${reward.name}</div>
      <div class="description">${reward.description}</div>
    `;
    optionEl.addEventListener("click", () => selectReward(gameState, index));
    rewardOptionsEl.appendChild(optionEl);
  });
  continueButton.disabled = true;
  rewardOverlay.classList.remove("hidden");
}

function pickRewards(count) {
  const shuffled = [...REWARDS];
  shuffle(shuffled);
  return shuffled.slice(0, count);
}

function selectReward(gameState, index) {
  const children = Array.from(rewardOptionsEl.children);
  children.forEach((child, idx) => {
    if (idx === index) {
      child.classList.add("selected");
    } else {
      child.classList.remove("selected");
    }
  });
  gameState.selectedRewardIndex = index;
  continueButton.disabled = false;
}

function claimReward(gameState) {
  const reward = gameState.currentRewards?.[gameState.selectedRewardIndex];
  if (!reward) return;
  reward.apply(gameState);
  gameState.awaitingReward = false;
  rewardOverlay.classList.add("hidden");
  gameState.selectedRewardIndex = null;
  gameState.currentRewards = [];
  updateStats(gameState);
  startChallenge(gameState);
}

function victory(gameState) {
  gameOver(gameState, "You cleaved through every security dream. Night city whispers your name.");
}

function gameOver(gameState, text) {
  gameState.awaitingReward = true;
  endTurnButton.disabled = true;
  drawButton.disabled = true;
  gameOverText.textContent = text;
  gameOverOverlay.classList.remove("hidden");
}

function restart(gameState) {
  gameOverOverlay.classList.add("hidden");
  rewardOverlay.classList.add("hidden");
  logEl.innerHTML = "";
  Object.assign(gameState.player, {
    maxHp: 28,
    hp: 28,
    shield: 0,
    energy: 3,
    maxEnergy: 3,
    deck: buildStartingDeck(),
    discard: [],
    hand: [],
    reflect: 0,
    mods: { permaShield: 0 },
  });
  gameState.challengeDeck = [...CHALLENGES].map((challenge) => ({ ...challenge }));
  shuffle(gameState.challengeDeck);
  gameState.challenge = null;
  gameState.awaitingReward = false;
  drawButton.disabled = false;
  endTurnButton.disabled = false;
  updateStats(gameState);
  updateChallenge(gameState);
  startChallenge(gameState);
}

drawButton.addEventListener("click", () => jackIn(state));
endTurnButton.addEventListener("click", () => endTurn(state));
continueButton.addEventListener("click", () => claimReward(state));
restartButton.addEventListener("click", () => restart(state));
playAgainButton.addEventListener("click", () => restart(state));

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => restart(state));
} else {
  restart(state);
}
