var nivelElegido = 0;
var SeleccionNivelLayer = cc.Layer.extend({
    nivel1: null,
    nivel2: null,
    nivel3: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;

        // Fondo
        var spriteFondoTitulo = new cc.Sprite(res.seleccion_nivel_png);
        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));
        // Lo escalo porque es más pequeño que la pantalla
        spriteFondoTitulo.setScale(size.height / spriteFondoTitulo.height);
        // Añado Sprite a la escena
        this.addChild(spriteFondoTitulo);

        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.onMouseDown,
            onMouseUp: this.onMouseUp
        }, this)

        //MenuItemSprite para cada botón
        var nivel1 = new cc.MenuItemSprite(
            new cc.Sprite(res.nivel1_png), // IMG estado normal
            new cc.Sprite(res.nivel1_png), // IMG estado pulsado
            this.pulsarBotonJugar, this);

        // creo el menú pasándole los botones
        this.menu = new cc.Menu(nivel1);
        // Asigno posición central
        this.menu.setPosition(cc.p(size.width * 0.5, size.height * 0.7));
        // Añado el menú a la escena
        this.addChild(this.menu);

        //MenuItemSprite para cada botón
        var nivel2 = new cc.MenuItemSprite(
            new cc.Sprite(res.nivel2_png), // IMG estado normal
            new cc.Sprite(res.nivel2_png), // IMG estado pulsado
            this.pulsarBotonJugar, this);

        // creo el menú pasándole los botones
        this.menu2 = new cc.Menu(nivel2);
        // Asigno posición central
        this.menu2.setPosition(cc.p(size.width * 0.5, size.height * 0.45));
        // Añado el menú a la escena
        this.addChild(this.menu2);

        //MenuItemSprite para cada botón
        var nivel3 = new cc.MenuItemSprite(
            new cc.Sprite(res.nivel3_png), // IMG estado normal
            new cc.Sprite(res.nivel3_png), // IMG estado pulsado
            this.pulsarBotonJugar, this);

        // creo el menú pasándole los botones
        this.menu3 = new cc.Menu(nivel3);
        // Asigno posición central
        this.menu3.setPosition(cc.p(size.width * 0.5, size.height * 0.2));
        // Añado el menú a la escena
        this.addChild(this.menu3);

        return true;

    },
    pulsarBotonJugar: function () {
        cc.director.runScene(new GameScene());
    },
    onMouseDown: function (event) {
        this.mouseDown = true;
        if (!this.mouseDown)
            return;
        else {
            intervalo = setInterval(function () {
                var instancia = event.getCurrentTarget();
                var nivel1 = instancia.menu.children[0];
                var nivel2 = instancia.menu2.children[0];
                var nivel3 = instancia.menu3.children[0];

                // La pulsación cae dentro del botón
                if (nivel1.isSelected()) {
                    nivelElegido = 0;
                } else if (nivel2.isSelected()) {
                    nivelElegido = 1;
                } else if (nivel3.isSelected()) {
                    nivelElegido = 2;
                }
            }, 1);
        }
    },
    onMouseUp: function () {
        if (intervalo != null) {
            this.mouseDown = false;
            clearInterval(intervalo);
        }
    },
    getNivelElegido: function(){
        return nivelElegido;
    }
});

var MenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});