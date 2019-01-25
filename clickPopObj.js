


var param_obj = { click : false, obj: null, vrs1: 0, rotY: 0, minVertY: 0, off: [] };


// кликнули на ПОП объект
function clickPopObj( intersect )
{
	if ( !intersect ) return;
	
	// если кликнули на объект, который не входит в массив, то ничего не делаем
	if(camera == cameraWall)
	{ 
		var exist = false;
		for ( var i = 0; i < arrWallFront.total.length; i++ ) 
		{
			if(arrWallFront.total[i] == intersect.object) { exist = true; break; }
		} 
		if(!exist) { clickO.obj = null; clickO.rayhit = null; return; } 		
	}
	

	var obj = intersect.object;
	if ( obj.userData.tag == 'obj' ) { if ( obj.pr_group ) return; }

	obj_selected = obj;
	objectControls.userData.objPop = obj;

	
	offset = new THREE.Vector3().subVectors( obj.position, intersect.point );
	inititalObjectOffset = offset.clone();

	
	hideMenuTextureObjPop();
	hidePivotGizmo_2();			// скрываем pivot/rotate/scale у предыддущего obj (если они были показаны)
	showToolHandle( obj );		// показываем pivot/rotate/scale


	if ( camera == cameraTop || camera == camera3D ) 
	{
		planeMath2.position.copy( intersect.point );
		planeMath2.rotation.set( 0, 0, 0 );		
	}
	else if ( camera == cameraWall )
	{
		planeMath2.position.copy( intersect.point );
		planeMath2.rotation.set( 0, arrWallFront.wall[0].obj.rotation.y + Math.PI / 2, Math.PI / 2 );			
	}
	
	obj.userData.obj3D.last.pos = obj.position.clone();
	param_obj.click = true;

	// scene.add(arrowHelper);
	
	clickPopObjCameraWall( obj );
}


// показываем pivot/rotate/scale
function showToolHandle( obj ) 
{
	
	var tool = 'pivot';	
	
	if(obj.userData.obj3D) 
	{ 
		if(obj.userData.obj3D.controller == 'scale') { tool = 'scale'; } 
		else if(obj.userData.obj3D.controller == 'rotate') { tool = 'rotate'; } 
	}	
	
	if(tool == 'pivot') 		// показан pivot
	{ 
		setPivotOnPopObj( obj ); 	
		UI('transform-type').val('drag');
	}
	else if(tool == 'rotate')	// rotate
	{		
		obj.updateMatrixWorld();
		var pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );			
		toolHandle.rotate.position.copy( pos );
		toolHandle.rotate.rotation.copy( obj.rotation );
		toolHandle.rotate.visible = true;
		param_pivot.obj = obj; 
		
		clippingGizmo360( obj );
		upMenuRotateObjPop(obj);  
		
		UI('transform-type').val('rotate');
	}	
	else if(tool == 'scale')	// показаны контроллеры scale  
	{ 		 
		showBoxPop(obj);
		upMenuScaleObjPop(obj);
		UI('transform-type').val('scale');
	} 	
}


