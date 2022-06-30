module.exports = class User {
    constructor(socketId, pseudo, channel) {
        this.id = socketId;
        this.pseudo = pseudo;
        this.channel = channel;
        this.isTyping= false;
        this.privateChannels=[];
    }

    addPrivateChannel(channel) {
        let index = this.privateChannels.findIndex(object=>{
            return object.name==channel.name;
        })
        if (index === -1) {
            this.privateChannels.push(channel);
        }
    }  

    removePrivateChannel(channel) {
        let index = this.privateChannels.findIndex(object=>{
            return object.name==channel.name;
        })
        if (index != -1) {
            this.privateChannels.splice(index, 1);
        }
    }  
}
