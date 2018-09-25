//
//Action Editor
//item.js

//vars *****
var Item = {};

function ItemLoad(){

  Item.param =[];
  for(var i=0;i<64;i++){
		Item.param.push({x:0,y:0,isg:false,
                    droptime:0,type:0,enabled:false,visible:true});
	}
}

function ItemDataInit(){
  Item.param.forEach(function(value){

	});
}

//
// item Drawings
function ItemDraw(){

  var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;
  var sx,sy,sw,sh;

  Item.param.forEach(function(value){

    if(value.enabled && value.visible){
      if(value.type <=10){
        sx = 50 * value.type;
        sy = 0;
        sw = sh = 50;
      }else{
        if(value.type == 21){
          sx = 0;
          sy = 100;
          sw = sh = 50;
        }
        if(value.type == 31){
          sx = 0;
          sy = 150;
          sw = sh = 50;
        }
      }
      ctx.drawImage(Asset.images['item'],sx,sy,sw,sh,
                    value.x-ofx-sw/2,value.y-ofy-sh,sw,sh);
    }
	});
}

//item drop
function ItemDrop(x,y){

  for (var i = 0; i < Item.param.length; i++) {
    if(!Item.param[i].enabled){
      	Item.param[i].type = Math.floor( Math.random() * 11 );
        Item.param[i].enabled = true;
        Item.param[i].visible = true;
        Item.param[i].x = x ,Item.param[i].y = y;
        Item.param[i].isg = false;
        Item.param[i].droptime = time_progress;
        break;
    }
  }
}

//get item
function ItemGetCheck(){

  var tempX,tempY;
  var recoveryHp = Math.floor(playerMaxHp*0.25);

  for (var i = 0; i < Item.param.length; i++) {

    tempX = Item.param[i].x,tempY = Item.param[i].y;

    if(Item.param[i].enabled){
      if(p_posY>=tempY-50 && p_posY-p_colH <= tempY){
        if(p_posX+p_colW/2>=tempX-25 && p_posX-p_colW/2 <= tempX+25){

          if(Item.param[i].type <=10){
            if(playerNowHp + recoveryHp > playerMaxHp){
              playerNowHp = playerMaxHp;
            }else{
              playerNowHp += recoveryHp;
            }
          }

          Item.param[i].enabled = false;
          se_item.pause();
          se_item.currentTime = 0;
          se_item.play();
          break;
        }
      }
    }
  }

}

function ItemVanishTimeCheck(){

  var waittime = 30000;
  var mathTemp;

  Item.param.forEach(function(value){
    if(value.enabled){
      if(time_progress >= value.droptime + waittime){

        value.enabled = false;
      }

      if((value.droptime + waittime)-time_progress <= 10000){
        mathTemp = Math.floor(((value.droptime + waittime)-time_progress)/500);
        if(mathTemp % 2 == 0){
          value.visible = true;
        }else{
          value.visible = false;
        }
      }
    }
  });

}

//
function ItemFallMonitor(){

  for (var i = 0; i < Item.param.length; i++) {
    if(Item.param[i].enabled){
      if(!Item.param[i].isg){
        Item.param[i].y += gravity;
      }

      for (var j = 0; j < Actbox.ground.length; j++) {

        if(Item.param[i].y+gravity >= Actbox.ground[j].y &&
           Item.param[i].y-50-gravity <= Actbox.ground[j].y+Actbox.ground[j].h){
          if(Item.param[i].x+25+gravity >= Actbox.ground[j].x &&
             Item.param[i].x-25-gravity <= Actbox.ground[j].x + Actbox.ground[j].w){

            if(Item.param[i].y < Actbox.ground[j].y ){
              Item.param[i].isg  = true;

            }else{
              Item.param[i].isg = false;
            }

          }
        }
      }
    }
  }
}
