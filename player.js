//
//ActionGameEditor  player.js

//vars *****
//Use drawing only
var p_drawX = 400;
var p_drawY = 400;
var p_drawW = 100;
var p_drawH = 100;

//animation
var p_animInterval = 300;
var p_animTime = 0;
var p_animKeyNum = 0;
var p_isSkillAnim = false;
var p_anim_dx,p_anim_dy;
var p_anim_keys =[];
var p_animMode = "IDLE";

//position
var p_posX = 0;
var p_posY = 0;
var p_direction = 1;	//left:0, right:1

//collision size
var p_colX = 100;
var p_colY = 100;
var p_colW = 80;
var p_colH = 100;

//graund
var groundLine = 0;
var isGround = false;
var isPlatform = false;
var isWarpZone = false;

//player status
var Player = {};
var playerCharaType = 0;
var charaChangeEnabled = true;
var playerPrepare = false;
var playerMaxHp = 100;
var playerNowHp = playerMaxHp;
var playerDefence = 0;
var playerOffence = 0;
var playerAttackSpeed = 200;
var playerWeight = 2;
var playerComboNum = 0;
var playerComboTime = 0;

var playerMoveSpeed = 4;
var jumpPower = 2;
var jumpHeight = 200;
var countJump = 0;
var jumpFps = 0;
var flagJump = false;
var flagAttack = false;
var gravity = 4;
var isFall = false;
var isInvincible = false;
var isDefence = false;
var inviTimer = 0;
var inviInterval=0;

var knockBack_ofh = 0;
var countKockBack = 0;
var flagKnockBack = false;

//target view
var cursorOperation = false;
var viewX,viewY;

//damage origin
var damageOrigin = 0;

//shoot
var p_shootTime = 0;
var p_shootInterval = 400;

//attack
var p_attackTime = 0;

//Natural spirit
var ns_anim_time = 0;
var ns_anim_keynum = 0;
var ns_anim_keyflame = [2,4,6,4,2,0,-2,-4,-6,-4,-2,0];
var ns_posX=0,ns_posY=0,ns_D=0;
var ns_visible = true;

//sound flags
var sf_dash = false;

//load crieate data
function PlayerDataLoad(){
	Player.bullet = [];

	for(var i=0;i<256;i++){
		//radius,direction,speed,distance,range,damage,
		Player.bullet.push({x:0,y:0,rad:10,dir:0,spd:2,dis:0,ran:100,dmg:10,death:true});
	}
}

//init data
function PlayerDataInit(){

	p_drawX = 400, p_drawY = 600;
	p_drawW = 100, p_drawH = 100;

	p_direction = 1;

	p_colX = 100,p_colY = 100;
	p_colW = 50,p_colH = 100;

	groundLine = 450,	isGround = false;
	isPlatform = false,	isWarpZone = false;

	playerMaxHp = 100,	playerNowHp = playerMaxHp;
	playerDefence = 0,	playerOffence = 50;
	playerMoveSpeed = 2,		jumpPower = 2;
	jumpHeight = 40, 	jumpFps = 0;
	flagJump = false,	gravity = 4;
	isFall = false,		isInvincible = false;
	countInvTime = 0;

	knockBack_ofh = 0,	countKockBack = 0;
	flagKnockBack = false;

	damageOrigin = 0;

	shootX = 0,		shootY = 0,		shootD = 0;
	shootSpeed = 2,	shootRange = 50;
	shootFps =0,	shootRadius = 10;
	flagShoot = false;
}

function PlayerChangeSetting(){
	if(playerCharaType == 0){
		playerMaxHp = 100;
		playerNowHp = playerMaxHp;
		playerDefence = 0;
		playerOffence = 0;
		playerMoveSpeed = 4;
		p_colW = 24;
		p_colH = 100;
	}else{
		playerMaxHp = 140;
		playerNowHp = playerMaxHp;
		playerDefence = 0;
		playerOffence = 0;
		playerMoveSpeed = 6;
		p_colW = 38;
		p_colH = 126;
	}
}

