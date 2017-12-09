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

        return true;

    }, agregarMoneda: function () {
        this.monedas = this.monedas + 1;
        this.etiquetaMonedas.setString("Monedas: " + this.monedas);
    }
});
