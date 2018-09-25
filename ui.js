//
//ActionGameEditor  ui.js

//vars *****
var flagComboView = false;
var strHitCombo = "0";
var aryCombo = [];

var UiFont = {};

function UiFontLoad(){

  UiFont.damage =[];
  for(var i=0;i<128;i++){
		//size:26-30,type:0=nomal,1=critical,2=recovery
		UiFont.damage.push({x:0,y:0,addx:0,addy:0,ang:270,dir:0,size:26,
												ranx:0,rany:0,keyf:0,type:0,enabled:false});
	}
}

function DamageNumGenerate(x,y,damage){

	var tempstr = "";

	for (var i = 0,len = UiFont.damage.length; i < len; i++) {
		if(!UiFont.damage[i].enabled){
			UiFont.damage[i].x = x;
			UiFont.damage[i].y = y;
			UiFont.damage[i].addx = 0;
			UiFont.damage[i].addy = 0;
			UiFont.damage[i].ang = 270;
			UiFont.damage[i].dir =  Math.floor(Math.random()*2);
      UiFont.damage[i].ranx = Math.random()*1;
      UiFont.damage[i].rany = Math.random()*0.4;
			UiFont.damage[i].size = 36;
			UiFont.damage[i].keyf = 0;
			UiFont.damage[i].type = 0;
			UiFont.damage[i].enabled = true;

			UiFont.damage[i].val = [];

			tempstr = damage.toString();

			for (var j = 0,len = tempstr.length; j < len ; j++) {
				UiFont.damage[i].val[j] = tempstr.charAt(j);
			}

			UiFont.damage[i].val.reverse();

			break;
		}
	}
}

function DamageNumClassifier(){

	for (var i = 0,len = UiFont.damage.length; i < len; i++) {
		if(UiFont.damage[i].enabled){
			switch (UiFont.damage[i].keyf) {
				case 0:
					if(UiFont.damage[i].dir == 0){
						UiFont.damage[i].ang -= 4;
					}else{
						UiFont.damage[i].ang += 4;
					}

					UiFont.damage[i].addx = Math.cos(UiFont.damage[i].ang*(Math.PI /180));
					UiFont.damage[i].addy = Math.sin(UiFont.damage[i].ang*(Math.PI /180));
					UiFont.damage[i].x += UiFont.damage[i].addx*4*UiFont.damage[i].ranx;
					UiFont.damage[i].y += UiFont.damage[i].addy*8*UiFont.damage[i].rany;

					if(UiFont.damage[i].size >= 26){
						UiFont.damage[i].size--;
					}
					if(UiFont.damage[i].dir == 0){

						if(UiFont.damage[i].ang <=180){
							UiFont.damage[i].keyf =1;
							UiFont.damage[i].ang = 0;
						}
					}else{
						if(UiFont.damage[i].ang >=360){
							UiFont.damage[i].keyf =1;
							UiFont.damage[i].ang = 0;
						}
					}
					break;
				case 1:
					if(UiFont.damage[i].ang <= 120){
						if(UiFont.damage[i].ang <= 40){
							UiFont.damage[i].y += 8;
							UiFont.damage[i].ang += 8;
						}else {
							if(UiFont.damage[i].ang <=80){
								UiFont.damage[i].y += 12;
								UiFont.damage[i].ang += 12;
							}else{
								UiFont.damage[i].y += 18;
								UiFont.damage[i].ang += 18;
							}
						}
						UiFont.damage[i].x += UiFont.damage[i].addx;
					}else{
						UiFont.damage[i].enabled = false;
					}
					break;

			}
		}
	}
}

function HitComboClassifier(){
	var str_len;

	aryCombo = [];

	strHitCombo = playerComboNum.toString();

	for (var i = 0,len = strHitCombo.length; i < len ; i++) {
		aryCombo[i] = strHitCombo.charAt(i);
	}

	aryCombo.reverse();

}
//
// Hitpoint Bar Draw
function PlayerHitPointDraw(){

	var barlength = 0;

	//hp bar length
	barlength = Math.floor((playerNowHp/playerMaxHp)*140);

	if(barlength >0){
		ctx.drawImage(Asset.images['state'],11,160,barlength,48,101,73,barlength,48);
	}

	//frame
	if(playerCharaType == 0){
		ctx.drawImage(Asset.images['state'],0,0,246,158,0,0,246,158);
	}else{
		ctx.drawImage(Asset.images['state'],266,0,254,158,0,0,254,158);
	}


	//num
	ctx.font = "bold 18px 'ＭＳ ゴシック'";
	ctx.fillText("HP:",132,140);
	ctx.fillStyle = "rgba(255,255,255,1.0)";
	ctx.fillText(playerNowHp + "/" + playerMaxHp,160,140);

	ctx.drawImage(Asset.images['equip'],0,0,100,258,690,12,100,258);
	ctx.drawImage(Asset.images['mission'],0,0,381,43,410,550,381,43);
}

