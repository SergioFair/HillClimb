var Mina = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    layer:null,
    animacionExplotar:null,
ctor:function (space, posicion, layer) {
    this.space = space;
    this.layer = layer;

    // Crear animación
    var framesAnimacion = [];
    for (var i = 1; i <= 2; i++) {
        var str = "animacion_mina_normal" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    var animacion = new cc.Animation(framesAnimacion, 0.2);
    var actionAnimacionBucle =
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear animación - explotar
    framesAnimacion = [];
    for (var i = 1; i <= 7; i++) {
        var str = "animacion_mina_explota" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
    }
    animacion = new cc.Animation(framesAnimacion, 0.2);
    this.animacionExplotar = 
        new cc.RepeatForever(new cc.Animate(animacion));

    // Crear Sprite - Cuerpo y forma
    this.sprite = new cc.PhysicsSprite("#animacion_mina_normal1.png");
    // Cuerpo estática , no le afectan las fuerzas
    var body = new cp.StaticBody();
    body.setPos(posicion);
    this.sprite.setBody(body);
    // Los cuerpos estáticos nunca se añaden al Space
    var radio = this.sprite.getContentSize().width / 2;
    // forma
    this.shape = new cp.CircleShape(body, radio , cp.vzero);
    this.shape.setCollisionType(tipoMina);
    // Nunca genera colisiones reales
    this.shape.setSensor(true);
    // forma estática
    this.space.addStaticShape(this.shape);
    // añadir sprite a la capa

    // ejecutar la animación
    this.sprite.runAction(actionAnimacionBucle);

    this.layer.addChild(this.sprite,10);
   }, eliminar: function (){
      // quita la forma
      this.space.removeShape(this.shape);

      // quita el cuerpo *opcional, funciona igual
      // NO: es un cuerpo estático, no lo añadimos, no se puede quitar.
      // this.space.removeBody(shape.getBody());

      // quita el sprite
      this.layer.removeChild(this.sprite);
   }, explotar: function() {
        this.sprite.stopAllActions();
        this.sprite.runAction(this.animacionExplotar);
        var _this = this;

        var time = setTimeout(function(){
            _this.eliminar();
        }, 2000);
   }
});
