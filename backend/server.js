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
const answers = {}; // Stocke les réponses des joueurs
const pseudos = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa"]; // Liste des pseudos

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`); // l'utilisateur suivant est connecté

    // Rejoindre une room
    socket.on('joinRoom', ({ username, pseudo, room }) => { // assigne l'utilisateur à la room
        socket.join(room);

        // Ajout du joueur dans la room
        if (!rooms[room]) rooms[room] = [];

        // Assigner un pseudo aléatoire si aucun n'est fourni
        if (!pseudo) pseudo = pseudos[Math.floor(Math.random() * pseudos.length)];

        // Définir le premier joueur comme admin
        const isHost = rooms[room].length === 0; // si la room est vide, le joueur est l'admin
        rooms[room].push({ id: socket.id, username, pseudo, isHost }); 

        console.log(`${pseudo} joined room: ${room} as ${isHost ? 'host' : 'player'}`);
        io.to(room).emit('updatePlayers', rooms[room]);
    });

    // Gestion des messages
    socket.on('sendMessage', ({ room, sender, text }) => {
        // Envoyer le message à tous les utilisateurs de la room
        io.to(room).emit('receiveMessage', { sender, text });
        console.log(`Message from ${sender} in ${room}: ${text}`);

        // Stocker la réponse
        if (!answers[room]) answers[room] = {};
        answers[room][sender] = text;

        // Vérifier si tous les joueurs ont répondu
        if (Object.keys(answers[room]).length === rooms[room].length) {
            // Réinitialiser les réponses pour la prochaine question
            answers[room] = {};
            // Envoyer la prochaine question
            io.to(room).emit('nextQuestion');
        }
    });

    // Démarrer le jeu
    socket.on('startGame', ({ room }) => {
        io.to(room).emit('gameStarted');
        console.log(`Game started in room: ${room}`);
    });

    // Envoyer une question
    socket.on('sendQuestion', ({ room, question }) => {
        io.to(room).emit('receiveQuestion', question);
    });

    // Terminer le jeu et envoyer les informations des joueurs
    socket.on('endGame', ({ room }) => {
        const players = rooms[room] || [];
        io.to(room).emit('gameEnded', { players });
        console.log(`Game ended in room: ${room}`);
        console.log(players);
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
