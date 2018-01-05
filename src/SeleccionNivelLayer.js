
var SeleccionNivelLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Fondo
        var spriteFondoTitulo= new cc.Sprite(res.seleccion_nivel_png);
        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));
        // Lo escalo porque es más pequeño que la pantalla
        spriteFondoTitulo.setScale(size.height / spriteFondoTitulo.height);
        // Añado Sprite a la escena
        this.addChild(spriteFondoTitulo);

        //MenuItemSprite para cada botón
        var nivel1 = new cc.MenuItemSprite(
            new cc.Sprite(res.nivel1_png), // IMG estado normal
            new cc.Sprite(res.nivel1_png), // IMG estado pulsado
            this.pulsarBotonJugar, this);

        // creo el menú pasándole los botones
        var menu = new cc.Menu(nivel1);
        // Asigno posición central
        menu.setPosition(cc.p(size.width * 0.5, size.height * 0.7));
        // Añado el menú a la escena
        this.addChild(menu);

        //MenuItemSprite para cada botón
        var nivel2 = new cc.MenuItemSprite(
            new cc.Sprite(res.nivel1_png), // IMG estado normal
            new cc.Sprite(res.nivel1_png), // IMG estado pulsado
            this.pulsarBotonJugar, this);

        // creo el menú pasándole los botones
        var menu2 = new cc.Menu(nivel2);
        // Asigno posición central
        menu2.setPosition(cc.p(size.width * 0.5, size.height * 0.45));
        // Añado el menú a la escena
        this.addChild(menu2);

        //MenuItemSprite para cada botón
        var nivel3 = new cc.MenuItemSprite(
            new cc.Sprite(res.nivel1_png), // IMG estado normal
            new cc.Sprite(res.nivel1_png), // IMG estado pulsado
            this.pulsarBotonJugar, this);

        // creo el menú pasándole los botones
        var menu3 = new cc.Menu(nivel3);
        // Asigno posición central
        menu3.setPosition(cc.p(size.width * 0.5, size.height * 0.2));
        // Añado el menú a la escena
        this.addChild(menu3);



        return true;
    }, pulsarBotonJugar : function(){
        cc.director.runScene(new GameScene());
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});

