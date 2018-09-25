//
//ActionGameEditor  stage.js

//vars *****
var stageWidth;
var stageHeight;

var stageStartPosX;
var stageStartPosY;

var stageShelterX =4010;
var stageShelterY =2900;

var cameraX;
var cameraY;

var Actbox = {};

var summonTime = 0;

var phaseNum = 0;



//stage data load
function StageLoad(){

	var tempRx=0,tempRy=0,tempRw=0,tempRh=0;
	Actbox.ground =[];
	Actbox.ground =[{x:0,y:2900,w:5600,h:100,adjacent:false}];

	// Actbox.ground.forEach(function(value){
	// 	tempRx = Math.floor( Math.random() * stageWidth+1 );
	// 	tempRy = Math.floor( Math.random() * stageHeight+1 );
	// 	tempRw = Math.floor( Math.random() * 101 )+50;
	// 	tempRh = Math.floor( Math.random() * 101 )+50;
	// 	value.x = tempRx,value.y = tempRy,value.w = tempRw,value.h = tempRh;
	// });

  Actbox.event = [
    {x:0,y:0,w:100,h:100}
  ];

  Actbox.platform = [];

	for(var i=0;i<64;i++){
		Actbox.platform.push({x:0,y:0,w:100,h:100,move:false,
													visible:false,enabled:false});
	}
  //

}

//stage data initialize
function StageDataInit(){

  stageWidth = 5600;
  stageHeight = 3000;

  cameraX = 800;
  cameraY = 600;

	stageStartPosX = 1200;
	stageStartPosY = 2800;

	p_posX = stageStartPosX;
	p_posY = stageStartPosY;

}

//
//stage phase manager
function StagePhaseManager(){

	switch (phaseNum) {
		case 0:
			StageBitGenerate();
			StagePortalSetTime();
			StagePortalAppear();


			phaseNum = 1;
			break;
		case 1:
			StagePortalTransfer();
			StagePortalCautionCheck();
			StageCrystalGenerate();
			break;
	}

}

//
//actbox wall check
function WallCheck(){

	Actbox.ground.forEach(function(value){
		if(p_posY+playerMoveSpeed + gravity*playerWeight >= value.y &&
			 p_posY-p_drawH-playerMoveSpeed + gravity*playerWeight <= value.y+value.h){
			if(p_posX+p_drawW/2+playerMoveSpeed >= value.x &&
				 p_posX-p_drawW/2-playerMoveSpeed <= value.x + value.w){

				if(pressedKeys[0] && p_posX-p_drawW/2 > value.x + value.w){
					p_posX += playerMoveSpeed;
				}
				if(pressedKeys[1] && p_posX+p_drawW/2 < value.x ){
					p_posX -= playerMoveSpeed;
				}
				if(pressedKeys[2] && p_posY-p_drawH > value.y+value.h){
					p_posY += playerMoveSpeed;
				}
				if(playerCharaType == 0){
					if(pressedKeys[3] && p_posY < value.y){
						p_posY -= playerMoveSpeed;
					}
				}

			 	 value.adjacent = true;
			}else{
				value.adjacent = false;
			}
		}else{
				value.adjacent = false;
		}
	});
}

function PlayerGroundCheck(){
	Actbox.ground.forEach(function(value){
		if(p_posY+playerMoveSpeed >= value.y &&
			 p_posY-p_drawH-playerMoveSpeed <= value.y+value.h){
			if(p_posX+p_drawW/2+playerMoveSpeed >= value.x &&
				 p_posX-p_drawW/2-playerMoveSpeed <= value.x + value.w){

				if(p_posY < value.y && value.adjacent){
					isGround = true;
				}else{
					isGround = false;
				}
			}else{
				isGround = false;
			}
		}else{
			isGround = false;
		}
	});
}

