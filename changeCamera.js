

    


// переключение камеры
function changeCamera(cam)
{  
	var cdm = '';
	if(camera == cameraWall){ cdm = 'cameraWall'; }
	else if(camera == cameraTop){ cdm = 'cameraTop'; }
	
	clickO.obj = null;
	camera = cam;
	
	zoom_binding = camera.zoom;
	
	if(camera == cameraTop)
	{					
		changeDepthColor();
				
		hideMenuObjUI_3D(clickO.last_obj);
		hideSizeWD(clickO.last_obj);
		showHideSizePlane('show'); 
		
		pointGrid.visible = true;
		for ( var i = 0; i < obj_line.length; i++ ) 
		{ 
			obj_line[i].material[0].clippingPlanes[0].constant = 1;
			obj_line[i].material[1].clippingPlanes[0].constant = 1; 
			obj_line[i].material[2].clippingPlanes[0].constant = 1; 
		}	
				
		showAllWallRender();	// показываем стены, которые были спрятаны
		
		if(cdm == 'cameraWall')	// возращаемся в 2D режим из cameraWall 
		{ 
			showHideArrObj(obj_line, true);
			showHideArrObj(arr_window, true);
			showHideArrObj(arr_door, true);
			showHideArrObj(room, true);  
			 
			hideMenuObjUI_Wall(clickO.last_obj);
			
			if(arr_obj.length > 0) 
			{ 
				for ( var i = 0; i < arrWallFront.objPop.obj_2.length; i++ )
				{
					changeOpacityPOP(arrWallFront.objPop.obj_2[i], { transparent : false, opacity : 1.0 });
				}
		
				if(!arr_obj[0].visible) 
				{
					for ( var i = 0; i < arr_obj.length; i++ ) { arr_obj[i].visible = true; }	// показываем все объекты 
				}			
			}
		}		
		
		for ( var i = 0; i < room.length; i++ ) { deletePlinths(room[i], room[i].userData.room.plinth.o); }	
		hideRuleCameraWall();
		cameraZoomTop( camera.zoom );
	}
	else if(camera == camera3D)
	{	
		activeHover2D_2();
		hideMenuObjUI_2D(clickO.last_obj); 
		hideSizeWD(clickO.last_obj);
		
		pointGrid.visible = true;
		for ( var i = 0; i < obj_line.length; i++ ) 
		{ 
			obj_line[i].material[0].clippingPlanes[0].constant = 1;
			obj_line[i].material[1].clippingPlanes[0].constant = 1; 
			obj_line[i].material[2].clippingPlanes[0].constant = 1; 
		}		
		
		lineAxis_1.visible = false;
		lineAxis_2.visible = false;		
		 
		if(cdm == 'cameraTop')	// возращаемся в 3D режим из 2D режима
		{
			updateFormPlinths(room);	// создаем и показываем плинтуса
			//objDeActiveColor_2D(); 
			
			changeDepthColor();
			getInfoRenderWall();
		}
		else if(cdm == 'cameraWall')	// возращаемся в 3D режим из cameraWall 
		{ 
			showPlinthsCamera3D(true);		// показываем все скрытые плинтуса
			
			showHideArrObj(obj_line, true);
			showHideArrObj(arr_window, true);
			showHideArrObj(arr_door, true);
			showHideArrObj(room, true);  
			 
			hideMenuObjUI_Wall(clickO.last_obj);			
			
			
			for ( var i = 0; i < arrWallFront.objPop.obj_2.length; i++ ) { changeOpacityPOP(arrWallFront.objPop.obj_2[i], { transparent : false, opacity : 1.0 }); }			
			for ( var i = 0; i < arr_obj.length; i++ ) { arr_obj[i].visible = true; }	// показываем все объекты 
		}
		
		if(camera3D.userData.camera.type == 'fly') { wallAfterRender_2(); }
		else if(camera3D.userData.camera.type == 'first') { showAllWallRender(); }  
		
		showHideSizePlane('hide');
		hideRuleCameraWall();
	

if(1==1)
{
camera3D.userData.camera.type = 'first';	
camera3D.position.x = 2.488135205055217;
camera3D.position.y = 1.2254803937655514;
camera3D.position.z = -0.7403517919618064;			
		
camera3D.rotation.x = -0.03739320810967875;
camera3D.rotation.y = 1.757398163397449;
camera3D.rotation.z = -1.3877787807814457e-17;

camera3D.updateProjectionMatrix();		
}	

		
					
	}
	else if(camera == cameraWall)		// переключаемся в cameraWall
	{				 
		showHideArrObj(obj_line, false);
		showHideArrObj(arr_window, false);
		showHideArrObj(arr_door, false);
		showHideArrObj(room, false);

		pointGrid.visible = false;		
		for ( var i = 0; i < obj_line.length; i++ ) 
		{ 
			obj_line[i].material[0].clippingPlanes[0].constant = 0;
			obj_line[i].material[1].clippingPlanes[0].constant = 0; 
			obj_line[i].material[2].clippingPlanes[0].constant = 0; 
		}		
		
		var wall = clickO.last_obj;
		var index = clickO.index;
		
		
		showPlinthsCamera3D(false);		// скрываем все плинтуса
		if(arrWallFront.room) { hidePlinthsCameraWall(arrWallFront.room.userData.room.plinth); }	// показываем плинтуса, которые должны отображаться в cameraWall
		
		// отображаем фронтальные стены
		for ( var i = 0; i < arrWallFront.wall.length; i++ )
		{
			arrWallFront.wall[i].obj.visible = true;
			for ( var i2 = 0; i2 < arrWallFront.wall[i].obj.userData.wall.arrO.length; i2++ ) 
			{ 
				arrWallFront.wall[i].obj.userData.wall.arrO[i2].visible = true; 
				if(arrWallFront.wall[i].obj.userData.wall.arrO[i2].userData.door.popObj) { arrWallFront.wall[i].obj.userData.wall.arrO[i2].userData.door.popObj.visible = true; }
			}				
		}

		// отображаем соседние стены
		for ( var i = 0; i < arrWallFront.wall_2.length; i++ )
		{
			arrWallFront.wall_2[i].visible = true;
			for ( var i2 = 0; i2 < arrWallFront.wall_2[i].userData.wall.arrO.length; i2++ ) 
			{ 
				arrWallFront.wall_2[i].userData.wall.arrO[i2].visible = true; 
				if(arrWallFront.wall_2[i].userData.wall.arrO[i2].userData.door.popObj) { arrWallFront.wall_2[i].userData.wall.arrO[i2].userData.door.popObj.visible = true; }
			}				
		}
		
		
		var x1 = wall.userData.wall.p[1].position.z - wall.userData.wall.p[0].position.z;
		var z1 = wall.userData.wall.p[0].position.x - wall.userData.wall.p[1].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены			
		var c = (index == 1) ? -100 : 100;	
		var pc = new THREE.Vector3().subVectors( arrWallFront.bounds.max.x, arrWallFront.bounds.min.x ).divideScalar( 2 ).add( arrWallFront.bounds.min.x );
		
		cameraWall.position.copy( pc );
		cameraWall.position.add(new THREE.Vector3().addScaledVector( dir, c )); 
		cameraWall.position.y = (arrWallFront.bounds.max.y.y - arrWallFront.bounds.min.y.y)/2 + arrWallFront.bounds.min.y.y;
		
		
		var rotY = Math.atan2(dir.x, dir.z);
		rotY = (index == 1) ? rotY + Math.PI : rotY;
		cameraWall.rotation.set(0, rotY, 0); 
		
		detectZoomScreenWall();			// выставляем cameraWall, так чтобы обхватывала всю стену
		
		//wall.material[index].color = wall.userData.material[index].color;
		
		hideMenuObjUI_3D(wall);
		showHideObjCameraWall(wall);	// скрываем все объекты, которые не прилегают к выбранной стене
		
		getRotationHorVertCamWall(); 	// получаем rotation стены по горизонтали и вертикали 
		    
		showSizeFormat_3();			// показываем линейки/расстояния объектов находящихся на полу, друг от друга 
		
		showRuleCameraWall();		// показываем линейки/размеры высоты/ширины стены 
		cameraZoomWall();
		getTotalObjCameraWall();
	} 
	
	//camera3D.userData.camera = { type : 'fly', height : camera3D.position.y, startProject : true, last : { cam : null, pos : new THREE.Vector3(), rot : new THREE.Vector3() } };
	
	clickO = resetVarParam();
	
	if(camera == cameraTop) { sendMessage('EDITOR.CHANGE_VIEW', {view : '2d'}); }
	else if(camera == camera3D) { sendMessage('EDITOR.CHANGE_VIEW', {view : '3d'}); }
	else if(camera == cameraWall) { sendMessage('EDITOR.CHANGE_VIEW', {view : 'front'}); }
	
	renderCamera();
}


