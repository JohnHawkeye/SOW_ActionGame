//
//ActionEditor
//build.js

//vars *****
var Build = {};

function BuildLoad(){

  Build.param =[];
  for(var i=0;i<64;i++){  //w,h is collider size
		Build.param.push({x:100,y:100,w:20,h:20,isg:true,gl:0,pid:0,
                    buildtime:0,availa:0,type:0,enabled:false,visible:true});
	}
}

function BuildDataInit(){
  Build.param.forEach(function(value){
		value.x = 0,value.y = 0,value.w =20,value.h =20;
    value.isg =true,value.gl=450,value.pid=0,value.availa=0;
    value.buildtime=0,value.type=0,value.enabled=false,value.visible=true;
	});
}

//
// Build Drawings
function BuildDraw(){

  var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;

  Build.param.forEach(function(value){

    if(value.enabled && value.visible){
      switch (value.type) {
        case 0: //wood1
          ctx.drawImage(Asset.images['build'],210,0,124,200,
                        value.x - ofx -62,value.y - ofy - 200,124,200);
          break;
        case 1: //wood2
          ctx.drawImage(Asset.images['build'],360,0,136,200,
                        value.x - ofx -62,value.y - ofy -200 ,136,200);
          break;

      }
    }
	});
}

//
//Build
function BuildAfforestation(){

  var temp = 0;

  for (var i = 0; i < Build.param.length; i++) {
    if(!Build.param[i].enabled){

      temp = Math.floor( Math.random() * 2);
    	Build.param[i].type = temp;
      Build.param[i].damage = 0;
      Build.param[i].enabled = true;
      Build.param[i].visible = true;
      if(p_direction==0){
        Build.param[i].x = p_posX-114;
      }else{
        Build.param[i].x = p_posX+114;
      }

      Build.param[i].y = p_posY+8;
      Build.param[i].w = 42 ,Build.param[i].h = 190;
      Build.param[i].buildtime = time_progress;

      break;
    }
  }
}

//Residual
function BuildResidual(x,y){

  for (var i = 0; i < Build.param.length; i++) {
    if(!Build.param[i].enabled){

      	Build.param[i].type = 1;
        Build.param[i].damage = 20;
        Build.param[i].enabled = true;
        Build.param[i].visible = true;
        Build.param[i].x = x ,Build.param[i].y = y+10;
        Build.param[i].w = 50 ,Build.param[i].h = 50;
        Build.param[i].gl = y;
        Build.param[i].availa = 3000;
        Build.param[i].buildtime = time_progress;

        break;
    }
  }
}
//explosion
function BuildExplosion(x,y){

  for (var i = 0; i < Build.param.length; i++) {
    if(!Build.param[i].enabled){

      	Build.param[i].type = 2;
        Build.param[i].damage = 10;
        Build.param[i].enabled = true;
        Build.param[i].visible = true;
        Build.param[i].x = x ,Build.param[i].y = y;
        Build.param[i].w = 20 ,Build.param[i].h = 20;
        Build.param[i].gl = y;
        Build.param[i].availa = 1000;
        Build.param[i].buildtime = time_progress;
        break;
    }
  }
}
//
//Build falling check
function BuildFallMonitor(){

	Build.param.forEach(function(value){

		value.gl = GetGroundPos(value.y);
		value.pid = GetActboxId(value.x,value.y,20,20);

		if(value.y <value.gl && !OnPlatformCheck(value.x,value.y,20,value.gl,value.pid)){
			value.isg = false;
		}else{
			value.isg = true;
		}

		if(!value.isg){
			value.y += gravity;
		}
	});
}

//get Build
function BuildCollisionCheck(){

}

function BuildVanishTimeCheck(){

  var mathTemp;

  Build.param.forEach(function(value){
    if(value.enabled){
      if(time_progress >= value.buildtime + value.availa){
        switch (value.type) {
          case 0:

            break;
          case 1:
            value.enabled = false;
            break;
          case 2:
            value.enabled = false;
            break;
        }

      }
    }
  });

}