// обновляем меню preview граней у примитива (показываем стрелки с номерами граней)
function showMenuTextureObjPop( obj ) 
{
	if(!obj.userData.obj3D.edge) return;

	// устанавливаем стрелки
	for (var i = 0; i < arrSize.numberTexture.line.length; i++)
	{
		var line = arrSize.numberTexture.line[i];

		//var v = line.geometry.vertices; 
		//v[0].x = v[1].x = v[6].x = v[7].x = 0;
		//line.geometry.verticesNeedUpdate = true;

		var pos = obj.children[0].children[i].getWorldPosition();
		line.position.copy(pos);
		line.visible = true;
	}	
	
	for ( var i = 0; i < 6; i++ ){ arrSize.numberTexture.line[i].quaternion.copy( obj.quaternion ); }	
	
	arrSize.numberTexture.line[0].rotateOnAxis(new THREE.Vector3(0,0,1), Math.PI / 2);
	arrSize.numberTexture.line[1].rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI / 2);
	arrSize.numberTexture.line[2].rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI / 2);
	arrSize.numberTexture.line[3].rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI / 1);	
	arrSize.numberTexture.line[4].rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI / 2);	
	arrSize.numberTexture.line[5].rotateOnAxis(new THREE.Vector3(0,0,1), -Math.PI / 2);
	
	
	
	// устанавливаем цифры граней
	for ( var i = 0; i < arrSize.numberTexture.line.length; i++ )
	{
		arrSize.numberTexture.line[i].updateMatrixWorld(); 
		var normalMatrix = new THREE.Matrix3().getNormalMatrix( arrSize.numberTexture.line[i].matrixWorld );
		var newNoraml = new THREE.Vector3(1,0,0).applyMatrix3( normalMatrix ).normalize();
		
		arrSize.numberTexture.label[i].visible = true;		
		arrSize.numberTexture.label[i].position.copy(arrSize.numberTexture.line[i].position);
		arrSize.numberTexture.label[i].position.add(newNoraml.divideScalar(2));
		
		arrSize.numberTexture.label[i].rotation.copy(camera.rotation);
		arrSize.numberTexture.label[i].rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI / 2);
	}		
	
	var arr = [];	
	for (var i = 0; i < obj.children[0].children.length; i++) 
	{
		var preview = '';
		
		if(obj.children[0].children[i].userData.material) preview = obj.children[0].children[i].userData.material.preview;
		
		arr[i] = { id: i+1, image: preview };
		
		if(preview == '') continue;
		
		UI('texture-select').val([arr[i]]);
	}
 
	$('[data-action="panel-settings-cube-texture"]').show();
	showMenuTextureObjPop_2( obj );	
	
	renderCamera();
}


// скрываем стрелки с номерами граней
function hideMenuTextureObjPop() 
{
	for (var i = 0; i < arrSize.numberTexture.line.length; i++)
	{
		arrSize.numberTexture.label[i].visible = false;
		arrSize.numberTexture.line[i].visible = false;
	}
	
	//$('[data-action="settings-object-transform-toolbar"]').hide();
	UI.hideSubToolbar('settings-object-transform-toolbar');
}



// обновляем меню поворот/смещение текстуры у примитива
function showMenuTextureObjPop_2( obj )
{
	
	var rot = 0;
	var offset = new THREE.Vector2();
	
	if(obj.material.map) { rot = Math.round(THREE.Math.radToDeg(obj.material.map.rotation)); }	
	
	UI('wall_texture_rotation').val(rot);
	UI('wall_texture_offset_x').val(Math.round(offset.x * 100)/100);
	UI('wall_texture_offset_y').val(offset.y);	
}


// подготавливаем точки для центрирование (при перетаскивании) на объектах прилегающих к стене (cameraWall)
function clickPopObjCameraWall( objPop ) 
{
	if(camera != cameraWall) return;
	
	var arrPos = [];
	var wall = arrWallFront.wall[0].obj;
	
	for ( var i = 0; i < arrWallFront.total.length; i++ ) 
	{ 
		if(arrWallFront.total[i] == objPop) continue;
		if(arrWallFront.total[i].userData.tag == 'wall') continue;
		
		var obj = arrWallFront.total[i];
		
		if ( !obj.geometry.boundingBox ) obj.geometry.computeBoundingBox(); 
		//if ( !obj.geometry.boundingSphere ) obj.geometry.computeBoundingSphere(); 			
		var bound = obj.geometry.boundingBox;
		
		var p = [];
		p[0] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, 0, bound.min.z)) );	
		p[1] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.min.x, 0, bound.max.z)) );		
		p[2] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, 0, bound.min.z)) );
		p[3] = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(bound.max.x, 0, bound.max.z)) );

		var minX = p[0].x;
		var maxX = p[0].x;
		
		for ( var i2 = 0; i2 < p.length; i2++ )
		{
			if(minX > p[i2].x) { minX = p[i2].x; }
			if(maxX < p[i2].x) { maxX = p[i2].x; }		
		}
		
		var centerX = (maxX - minX)/2 + minX;
		
		
		var minY = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(0, bound.min.y, 0)) ).y;	
		var maxY = wall.worldToLocal( obj.localToWorld(new THREE.Vector3(0, bound.max.y, 0)) ).y;
		var centerY = (maxY - minY)/2 + minY;
		
		arrPos[arrPos.length] = new THREE.Vector3(minX, centerY, 0);
		arrPos[arrPos.length] = new THREE.Vector3(maxX, centerY, 0);
		arrPos[arrPos.length] = new THREE.Vector3(centerX, minY, 0);
		arrPos[arrPos.length] = new THREE.Vector3(centerX, maxY, 0);
	}
	
	
	arrWallFront.objPop.arrPos = arrPos;	// записываем все точки всех объектов "на стене"
	detectArrayPointToScreen();
}


