//
//ActionGameEditor  enemy.js

//vars
var Enemy={};
var memoryIndex = 0;
var collisionCorrect = 10;

var portalAnim = 0;
var portalViewRadius = 530;
var portalViewInterval =3000;

//functions
function EnemyLoad(){

	Enemy.param = [];

	for(var i=0;i<64;i++){
		//fsht:shooting flag,area:caution area,itv:interval,eid:enemy id
		//ang:angle,fly,unv:univeersal use
		Enemy.param.push({ex:100,ey:100,sw:40,sh:40,cw:40,ch:40,dir:0,dis:0,ang:0,
											hp:0,of:20,spd:2,fly:false,isg:false,
											type:0,flow:0,fsht:false,death:true,
											itv:0,time:0,area:300,addx:0,addy:0,
											caution:false,eid:0,snum:0,unv:0});
	}

	//Portal data=0:leftt 1:leftb 2:rightt 3:rightb
	Enemy.portal =[];
	Enemy.portal.push({x:1200,y:900,num:0,inv:0,time:0,
											clnum:0,view:0,flag:[false,false,false],
											caution:false,summon:false});
	Enemy.portal.push({x:1200,y:2100,num:0,inv:0,time:0,
											clnum:0,view:0,flag:[false,false,false],
											caution:false,summon:false});
	Enemy.portal.push({x:4400,y:900,num:0,inv:0,time:0,
											clnum:0,view:0,flag:[false,false,false],
											caution:false,summon:false});
	Enemy.portal.push({x:4400,y:2100,num:0,inv:0,time:0,
											clnum:0,view:0,flag:[false,false,false],
											caution:false,summon:false});

	//bit manager
	Enemy.bit = [];
	for(var i = 0; i <5 ; i++) {
		for(var j= 0; j <7 ;j++) {
			Enemy.bit.push({inv:0,time:0,death:false,use:true});
		}
	}
	Enemy.bit[8].use = false;
	Enemy.bit[12].use = false;
	Enemy.bit[17].use = false;
	Enemy.bit[22].use = false;
	Enemy.bit[26].use = false;
	Enemy.bit[28].use = false;
	Enemy.bit[29].use = false;
	Enemy.bit[30].use = false;
	Enemy.bit[31].use = false;
	Enemy.bit[32].use = false;
	Enemy.bit[33].use = false;
	Enemy.bit[34].use = false;
	//bullet
	Enemy.bullet = [];

	for(var i=0;i<256;i++){
		Enemy.bullet.push({bx:0,by:0,addx:0,addy:0,dir:0,rad:10,spd:2,ran:80,ang:0,
											type:0,time:0,dmg:10,death:true});
	}

}

//
//EnemyDataInit
function EnemyDataInit(){

	Enemy.bullet.forEach(function(value){
		value.death=true;
	});
}

