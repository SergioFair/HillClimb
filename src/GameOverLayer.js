var GameOverLayer = cc.LayerColor.extend({
    message: null,
    ctor:function (message) {
        this._super();
        this.message = message;
        this.init();
    },
    init:function () {
        this._super(cc.color(0, 0, 0, 180));

        var winSize = cc.director.getWinSize();

        var etiquetaMetros = new cc.LabelTTF("0", "Helvetica", 36);
        etiquetaMetros.setPosition(cc.p(winSize.width * 0.5, winSize.height * 0.75));
        etiquetaMetros.fillStyle = new cc.Color(200, 200, 200, 200);
        etiquetaMetros.setString(this.message);
        this.addChild(etiquetaMetros);

        var botonReiniciar = new cc.MenuItemSprite(
            new cc.Sprite(res.boton_reanudar_png),
            new cc.Sprite(res.boton_reanudar_png),
            this.pulsarReiniciar, this);

        var menu = new cc.Menu(botonReiniciar);
        menu.setPosition(winSize.width / 2, winSize.height / 2);

        this.addChild(menu);
    },
    pulsarReiniciar:function (sender) {
        // Volver a ejecutar la escena Prinicpal
        cc.director.runScene(new GameScene());
    }
});