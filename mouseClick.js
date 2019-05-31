var obj_selected = null;
var isMouseDown1 = false;
var isMouseRight1 = false;
var isMouseDown2 = false;
var isMouseDown3 = false;
var onMouseDownPosition = new THREE.Vector2();
var long_click = false;
var lastClickTime = 0;
var catchTime = 0.30;
var vk_click = '';


var clickO = resetVarParam();


function resetVarParam()
{	
	return { obj: null, last_obj: null, hover_obj: null, rayhit : null, button : null, buttonAct : null };
}


function mouseDownRight()
{
	catalogResetObj();
	
	clickO.buttonAct = null;
	clickO.button = null; 
	
	if ( camera == camera3D ) 
	{
		hideMenuObjUI_3D( clickO.last_obj );
	}
	
	
	if(obj_selected)
	{
		if(obj_selected.userData.tag == 'free_dw') 
		{ 
			scene.remove(obj_selected); 
			clickO = resetVarParam(); 
		}		
		else if(obj_selected.userData.tag == 'point') 
		{ 	
			if(obj_selected.w.length == 0)
			{ 
				deletePointFromArr(obj_selected); 
				scene.remove( obj_selected ); 
			}  
			else 
			{ 
				if(obj_selected.userData.point.type == 'continue_create_wall')
				{
					var point = obj_selected.p[0]; 
					deleteWall_2(obj_selected.w[0]); 
					//upLabelPlan_1([point.w[0]]);					
				}
				
				if(point.userData.point.last.cdm == 'new_point_1') { deletePoint( point ).wall.userData.id = point.userData.point.last.cross.walls.old; }
			}
		}
		else if(obj_selected.userData.tag == 'obj')
		{
			deleteObjCatalog( obj_selected );
		}
		
		clickO = resetVarParam();
	}	
	
	obj_selected = null;	
}



function onDocumentMouseDown( event ) 
{
	//event.preventDefault();	

	long_click = false;
	lastClickTime = new Date().getTime();

	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		vk_click = 'left';
	}
	
//console.log(777777, event)
	switch ( event.button ) 
	{
		case 0: vk_click = 'left'; break;
		case 1: vk_click = 'right'; /*middle*/ break;
		case 2: vk_click = 'right'; break;
	}


	lineAxis_1.visible = false;
	lineAxis_2.visible = false;

	clickSetCamera2D( event, vk_click );
	clickSetCamera3D( event, vk_click );


	if ( vk_click == 'right' ) { mouseDownRight(); return; } 


	if(obj_selected)
	{
		if(obj_selected.userData.tag == 'point') 
		{			
			if(obj_selected.userData.point.type) { clickCreateWall( obj_selected ); return; }  
		}
	}
	 
	clickO.obj = null; 
	clickO.rayhit = null;	
	
	
	if(1==2)
	{
		clickRayHit( detectRayHit( event, 'click' ) );  
		
		
		if(clickO.last_obj)
		{
			if(clickO.last_obj != clickO.obj) { sendMessage('EDITOR.OBJECT_UNPICK'); UIInvokeFunction('Click'); }
		}		


		if ( camera == cameraTop ) { hideMenuObjUI_2D( clickO.last_obj ); showMenuObjUI_2D( clickO.obj ); }
		else if ( camera == camera3D ) { hideMenuObjUI_3D( clickO.last_obj ); }
		else if ( camera == cameraWall ) { hideMenuObjUI_Wall(clickO.last_obj); showMenuObjUI_Wall(clickO.obj); }		
	}
	
	renderCamera();
}





