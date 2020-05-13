function Enemy(context, sprite_path) {
    this.Context = context;
    this.Sprite  = new Image();
    this.Sprite.src = sprite_path;
    this.isNeedDelete = false;
    this.PositionX = 64 + Math.random() * (1800 - 64);
    this.PositionY = Math.random() * 200;
    this.VelX      = Math.random() - 0.5;
    this.VelY      = Math.random() - 0.5;
    this.FrameCount = 0;
   
}
Enemy.prototype = {
    update:function(){
        this.PositionX += this.VelX * 5;
        this.PositionY += this.VelY * 5;
        if(this.PositionX > 1800 - 64|| this.PositionX <= 0){
            this.VelX *= -1;
        }
       if(this.PositionY > 500 - 64 || this.PositionY <= 0 ){
            this.VelY *= -1;
        }
       
        this.Context.drawImage(
            this.Sprite, 0,Math.floor(this.FrameCount) * 32, 32, 32,  this.PositionX , this.PositionY , 32,32
        );
        this.FrameCount += 0.1;
        if(Math.floor(this.FrameCount) >= 8) {
            this.FrameCount = 0;
        }
    },
    get_distance: function(enemy_obj){
        return Math.sqrt(Math.pow(this.PositionX - enemy_obj.PositionX, 2) + Math.pow(this.PositionY - enemy_obj.PositionY, 2) );
    }
};

