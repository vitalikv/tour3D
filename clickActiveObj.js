



// выделяем/активируем объект
// кликнули на объект (выделение) (cameraTop)
function objActiveColor_2D(obj)
{ 
	if(!obj) { return; }  
	if(clickO.last_obj == obj) { return; }
			
	var tag = obj.userData.tag;
	
	if(tag == 'window'){ obj.material.color = actColorWin; console.log(actColorWin); }
	else if(tag == 'point'){ obj.material.color = actColorWin; }
	else if(tag == 'wall'){ obj.material[0].color = actColorWin; actColorLine( obj, 'act' ); } 	
	else if(tag == 'door'){ obj.material.color = actColorWin; showHandleToolDoor(obj); }
	else if(tag == 'room'){ obj.userData.room.outline = clickFloorOutline(obj); } 
	else if(tag == 'd_tool') { } 
	else if(tag == 'controll_wd') { }
	else if(tag == 'obj') {  }			
	
	
	if(clickO.hover_obj == obj) { clickO.hover_obj = null; }
	//clickO.obj = obj; 
}
 

// если дверь и вид сверху, то ставит инструмент перетаскивания дверного полотна 
function showHandleToolDoor(obj) 
{	
	if(obj.userData.door.leaf_2D) 
	{ 
		d_tool.door = obj;
		clickToolDoorUp(obj);  		 
		d_tool.visible = true;
		  
		obj.userData.door.leaf_2D.material.color = actColorWin;  
	}
}	
 
// возращаем стандартный цвет объекта
function objDeActiveColor_2D() 
{			
	if(!clickO.last_obj){ return; }
	if(clickO.last_obj == clickO.obj){ return; }
	
	var o = clickO.last_obj;	

	if(clickO.obj)
	{  
		if(clickO.obj.userData.tag == 'controll_wd'){ if(clickO.obj.obj == o) { return; } } 
		if(clickO.obj.userData.tag == 'd_tool'){ if(clickO.obj.door == o) { return; } }     		
	}
	
	if(o.userData.tag == 'wall'){ o.material[0].color = o.userData.material[0].color; actColorLine( o, 'out' ); }	
	else if(o.userData.tag == 'point'){ o.material.color = o.userData.point.color; }	
	else if(o.userData.tag == 'window'){ o.material.color = new THREE.Color(colWin); }
	else if(o.userData.tag == 'door')
	{ 
		o.material.color = new THREE.Color(colDoor); 
		if(o.userData.door.leaf_2D){ o.userData.door.leaf_2D.material.color = new THREE.Color(colDoor); d_tool.visible = false; } 
	}	
	else if(o.userData.tag == 'room'){ deleteOutline(); } 
	

	
	
	if(clickO.hover_obj == clickO.last_obj) { clickO.hover_obj = null; }
	//clickO.obj = null;
} 



// делаем активный/неактивный цвет точек для этой стены
function actColorLine( wall, cdm )
{
	var p = wall.userData.wall.p;
	if(cdm == 'act') { var color_1 = new THREE.Color(0xff5d71); var color_2 = new THREE.Color(0x6476FC); var n = 1; }
	else if(cdm == 'out') { var color_1 = p[0].userData.point.color; var color_2 = p[0].userData.point.color; var n = 0.6; }
	
	p[0].material.color = color_1;
	p[1].material.color = color_2;
	p[0].material.opacity = n;
	p[1].material.opacity = n;	
}



// удаляем у стены/пола/потолка Outline
function deleteOutline()
{
	var obj = arrOutline.obj;
	if(!obj) return;
	
	scene.remove(arrOutline.outline);
	arrOutline.obj = null;
	arrOutline.outline = null; 
	
	if(obj.userData.tag == 'wall') { obj.userData.wall.outline = null; }
	else if(obj.userData.tag == 'room') { obj.userData.room.outline = null; }
	else if(obj.userData.tag == 'ceiling') { obj.userData.ceil.outline = null; }
}



// кликнули на стену в 3D режиме
function clickWall_3D( intersect )
{
	if(!intersect) return;
	if(!intersect.face) return;
	var index = intersect.face.materialIndex;

	// если кликнули на соседние стены, то ничего не делаем
	if(camera == cameraWall)
	{ 
		var exist = false;
		for ( var i = 0; i < arrWallFront.total.length; i++ )
		{
			if(arrWallFront.total[i] == intersect.object) { exist = true; break; }
		} 
		if(!exist) { clickO.obj = null; clickO.rayhit = null; return; } 		
	}	
	
	if(index == 1 || index == 2) { } 
	else { return; }
	
	var object = intersect.object;
	
	//object.material[index].color = new THREE.Color( 0xf7c6c6 );	
	
	clickO.obj = object;
	clickO.index = index;  
	
	setUIPreview(object, object.userData.material[index].preview, object.userData.material[index].catalog, index); 
	
	if(camera == camera3D) 
	{  
		UI.showToolbar('wall-3d-toolbar'); 
		
		menuSettingTexture( { obj : object, index : index } ); 
		
		object.userData.wall.outline = clickWallOutline(object, index); 
	}
}


// кликнули на пол в 3D режиме
function clickFloor_3D( object )
{		
	object.userData.room.outline = clickFloorOutline(object);

	clickO.obj = object;

	setUIPreview(object, object.pr_preview, object.pr_catalog);	
	UI.showToolbar('floor-3d-toolbar');
	
	menuSettingTexture( { obj : object } );
}



// кликнули на потолок в 3D режиме
function clickCeiling_3D( object )
{		
	object.userData.ceil.outline = clickFloorOutline(object);

	clickO.obj = object;

	setUIPreview(object, object.userData.material.preview, object.userData.material.catalog);	
	UI.showToolbar('floor-3d-toolbar');
	
	menuSettingTexture( { obj : object } ); 
}












