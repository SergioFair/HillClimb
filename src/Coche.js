var Coche = cc.Class.extend({
    space: null,
    layer: null,
    sprite: null,
    shape: null,
    aceleracionX: 0,
    ctor: function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;

        this.aceleracionX = 100;

        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 3; i++) {
            var str = "orc_car" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#orc_car1.png");

        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(10, Infinity);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);
        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width / 3,
            this.sprite.getContentSize().height / 3);
        this.shape.setFriction(0.5);
        // agregar forma dinamica
        this.space.addShape(this.shape);
        this.shape.setCollisionType(tipoJugador);
        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);

        // añadir sprite a la capa
        this.layer.addChild(this.sprite, 10);

        // Impulso inicial
        //this.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));

    },
    moverDerecha: function () {
        this.body.applyImpulse(cp.v(this.aceleracionX, 0), cp.v(0, 0));
    },
    moverIzquierda: function () {
        this.body.applyImpulse(cp.v(this.aceleracionX*-1, 0), cp.v(0, 0));
    },
    setAceleracion: function () {
        this.aceleracionX *= 2;
    }
});