function detectRayHit( event, cdm )
{
	var intersects = rayIntersect( event, scene.children, 'arr' );

	var um = [];
	for ( var i = 0; i < intersects.length; i++ )
	{
		if ( intersects[ i ].object.userData.tag ) { um[ um.length ] = { numRay: i, tag: intersects[ i ].object.userData.tag }; }
	}

	var num = -1;

	if ( cdm == 'click' )
	{
		var cdm = { intersects: um, tag: [ 'toggle_gp', 'pivot', 'gizmo', 'move_control', 'd_tool', 'controll_wd' ] };		
		if ( camera == cameraTop ) { cdm.tag[ cdm.tag.length ] = 'window'; cdm.tag[ cdm.tag.length ] = 'door'; }
		num = clickFirstHit_1( cdm );
		
		// если кликнули на контроллер для приметивов
		// преверяем если ближи к нам был POP приметив, то мы его активируем, иначе, выбранным объектом будет контроллер
		if ( num != -1 )
		{
			if(intersects[ num ].object.userData.tag == 'toggle_gp' && camera == camera3D)
			{
				var num2 = -1;
				for ( var i = 0; i < intersects.length; i++ ) { if(intersects[ i ].object.userData.tag == 'obj') { num2 = i; break; } }
				
				if(num2 != -1)
				{
					if(num2 < num) { num = num2; }
				}
			}
		}

		var cdm = { intersects: um, tag: [ 'window', 'door', 'toggle_gp', 'move_control', 'gizmo', 'gizmo360', 'door_leaf', 'obj', 'point', 'wall', 'room', 'ceiling', 'group_pop' ] };
		if ( num == -1 ) { num = clickFirstHit_2( cdm ); }
	}
	else
	{
		var cdm = { intersects: um, tag: [ 'controll_wd', 'window', 'door', 'toggle_gp', 'move_control', 'gizmo', 'door_leaf', 'point', 'wall' ] };
		num = clickFirstHit_1( cdm );  
	}

	return ( num == -1 ) ? null : intersects[ num ];
}


// определяем порядок по важности выбранного объекта (выбирается, тот который стоит в начале списка cdm.tag)
function clickFirstHit_1( cdm )
{
	for ( var i = 0; i < cdm.tag.length; i++ )
	{
		for ( var i2 = 0; i2 < cdm.intersects.length; i2++ )
		{
			if ( cdm.tag[ i ] == cdm.intersects[ i2 ].tag ) { return cdm.intersects[ i2 ].numRay; }
		}
	}

	return -1;
}


// если кликнули на объект и он есть в списке, то его выбираем 
function clickFirstHit_2( cdm )
{
	for ( var i = 0; i < cdm.intersects.length; i++ )
	{
		for ( var i2 = 0; i2 < cdm.tag.length; i2++ )
		{
			if ( cdm.intersects[ i ].tag == cdm.tag[ i2 ] ) { return cdm.intersects[ i ].numRay; }
		}
	}

	return -1;
}



// блокировка при клике на объект
function clickActionBreak( rayhit )
{
	var obj = rayhit.object;
	var tag = obj.userData.tag;
	
	if ( tag == 'door_leaf' ) { obj = obj.door; tag = obj.userData.tag; }
	
	if ( camera == cameraTop )
	{
		if(tag == 'wall') { if(!obj.userData.wall.actList.click2D) return true; }
		else if(tag == 'point') { if(!obj.userData.point.actList.click2D) return true; }
		else if(tag == 'window') { if(!obj.userData.door.actList.click2D) return true; }
		else if(tag == 'door') { if(!obj.userData.door.actList.click2D) return true; }		
	}
	else if ( camera == camera3D )
	{
		if(tag == 'wall') { if(!obj.userData.wall.actList.click3D) return true; }
		else if(tag == 'point') { if(!obj.userData.point.actList.click3D) return true; }
		else if(tag == 'window') { if(!obj.userData.door.actList.click3D) return true; }
		else if(tag == 'door') { if(!obj.userData.door.actList.click3D) return true; }			
	}		
	
	return false;
}