//
//control
function PlayerCommonControl(){

	//isFall
	if(playerCharaType !=0){
	if(!isGround && !flagJump){
			p_posY += gravity*playerWeight;
		}
	}
	//move
	if(pressedKeys[0] && !cursorOperation){	//left
		PlayerAnimRun();
		if(p_posX - p_colW/2-playerMoveSpeed> 0){
				if(!movelock_L){
					p_posX -= playerMoveSpeed;
					p_direction = 0;
				}
		}
	}

	if(pressedKeys[1] && !cursorOperation){	//right
		PlayerAnimRun();
		if(p_posX+p_colW/2+playerMoveSpeed<stageWidth){
				if(!movelock_R){
					p_posX += playerMoveSpeed;
					p_direction =1;
				}
		}
	}

	//'e'key enemy summon
	if(pressedKeys[8]){
//		ExtraGenerate();

		if(time_progress >=summonTime + 300){
				StageEnemyGenerate();
				var temp_random = Math.floor( Math.random() * 701 )+50;

				ItemDrop(p_posX-400+temp_random,p_posY-300);
				summonTime  = 0;
		}
		if(summonTime == 0){
			summonTime = time_progress;
		}
	}
	//Character Change 'C'key
	if(pressedKeys[10] && charaChangeEnabled){
		if(playerCharaType == 0){
			playerCharaType = 1;
			p_anim_keys = [1,2,3,4,5];
		}else{
			playerCharaType = 0;
		}
		PlayerChangeSetting();
		pressedWait[10] = time_progress;
		charaChangeEnabled = false;
		playerPrepare = true;
		p_animInterval = 100;
		p_animTime = 0;
		p_animKeyNum = 0;
		p_anim_dx=0,p_anim_dy=0;

	}

	if(!charaChangeEnabled){
		if(time_progress >= pressedWait[10]+10000){
			charaChangeEnabled = true;
		}
	}

}

//akino
function PlayerAkinoControl(){

	if(pressedKeys[2] && !cursorOperation){
		if(p_posY-p_colH- playerMoveSpeed > 0){
			if(!movelock_U){
				p_posY -= playerMoveSpeed;
			}
		}
	}

	if(pressedKeys[3] && !cursorOperation){
		if(p_posY+playerMoveSpeed < stageHeight){
			if(!movelock_D){
					p_posY += playerMoveSpeed;
			}
		}
	}

	//shoot D key
	if(pressedKeys[5]){
		if(!keylock_D){
			se_shoot.play();
			PlayerBulletGenerate();
			keylock_D = true;
			p_shootTime = time_progress;
		}else{
			if(time_progress >= p_shootTime + p_shootInterval){
				keylock_D = false;
			}
		}
	}

	//skill S key
	if(pressedKeys[7]){
		if(!keylock_S){
			if(isGround){
				LockedAllKeys();
				p_animKeyNum = 0;
				p_isSkillAnim = true;
			}
		}
	}

	//defencev barrier
	if(pressedKeys[9]){
		isDefence = true;
		Collider.player[0].enabled = true;

		keylock_A = true;
		keylock_D = true;
	}else{
		if(isDefence){
			isDefence = false;
			Collider.player[0].enabled = false;

			keylock_A = false;
			keylock_D = false;
		}
	}
}

//gester
function PlayerGesterControl(){

//jump
	if(pressedKeys[4] && isGround){
		if(!flagJump){
			flagJump = true;
			countJump = 0;
		}
	}
	if(flagJump){
		if(countJump>=jumpHeight){
			flagJump = false;
		}else{
			var tempJp;
			if(countJump <jumpHeight*0.75){
				tempJp = 10;
			}else{
				tempJp = 5;
			}
			p_posY -= tempJp;
			countJump += tempJp;

		}
	}

//dash sound
	if(!cursorOperation){
		if(pressedKeys[0]||pressedKeys[1]){
			if(!sf_dash){
				sf_dash = true;
				se_move.pause();
				se_move.currentTime = 0;
				se_move.play();
			}
		}else{
			sf_dash = false;
		}
	}


	//sword attack
	if(pressedKeys[5]){
		if(!flagAttack){
			p_attackTime = time_progress;
			flagAttack = true;
			p_animKeyNum = 0;
			//collider attack
			se_sword.pause();
			se_sword.currentTime = 0;
			se_sword.play();

			if(p_direction == 0){
				Collider.player[1].cx = Collider.player[1].cw +58;

			}else{
				Collider.player[1].cx = 58
			}
			Collider.player[1].enabled = true;
			PlayerAttackCheck();

		}else{
			if(time_progress >= p_attackTime + playerAttackSpeed){
				se_sword.pause();
				se_sword.currentTime = 0;
				se_sword.play();
				p_attackTime = time_progress;

				if(p_direction == 0){
					Collider.player[1].cx = Collider.player[1].cw +58;

				}else{
					Collider.player[1].cx = 58
				}
				Collider.player[1].enabled = true;
				PlayerAttackCheck();

				if(p_animKeyNum == 0){
					p_animKeyNum = 1;
				}else{
					p_animKeyNum = 0;
				}
			}else{
				Collider.player[1].enabled = false;
			}
		}
	}else{
		flagAttack = false;
	}

	//generate platform
	if(pressedKeys[9]){

		if(!cursorOperation){
			viewX = p_drawX;
			viewY = p_drawY-120;
			se_scan.play();
		}else{

			PlayerTargetControl();
		}
		cursorOperation = true;
	}else{
		if(cursorOperation){
			PlayerPlatformGenerate();
		}
		cursorOperation = false;
	}


}

