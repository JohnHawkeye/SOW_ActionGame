//
//ActionEditor
//behavior.js

function BehaviorEnemyAppear(index,ex,ey,sw,sh,type){
  if(Enemy.param[index].flow == 0){
    if(Enemy.param[index].time == 0){
      Enemy.param[index].time = time_progress;
      EffectAppear(ex,ey,sw,sh,type);
      se_appear.play();
    }
    if(time_progress >= Enemy.param[index].time+1000){
      Enemy.param[index].flow = 1;
    }
  }
}

function BehaviorBit(index,ex,ey,addx,addy){
  if(Enemy.param[index].flow == 1){
    if(Enemy.param[index].caution){
      GetPointBitMove(index,100);
      Enemy.param[index].time = 0;
      Enemy.param[index].itv = 500;
      Enemy.param[index].flow = 2;
      se_warp.pause();
      se_warp.currentTime = 0;
      se_warp.play();
    }
  }
  if(Enemy.param[index].flow ==2){	EemyHighSpeed(index,400);	}
  if(Enemy.param[index].flow ==3){
    if(Enemy.param[index].time == 0){
    Enemy.param[index].time = time_progress;
    Enemy.param[index].itv = 500;
    }
    if(time_progress >= Enemy.param[index].time + Enemy.param[index].itv ){
      Enemy.param[index].time = 0;
      Enemy.param[index].itv = 0;
      GetPointBitMove(index,50);
      Enemy.param[index].flow++;
      se_warp.pause();
      se_warp.currentTime = 0;
      se_warp.play();
    }
  }
  if(Enemy.param[index].flow ==4){	EemyHighSpeed(index,400);	}
  if(Enemy.param[index].flow ==5){
    if(Enemy.param[index].time == 0){
      Enemy.param[index].time = time_progress;
      Enemy.param[index].itv = 500;
    }
    if(time_progress >= Enemy.param[index].time + Enemy.param[index].itv ){
      Enemy.param[index].time = 0;
      Enemy.param[index].itv = 0;
      var temp_r;
      if(p_posX <= ex){
        temp_r = (Math.atan2((p_posY-ey),((ex-400)-ex))/Math.PI*180+360)%360;
      }else{
        temp_r = (Math.atan2((p_posY-ey),((ex+400)-ex))/Math.PI*180+360)%360;
      }
      Enemy.param[index].addx = Math.cos(temp_r*(Math.PI /180));
      Enemy.param[index].addy = Math.sin(temp_r*(Math.PI /180));
      se_warp.pause();
      se_warp.currentTime = 0;
      se_warp.play();
      Enemy.param[index].flow++;
    }
  }
  if(Enemy.param[index].flow ==6){	EemyHighSpeed(index,400);			}
  if(Enemy.param[index].flow ==7){	EnemyIdle(index,2000);				}
  if(Enemy.param[index].flow ==8){	Enemy.param[index].flow =1;	 	}

  if(Enemy.param[index].flow == 666){
    Enemy.param[index].death = true;
  }
}

function BehaviorBird(index,ex,ey,sw,sh,addx,addy){

  if(!Enemy.param[index].isg){
    Enemy.param[index].ey += gravity;
  }

  if(Enemy.param[index].flow == 1){
    if(Enemy.param[index].isg){
      Enemy.param[index].time = 0;
      Enemy.param[index].itv = 1000;
      Enemy.param[index].flow = 2;
    }
  }
  if(Enemy.param[index].flow == 2){	EnemyIdle(index,1000);				}

  if(Enemy.param[index].flow == 3){
    if(Enemy.param[index].time == 0){
      Enemy.param[index].time = time_progress;
      Enemy.param[index].itv = 1000;
    }
    if(time_progress >= Enemy.param[index].time + Enemy.param[index].itv ){
      Enemy.param[index].time = 0;
      Enemy.param[index].cw=84;
      Enemy.param[index].ch=120;
      Enemy.param[index].sw=84;
      Enemy.param[index].sh=120;
      Enemy.param[index].flow++;
    }
  }
  if(Enemy.param[index].flow == 4){
    if(Enemy.param[index].time == 0){
      Enemy.param[index].time = time_progress;
      Enemy.param[index].itv = 1000;
    }
    if(time_progress >= Enemy.param[index].time + Enemy.param[index].itv ){
      Enemy.param[index].time = 0;
      Enemy.param[index].flow++;
    }
  }

  if(Enemy.param[index].flow == 666){
    Enemy.param[index].death = true;
  }
}

function BehaviorBee(index,ex,ey,sw,sh,addx,addy){

  if(Enemy.param[index].flow == 1){

    if(Enemy.param[index].dis <200){
      if(Enemy.param[index].dir == 0){
        Enemy.param[index].ex -= Enemy.param[index].spd;
      }else{
        Enemy.param[index].ex += Enemy.param[index].spd;
      }

      if(Enemy.param[index].dis <=50){
        Enemy.param[index].ey -= 2;
      }else
      if(Enemy.param[index].dis <=100){
        Enemy.param[index].ey += 2;
      }else
      if(Enemy.param[index].dis <=150){
        Enemy.param[index].ey -= 2;
      }else{Enemy.param[index].ey += 2;}

      Enemy.param[index].dis += Enemy.param[index].spd;
    }else{
      if(Enemy.param[index].dir == 0){
        Enemy.param[index].dir = 1;
      }else{
        Enemy.param[index].dir = 0;
      }
      Enemy.param[index].dis = 0;
    }
  }

  if(Enemy.param[index].flow == 666){
    Enemy.param[index].death = true;
  }
}

