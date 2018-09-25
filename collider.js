//
//ActionGameEditor  collider.js

//vars *****

var Collider = {};

//collider data load
function ColliderLoad(){

	Collider.player = [];
	//0:akino barrier
  Collider.player.push({cx:0,cy:0,cw:75,ch:75,enabled:false});
	//1:gester attack
	Collider.player.push({cx:58,cy:108,cw:180,ch:82,enabled:false});

}