//target view
function PlayerTargetControl(){

	if(pressedKeys[0]){
		viewX -= 4;
	}
	if(pressedKeys[1]){
		viewX += 4;
	}
	if(pressedKeys[2]){
		viewY -= 4;
	}
	if(pressedKeys[3]){
		viewY +=4;
	}
}

//crieate platform
function PlayerPlatformGenerate(){
	for (var i = 0,len = Actbox.platform.length; i < len; i++) {
		if(!Actbox.platform[i].enabled){
			if(viewX >=400){
				Actbox.platform[i].x = p_posX + (viewX - 400);
			}else{
				Actbox.platform[i].x = p_posX - (400 - viewX);
			}
			if(viewY >=400){
				Actbox.platform[i].y = p_posY + (viewY - 400);
			}else{
				Actbox.platform[i].y = p_posY - (400 - viewY);
			}
			Actbox.platform[i].w = 50;
			Actbox.platform[i].h = 50;
			Actbox.platform[i].move = false;
			Actbox.platform[i].visible = true;
			Actbox.platform[i].enabled = true;

			break;
		}

	}
}

//natural spirit
function WithMySpirit(){

	if(p_direction == 0){
		ns_D = 0
		ns_posX = p_posX - 48;
	}else{
		ns_D = 1
		ns_posX = p_posX + 48;
	}
	if(pressedKeys[0] || pressedKeys[1] || pressedKeys[2] || pressedKeys[3]){
		if(p_direction == 0){
			ns_posX -= 25;
		}else{
			ns_posX += 25;
		}
	}

	ns_posY = p_posY - 55 + ns_anim_keyflame[ns_anim_keynum];

}

function NaturalSpiritAnim(){
	if(ns_anim_time == 0){
		ns_anim_time = time_progress;
	}

	if(time_progress >= ns_anim_time + 200){

		if(ns_anim_keynum < ns_anim_keyflame.length-1){
			ns_anim_keynum++;
		}else{
			ns_anim_keynum = 0;
		}

		ns_anim_time = 0;
	}
}

//knock back *****
function PlayerKnockBack(direction){
	if(time_progress < countKockBack + 400){
		if(p_posX - p_colW/2> 50 && p_posX+p_colW/2<750){
			if(direction == 0){
				p_posX -= playerMoveSpeed;
			}else{
				p_posX += playerMoveSpeed;
			}
		}
	}else{
		movelock_L = false;
		movelock_R = false;
		movelock_U = false;
		movelock_D = false;
		keylock_A = false;
		keylock_D = false;

		flagKnockBack = false;
	}
}

//shooting
function PlayerBulletGenerate(){

	var arylength = Player.bullet.length;
	//x:0,y:0,rad:10,dir:0,spd:2,dis:100,ran:50,dmg:10,death:true
	for(var i=0;i<arylength;i++){
		if(Player.bullet[i].death){

			if(p_direction == 0){
				Player.bullet[i].x = p_posX - p_drawW/2;
			}else{
				Player.bullet[i].x = p_posX + p_drawW/2;
			}
			Player.bullet[i].y = p_posY -p_drawH/2;
			Player.bullet[i].rad = 10;
			Player.bullet[i].dir = p_direction;
			Player.bullet[i].spd = 4;
			Player.bullet[i].dis = 0;
			Player.bullet[i].ran = 200;
			Player.bullet[i].dmg = 10;
			Player.bullet[i].death = false;
			break;
		}
	}
}