// блокировка при перемещения объекта
function moveActionBreak( obj )
{
	var tag = obj.userData.tag;
	
	if(tag == 'wall') { if(!obj.userData.wall.actList.move) return true; }
	else if(tag == 'point') { if(!obj.userData.point.actList.move) return true; }
	else if(tag == 'window') { if(!obj.userData.door.actList.move) return true; }
	else if(tag == 'door') { if(!obj.userData.door.actList.move) return true; }		
		
	
	return false;
}


// блокировка при удалении объекта
function deleteActionBreak( obj )
{
	var tag = obj.userData.tag;
	
	if(tag == 'wall') { if(!obj.userData.wall.actList.delete) return true; }
	else if(tag == 'point') { if(!obj.userData.point.actList.delete) return true; }
	else if(tag == 'window') { if(!obj.userData.door.actList.delete) return true; }
	else if(tag == 'door') { if(!obj.userData.door.actList.delete) return true; }		
		
	
	return false;
}



function clickRayHit( rayhit )
{ 
	if ( !rayhit ) return;

	var object = rayhit.object;
	
	consoleInfo( object );
	
	if(clickActionBreak( rayhit )) return;
	
	var tag = object.userData.tag;
	
	if ( tag == 'door_leaf' ) { object = object.door; tag = object.userData.tag; }
	
	clickO.obj = object;
	clickO.rayhit = rayhit;	

	if ( camera == cameraTop )
	{  
		if (clickToolWD()) { console.log(clickO.last_obj); }
		else if ( tag == 'wall' ) { clickWall_2D( rayhit ); }
		else if ( tag == 'point' ) { clickPoint( rayhit ); }
		else if ( tag == 'obj' ) { clickPopObj( rayhit ); }
		else if ( tag == 'group_pop' ) { clickPopObj( rayhit ); }
		else if ( tag == 'window' ) { clickWD( rayhit ); }
		else if ( tag == 'door' ) { clickWD( rayhit ); }
		else if ( tag == 'd_tool' ) { obj_selected = object; }
		else if ( tag == 'controll_wd' ) { clickToggleChangeWin( rayhit ); }
		// else if(tag == 'pivot') { clickPivot( rayhit ); }
		else if ( tag == 'gizmo' ) { clickGizmo( rayhit ); }
		else if ( tag == 'gizmo360' ) { clickGizmo360( rayhit ); }
		else if ( tag == 'move_control' ) { clickObjectControls( rayhit ); }
		else if ( tag == 'toggle_gp' ) { clickToggleGp( rayhit ); }
		else if ( tag == 'room' ) {  }
	}
	else if ( camera == camera3D )
	{
		if ( tag == 'wall' ) { clickO.obj = object; }
		else if ( tag == 'window' ) { clickO.obj = object; }
		else if ( tag == 'door' ) { clickO.obj = object; }
		else if ( tag == 'obj' ) { if(param_pivot.obj == object) { clickPopObj( rayhit ); } clickO.obj = object; }
		else if ( tag == 'group_pop' ) { clickPopObj( rayhit ); clickO.obj = object; }
		// else if(tag == 'pivot') { clickPivot( rayhit ); }
		else if ( tag == 'gizmo' ) { clickGizmo( rayhit ); }
		else if ( tag == 'gizmo360' ) { clickGizmo360( rayhit ); }
		else if ( tag == 'move_control' ) { clickObjectControls( rayhit ); }
		else if ( tag == 'toggle_gp' ) { clickToggleGp( rayhit ); }
		else if ( tag == 'room' ) { clickO.obj = object; }
	}
	else if ( camera == cameraWall )
	{
		if ( tag == 'wall' ) { clickWall_3D( rayhit ); }
		else if ( tag == 'window' ) { clickWD( rayhit ); }
		else if ( tag == 'door' ) { clickWD( rayhit ); }
		else if ( tag == 'gizmo360' ) { clickGizmo360( rayhit ); }
		else if ( tag == 'obj' ) { clickPopObj( rayhit ); }
		else if ( tag == 'controll_wd' ) { clickToggleChangeWin( rayhit ); }
	}

}



