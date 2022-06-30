const fs = require('fs');
const http = require('http');
const path = require('path');

//creation d'un serveur http sans express; pour que tout type de fichiers soient lus il faut le code ci contre avec des verfication sur l'url ( equivalent du middleware app.use(express.static('public'));)
const server = http.createServer((req, res) => {
    //pour eviter les espace remplacer par %
    req.url = decodeURI(req.url);
    // si on va sur la page d'accueil
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // Sinon si le fichier existe dans le répetoire public
    else if (fs.existsSync(path.join(__dirname, `public/${req.url}`))) {
        let file = path.join(__dirname, `public/${req.url}`);
        // On vérifie que c'est bien un fichier et qu'il ne comporte pas .. (.. permetant de remonter dans le répertoire parent)
        if (fs.lstatSync(file).isFile() && req.url.search(/\.\./) === -1) {
            fs.readFile(file, (err, data) => {
                let mimeType = 'text/html';
                switch (path.extname(file)) {
                    case '.js': mimeType = 'application/javascript'; break;
                    case '.css': mimeType = 'text/css'; break;
                    case '.jpg': mimeType = 'image/jpeg'; break;
                    case '.png': mimeType = 'image/png'; break;
                    case '.gif': mimeType = 'image/gif'; break;
                    case '.svg': mimeType = 'image/svg+xml'; break;
                    //default 
                }
                res.writeHead(200, {'Content-Type': mimeType});
                res.end(data);
            });
        }
        else {
            res.writeHead(423, { 'Content-Type': 'text/html' });
            res.end('Locked');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Not Found');
    }
});


 server.listen(8000, () => {
    console.log(`http://localhost:8000`)
});

const ServerChat = require('./app/ServerChat.js');
new ServerChat(server);


// const io = require('socket.io')(server);


// let users = ["clo", "truc", "much"];
// io.on('connection', (socket) => {
//     socket.on('client:user:pseudo', (pseudo) => {
//      console.log("un client se connecte")
//      console.log("pseudo", pseudo)
//         if (users.includes(pseudo)) {
//             socket.emit('server:user:pseudo_exists');
//         }
//         else {
//             users.push(pseudo);
//             console.log('je push le pseudo')
//             socket.emit('server:user:connected');
//             socket.pseudo = pseudo;
//             io.emit('server:user:list', users); 
//         }
//     })

    
// //TODO refacto
//     socket.on('disconnect', () => {
//         if (socket.pseudo != undefined) {
//             let index = users.indexOf(socket.pseudo);
//             if (index != -1) {
//                 users.splice(index, 1);
//                 io.emit('server:user:list', users);
//             }
//         }
//     })
//     socket.on('client:user:disconnect', () => {
//         console.log('je veux me deconnecter')
//         if (socket.pseudo != undefined) {
//             let index = users.indexOf(socket.pseudo);
//             if (index != -1) {
//                 users.splice(index, 1);
//                 io.emit('server:user:list', users);
//             }
//         }
//     })

//     console.log("users", users)
// });