function PlayerBulletOrbit(){
	Player.bullet.forEach(function(value){
		if(!value.death){
			if(value.dis < value.ran){

				if(value.dir == 0){
					value.x -= value.spd;
				}else{
					value.x += value.spd;
				}
				value.dis += value.spd;
			}else{
				value.death = true;
			}
		}
	});
}


//shooting bullet check *****
function PlayerBulletCheck(){

	var sx,sy,sr;
	var ex,ey,ecw,ech,esw,esh;

	for(var i=0;i<Player.bullet.length;i++){
		if(!Player.bullet[i].death){
				sx = Player.bullet[i].x;
				sy = Player.bullet[i].y;
				sr = Player.bullet[i].rad;

			for(var j=0;j<Enemy.param.length;j++){

				ex = Enemy.param[j].ex;
				ey = Enemy.param[j].ey;
				ecw = Enemy.param[j].cw;
				ech = Enemy.param[j].ch;
				esw = Enemy.param[j].sw;
				esh = Enemy.param[j].sh;

				if(Enemy.param[j].type == 0||Enemy.param[j].type == 5 ){	//correction of origin
					ey +=ech/2;
				}

				if(!Enemy.param[j].death){

					if(sy+sr >= ey-ech && sy-sr <= ey){
						if(sx+sr >= ex-ecw/2 && sx-sr <= ex+ecw/2){
							Enemy.param[j].hp -=20;

							//Combo and damagenum
							playerComboNum++;
							flagComboView = true;
							if(playerComboNum>=999){
								playerComboNum = 999;
							}
							DamageNumGenerate(ex-ecw/2,ey-ech/2,20);
							HitComboClassifier();

							if(Enemy.param[j].hp<=0){
								se_e_death.play();
								Enemy.param[j].time = 0;
								Enemy.param[j].flow = 666;
							}else{
								EffectEnemyDamage(ex,ey,esw,esh);
								se_e_damage.pause();
								se_e_damage.currentTime = 0;
								se_e_damage.play();
							}

							Player.bullet[i].death = true;
							break;
						}
					}
				}
			}

		}

	}

}

//gester sword Attack check
function PlayerAttackCheck(){

	var sx,sy,sw,sh;
	var ex,ey,ecw,ech,esw,esh;

		if(Collider.player[1].enabled){
			if(p_direction == 0){
				sx = p_posX - Collider.player[1].cx;
			}else{
				sx = p_posX + Collider.player[1].cx;
			}

			sy = p_posY - Collider.player[1].cy;
			sw = Collider.player[1].cw;
			sh = Collider.player[1].ch;

			for(var j=0;j<Enemy.param.length;j++){

				ex = Enemy.param[j].ex;
				ey = Enemy.param[j].ey;
				ecw = Enemy.param[j].cw;
				ech = Enemy.param[j].ch;
				esw = Enemy.param[j].sw;
				esh = Enemy.param[j].sh;

				if(Enemy.param[j].type == 0||Enemy.param[j].type == 5 ){	//correction of origin
					ey +=ech/2;
				}

				if(!Enemy.param[j].death){

					if(sy+sh >= ey-ech && sy-sh <= ey){
						if(sx+sw >= ex-ecw/2 && sx-sw <= ex+ecw/2){
							Enemy.param[j].hp -=20;

							//Combo and damagenum
							playerComboNum++;
							flagComboView = true;
							if(playerComboNum>=999){
								playerComboNum = 999;
							}
							DamageNumGenerate(ex-ecw/2,ey-ech/2,20);
							HitComboClassifier();

							if(Enemy.param[j].hp<=0){
								se_e_death.play();
								Enemy.param[j].time = 0;
								Enemy.param[j].flow = 666;
							}else{
								EffectEnemyDamage(ex,ey,esw,esh);
								se_e_damage.pause();
								se_e_damage.currentTime = 0;
								se_e_damage.play();
							}
							//break;
						}
					}
				}
			}

		}

}

