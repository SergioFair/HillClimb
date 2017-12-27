var intervalo = null;
var ControlesLayer = cc.Layer.extend({
    etiquetaMonedas: null,
    monedas: 0,
    metros: 0,
    spriteBotonAcelerar: null,
    spriteBotonFrenar: null,
    spriteMarcadorMonedas: null,
    spriteBanderaMeta: null,
    mouseDown: false,
    ctor: function () {
        this._super();
        var size = cc.winSize;

        // BotonAcelerar
        this.spriteBotonAcelerar = cc.Sprite.create(res.gas_pedal);
        this.spriteBotonAcelerar.setPosition(
            cc.p(size.width * 0.85, size.height * 0.15));

        this.addChild(this.spriteBotonAcelerar);

        // BotonFrenar
        this.spriteBotonFrenar = cc.Sprite.create(res.brake_pedal);
        this.spriteBotonFrenar.setPosition(
            cc.p(size.width * 0.15, size.height * 0.15));

        this.addChild(this.spriteBotonFrenar);

        // Contador Monedas
        this.spriteMarcadorMonedas = cc.Sprite.create(res.moneda1_png);
        this.spriteMarcadorMonedas.setPosition(
            cc.p(cc.p(size.width - 60, size.height - 20)));
        this.etiquetaMonedas = new cc.LabelTTF("0", "Helvetica", 30);
        this.etiquetaMonedas.setPosition(cc.p(size.width - 90, size.height - 25));
        this.etiquetaMonedas.fillStyle = new cc.Color(0, 0, 0, 0);
        this.addChild(this.spriteMarcadorMonedas);
        this.addChild(this.etiquetaMonedas);

        // Contador metros
        this.spriteBanderaMeta = cc.Sprite.create(res.flag_png);
        this.spriteBanderaMeta.setPosition(
            cc.p(size.width * 0.03, size.height * 0.95));
        this.etiquetaMetros = new cc.LabelTTF("0", "Helvetica", 30);
        this.etiquetaMetros.setPosition(cc.p(size.width * 0.1, size.height * 0.95));
        this.etiquetaMetros.fillStyle = new cc.Color(0, 0, 0, 0);
        this.addChild(this.spriteBanderaMeta);
        this.addChild(this.etiquetaMetros);

        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp
        }, this)

        return true;


    },
    agregarMoneda: function () {
        this.monedas = this.monedas + 1;
        this.etiquetaMonedas.setString(this.monedas);
    },
    incrementarMetros: function (pos) {
        if (pos > this.metros) {
            this.metros = pos;
            this.etiquetaMetros.setString(this.metros + "m");
        }
    },
    resetearMarcadores: function () {
        this.etiquetaMonedas.setString(0);
        this.monedas = 0;
        this.etiquetaMetros.setString(0);
        this.metros = 0;
    },
    onMouseDown: function (event) {
        this.mouseDown = true;
        if (!this.mouseDown)
            return;
        else {
            intervalo = setInterval(function () {
                var instancia = event.getCurrentTarget();
                var areaBotonAcelerar = instancia.spriteBotonAcelerar.getBoundingBox();
                var areaBotonFrenar = instancia.spriteBotonFrenar.getBoundingBox();
                var posicionXEvento = event.getLocationX(),
                    posicionYEvento = event.getLocationY();

                // La pulsación cae dentro del botón
                if (cc.rectContainsPoint(areaBotonAcelerar,
                        cc.p(posicionXEvento, posicionYEvento))) {

                    // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
                    var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
                    // tenemos el objeto GameLayer
                    gameLayer.coche.moverDerecha();

                } else if (cc.rectContainsPoint(areaBotonFrenar, cc.p(posicionXEvento, posicionYEvento))) {

                    // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
                    var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
                    // tenemos el objeto GameLayer
                    gameLayer.coche.moverIzquierda();
                }
            }, 1);
        }
    },
    onMouseUp: function () {
        if (intervalo != null) {
            this.mouseDown = false;
            clearInterval(intervalo)
        }
    }
});