var Caja = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    layer: null,
    ctor: function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#caja1.png");
        // Cuerpo estática , no le afectan las fuerzas
        var body = new cp.StaticBody();
        body.setPos(posicion);
        this.sprite.setBody(body);
        // forma
        this.shape = new cp.BoxShape(body
            , this.sprite.getContentSize().width/2
            , this.sprite.getContentSize().height/2);
        this.shape.setCollisionType(tipoCaja);
        this.shape.setFriction(1);
        // Nunca genera colisiones reales
        this.shape.setSensor(true);
        // forma estática
        this.space.addStaticShape(this.shape);
        // añadir sprite a la capa
        this.layer.addChild(this.sprite, 10);
    },
    eliminar: function () {
        // quita la forma
        this.space.removeShape(this.shape);

        // quita el cuerpo *opcional, funciona igual
        // NO: es un cuerpo estático, no lo añadimos, no se puede quitar.
        // this.space.removeBody(shape.getBody());

        // quita el sprite
        this.layer.removeChild(this.sprite);
    }
});