//player animation
//skill animation
function PlayerSkill(){
	if(p_animTime == 0){
		p_animTime = time_progress;
		p_animInterval = 300;
	}

	if(time_progress >= p_animTime + p_animInterval){

		if(p_animKeyNum<4){
			p_animKeyNum++;
		}else{
			p_isSkillAnim = false;
			BuildAfforestation();
			LockedAllKeys();
		}

		p_animTime = 0;

	}
	// BuildAfforestation(x,y);
}

//gester Preparation
function PlayerAnimPrepare(){

	if(p_animTime == 0){
		p_animTime = time_progress;
	}

	if(time_progress >= p_animTime + p_animInterval){
		p_animKeyNum++;
		if(p_animKeyNum <= 5){
			p_anim_dy += 10;
		}
		p_animTime = 0;
		if(p_animKeyNum >=40){
			playerPrepare = false;
		}

	}
}

function PlayerAnimRun(){
	if(p_animTime == 0){
		p_animTime = time_progress;
	}

	if(time_progress >= p_animTime + 300){
		if(p_animKeyNum >=1){
			p_animKeyNum = 0;
		}else{
			p_animKeyNum++;
		}

		p_animTime = 0;
	}
}

//
//player drawing
function PlayerDrawAkino(){

	if(flagKnockBack){	//damage
		if(p_direction == 0){
			ctx.drawImage(Asset.images['akino'],625,2,64,96,p_drawX-64/2,p_drawY-96,64,96);
		}else{
			ctx.drawImage(Asset.images['akino'],692,2,64,96,p_drawX-64/2,p_drawY-96,64,96);
		}
	}else{
		if(pressedKeys[5]){	//shoot
			if(p_direction == 0){
				ctx.drawImage(Asset.images['akino'],388,11,112,88,p_drawX-112/2,p_drawY-88,112,88);
			}else{
				ctx.drawImage(Asset.images['akino'],500,11,112,88,p_drawX-112/2,p_drawY-88,112,88);
			}
		}else{
			if(!pressedKeys[9]){
				if(!pressedKeys[0] && !pressedKeys[1]){ //move
					if(p_direction == 0 ){
						ctx.drawImage(Asset.images['akino'],0,0,p_drawW,p_drawH,p_drawX-p_drawW/2,p_drawY-p_drawH,p_drawW,p_drawH);
					}else{
						ctx.drawImage(Asset.images['akino'],100,0,p_drawW,p_drawH,p_drawX-p_drawW/2,p_drawY-p_drawH,p_drawW,p_drawH);
					}
				}else{
					if(p_direction == 0 ){
						ctx.drawImage(Asset.images['akino'],0,100,p_drawW,p_drawH,p_drawX-p_drawW/2,p_drawY-p_drawH,p_drawW,p_drawH);
					}else{
						ctx.drawImage(Asset.images['akino'],100,100,p_drawW,p_drawH,p_drawX-p_drawW/2,p_drawY-p_drawH,p_drawW,p_drawH);
					}
				}
			}else{
				if(p_direction == 0 ){
					ctx.drawImage(Asset.images['akino'],400,100,100,100,p_drawX-100/2,p_drawY-100,100,100);
				}else{
					ctx.drawImage(Asset.images['akino'],500,100,100,100,p_drawX-100/2,p_drawY-100,100,100);
				}
				ctx.drawImage(Asset.images['akino'],803,3,150,150,p_drawX-150/2,p_drawY-150,150,150);
			}
		}
	}

	// ctx.fillStyle = "rgba(255,0,0,0.5)";
	// ctx.fillRect(p_drawX-50,p_drawY-100,p_drawW,p_drawH);
}

function PlayerGesterPrepare(){
	if(p_animKeyNum<=5){
		ctx.drawImage(Asset.images['gester'],370,266,138,176,
									p_drawX-46,p_drawY-176-50+p_anim_dy,138,176);
	}else
	if(p_animKeyNum<=10){
		ctx.drawImage(Asset.images['gester'],511,368,144,74,
									p_drawX-72,p_drawY-74,144,74);
	}else
	if(p_animKeyNum<=16){
		ctx.drawImage(Asset.images['gester'],295,0,102,134,
									p_drawX-51,p_drawY-134,102,134);
	}else{
		ctx.drawImage(Asset.images['gester'],399,0,102,134,
									p_drawX-51,p_drawY-134,102,134);

		if(p_animKeyNum<=30){
			ctx.drawImage(Asset.images['gester'],507,45,52,28,
										p_drawX-24,p_drawY-111,52,28);
		}else
		if(p_animKeyNum<=34){
			ctx.drawImage(Asset.images['gester'],508,8,42,24,
										p_drawX-26,p_drawY-112,42,24);
		}else{
			ctx.drawImage(Asset.images['gester'],508,8,42,24,
										p_drawX-26,p_drawY-104,42,24);
		}
	}
}

