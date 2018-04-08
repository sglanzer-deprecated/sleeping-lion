* Refactor (redux style centralized logic via a service)
* Necessary testing (include a scenario setter to set up the service to different conditions appropriately)
---
* Summon monsters
---
* Summon player summons - initiative just before player - e.g. Summon: "Foo" (Mindthief)
---
* Draw from the monster attack modifier deck (with advantage/disadvantage)
* Shuffle the monster attack modifier deck when required (round if null/crit, turn if the deck is empty)
---
* Player exhaustion
---
* Manage conditions with respect to turn/round
* Manage the impact of conditions on other actions (muddle -> disadvantage, stun -> turn loss, immobilize -> no move, disarm -> no attack, wound -> hp loss, poison -> dmg +1 poison shown on the dmg selectors, etc.)
* Scenario completion
---
* Show player and monster stats (hp/conditions) during round setup (to help with card choices)
---
* Visual styling

---

* Highlight the cards for monsters revealed during the turn (past round 0)
---
* If players have equal initiative allow them to swap order during the round
* If monsters have equal initiative allow them to swap order during the round (player's choice)