// выставляем zoom cameraWall, так чтобы обхватывала всю стену
function detectZoomScreenWall()  
{ 	
	cameraWall.zoom = 2;
	camera.updateMatrixWorld();
	camera.updateProjectionMatrix();
	
	var posX = { min : arrWallFront.bounds.min.x.clone(), max : arrWallFront.bounds.max.x.clone() };
	var posY = { min : arrWallFront.bounds.min.y.clone(), max : arrWallFront.bounds.max.y.clone() };
	
	posX.min.project(camera);
	posY.min.project(camera);	
	
	
	
	var x = 0.6/posX.min.x;
	var y = 0.6/posY.min.y;
	
	camera.zoom = (posX.min.x < posY.min.y) ? Math.abs(x) * 2 : Math.abs(y) * 2;    
	
	camera.updateMatrixWorld();
	camera.updateProjectionMatrix();

	zoom_binding = camera.zoom;
}




// показываем стены, которые были спрятаны
function showAllWallRender()
{		
	for ( var i = 0; i < wallVisible.length; i++ ) 
	{ 
		var wall = wallVisible[i].wall;
		if(wall.visible) { continue; }
		wall.visible = true;
		for ( var i2 = 0; i2 < wall.userData.wall.arrO.length; i2++ ) 
		{ 
			wall.userData.wall.arrO[i2].visible = true; 
			if(wall.userData.wall.arrO[i2].userData.door.popObj) wall.userData.wall.arrO[i2].userData.door.popObj.visible = true; 
		}			
	}
}



