import ClientChat from './ClientChat.js';


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAOtoFSP5B-T1Op9w01FWfH9ca-_S3tKRs",
    authDomain: "chat-web-socket-be3bb.firebaseapp.com",
    projectId: "chat-web-socket-be3bb",
    storageBucket: "chat-web-socket-be3bb.appspot.com",
    messagingSenderId: "415120150299",
    appId: "1:415120150299:web:be043abfea909df0d9cdbe",
    measurementId: "G-9BRQ7TKCHP"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);


new ClientChat();






// const socket = io.connect(document.location.host);


// let connection = document.getElementById('connection');
// let favDialog = document.getElementById('favDialog');
// // let confirmBtn = document.getElementById('confirmBtn');


// connection.addEventListener('click', function onOpen() {
//     if (typeof favDialog.showModal === "function") {
//         favDialog.showModal();
//     } else {
//         console.error("L'API <dialog> n'est pas prise en charge par ce navigateur.");
//     }
// });


// document.querySelectorAll(".buttonAuth").forEach((element) => {
//     console.log('confirmer button');
//     // element.addEventListener('click', pseudoChoice);
// });
// let input = document.querySelector('input');

// //recupération du pseudo 
// input.addEventListener('change', function onSelect(e) {
//     // console.log('e.target.value', e.target.value);
//     socket.emit('client:user:pseudo', e.target.value);
// });


//verification si pseudo existe
// socket.on('server:user:pseudo_exists', () => { pseudoChoice(true) })

// function pseudoChoice(alertPseudo = false) {
//     if (alertPseudo === true) alert(`Choisissez un autre pseudo, celui ci est déjà utilisé !`);
//     else{
//         input.addEventListener('change', function onSelect(e) {
//             // console.log('e.target.value', e.target.value);
//             socket.emit('client:user:pseudo', e.target.value);
//         });
//     }
//     // let user;
//     // do {     
//     //     // user = window.prompt();
//     // } while (user === '');
//     // if (user !== null) socket.emit('client:user:pseudo', user);
// }


// socket.on('server:user:connected', () => {
    // console.log('je suis autentifiee')
    // document.querySelectorAll("#connection").forEach((element) => {
    //     element.classList.add('d-none');
    // });
    // const deconnexionBtn = document.body.appendChild(document.createElement('button'));
    // console.log(deconnexionBtn)
    // deconnexionBtn.classList.add("btn");
    // deconnexionBtn.classList.add("btn-outline-success");
    // deconnexionBtn.setAttribute("id", "deconnection");
    // deconnexionBtn.innerHTML="déconnexion";
    // document.getElementById('deconnection').addEventListener('click', () => {
    //     console.log("je veux me deco");
    //     socket.emit('client:user:disconnect');
    //     document.getElementById('deconnection').classList.add('d-none');
    //     connection.classList.remove('d-none');
    // })
// });



// socket.on('server:user:list', (users) => {
//     console.log("users", users);
//     document.querySelector(".list-title").innerHTML="Les utilisateurs"
//     document.querySelector("#listingUsers").innerHTML = "";
//     //verifie si le navigateur reconnai <template> html5
//     if ("content" in document.createElement("template")) {
//         let template = document.querySelector("#usersTpl");
//         users.forEach(pseudo => {
//             let clone = document.importNode(template.content, true);
//             clone.querySelector("li").innerHTML = pseudo;
//             document.querySelector("#listingUsers").appendChild(clone);
//         });
//     }
// });




