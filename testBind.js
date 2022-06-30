class Test {
    call1() {
        // Methode 1) Fonction fléchée
        setTimeout(() => this.run(), 0);
        // Methode 2) Bind du context à l'appel
        setTimeout(this.run.bind(this), 0);
        // Methode 3) Bind du context à la fonction principale
        setTimeout((function () { this.run() }).bind(this), 0);
    }
    run() {
        console.log(this)
        this.hello();
    }
    hello() {
        console.log('Bonjour le monde');
    }
}
const test = new Test();
test.call1();