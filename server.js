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
        const roomId = parseInt(urlParts[2]);
        const currentRoom = player.currentRoom;
        if (roomId === currentRoom.id) {
          const roomName = currentRoom.name;
          const exits = currentRoom.exitsToString();
          const roomItems = currentRoom.itemsToString();

          const inventory = player.inventoryToString();
          let roomHtml = fs.readFileSync('./views/room.html', 'utf-8');
          roomHtml = roomHtml.replaceAll('#{roomName}', roomName);
          roomHtml = roomHtml.replace('#{roomItems}', roomItems);
          roomHtml = roomHtml.replace('#{inventory}', inventory);
          roomHtml = roomHtml.replace('#{roomId}', roomId);
          roomHtml = roomHtml.replace('#{exits}', exits);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.write(roomHtml);
          return res.end();
        } else {
          res.statusCode = 302;
          res.setHeader('Location', `/rooms/${currentRoom.id}`);
          res.setHeader('Content-Type', 'text/html');

          return res.end();
        }
      } else if (urlParts.length === 4) {
        const roomId = parseInt(urlParts[2]);
        const direction = urlParts[3];
        const currentRoom = player.currentRoom;
        if (roomId === currentRoom.id) {
          try {
            player.move(direction[0]);
            const newRoom = player.currentRoom;
            res.statusCode = 302;
            res.setHeader('Location', `/rooms/${newRoom.id}`);
            res.setHeader('Content-Type', 'text/html');
            return res.end();
          } catch (error) {
            const newRoom = player.currentRoom;
            res.statusCode = 302;
            res.setHeader('Location', `/rooms/${newRoom.id}`);
            res.setHeader('Content-Type', 'text/html');
          }
        } else {
          res.statusCode = 302;
          res.setHeader('Location', `/room/${currentRoom.id}`);
          res.setHeader('Content-Type', 'text/html');
          return res.end();
        }
      }
    } else if (req.url.startsWith('/items/')) {
      let urlParts = req.url.split('/');
      if (urlParts.length === 4) {
        const itemId = parseInt(urlParts[2]);
        const action = urlParts[3];
        try {
          switch (action) {
            case 'eat':
              player.eatItem(itemId);
              break;
            case 'take':
              player.takeItem(itemId);
              break;
            case 'drop':
              player.dropItem(itemId);
              break;
            default:
              break;
          }
          const newRoom = player.currentRoom;
          res.statusCode = 302;
          res.setHeader('Location', `/rooms/${newRoom.id}`);
          res.setHeader('Content-Type', 'text/html');
        } catch (error) {
          const newRoom = player.currentRoom;
          let errorPage = fs.readFileSync('./views/error.html', 'utf-8');
          errorPage = errorPage.replace('#{errorMessage}', error.message);
          errorPage = errorPage.replace('#{roomId}', newRoom.id);
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html');
          res.write(errorPage);
          return res.end();
        }
      }
      const newRoom = player.currentRoom;
      res.statusCode = 302;
      res.setHeader('Location', `/rooms/${newRoom.id}`);
      res.setHeader('Content-Type', 'text/html');
      return res.end();
    } else if (req.method == 'GET' && req.url == '/views/static/common.css') {
      let roomCss = fs.readFileSync('./views/assets/css/common.css', 'utf-8');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/css');
      res.write(roomCss);
      return res.end();
    } else {
      const newRoom = player.currentRoom;
      res.statusCode = 302;
      res.setHeader('Location', `/rooms/${newRoom.id}`);
      res.setHeader('Content-Type', 'text/html');
      return res.end();
    }
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
