var intervalo = null;
var porcentaje = 0;
var INITIAL_GAS = 70;
var ControlesLayer = cc.Layer.extend({
    etiquetaMonedas: null,
    monedas: 0,
    metros: 0,
    spriteMarcadorMonedas: null,
    spriteBanderaMeta: null,
    spriteBidonGasolina: null,
    barraGasolina: null,
    mouseDown: false,
    ctor: function () {
        this._super();
        var size = cc.winSize;

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

        // Barra gasolina
        this.spriteBidonGasolina = cc.Sprite.create(res.gas_tank);
        this.spriteBidonGasolina.setPosition(
            cc.p(size.width * 0.03, size.height * 0.86));
        this.barraGasolina = ccui.LoadingBar.create();
        this.barraGasolina.loadTexture(res.progressBar_png);
        this.barraGasolina.setPercent(INITIAL_GAS);
        this.barraGasolina.x = size.width * 0.15;
        this.barraGasolina.y = size.height * 0.86;
        this.addChild(this.spriteBidonGasolina);
        this.addChild(this.barraGasolina);

        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp
        }, this)

        return true;
    },
    actualizarGasolina: function () {
        porcentaje++;
        if (porcentaje % 25 === 0) {
            this.barraGasolina.setPercent(this.barraGasolina.getPercent() - 1);
        }
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
        this.monedas = 0;
        this.etiquetaMonedas.setString(this.monedas);
        this.metros = 0;
        this.etiquetaMetros.setString(this.metros);
        this.barraGasolina.setPercent(INITIAL_GAS);
    },
    incrementarGasolina: function () {
        if (this.barraGasolina.getPercent() >= 70) {
            this.barraGasolina.setPercent(100);
        } else {
            this.barraGasolina.percent += 30;
        }
    },
    getBarraGasolina() {
        return this.barraGasolina;
    },
});