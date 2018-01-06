var Carga = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    layer: null,
    animal: 0,
    ctor: function (space, posicion, layer, animal) {
        this.space = space;
        this.layer = layer;
        this.animal = animal
        var str_animal;
        switch (this.animal) {
            case 0:
                str_animal = "cuervo";
                break;
            case 1:
                str_animal = "rana";
                break;
            case 2:
                str_animal = "conejo";
                break;
        }

        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 8; i++) {
            var frame = cc.spriteFrameCache.getSpriteFrame(str_animal+i+".png");
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#" + str_animal + "1.png");
        // Cuerpo estática , no le afectan las fuerzas
        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);
        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);
        // agregar forma dinamica
        this.space.addShape(this.shape);
        this.shape.setCollisionType(tipoCarga);

        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);

        // añadir sprite a la capa
        this.layer.addChild(this.sprite, 10);

        var _this = this;

        setInterval(function () {
            _this.saltar();
        }, 5000);

    },
    saltar: function () {
        var factor = 250 + 400 * this.animal++;
        this.body.applyImpulse(cp.v(0, factor), cp.v(0, 0));
    },
    eliminar: function () {
        // quita la forma
        this.space.removeShape(this.shape);

        // quita el cuerpo
        this.space.removeBody(this.shape.getBody());

        // quita el sprite
        this.layer.removeChild(this.sprite);
    }
});