//
//draw *****
function EnemyDraw(){

	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;
	var dx=0,dy=0,dw=0,dh=0;
	Enemy.param.forEach(function(value){
		if(!value.death && value.flow >=1){

			switch (value.type) {
				case 0:	//Portal

				if(value.hp <=0){
					if(value.eid == 0||value.eid == 3||value.eid == 6||value.eid == 9){
						ctx.drawImage(Asset.images['portal'],101,383,60,28,
													value.ex-ofx-60/2,value.ey-ofy-28/2,60,28);
					}
					if(value.eid == 1||value.eid == 4||value.eid == 7||value.eid == 10){
						ctx.drawImage(Asset.images['portal'],295,383,60,28,
													value.ex-ofx-60/2,value.ey-ofy-28/2,60,28);
					}
					if(value.eid == 2||value.eid == 5||value.eid == 8||value.eid == 11){
						ctx.drawImage(Asset.images['portal'],489,383,60,28,
													value.ex-ofx-60/2,value.ey-ofy-28/2,60,28);
					}
				}else{
					if(value.eid == 0||value.eid == 3||value.eid == 6||value.eid == 9){
						ctx.drawImage(Asset.images['portal'],62,239,140,140,
													value.ex-ofx-140/2,value.ey-ofy-140/2,140,140);
					}
					if(value.eid == 1||value.eid == 4||value.eid == 7||value.eid == 10){
						ctx.drawImage(Asset.images['portal'],255,239,140,140,
													value.ex-ofx-140/2,value.ey-ofy-140/2,140,140);
					}
					if(value.eid == 2||value.eid == 5||value.eid == 8||value.eid == 11){
						ctx.drawImage(Asset.images['portal'],449,239,140,140,
													value.ex-ofx-140/2,value.ey-ofy-140/2,140,140);
					}
				}

					break;
				case 1:	//bit
					if(value.dir == 0){
						dx=5,dy=108,dw=50,dh=50;
					}else{
						dx=61,dy=108,dw=50,dh=50;
					}
					ctx.drawImage(Asset.images['enemy'],dx,dy,dw,dh,
													value.ex-ofx-dw/2,value.ey-ofy-dh,dw,dh);
				// info:"attack",dx:119,dy:109,dw:50,dy:50;
				// info:"death",dx:172,dy:103,dw:70,dy:56;
					break;
				case 2://bee
					if(value.dir == 0){
						dx=130,dy=23,dw=58,dh=68;
					}else{
						dx=212,dy=23,dw=58,dh=68;
					}
					ctx.drawImage(Asset.images['enemy'],dx,dy,dw,dh,
													value.ex-ofx-dw/2,value.ey-ofy-dh,dw,dh);
					//info:"death",dx=300,dy=41,dw=100,dh=60;
					break;
				case 3://bird
					if(value.flow == 1){
						dx=892,dy=87,dw=52,dh=70;
					}
					if(value.flow == 2){
						dx=892,dy=87,dw=52,dh=70;
					}
					if(value.flow == 3){
						dx=947,dy=87,dw=52,dh=70;
					}
					if(value.flow >= 4){
						if(value.dir == 0){
							dx=14,dy=175,dw=84,dh=120;
						}else{
							dx=112,dy=175,dw=84,dh=120;
						}
					}
					ctx.drawImage(Asset.images['enemy'],dx,dy,dw,dh,
													value.ex-ofx-dw/2,value.ey-ofy-dh,dw,dh);
					break;
				case 4: //insect
					if(value.flow == 1){
						dx=15,dy=463,dw=150,dh=96;
					}
					if(value.flow == 2){
						dx=192,dy=463,dw=150,dh=96;
					}
					ctx.drawImage(Asset.images['enemy'],dx,dy,dw,dh,
													value.ex-ofx-dw/2,value.ey-ofy-dh,dw,dh);
					break;

				case 5:	//spider

					if(value.unv == 0){dx=600,dy=300;}
					if(value.unv == 1){dx=450,dy=300;}
					if(value.unv == 2){dx=300,dy=300;}
					if(value.unv == 3){dx=150,dy=300;}
					if(value.unv == 4){dx=0,dy=300;}
					ctx.save();
					ctx.translate(value.ex-ofx,value.ey-ofy);
					ctx.rotate(value.ang/180*Math.PI);
					ctx.drawImage(Asset.images['enemy'],dx,dy,150,150,
												-75,-75,150,150);
					ctx.restore();
					break;

				case 6:	//crystal
					if(value.flow >= 1){
						dx=17,dy=615,dw=66,dh=158;
					}
					if(value.fsht){
						dx=118,dy=615,dw=66,dh=158;
					}
					if(value.flow == 666){
						dx=199,dy=615,dw=100,dh=158;
					}
					ctx.drawImage(Asset.images['enemy'],dx,dy,dw,dh,
													value.ex-ofx-dw/2,value.ey-ofy-dh,dw,dh);
					break;
			}



			var cr_y = value.ey;
			if(value.type == 5 ){	//correction of origin
				cr_y +=value.sh/2;
			}
			// ctx.fillStyle = "rgba(0,255,100,0.6)";
			// ctx.fillRect(value.ex-ofx-value.cw/2,cr_y-ofy-value.ch,value.cw,value.ch);
			// ctx.fillStyle = "rgba(255,255,255,1.0)";
		}
	});
}
function EnemyPortalDraw(){
	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;

	for (var i = 0; i < Enemy.portal.length; i++) {
		if(!Enemy.portal[i].flag[0] && !Enemy.portal[i].flag[1] && !Enemy.portal[i].flag[2]){
			ctx.drawImage(Asset.images['portal'],0,450,650,214,
											Enemy.portal[i].x-ofx-650/2,Enemy.portal[i].y-ofy-214,650,214);
		}else{
			ctx.drawImage(Asset.images['portal'],0,0,650,214,
											Enemy.portal[i].x-ofx-650/2,Enemy.portal[i].y-ofy-214,650,214);
		}
	}


}