// кликнули на ПОП объект, устанавливаем pivot
function setPivotOnPopObj( obj )
{
	param_pivot.obj = obj;
	 
	if ( camera == cameraTop || camera == camera3D ) { showPivotGizmo( obj ); }
	
	inititalObjectRotation = obj.rotation.clone();
	if ( !obj.geometry.boundingBox ) obj.geometry.computeBoundingBox(); 
	lastObject = obj; 
	if ( camera == cameraTop || camera == camera3D ) { showObjectControls( obj ); }
	addSelectedObject( obj );			
}


// кликнули на ПОП объект, показываем меню 
function showTablePopObjUI( obj )
{
	//if(obj.userData.tag == 'group_pop') return;  
	if ( obj.userData.tag == 'obj' ) { if ( obj.pr_group ) return; }

	setUIPreview( obj, obj.pr_preview, obj.pr_catalog );

	if(!obj.userData.obj3D.boxPop) 
	{ 
		UI.showToolbar( 'object-toolbar' ); 
		
		function toFixed( number ) { return Math.round( ( number ) * 100 ) / 100 }
		
		var x = toFixed( obj.userData.obj3D.size.x );
		var y = toFixed( obj.userData.obj3D.size.y );
		var z = toFixed( obj.userData.obj3D.size.z );
		UI( 'obj_pop_size' ).val( x + 'x' + y + 'x' + z );
		UI( 'obj_pop_height_above_floor' ).val( Math.round( obj.position.y * 10 ) / 10 );
		
		$('[data-action="open-catalog object-preview"]').show();
	}
	else 
	{ 
		UI.showToolbar('object-transform-toolbar');

		var tool = 'pivot';	
		
		if(obj.userData.obj3D) 
		{ 
			if(obj.userData.obj3D.controller == 'scale') { tool = 'scale'; } 
			else if(obj.userData.obj3D.controller == 'rotate') { tool = 'rotate'; } 
		}

		if(tool == 'pivot') 		// показан pivot
		{ 
			UI( 'object_offset_X' ).val( 0 );
			UI( 'object_offset_Y' ).val( 0 );
			UI( 'object_offset_Z' ).val( Math.round( obj.position.y * 10 ) / 10 );
		}
		else if(tool == 'rotate')	// rotate
		{		
			upMenuRotateObjPop(obj);
		}	
		else if(tool == 'scale')	// показаны контроллеры scale  
		{ 		 
			upMenuScaleObjPop(obj);
		} 

		//$('[data-action="open-catalog object-preview"]').hide();
		//$('[data-log-id="525"]').hide();
		
		
		if(obj.userData.obj3D.lotid == 72184) 
		{
			$('[data-action="settings-cube-texture"]').show();
		}
		else
		{
			$('[data-action="settings-cube-texture"]').hide();
		}
		
		if(obj.userData.obj3D.lotid == 38 || obj.userData.obj3D.lotid == 526 || obj.userData.obj3D.lotid == 177 || obj.userData.obj3D.lotid == 72184) 
		{ 
			$('[data-action="open-catalog object-preview"]').hide();
			$('[data-action="planoplan-preview"]').hide();
		}
		else 
		{ 
			$('[data-action="open-catalog object-preview"]').show(); 
			$('[data-action="planoplan-preview"]').show();
		}		
	}
	
}


