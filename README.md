Djoust is a web-based multiplayer game influenced by the arcade classic Joust. It is developed with vanilla JavaScript for the frontend and Node.js, Express, and Socket.IO libraries handling the backend functionalities. 
The primary objective is to create an intuitive and anonymous multiplayer experience while learning about full stack application development. This application is currently in alpha stage of development.

Latest developments:
Improved boundary checks for player platform collision to prevent getting stuck or falling out of bounds when off screen. 
Made lunge movement more predictable and added a 3 second cooldown. 
Added UI for tracking bot kills and player deaths in single player and player lives remaining in a duel. 

Added the beginnings of client side rendered bots for practice when not in a duel. Bot logic is the current project focus with the goal of making bot movement unpredictable and challenging to engage with.  

Duel Start:

![Duel Start](assets/djoustDuelStart.gif)

Collision detection between players and their weapons:

![collision](assets/djoustCollisionTest.gif)

weapon collision with platform:

![platform collision](assets/djoustWeaponPlatformCollision.gif)

Future Development Roadmap:
Expand the single player experience to be more engaging with djoust combat against bots

Acquire a domain and figure out the best platform for cloud hosting. 

Explore user authorization and build a database for retaining user sessions and statistics. 
  Create a live leaderboard. 
  Allow users to create custom duel rooms for private matches. 

Expand the single player experience to be more engaging with djoust combat against bots