//platform check
function StagePlatformCheck(){
	Actbox.platform.forEach(function(value){
		if(value.enabled){
			if(p_posY+playerMoveSpeed + gravity*playerWeight >= value.y &&
				 p_posY-p_colH-playerMoveSpeed + gravity*playerWeight <= value.y+value.h){
				if(p_posX+p_colW/2+playerMoveSpeed >= value.x &&
					 p_posX-p_colW/2-playerMoveSpeed <= value.x + value.w){

					if(pressedKeys[0] && p_posX-p_drawW/2 > value.x + value.w){
						p_posX += playerMoveSpeed;
					}
					if(pressedKeys[1] && p_posX+p_drawW/2 < value.x ){
						p_posX -= playerMoveSpeed;
					}
					if(pressedKeys[2] && p_posY-p_drawH > value.y+value.h){
						p_posY += playerMoveSpeed;
					}
					if(playerCharaType == 0){
						if(pressedKeys[3] && p_posY < value.y){
							p_posY -= playerMoveSpeed;
						}
					}else{
						if(p_posY < value.y){
							isGround = true;
						}
					}


				}
			}
		}
	});
}

//
function ExtraGroundCheck(index){

	var ex_x = Extra.param[index].x;
	var ex_y = Extra.param[index].y;
	var ex_cw = Extra.param[index].cw;
	var ex_ch = Extra.param[index].ch;


	Actbox.ground.forEach(function(value){
		if(ex_y+gravity >= value.y &&
			 ex_y-ex_ch-gravity <= value.y+value.h){
			if(ex_x+ex_cw/2+gravity >= value.x &&
				 ex_x-ex_cw/2-gravity <= value.x + value.w){

				if(ex_y < value.y ){
					Extra.param[index].isg  = true;
				}else{
					Extra.param[index].isg = false;
				}
			}
		}
	});
}
//
//test enemy generate
function StageEnemyGenerate(){

	for (var i = 0; i < Enemy.param.length; i++) {
    if(Enemy.param[i].death && Enemy.param[i].hp<=0){

			Enemy.param[i].ex = p_posX+200;
			Enemy.param[i].ey = p_posY-200;
			Enemy.param[i].dis = 0;
			Enemy.param[i].flow = 0;
			Enemy.param[i].inv = 0;
			Enemy.param[i].time = 0;
			Enemy.param[i].fsht = false;
			Enemy.param[i].caution = false;
			Enemy.param[i].death = false;
			Enemy.param[i].unv = 0;

			Enemy.param[i].sw = 52;
			Enemy.param[i].sh = 70;
			Enemy.param[i].type = 3;
			Enemy.param[i].cw = 52;
			Enemy.param[i].ch = 70;
			Enemy.param[i].dir = 1;
			Enemy.param[i].hp = 100;
			Enemy.param[i].spd = 2;
			Enemy.param[i].fly = false;
			Enemy.param[i].isg = false;
			Enemy.param[i].area = 300;
    	break;
    }
  }
}

//
//portal settings
function StagePortalSetTime(){
	for (var i = 0; i < Enemy.portal.length; i++) {
		Enemy.portal[i].inv = 1000*(Math.random()*2+1);
		Enemy.portal[i].time = time_progress;
	}
}

