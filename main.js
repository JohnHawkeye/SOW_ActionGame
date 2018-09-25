//ActionGameEditor
//animationframe *****
var requestAnimationFrame = ( function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
                window.setTimeout( callback, 1000.0);
            };
} )();

var now = window.performance && (
    performance.now ||
    performance.mozNow ||
    performance.msNow ||
    performance.oNow ||
    performance.webkitNow );

var getTime = function() {
    return ( now && now.call( performance ) ) || ( new Date().getTime() );
}

var startTime = getTime();
var time_progress = 0;
var fps = 60.0;
var frameLength = 60.0;

//
//Window Setting
var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;

window.addEventListener('load',init);

//
//vars *****
//canvas
var canvas;
var ctx;

//assets
var Asset = {};

//actbox
var Actbox = {};
var flagActbox = false;
var actboxNum = 0;

//keys
var pressedKeys = [];
var pressedWait = [];
    pressedWait[6] = 0;
    pressedWait[9] = 0;
    pressedWait[10] = 0;

var movelock_L =false;
var movelock_R =false;
var movelock_U =false;
var movelock_D =false;
var keylock_A = false;
var keylock_D = false;
var keylock_S = false;
var keylock_F = false;

//mouse
var mouseX = 0;
var mouseY = 0;
var dragUX = 0;
var dragUY = 0;
var dragDX = 0;
var dragDY = 0;
var flagDrag = 0;

//
//AssetData
Asset.assets = [
	{type:'image', name:'back', src:'assets/stage_city.jpg'},
  {type:'image', name:'block', src:'assets/block.png'},
  {type:'image', name:'akino', src:'assets/chara_akino.png'},
  {type:'image', name:'gester', src:'assets/chara_gester.png'},
  {type:'image', name:'extra', src:'assets/chara_extra.png'},
  {type:'image', name:'build', src:'assets/building.png'},
  {type:'image', name:'item', src:'assets/item.png'},
  {type:'image', name:'state', src:'assets/hpbar.png'},
  {type:'image', name:'equip', src:'assets/ui_equip.png'},
  {type:'image', name:'mission', src:'assets/mission01.png'},
  {type:'image', name:'effect', src:'assets/effect.png'},
  {type:'image', name:'effect02', src:'assets/effect_lockon.png'},
  {type:'image', name:'enemy', src:'assets/enemy01.png'},
  {type:'image', name:'portal', src:'assets/portal.png'}
];


var se_shoot = new Audio();
  se_shoot.src = "assets/shoot01.wav";
var se_e_damage = new Audio();
  se_e_damage.src = "assets/e_damage.wav";
var se_e_death = new Audio();
  se_e_death.src = "assets/e_death.wav";
var se_warp = new Audio();
  se_warp.src = "assets/warp.wav";
var se_appear = new Audio();
  se_appear.src = "assets/appear.wav";
var se_item = new Audio();
  se_item.src = "assets/item.wav";
var se_move = new Audio();
  se_move.src = "assets/move.wav";
var se_sword = new Audio();
  se_sword.src = "assets/sword.wav";
var se_scan = new Audio();
  se_scan.src = "assets/scan.wav";

Asset.images ={};

Asset.loadAssets = function(onComplete){
	var total = Asset.assets.length;
	var loadCount = 0;

	var onLoad = function(){
		loadCount++;
		if(loadCount >= total){
			onComplete();
		}
	};

	Asset.assets.forEach(function(asset){
		switch(asset.type){
			case 'image':
				Asset._loadImage(asset,onLoad);
				break;
		}
	});
};

Asset._loadImage = function(asset,onLoad){
	var image = new Image();
	image.src = asset.src;
	image.onload = onLoad;
	Asset.images[asset.name] = image;
};

//
//init *****
function init(){
	canvas = document.getElementById('maincanvas');
	ctx = canvas.getContext('2d');
	canvas.width = SCREEN_WIDTH,canvas.height = SCREEN_HEIGHT;

	//mouse event listener
	canvas.addEventListener('mousedown',onMouseDown,false);
	canvas.addEventListener('mouseup',onMouseUp,false);
	canvas.addEventListener('mousemove',onMouseMove,false);

	//key event listener
	document.addEventListener('keydown',KeyDoun);
	document.addEventListener('keyup',KeyUp);

  StageDataInit();
  StageLoad();
  ExtraLoad();
  PlayerDataLoad();
  ColliderLoad();
  EnemyLoad();
  BuildLoad();
  EffectLoad();
  ItemLoad();
  UiFontLoad();

	Asset.loadAssets(function(){
		requestAnimationFrame(update);
	});
}