function setUIPreview( object, preview, catalog, index ) 
{
	var target = '';
	switch ( object.userData.tag ) 
	{
		case 'wall': target = 'wall-preview'; break; 
		case 'door': target = 'doors-preview'; break;
		case 'obj': target = 'object-preview'; break;
		case 'room': target = 'floor-preview'; break;
		case 'ceiling': target = 'floor-preview'; break;
	}
	
	UI( target ).val( preview );
	if(object.userData.tag == 'obj' || object.userData.tag == 'door' || object.userData.tag == 'window') 
	{ 
		if ( object.pr_filters ) { UI.catalogFilter = object.pr_filters; } 
	}
	else 
	{ 
		if ( object.userData.material.filters ) { UI.catalogFilter = object.userData.material.filters; } 
	}
	
	UI.catalogSource = catalog;
	
	// первое preview (дверь, стена, пол, объект)
	if ( target === 'floor-preview' )
	{  
		UI.setObjectCaption( object.userData.material.caption );
		UI.setProjectInfo( '', '', object.userData.material.lotid );			
	} 
	else if ( typeof index !== 'undefined' )
	{
		UI.setObjectCaption( object.userData.material[ index ].caption );
		UI.setProjectInfo( '', '', object.userData.material[ index ].lotid );
	} 
	else
	{
		UI.setObjectCaption( object.pr_caption );
		UI.setProjectInfo( '', '', object.lotid );
	}
	
	
	// второе preview (плинтус, ручка двери)
	if ( object.userData.tag == 'room' ) 
	{ 
		UI( 'plinth-preview' ).val( object.userData.room.plinth.preview );
		UI.setObjectCaption( object.userData.room.plinth.caption, 'plinth' ) 
	}
	else if ( object.userData.tag == 'ceiling' ) 
	{ 
		UI( 'plinth-preview' ).val( object.userData.ceil.plinth.preview );
		UI.setObjectCaption( object.userData.ceil.plinth.caption, 'plinth' ) 
	}	
	else if ( object.userData.tag == 'door' && object.userData.door.type === 'DoorPattern') 
	{
		var door = object.userData.door;
		if (typeof door.compilation !== 'undefined' && typeof door.compilation.handle[0] !== 'undefined' && typeof door.compilation.handle[0].userData.catalog !== 'undefined' ) 
		{
			UI( 'handle-preview' ).val( door.compilation.handle[0].userData.catalog.preview ); 
			UI.setObjectCaption( door.compilation.handle[0].userData.catalog.caption, 'handle' );
		} 
		else 
		{
			UI( 'handle-preview' ).val( '' ); 
			UI.setObjectCaption( '', 'handle' );
		}
	}
}


function onDocumentMouseMove( event ) 
{ 
	if(event.changedTouches)
	{
		event.clientX = event.changedTouches[0].clientX;
		event.clientY = event.changedTouches[0].clientY;
		isMouseDown2 = true;
	}

	clickButton( event );
	mouseRayPanorama360(event);
	
	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }

	var obj = obj_selected;
	
	if ( obj ) 
	{
		var tag = obj.userData.tag;
		
		if(moveActionBreak( obj )) return;
		
		if ( tag == 'wall' ) { moveWall( event, obj ); }
		else if ( tag == 'window' ) { moveWD( event, obj ); }
		else if ( tag == 'door' ) { moveWD( event, obj ); }
		else if ( tag == 'controll_wd' ) { moveToggleChangeWin( event, obj ); }
		else if ( tag == 'point' ) { movePoint( event, obj ); }
		else if ( tag == 'd_tool' ) { moveToolDoor( event ); }
		else if ( tag == 'gizmo' ) { moveGizmo( event ); }
		else if ( tag == 'gizmo360' ) { moveGizmo360( event ); } 
		else if ( tag == 'move_control' ) { moveObjectControls( event ); }
		else if ( tag == 'room' ) { cameraMove3D( event ); }
		else if ( tag == 'obj' ) { movePopObj( event ); }
		else if ( tag == 'group_pop' ) { movePopObj( event ); }
		else if ( tag == 'toggle_gp' ) { moveToggleGp( event ); }
		else if ( tag == 'free_dw' ) { dragWD_2( event, obj ); }
	}
	else 
	{
		if ( camera == camera3D ) { cameraMove3D( event ); }
		else if ( camera == cameraTop ) { moveCameraTop( event ); }
		else if ( camera == cameraWall ) { moveCameraWall2D( event ); }
	}

	activeHover2D( event );
	activeHoverWall( event );
	
	checkHoverObjectControl( event );
	
	renderCamera();
}


