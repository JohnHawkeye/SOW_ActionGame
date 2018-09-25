//
//ActionEditor
//extra.js

//vars *****
var Extra = {};

function ExtraLoad(){

  Extra.param =[];
  for(var i=0;i<64;i++){
    //dir:direction,isg:is ground,dis:distance,anmf:animation frame,
    //inv:interval,time:action time,anmt:animation time
		Extra.param.push({x:100,y:100,dir:0,cw:20,ch:20,isg:false,
      hp:0,spd:2,dis:0,
      itv:0,time:0,anmf:0,anmt:0,
      ptn:0,enabled:false});
	}
}

function ExtraGenerate(){

	for (var i = 0; i < Extra.param.length; i++) {
    if(!Extra.param[i].enabled && Extra.param[i].hp<=0){

      Extra.param[i].x = p_posX;
      Extra.param[i].y = p_posY;
      Extra.param[i].dir = Math.floor( Math.random() * 2 );
      Extra.param[i].cw = 38;
      Extra.param[i].ch = 100;
      Extra.param[i].hp = 100;
      Extra.param[i].ptn = 0;
      Extra.param[i].itv = 0;
      Extra.param[i].time = 0;
      Extra.param[i].dis = 0;
      Extra.param[i].isg = false;
      Extra.param[i].enabled = true;
    	break;
    }
  }

}

function ExtraAction(){

  Extra.param.forEach(function(value,index){
    if(value.enabled){

      //falling
      ExtraGroundCheck(index);
      if(!value.isg){
        value.y += gravity;
      }

      switch (value.ptn) {
        case 0: //idle
          if(value.time == 0){
            value.time = time_progress;
            value.itv = 1000;
          }
          if(time_progress >= value.time + value.itv){
            value.dis = Math.floor( Math.random() * 201 )+200;
            value.dir = Math.floor( Math.random() * 2 );
            value.time = 0;
            value.anmf = 0,value.anmt=0;
            value.ptn++;

          }
          break;
        case 1: //walk
          if(value.dis > value.time){

            //animation frame
            if(value.anmt ==0){
              value.anmt = time_progress;
            }
            if(time_progress >=value.anmt+300){
              if(value.anmf <=3){
                value.anmf++;
              }else{
                value.anmf =0;
              }

              value.anmt=0;
            }

            //move
            if(value.dir==0){
              value.x -=value.spd;
            }else{
              value.x +=value.spd;
            }
            value.time+=value.spd;
          }else{
            value.ptn = 0;
            value.time = 0;
          }
          break;
        case 2: //???

          break;
      }
    }
  });

}
//ShelterExit
function ExtraShelterExit(){
  Extra.param.forEach(function(value){
    if(value.enabled){

        if(stageShelterY-110 < value.y-value.ch &&
           value.y<stageShelterY+20){
          if(stageShelterX-20 < value.x-value.cw/2 &&
             value.x + value.cw/2 <stageShelterX+20){
            value.enabled = false;
            value.hp = 0;
          }
        }
    }
  });
}

//draw
function ExtraDraw(){

  var ofx = p_posX-p_drawX;
  var ofy = p_posY-p_drawY;
  var dx,dy,dw,dh;

  Extra.param.forEach(function(value){
    if(value.enabled){
      switch (value.ptn) {
        case 0: //idle
          dx = 32,dy = 0,dw = 38,dh = 100;
          break;

        case 1: //idle

        if(value.anmf == 0 || value.anmf ==2){
          if(value.dir == 0){
            dx = 32,dy = 100,dw = 30,dh = 100;
          }else{
            dx = 135,dy = 100,dw = 30,dh = 100;
          }
        }
        if(value.anmf == 1){
          if(value.dir == 0){
            dx = 216,dy = 100,dw = 64,dh = 100;
          }else{
            dx = 320,dy = 100,dw = 64,dh = 100;
          }
        }
        if(value.anmf == 3){
          if(value.dir == 0){
            dx = 416,dy = 100,dw = 64,dh = 100;
          }else{
            dx = 520,dy = 100,dw = 64,dh = 100;
          }
        }
          break;
      }
      ctx.drawImage(Asset.images['extra'],dx,dy,dw,dh,
                    value.x-ofx-dw/2,value.y-ofy-dh,dw,dh);
    }
  });
}