// меняем уровень отрисовки объектов 
function changeDepthColor()
{
	if(camera == cameraTop)
	{
		var depthTest = false;
		var w2 = 1;
		var visible = true;
	}
	else if(camera == camera3D)
	{
		var depthTest = true;
		var w2 = 0.0;
		var visible = false;
	}
	else { return; } 
	
	if(abo.point.click2D) { for ( var i = 0; i < obj_point.length; i++ ){ obj_point[i].visible = visible; } }
	else { for ( var i = 0; i < obj_point.length; i++ ){ obj_point[i].visible = false; } }
	
	for ( var i = 0; i < arr_window.length; i++ )
	{ 
		arr_window[ i ].material.depthTest = depthTest; 
		arr_window[ i ].material.transparent = depthTest; 
		arr_window[ i ].material.opacity = w2; 		 	
	}

	for ( var i = 0; i < arr_door.length; i++ )
	{ 		
		arr_door[ i ].material.depthTest = depthTest;
		arr_door[ i ].material.transparent = depthTest; 
		arr_door[ i ].material.opacity = w2;					
		
		//if(arr_door[ i ].userData.door.leaf_2D) { arr_door[ i ].userData.door.leaf_2D.visible = visible; } 
		
		if(visible == false) 
		{
			if(arr_door[i].userData.door.leaf_2D) 
			{ 
				arr_door[i].remove(arr_door[i].userData.door.leaf_2D);
			} 			
		}
		else
		{
			if(arr_door[i].userData.door.type != 'DoorEmpty')
			{
				createDoorLeaf(arr_door[i], arr_door[i].userData.door.open_type);
			}
		}		
	}
}


// скрываем ПОП объекты
function showHideArrObj(arr, visible)
{	
	if(arr.length == 0) return;
	
	for ( var i = 0; i < arr.length; i++ ) { arr[i].visible = visible; }				
}