function onDocumentMouseUp( event )  
{

	if ( !long_click && camera == camera3D ) 
	{ 
		getNearMousePositionCam360(event);
		showMenuObjUI_3D( clickO.obj ); 
	}
	
	var obj = obj_selected;	
	
	if ( obj )  
	{
		var tag = obj.userData.tag;
		
		if ( tag == 'point' ) { if(!obj.userData.point.type) { clickCreateWall(obj); } }
		else if ( tag == 'wall' ) { clickWallMouseUp(obj); }
		else if ( tag == 'window' || obj.userData.tag == 'door' ) { clickWDMouseUp(obj); }
		else if ( tag == 'd_tool' ) { clickToolDoorUp(obj.door); }
		else if ( tag == 'move_control' ) { showGizmo(); restoreObjectControls( obj.pr_axis ); UI('object_offset_X').val(0); UI('object_offset_Y').val(0); }
		else if ( tag == 'gizmo' ) { showObjectControls(param_pivot.obj); }
		else if ( tag == 'obj' ) { clickPopObjMouseUp(obj); }
		   

		if(tag == 'move_control') { clickO.last_obj = objectControls.userData.objPop; }
		if(tag == 'gizmo') { clickO.last_obj = objectControls.userData.objPop; }
		if(tag == 'gizmo360') { clickO.last_obj = param_pivot.obj; }
		if(tag == 'toggle_gp') { clickO.last_obj = boxPop.userData.boxPop.popObj; }
		
		UI.setCursor();		
	}

	if(obj)
	{ 
		if ( obj.userData.tag == 'free_dw' ) {  }
		else if ( obj.userData.tag == 'point' ) 
		{
			if(obj.userData.point.type) {  } 
			else { obj_selected = null; }
		}
		else { obj_selected = null; }
	}


	param_win.click = false;
	isMouseDown1 = false;
	isMouseRight1 = false;
	isMouseDown2 = false;
	isMouseDown3 = false;
	
	renderCamera();
}








// скрываем меню для раличных элементов/объектов сцены
function hideMenuObjUI_2D( o )
{
	if ( o )
	{ 
		objDeActiveColor_2D(); 
		
		if(clickO.obj)
		{
			if(clickO.obj.userData.tag == 'controll_wd'){ if(clickO.obj.userData.controll.obj == clickO.last_obj) { return; } } 
			if(clickO.obj.userData.tag == 'd_tool'){ if(clickO.obj.door == clickO.last_obj) { return; } } 
		}
		
		switch ( o.userData.tag ) 
		{  
			case 'wall': UI.hideToolbar( 'wall-2d-toolbar' );  break;
			case 'window': UI.hideToolbar( 'window-toolbar' ); clearSelectedObjects(o.userData.tag); if ( camera != camera3D ) { hideSizeWD( o ); } break;
			case 'door': UI.hideToolbar( 'door-2d-toolbar' );  clearSelectedObjects(o.userData.tag);  if ( camera != camera3D ) { hideSizeWD( o ); } break;
			case 'room': UI.hideToolbar( 'floor-2d-toolbar' ); break;
			case 'obj': hidePivotGizmo( o ); break;
			// case 'pivot': hidePivotGizmo(o); break;
			case 'gizmo': hidePivotGizmo( o ); break;
			case 'move_control': hidePivotGizmo( o ); break;
			case 'group_pop': hidePivotGizmo( o ); break; 
		}
		
		//clickO.last_obj = null; 
	}
}

