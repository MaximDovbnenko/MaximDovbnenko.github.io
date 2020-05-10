

function Enemy(context, sprite_path) {
    this.Context = context;
    this.Sprite  = new Image();
    this.Sprite.src = sprite_path;
    this.isLoadContent = false;

    this.FrameCount = 0;
   
}
Enemy.prototype = {
    update:function(){
        this.Context.drawImage(
            this.Sprite, 0,Math.floor(this.FrameCount) * 32, 32, 32, 0,0, 64,64
        );
        this.FrameCount += 0.1;
        if(Math.floor(this.FrameCount) >= 8) {
            this.FrameCount = 0;
        }
    }
};

window.onload = function(){
    var example = document.getElementById("example");
    ctx       = example.getContext('2d');
    var test = new Enemy(ctx, "js/img/covid.png");
    var loop = setInterval(function(){
        test.update();
        ctx.clearRect(0, 0, ctx.width, ctx.height);
    }, 10);

}