//bullet
function EnemyBulletDraw(){
	Enemy.bullet.forEach(function(value){
		if(!value.death){

			var ofx = p_posX-p_drawX;
			var ofy = p_posY-p_drawY;
			var dx=0,dy=0,dw=0,dh=0;

			switch (value.type) {
				case 0:
					dx=253,dy=119,dw=22,dh=22;
					ctx.drawImage(Asset.images['enemy'],dx,dy,dw,dh,
												value.bx-ofx-dw/2,value.by-ofy-dh,dw,dh);
					break;
				case 1:
					dx=755,dy=355,dw=40,dh=40;

					ctx.save();
					ctx.translate(value.bx-ofx,value.by-ofy);
					ctx.rotate(value.ang/180*Math.PI);
					ctx.drawImage(Asset.images['enemy'],dx,dy,dw,dh,
												-dw,-dh,dw,dh);
					ctx.restore();
				break;
			}


		}
	});
}

//
//Enemy Action Pattern *****
function EnemyActionPattern(){

	Enemy.param.forEach(function(value,index){
	if(!value.death){
			EnemyInView(index);

			switch(value.type){
				case 0:		//Portal
					//EnemyMoveMode(index);

					break;
				case 1:		//bit
					BehaviorEnemyAppear(index,value.ex,value.ey,value.sw,value.sh,
															value.type);

					BehaviorBit(index,value.ex,value.ey,value.addx,value.addy);

					break;
				case 2:	//bee
					BehaviorEnemyAppear(index,value.ex,value.ey,value.sw,value.sh,
															value.type);
					BehaviorBee(index,value.ex,value.ey,value.sw,value.sh,
												value.addx,value.addy);

					break;
				case 3:	//bird
					EnemyFallMonitor(index,value.ex,value.ey,value.sw,value.sh,value.fly);
					BehaviorEnemyAppear(index,value.ex,value.ey,value.sw,value.sh,
															value.type);
					BehaviorBird(index,value.ex,value.ey,value.sw,value.sh,
												value.addx,value.addy);

					break;
				case 4:	//insect
					BehaviorEnemyAppear(index,value.ex,value.ey,value.sw,value.sh,
															value.type);
					BehaviorInsect(index,value.ex,value.ey,value.sw,value.sh,
																value.addx,value.addy);
					break;

				case 5:		//spider
					BehaviorEnemyAppear(index,value.ex,value.ey,value.sw,value.sh,
															value.type);

					BehaviorSpider(index,value.ex,value.ey,value.sw,value.sh,
																value.addx,value.addy);
					break;

				case 6:	//crystal
					BehaviorEnemyAppear(index,value.ex,value.ey,value.sw,value.sh,
															value.type);
					BehaviorCrystal(index,value.ex,value.ey,value.sw,value.sh,
																	value.addx,value.addy);
					break;
				}
		}
	});
}
//Enemy In View
function EnemyInView(index){

	var temp_distance=0;
	var ex = Enemy.param[index].ex;
	var ey = Enemy.param[index].ey;
	var area = Enemy.param[index].area;

	temp_distance = Math.sqrt(Math.pow(ex-p_posX,2)+Math.pow(ey-p_posY,2));

	if(temp_distance <= area+p_colW){
		Enemy.param[index].caution = true;
	}else{
		Enemy.param[index].caution = false;
	}
}

