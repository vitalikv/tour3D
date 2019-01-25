// при наведение мыши над объектом (без клика) меняем цвет
function activeHover2D( event )
{
	if ( camera != cameraTop ) { return; }
	if ( isMouseDown1 ) { return; }

	if ( obj_selected ) 
	{
		if ( obj_selected.userData.tag == 'free_dw' ) { return; }
		if ( obj_selected.userData.tag == 'point' ) { if (obj_selected.userData.point.type) return; }
	}



	var rayhit = detectRayHit( event, 'activeHover' );

	if ( rayhit ) 
	{
		// выделяем объект
		var object = rayhit.object;
		var tag = object.userData.tag; 		
		
		if ( tag == 'door_leaf' ) { object = object.door; tag = object.userData.tag; }
		
		if(tag == 'wall') { if(!object.userData.wall.actList.click2D) return; }
		else if(tag == 'point') { if(!object.userData.point.actList.click2D) return; }
		else if(tag == 'window') { if(!object.userData.door.actList.click2D) return; }
		else if(tag == 'door') { if(!object.userData.door.actList.click2D) return; }			

		if ( clickO.last_obj == object ) { activeHover2D_2(); return; }	// объект активирован (крансый цвет), поэтому не подсвечиваем
		if ( clickO.hover_obj == object ) { return; }				// объект уже подсвечен

		if ( tag == 'window' ) { object.material.color = colorHover; }
		else if ( tag == 'door' ) { object.material.color = colorHover; if( object.userData.door.leaf_2D ){ object.userData.door.leaf_2D.material.color = colorHover; } }
		else if ( tag == 'point' ) { object.material.color = colorHover; }
		else if ( tag == 'wall' ) { object.material[ 0 ].color = colorHover; }		
		else if ( tag == 'controll_wd' ) { if(clickO.last_obj == object.obj) { activeHover2D_2(); return; } }
		
		activeHover2D_2();

		clickO.hover_obj = object;
	}
	else
	{
		activeHover2D_2();
	}
}



// возращаем стандартный цвет
function activeHover2D_2()
{
	if ( !clickO.hover_obj ) { return; }

	var object = clickO.hover_obj;
	var tag = object.userData.tag;  	
	
	if ( tag == 'window' ) { var color = new THREE.Color(colWin); } 
	else if ( tag == 'door' ) { var color = new THREE.Color(colDoor); }	
	else if ( tag == 'wall' ) { var color = object.userData.material[ 0 ].color; }	
	else if ( tag == 'point' )
	{
		var color = object.userData.point.color;
		
		if ( clickO.obj )
		{
			if ( clickO.obj.userData.tag == 'wall' )
			{
				var n = -1;
				if ( clickO.obj.userData.wall.p[ 0 ] == object ) { n = 0; }
				else if ( clickO.obj.userData.wall.p[ 1 ] == object ) { n = 1; }

				if ( n != -1 ) { var color = ( n == 0 ) ? new THREE.Color( 0xff5d71 ) : new THREE.Color( 0x6476FC ); }
			}
		}
	}
	
	if ( tag == 'window' ) { object.material.color = color; }
	else if ( tag == 'point' ) { object.material.color = color; }
	else if ( tag == 'obj' ) { /*object.material.color = color;*/ } 
	else if ( tag == 'wall' ) { object.material[ 0 ].color = color; }
	else if ( tag == 'door' ) { object.material.color = color; if( object.userData.door.leaf_2D ) { object.userData.door.leaf_2D.material.color = color; } }
	clickO.hover_obj = null;
}



function activeHoverWall( event )
{
	if ( camera != cameraWall ) { return; }
	if ( isMouseDown1 ) { return; }
	if ( !clickO.last_obj ) { return; }
	
	var tag = clickO.last_obj.userData.tag;
	
	if(tag == 'obj' || tag == 'window' || tag == 'door'){}
	else { return }
 
	var intersects = rayIntersect( event, arrWallFront.total, 'arr' ); 
	
	var obj = null;
	for ( var i = 0; i < intersects.length; i++ ) 
	{
		var tag = intersects[ i ].object.userData.tag;
		
		if(tag == 'obj' || tag == 'window' || tag == 'door')
		{
			obj = intersects[ i ].object; 
			break;
		}
	}
	
	deActiveHoverWall(4, false);
	
	if(obj == clickO.last_obj)
	{				
		// показываем расстояние до краев стен
		if(tag == 'obj') { showRulerPopObj(obj); }	
		else { showRulerWD_3D(obj); }
	}
	else  
	{ 
		if(obj && !obj_selected)
		{ 
			showSizeFormat_4(obj); 	// показываем расстояние до объекта на котором курсор
		}	
	}	
}



function deActiveHoverWall(count, visible)
{
	//for ( var i = 0; i < count; i++ ) { arrSize.cube[i].visible = visible; }
	for ( var i = 0; i < count; i++ ) { arrSize.format_2.line[i].visible = visible; }
	for ( var i = 0; i < count; i++ ){ arrSize.format_2.label[i].visible = visible; }
	for ( var i = 0; i < arrSize.cutoff.length; i++ ){ arrSize.cutoff[i].visible = visible; }
}



