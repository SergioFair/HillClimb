var tipoJugador = 1;
var tipoMoneda = 2;
var tipoGasolina = 4;
var tipoMina = 5;
var tipoCaja = 6;
var tipoSuelo = 8;
var tipoCarga = 9;
var tipoPowerup = 10;
var tipoMeta = 11;
var tipoContenedor = 401;
var tipoContenedor = 400;
var START_X_COCHE = 250;
var START_Y_COCHE = 300;
var START_X_CARGA = 150;
var START_Y_CARGA = 350;
var GAS = "Te has quedado sin gasolina";
var MINA = "Has chocado con una mina";
var CAIDA = "Te has caído por el precipicio";
var CARGA = "Has perdido la carga";

var niveles = [res.mapa1_tmx, res.mapa2_tmx, res.mapa3_tmx];

var GameLayer = cc.Layer.extend({
    monedas: 0,
    formasEliminar: [],
    teclaIzquierda: false,
    teclaDerecha: false,
    monedas: [],
    gasolina: [],
    minas: [],
    cajas: [],
    powerups: [],
    metas: [],
    contenedor: null,
    jugador: null,
    coche: null,
    carga: null,
    space: null,
    nivelElegido: 0,
    ctor: function (level) {
        this._super();
        var size = cc.winSize;
        cc.spriteFrameCache.addSpriteFrames(res.moneda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.orc_car_plist);
        cc.spriteFrameCache.addSpriteFrames(res.gas_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_mina_normal_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_mina_explota_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caja_plist);
        cc.spriteFrameCache.addSpriteFrames(res.rana_plist);
        cc.spriteFrameCache.addSpriteFrames(res.conejo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.tabla_plist);
        cc.spriteFrameCache.addSpriteFrames(res.powerup_plist);
        cc.spriteFrameCache.addSpriteFrames(res.bandera_plist);

        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        this.nivelElegido = SeleccionNivelLayer.prototype.getNivelElegido();

        // Depuración
        //this.depuracion = new cc.PhysicsDebugNode(this.space);
        //this.addChild(this.depuracion, 10);

        // jugador y moneda
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoJugador, tipoMoneda,
            null, this.colisionJugadorConMoneda.bind(this), null, null);

        /*this.jugador = new Jugador(this.space,
               cc.p(100,250), this);*/
        this.coche = new Coche(this.space, cc.p(START_X_COCHE, START_Y_COCHE), this);
        //this.carga = new Rana(this.space, cc.p(START_X_CARGA, START_Y_CARGA), this);
        this.carga = new Carga(this.space, cc.p(START_X_CARGA, START_Y_CARGA), this, this.nivelElegido);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
        }, this);

        this.cargarMapa();
        this.scheduleUpdate();

        // jugador y moneda
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoJugador, tipoMoneda,
            null, this.colisionJugadorConMoneda.bind(this), null, null);

        // jugador y gasolina
        this.space.addCollisionHandler(tipoJugador, tipoGasolina,
            null, this.colisionJugadorConGasolina.bind(this), null, null);

        // jugador y mina
        this.space.addCollisionHandler(tipoJugador, tipoMina,
            null, this.colisionJugadorConMina.bind(this), null, null);

        // jugador y caja
        this.space.addCollisionHandler(tipoJugador, tipoCaja,
            null, this.colisionJugadorConCaja.bind(this), null, null);

        // jugador y powerup
        this.space.addCollisionHandler(tipoJugador, tipoPowerup,
            null, this.colisionJugadorConPowerup.bind(this), null, null);

        // jugador y meta
        this.space.addCollisionHandler(tipoJugador, tipoMeta,
            null, this.colisionJugadorConMeta.bind(this), null, null);

        this.space.addCollisionHandler(tipoCarga, tipoContenedor,
            null, this.colisionCargaConContenedor.bind(this), null, null);

        return true;

    },
    update: function (dt) {
        this.space.step(dt);

        this.coche.body.w *= 0.5;
        this.carga.body.w *= 0.5;

        var capaControles =
            this.getParent().getChildByTag(idCapaControles);

        // Eliminar formas:
        for (var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var r = 0; r < this.monedas.length; r++) {
                if (this.monedas[r].shape == shape) {
                    this.monedas[r].eliminar();
                    this.monedas.splice(r, 1);
                }
            }

            for (var r = 0; r < this.gasolina.length; r++) {
                if (this.gasolina[r].shape == shape) {
                    this.gasolina[r].eliminar();
                    this.gasolina.splice(r, 1);
                }
            }

            for (var r = 0; r < this.minas.length; r++) {
                if (this.minas[r].shape == shape) {
                    this.minas[r].eliminar();
                    this.minas.splice(r, 1);
                }
            }

            for (var r = 0; r < this.powerups.length; r++) {
                if (this.powerups[r].shape == shape) {
                    this.powerups[r].eliminar();
                    this.powerups.splice(r, 1);
                }
            }

            for (var r = 0; r < this.cajas.length; r++) {
                if (this.cajas[r].shape == shape) {
                    this.cajas[r].eliminar();
                    this.cajas.splice(r, 1);
                }
            }

            for (var r = 0; r < this.metas.length; r++) {
                if (this.metas[r].shape == shape) {
                    this.metas[r].eliminar();
                    this.metas.splice(r, 1);
                }
            }
        }

        this.formasEliminar = [];

        // Caída, sí cae vuelve a la posición inicial
        if (this.coche.body.p.y < -100) {
            this.getParent().addChild(new GameOverLayer(CAIDA));
        }

        if (this.carga.body.p.x < this.coche.body.p.x - 700 || this.carga.body.p.x > this.coche.body.p.x + 700) {
            this.getParent().addChild(new GameOverLayer(CARGA));
        }

        if (this.teclaIzquierda) {
            this.coche.moverIzquierda();
            capaControles.actualizarGasolina();
        }
        if (this.teclaDerecha) {
            this.coche.moverDerecha();
            capaControles.actualizarGasolina();
        }
        if (this.coche.body.vx > 0) {
            capaControles.incrementarMetros(Math.round(this.coche.body.p.x) - START_X_COCHE);
        }
        if (this.coche.body.vx > 1 || this.coche.body.vx < -1) {
            capaControles.actualizarGasolina();
        }

        if (!this.teclaDerecha && !this.teclaIzquierda) {
            if (this.coche.body.vx > 1)
                this.coche.body.vx--;
            else if (this.coche.body.vx < -1)
                this.coche.body.vx++;
            else
                this.coche.body.vx = 0;
        }

        if (capaControles.getBarraGasolina().getPercent() == 0) {
            this.getParent().addChild(new GameOverLayer(GAS));
        }

        var posicionX = this.coche.body.p.x - 200;
        var posicionY = this.coche.body.p.y - 200;

        if (posicionX < 0) {
            posicionX = 0;
        }
        if (posicionY < 0) {
            posicionY = 0;
        }

        this.setPosition(cc.p(-posicionX, -posicionY));

        if (this.coche.body.vx < -this.coche.getAceleracion()) {
            this.coche.body.vx = -this.coche.getAceleracion();
        }

        if (this.coche.body.vx > this.coche.getAceleracion()) {
            this.coche.body.vx = this.coche.getAceleracion();
        }

        if (this.carga.body.y > START_Y_CARGA)
            this.carga.body.vx = 0;

        if (this.carga.body.x !== this.contenedor.x) {
            this.carga.body.vx = 0;
        }

        this.contenedor.body.vx = this.coche.body.vx;
        this.contenedor.body.y = this.coche.body.y - 50;

    },
    cargarMapa: function () {
        this.mapa = new cc.TMXTiledMap(niveles[this.nivelElegido]);
        // Añadirlo a la Layer
        this.addChild(this.mapa);
        // Ancho del mapa
        this.mapaAncho = this.mapa.getContentSize().width;

        // Solicitar los objeto dentro de la capa Suelos
        var grupoSuelos = this.mapa.getObjectGroup("Suelos");
        var suelosArray = grupoSuelos.getObjects();

        // Los objetos de la capa suelos se transforman a
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < suelosArray.length; i++) {
            var suelo = suelosArray[i];
            var puntos = suelo.polylinePoints;
            for (var j = 0; j < puntos.length - 1; j++) {
                var bodySuelo = new cp.StaticBody();

                var shapeSuelo = new cp.SegmentShape(bodySuelo,
                    cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                        parseInt(suelo.y) - parseInt(puntos[j].y)),
                    cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                        parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                    10);
                shapeSuelo.setFriction(0);
                shapeSuelo.setCollisionType(tipoSuelo);
                this.space.addStaticShape(shapeSuelo);
            }
        }

        var grupoMonedas = this.mapa.getObjectGroup("Monedas");
        var monedasArray = grupoMonedas.getObjects();
        for (var i = 0; i < monedasArray.length; i++) {
            var moneda = new Moneda(this.space,
                cc.p(monedasArray[i]["x"], monedasArray[i]["y"]),
                this);

            this.monedas.push(moneda);
        }

        var grupoGasolina = this.mapa.getObjectGroup("Gasolina");
        var gasolinaArray = grupoGasolina.getObjects();
        for (var i = 0; i < gasolinaArray.length; i++) {
            var gas = new Gasolina(this.space,
                cc.p(gasolinaArray[i]["x"], gasolinaArray[i]["y"]),
                this);

            this.gasolina.push(gas);
        }

        var grupoMinas = this.mapa.getObjectGroup("Minas");
        var minaArray = grupoMinas.getObjects();
        for (var i = 0; i < minaArray.length; i++) {
            var mina = new Mina(this.space,
                cc.p(minaArray[i]["x"], minaArray[i]["y"]),
                this);

            this.minas.push(mina);
        }

        var grupoCajas = this.mapa.getObjectGroup("Cajas");
        var cajasArray = grupoCajas.getObjects();
        for (var i = 0; i < cajasArray.length; i++) {
            var caja = new Caja(this.space,
                cc.p(cajasArray[i]["x"], cajasArray[i]["y"] + 10),
                this);

            this.cajas.push(caja);
        }

        var grupoPowerups = this.mapa.getObjectGroup("Powerups");
        var powerupArray = grupoPowerups.getObjects();
        for (var i = 0; i < powerupArray.length; i++) {
            var powerup = new Powerup(this.space,
                cc.p(powerupArray[i]["x"], powerupArray[i]["y"]),
                this);

            this.powerups.push(powerup);
        }

        var grupoMetas = this.mapa.getObjectGroup("Metas");
        var metaArray = grupoMetas.getObjects();
        for (var i = 0; i < metaArray.length; i++) {
            var meta = new Meta(this.space,
                cc.p(metaArray[i]["x"], metaArray[i]["y"]),
                this);

            this.metas.push(meta);
        }

        this.contenedor = new Contenedor(this.space, cc.p(START_X_CARGA, START_Y_CARGA - 50), this);

    },
    teclaPulsada: function (keyCode, event) {
        var instancia = event.getCurrentTarget();

        // Flecha izquierda
        if (keyCode == 37) {
            instancia.teclaIzquierda = true;
        }
        // Flecha derecha
        if (keyCode == 39) {
            instancia.teclaDerecha = true;
        }
    },
    teclaLevantada: function (keyCode, event) {
        var instancia = event.getCurrentTarget();
        // Flecha izquierda
        if (keyCode == 37) {
            instancia.teclaIzquierda = false;
        }
        // Flecha derecha
        if (keyCode == 39) {
            instancia.teclaDerecha = false;
        }
    },
    colisionJugadorConMoneda: function (arbiter, space) {

        // Marcar la moneda para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);

        this.tiempoEfecto = 100;

        var capaControles =
            this.getParent().getChildByTag(idCapaControles);
        capaControles.agregarMoneda();
    },
    colisionJugadorConGasolina: function (arbiter, space) {

        // Marcar la gasolina para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);

        this.tiempoEfecto = 100;

        var capaControles =
            this.getParent().getChildByTag(idCapaControles);

        // Incrementar gasolina....
        capaControles.incrementarGasolina();

    },
    colisionJugadorConMina: function (arbiter, space) {

        // Marcar la mina para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es la mina
        this.minas[0].explotar();

        this.tiempoEfecto = 100;

        var capaControles =
            this.getParent().getChildByTag(idCapaControles);

        // Explosion de mina, derrota del jugador y reseteo del nivel
        this.getParent().addChild(new GameOverLayer(MINA));

    },
    colisionJugadorConPowerup: function (arbiter, space) {

        // Marcar el powerup para eliminarlo
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);

        this.tiempoEfecto = 100;

        this.powerups[0].aumentarVelocidad(this.coche);
    },
    colisionJugadorConMeta: function (arbiter, space) {

        // Marcar el powerup para eliminarlo
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);

        this.tiempoEfecto = 100;

        this.metas[0].ganarNivel();
    },
    colisionJugadorConCaja: function (arbiter, space) {
        // Marcar la caja para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);

        this.tiempoEfecto = 100;

        var capaControles =
            this.getParent().getChildByTag(idCapaControles);

        this.coche.body.vx = 0;
        this.coche.body.applyImpulse(cp.v(-10000, 0), cp.v(0, 0));
    },
    colisionCargaConContenedor: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es la carga
        var formaCarga = shapes[0];
        if (this.carga.shape == formaCarga) {
            if (this.carga.body.x == this.contenedor.body.x)
                this.carga.body.vx = this.contenedor.body.vx;
        }
    }
});

var idCapaJuego = 1;
var idCapaControles = 2;

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer();
        this.addChild(controlesLayer, 0, idCapaControles);

    }
});