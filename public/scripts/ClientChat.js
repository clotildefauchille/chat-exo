import UI from './UserInterface.js';
//ici on gere les ecouteur d'evenemet et toute la communication avec le serveur
export default class ClientChat {

    constructor() {
        this.socket = io.connect(document.location.host);
        this.UI = new UI(this.socket);
        this.listenServer();
        this.transmitUiServer();
        this.UI.listenInterface();
        this.UI.listenMessage();
        this.transmitPseudoServer();
        this.UI.pseudoChoice();
        this.transmitMessageServer();
        this.transmitDeconnectionServer();
        this.transmitChannelServer();
        this.transmitTypingStatusServer();
        this.transmitUserDiscussionServer();
    }

    listenServer() {
        this.socket.on('server:user:pseudo_exists', this.UI.pseudoChoice.bind(this, true));
        this.socket.on('server:user:connected', this.UI.connectUser.bind(this));
        //attention au disconnect bind(this.UI) pour recupérer la valeur de this.pseudo
        this.socket.on('server:user:disconnect', this.UI.disconnectUser.bind(this.UI));
        this.socket.on('server:user:list', this.UI.listUsers.bind(this.UI));
        //reception d'un message
        //[message] pour que l'interface aussi bien qd il y a 1 ou plusieurs msg
        this.socket.on('server:message:send', (message)=>{ return this.UI.listMessages([message], false);});
        //reception de plusieurs msg
        this.socket.on('server:messages:send', (messages)=>{this.UI.listMessages(messages, true)});
        this.socket.on('server:user:pseudo_exists', () => { this.UI.pseudoChoice(true) })
        this.socket.on('server:channel:list', this.UI.listChannels);
        this.socket.on('server:user:typing_list', (users)=>this.UI.listUsersTyping(users));
    }

    transmitPseudoServer(){
        //cas connection normal
        document.addEventListener('local:user:change', (e)=>{
            // console.log("e.detail.pseudo", e.detail.pseudo);
            this.socket.emit('client:user:pseudo', e.detail.pseudo);
        })
        //cas connection via google
        document.addEventListener('local:user:google_pseudo', (e)=>{
            // console.log("e.detail.pseudo", e.detail.pseudo);
            this.socket.emit('client:user:pseudo', e.detail.pseudo);
        })  
    }

    transmitUiServer() {
        document.addEventListener('local:user:pseudo', (event) => {
            this.socket.emit('client:user:pseudo', event.detail.user);
        });
    }

    transmitMessageServer() {
        document.addEventListener('local:message:send', (event) => {
            // console.log("event.detail.message", event.detail.message)
            this.socket.emit('client:message:send', event.detail.message);
        });

    }
    transmitDeconnectionServer() {
        document.addEventListener('local:deconnect:send', () => {
            this.socket.emit('client:user:disconnect');
        });
    }
    transmitChannelServer(){
        document.addEventListener('local:channel:change', (event) => {
            // console.log("event.detail.channel", event.detail.channel);
            
            this.socket.emit('client:channel:change', event.detail.channel);
        });

    }
    transmitTypingStatusServer(){
        document.addEventListener('local:message:typing', (e)=>{ 
            // console.log("status in transmitserverstatus", e.detail.status)
            this.socket.emit('client:message:typing', e.detail.status);
        })
    }

    transmitUserDiscussionServer(){
        document.addEventListener('local:user:click', (e)=>{ 
            console.log("e.detail.user", e.detail.user)
            this.socket.emit('client:user:click', e.detail.user, e.detail.id);
        })
    }
}
