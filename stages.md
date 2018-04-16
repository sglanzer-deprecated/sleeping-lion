I'm less convinced currently that we need/want individual player control inputs - the centralized mechanism managed by a gm makes sense to me - that said there could be multiple people connected to the exact same interface - e.g. laptop on both side of the table / tablet per player.  Players would need to coordinate their usage of the interface, but I don't think that's a problem.  So there is still utility in the Couch setup, but everyone who connects to a particular scenario db would be getting the same interface.

# Session setup

* Between 2 and 4 player characters are required
* At least one controlling player is required
  * _Start with one player per player character_
* We're planning on sharing the scenario model via Couch/Pouch so we'll need a way for controlling players to connect devices
* Whoever is setting up the play session will need to create a new database in Couch, assign it an incremental id based on the previous session stored
  * _At some stage this may need some password protection_
  * _At some stage this may need to keep a limited number of databases_
* Other players connecting to the play session should be able to access the main landing page, then input the play session (database) id to connect to the play session
* When connecting the player should be required to choose a player character type (e.g. Mindthief, Scoundrel) and set their level
  * Level determines the max hp for the character and is used to recommend a monster level
* We need some way to determine when all of the characters are connected, so the creator will need to input the number of characters

# Scenario setup
* Some set of players (the creator? any player?) needs to choose the scenario
  * _Anyone for now_
* All players should be given the chance to read the scenario requirements, linked areas, map tokens, intro and goal
* Some set of players (the creator? any player?) needs to choose the monster level (recommended based on player character levels)
  * _Anyone for now_
* The monster level will determine the trap damage, gold conversion and bonus xp (keep the trap damage visible throughout the scenario)
* Proceed to the next phase when all players have confirmed the settings

# City/Road events
* _Long term we could track the city and road events in a campaign_

# Per-player battle goals
* Show each player character two battle goals (no overlap) and choose one per character, this can be held in the player's model and accessed throughout the scenario

# Map reveal (initial)
* Show the first tile(s?) for the scenario
  * _For now it's probably be easist to just capture a screenshot of the entire scenario, size it appropriately and blur/black out certain sections_
* For quick setup show the number of elite and normal standees that will be required and then break down into the standees per monster
  * _Long term it would be nice to show just the standees on the map that apply for the given number of players along with the explicit version (elite/normal)_
* The number of elite/normals for each monster are determined by the number of players
* Initially I thought it would be a good idea to just randomize the standees for the player, now I think it's probably best to just have them grab the first standees available and set the number
  * We can support both approaches, randomize would just set the toggles (no need to restrict the number of randomized clicks)
* Proceed to the next stage when all players have confirmed

# Round setup
* Show the current player/monster states (standee / hp / conditions / base stats) for reference in choosing actions
* Show the current infusion state (+ trap damage, etc. - basically anything that is a global reference)
  * _It would be nice to keep both of the above in the same location / accessible in both the round and round setup stages_
    * Probably means that this should be in a sidebar (to make it easy to port to mobile)
* All player characters need to enter initiative (keep it secret) and confirm to move to the next part of the round setup
* Once all the player initiatives are in the monster actions can be revealed and the round order setup up
  * _It doesn't seem very important to distinguish between this and the start of the round itself, but that means it needs to be quite easy to see what each monster is doing during the round and what the actual round order is_
* Given the above note we can probably move directly into the round after this

# Round

* Advantage and disadvantage don't stack and cancel out (e.g. range attack at melee range + strengthen = normal, muddle + strengthen = normal)
* I'd like to show both the initiative order and the current position in it along with the actions and current stats for each entity - it's a lot of information so we might need to acquiesce on some of that
* **Design note** I've been grouping monsters by type, it's probably a better idea to let computed properties/map/reduce fill that role and completely flatten out the monsters into an array (same structure as roundOrder basically
* As each entity comes up we want to present the available actions / suggestions
  * For monsters (and players) actions are actually resolved in order, so it might make sense to at least number 1/2/3 (check them off?) as each of the actions the requires some board/target interaction is resolved - so basically distinguishing between an attribute (include things like "on death") and the standard move/attack would make sense.  It would be nice to see self targeted elements automatically apply in order (heal/damage self, strengthen, etc.)
  * As each entity turn comes up we want to react to their conditions - so stuns would skip the turn and remove, heal reacts to poison, etc.
  * If an entity is immune to certain conditions we don't want those to be available to choose either
  * Monster infusions can be automatic, multi-color consume can be randomized
  * Monsters can summon other monster (summoning non-monster entities like traps is just a board interaction)
  * Players can summon their own pets (which act as monsters but are tied to the players and act just before their initiative in the round order)
  * Players can also reveal new rooms, which effectively acts as the reveal stage (which is a transient stage) and then transitions back to the "real" stage
    * The main difference in a mid-round reveal is that new cards can be drawn for new monsters, which I would like to highlight before they're de-emphasized in the round interface
* Otherwise, most of the round consists of targeting and applying damage, heals and effects - so we want to make that as efficient as possible
  * Targeting monsters is fairly straightforward - bulk select isn't really applicable unless we want to load a players attack modifier deck into the game (maybe that makes sense to do - especially in a campaign) - effects are just a toggle and damage is input directly (I prefer a set of **raw** damage numbers to choose from/input and allow pierce as a toggle on option)
    * Quickly selecting damage numbers without having to rely too much on an undo mechanism will be an interesting UX challenge, maybe a tick slider with confirmation in the form of pierce/non?)
  * Monster targeting could be done by bringing up some additional buttons on player entities with advantage/disadvantage/normal on each - just tap it to act on the target and display a raw result, which can be modified up/down (or toggled on/off in the case of conditons) before being confirmed