//animation mode observer
function PlayerAnimObserver(){
	if(flagKnockBack){
		p_animMode = "KOCKBACK";
	}else{



		if(flagAttack){
			p_animMode = "ATTACK";
		}else{
			if(!pressedKeys[0] && !pressedKeys[1]){
				p_animMode = "IDLE";
			}else{
				p_animMode = "MOVE";
			}
			if(cursorOperation){
				p_animMode = "PLAT";
			}

			if(flagJump){
				p_animMode = "JUMP";
			}else{
				if(!isGround){
					p_animMode = "FALL";
				}
			}
		}
	}
}

function PlayerDrawGester(){

	switch (p_animMode) {
		case 'KOCKBACK':
			if(p_direction == 0 ){
				ctx.drawImage(Asset.images['gester'],698,370,104,148,p_drawX-38,p_drawY-148,104,148);
			}else{
				ctx.drawImage(Asset.images['gester'],808,370,104,148,p_drawX-66,p_drawY-148,104,148);
			}
			break;
		case 'ATTACK':
			if(p_animKeyNum == 0){
				if(p_direction == 0 ){
					ctx.drawImage(Asset.images['gester'],189,458,132,134,p_drawX-58,p_drawY-134,132,134);
					//sword effect
					ctx.drawImage(Asset.images['gester'],633,270,180,82,p_drawX-180,p_drawY-108,180,82);

				}else{
					ctx.drawImage(Asset.images['gester'],332,458,132,134,p_drawX-74,p_drawY-134,132,134);
					//sword effect
					ctx.drawImage(Asset.images['gester'],813,270,180,82,p_drawX,p_drawY-108,180,82);
				}
			}else{
				if(p_direction == 0 ){
					ctx.drawImage(Asset.images['gester'],13,458,166,134,p_drawX-56,p_drawY-134,166,134);
					//sword effect
					ctx.drawImage(Asset.images['gester'],662,74,250,60,p_drawX-150,p_drawY-98,250,60);

				}else{
					ctx.drawImage(Asset.images['gester'],474,458,166,134,p_drawX-110,p_drawY-134,166,134);
					//sword effect
					ctx.drawImage(Asset.images['gester'],662,11,250,60,p_drawX-100,p_drawY-98,250,60);

				}
			}
			break;
		case 'IDLE':
			if(p_direction == 0 ){
				ctx.drawImage(Asset.images['gester'],192,0,100,134,p_drawX-50,p_drawY-134,100,134);
			}else{
				ctx.drawImage(Asset.images['gester'],296,0,100,134,p_drawX-50,p_drawY-134,100,134);
			}
			break;
		case 'MOVE':
			if(p_animKeyNum == 0){
				if(p_direction == 0 ){
					ctx.drawImage(Asset.images['gester'],168,139,156,120,p_drawX-82,p_drawY-120,156,120);
				}else{
					ctx.drawImage(Asset.images['gester'],326,139,156,120,p_drawX-74,p_drawY-120,156,120);
				}
			}else{
				if(p_direction == 0 ){
					ctx.drawImage(Asset.images['gester'],8,140,156,120,p_drawX-82-2,p_drawY-120,156,120);
				}else{
					ctx.drawImage(Asset.images['gester'],486,140,156,120,p_drawX-74+2,p_drawY-120,156,120);
				}
			}
			break;
		case 'JUMP':
			if(p_direction == 0 ){
				ctx.drawImage(Asset.images['gester'],152,309,104,140,p_drawX-60,p_drawY-140,104,140);
			}else{
				ctx.drawImage(Asset.images['gester'],260,309,104,140,p_drawX-44,p_drawY-140,104,140);
			}
			break;
		case 'FALL':
			if(p_direction == 0 ){
				ctx.drawImage(Asset.images['gester'],7,264,140,180,p_drawX-92,p_drawY-180,140,180);
			}else{
				ctx.drawImage(Asset.images['gester'],369,264,140,180,p_drawX-48,p_drawY-180,140,180);
			}
			break;
		case 'PLAT':
			if(p_direction == 0 ){
				ctx.drawImage(Asset.images['gester'],379,633,120,138,p_drawX-66,p_drawY-138,120,138);
			}else{
				ctx.drawImage(Asset.images['gester'],525,633,120,138,p_drawX-54,p_drawY-138,120,138);
			}
		break;
	}
}

