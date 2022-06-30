

export default class UserInterface {

    // constructor(){
    //     this.provider = new firebase.auth.GoogleAuthProvider();
    // }
  //ici on met tous ce qui est visuel pour l'app, pas de socket emit
  pseudoChoice(alertPseudo = false) {
    if (alertPseudo === true)
      alert(`Choisissez un autre pseudo, celui ci est déjà utilisé !`);
  }

  listenInterface() {
    let connection = document.getElementById("connection");
    let favDialog = document.getElementById("favDialog");
    connection.addEventListener("click", () => {
      if (typeof favDialog.showModal === "function") {
        favDialog.showModal();
      } else {
        console.error(
          "L'API <dialog> n'est pas prise en charge par ce navigateur."
        );
      }
    });
    let deconnection = document.getElementById("deconnection");
    deconnection.addEventListener("click", (e) => {
      // console.log('je veux me deco');
      document.dispatchEvent(new CustomEvent("local:deconnect:send"));
    });




  }
  connectUser() {
    // console.log('je suis autentifiee')
    document.querySelectorAll("#connection").forEach((element) => {
      element.classList.add("d-none");
    });
    document.getElementById("firebase").classList.add("d-none");
    document.querySelectorAll("#deconnection").forEach((element) => {
      element.classList.remove("d-none");
    });
    document.querySelector('#allContent').classList.remove("d-none");
  }
 
disconnectUser (){
    document.getElementById("firebase").classList.remove("d-none");

    document.querySelectorAll("#connection").forEach((element) => {
        element.classList.remove("d-none");
    });
    document.querySelectorAll("#deconnection").forEach((element) => {
        element.classList.add("d-none");
    });
    document.querySelector('#allContent').classList.add("d-none");

}
  listUsers(users) {
    document.querySelector(".list-title").innerHTML = "Les utilisateurs";
    document.querySelector("#listingUsers").innerHTML = "";
    //verifie si le navigateur reconnai <template> html5
    console.log("users", users)
    if ("content" in document.createElement("template")) {
      let template = document.querySelector("#usersTpl");
      users.forEach((user) => {
        let clone = document.importNode(template.content, true);
        clone.querySelector("li span.name").innerHTML = `${user.pseudo} (${user.channel})`;
        clone.querySelector("li").dataset.pseudo = `${user.pseudo}`;
        document.querySelector("#listingUsers").appendChild(clone);
        document.querySelector(`li[data-pseudo="${user.pseudo}"]`).addEventListener("click", (e)=>{
            console.log("hello user", user.pseudo);
            document.dispatchEvent(
                new CustomEvent("local:user:click", { detail: {user: user.pseudo, id: user.id} })
            );

        })
      });
    }
  }
  listChannels(channels) {
    document.querySelector("#channel-title").innerHTML = "Les Channels";
    document.querySelector("#listingChannels").innerHTML = "";
    if ("content" in document.createElement("template")) {
      let template = document.querySelector("#channelsTpl");
      channels.forEach((name) => {
        let clone = document.importNode(template.content, true);
        clone.querySelector("a").innerHTML = name;
        clone.querySelector("a").dataset.channel = `${name}`;
        document.querySelector("#listingChannels").appendChild(clone);
      });
    }
    // changement de salon
    document.querySelectorAll("#listingChannels a").forEach((element) => {
      element.addEventListener("click", (e) => {
        console.log("click on channel ", e.currentTarget.textContent);
        // console.log('click on target', e.currentTarget.dataset.channel);
          document.querySelectorAll("#listingChannels a").forEach((a) => {a.classList.remove("text-success");})
        let channel = e.currentTarget.textContent;
        document.querySelector(`a[data-channel="${channel}"]`).classList.add("text-success");
        document.dispatchEvent(
            new CustomEvent("local:channel:change", { detail: { channel, target: e.currentTarget.dataset.channel } })
        );
      });
    });
  }

  listenMessage() {
    document.querySelector("#createMessage").addEventListener("keyup", (e) => {
      // si l'utilisateur envoi le message (touche entrée)
      if (e.keyCode == 13) {
        let message = document.querySelector("#createMessage").value;
        console.log("hello enter", message);
        document.dispatchEvent(
          new CustomEvent("local:message:send", { detail: { message } })
        );
        // on vide le champs du message
        document.querySelector("#createMessage").value = "";
        //l'utilisateur arrete la saisie
        this.typing = false;
        window.clearTimeout(this.timerTypingTimeout);
        console.log("fin de saisie");
        // document.dispatchEvent(new CustomEvent('local:message:typing', { detail: { status: this.typing } }))
      } else {
        if (this.typing !== true) {
          this.typing = true;
          console.log("démarrage de la saisie");
          document.dispatchEvent(
            new CustomEvent("local:message:typing", {
              detail: { status: this.typing },
            })
          );
        } else {
          //sinon on supprime le precedent timer
          window.clearTimeout(this.timerTyping);
        }
        //on créer un nouveau timer au bout de 3 seconde on changera le statut à false
        this.timerTyping = window.setTimeout(() => {
          this.typing = false;
          console.log("fin de la saisie");
          document.dispatchEvent(
            new CustomEvent("local:message:typing", {
              detail: { status: this.typing },
            })
          );
        }, 3000);
      }
    });
  }

  listMessages(messages, clean = false) {
    document.querySelector("#msg-title").innerHTML = "Les Messages";

    if (clean) document.querySelector("#listingMessages").innerHTML = "";
    if ("content" in document.createElement("template")) {
      let template = document.querySelector("#messagesTpl");
      messages.forEach((message) => {
        let clone = document.importNode(template.content, true);
        clone.querySelector("td.time").innerHTML = message.time;
        clone.querySelector("td.author").innerHTML = message.author;
        clone.querySelector("td.message").innerHTML = message.message;
        document.querySelector("#listingMessages").appendChild(clone);
      });
    }
  }

  listUsersTyping(users) {
      
    document.querySelectorAll(".typing-indicator").forEach((element)  => element.classList.add("d-none"));
    if (users.length > 0) {
        users.map(user=>{ 
            document.querySelector(`li[data-pseudo="${user.pseudo}"] span.typing-indicator`).classList.remove("d-none");
        })   
    }
  }  

}
