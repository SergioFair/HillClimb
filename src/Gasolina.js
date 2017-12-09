var Gasolina = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    layer:null,
ctor:function (space, posicion, layer) {
    this.space = space;
    this.layer = layer;

    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 3; i++) {
        var str = "gas" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#gas1.png");
    // Cuerpo estática , no le afectan las fuerzas
    var body = new cp.StaticBody();
    body.setPos(posicion);
    this.sprite.setBody(body);
    // Los cuerpos estáticos nunca se añaden al Space
    var radio = this.sprite.getContentSize().width / 2;
    // forma
    this.shape = new cp.BoxShape(body
                                , this.sprite.getContentSize().width
                                , this.sprite.getContentSize().height);
    this.shape.setCollisionType(tipoMoneda);
    // Nunca genera colisiones reales
    this.shape.setSensor(true);
    // forma estática
    this.space.addStaticShape(this.shape);
    // añadir sprite a la capa

    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);

    layer.addChild(this.sprite,10);
   }, eliminar: function (){
      // quita la forma
      this.space.removeShape(this.shape);

      // quita el cuerpo *opcional, funciona igual
      // NO: es un cuerpo estático, no lo añadimos, no se puede quitar.
      // this.space.removeBody(shape.getBody());

      // quita el sprite
      this.layer.removeChild(this.sprite);
   }
});