// скрываем размеры стен и площадей помещений
function showHideSizePlane(cdm)
{
	var flag = (cdm == 'hide') ? false : true;

	for ( var i = 0; i < obj_line.length; i++ ){ obj_line[i].label[0].visible = flag; obj_line[i].label[1].visible = flag; }
	for ( var i = 0; i < room.length; i++ ){ room[i].label.visible = flag; }		
}


// собираем инфу, какие стены будем скрывать в 3D режиме
// опрееляем стена относится ко скольки зонам (0, 1, 2) 
// если 1 зона, то стена внешняя
function getInfoRenderWall()
{
	wallVisible = [];
	for ( var i = 0; i < obj_line.length; i++ )
	{	
		var room = detectCommonZone_1( obj_line[i] );
		if(room.length == 1) 
		{ 	
			var side = 0;
			for ( var i2 = 0; i2 < room[0].w.length; i2++ ) { if(room[0].w[i2] == obj_line[i]) { side = room[0].s[i2]; break; } }
			//var pos = new THREE.Vector3().subVectors( obj_line[i].p[1].position, obj_line[i].p[0].position ).divideScalar( 2 ).add(obj_line[i].p[0].position);

			if(side == 0) { var n1 = 0; var n2 = 1; }
			else { var n1 = 1; var n2 = 0; }
			
			var x1 = obj_line[i].userData.wall.p[n2].position.z - obj_line[i].userData.wall.p[n1].position.z;
			var z1 = obj_line[i].userData.wall.p[n1].position.x - obj_line[i].userData.wall.p[n2].position.x;	
			var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	
			
			wallVisible[wallVisible.length] = { wall : obj_line[i], normal : dir };  
		}
	}	
}



// скрываем все объекты, которые не прилегают к выбранной стене
function showHideObjCameraWall()
{
	arrWallFront.objPop = { obj_1 : [], obj_2 : [], arrPos : [], arrPos_2 : [] }; 
	
	for ( var i = 0; i < arr_obj.length; i++ ) 
	{ 
		var d = rayFurniture_2( arr_obj[i] );
		
		if(d < 0.15) { arrWallFront.objPop.obj_1[arrWallFront.objPop.obj_1.length] = arr_obj[i]; }
		else if(d > 0.15 && d < 0.5) { arrWallFront.objPop.obj_2[arrWallFront.objPop.obj_2.length] = arr_obj[i]; changeOpacityPOP(arr_obj[i], { transparent : true, opacity : 0.5 }); }
		else { arr_obj[i].visible = false; } 		
	}  	
}



// собираем в один массив все объекты/стены/двери/окна в один массив
function getTotalObjCameraWall()
{
	arrWallFront.total = [];
	
	for ( var i = 0; i < arrWallFront.wall.length; i++ )
	{
		arrWallFront.total[arrWallFront.total.length] = arrWallFront.wall[i].obj;
		
		for ( var i2 = 0; i2 < arrWallFront.wall[i].obj.userData.wall.arrO.length; i2++ ) 
		{ 
			arrWallFront.total[arrWallFront.total.length] = arrWallFront.wall[i].obj.userData.wall.arrO[i2];  
		}				
	}	
	
	for ( var i = 0; i < arrWallFront.objPop.obj_1.length; i++ )
	{
		arrWallFront.total[arrWallFront.total.length] = arrWallFront.objPop.obj_1[i];  
	}
	for ( var i = 0; i < arrWallFront.objPop.obj_2.length; i++ )
	{
		arrWallFront.total[arrWallFront.total.length] = arrWallFront.objPop.obj_2[i];   
	}	
}



// делаем прозрачным/непрозрачным POP объект
function changeOpacityPOP(obj, cdm) 
{
	for (var i = obj.children.length - 1; i >= 0; i--) 
	{
		var child = obj.children[i];		
	
		if(child.material)
		{ 
			child.material.transparent = cdm.transparent;  
			child.material.opacity = cdm.opacity;				
		}

		changeOpacityPOP(child, cdm);
	}
}
 