function StagePortalAppear(){

	var count_appear = 0;

	for (var i = 0; i < Enemy.param.length; i++) {
		if(Enemy.param[i].death && Enemy.param[i].hp<=0){

			switch (count_appear) {
				case 0://left top
					Enemy.param[i].ex = Enemy.portal[0].x-194;
					Enemy.param[i].ey = Enemy.portal[0].y-206;
					Enemy.portal[0].flag[0] = true;
					break;
				case 1:
					Enemy.param[i].ex = Enemy.portal[0].x;
					Enemy.param[i].ey = Enemy.portal[0].y-206;
					Enemy.portal[0].flag[1] = true;
					break;
				case 2:
					Enemy.param[i].ex = Enemy.portal[0].x+194;
					Enemy.param[i].ey = Enemy.portal[0].y-206;
					Enemy.portal[0].flag[2] = true;
					break;
				case 3://left bottom
					Enemy.param[i].ex = Enemy.portal[1].x-194;
					Enemy.param[i].ey = Enemy.portal[1].y-206;
					Enemy.portal[1].flag[0] = true;
					break;
				case 4:
					Enemy.param[i].ex = Enemy.portal[1].x;
					Enemy.param[i].ey = Enemy.portal[1].y-206;
					Enemy.portal[1].flag[1] = true;
					break;
				case 5:
					Enemy.param[i].ex = Enemy.portal[1].x+194;
					Enemy.param[i].ey = Enemy.portal[1].y-206;
					Enemy.portal[1].flag[2] = true;
					break;
				case 6://right top
					Enemy.param[i].ex = Enemy.portal[2].x-194;
					Enemy.param[i].ey = Enemy.portal[2].y-206;
					Enemy.portal[2].flag[0] = true;
					break;
				case 7:
					Enemy.param[i].ex = Enemy.portal[2].x;
					Enemy.param[i].ey = Enemy.portal[2].y-206;
					Enemy.portal[2].flag[1] = true;
					break;
				case 8:
					Enemy.param[i].ex = Enemy.portal[2].x+194;
					Enemy.param[i].ey = Enemy.portal[2].y-206;
					Enemy.portal[2].flag[2] = true;
					break;
				case 9://right bottom
					Enemy.param[i].ex = Enemy.portal[3].x-194;
					Enemy.param[i].ey = Enemy.portal[3].y-206;
					Enemy.portal[3].flag[0] = true;
					break;
				case 10:
					Enemy.param[i].ex = Enemy.portal[3].x;
					Enemy.param[i].ey = Enemy.portal[3].y-206;
					Enemy.portal[3].flag[1] = true;
					break;
				case 11:
					Enemy.param[i].ex = Enemy.portal[3].x+194;
					Enemy.param[i].ey = Enemy.portal[3].y-206;
					Enemy.portal[3].flag[2] = true;
					break;
			}

			Enemy.param[i].sw = 60;
			Enemy.param[i].sh = 28;
			Enemy.param[i].type = 0;
			Enemy.param[i].cw = 60;
			Enemy.param[i].ch = 28;
			Enemy.param[i].dir = 0;
			Enemy.param[i].dis = 0;
			Enemy.param[i].ang = 0;
			Enemy.param[i].hp = 100;
			Enemy.param[i].spd = 0;
			Enemy.param[i].fly = true;
			Enemy.param[i].isg = false;
			Enemy.param[i].flow = 1;
			Enemy.param[i].inv = 0;
			Enemy.param[i].time = 0;
			Enemy.param[i].area = 1000;
			Enemy.param[i].fsht = false;
			Enemy.param[i].caution = false;
			Enemy.param[i].death = false;
			Enemy.param[i].eid = count_appear;
			Enemy.param[i].unv = 0;
			//eid A:(0,1,2),B:(3,4,5),C(6,7,8),D(9,10,11)

			count_appear++;

			if(count_appear >11){
					break;
			}
		}
	}
}

//
//enemy appear for portal
function StagePortalTransfer(){

	var random_num;
	for (var i = 0; i < 4; i++) {
		if(Enemy.portal[i].num<=4){

			if(time_progress>=Enemy.portal[i].time+Enemy.portal[i].inv){

				for (var j = 0; j < Enemy.param.length; j++) {
					if(Enemy.param[j].death && Enemy.param[j].hp<=0){

						random_num = Math.floor(Math.random()*2);

						Enemy.param[j].ex = Enemy.portal[i].x -125 + Math.floor(Math.random()*251);
						Enemy.param[j].ey = Enemy.portal[i].y + 154;
						Enemy.param[j].dis = 0;
						Enemy.param[j].ang = 0;
						Enemy.param[j].flow = 0;
						Enemy.param[j].inv = 0;
						Enemy.param[j].time = 0;
						Enemy.param[j].fsht = false;
						Enemy.param[j].caution = false;
						Enemy.param[j].death = false;
						Enemy.param[i].unv = 0;

						if(i==0||i==2){//top
							if(random_num == 0){	//insect
								Enemy.param[j].sw = 150;
								Enemy.param[j].sh = 150;
								Enemy.param[j].type = 4;
								Enemy.param[j].cw = 150;
								Enemy.param[j].ch = 150;
								Enemy.param[j].dir = 1;
								Enemy.param[j].hp = 100;
								Enemy.param[j].spd = 2;
								Enemy.param[j].fly = true;
								Enemy.param[j].isg = false;
								Enemy.param[j].area = 300;
							}else{	//spider
								Enemy.param[j].sw = 150;
								Enemy.param[j].sh = 150;
								Enemy.param[j].type = 5;
								Enemy.param[j].cw = 150;
								Enemy.param[j].ch = 150;
								Enemy.param[j].dir = 1;
								Enemy.param[j].hp = 100;
								Enemy.param[j].spd = 2;
								Enemy.param[j].fly = true;
								Enemy.param[j].isg = false;
								Enemy.param[j].area = 300;
								Enemy.param[j].ang = 90;
								Enemy.param[i].unv = 4;
							}
						}

						if(i==1||i==3){//bottom
							if(random_num == 0){	//bee
								Enemy.param[j].sw = 58;
								Enemy.param[j].sh = 68;
								Enemy.param[j].type = 2;
								Enemy.param[j].cw = 58;
								Enemy.param[j].ch = 68;
								Enemy.param[j].dir = 1;
								Enemy.param[j].ang = 270;
								Enemy.param[j].hp = 100;
								Enemy.param[j].spd = 4;
								Enemy.param[j].fly = true;
								Enemy.param[j].isg = false;
								Enemy.param[j].area = 300;
							}else{	//bird
								Enemy.param[j].sw = 52;
								Enemy.param[j].sh = 70;
								Enemy.param[j].type = 3;
								Enemy.param[j].cw = 52;
								Enemy.param[j].ch = 70;
								Enemy.param[j].dir = 1;
								Enemy.param[j].hp = 100;
								Enemy.param[j].spd = 2;
								Enemy.param[j].fly = false;
								Enemy.param[j].isg = false;
								Enemy.param[j].area = 300;
							}
						}



						Enemy.portal[i].num++;

						break;
					}
				}

				Enemy.portal[i].inv = 1000*(Math.random()*2+1);
				Enemy.portal[i].time = time_progress;
			}
		}
	}
}