function NaturalSpiritDraw(){
	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;

	if(!pressedKeys[9]){
		if(pressedKeys[0] || pressedKeys[1] || pressedKeys[2] || pressedKeys[3]){
			if(ns_D == 0){
				ctx.drawImage(Asset.images['akino'],100,212,50,42,ns_posX-ofx-50/2,ns_posY-ofy-42,50,42);
			}else{
				ctx.drawImage(Asset.images['akino'],150,212,50,42,ns_posX-ofx-50/2,ns_posY-ofy-42,50,42);
			}
		}else{
			if(ns_D == 0){
				ctx.drawImage(Asset.images['akino'],8,204,36,60,ns_posX-ofx-36/2,ns_posY-ofy-60,36,60);
			}else{
				ctx.drawImage(Asset.images['akino'],57,204,36,60,ns_posX-ofx-36/2,ns_posY-ofy-60,36,60);
			}
		}
	}else{
		if(ns_D == 0){
			ctx.drawImage(Asset.images['akino'],305,207,40,40,ns_posX-ofx-40/2,ns_posY-ofy-40,40,40);
		}else{
			ctx.drawImage(Asset.images['akino'],355,207,40,40,ns_posX-ofx-40/2,ns_posY-ofy-40,40,40);
		}
	}

}

function PlayerBulletDraw(){
	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;

	Player.bullet.forEach(function(value){
		if(!value.death){
			ctx.drawImage(Asset.images['akino'],214,218,value.rad*2,value.rad*2,
									value.x-ofx-value.rad,value.y-ofy-value.rad,value.rad*2,value.rad*2);

		}
	});
}

function PlayerSkillAnim(){
	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;

	if(p_animKeyNum == 0){
		if(p_direction == 0){
			ctx.drawImage(Asset.images['akino'],218,0,64,112,p_posX-ofx-32,p_posY-ofy-112,64,112);
		}else{
			ctx.drawImage(Asset.images['akino'],319,0,64,112,p_posX-ofx-32,p_posY-ofy-112,64,112);
		}
	}

	if(p_animKeyNum >=1){
		if(p_direction == 0){
			ctx.drawImage(Asset.images['akino'],200,150,98,50,p_posX-ofx-10-49,p_posY-ofy-50,98,50);
		}else{
			ctx.drawImage(Asset.images['akino'],302,150,98,50,p_posX-ofx+10-49,p_posY-ofy-50,98,50);
		}

		if(p_animKeyNum == 2){
			if(p_direction == 0){
				ctx.drawImage(Asset.images['build'],22,171,62,30,p_posX-ofx-76-50,p_posY-ofy-30+8,62,30);
			}else{
				ctx.drawImage(Asset.images['build'],22,171,62,30,p_posX-ofx+76,p_posY-ofy-30+8,62,30);
			}
		}
		if(p_animKeyNum >= 3){
			if(p_direction == 0){
				ctx.drawImage(Asset.images['build'],111,45,80,156,p_posX-ofx-76-60,p_posY-ofy-156+8,80,156);
			}else{
				ctx.drawImage(Asset.images['build'],111,45,80,156,p_posX-ofx+76,p_posY-ofy-156+8,80,156);
			}
		}
	}
}

function PlayerTargetDraw(){
	if(cursorOperation){
		ctx.drawImage(Asset.images['gester'],750,150,50,50,viewX,viewY,50,50);
	}

}

function PlayerPlatformDraw(){
	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;

	for (var i = 0,len = Actbox.platform.length; i < len; i++) {
		if(Actbox.platform[i].enabled){
					ctx.drawImage(Asset.images['gester'],800,200,50,50,
												Actbox.platform[i].x-ofx,Actbox.platform[i].y-ofy,50,50);
		}
	}
}