//
//Enemy move Mode
function EnemyMoveMode(index){
	switch(Enemy.param[index].type){
		case 0:
			if(Enemy.param[index].time == 0){
				Enemy.param[index].time = time_progress;
			}
			if(time_progress >= Enemy.param[index].time + 400){
				if(portalAnim <10){
					Enemy.param[index].ey += 3;
				}else{
					Enemy.param[index].ey -= 3;
				}
				if(portalAnim >=20){
					portalAnim =0;
				}else{
					portalAnim++;
				}
				Enemy.param[index].time = 0;
			}
			break;
		case 1:
			EnemyFlying(index,120);
			break;
		}
}
//
//attack
function EnemyAttackMode(index){
	switch (Enemy.param[index].type) {
		case 0:

			if(!Enemy.param[index].fsht){
				Enemy.param[index].time = time_progress;
				Enemy.param[index].itv = 400;
				se_shoot.play();
				EnemyNomalShoot(index);
				Enemy.param[index].fsht = true;
			}
			if(time_progress >= Enemy.param[index].time + Enemy.param[index].itv){
				Enemy.param[index].fsht = false;
			}
			break;

		case 5:

			if(!Enemy.param[index].fsht && Enemy.param[index].snum <= 9){
				Enemy.param[index].time = time_progress;
				Enemy.param[index].itv = 100;
				se_shoot.play();
				EnemyGatlingShoot(index);
				Enemy.param[index].snum++;
				Enemy.param[index].fsht = true;
			}

			if(time_progress >= Enemy.param[index].time + Enemy.param[index].itv){
				Enemy.param[index].fsht = false;
			}
			break;

		case 6:

			if(!Enemy.param[index].fsht){
				Enemy.param[index].time = time_progress;
				Enemy.param[index].itv = 600;
				se_shoot.play();
				EnemyNomalShoot(index);
				Enemy.param[index].fsht = true;
			}
			if(time_progress >= Enemy.param[index].time + Enemy.param[index].itv){
				Enemy.param[index].fsht = false;
			}
			break;
	}
}

// *****
//EnemyActionParts

function EnemyIdle(index,interval){
	if(Enemy.param[index].time == 0){
		Enemy.param[index].time = time_progress;
		Enemy.param[index].itv = interval;
	}
	if(time_progress >= Enemy.param[index].time + Enemy.param[index].itv ){
		Enemy.param[index].time = 0;
		Enemy.param[index].itv = 0;
		Enemy.param[index].flow++;
	}
}
//
//move
function EnemyRunning(index,point){

	var spd = Enemy.param[index].spd;
	var dir = Enemy.param[index].dir;
	var dis = Enemy.param[index].dis;

	if(point == 0){	//run permanently
		if(dir ==0){
			Enemy.param[index].ex -= spd;
		}else{
			Enemy.param[index].ex += spd;
		}
	}else{
		if(dis < point){
			if(dir ==0){
				Enemy.param[index].ex -= spd;
			}else{
				Enemy.param[index].ex += spd;
			}
			Enemy.param[index].dis +=spd;
		}else{
			Enemy.param[index].dis = 0;
		}
	}
}

function EemyHighSpeed(index,point){

	var temp_r = 0;
	var dir = Enemy.param[index].dir;
	var ex = Enemy.param[index].ex;
	var ey = Enemy.param[index].ey;
	var addx = Enemy.param[index].addx;
	var addy = Enemy.param[index].addy;

	if(Enemy.param[index].dis < point){

		Enemy.param[index].ex += addx*50;
		Enemy.param[index].ey += addy*50;
		Enemy.param[index].dis += Math.sqrt(Math.pow(addx*50,2)+Math.pow(addy*50,2));
	}else{
		Enemy.param[index].dis = 0;
		Enemy.param[index].flow++;
	}
}