function StagePortalCautionCheck(){

	var temp_distance=0;

		temp_distance = Math.sqrt(Math.pow(Enemy.portal[0].x-p_posX,2)+Math.pow((Enemy.portal[0].y-200)-p_posY,2));
		if(temp_distance <= p_colW/2+portalViewRadius){
			Enemy.portal[0].caution = true;
		}else{
			Enemy.portal[0].caution = false;
		}

		temp_distance = Math.sqrt(Math.pow(Enemy.portal[1].x-p_posX,2)+Math.pow((Enemy.portal[1].y-200)-p_posY,2));
		if(temp_distance <= p_colW/2+portalViewRadius){
			Enemy.portal[1].caution = true;
		}else{
			Enemy.portal[1].caution = false;
		}

		temp_distance = Math.sqrt(Math.pow(Enemy.portal[2].x-p_posX,2)+Math.pow((Enemy.portal[2].y-200)-p_posY,2));
		if(temp_distance <= p_colW/2+portalViewRadius){
			Enemy.portal[2].caution = true;
		}else{
			Enemy.portal[2].caution = false;
		}

		temp_distance = Math.sqrt(Math.pow(Enemy.portal[3].x-p_posX,2)+Math.pow((Enemy.portal[3].y-200)-p_posY,2));
		if(temp_distance <= p_colW/2+portalViewRadius){
			Enemy.portal[3].caution = true;
		}else{
			Enemy.portal[3].caution = false;
		}
}

