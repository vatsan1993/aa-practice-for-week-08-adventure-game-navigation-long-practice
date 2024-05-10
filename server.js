const http = require('http');
const fs = require('fs');

const { Player } = require('./game/class/player');
const { World } = require('./game/class/world');

const worldData = require('./game/data/basic-world-data');

let player;
let world = new World();
world.loadWorld(worldData);

const server = http.createServer((req, res) => {
  /* ============== ASSEMBLE THE REQUEST BODY AS A STRING =============== */
  let reqBody = '';
  req.on('data', (data) => {
    reqBody += data;
  });

  req.on('end', () => {
    // After the assembly of the request body is finished
    /* ==================== PARSE THE REQUEST BODY ====================== */
    if (reqBody) {
      req.body = reqBody
        .split('&')
        .map((keyValuePair) => keyValuePair.split('='))
        .map(([key, value]) => [key, value.replace(/\+/g, ' ')])
        .map(([key, value]) => [key, decodeURIComponent(value)])
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    }

    console.log(`${req.method} ${req.url}`);
    /* ======================== ROUTE HANDLERS ========================== */
    // Phase 1: GET /
    if (req.url == '/' && req.method == 'GET') {
      let newPlayerHtml = fs.readFileSync('./views/new-player.html', 'utf-8');
      newPlayerHtml = newPlayerHtml.replace(
        '#{availableRooms}',
        world.availableRoomsToString()
      );
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.write(newPlayerHtml);
      return res.end();
    } else if (req.url === '/player' && req.method === 'POST') {
      const { name, roomId } = req.body;
      const startingRoom = world.rooms[roomId];
      player = new Player(name, startingRoom);

      res.statusCode = 302;
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Location', `/rooms/${roomId}`);
      return res.end();
    } else if (req.method == 'GET' && req.url.startsWith('/rooms')) {
      let urlParts = req.url.split('/');
      if (urlParts.length === 3) {
        const roomId = urlParts[2];
        const currentRoom = player.currentRoom;
        const roomName = currentRoom.name;
        const exists = currentRoom.exitsToString();
        const roomItems = currentRoom.itemsToString();
        const inventory = player.inventoryToString();
        let roomHtml = fs.readFileSync('./views/room.html', 'utf-8');
        roomHtml = roomHtml.replaceAll('#{roomName}', roomName);
        roomHtml = roomHtml.replace('#{roomItems}', roomItems);
        roomHtml = roomHtml.replace('#{inventory}', inventory);
        roomHtml = roomHtml.replace('#{roomId}', roomId);
        roomHtml = roomHtml.replace('#{exists}', exists);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.write(roomHtml);
        return res.end();
      }
    } else {
      console.log('not matching');
      return res.end();
    }

    // Phase 2: POST /player

    // Phase 3: GET /rooms/:roomId

    // Phase 4: GET /rooms/:roomId/:direction

    // Phase 5: POST /items/:itemId/:action

    // Phase 6: Redirect if no matching route handlers
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
