
function Solution(){
    this.data     = [];
    this.board    = [];
    this.energy   = 0;
    this.board_size = 0;
}
Solution.prototype = {
    init: function(N){
        this.board_size  = N;
        for(var i = 0; i < N; i++){
            this.data[i] = i;
        }
    },
    genirate: function(N){
        var x = this._get_random(0, this.data.length - 1);
        var y = 0;
        do{
            y = this._get_random(0, this.data.length - 1);
        }while(x == y);
        var temp = this.data[x];
        this.data[x] =  this.data[y];
        this.data[y] = temp;
    },
    _get_random: function(min, max){
        return Math.round(Math.random() * (max - min) + min);
    },
    create_board:function(){
        this.board = new Array();
        for(var i = 0; i < this.board_size; i++){
            this.board[i] = new Array();
            for(var j = 0; j < this.board_size; j++){
                this.board[i][j] = 0;
            }
        }
        for(var i = 0; i < this.data.length; i++){
            this.board[i][this.data[i]] = 1;
        }
    },
    calculate_energy: function(){
        this.energy = 0;
        this.create_board();
        var dx = [-1, 1, -1, 1];
        var dy = [-1, 1, 1, -1];
        for(var i = 0; i < this.data.length; i++){
            var x = i;
            var y = this.data[i];
            for(var dir = 0; dir < dx.length; dir++){
                var tmp_x = x; 
                var tmp_y = y;
                while(true){
                    tmp_x+= dx[dir]; tmp_y+=dy[dir];
                    if((tmp_x < 0 || tmp_x >= this.board_size) || ((tmp_y < 0 || tmp_y >= this.board_size))){
                        break;
                    }
                    if(this.board[tmp_x][tmp_y] == 1){
                        this.energy++;
                    }
                }
            }
        }
    }
}
function Board(){
    this.canvas    = document.getElementById('draw-context');
    this.context   = this.canvas.getContext('2d');
    this.board     = [];
    this.board_size = 10;
    this.cell_size  = 32;
    this.src_queen = "img/queen.png";
}
Board.prototype = {
    draw:function(){
        //clear
        var img = new Image();
        img.src = this.src_queen;
        var $this = this;
        img.onload = function(){
            $this.context.clearRect(0, 0,$this.board_size * $this.cell_size, $this.board_size * $this.cell_size)
            for(var i = 0; i < $this.board_size; i++){     // Y
                for(var j = 0; j < $this.board_size; j++){ // X
                    $this.context.strokeRect(j * $this.cell_size, i * $this.cell_size, $this.cell_size, $this.cell_size);
                    if($this.board[j][i] == 1){
                            $this.context.drawImage(img, j * $this.cell_size, i * $this.cell_size, $this.cell_size, $this.cell_size);
                    }
                }
            }
        }
    },
    init_canvas: function(N){
        this.board_size = N;
        var s = this.board_size * this.cell_size;
        $('canvas').attr('height', s);
        $('canvas').attr('width', s);
    },
    _init_board: function(N){
        this.board = new Array();
        for(var i = 0; i < this.board_size; i++){
            this.board[i] = new Array();
            for(var j = 0; j < this.board_size; j++){
                this.board[i][j] = 0;
            }
        }
    },
    _set_board: function(solution){
        //this._init_board();
        if(solution instanceof Solution){
            this._init_board(solution.data.length);
            this.CurrentSolution = [];
            for(var i = 0; i < solution.data.length; i++){
                this.board[i][solution.data[i]] = 1;
            }
        }
    }
}

function NQP(){
    this.board = new Board();
    this.CurrentSolution = new Solution();
    this.WorkingSolution = new Solution();
    this.BestSolution = new Solution();
    this.graph_data = [];
    this.temperature     = 30;
    this.min_temperature = 0.5;
    this.steps           = 1000;
    this.size_board      = 15;
    this.alpha = 0.98;
    //this.init();
}
NQP.prototype = {
    init:function(){
        this.CurrentSolution.init(this.size_board);
        this.WorkingSolution.init(this.size_board);
        this.BestSolution.init(this.size_board);
        this.CurrentSolution.calculate_energy();
        this.BestSolution.calculate_energy();
        this.board.init_canvas(this.size_board);
        this.copy_solution(this.WorkingSolution, this.CurrentSolution);
        var $this = this;
        setInterval(function(){
            //$this.CurrnntSolution.genirate();
            //$this.board._set_board($this.CurrentSolution);
            //$this.board.draw();
            $this.update();
        }, 1);
    },
    copy_solution: function(dest, src){
        if(dest instanceof Solution && src instanceof Solution){
            for(var i = 0; i < src.data.length; i++){
                dest.data[i] = src.data[i];
            }
        }
    },
    update: function(){
        if(this.temperature > this.min_temperature){
            var use_new = false;
            for(var step = 0; step < this.steps; step++){
                use_new = false;
                this.WorkingSolution.genirate();
                this.WorkingSolution.calculate_energy();
                if(this.WorkingSolution.energy <= this.CurrentSolution.energy){
                    use_new = true;
                }else{
                    var test  = Math.random();
                    var delta = this.WorkingSolution.energy - this.CurrentSolution.energy;
                    var calc  = Math.exp(-delta/this.temperature);
                    if(calc > test){
                        use_new = true;
                    } 
                }
                if(use_new){
                    use_new = false;
                    this.copy_solution(this.CurrentSolution, this.WorkingSolution);
                    this.CurrentSolution.calculate_energy();
                  
                    if(this.BestSolution.energy > this.CurrentSolution.energy){
                        this.copy_solution(this.BestSolution, this.CurrentSolution);
                        this.BestSolution.calculate_energy();
                        this.graph_data.push(this.BestSolution.energy);
                        this.show_graph();
                        if(this.BestSolution.energy == 0){
                            this.temperature = 0;
                        }
                    }else{
                        this.copy_solution(this.WorkingSolution, this.CurrentSolution);
                    }
                }
            }
            
            this.temperature *= this.alpha;
            this.board._set_board(this.CurrentSolution);
            this.board.draw();
        }else{
            if(this.BestSolution.energy != 0){
                this.temperature += 30;
            }
            this.board._set_board(this.BestSolution);
            this.board.draw();
        }

    },
    show_graph: function(){
        var chart = c3.generate({
            bindto: '#error-graph',
            data: {
              columns: [
                this.graph_data  
              ]
            }
        });
    }
};

function Interface(){

}

var nqp;
$(document).ready(function(){
    nqp = new NQP();
    nqp.init();
});