// показываем меню для раличных элементов/объектов сцены
function showMenuObjUI_2D( o )
{
	var rayhit = clickO.rayhit;
	
	catalogClickObj( o, rayhit );
	
	if ( o )
	{
		objActiveColor_2D(o);
		
		switch ( o.userData.tag ) 
		{
			case 'wall': showLengthWallUI( o ); break;
			case 'window': clickWD_2(o); break; 
			case 'door': clickWD_2(o); break;
			case 'room': showTableFloorUI(); break;
			case 'obj': showTablePopObjUI( o ); break;
			case 'controll_wd': o = o.userData.controll.obj; break;
		}
		
		if(o.userData.tag == 'd_tool'){ return; } 	
	}
	
	setClickPick(o);	
	clickO.last_obj = o;
}




function showMenuObjUI_3D( o )
{
	var rayhit = clickO.rayhit;

	if ( o )
	{
		switch ( o.userData.tag ) 
		{
			case 'wall': clickWall_3D( rayhit ); break;
			case 'room': clickFloor_3D( o ); break;
			case 'ceiling': clickCeiling_3D( o ); break;
			case 'window': clickWD( rayhit ); clickWD_2(o); break;
			case 'door': clickWD( rayhit ); clickWD_2(o); break;
			case 'obj': clickPopObj( rayhit ); showTablePopObjUI( o ); break;
			case 'group_pop': clickPopObj( rayhit ); break;
		}
	}
	
	catalogClickObj( o, rayhit );

	setClickPick(o);
	clickO.last_obj = o;
	clickO.obj = null;
}


function hideMenuObjUI_3D( o )
{
	if ( o )
	{  
		switch ( o.userData.tag ) 
		{
			case 'wall': deleteOutline(); UI.hideToolbar( 'wall-3d-toolbar' ); break;
			case 'window': UI.hideToolbar( 'window-toolbar' ); clearSelectedObjects(o.userData.tag);  break;
			case 'door': UI.hideToolbar( 'door-2d-toolbar' ); clearSelectedObjects(o.userData.tag);  break;
			case 'room': deleteOutline(); UI.hideToolbar( 'floor-3d-toolbar' ); break; 
			case 'ceiling': deleteOutline(); UI.hideToolbar( 'floor-3d-toolbar' ); break; 
			case 'obj': hidePivotGizmo( o ); break;
			case 'group_pop': hidePivotGizmo( o ); break;
		}
	}
}







// скрываем меню (cameraWall)
function hideMenuObjUI_Wall(o)
{  
	if(!o) return;
	if(clickO.last_obj == clickO.obj) return;
	
	
	if(clickO.obj)
	{
		if(clickO.obj.userData.tag == 'controll_wd')
		{ 			
			if(clickO.obj.userData.controll.obj == clickO.last_obj) { return; } 
		} 
	}	
	
	if(o.userData.tag)
	{
		var tag = o.userData.tag;
		
		if(tag == 'wall') { UI.hideToolbar( 'camera-wall-toolbar' ); deleteOutline(); }
		else if(tag == 'window') { UI.hideToolbar( 'window-toolbar' ); clearSelectedObjects(o.userData.tag); hideSizeWD( o ); }
		else if(tag == 'door') { UI.hideToolbar( 'door-2d-toolbar' ); clearSelectedObjects(o.userData.tag); hideSizeWD( o ); }
		else if(tag == 'obj') { hidePivotGizmo( o ); hideSizeWD( o ); }		
	}
	
	clickO.last_obj = null;
}