// обновляем в меню размер объекта длина/ширина/высота
function upMenuScaleObjPop(obj)
{	
	obj.geometry.computeBoundingBox();
	var bound = obj.geometry.boundingBox;
	
	var x = bound.max.x - bound.min.x;
	var y = bound.max.y - bound.min.y;
	var z = bound.max.z - bound.min.z;  
	
	x *= obj.scale.x;
	y *= obj.scale.y;
	z *= obj.scale.z; 
	
	obj.userData.obj3D.size = new THREE.Vector3(x, y, z); 
	
	UI( 'object_scale_X' ).val( Math.round( x * 100 )*10 );
	UI( 'object_scale_Y' ).val( Math.round( z * 100 )*10 );
	UI( 'object_scale_Z' ).val( Math.round( y * 100 )*10 );	
}



// показываем Pivot/Gizmo
function showPivotGizmo( obj )
{	
	param_pivot.obj = obj;

	obj.updateMatrixWorld();
	param_obj.vrs1 = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	//obj.children[0].updateMatrixWorld();
	//pivot.position.copy( obj.localToWorld( obj.children[0].position.clone() ) );
	// pivot.position.copy( obj.position );
	//pivot.position.copy( param_obj.vrs1 ); 
	// pivot.rotation.copy( obj.rotation );
	// pivot.rotation.y += Math.PI;
	// pivot.visible = true;
	// pivot.obj = obj;

	gizmo.position.copy( obj.position );
	//gizmo.position.copy( param_obj.vrs1 );
	// gizmo.rotation.copy( obj.rotation );
	gizmo.visible = true; 
	gizmo.obj = obj;

	showObjectControls( obj );

	adjustInitialGizmoSize( obj );
	adjustObjectControlsScale();
	adjustGizmoScale();
	
	if(obj.userData.obj3D) obj.userData.obj3D.controller = 'pivot';
}


// скрываем Pivot/Gizmo
function hidePivotGizmo( obj )
{ 
	if ( obj_selected )
	{
		if ( obj_selected.userData.tag == 'obj' ) return; 
		if ( obj_selected.userData.tag == 'pivot' ) return;
		if ( obj_selected.userData.tag == 'gizmo' ) return;
		if ( obj_selected.userData.tag == 'gizmo360' ) return;
		if ( obj_selected.userData.tag == 'move_control' ) return;
		//if ( obj_selected.userData.tag == 'group_pop' ) return;
		if ( obj_selected.userData.tag == 'toggle_gp' ) return;		
	}

	UI.hideToolbar( 'object-toolbar' );
	UI.hideToolbar( 'object-transform-toolbar' );
	
	hideMenuTextureObjPop();

	hidePivotGizmo_2();
}

function hidePivotGizmo_2() 
{
	param_pivot.obj = null;
	pivot.visible = false;
	gizmo.visible = false;

	hideObjectControls();
	hideGizmo();
	clearSelectedObjects();
	hideBoxPop();

	toolHandle.rotate.visible = false;
}