//
//Update *****
function update(){

	var lastTime = getTime();
	time_progress = Math.floor(lastTime - startTime);
  var nowSec = Math.floor(time_progress/1000.0);


  StagePhaseManager();



  //checked
  WallCheck();
  PlayerGroundCheck();
  StagePlatformCheck();

  //BulletCheck
  PlayerBulletOrbit();

  //player control
  if(flagKnockBack){ PlayerKnockBack(damageOrigin); }

  if(!playerPrepare){
    PlayerCommonControl();

    if(playerCharaType == 0){
      PlayerAkinoControl();
    }else{
      PlayerGesterControl();
    }
  }else{
    PlayerAnimPrepare();
  }



  WithMySpirit();
  NaturalSpiritAnim();

  ExtraAction();
  ExtraShelterExit();

  BulletOrbit();

  PlayerBulletCheck();
  //collision
  if(!isInvincible){
    EnemyCollision();

  }else{
    if(time_progress >= inviTimer + inviInterval){
      isInvincible = false;
    }
  }
  BulletCollision();

  if(p_isSkillAnim){
    PlayerSkill();
  }

  //enemy Action
  EnemyActionPattern();
  EffectAnimation();

  ItemGetCheck();
  ItemVanishTimeCheck();
  ItemFallMonitor();

	//draw images
  PlayerAnimObserver();
  DamageNumClassifier();
	render();

	ctx.font = "bold 12px 'ＭＳ ゴシック'";
	ctx.fillStyle = "rgba(0,0,0,1.0)";
	ctx.fillText("progress:"+ time_progress + " sec:" + nowSec + " sx:" + p_posX+ " sy:" +p_posY,134,590);

	requestAnimationFrame(update);

}

//
//Drawings *****
function render(){

	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.drawImage(Asset.images['back'],p_posX-p_drawX,p_posY-p_drawY,800,600,0,0,800,600);

  //StageGroundDraw();
  StageShelterDraw();

  ExtraDraw();

  BuildDraw();

  if(playerCharaType == 0){
    if(!p_isSkillAnim){
      PlayerDrawAkino();
    }else{
      PlayerSkillAnim();
    }
  }else{
    if(!playerPrepare){
      PlayerDrawGester();
    }else{
      PlayerGesterPrepare();
    }

  }


  EnemyPortalDraw();
  EnemyDraw();
  EffectDraw();

  ItemDraw();

  EnemyBulletDraw();

  NaturalSpiritDraw();
  //player state
	PlayerHitPointDraw();
  PlayerBulletDraw();

	//inputDeviceDraw
	inputDeviceDraw();

  //PlayerTargetView
  PlayerTargetDraw();
  PlayerPlatformDraw();

  ComboNumberDraw();
  DamageNumDraw();
}

//
//key events
function KeyDoun(e){
	switch(e.keyCode){
		case 37:	//left
			pressedKeys[0] = true;
			break;
		case 39:	//right
			pressedKeys[1] = true;
			break;
		case 38:	//up
			pressedKeys[2] = true;
			break;
		case 40:	//down
			pressedKeys[3] = true;
			break;
		case 32:	//space
			pressedKeys[4] = true;
			break;
		case 65:	//A
			pressedKeys[6] = true;
			break;
    case 83:  //S
      pressedKeys[7] = true;
      break;
		case 68:	//beam Dkey
			pressedKeys[5] = true;
			break;
    case 69:  //E
      pressedKeys[8] = true;
      break;
    case 70:  //f key
      pressedKeys[9] = true;
      break;
    case 67:  //c key
      pressedKeys[10] = true;
      break;
	}
	e.preventDefault();

}

function KeyUp(e){

	switch(e.keyCode){
		case 37:	//left
			pressedKeys[0] = false;
			break;
		case 39:	//right
			pressedKeys[1] = false;
			break;
		case 38:	//up
			pressedKeys[2] = false;
			break;
		case 40:	//down
			pressedKeys[3] = false;
			break;
		case 32:	//space
			pressedKeys[4] = false;
			break;
		case 65:	//A
			pressedKeys[6] = false;
			break;
    case 83:  //S
      pressedKeys[7] = false;
      break;
		case 68:	//beam Dkey
			pressedKeys[5] = false;
			break;
    case 69:  //e key
      pressedKeys[8] = false;
      break;
    case 70:  //f key
      pressedKeys[9] = false;
      break;
    case 67:  //c key
      pressedKeys[10] = false;
      break;
	}

}

function PressedKeyWait(){
	if(pressedWait[6]<=10){
		pressedWait[6]++;
	}else{
		keylock_A = false;
	}
}

function LockedAllKeys(){
  movelock_L = !movelock_L;
  movelock_R = !movelock_R;
  movelock_U = !movelock_U;
  movelock_D = !movelock_D;
  keylock_A = !keylock_A;
  keylock_D = !keylock_D;
  keylock_S = !keylock_S;
}

//
//mouse events
function onMouseDown(){

	dragDX = mouseX;
	dragDY = mouseY;
	flagDrag = 1;
	playerX = mouseX;
	playerY = mouseY;
}

function onMouseUp(){

	var width = 0;
	var height = 0;

	flagDrag =0;
	if(mouseX - dragDX > 0){
		width = mouseX - dragDX;
	}else{
		width = dragDX - mouseX;
	}

	if(mouseY - dragDY > 0){
		height = mouseY - dragDY;
	}else{
		height = dragDY - mouseY;
	}

}

function onMouseMove(e){
	var rect = canvas.getBoundingClientRect();
	mouseX = Math.floor(e.clientX-rect.left);
	mouseY = Math.floor(e.clientY-rect.top);
}