function GetPointBitMove(index,angle){

	var temp_r = 0;
	var ex = Enemy.param[index].ex;
	var ey = Enemy.param[index].ey;

	if(p_posX <= ex ){
		temp_r = (Math.atan2(((ey-angle)-ey),((ex-400)-ex))/Math.PI*180+360)%360;
	}else{
		temp_r = (Math.atan2(((ey-angle)-ey),((ex+400)-ex))/Math.PI*180+360)%360;
	}
	Enemy.param[index].addx = Math.cos(temp_r*(Math.PI /180));
	Enemy.param[index].addy = Math.sin(temp_r*(Math.PI /180));
}

function EnemyFlying(index,point){

	var addx = 0,addy = 0,temp_r = 0;
	var spd = Enemy.param[index].spd;
	var dir = Enemy.param[index].dir;
	var dis = Enemy.param[index].dis;
	var ex = Enemy.param[index].ex;
	var ey = Enemy.param[index].ey;

	temp_r = (Math.atan2((p_posY-ey),(p_posX-ex))/Math.PI*180+360)%360;
	addx = Math.cos(temp_r*(Math.PI /180));
	addy = Math.sin(temp_r*(Math.PI /180));

	if(point == 0){	//run permanently
		Enemy.param[index].ex += addx;
		Enemy.param[index].ex += addy;
	}else{
		if(dis < point){
			Enemy.param[index].ex += addx;
			Enemy.param[index].ex += addy;
			Enemy.param[index].dis += Math.sqrt(Math.pow(addx,2)+Math.pow(addy,2));
		}else{
			Enemy.param[index].dis = 0;
		}
	}
}
//
//bullet *****
//shooting bullet crieate
function EnemyNomalShoot(index){

	var ex = Enemy.param[index].ex;
	var ey = Enemy.param[index].ey;
	var ew = Enemy.param[index].cw;
	var eh = Enemy.param[index].ch;
	var edir = Enemy.param[index].dir;

	var temp_r = 0;
	var arylength = Enemy.bullet.length;

	for(var i=0;i<arylength;i++){
		if(Enemy.bullet[i].death){
			if(edir == 0){
				Enemy.bullet[i].bx = ex - ew/2;
			}else{
					Enemy.bullet[i].bx = ex + ew/2;
			}
			Enemy.bullet[i].by = ey - eh/2;

			temp_r = (Math.atan2((p_posY-ey),(p_posX-ex))/Math.PI*180+360)%360;
			Enemy.bullet[i].addx = Math.cos(temp_r*(Math.PI /180));
			Enemy.bullet[i].addy = Math.sin(temp_r*(Math.PI /180));
			Enemy.bullet[i].dir = edir;
			Enemy.bullet[i].rad = 10;
			Enemy.bullet[i].spd = 4;
			Enemy.bullet[i].ran = 200;
			Enemy.bullet[i].type = 0;
			Enemy.bullet[i].time = 0;
			Enemy.bullet[i].dmg = 10;
			Enemy.bullet[i].death = false;
			break;
		}
	}
}

