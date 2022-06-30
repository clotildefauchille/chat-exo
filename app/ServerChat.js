const User = require('./User.js');
const Message = require('./Message.js');
const Channel = require('./Channel.js');
const smile = require ('smile2emoji');

module.exports = class ServerChat {

    constructor(server) {
        this.users = [];
        this.messages =[];
        this.channels = [
            new Channel('Général', false),
            new Channel('Programmation', false),
            new Channel('Jeux Vidéo', false),
        ];
        this.io = require('socket.io')(server);
        //this.io.on('connection', function(socket) { this.onConnection.bind(this, socket)});
        this.io.on('connection', (socket) => { this.onConnection(socket); });
    }

    onConnection(socket) {
        socket.on('client:user:pseudo', this.choicePseudo.bind(this, socket));
        socket.on('disconnect', this.disconnected.bind(this, socket));
        socket.on('client:user:disconnect', () => { this.disconnected(socket);});
        socket.on('client:message:send', this.receivedMessage.bind(this, socket));
        let allChannelPublic = this.channels.filter(channel => channel.isPrivate==false);
        // console.log("allCannelpublic", allChannelPublic)
        socket.emit('server:channel:list', allChannelPublic.map(channel => channel.name));
        socket.on('client:channel:change',  this.joinChannel.bind(this, socket));
        //par default l'utilisateur connecté est sur le channel général
        socket.on('client:message:typing',  this.userTypingChannel.bind(this, socket));
        socket.on('client:user:click', this.createPrivateChannel.bind(this, socket));

    }

    choicePseudo(socket, pseudo) {
        if (this.users.find(user => user.pseudo == pseudo)) {
            socket.emit('server:user:pseudo_exists');
        }
        else {
            socket.user = new User(socket.id, pseudo, "Général");
            
            this.users.push(socket.user);
            socket.emit('server:user:connected');
            this.io.emit('server:user:list', this.users.map(user => user));
            this.joinChannel(socket, 'Général');
            console.log(socket.user)
        }
    }


    disconnected(socket) {
        if (socket.user != undefined && socket.user.pseudo != undefined) {
            let index = this.users.findIndex(user => user.pseudo == socket.user.pseudo);
            if (index != -1) {
                this.users.splice(index, 1);
                this.io.emit('server:user:list', this.users.map(user => user));
            }
            socket.emit('server:user:disconnect');
        }
    }


    receivedMessage(socket, message) {
        message= smile.checkText(message, socket);
        console.log("message", message);
        let msg = new Message(socket.user.pseudo, message)
        //stokage du message dans l'objet channel correspondant
        let channel = this.channels.find(channel=>channel.name == socket.user.channel);
        // console.log("channel in receivemsg", channel);
        channel.addMessage(msg);

        this.io.in(socket.user.channel).emit('server:message:send', {
            "author": msg.author,
            "message": msg.message,
            "time": msg.time,
        })
    }

    joinChannel(socket, channelName) {
        // on vérifie que le salon existe
        // console.log("channelName, socket.user.channel", channelName, socket.user.channel)
        let index = this.channels.findIndex(channel => channel.name == channelName);
        //quand la personne se connecte à une room elle quitte la room precedente
        if (index != -1) {
            socket.leave(socket.user.channel);
            socket.user.channel = channelName;
            socket.join(socket.user.channel);
            let channel = this.channels[index];
            let messages = channel.messages.map((message)=>{
                return {
                    "author": message.author,
                    "message": message.message,
                    "time": message.time,
                }
            })
            socket.emit('server:messages:send', messages);
            this.io.emit('server:user:list', this.users.map(user => user));
        } else {
            console.log(`le client ${socket.id} (pseudo : ${socket.user.pseudo}) a
                      tenté une connexion sur un salon inexistant`);
        }
    }

    createPrivateChannel(socket, user, id){
     // Vérifier que le user existe dans le tableau users et que ce ne soit pas lui même (socket)
        if(this.users.includes(socket.user)&&socket.user.id!==id){
        //  On crée un nouveau channel (true = private)
        let newPrivateChannel = new Channel(`discussion entre ${socket.user.pseudo} et ${user}`, true);
        // on pousse le nouveau channel dans la liste de tout les channels (il est en privé)
        this.channels.push(newPrivateChannel);
        // On ajoute à l'utilisateur (initiateur) le channel private
        socket.user.addPrivateChannel(newPrivateChannel);
        // On ajoute à notre utilisateur le channel private
        this.users.filter(user => user.id == id)[0].addPrivateChannel(newPrivateChannel);
        /*
        console.log("socket, user", socket.user, user, id);
        let myNewChannel = `Discussion privé avec ${user}`;
        let newChannelForSecondUser = `Discussion privé avec ${socket.user.pseudo}`
        //TODO ajouter condition si channel n'existe pas deja
        this.channels.push(new Channel(myNewChannel, true));
        this.channels.push(new Channel(newChannelForSecondUser, true));
        // console.log("this.channels", this.channels);
        let listWithoutNewChannelForSecondUser = this.channels.filter(channel => channel.name!==newChannelForSecondUser);
        let listWithoutmyNewChannel = this.channels.filter(channel => channel.name!==myNewChannel);
        // console.log("listWithoutNewChannelForSecondUser", listWithoutNewChannelForSecondUser);
        */

        let publicChannels = this.channels.filter(channel => channel.isPrivate==false).map(channel => channel.name)
        let myChannels = socket.user.privateChannels.map(channel => channel.name);
        let hisChannels = this.users.filter(user => user.id == id)[0].privateChannels.map(channel => channel.name);
        // console.log(publicChannels, myChannels)
        this.io.to(socket.user.id).emit('server:channel:list', publicChannels.concat(myChannels));
        this.io.to(id).emit('server:channel:list', publicChannels.concat(hisChannels));

        }else{
            console.log("no")
        }
   
    }


    userTypingChannel(socket, status){
       // on met à jour le status de l'utilsateur

       console.log("status in method", status, socket.user);
        socket.user.isTyping=status;
    
    //    on envoi l'info au utilisateur du meme salon
       this.io.in(socket.user.channel).emit('server:user:typing_list', 
       // on filtre les users du channel en trzin d'ecrire
           
           this.users.filter(user => { return user.channel == socket.user.channel && user.isTyping == true})
       )
    }

}