function movePopObj( event )
{
	if(param_obj.click)
	{
		param_obj.click = false;
	}
	
	if(infProject.scene.type.startMoveObj)
	{ 
		infProject.scene.type.startMoveObj = false;
		UIInvokeFunction('ObjectMove');	 			
	}	
	
	
	var intersects = rayIntersect( event, planeMath2, 'one' );

	if ( intersects.length == 0 ) { return; }

	var obj = obj_selected;
	
	if(obj.userData.tag == 'move_control') { }
	
	var posOld_2 = obj.position.clone();
	
	var tool = 'pivot';
	
	if(obj.userData.obj3D)
	{
		if(obj.userData.obj3D.controller == 'scale') { tool = 'scale'; }
		if(obj.userData.obj3D.controller == 'rotate') { tool = 'rotate'; }
	}
	
	
	if(tool == 'pivot')	// показан pivot
	{
		if ( lastObject !== obj )
		{
			//offset = new THREE.Vector3( 0, 0, 0 );
			inititalObjectOffset = offset.clone();
			inititalObjectRotation = obj.rotation.clone();
			//planeMath2.position.copy( obj.position );
			//planeMath2.rotation.set( 0, 0, 0 ); 
			obj.geometry.computeBoundingBox();
		}
	}
	else 	// показаны контроллеры scale 
	{
		var posOld = obj.position.clone();
	}	

	var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );
	var pos2 = new THREE.Vector3().subVectors( pos, obj.position );
	
	var sp = snapToPlane( obj, pos2, offset, intersects[ 0 ].point, inititalObjectOffset, inititalObjectRotation ); 

	
	if(tool == 'pivot')	// показан pivot
	{
		if(camera != cameraWall)
		{
			gizmo.position.copy( obj.position );   

			if ( camera == camera3D ) updateObjectControlRotation();
			updateObjectControlsPosition( obj );
			adjustObjectControlsScale();
			adjustGizmoScale();					
		}

	}
	else if(tool == 'scale')	// показаны контроллеры scale
	{ 
	 
		if(sp.changeRotation) 
		{
			if(obj.userData.obj3D.boxPop)
			{
				if(obj.userData.obj3D.controller == 'scale')
				{
					showBoxPop(obj);
				}
			} 
		}	
	
		var pos2 = new THREE.Vector3().subVectors( obj.position, posOld ); 
		boxPop.position.add(pos2);
		for ( var i = 0; i < toolHandle.scale.cube3D.length; i++ ) { toolHandle.scale.cube3D[i].position.add(pos2); }	
	}
	else if(tool == 'rotate')
	{
		var pos2 = new THREE.Vector3().subVectors( obj.position, posOld );
		toolHandle.rotate.position.add(pos2);
		
		clippingGizmo360( obj );
	}
	
	if(camera == cameraWall) 
	{ 	 
		var pos2 = new THREE.Vector3().subVectors( obj.position, posOld_2 );
		for ( var i = 0; i < arrSize.cube.length; i++ ) { arrSize.cube[i].position.add( pos2 ); } 	// меняем расположение контроллеров

		if ( keys[ 16 ] ) 
		{
			lineAxis_1.visible = false;
			lineAxis_2.visible = false; 			
		}
		else { navigatePointXY_1(obj); }
		
		showRulerPopObj(obj); 
	}

	UI.setCursor( 'move' );

	if(obj.userData.obj3D)
	{
		if(!obj.userData.obj3D.boxPop) { UI( 'obj_pop_height_above_floor' ).val( Math.round( obj.position.y * 10 ) / 10 ); }
		else { UI( 'object_offset_Z' ).val( Math.round( obj.position.y * 10 ) / 10 ); }			
	}
	
	lastObject = obj;

}


function navigatePointXY_1(obj)
{
	lineAxis_1.visible = false;
	lineAxis_2.visible = false; 	
	
	var pos = [];
	
	pos[0] = new THREE.Vector3(arrSize.cube[0].position.x, arrSize.cube[2].position.y, arrSize.cube[0].position.z);
	navigatePointXY_2(obj, pos[0]);
	
	pos[1] = new THREE.Vector3(arrSize.cube[1].position.x, arrSize.cube[2].position.y, arrSize.cube[1].position.z);
	navigatePointXY_2(obj, pos[1]);
	
	pos[2] = new THREE.Vector3(arrSize.cube[0].position.x, arrSize.cube[3].position.y, arrSize.cube[0].position.z);
	navigatePointXY_2(obj, pos[2]);
	
	pos[3] = new THREE.Vector3(arrSize.cube[1].position.x, arrSize.cube[3].position.y, arrSize.cube[1].position.z);
	navigatePointXY_2(obj, pos[3]);
	
	pos[4] = new THREE.Vector3().subVectors( arrSize.cube[3].position, arrSize.cube[2].position ).divideScalar( 2 ).add( arrSize.cube[2].position );
	navigatePointXY_2(obj, pos[4]);	
	
	//for ( var i = 0; i < pos.length; i++ ) {  cubes[i].position.copy(pos[i]); }  
}