//
function inputDeviceDraw(){

	ctx.strokeStyle = "rgba(0,0,0,1.0)";

	ctx.fillStyle = "rgba(255,255,255,1.0)";
	if(pressedKeys[0]){	ctx.fillStyle = "rgba(255,0,0,1.0)";}
	else{ctx.fillStyle = "rgba(255,255,255,1.0)";}
		ctx.fillRect(10,580,20,20);
	if(pressedKeys[1]){	ctx.fillStyle = "rgba(255,0,0,1.0)";}
	else{ctx.fillStyle = "rgba(255,255,255,1.0)";}
		ctx.fillRect(30,580,20,20);
	if(pressedKeys[2]){	ctx.fillStyle = "rgba(255,0,0,1.0)";}
	else{ctx.fillStyle = "rgba(255,255,255,1.0)";}
		ctx.fillRect(50,580,20,20);
	if(pressedKeys[3]){	ctx.fillStyle = "rgba(255,0,0,1.0)";}
	else{ctx.fillStyle = "rgba(255,255,255,1.0)";}
		ctx.fillRect(70,580,20,20);
	if(pressedKeys[4]){	ctx.fillStyle = "rgba(255,0,0,1.0)";}
	else{ctx.fillStyle = "rgba(255,255,255,1.0)";}
		ctx.fillRect(90,580,20,20);
	if(pressedKeys[5]){	ctx.fillStyle = "rgba(255,0,0,1.0)";}
	else{ctx.fillStyle = "rgba(255,255,255,1.0)";}
		ctx.fillRect(110,580,20,20);

	for(var i=0;i<6;i++){
		ctx.strokeRect(10+(20*i),580,20,20);
	}
	ctx.font = "bold 12px 'ＭＳ ゴシック'";
	ctx.fillStyle = "rgba(0,0,0,1.0)";
	ctx.fillText("←",14,595);
	ctx.fillText("→",34,595);
	ctx.fillText("↑",54,595);
	ctx.fillText("↓",74,595);
	ctx.fillText("S",94,595);
	ctx.fillText("D",114,595);
}

function ComboNumberDraw(){

	if(flagComboView){
		ctx.drawImage(Asset.images['state'],459,375,142,32,656,300,142,32);

		for (var i = 0,len = aryCombo.length; i < len; i++) {
			switch (aryCombo[i]) {
				case '0':
					ctx.drawImage(Asset.images['state'],15,363,32,44,630-32*i,288,32,44);
					break;
				case '1':
					ctx.drawImage(Asset.images['state'],58,363,32,44,630-32*i,288,32,44);
					break;
				case '2':
					ctx.drawImage(Asset.images['state'],98,363,32,44,630-32*i,288,32,44);
					break;
				case '3':
					ctx.drawImage(Asset.images['state'],143,363,32,44,630-32*i,288,32,44);
					break;
				case '4':
					ctx.drawImage(Asset.images['state'],187,363,32,44,630-32*i,288,32,44);
					break;
				case '5':
					ctx.drawImage(Asset.images['state'],232,363,32,44,630-32*i,288,32,44);
					break;
				case '6':
					ctx.drawImage(Asset.images['state'],277,363,32,44,630-32*i,288,32,44);
					break;
				case '7':
					ctx.drawImage(Asset.images['state'],321,363,32,44,630-32*i,288,32,44);
					break;
				case '8':
					ctx.drawImage(Asset.images['state'],362,363,32,44,630-32*i,288,32,44);
					break;
				case '9':
					ctx.drawImage(Asset.images['state'],407,363,32,44,630-32*i,288,32,44);
					break;

			}
		}

	}

}

function DamageNumDraw(){

	var ofx = p_posX-p_drawX;
	var ofy = p_posY-p_drawY;
	var size;

		for (var i = 0,leni = UiFont.damage.length; i < leni; i++) {
			if(UiFont.damage[i].enabled){
				for (var j = 0,lenj = UiFont.damage[i].val.length; j < lenj; j++) {
					size = UiFont.damage[i].size;

					switch (UiFont.damage[i].val[j]) {
					case '0':
						ctx.drawImage(Asset.images['state'],3,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
					case '1':
						ctx.drawImage(Asset.images['state'],35,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
					case '2':
						ctx.drawImage(Asset.images['state'],68,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
					case '3':
						ctx.drawImage(Asset.images['state'],99,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
					case '4':
						ctx.drawImage(Asset.images['state'],131,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
					case '5':
						ctx.drawImage(Asset.images['state'],163,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
					case '6':
						ctx.drawImage(Asset.images['state'],195,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
					case '7':
						ctx.drawImage(Asset.images['state'],227,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
					case '8':
						ctx.drawImage(Asset.images['state'],260,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
					case '9':
						ctx.drawImage(Asset.images['state'],290,260,26,26,
						UiFont.damage[i].x-24*j-ofx,UiFont.damage[i].y-ofy,size,size);
						break;
				}
			}
		}
	}

}
