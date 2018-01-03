var Contenedor = cc.Class.extend({
    space: null,
    sprite: null,
    shape: null,
    layer: null,
    ctor: function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;

        //var str = "#tabla_h.png";
        var str = "#caja1.png";
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
            this.sprite.getContentSize().height);
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

        // quita el cuerpo *opcional, funciona igual
        // NO: es un cuerpo estático, no lo añadimos, no se puede quitar.
        // this.space.removeBody(shape.getBody());

        // quita el sprite
        this.layer.removeChild(this.sprite);
    }
});