// записываем только те точки, которые попали в камеру
function detectArrayPointToScreen()  
{ 
	var arrPos = [];	
	var wall = arrWallFront.wall[0].obj;
	
	for ( var i = 0; i < arrWallFront.objPop.arrPos.length; i++ )
	{
		var pos = arrWallFront.objPop.arrPos[i];
		
		var pos2 = wall.localToWorld( new THREE.Vector3(pos.x, pos.y, 0) );
		
		pos2.project(camera);
		
		if(pos2.x < -1) continue;
		if(pos2.x > 1) continue;
		if(pos2.y < -1) continue;
		if(pos2.y > 1) continue;	
		
		arrPos[arrPos.length] = pos; 
	}

	arrWallFront.objPop.arrPos_2 = arrPos;
}



// при перетаскивании объекта центрируем на других объектах (центр/края) прилегающие к стене
function navigatePointXY_2(obj, posCenterW) 
{

	var wall = arrWallFront.wall[0].obj;
	 
	//var posCenterW = new THREE.Vector3().subVectors( arrSize.cube[3].position, arrSize.cube[2].position ).divideScalar( 2 ).add( arrSize.cube[2].position );
	
	var posCenterL = wall.worldToLocal( posCenterW.clone() ); 
	
	var arrX = [];
	var arrY = [];
	
	for ( var i = 0; i < arrWallFront.objPop.arrPos_2.length; i++ )
	{
		var pos = arrWallFront.objPop.arrPos_2[i];
		
		var x = Math.abs( posCenterL.x - pos.x );
		var y = Math.abs( posCenterL.y - pos.y );
		
		if(x < 0.06 / zoom_binding){ arrX[arrX.length] = pos; }
		if(y < 0.06 / zoom_binding){ arrY[arrY.length] = pos; }		
	}
	
	var posC = new THREE.Vector3().subVectors( arrSize.cube[3].position, arrSize.cube[2].position ).divideScalar( 2 ).add( arrSize.cube[2].position );
	 
	
	var inf = [];
	if(arrX.length > 0)
	{ 
		var pos = arrX[getMinDistanceVertex(arrX, posCenterL)];  
		var pos = wall.localToWorld( new THREE.Vector3(pos.x, pos.y, 0) );
		
		var pos3 = wall.localToWorld( new THREE.Vector3(posCenterL.x, posCenterL.y, 0) );		
		var pos2 = new THREE.Vector3(pos.x - pos3.x, 0, pos.z - pos3.z);		
 
		obj.position.add(pos2);
		 
		pos3.x = pos.x;
		pos3.z = pos.z;
		pos3.y = posC.y; 
		for ( var i = 0; i < arrSize.cube.length; i++ ) { arrSize.cube[i].position.add( pos2 ); }
		 
		showNavigateLineCameraWall({ pos : {start : pos3, end : pos} });

		inf[inf.length] = {start : pos3, end : pos};
	}	
	
	if(arrY.length > 0)
	{
		var pos = arrY[getMinDistanceVertex(arrY, posCenterL)]; 
		var pos = wall.localToWorld( new THREE.Vector3(pos.x, pos.y, 0) );
		
		var pos3 = wall.localToWorld( new THREE.Vector3(posCenterL.x, posCenterL.y, 0) );
		var pos2 = new THREE.Vector3(0, pos.y - pos3.y, 0);	

		obj.position.add(pos2); 
				
				
		wall.worldToLocal(posC);

		posC = wall.localToWorld( new THREE.Vector3(posC.x, posC.y, 0) );
				
		pos3.y = pos.y;
		pos3.x = posC.x;
		pos3.z = posC.z;
		
		for ( var i = 0; i < arrSize.cube.length; i++ ) { arrSize.cube[i].position.add( pos2 ); }
		 
		showNavigateLineCameraWall({ pos : {start : pos3, end : pos} }); 

		inf[inf.length] = {start : pos3, end : pos};
	}
}


