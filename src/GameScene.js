var tipoJugador = 1;
var tipoMoneda = 2;
var tipoEnemigo = 3;
var tipoGasolina = 4;
var tipoMina = 5;
var tipoCaja = 6;
var tipoDisparo = 7;
var tipoSuelo = 8;
var tipoRana = 9
var tipoContenedor = 401;
var tipoContenedor = 400;
var START_X_COCHE = 250;
var START_Y_COCHE = 300;
var START_X_RANA = 150;
var START_Y_RANA = 300;
var GAS = "Te has quedado sin gasolina";
var MINA = "Has chocado con una mina";
var CAIDA = "Te has caído por el precipicio";
var RANA = "Has perdido a la rana";

//var niveles = [ res.mapa1_tmx , res.mapa2_tmx ];
var niveles = [res.mapa_prueba];
var nivelActual = 0;

var GameLayer = cc.Layer.extend({
    monedas: 0,
    tiempoDisparar: 0,
    disparos: [],
    disparosEliminar: [],
    enemigos: [],
    enemigosEliminar: [],
    formasEliminar: [],
    teclaIzquierda: false,
    teclaDerecha: false,
    teclaArriba: false,
    teclaBarra: false,
    monedas: [],
    gasolina: [],
    minas: [],
    cajas: [],
    contenedor: null,
    jugador: null,
    coche: null,
    rana: null,
    space: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;

        cc.spriteFrameCache.addSpriteFrames(res.playershootright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.disparo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.moneda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playerrunright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playerjumpright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playeridleright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playerdieright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.disparo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.playershootright_plist);
        cc.spriteFrameCache.addSpriteFrames(res.orc_car_plist);
        cc.spriteFrameCache.addSpriteFrames(res.gas_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_mina_normal_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_mina_explota_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cocodrilo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caja_plist);
        cc.spriteFrameCache.addSpriteFrames(res.rana_plist);

        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);

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
        this.rana = new Rana(this.space, cc.p(START_X_RANA, START_Y_RANA), this);

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

        // enemigo y contenedor
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        /*this.space.addCollisionHandler(tipoEnemigo, tipoContenedorGirarDerecha,
            null, this.colisionEnemigoConContenedorGirarDerecha.bind(this), null, null);*/

        this.space.addCollisionHandler(tipoRana, tipoContenedor,
            null, this.colisionRanaConContenedor.bind(this), null, null);


        // disparo y enemigo
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoDisparo, tipoEnemigo,
            null, this.colisionDisparoConEnemigo.bind(this), null, null);

        // disparo y muro
        // IMPORTANTE: Invocamos el método antes de resolver la colisión (realmente no habrá colisión).
        this.space.addCollisionHandler(tipoDisparo, tipoSuelo,
            null, this.colisionDisparoConSuelo.bind(this), null, null);
        return true;

    },
    update: function (dt) {
        this.space.step(dt);

        this.coche.body.w *= 0.5;
        this.rana.body.w *= 0.5;

        var capaControles =
            this.getParent().getChildByTag(idCapaControles);

        if (capaControles.monedas >= 40) {
            nivelActual = nivelActual + 1;
            cc.director.runScene(new GameScene());
        }

        // Mover enemigos:
        for (var i = 0; i < this.enemigos.length; i++) {
            var enemigo = this.enemigos[i];
            enemigo.moverAutomaticamente();
        }

        //console.log("Formas eliminar: " + this.formasEliminar.length);
        // Eliminar formas:
        for (var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var r = 0; r < this.monedas.length; r++) {
                if (this.monedas[r].shape == shape) {
                    this.monedas[r].eliminar();
                    this.monedas.splice(r, 1);
                }
            }

            for (var r = 0; r < this.enemigos.length; r++) {
                if (this.enemigos[r].shape == shape) {
                    //console.log("Enemigo eliminado");
                    this.enemigos[r].eliminar();
                    this.enemigos.splice(r, 1);
                }
            }

            for (var r = 0; r < this.disparos.length; r++) {
                if (this.disparos[r].shape == shape) {
                    this.disparos[r].eliminar();
                    this.disparos.splice(r, 1);
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

            for (var r = 0; r < this.cajas.length; r++) {
                if (this.cajas[r].shape == shape) {
                    this.cajas[r].eliminar();
                    this.cajas.splice(r, 1);
                }
            }
        }

        this.formasEliminar = [];

        /* Caída, sí cae vuelve a la posición inicial
        if (this.jugador.body.p.y < -100) {
            this.jugador.body.p = cc.p(50, 150);
        }*/

        // Caída, sí cae vuelve a la posición inicial
        if (this.coche.body.p.y < -100) {
            //this.coche.body.p = cc.p(START_X_COCHE, START_Y_COCHE);
            //capaControles.resetearMarcadores();
            this.getParent().addChild(new GameOverLayer(CAIDA));
        }

        if (this.rana.body.p.y < -100) {
            this.getParent().addChild(new GameOverLayer(RANA));
        }

        /*if (this.teclaBarra && new Date().getTime() - this.tiempoDisparar > 1000) {
            this.tiempoDisparar = new Date().getTime();
            var disparo = new Disparo(this.space,
                cc.p(this.jugador.body.p.x, this.jugador.body.p.y),
                this);

            if (this.jugador.sprite.scaleX > 0) {
                disparo.body.vx = 400;
            } else {
                disparo.body.vx = -400;
            }

            this.disparos.push(disparo);
            this.jugador.disparar();
        }

        if (this.teclaArriba) {
            this.jugador.moverArriba();
        }*/
        if (this.teclaIzquierda) {
            //this.jugador.moverIzquierda();
            this.coche.moverIzquierda();
            capaControles.actualizarGasolina();
        }
        if (this.teclaDerecha) {
            //this.jugador.moverDerecha();
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
        /*if (!this.teclaIzquierda && !this.teclaDerecha) {
            this.coche.body.vx = 0;
        }*/

        //this.jugador.actualizarAnimacion();

        // actualizar camara (posición de la capa).
        //var posicionX = this.jugador.body.p.x - 200;
        //var posicionY = this.jugador.body.p.y - 200;
        var posicionX = this.coche.body.p.x - 200;
        var posicionY = this.coche.body.p.y - 200;

        if (posicionX < 0) {
            posicionX = 0;
        }
        if (posicionY < 0) {
            posicionY = 0;
        }

        this.setPosition(cc.p(-posicionX, -posicionY));


        /*if (this.jugador.body.vx < -200) {
            this.jugador.body.vx = -200;
        }

        if (this.jugador.body.vx > 200) {
            this.jugador.body.vx = 200;
        }*/

        if (this.coche.body.vx < -200) {
            this.coche.body.vx = -200;
        }

        if (this.coche.body.vx > 200) {
            this.coche.body.vx = 200;
        }

        if (this.rana.body.y > START_Y_RANA)
            this.rana.body.vx = 0;

        if(this.rana.body.x !== this.contenedor.x){
            this.rana.body.vx = 0;
        }

        this.contenedor.body.vx = this.coche.body.vx;

    },
    cargarMapa: function () {
        this.mapa = new cc.TMXTiledMap(niveles[nivelActual]);
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
                //shapeSuelo.setElasticity(0);
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

        var grupoEnemigos = this.mapa.getObjectGroup("Enemigos");
        if (grupoEnemigos !== null) {
            var enemigosArray = grupoEnemigos.getObjects();
            for (var i = 0; i < enemigosArray.length; i++) {
                var enemigo = new Enemigo(this.space,
                    cc.p(enemigosArray[i]["x"], enemigosArray[i]["y"]),
                    this);

                this.enemigos.push(enemigo);
                //console.log("Enemigo agregado");
            }
        }

        /*var grupoContenedores = this.mapa.getObjectGroup("Contenedor");
        var contenedoresArray = grupoContenedores.getObjects();
        for (var i = 0; i < contenedoresArray.length; i++) {
            var contenedor = contenedoresArray[i];
            var puntos = contenedor.polylinePoints;

            for (var j = 0; j < puntos.length - 1; j++) {
                var bodyContenedor = new cp.StaticBody();

                var shapeContenedor = new cp.SegmentShape(bodyContenedor,
                    cp.v(parseInt(contenedor.x) + parseInt(puntos[j].x),
                        parseInt(contenedor.y) - parseInt(puntos[j].y)),
                    cp.v(parseInt(contenedor.x) + parseInt(puntos[j + 1].x),
                        parseInt(contenedor.y) - parseInt(puntos[j + 1].y)),
                    5);

                shapeContenedor.setSensor(true);
                shapeContenedor.setCollisionType(tipoContenedor);
                shapeContenedor.setFriction(1);

                this.space.addStaticShape(shapeContenedor);
            }
        }*/
        this.contenedor = new Contenedor(this.space, cc.p(START_X_RANA, START_Y_RANA - 20), this);

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
        // Flecha arriba
        if (keyCode == 38) {
            instancia.teclaArriba = true;
        }
        // Barra espaciadora
        if (keyCode == 32) {
            instancia.teclaBarra = true;
        }
    },
    teclaLevantada: function (keyCode, event) {
        var instancia = event.getCurrentTarget();
        //console.log("Tecla Levantada " + keyCode);
        // Flecha izquierda
        if (keyCode == 37) {
            instancia.teclaIzquierda = false;
        }
        // Flecha derecha
        if (keyCode == 39) {
            instancia.teclaDerecha = false;
        }
        // Flecha arriba
        if (keyCode == 38) {
            instancia.teclaArriba = false;
        }
        // Barra espaciadora
        if (keyCode == 32) {
            instancia.teclaBarra = false;
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
        // shapes[0] es el jugador
        this.minas[0].explotar();
        //this.formasEliminar.push(shapes[1]);

        this.tiempoEfecto = 100;

        var capaControles =
            this.getParent().getChildByTag(idCapaControles);

        // Explosion de mina, derrota del jugador y reseteo del nivel
        //console.log(this.minas[0]);
        this.getParent().addChild(new GameOverLayer(MINA));
        //capaControles.resetearMarcadores();

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

        // Explosion de caja, derrota del jugador y reseteo del nivel
        //console.log(this.cajas[0]);
        //capaControles.resetearMarcadores();
    },
    /*colisionEnemigoConContenedorGirarDerecha: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es el enemigo
        var formaEnemigo = shapes[0];
        for (var i = 0; i < this.enemigos.length; i++) {
            if (this.enemigos[i].shape == formaEnemigo) {
                this.enemigos[i].body.vx = 0; //parar
                this.enemigos[i].direccionX = "izquierda";
            }
        }
    },*/
    colisionRanaConContenedor: function (arbiter, space) {
        var shapes = arbiter.getShapes();
        // shapes[0] es la rana
        var formaRana = shapes[0];
        if (this.rana.shape == formaRana) {
            if (this.rana.body.x == this.contenedor.body.x)
                this.rana.body.vx = this.contenedor.body.vx;
        }
    },
    colisionDisparoConEnemigo: function (arbiter, space) {
        var shapes = arbiter.getShapes();

        this.formasEliminar.push(shapes[0]);
        this.formasEliminar.push(shapes[1]);
    },
    colisionDisparoConSuelo: function (arbiter, space) {
        var shapes = arbiter.getShapes();

        this.formasEliminar.push(shapes[0]);
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