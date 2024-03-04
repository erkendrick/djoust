Djoust is a web-based multiplayer game influenced by the arcade classic Joust. It is developed with vanilla JavaScript for the frontend and Node.js, Express, and Socket.IO libraries handling the backend functionalities. 
The primary goal is to create a lightweight, anonymous multiplayer experience. The application is currently in alpha stages of development.

Latest developments:
Established game environment with server authoritative state updates.
  client side handles rendering gameplay and emitting movement commands to the server.
  server handles receiving movement and network commands from the client and emits modified player state at a fixed interval, currently 64 tick, via websocket connection.
Single player session
1v1 duel with other users through a simple matchmaking queue. 

local network duel testing:
![Gameplay Example](assets/gameplay.gif)

player collision:
![player collision](assets/playerPlayerCollision.gif)
![weapon collision](assets/weaponWeaponCollision.gif)
weapon collision with platform:
![platform collision](assets/weaponPlatformCollision.gif)

Future Development Roadmap:

minimize influence of network latency on game frame rendering. 
  last test with ngrok tunnel went as expected.
  Network latency is noticeably sluggish and making the game run smoothly on network is the biggest hurdle before deployment. 

Improve UX between single player and duel states.

expand single player experience. 
  Add bots and visually track player bot kills and player deaths. 

Acquire a domain and figure out the best platform for cloud hosting. 

Explore user authorization and build a database for retaining user sessions and statistics. 
  Create a live leaderboard. 
  Allow users to create custom duel rooms for private matches. 