// меняем высоту POP над полом через input
function inputChangeHeightPopObj() 
{
	var obj = clickO.last_obj;
	
	if(!obj.userData.obj3D.boxPop) { var value = $('[data-action="obj_pop_height_above_floor"]').val(); }
	else { var value = $('[data-action="object_offset_Z"]').val(); }	
	
	if ( !value ) return;
	value = value.replace(",", "."); 
	if(!isNumeric(value)) return;  
	value = Number(value);	

	var height = Math.round( value * 10 ) / 10;

	var offset = height - obj.position.y;

	obj.position.y = height;

	pivot.position.y += offset;
	objectControls.position.y += offset;
	objectControls.yAxis.position.y += offset;
	gizmo.position.y += offset;
	
	if(obj.userData.obj3D.controller == 'scale')
	{
		boxPop.position.y += offset;
		for ( var i = 0; i < toolHandle.scale.cube3D.length; i++ ) { toolHandle.scale.cube3D[i].position.y += offset; }
	}
 
	obj.updateMatrixWorld();
	showSizeFormat_3();
	if(camera == cameraWall) { showControllWD( arrWallFront.wall[0].obj, obj ); }
	
	renderCamera();
}



// устанавливаем линейки при клике на POP объект
function showSizePopObj(obj)
{	 
	var wall = arrWallFront.wall[0].obj;    

	showControllWD( wall, obj );		// показываем контроллеры
	
	
	// находим (границы) позиции от выбранного окна/двери до ближайших окон/дверей/края стены
	var arr = detectDirectionWall_1(wall, arrWallFront.wall[0].index, detectRoomWallSide(wall, (arrWallFront.wall[0].index == 1) ? 1 : 0));
	
	var boundPos = [];
	boundPos[0] = arr[0].clone();
	boundPos[1] = arr[2].clone(); 
	
	var vZ = wall.worldToLocal(arrSize.cube[0].position.clone()).z;
	for ( var i = 0; i < boundPos.length; i++ )
	{ 
		boundPos[i].z = vZ; 
		boundPos[i].y = 0; 
		wall.localToWorld( boundPos[i] ); 
	} 

	// инфа для перемещения линеек	
	obj.userData.obj3D.ruler = { boundPos : boundPos, dir : [] };	
		 
  
	showRulerPopObj(obj);	
}