function Player(context, sprite_path) {
    this.Context = context;
    this.Sprite  = new Image();
    this.Sprite.src = sprite_path;
    this.isLoadContent = false;
    this.PositionX = 250;
    this.PositionY = 400;
    this.VelX      = 0;
    this.VelY      = 0;
    this.FrameCount = 0;
    this.AnimOffset = 126 * 2;
    this.Frames = 1;
    this.LeftRight = false;
   
}
Player.prototype = {
    update:function(){
       
       
        this.Context.drawImage(
            this.Sprite, Math.floor(this.FrameCount) * 84, this.AnimOffset , 84, 126,  this.PositionX , this.PositionY , 84, 126
        );
        this.FrameCount += 0.1;
        if(Math.floor(this.FrameCount) >=  this.Frames ) {
            this.FrameCount = 0;
        }
    },
    stay: function() {
        this.AnimOffset = 126 * 2;
        if(this.LeftRight) {
            this.FrameCount = 0;
        } else {
            this.FrameCount = 1;
        }
        this.Frames = 1;
       
    },
    move_right: function() {
        this.AnimOffset = 0;
        this.Frames = 6;
        this.PositionX += 10;
        this.LeftRight = true;
    },
    move_left: function() {
        this.AnimOffset = 126;
        this.Frames = 6;
        this.PositionX -= 10;
        this.LeftRight = false;
    },
    get_distance: function(enemy_obj){
        return Math.sqrt(Math.pow(this.PositionX - enemy_obj.PositionX, 2) + Math.pow(this.PositionY - enemy_obj.PositionY, 2) );
    }
};
function Immard(context, start_position){
    this.Context = context;
    this.Sprite  = new Image();
    this.Sprite.src = "js/img/immard.png";
    this.isNeedDelete = false;
    this.PositionX  = start_position + 32 + (32 / 2);
    this.PositionY  = 500 - 64;
    this.VelY       = 5;
    this.FrameCount = 0;
}
//680 371
Immard.prototype = {
    update:function(){    
        this.PositionX += this.VelY;
        if(this.PositionX  > 1800) {
            this.isNeedDelete = true;
        }
        this.Context.drawImage(
            this.Sprite, 0,Math.floor(this.FrameCount) * 48, 64, 48,  this.PositionX , this.PositionY , 32, 32
        );
        this.FrameCount += 0.5;
        if(Math.floor(this.FrameCount) >= 4) {
            this.FrameCount = 0;
        }
    },
    get_distance: function(enemy_obj){
        return Math.sqrt(Math.pow(this.PositionX - enemy_obj.PositionX, 2) + Math.pow(this.PositionY - enemy_obj.PositionY, 2) );
    }
}
function Scene(context, w, h) {
    this.Context = context;
    this.Width  = w;
    this.Height = h;
    this.Background = new Image();
    this.Background.src = "js/img/scene.webp";
    this.Player   = new Player(this.Context, "js/img/player2.png");
    

    this.Enemys = Array();
    this.Bombs  = Array();


    this.create_enemy(20);
}
Scene.prototype = {
    update:function(canvasW, canvasH){
        this.Context.drawImage(
            this.Background , 0, 0
        );
        
        this.Player.update();
        this.bombs_update();
        this.update_enemy();
    },
    update_enemy: function(){
        for(var i = 0; i < this.Enemys.length; i++){
            this.Enemys[i].update();
        }
        for(var i = 0; i < this.Enemys.length; i++){
            if(this.Enemys[i].isNeedDelete){
                this.Enemys.splice(i, 1); break;
            }
        }
    },
    bombs_update: function() {
        for(var i = 0; i < this.Bombs.length; i++){
            for(var j = 0; j < this.Enemys.length; j++){
                var dist = this.Bombs[i].get_distance(this.Enemys[j]);
                if(dist < 32 ){
                    this.Bombs[i].isNeedDelete = true;
                    this.Enemys[j].isNeedDelete = true;
                    //break;
                }
            }
        }
        for(var i = 0; i < this.Bombs.length; i++){
            this.Bombs[i].update();
        }
       for(var i = 0; i < this.Bombs.length; i++){
            if(this.Bombs[i].isNeedDelete){
                this.Bombs.splice(i, 1); break;
            }
        }
    },
    create_enemy: function(count) {
        this.Enemys = Array();
        for(var i = 0; i < count; i++){
            var tmp_enemy = new Enemy(this.Context, "js/img/covid.png");
            this.Enemys.push(tmp_enemy);
        }
    },
    add_bombs: function() {
        var pos = this.Player.PositionX;
        this.Bombs.push(new Immard(this.Context, pos));
    }
}
var scene;
var  canvasW, canvasH;
var ctx;
window.onload = function(){
    var example = document.getElementById("example");
    ctx        = example.getContext('2d');
    /*example.setAttribute("width", window.outerWidth);
    example.setAttribute("height", window.outerHeight);
    ctx.width  = window.innerWidth; //document.width is obsolete
    ctx.height = window.innerHeight; //document.height is obsolete
    canvasW = ctx.width;
    canvasH = ctx.height;*/
    scene = new Scene(ctx, canvasW, canvasH);
    var loop = setInterval(function(){
        ctx.width  = window.innerWidth; //document.width is obsolete
        ctx.height = window.innerHeight; //document.height is obsolete
        example.setAttribute("width", window.outerWidth);
        example.setAttribute("height", window.outerHeight);
        canvasW = ctx.width;
        canvasH = ctx.height;
        scene.update(canvasW, canvasH);
       // ctx.clearRect(0, 0, ctx.width, ctx.height);
    }, 10);
}

document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowRight') {
      scene.Player.move_right();
    }
    if (event.code == 'ArrowLeft') {
        scene.Player.move_left();
    }
    if (event.code == 'ArrowUp') {
        //scene.Player.PositionX-=10;
        scene.add_bombs();
    }
});
document.addEventListener('keyup', function(event) {
    if (event.code == 'ArrowRight') {
      scene.Player.stay();
    }
    if (event.code == 'ArrowLeft') {
        scene.Player.stay();
    }
    if (event.code == 'ArrowUp') {
        //scene.Player.PositionX-=10;
        scene.add_bombs();
    }
});

window.addEventListener('resize', function(){
    ctx.width  = window.innerWidth; //document.width is obsolete
    ctx.height = window.innerHeight; //document.height is obsolete
    canvasW = ctx.width;
    canvasH = ctx.height;
});