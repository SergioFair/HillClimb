var ControlesLayer = cc.Layer.extend({
    etiquetaMonedas: null,
    monedas: 0,
    spriteBotonAcelerar: null,
    spriteBotonFrenar: null,
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
        this.etiquetaMonedas = new cc.LabelTTF("Monedas: 0", "Helvetica", 20);
        this.etiquetaMonedas.setPosition(cc.p(size.width - 90, size.height - 20));
        this.etiquetaMonedas.fillStyle = new cc.Color(0, 0, 0, 0);
        this.addChild(this.etiquetaMonedas);

        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.onMouseDown,
            onMouseMove: this.onMouseMove
        }, this)

        return true;


    }, agregarMoneda: function () {
        this.monedas = this.monedas + 1;
        this.etiquetaMonedas.setString("Monedas: " + this.monedas);
    },onMouseDown: function(event){
        this.onMouseMove(event);
    }, onMouseMove: function (event) {
        var instancia = event.getCurrentTarget();
        var areaBotonAcelerar = instancia.spriteBotonAcelerar.getBoundingBox();
        var areaBotonFrenar = instancia.spriteBotonFrenar.getBoundingBox();
        var posicionXEvento = event.getLocationX(), posicionYEvento = event.getLocationY();

        // La pulsación cae dentro del botón
        if (cc.rectContainsPoint(areaBotonAcelerar,
            cc.p(posicionXEvento, posicionYEvento))) {

            // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
            var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
            // tenemos el objeto GameLayer
            gameLayer.jugador.moverDerecha();

        } else if (cc.rectContainsPoint(areaBotonFrenar
            , cc.p(posicionXEvento, posicionYEvento))) {

            // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
            var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
            // tenemos el objeto GameLayer
            gameLayer.jugador.moverIzquierda();
        }
    }
});