//Gatling gun
function EnemyGatlingShoot(index){

	var ex = Enemy.param[index].ex;
	var ey = Enemy.param[index].ey;
	var ew = Enemy.param[index].cw;
	var eh = Enemy.param[index].ch;
	var edir = Enemy.param[index].dir;

	var temp_r = 0;
	var arylength = Enemy.bullet.length;

	for(var i=0;i<arylength;i++){
		if(Enemy.bullet[i].death){

			Enemy.bullet[i].bx = ex-20;
			Enemy.bullet[i].by = ey-20;

			temp_r = (Math.atan2((p_posY-ey),(p_posX-ex))/Math.PI*180+360)%360;
			Enemy.bullet[i].addx = Math.cos(temp_r*(Math.PI /180));
			Enemy.bullet[i].addy = Math.sin(temp_r*(Math.PI /180));
			Enemy.bullet[i].dir = edir;
			Enemy.bullet[i].rad = 20;
			Enemy.bullet[i].spd = 4;
			Enemy.bullet[i].ran = 300;
			Enemy.bullet[i].type = 1;
			Enemy.bullet[i].time = 0;
			Enemy.bullet[i].dmg = 10;
			Enemy.bullet[i].ang = Enemy.param[index].ang;
			Enemy.bullet[i].death = false;
			break;
		}
	}
}

//Orbit
function BulletOrbit(){

	Enemy.bullet.forEach(function(value){
		if(!value.death){
			if(value.time < value.ran){
				value.bx += value.addx*value.spd;
				value.by += value.addy*value.spd;
				value.time += Math.sqrt(Math.pow(value.addx,2)+Math.pow(value.addy,2))*value.spd;
			}else{
				value.death = true;
			}
		}
	});
}
//
//EnemyCollision
function EnemyCollision(){

var cr_y;

	Enemy.param.forEach(function(value){
		if(!value.death){

			cr_y = value.ey;

			if(value.type == 0 ||value.type == 5 ){	//correction of origin
				cr_y +=value.sh/2;
			}

			if(cr_y>p_posY-p_colH && cr_y-value.ch<p_posY){
				if(value.ex+value.cw/2>p_posX-p_colW/2 &&
						value.ex-value.cw/2<p_posX+p_colW/2){
							//se_pdamage.play();
							EnemyDamageToPlayer(value.of);
							DamageKnockBack(value.dir);
					}
			}
		}
	});
}

//bullet collision
function BulletCollision(){

	var temp_distance=0;

	Enemy.bullet.forEach(function(value){
		if(!value.death){
			if(Collider.player[0].enabled){
				//collide with barrier
				temp_distance = Math.sqrt(Math.pow(value.bx-p_posX,2)+
																 Math.pow(value.by-(p_posY-Collider.player[0].ch),2));
					if(temp_distance <= value.rad + Collider.player[0].cw){

						value.death = true;

					}

			}else{
				//collide with player
				if(!isInvincible){
				temp_distance = Math.sqrt(Math.pow(value.bx-p_posX,2)+Math.pow(value.by-(p_posY-p_colH/2),2));

					if(temp_distance <= value.rad + p_colW){
						EnemyDamageToPlayer(value.dmg);
						value.death = true;

						DamageKnockBack(value.dir);
					}
				}
			}

		}
	});
}

//PlayerKnockBack
function DamageKnockBack(dir){
	if(!flagKnockBack){
		movelock_L = true, movelock_R = true;
		movelock_U = true, movelock_D = true;
		keylock_A = true, keylock_D = true;

		damageOrigin = dir;
		countKockBack = time_progress;
		flagKnockBack = true;
		inviTimer = time_progress;
		inviInterval = 2000;
		isInvincible = true;
	}
}
//
//PlayerDamage
function EnemyDamageToPlayer(damage){

	if(playerNowHp-damage > 0){
		playerNowHp -= damage;
	}else{
		playerNowHp = 0;
	}

	if(playerNowHp <=0){
		//se_nooo.play();
		//game over
	}
}

//
//Enemy falling check
function EnemyFallMonitor(index,ex,ey,sw,sh,fly){

	Actbox.ground.forEach(function(value){
		if(!fly){
			if(ey+gravity >= value.y &&
				 ey-sh-gravity <= value.y+value.h){
				if(ex+sw/2+gravity >= value.x &&
					 ex-sw/2-gravity <= value.x + value.w){

					if(ey < value.y ){
						Enemy.param[index].isg  = true;
					}else{
						Enemy.param[index].isg = false;
					}
				}
			}
		}

	});
}
