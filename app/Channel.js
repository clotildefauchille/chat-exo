module.exports = class Channel {
    constructor(name, isPrivate = false) {
        this.name = name;
        this.messages = [];
        this.isPrivate=isPrivate;
        this.usersName = []; // uniquement les pseudos
    }

    addMessage(message){
        //on limite à 100 msg/channel
        while(this.messages.length>=100){
            this.messages.shift();
        }
        this.messages.push(message);
    }
}
