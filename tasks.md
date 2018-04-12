---
* Refactor (redux style centralized logic via a service)
---
* Summon monsters
---
* Summon player summons - initiative just before player - e.g. Summon: "Foo" (Mindthief)
* Summon death
---
* Player exhaustion
---
* Show player and monster stats (hp/conditions) during round setup (to help with card choices)
* Basic visual styling
---
* At least one scenario dictionary that we haven't done + associated monster dictionary + tiles
---

      // TODO: Clear any conditions that were present on entry and weren't renewed during the entity turn
      // set(priorEntity, 'conditions', clearedConditions)

      // TODO: Long rest (heal, prompt for redraw / exhaust)

---
* Draw from the monster attack modifier deck (with advantage/disadvantage)
* Shuffle the monster attack modifier deck when required (round if null/crit, turn if the deck is empty)
---
* Monster curses + curse limits (10)
---

---
* Manage conditions with respect to turn/round
* Manage the impact of conditions on other actions (muddle -> disadvantage, stun -> turn loss, immobilize -> no move, disarm -> no attack, wound -> hp loss, poison -> dmg +1 poison shown on the dmg selectors, etc.)

---
* Scenario completion
---

---
* Necessary testing (include a scenario setter to set up the service to different conditions appropriately)
---

---
* Highlight the cards for monsters revealed during the turn (past round 0)
---
* If players have equal initiative allow them to swap order during the round
* If monsters have equal initiative allow them to swap order during the round (player's choice)
* Place only the standees that are available, starting with the monsters closest to the revealing character
---