// пускаем луч и определяем объект принадлежит ли к выбранной стене
function rayFurniture_2( obj ) 
{	
	obj.updateMatrixWorld();
	obj.geometry.computeBoundingBox();
	obj.geometry.computeBoundingSphere();
	
	var dir = new THREE.Vector3();
	var dir = obj.getWorldDirection(dir);
	
	var cdm = null;
	var degreeRad = [0, Math.PI/2, -Math.PI/2, Math.PI];
	var col = [0xff0000, 0x1E90FF, 0x008000, 0x000000];	

	var min = obj.geometry.boundingBox.min.clone();
	var max = obj.geometry.boundingBox.max.clone();
	var c = obj.geometry.boundingSphere.center.clone();	
	var arrPos = [];
	arrPos[0] = obj.localToWorld( new THREE.Vector3(c.x, c.y, max.z - 0.05) );
	arrPos[1] = obj.localToWorld( new THREE.Vector3(min.x + 0.05, c.y, c.z) );
	arrPos[2] = obj.localToWorld( new THREE.Vector3(max.x - 0.05, c.y, c.z) ); 
	arrPos[3] = obj.localToWorld( new THREE.Vector3(c.x, c.y, min.z + 0.05) );
	
	
	var min = 999999;
	for ( var i = 0; i < degreeRad.length; i++ )
	{
		var dir2 = new THREE.Vector2(dir.x, dir.z).rotateAround(new THREE.Vector2(0, 0), degreeRad[i]);	
		dir2 = new THREE.Vector3(dir2.x, 0, dir2.y).normalize();	 
		
		var ray = new THREE.Raycaster();
		ray.set( arrPos[i], dir2 );  
		
		//scene.add(new THREE.ArrowHelper( ray.ray.direction, ray.ray.origin, 1, col[i] ));	 //помошник визуализации напрпавлений стрелок
		
		for ( var i2 = 0; i2 < arrWallFront.wall.length; i2++ )
		{
			var intersect = ray.intersectObject( arrWallFront.wall[i2].obj );	
			
			if (intersect.length == 0) 
			{	
				var stop = true;
				for ( var i3 = 0; i3 < arrWallFront.wall[i2].obj.userData.wall.arrO.length; i3++ )
				{
					var intersect = ray.intersectObject( arrWallFront.wall[i2].obj.userData.wall.arrO[i3] );
					
					if (intersect.length == 0) continue;
					
					stop = false;
					break;
				}
				if(stop) continue; 
			}			
			else if (intersect[0].face.materialIndex != arrWallFront.wall[i2].index) continue;

			var d = arrPos[i].distanceTo( intersect[0].point );
			
			if(min > d) { min = d; }	
		}
	}
	
	return min;
}



// переключение 3D камер в сохраненные места
function switchCamers3D( id )
{
	if(arrRenderCams.length == 0) return;
	if(!arrRenderCams[id]) return;
	
	camera3D.position.copy( arrRenderCams[id].posCam );  
	
	centerCam.position = new THREE.Vector3(arrRenderCams[id].posTarget.x, arrRenderCams[id].posTarget.y, arrRenderCams[id].posTarget.z);
	camera3D.lookAt( centerCam );	
	camera3D.rotation.z = 0;
			
			
	wallAfterRender_2();
	
	//console.log( $('[data-action="changeViewMode"]') ); 
	
	if(camera != camera3D) { UI.setView('3D'); }
	if(camera3D.userData.camera.type == 'first') { UI.changeViewMode( $('[data-action="changeViewMode"]') ); }	
}



function switchPanorama360(show)
{
	fileInfo.last.cam.obj = camera;
	fileInfo.last.cam.type = '';
	if(camera == camera3D) { fileInfo.last.cam.type = camera3D.userData.camera.type; }	
	
	if(show)
	{
		changeCamera(camera3D); 
		if(fileInfo.last.cam.obj == cameraTop) { fileInfo.last.cam.type = camera3D.userData.camera.type; }
		UI.setViewMode('man'); 
		UI.changeView('pano-render');
		
	}
	else
	{
		if(fileInfo.last.cam.obj == cameraTop)
		{
			changeCamera(cameraTop);
		}
	}
	
}




