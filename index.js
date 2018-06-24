const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);

connections = [];
users = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// conenctado e desconectando aos socket e informando o numero de sockets conectados.
io.on('connection', function(socket){
    connections.push(socket);

    if (connections.length === 1) console.log('Conectado', connections.length, 'socket.')
    else console.log('conectado', connections.length, 'sockets');

    socket.on('disconnect', function(data){        
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);

    if (connections.length === 1) console.log('desconectado', connections.length, 'socket.')
        else console.log('desconectado', connections.length, 'sockets');    
    });

    socket.on('Send message', function(data){
        // console.log(data);
        io.emit('new message', {message: data, username: socket.username});
    });

    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);

        updateUsernames();        
    });

    function updateUsernames(){
        io.emit('get users', users);
    }
});


http.listen(3000, function() {
    console.log("servidor rodando")
});