// показываем линейки POPObj (CameraWall)
function showRulerPopObj(obj)
{ 
	if(!obj.userData.obj3D) return;
	if(!obj.userData.obj3D.ruler) return; 	// если это новый объект и мы его только вставляем из каталога в цену, то линейки показывать не нужно
	
	var wall = arrWallFront.wall[0].obj;
	var boundPos = obj.userData.obj3D.ruler.boundPos;
	var index = arrWallFront.wall[0].index;
	var rt = 0;
	
	var p = [];
	for ( var i = 0; i < arrSize.cube.length; i++ ) { p[i] = arrSize.cube[i].position; }
	
	var w2 = [];
	
	w2[0] = new THREE.Vector3(boundPos[0].x, p[0].y, boundPos[0].z); 
	w2[1] = new THREE.Vector3(boundPos[1].x, p[1].y, boundPos[1].z);		
	
	var rt = (index == 1) ? 0 : Math.PI;
	
	w2[2] = new THREE.Vector3(p[2].x, 0, p[2].z);
	w2[3] = new THREE.Vector3(p[3].x, wall.userData.wall.height_1, p[3].z);

	
	// вычисляем изначальное положение как стоят линейки
	var dir = obj.userData.obj3D.ruler.dir;	
	if(dir.length == 0)
	{		
		//var posCenter = new THREE.Vector3( ((w2[1].x - w2[0].x)/2)+w2[0].x, ((w2[3].y - w2[2].y)/2)+w2[2].y, ((w2[1].z - w2[0].z)/2)+w2[0].z );
		//obj.userData.obj3D.ruler.dir[0] = new THREE.Vector3().subVectors( new THREE.Vector3(w2[0].x, posCenter.y, w2[0].z), posCenter ).normalize();  
		//obj.userData.obj3D.ruler.dir[1] = new THREE.Vector3().subVectors( new THREE.Vector3(w2[1].x, posCenter.y, w2[1].z), posCenter ).normalize();		
		//obj.userData.obj3D.ruler.dir[2] = new THREE.Vector3().subVectors( new THREE.Vector3(posCenter.x, w2[2].y, posCenter.z), posCenter ).normalize();
		//obj.userData.obj3D.ruler.dir[3] = new THREE.Vector3().subVectors( new THREE.Vector3(posCenter.x, w2[3].y, posCenter.z), posCenter ).normalize();				
		
		obj.userData.obj3D.ruler.dir[0] = new THREE.Vector3().subVectors( new THREE.Vector3(w2[0].x, 0, w2[0].z), new THREE.Vector3(w2[1].x, 0, w2[1].z) ).normalize();
		obj.userData.obj3D.ruler.dir[1] = new THREE.Vector3().subVectors( new THREE.Vector3(w2[1].x, 0, w2[1].z), new THREE.Vector3(w2[0].x, 0, w2[0].z) ).normalize();
		obj.userData.obj3D.ruler.dir[2] = new THREE.Vector3(0, -1, 0);
		obj.userData.obj3D.ruler.dir[3] = new THREE.Vector3(0, 1, 0);		
	}
	
	
	
	// если объект вышел за приделы стены, то возращаем его обратно
	for ( var i = 0; i < p.length; i++ )
	{		
		var dir = new THREE.Vector3().subVectors( w2[i], p[i] );
		var dir2 = dir.clone().normalize();		
		
		if(!comparePos(obj.userData.obj3D.ruler.dir[i], dir2)) 
		{
			if(i== 0 || i == 1)
			{
				var pos = new THREE.Vector3().subVectors( new THREE.Vector3(w2[i].x, 0, w2[i].z), new THREE.Vector3(p[i].x, 0, p[i].z) );
				obj.position.add(pos);
				for ( var i2 = 0; i2 < p.length; i2++ ) { p[i2].add(pos); }
				w2[2].add(pos);
				w2[3].add(pos);
			}
			else if(i== 2 || i == 3)
			{
				var pos = new THREE.Vector3().subVectors( new THREE.Vector3(0, w2[i].y, 0), new THREE.Vector3(0, p[i].y, 0) );
				obj.position.add(pos);
				for ( var i2 = 0; i2 < p.length; i2++ ) { p[i2].add(pos); }
				w2[0].add(pos);
				w2[1].add(pos);
			}			
		}	
	}	
	
	
	var line = arrSize.format_2.line;
	var label = arrSize.format_2.label;	
	
	// линейки показывающие длину
	for ( var i = 0; i < p.length; i++ )
	{
		var d = w2[i].distanceTo(p[i]); 
		var v = line[i].geometry.vertices; 	
		v[3].x = v[2].x = v[5].x = v[4].x = d;
		line[i].geometry.verticesNeedUpdate = true;		
		
		line[i].position.copy( p[i] );
		line[i].visible = true;
				
		var dir = new THREE.Vector3().subVectors( w2[i], p[i] );
		var dir2 = dir.clone().normalize();
		var rotation = new THREE.Euler().setFromQuaternion( quaternionDirection(dir2) );  // из кватерниона в rotation
		line[i].rotation.set(rotation.x, rotation.y - Math.PI / 2, 0);
		
		
		if(!comparePos(obj.userData.obj3D.ruler.dir[i], dir2)) { d *= -1; }
		
		label[i].position.copy( p[i] );
		label[i].position.add( dir.divideScalar( 2 ) );	
		
		label[i].rotation.set( 0, wall.rotation.y + rt, 0 );    
		label[i].visible = true;		
		upLabelCameraWall({label : label[i], text : Math.round(d * 100) * 10, color : 'rgba(0,0,0,1)', border : 'border line'});		
	}
	
	
	// боковые отсечки для линейки
	var arr = [];
	for ( var i = 0; i < p.length; i++ ) { arr[i] = { p1 : p[i], p2 : w2[i] }; }		
	showSizeCutoff(arr);	
	 
}



// сняли клик с мышки после токо как кликнули на стену
function clickPopObjMouseUp(obj)
{ 
	lineAxis_1.visible = false;
	lineAxis_2.visible = false;
	
	if(obj.userData.obj3D)
	{
		if(comparePos(obj.userData.obj3D.last.pos, obj.position)) { return; }		// не двигали	
	}
	
	
	//if ( camera == cameraTop ) { getInfoEvent2( wall, param_wall.wallR ); }


	if ( camera == cameraWall ) { showSizeFormat_3(); }
}




