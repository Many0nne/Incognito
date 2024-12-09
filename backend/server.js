const express = require('express'); // express permet de construire une API
const http = require('http'); //
const { Server } = require('socket.io'); // permet de connecter les utilisateurs par le biais d'une room
const cors = require('cors'); // méthode de vérification de point d'entrée

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:4200", "https://zbbpq4x1-4200.uks1.devtunnels.ms"], // URL de ton frontend Angular
        methods: ["GET", "POST"]
    }
});

const rooms = {}; // Stocke les joueurs par room

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`); // l'utilisateur suivant est connecté

    // Rejoindre une room
    socket.on('joinRoom', ({ username, room }) => { // assigne l'utilisateur à la room
        socket.join(room);

        // Ajout du joueur dans la room
        if (!rooms[room]) rooms[room] = [];
        rooms[room].push({ id: socket.id, username });

        console.log(`${username} joined room: ${room}`);
        io.to(room).emit('updatePlayers', rooms[room]);
    });

    // Gestion des messages
    socket.on('sendMessage', ({ room, sender, text }) => {
        // Envoyer le message à tous les utilisateurs de la room
        io.to(room).emit('receiveMessage', { sender, text });
        console.log(`Message from ${sender} in ${room}: ${text}`);
    });
    
    // Déconnexion
    socket.on('disconnect', () => { // supprime l'utilisateur de la room
        for (const room in rooms) {
            rooms[room] = rooms[room].filter(player => player.id !== socket.id);
            io.to(room).emit('updatePlayers', rooms[room]);
        }
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = 3000; // l'api utilise  le port 3000
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