function BehaviorInsect(index,ex,ey,sw,sh,addx,addy){
  if(Enemy.param[index].flow == 666){
    Enemy.param[index].death = true;
  }
}
function BehaviorSpider(index,ex,ey,sw,sh,addx,addy){

  if(Enemy.param[index].flow == 1){

    if(Enemy.param[index].snum >=10){
      if(Enemy.param[index].time == 0){
        Enemy.param[index].time = time_progress;
      }
      if(time_progress>=Enemy.param[index].time + 1000){

          Enemy.param[index].time = time_progress;
          if(Enemy.param[index].unv <= 0){
            Enemy.param[index].time = 0;
            Enemy.param[index].snum = 0;
            Enemy.param[index].unv = 4;
          }else{
            Enemy.param[index].unv--;
          }

      }
    }

    var erad = (Math.atan2((p_posY-Enemy.param[index].ey),
                            (p_posX-Enemy.param[index].ex))/Math.PI*180+360)%360;
    Enemy.param[index].ang = erad;

    var temp_dis
    temp_dis = Math.sqrt(Math.pow(Enemy.param[index].ex-p_posX,2)+
                Math.pow(Enemy.param[index].ey-p_posY,2));
    //shoot
    if(temp_dis < p_colW/2+300+Enemy.param[index].cw/2){
      EnemyAttackMode(index);
    }

    //escape
    if(temp_dis < p_colW/2+100+Enemy.param[index].cw/2){

      var tmp_random = Math.floor(Math.random()*2);
      if(tmp_random == 0){
        Enemy.param[index].dir = 0;
        Enemy.param[index].ang += 90;
      }else{
        Enemy.param[index].dir = 1;
        Enemy.param[index].ang -= 90;
      }

        Enemy.param[index].flow = 2;
    }
  }

  if(Enemy.param[index].flow == 2){
    if(Enemy.param[index].dis <300){
        if(Enemy.param[index].dir == 0){
          Enemy.param[index].ang += 45/50;
        }else{
          Enemy.param[index].ang -= 45/50;
        }

      Enemy.param[index].addx = Math.cos(Enemy.param[index].ang*(Math.PI /180));
      Enemy.param[index].addy = Math.sin(Enemy.param[index].ang*(Math.PI /180));
      Enemy.param[index].ex += Enemy.param[index].addx*4;
      Enemy.param[index].ey += Enemy.param[index].addy*4;

      Enemy.param[index].dis += Math.sqrt(Math.pow(Enemy.param[index].addx*4,2)+
                                  Math.pow(Enemy.param[index].addy*4,2));
    }else{
      Enemy.param[index].dis = 0;
      Enemy.param[index].flow = 1;
    }
  }

  if(Enemy.param[index].flow == 666){
    Enemy.param[index].death = true;
  }
}

function BehaviorCrystal(index,ex,ey,sw,sh,addx,addy){
  if(Enemy.param[index].flow == 1){
    EnemyIdle(index,600);
  }
  if(Enemy.param[index].flow == 2){
    var temp_dis
    temp_dis = Math.sqrt(Math.pow(Enemy.param[index].ex-p_posX,2)+
                Math.pow(Enemy.param[index].ey-p_posY,2));

    if(temp_dis > p_colW/2+100+Enemy.param[index].cw/2){
      var temp_rad;
      temp_rad = (Math.atan2((p_posY-Enemy.param[index].ey),
                    (p_posX-Enemy.param[index].ex))/Math.PI*180+360)%360;
      Enemy.param[index].addx = Math.cos(temp_rad*(Math.PI /180));
      Enemy.param[index].addy = Math.sin(temp_rad*(Math.PI /180));
      Enemy.param[index].ex += Enemy.param[index].addx*2;
      Enemy.param[index].ey += Enemy.param[index].addy*2;
    }
    else{
      EnemyAttackMode(index);
      if(pressedKeys[5]){
        var temp_rad_a;
        temp_rad_a = (Math.atan2((p_posY-Enemy.param[index].ey),
                      (p_posX-Enemy.param[index].ex))/Math.PI*180+360+180)%360;
        Enemy.param[index].addx = Math.cos(temp_rad_a*(Math.PI /180));
        Enemy.param[index].addy = Math.sin(temp_rad_a*(Math.PI /180));
        Enemy.param[index].flow = 3;

      }
    }
  }

  if(Enemy.param[index].flow == 3){
    if(Enemy.param[index].dis < 200){

      Enemy.param[index].ex += Enemy.param[index].addx*10;
      Enemy.param[index].ey += Enemy.param[index].addy*10;
      Enemy.param[index].dis += Math.sqrt(Math.pow(Enemy.param[index].addx*10,2)+
                                  Math.pow(Enemy.param[index].addy*10,2));
    }else{
      Enemy.param[index].dis = 0;
      Enemy.param[index].flow = 2;
    }
  }

  if(Enemy.param[index].flow == 666){
    if(Enemy.param[index].time == 0){
      Enemy.param[index].time = time_progress;
      Enemy.param[index].itv = 1000;
    }
    if(time_progress >= Enemy.param[index].time + Enemy.param[index].itv ){
      Enemy.param[index].death = true;
    }
  }
}
