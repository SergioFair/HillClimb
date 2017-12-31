var Contenedor = cc.Class.extend({
    space: null,
    sprites: [],
    shapes: [],
    layer: null,
    ctor: function (mapa, space, layer) {
        this.space = space;
        this.layer = layer;

        var grupoContenedores = mapa.getObjectGroup("Contenedor");
        var contenedores = grupoContenedores.getObjects();
        for (var i = 0; i < contenedores.length; i++) {
            var contenedor = contenedores[i];
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

        /*
        
        for (var i = 0; i < 3; i++) {
            if (i == 2) {
                var str = "tabla_h.png";
            } else {
                var str = "tabla_v.png";
            }
            var sprite = new cc.PhysicsSprite("#"+str);
            var body = new cp.Body(1, Infinity);
            body.setPos(posicion);
            sprite.setBody(body);
            this.sprites[i] = sprite;
        }

        // Cuerpo estática , no le afectan las fuerzas
        var body = new cp.Body(1, Infinity);
        body.setPos(posicion);
        this.sprite.setBody(body);
        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width / 3,
            this.sprite.getContentSize().height / 3);
        this.shape.setFriction(0.5);
        // agregar forma dinamica
        this.space.addShape(this.shape);
        this.shape.setCollisionType(tipoJugador);
        this.shapes[i] = shape;
        // añadir sprite a la capa

        layer.addChild(this.sprite, 10);*/
        }
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