function StageCrystalGenerate(){

	for (var i = 0; i < Enemy.portal.length; i++) {
		if(Enemy.portal[i].caution && !Enemy.portal[i].summon){
			if(Enemy.portal[i].view == 0){
				Enemy.portal[i].view = time_progress;
			}
			if(time_progress >= Enemy.portal[i].view + portalViewInterval){
				if(Enemy.portal[i].clnum <3){
					for (var j = 0; j < Enemy.param.length ; j++) {
						if(Enemy.param[j].death && Enemy.param[j].hp<=0){

							if(Enemy.portal[i].x > p_posX){
								if(Enemy.portal[i].clnum == 0){
									Enemy.param[j].ex = p_posX-300;
									Enemy.param[j].ey = p_posY-300;
								}
								if(Enemy.portal[i].clnum == 1){
									Enemy.param[j].ex = p_posX-400;
									Enemy.param[j].ey = p_posY-200;
								}
								if(Enemy.portal[i].clnum == 2){
									Enemy.param[j].ex = p_posX-400;
									Enemy.param[j].ey = p_posY+200;
								}
							}else{
								if(Enemy.portal[i].clnum == 0){
									Enemy.param[j].ex = p_posX+300;
									Enemy.param[j].ey = p_posY-300;
								}
								if(Enemy.portal[i].clnum == 1){
									Enemy.param[j].ex = p_posX+400;
									Enemy.param[j].ey = p_posY-200;
								}
								if(Enemy.portal[i].clnum == 2){
									Enemy.param[j].ex = p_posX+400;
									Enemy.param[j].ey = p_posY+200;
								}
							}

							Enemy.param[j].sw = 66;
							Enemy.param[j].sh = 158;
							Enemy.param[j].type = 6;
							Enemy.param[j].cw = 66;
							Enemy.param[j].ch = 158;
							Enemy.param[j].dir = 0;
							Enemy.param[j].dis = 0;
							Enemy.param[j].hp = 300;
							Enemy.param[j].spd = 2;
							Enemy.param[j].fly = true;
							Enemy.param[j].isg = false;
							Enemy.param[j].flow = 0;
							Enemy.param[j].inv = 0;
							Enemy.param[j].time = 0;
							Enemy.param[j].area = 200;
							Enemy.param[j].fsht = false;
							Enemy.param[j].caution = false;
							Enemy.param[j].death = false;
							Enemy.param[i].unv = 0;

							Enemy.portal[i].clnum++;

							break;
						}
					}
				}else{
						Enemy.portal[i].summon = true;
						Enemy.portal[i].view = 0;
				}
			}
		}
	}
}

//
//bit generate
function StageBitGenerate(){

	var arycount_x = 0;
	var arycount_y = 0;

	for(var i=0;i<Enemy.bit.length; i++){
		if(Enemy.bit[i].use && !Enemy.bit[i].death){
			for (var j = 0; j < Enemy.param.length ; j++) {
				if(Enemy.param[j].death && Enemy.param[j].hp<=0){

					Enemy.param[j].ex = (arycount_x * 800) + Math.floor(Math.random()*800);
					Enemy.param[j].ey = (arycount_y * 600) + Math.floor(Math.random()*600);
					Enemy.param[j].sw = 50;
					Enemy.param[j].sh = 50;
					Enemy.param[j].type = 1;
					Enemy.param[j].cw = 50;
					Enemy.param[j].ch = 50;
					Enemy.param[j].dir = Math.floor(Math.random()*2);
					Enemy.param[j].dis = 0;
					Enemy.param[j].hp = 300;
					Enemy.param[j].spd = 2;
					Enemy.param[j].fly = true;
					Enemy.param[j].isg = false;
					Enemy.param[j].flow = 0;
					Enemy.param[j].inv = 0;
					Enemy.param[j].time = 0;
					Enemy.param[j].area = 200;
					Enemy.param[j].fsht = false;
					Enemy.param[j].caution = false;
					Enemy.param[j].death = false;
					Enemy.param[i].unv = 0;

					break;
				}
			}
		}

		if(arycount_x>=6){
			arycount_x = 0;
			arycount_y++;
		}else{
			arycount_x++;
		}

	}
}


//
//stage ground draw
function StageGroundDraw(){

	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;


	Actbox.ground.forEach(function(value){
		if(p_posY-300 <= value.y+value.h &&
			 p_posY+300 >= value.y){
			if(p_posX-400 <= value.x + value.w &&
				 p_posX+400 >= value.x - value.w/2){
					ctx.drawImage(Asset.images['block'],0,0,100,100,
												value.x-ofx,value.y-ofy,value.w,value.h);
					ctx.font = "bold 12px 'ＭＳ ゴシック'";
	 				ctx.fillStyle = "rgba(255,255,255,1.0)";
					if(value.adjacent){
						ctx.fillText("x:"+value.x +" ,y:"+ value.y+"[on]",value.x-ofx,value.y-ofy);
					}else{
						ctx.fillText("x:"+value.x +" ,y:"+ value.y+"[off]",value.x-ofx,value.y-ofy);
					}
			}
		}
	});
}

function StageShelterDraw(){
	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;

	ctx.drawImage(Asset.images['extra'],24,233,150,216,
								stageShelterX-ofx-75,stageShelterY-ofy-208,150,216);
}