// показываем меню (cameraWall)
function showMenuObjUI_Wall(o) 
{
	if(!o) { return; }		
	
	if(o.userData.tag)
	{
		var tag = o.userData.tag;
		
		if(tag == 'wall') { o.userData.wall.outline = clickWallOutline(o, clickO.index);  UI.showToolbar('camera-wall-toolbar'); }
		else if(tag == 'window') { clickWD_2(o); }
		else if(tag == 'door') { clickWD_2(o); }
		else if(tag == 'obj') { showSizePopObj(o); showTablePopObjUI( o ); }
		else if(tag == 'controll_wd') { o = o.userData.controll.obj; }		
	}
	
	setClickPick(o);
	clickO.last_obj = o;		
	clickO.obj = null;
	
	catalogClickObj( clickO.last_obj, clickO.rayhit );
}



// отправляем Message на что кликнули
function setClickPick(obj)
{
	var cdm = { lotid : null, tag : null };
	
	if(obj)
	{
		if(obj.userData.tag)
		{
			var tag = obj.userData.tag;
			
			if(tag == 'wall') { if(clickO.index == 1 || clickO.index == 2) { cdm.lotid = obj.userData.material[clickO.index].lotid; } }
			else if(tag == 'room') { cdm.lotid = obj.userData.material.lotid; }
			else if(tag == 'ceiling') { cdm.lotid = obj.userData.material.lotid; }
			else if(tag == 'door') { cdm.lotid = obj.userData.door.lotid; }
			else if(tag == 'window') { cdm.lotid = obj.userData.door.lotid; }
			else if(tag == 'obj') 
			{ 
				cdm.lotid = obj.userData.obj3D.lotid; 
				
				if(obj.userData.obj3D.boxPop){ cdm.size = obj.userData.obj3D.size; }
			}

			cdm.tag = tag;
		}
	}	
	
	UIInvokeFunction('Click', cdm);
}


// по клику получаем инфу об объекте
function consoleInfo( obj )
{
	
	if(!obj) return;
	if(!obj.userData.tag) return;
	
	var tag = obj.userData.tag;
	console.log(obj.userData.tag);
	if ( tag == 'room' ) 
	{
		var txt = '';
		//for ( var i = 0; i < obj.w.length; i++ ) { txt += '| ' + obj.w[i].userData.id; }
		for ( var i = 0; i < obj.p.length - 1; i++ ) { txt += '| ' + obj.p[i].userData.id; }
		
		console.log( "room id : " + obj.userData.id + " | point : " + txt, " | userData : ", obj.userData, obj );
	}
	else if( tag == 'wall' )
	{ 
		console.log( "wall id : " + obj.userData.id + " index : " + clickO.index + " | point : " + obj.userData.wall.p[0].userData.id + " | " + obj.userData.wall.p[1].userData.id + " | userData : ", obj.userData, obj ); 
	}
	else if( tag == 'point' )
	{ 
		console.log( "point id : " + obj.userData.id + " | userData : ", obj.userData, obj ); 
	}
	else if( tag == 'window' || tag == 'door' )
	{ 
		var txt = {};
		if(obj.userData.door.type == 'DoorPattern') { txt = { compilation : obj.userData.door.compilation }; }
		console.log( tag + " id : " + obj.userData.id + " | lotid : " + obj.userData.door.lotid + " | " + " type : " + obj.userData.door.type, txt, " | userData : ", obj.userData, obj ); 
	}
	else if ( tag == 'controll_wd' ) 
	{
		console.log( "controll_wd number : " + obj.userData.controll.id, obj );
	}
	else if ( tag == 'obj' ) 
	{
		console.log( "obj : " + obj.userData.id + " | lotid : " + obj.lotid  + " | userData : ", obj.userData, obj );
	}	
	else 
	{
		console.log( "pr_id : " + obj.userData.id + " | lotid : " + obj.lotid + " | caption : " + obj.caption, obj );
	}	
}

