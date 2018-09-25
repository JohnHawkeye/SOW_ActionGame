//
//ActionGameEditor  effect.js

//vars
var Effect={};

//functions
function EffectLoad(){

	Effect.param = [];

  //add keyframe 'kf' for after
	for(var i=0;i<255;i++){
		Effect.param.push({x:0,y:0,w:0,h:0,size:0,knum:0,type:0,time:0,enabled:false});
	}


}

//
//init
function EffectInit(){

}

function EffectAppear(ex,ey,sw,sh,type){

	var dw,dh;
	var num=8;
	var count_ef = 1;
	var diagonal = false;
	var margin=15;

	dw=sw,dh=sh;

	for (var i = 0; i < Effect.param.length; i++) {
    if(!Effect.param[i].enabled){

			if(count_ef%2 !=0){
				if(!diagonal){
					Effect.param[i].x = (ex-dw/2)- Math.floor(Math.random()*(dw/2+1)) + margin;
					Effect.param[i].y = (ey-dh/2)- Math.floor(Math.random()*(dh/2+1)) + margin;
				}else{
					Effect.param[i].x = (ex-dw/2)+ Math.floor(Math.random()*(dw/2+1-margin));
					Effect.param[i].y = (ey-dh/2)- Math.floor(Math.random()*(dh/2+1)) + margin;
				}

			}else{
				if(!diagonal){
					Effect.param[i].x = (ex-dw/2)+ Math.floor(Math.random()*(dw/2+1-margin));
					Effect.param[i].y = (ey-dh/2)+ Math.floor(Math.random()*(dh/2+1-margin));
					diagonal = true;
				}
					Effect.param[i].x = (ex-dw/2)- Math.floor(Math.random()*(dw/2+1)) + margin;
					Effect.param[i].y = (ey-dh/2)+ Math.floor(Math.random()*(dh/2+1-margin));
					diagonal = false;
			}

			Effect.param[i].size = Math.random()+0.3;
			Effect.param[i].type = 0;
			Effect.param[i].kf = [0,1,0,1,0,1,2,2,3,3];
			Effect.param[i].knum = 0;
			Effect.param[i].time = time_progress;
			Effect.param[i].enabled = true;

			if(count_ef >= num){
				break;
			}else{
				count_ef++;
			}
    }
  }

}

function EffectEnemyDamage(ex,ey,sw,sh){

	var dw,dh;

	dw=sw,dh=sh;

	for (var i = 0; i < Effect.param.length; i++) {
    if(!Effect.param[i].enabled){

			Effect.param[i].x = ex;
			Effect.param[i].y = ey;
			Effect.param[i].w = sw;
			Effect.param[i].h = sh;
			Effect.param[i].size = 0;
			Effect.param[i].type = 1;
			Effect.param[i].kf = [0,0,0];
			Effect.param[i].knum = 0;
			Effect.param[i].time = time_progress;
			Effect.param[i].enabled = true;

			break;
    }
  }
}

function EffectAnimation(){

	Effect.param.forEach(function(value){
		if(value.enabled){
			if(value.time == 0){
				value.time = time_progress;
			}
			if(time_progress >=value.time+100){
				if(value.knum >value.kf.length){
					value.enabled = false;
				}else{
					value.knum++;
					value.time = time_progress;
				}
			}
		}
	});
}

function EffectDraw(){

	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;
	var sx,sy,sw,sh,dw,dh;

	Effect.param.forEach(function(value){
		if(value.enabled){

			if(value.type == 0){
				switch (value.kf[value.knum]) {
					case 0:
						sx=0,sy=0;
						break;
					case 2:
						sx=100,sy=0;
						break;
					case 3:
						sx=200,sy=0;
						break;
				}
				sw = sh = 100;
				dw = dh = Math.floor(50*value.size);
				ctx.drawImage(Asset.images['effect'],sx,sy,sw,sh,
											value.x-ofx+50,value.y-ofy+50,dw,dh);
			}

			if(value.type == 1){

				var r_color;
				var r_x,r_y,r_size;
				var density_w;
				var density_h;

				for (var i = 0; i <Math.floor(value.h/8) ; i++) {
					for (var j = 0; j <Math.floor(value.w/25) ; j++) {
						r_color = Math.floor(Math.random()*3);	//color
						r_x = (Math.floor(Math.random()*26))+j*25;
						r_y = (Math.floor(Math.random()*9))+i*8;
						r_size = Math.floor(Math.random()*3)+2;

						if(r_color == 0){ctx.strokeStyle = "rgb(255,255,255)";}
						if(r_color == 1){ctx.strokeStyle = "rgb(132,253,207)";}
						if(r_color == 2){ctx.strokeStyle = "rgb(81,183,143)";}
						ctx.lineWidth = r_size;
						ctx.beginPath();
						ctx.moveTo(value.x-ofx-value.w/2+r_x+8,value.y-ofy-value.h+r_y+2);
						ctx.lineTo(value.x-ofx-value.w/2+r_x+25,value.y-ofy-value.h+r_y);
						ctx.stroke();

						if(r_color == 0){ctx.strokeStyle = "rgb(255,255,255)";}
						if(r_color == 1){ctx.strokeStyle = "rgb(132,253,207)";}
						if(r_color == 2){ctx.strokeStyle = "rgb(81,183,143)";}
						ctx.lineWidth = r_size;
						ctx.beginPath();
						ctx.moveTo(value.x-ofx-value.w/2+r_x,value.y-ofy-value.h+r_y);
						ctx.lineTo(value.x-ofx-value.w/2+r_x+25,value.y-ofy-value.h+r_y);
						ctx.stroke();

						ctx.strokeStyle = "rgb(255,255,255)";
						ctx.lineWidth = 1.0;

					}
				}
			}
		}
	});

}
