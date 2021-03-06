var Contenedor = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    layer: null,
    ctor: function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;

        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i < 2; i++) {
            var str = "tabla_h.png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));
        
        var str = "#tabla_h.png";
        //var str = "#caja1.png";
        this.sprite = new cc.PhysicsSprite(str);

        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(10, Infinity);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);
        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height/2);
        this.shape.setFriction(1);
        // agregar forma dinamica
        this.space.addShape(this.shape);
        this.shape.setCollisionType(tipoContenedor);

        // añadir sprite a la capa
        this.layer.addChild(this.sprite, 10);
    },
    eliminar: function () {
        // quita la forma
        this.space.removeShape(this.shape);

        // quita el sprite
        this.layer.removeChild(this.sprite);
    }
});