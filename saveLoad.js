


function resetMenuUI()
{
	menuUI = { select: null, category : '' };
}



function loadUrl(href) 
{
	var url = new URL(href); 
	var url = url.searchParams.get('file');  
	if(url) { loadFile(url); }
}


function resetScene() 
{	
	hideGizmo();
	hideObjectControls();
	
	disposeHierchy(scene, disposeNode);
	
	for ( var i = 0; i < obj_line.length; i++ )
	{ 
		scene.remove(obj_line[i].label[0]); 
		scene.remove(obj_line[i].label[1]);
		if(obj_line[i].userData.wall.outline) { deleteOutline(); }
		scene.remove(obj_line[i]); 
	}
	for ( var i = 0; i < obj_point.length; i++ ){ scene.remove(obj_point[i]); }	
	for ( var i = 0; i < arr_window.length; i++ ){ scene.remove(arr_window[i]); }
	for ( var i = 0; i < arr_door.length; i++ ){ scene.remove(arr_door[i]); }	
	for ( var i = 0; i < arr_obj.length; i++ ) { scene.remove(arr_obj[i]); }
	
	for ( var i = 0; i < room.length; i++ )
	{
		if(room[i].userData.room.plinth.o) { for ( var i2 = 0; i2 < room[i].userData.room.plinth.obj.length; i2++ ) { scene.remove(room[i].userData.room.plinth.obj[i2]); } }
		
		scene.remove(room[i].label); 
		if(room[i].userData.room.outline) { deleteOutline(); }
		scene.remove(room[i]); 
		scene.remove( ceiling[i] );	
	}	
	
	hideRuleCameraWall();
	
	wallVisible = [];
	obj_point = [];
	obj_line = [];
	arr_window = [];
	arr_door = [];
	arr_obj = [];
	room = [];
	ceiling = [];
	arrWallFront = {};
	
	param_usU = [];
	param_usR = [];
	leng_ur = -1;
	ndsf = 1;
	countId = 2;
	levelFloor = 1;
	projName = 'Новый проект';
	projVersion = '1';
	
	d_tool.visible = false;
	
	pointGrid.visible = true;
	
	resetMenuUI();
	
	camera3D.userData.camera = { type : 'fly', height : camera3D.position.y, startProject : true, rot360 : { start : false, angle : 0, qEnd : null } }; 
	
	clickO = resetVarParam(); 
	
	fileInfo = { last : {cam : { obj : camera, type : '', pos : new THREE.Vector3(), rot : new THREE.Vector3() }} }; 
	
	if(typeUI == 'planoplan') { UIInvokeFunction('SetCameraZoom', ratioDifferenceNumber({ x1: 0.5, x2: 20, y1: 1, y2: 0, t : camera.zoom}) ); }
	
	getConsoleRendererInfo()
}








// удалем из GPU объекты
function disposeHierchy(node, callback) 
{
	for (var i = node.children.length - 1; i >= 0; i--) 
	{
		if(node.children[i].userData.tag)
		{
			var tag = node.children[i].userData.tag;
			
			if(tag == 'point' || tag == 'wall' || tag == 'window' || tag == 'door' || tag == 'room' || tag == 'ceiling' || tag == 'obj')
			{
				var child = node.children[i];

				disposeHierchy(child, callback);
				callback(child);			
			}			
		}			
	}
}


function disposeNode(node) 
{
        if (node instanceof THREE.Mesh) 
		{
            if (node.geometry) { node.geometry.dispose(); }
			
            if (node.material) 
			{
                var materialArray;
                if (node.material instanceof THREE.MeshFaceMaterial || node.material instanceof THREE.MultiMaterial) 
				{
                    materialArray = node.material.materials;
                }
                else if(node.material instanceof Array) 
				{
                    materialArray = node.material;
                }
                
				if(materialArray) 
				{
                    materialArray.forEach(function (mtrl, idx) 
					{
                        if (mtrl.map) mtrl.map.dispose();
                        if (mtrl.lightMap) mtrl.lightMap.dispose();
                        if (mtrl.bumpMap) mtrl.bumpMap.dispose();
                        if (mtrl.normalMap) mtrl.normalMap.dispose();
                        if (mtrl.specularMap) mtrl.specularMap.dispose();
                        if (mtrl.envMap) mtrl.envMap.dispose();
                        mtrl.dispose();
                    });
                }
                else 
				{
                    if (node.material.map) node.material.map.dispose();
                    if (node.material.lightMap) node.material.lightMap.dispose();
                    if (node.material.bumpMap) node.material.bumpMap.dispose();
                    if (node.material.normalMap) node.material.normalMap.dispose();
                    if (node.material.specularMap) node.material.specularMap.dispose();
                    if (node.material.envMap) node.material.envMap.dispose();
                    node.material.dispose();
                }
            }
        }
}






function getJsonGeometry()
{
	var json = 
	{
		floors : 
		[
			{ 
				points : [],
				walls : [],	
				furn : [],
				rooms : [],
				height : height_wall,
				levelFloor : 1,
				projName : 'Новый проект',
				version : '1'
			}			
		]
	};	
	
	if(!Array.isArray(levelFloor)) { json.floors[0].levelFloor = levelFloor; }
	if(!Array.isArray(projName)) { json.floors[0].projName = projName; }
	if(!Array.isArray(projVersion)) { json.floors[0].version = projVersion; } 
	if(!Array.isArray(height_wall)) { json.floors[0].height_wall = height_wall; }
	
	var points = [];
	var walls = [];
	var rooms = [];
	var furn = [];
	
	for ( var i = 0; i < obj_line.length; i++ )
	{	
		var wall = obj_line[i];
		
		var p = wall.userData.wall.p;
		
		for ( var i2 = 0; i2 < p.length; i2++ )  
		{
			var flag = true;
			for ( var i3 = 0; i3 < points.length; i3++ ) { if(p[i2].userData.id == points[i3].id){ flag = false; break; } }
			
			if(flag) 
			{  
				var m = points.length;
				points[m] = {};
				points[m].id = p[i2].userData.id;
				points[m].pos = new THREE.Vector3(p[i2].position.x, p[i2].position.y, -p[i2].position.z); 
			}
		}
	}	
	
	
	
	for ( var i = 0; i < obj_line.length; i++ )
	{ 
		var p = obj_line[i].userData.wall.p;
		
		walls[i] = { }; 
		
		walls[i].id = obj_line[i].userData.id;
		walls[i].pointStart = p[0].userData.id;
		walls[i].pointEnd = p[1].userData.id;
		walls[i].width = obj_line[i].userData.wall.width; 
		walls[i].height = obj_line[i].userData.wall.height_1; 


		var x1 = p[1].position.z - p[0].position.z;
		var z1 = p[0].position.x - p[1].position.x;	
		var dir = new THREE.Vector3(z1, 0, -x1).normalize();						// перпендикуляр стены  (перевернуты x и y)
		dir.multiplyScalar( obj_line[i].userData.wall.offsetZ );
		walls[i].startShift = new THREE.Vector3(dir.z, 0, dir.x);
				
		var wd = saveWindows(obj_line[i]);		
		walls[i].windows = wd.windows;
		walls[i].doors = wd.doors;
		

		walls[i].colors = [];
		var mat = obj_line[i].userData.material;
		var arr = [{containerID : 'wall3d_'+obj_line[i].userData.id+'_p2', num : 1}, {containerID : 'wall3d_'+obj_line[i].userData.id+'_p1', num : 2}];				
		
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			walls[i].colors[i2] = {  };		
			walls[i].colors[i2].containerID = arr[i2].containerID;
			walls[i].colors[i2].lot = { id : mat[arr[i2].num].lotid };

			var color = { r : Number(mat[arr[i2].num].color.r), g : Number(mat[arr[i2].num].color.g), b : Number(mat[arr[i2].num].color.b), a : 1 };
			
			walls[i].colors[i2].matMod = { colorsets : [{ color : color }] };

			walls[i].colors[i2].matMod.texScal = mat[arr[i2].num].scale;
			
			walls[i].colors[i2].matMod.mapingRotate = 0; 
			
			var map = obj_line[i].material[arr[i2].num].map;
			if(map) 
			{
				walls[i].colors[i2].matMod.texOffset = getOffsetTexture({ obj : obj_line[i], index : i2 + 1 });
				walls[i].colors[i2].matMod.mapingRotate = (arr[i2].num == 1) ? THREE.Math.radToDeg( map.rotation ) * -1 : THREE.Math.radToDeg( map.rotation ); 				 
			}
		}		
	}	


	for ( var i = 0; i < room.length; i++ )
	{
		rooms[i] = { pointid : [] };
		
		rooms[i].id = room[i].userData.id;  
		rooms[i].name = 'Room';
		rooms[i].roomSType = detectNameRoom('textToId', room[i].userData.room.roomType);		
		
		rooms[i].pointid = [];
		var s = 0; for ( var i2 = room[i].p.length - 1; i2 >= 1; i2-- ) { rooms[i].pointid[s] = room[i].p[i2].userData.id; s++; }
		
		if(room[i].userData.room.plinth.o) { rooms[i].plinthLot = { id : room[i].userData.room.plinth.lotid }; }    
		
		
		rooms[i].colors = [];
		var arr = [{containerID : 'floor', obj : room[i]}, {containerID : 'ceil', obj : ceiling[i]}];				
		
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			rooms[i].colors[i2] = {  };		
			rooms[i].colors[i2].containerID = arr[i2].containerID;
			rooms[i].colors[i2].lot = { id : arr[i2].obj.userData.material.lotid };

			var color = { r : Number(arr[i2].obj.material.color.r), g : Number(arr[i2].obj.material.color.g), b : Number(arr[i2].obj.material.color.b), a : 1 };
			
			rooms[i].colors[i2].matMod = { colorsets : [{ color : color }] };

			rooms[i].colors[i2].matMod.texScal = arr[i2].obj.userData.material.scale;

			rooms[i].colors[i2].matMod.mapingRotate = 0; 
			
			var map = arr[i2].obj.material.map;
			if(map) 
			{
				rooms[i].colors[i2].matMod.texOffset = getOffsetTexture({ obj : room[i] });  
				rooms[i].colors[i2].matMod.mapingRotate = THREE.Math.radToDeg( map.rotation ); 
			}			
		}	
	}
	
	
	furn = jsonSaveObjPop();
	
	
	json.floors[0].points = points;
	json.floors[0].walls = walls;
	json.floors[0].rooms = rooms;
	json.floors[0].furn = furn;
	
	return json;
}



// сохраняем окна/двери
function saveWindows(wall)
{
	var windows = [], doors = [];
	
	var arrO = wall.userData.wall.arrO;

	var o = [[], []];

	for ( var i2 = 0; i2 < arrO.length; i2++ ) 
	{
		if(arrO[i2].userData.tag == 'window') { o[0][o[0].length] = arrO[i2]; }
		else if(arrO[i2].userData.tag == 'door') { o[1][o[1].length] = arrO[i2]; }		
	}

	var p = wall.userData.wall.p;

	for ( var i = 0; i < o.length; i++ )
	{
		for ( var i2 = 0; i2 < o[i].length; i2++ )
		{ 
			var wd = o[i][i2];
			var v = wd.geometry.vertices;
			var f = wd.userData.door.form.v;
		
			var v7 = new THREE.Vector3().subVectors( v[f.maxX[0]], v[f.minX[0]] ).divideScalar ( 2 );		
			var v7 = wd.localToWorld( v[f.minX[0]].clone().add(v7) );
			var dir1 = new THREE.Vector3().subVectors( p[1].position, p[0].position ).normalize();
			var dir2 = new THREE.Vector3().subVectors( v7, p[0].position );
			qt1 = quaternionDirection(dir1);
			var x = localTransformPoint(dir2, qt1).z; 
			x = x / p[1].position.distanceTo( p[0].position );
			
			var y = wall.worldToLocal( wd.localToWorld(v[f.minY[0]].clone()) ).y;

			var arr = {};
			
			arr.id = wd.userData.id;	// id
			arr.lotid  = wd.userData.door.lotid;		// lotid  
			arr.width = Math.round((v[f.maxX[0]].x - v[f.minX[0]].x) * 100) / 100;	// width
			arr.height = Math.round((v[f.maxY[0]].y - v[f.minY[0]].y) * 100) / 100;	// height		
			arr.startPointDist = Math.round(x * 100) / 100;				// pos_start
			arr.over_floor = Math.round(y * 100) / 100;				// over_floor
			if(wd.userData.door.open_type) { arr.open_type = wd.userData.door.open_type; }	// open_type	
			if(wd.userData.tag == 'door') { arr.doState = 'false'; }							// doState	
			arr.options = '';
			
			if(wd.userData.door.type == 'DoorPattern')
			{
				var handle = wd.userData.door.compilation.handle[0];
				
				if(handle) arr.options = 's_re' + handle.userData.dumName + ':' + handle.userData.lotid;							
			}
			
			if(wd.userData.tag == 'window') { windows[windows.length] = arr; }
			else if(wd.userData.tag == 'door') { doors[doors.length] = arr; }			
		}		
	}

	return { windows : windows, doors : doors };
}





function jsonSaveObjPop() 
{
	var furn = [];
	
	for ( var i = 0; i < arr_obj.length; i++ )
	{
		var objPop = arr_obj[i];
		
		furn[i] = { id : 0, lotid : 0, pos : '', rot : '', size : '', material : [] }; 
		furn[i].id = objPop.userData.id;  
		furn[i].lotid = objPop.userData.obj3D.lotid;
		
		furn[i].pos = new THREE.Vector3( objPop.position.x, objPop.position.y, -objPop.position.z );
		
		if(objPop.children[0].userData.version == "2.0")
		{
			furn[i].rot = new THREE.Vector3( THREE.Math.radToDeg(objPop.rotation.x), THREE.Math.radToDeg(-objPop.rotation.y), THREE.Math.radToDeg(objPop.rotation.z) );
		}
		else
		{
			furn[i].rot = new THREE.Vector3( THREE.Math.radToDeg(objPop.rotation.x - Math.PI), THREE.Math.radToDeg(objPop.rotation.y), THREE.Math.radToDeg(objPop.rotation.z - Math.PI) );
		}
				
		furn[i].size = objPop.userData.obj3D.size; 
		
		
		furn[i].colors = [];		   
		var arr = getAllChildrenObj(objPop.children[0], []);
		
		for ( var i2 = 0; i2 < arr.length; i2++ )  
		{
			var child = arr[i2].obj;
			
			if(!child.userData.material) continue;

			furn[i].colors[i2] = {  };		
			furn[i].colors[i2].containerID = (!child.userData.material.containerID) ? '---' : child.userData.material.containerID;
			furn[i].colors[i2].lot = (!isNumeric(child.userData.material.lotid)) ? { id : "default" } : { id : child.userData.material.lotid };

			var color = { r : 1, g : 1, b : 1, a : 1 };
			
			if(arr[i2].obj.material.color)
			{
				color = { r : Number(arr[i2].obj.material.color.r), g : Number(arr[i2].obj.material.color.g), b : Number(arr[i2].obj.material.color.b), a : 1 };
			}
			
			furn[i].colors[i2].matMod = { colorsets : [{ color : color }] };
			furn[i].colors[i2].matMod.texScal = new THREE.Vector2(1,1);
			furn[i].colors[i2].matMod.mapingRotate = 0; 
			
			var map = arr[i2].obj.material.map;
			if(map) 
			{
				furn[i].colors[i2].matMod.texScal = arr[i2].obj.userData.material.scale;
				//furn[i].colors[i2].matMod.texOffset = getOffsetTexture({ obj : room[i] });  
				furn[i].colors[i2].matMod.mapingRotate = THREE.Math.radToDeg( map.rotation ); 
			}			
		}		
	}

	return furn;
}




function saveFile(cdm) 
{ 
	UI.showAlert('Сохранение проекта', '');            
	
	var json = getJsonGeometry();  	 
	cdm.jsonFile = JSON.stringify( json.floors[0] );
	
	var hostname = window.location.hostname;
	
	if(hostname == 'planoplan.com' && !cdm.about_standalone)
	{
		var url = new URL(window.parent.location.href);
		var id = url.searchParams.get('id'); 	
		
		$.ajax 
		({		
			url: window.location.protocol + '//' + window.location.hostname + '/api/getWebglEditorData/?id=' + id,
			type: 'POST',
			dataType: 'json',
			success: function(json){ saveFile_2(cdm); },
			error: function(json){ UI.showAlert('Ошибка сохранения', 'warning'); sendMessage('EDITOR.ERROR', {code: 404}) }
		});				
	}
	else
	{
		saveFile_2(cdm);  
	}
	
	saveFileJson(JSON.stringify(json));		
}



function saveFile_2(cdm)
{
	$.ajax
	({
		url: 'convertXml.php',
		type: 'POST',
		data: {myarray: cdm.jsonFile, url: param_ugol.file},
		dataType: 'json',
		success: function(json)
		{ 			
			cdm.xml = json;
			cdm.estimate = createEstimateJson();
			
			setLinkSave(cdm);
			sendMessage('EDITOR.PROJECT_SAVED'); 
		},
		error: function(json){ console.log(json); UI.showAlert('Ошибка сохранения', 'warning'); }
	});		
}



function saveFileJson(json)
{
	
	$.ajax
	({
		url: 'saveJson.php',
		type: 'POST',
		data: {myarray: json},
		dataType: 'json',
		success: function(json)
		{ 			
			console.log(json); 
		},
		error: function(json){ console.log(json);  }
	});		
}


// отправляем на сервер и сохраняем
function setLinkSave(cdm, project, estimate) 
{ 
	var project = cdm.xml;
	var estimate = cdm.estimate;
	var hostname = window.location.hostname; 
	
	if(hostname == 'planoplan.com') 
	{ 
		var url = window.location.protocol + '//' + window.location.hostname + '/projects/save/'; 
	}
	else if(hostname == 'ugol.planoplan.com' || hostname == 'pp.ksdev.ru') 
	{ 
		project[0] = param_ugol.hash;
		var url = param_ugol.link_save; 
	}	

	var boundary = "a1JzeySHGcJt5Ggc01sCIxEL9XRGwzaI9a1jjdWM";
	
	var str = '';
	
	if(cdm.about_standalone)
	{
		str += '--' + boundary + '\r\n'
		+ 'Content-Type: text/plain; charset="utf-8"\r\n'
		+ 'Content-Disposition: form-data; name="about_standalone"\r\n\r\n'
		+ '1' + '\r\n';
		project[0] = '';	 				
	}

	if(param_ugol.version == 'planoplan')
	{
		str += '--' + boundary + '\r\n'
		+ 'Content-Type: image/jpeg; charset="utf-8"\r\n'
		+ 'Content-Disposition: form-data; name="thumb"; filename="thumb.jpg"\r\n\r\n'
		+ saveAsImage({binary:true}) + '\r\n';		
	}
	 	
	var body = '--' + boundary + '\r\n'
			+ 'Content-Type: text/plain; charset="utf-8"\r\n'
			+ 'Content-Disposition: form-data; name="id"\r\n\r\n'
			+ project[0] + '\r\n'
			
			+ '--' + boundary + '\r\n'
			+ 'Content-Type: text/plain; charset="utf-8"\r\n'
			+ 'Content-Disposition: form-data; name="name"\r\n\r\n'
			+ 'My project' + '\r\n'			
			
			+ str
			 
			+ '--' + boundary + '\r\n'
			+ 'Content-Type: application/octet-stream\r\n'
			+ 'Content-disposition: form-data; name="file"; filename="file.dat"\r\n\r\n'
			+ project[1] + '\r\n'
			  
			+ '--' + boundary + '\r\n'
			+ 'Content-Type: text/plain; charset="utf-8"\r\n'
			+ 'Content-Disposition: form-data; name="checksum"\r\n\r\n'
			+ project[2] + '\r\n'

			+ '--' + boundary + '\r\n'
			+ 'Content-Type: text/plain; charset="utf-8"\r\n'
			+ 'Content-Disposition: form-data; name="estimate"\r\n\r\n'
			+ estimate.estimate + '\r\n'

			+ '--' + boundary + '\r\n'
			+ 'Content-Type: text/plain; charset="utf-8"\r\n'
			+ 'Content-Disposition: form-data; name="noTask"\r\n\r\n'
			+ estimate.noTask + '\r\n'
			+ '--'+ boundary + '--'			  
			 ;
	
	$.ajax
	({		
		url: url,
		contentType: "multipart/form-data; boundary="+boundary,
		type: 'POST',
		data: body,
		dataType: 'json',
		success: function(json, status)
		{ 
			emitAction('save-project-result', {status: status, data: json}); 
			console.log(json);  
			UI.showAlert('Проект сохранен', 'success'); 
			
			if(param_ugol.version == 'planoplan')
			{
				if (json.success) {
					UIInvokeFunction('ProjectSaveSuccess'); 
				} else {
					UIInvokeFunction('ProjectSaveError', json.errorText); 
				}				
			}
			
			if(cdm == 'render' || cdm == 'vr-panorama') { getRender(UI.renderMode); UI.changeView('3D'); }
		},
		error: function(error){ UIInvokeFunction('ProjectSaveError', error); }		
	});	
}






function loadFile(file) 
{
	loader.show('Загрузка проекта');

	$.ajax
	({
		url: 'convertArr.php',
		type: 'POST',
		data: { file: file },
		dataType: 'json',
		success: function(json){ loadTotalLotid(json); loader.hide(); },
		error: function(json) { loader.hide(); UI.showAlert('Ошибка загрузки', 'warning'); }
	});	
}


function loadTotalLotid(arr)
{
	resetScene();	
			
	UI.setView('2D');	// переключаемся в 2D
	
	if(arr.code_server == 'new project')  
	{  
		emitAction('load-project-start');
		emitAction('load-project-end');
		emitAction('stop-fake-loading');
		console.log('server : ' + arr.code_server); 
		return; 
	}	
	else if(arr.code_server != 200) 
	{  
		emitAction('load_error', { code: arr['code_server'] }); 
		console.log('server : ' + arr['code_server']); 
		return; 
	}

	emitAction('load-project-start'); 	// событие, запуск загрузки проекта
	
	var wall = createWallsNewFile(arr);
	
	var walls = arr.floors[0].walls;
	var rooms = arr.floors[0].rooms;
	var obj_pop = arr.floors[0].furn;	
	
	// собираем ПОП из файла в один массив
	var arrPop = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{		
		for ( var i2 = 0; i2 < walls[i].colors.length; i2++ )
		{
			if(walls[i].colors[i2].lot)
			{
				if(isNumeric(walls[i].colors[i2].lot.id)) arrPop[arrPop.length] = walls[i].colors[i2].lot.id;
			}
		}
	}

	for ( var i = 0; i < walls.length; i++ )
	{		
		if(walls[i].doors) for ( var i2 = 0; i2 < walls[i].doors.length; i2++ ) { if(isNumeric(walls[i].doors[i2].lotid)) arrPop[arrPop.length] = walls[i].doors[i2].lotid; }
		if(walls[i].windows) for ( var i2 = 0; i2 < walls[i].windows.length; i2++ ) { if(isNumeric(walls[i].windows[i2].lotid)) arrPop[arrPop.length] = walls[i].windows[i2].lotid; }
	}	
	
	for ( var i = 0; i < rooms.length; i++ )
	{		
		for ( var i2 = 0; i2 < rooms[i].colors.length; i2++ ) 
		{ 
			if(!rooms[i].colors[i2].lotid) { continue; }
			if(isNumeric(rooms[i].colors[i2].lotid)) { arrPop[arrPop.length] = rooms[i].colors[i2].lotid; }
		}			
		if(rooms[i].plinthLot) { if(isNumeric(rooms[i].plinthLot.id)) arrPop[arrPop.length] = rooms[i].plinthLot.id; }
		if(rooms[i].plinthCeilLot) { if(isNumeric(rooms[i].plinthCeilLot.id)) arrPop[arrPop.length] = rooms[i].plinthCeilLot.id; }		
	}
		
	
	for ( var i = 0; i < obj_pop.length; i++ ) { arrPop[arrPop.length] = obj_pop[i].lotid; }
	
	for ( var i = 0; i < arrPop.length; i++ ) { arrPop[i] = Number(arrPop[i]); }
	
	arrPop = [...new Set(arrPop)];	// удаляем из массива повторяющиеся элементы
	
	
	if(arrPop.length < 345)
	{
		addJsonPopBase_1({ arrLotid : arrPop, mess : 'loadXML', jsonXML : arr, wall : wall });	
	}
	else
	{
		var arrPop_2 = [];
		
		var n = 0;
		
		for ( var i = 0; i < Math.round(arrPop.length/345); i++ ) 
		{ 
			arrPop_2[i] = []; 
			
			
			var limit = 345;
			
			for ( var i2 = n; i2 < arrPop.length; i2++ )
			{
				arrPop_2[i][i2] = arrPop[i2];
				n++;
				limit++;
				
				if(limit > 345) break;
			}
		}
		
		for ( var i = arrPop_2.length - 1; i >= 0; i-- )
		{
			if(i == 0) { addJsonPopBase_1({ arrLotid : arrPop_2[i], mess : 'loadXML', jsonXML : arr, wall : wall }); }
			else { addJsonPopBase_1({ arrLotid : arrPop_2[i] }); }	
		}
	}		
}



function createWallsNewFile(arr)
{
	if(!arr) return;
	
	levelFloor = (arr.floors[0].id) ? arr.floors[0].id : 1;
	height_wall = arr.floors[0].height;
	projName = arr.floors[0].name;
	projVersion = arr.version;
		
	var point = arr.floors[0].points;
	var walls = arr.floors[0].walls;
	var rooms = arr.floors[0].rooms;
	var obj_pop = arr.floors[0].furn;
	
	
	height_wall = Math.round(height_wall * 100) / 100;
	if(height_wall < 0.1) { height_wall = 3; }	
	
	
	changeMenuHeightWall(); 
			
	var wall = [];
	
	for ( var i = 0; i < walls.length; i++ )
	{
		wall[i] = { };
		
		
		wall[i].id = walls[i].id;		
		wall[i].width = walls[i].width;
		wall[i].offsetV = new THREE.Vector3(walls[i].startShift.z, 0, walls[i].startShift.x);   		
		wall[i].height = walls[i].height;			
		
		wall[i].points = [];
		wall[i].points[0] = { id : walls[i].pointStart, pos : new THREE.Vector3() };
		wall[i].points[1] = { id : walls[i].pointEnd, pos : new THREE.Vector3() };
								
		for ( var i2 = 0; i2 < point.length; i2++ ) 			 
		{  	
			if(wall[i].points[0].id == point[i2].id) { wall[i].points[0].pos = new THREE.Vector3(point[i2].pos.x, 0, -point[i2].pos.z); }
			if(wall[i].points[1].id == point[i2].id) { wall[i].points[1].pos = new THREE.Vector3(point[i2].pos.x, 0, -point[i2].pos.z); }
		}
		
		
		wall[i].material = [];
		wall[i].material[0] = { lotid : 4954, color : {r : 93, g : 87, b : 83 }, scale : new THREE.Vector2(1,1) };
		wall[i].material[1] = { lotid : 4954, color : {r : 93, g : 87, b : 83 }, scale : new THREE.Vector2(1,1) };
		
		for ( var i2 = 0; i2 < walls[i].colors.length; i2++ )
		{			
			var n = ('wall3d_' + wall[i].id + '_p2' == walls[i].colors[i2].containerID) ? 0 : 1; 
			
			if(walls[i].colors[i2].lot)
			{
				if(isNumeric(walls[i].colors[i2].lot.id))
				{
					wall[i].material[n].lotid = walls[i].colors[i2].lot.id;
				}					
			}
			
			if(walls[i].colors[i2].matMod)
			{
				if(walls[i].colors[i2].matMod.colorsets[0].color)
				{
					var color = walls[i].colors[i2].matMod.colorsets[0].color;
					color.r = Math.round(color.r * 100);
					color.g = Math.round(color.g * 100);
					color.b = Math.round(color.b * 100);

					wall[i].material[n].color = color;
				}

				if(walls[i].colors[i2].matMod.texScal)
				{
					wall[i].material[n].scale = new THREE.Vector2( walls[i].colors[i2].matMod.texScal.x, walls[i].colors[i2].matMod.texScal.y );
				}
				

				if(walls[i].colors[i2].matMod.texOffset) 
				{
					wall[i].material[n].offset = new THREE.Vector2( walls[i].colors[i2].matMod.texOffset.x, walls[i].colors[i2].matMod.texOffset.y );
				}					
				
				if(walls[i].colors[i2].matMod.mapingRotate) 
				{
					wall[i].material[n].rotation = THREE.Math.degToRad( walls[i].colors[i2].matMod.mapingRotate ); 
				}				
			}			
		}

		var arrO = [];
		
		if(walls[i].doors) for ( var i2 = 0; i2 < walls[i].doors.length; i2++ ) { arrO[arrO.length] = walls[i].doors[i2]; arrO[arrO.length - 1].type = 'door'; }
		if(walls[i].windows) for ( var i2 = 0; i2 < walls[i].windows.length; i2++ ) { arrO[arrO.length] = walls[i].windows[i2]; arrO[arrO.length - 1].type = 'window'; }
		
		wall[i].arrO = [];
		
		for ( var i2 = 0; i2 < arrO.length; i2++ )
		{					
			wall[i].arrO[i2] = {  }
			
			wall[i].arrO[i2].id = arrO[i2].id;
			wall[i].arrO[i2].lotid = arrO[i2].lotid;
			wall[i].arrO[i2].pos = new THREE.Vector3(Math.round(arrO[i2].startPointDist * 100) / 100, Math.round(arrO[i2].over_floor * 100) / 100, 0);
			wall[i].arrO[i2].size = new THREE.Vector2(Math.round(arrO[i2].width * 100) / 100, Math.round(arrO[i2].height * 100) / 100);
			if(arrO[i2].open_type) { wall[i].arrO[i2].open = arrO[i2].open_type; }
			wall[i].arrO[i2].type = arrO[i2].type;
			
			if(arrO[i2].options){ wall[i].arrO[i2].options = arrO[i2].options; }
		}		
				
	}
	


	//-------------
	 
	// удаляем стены, которые пересекаются с друг другом (стена в стене)
	for ( var i = wall.length - 1; i >= 0; i-- )
	{
		for ( var i2 = 0; i2 < wall.length; i2++ )
		{
			if(wall[i] == wall[i2]) continue;			
			
			var count = 0;
			var pos1 = [];
			var pos2 = [];
			if(wall[i].points[0].id == wall[i2].points[0].id) { count++; pos1 = [wall[i].points[0].pos, wall[i].points[1].pos]; pos2 = [wall[i2].points[0].pos, wall[i2].points[1].pos]; }
			if(wall[i].points[0].id == wall[i2].points[1].id) { count++; pos1 = [wall[i].points[0].pos, wall[i].points[1].pos]; pos2 = [wall[i2].points[1].pos, wall[i2].points[0].pos]; }
			if(wall[i].points[1].id == wall[i2].points[0].id) { count++; pos1 = [wall[i].points[1].pos, wall[i].points[0].pos]; pos2 = [wall[i2].points[0].pos, wall[i2].points[1].pos]; }
			if(wall[i].points[1].id == wall[i2].points[1].id) { count++; pos1 = [wall[i].points[1].pos, wall[i].points[0].pos]; pos2 = [wall[i2].points[1].pos, wall[i2].points[0].pos]; }
			
			if(count == 2) { wall.splice(i, 1); }
			else if(count == 1)
			{
				var dir1 = new THREE.Vector3().subVectors( pos1[0], pos1[1] ).normalize();
				var dir2 = new THREE.Vector3().subVectors( pos2[0], pos2[1] ).normalize();
				
				if(!comparePos(dir1, dir2)) { continue; }
				
				var d1 = pos1[0].distanceTo( pos1[1] );
				var d2 = pos2[0].distanceTo( pos2[1] );
				
				if(d1 > d2) { wall.splice(i, 1); } 
			}
		}
	}
	
	// создаем и устанавливаем все стены (без окон/дверей)
	var arrW = [];
	
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var point1 = findObjFromId( 'point', wall[i].points[0].id );
		var point2 = findObjFromId( 'point', wall[i].points[1].id );	
		
		if(point1 == null) { point1 = createPoint( wall[i].points[0].pos, wall[i].points[0].id ); }
		if(point2 == null) { point2 = createPoint( wall[i].points[1].pos, wall[i].points[1].id ); }
	

		var dir = new THREE.Vector3().subVectors( point2.position, point1.position ).normalize();
		var offsetZ = localTransformPoint(wall[i].offsetV, quaternionDirection(dir)).z;
		var inf = { id : wall[i].id, offsetZ : -offsetZ, height : wall[i].height, material : wall[i].material };
		var obj = createOneWall3( point1, point2, wall[i].width, inf ); 		
		
		obj.updateMatrixWorld();
		arrW[arrW.length] = obj;
	}	
	 
	//for ( var i = 0; i < obj_point.length; i++ ) { upLineYY(obj_point[i]); }
	for ( var i = 0; i < obj_point.length; i++ ) { upLineYY_2(obj_point[i], obj_point[i].p, obj_point[i].w, obj_point[i].start); }
	for ( var i = 0; i < obj_line.length; i++ ) { upUvs_1( obj_line[i] ); }
	
	upLabelPlan_1(obj_line);	// размеры стен
	// создаем и устанавливаем все стены (без окон/дверей)
	
	
	// восстанавливаем пол
	if(1==2)	// старый вариант, где пол строился по точкам из файла
	{
		for ( var i = 0; i < rooms.length; i++ ) 
		{
			var p = [];		
			for ( var i2 = 0; i2 < rooms[i].pointid.length; i2++ ){ p[i2] = rooms[i].pointid[i2]; } 
			p[p.length] = rooms[i].pointid[0];

			var points = [];				
			for ( var i2 = p.length - 1; i2 >= 0; i2-- ) { points[points.length] = findObjFromId( 'point', p[i2] ); }
			
			var material = [];
			for ( var i2 = 0; i2 < rooms[i].colors.length; i2++ )	
			{
				material[i2] = {};
				material[i2].containerID = rooms[i].colors[i2].containerID;
				
				if(!rooms[i].colors[i2].lot)
				{
					if(material[i2].containerID == 'floor') { rooms[i].colors[i2].lot = { id : 4956 }; }
					if(material[i2].containerID == 'ceil') { rooms[i].colors[i2].lot = { id : 4957 }; }
				}
				
				if(rooms[i].colors[i2].lot.id)
				{
					if(isNumeric(rooms[i].colors[i2].lot.id))
					{
						material[i2].lotid = rooms[i].colors[i2].lot.id;
					}				
				}
				
				if(rooms[i].colors[i2].matMod)
				{
					if(rooms[i].colors[i2].matMod.colorsets[0].color)
					{
						var color = rooms[i].colors[i2].matMod.colorsets[0].color;
						color.r = Math.round(color.r * 100);
						color.g = Math.round(color.g * 100);
						color.b = Math.round(color.b * 100);
						
						material[i2].color = color;					
					}
					
					if(rooms[i].colors[i2].matMod.texScal)
					{
						material[i2].scale = new THREE.Vector2( rooms[i].colors[i2].matMod.texScal.x, rooms[i].colors[i2].matMod.texScal.y );
					}				
				}				
				
			}
		 
			var plinth = [{o : false, lotid : 0}, {o : false, lotid : 0}];
			
			if(rooms[i].plinthLot) { plinth[0].o = true; plinth[0].lotid = rooms[i].plinthLot.id; }
			if(rooms[i].plinthCeilLot) { plinth[1].o = true; plinth[1].lotid = rooms[i].plinthCeilLot.id; }
			
			
			// если не смогли загрузить плинтус, то очищаем его значения
			var flag = true;
			for ( var i2 = 0; i2 < pool_pop.length; i2++ ) { if(pool_pop[i2].id == plinth[0].lotid) { if(!pool_pop[i2].empty) { flag = false; break; } } } 
			if(flag) { plinth[0] = {o : false, lotid : 0}; }
			
			var flag = true;
			for ( var i2 = 0; i2 < pool_pop.length; i2++ ) { if(pool_pop[i2].id == plinth[1].lotid) { if(!pool_pop[i2].empty) { flag = false; break; } } } 
			if(flag) { plinth[1] = {o : false, lotid : 0}; }		
			 
			var zp = compileArrPointRoom_1(points);	
			createFloor(points, zp[0], zp[1], rooms[i].id, detectNameRoom('idToText', rooms[i].roomSType), material, plinth);	  		 	
		}				
	}
	
	detectRoomZone(nameRoomDef);
	
	// новый вариант, пол считается из планировки, а затем ищутся одинаковые зоны из файла 
	for ( var n = 0; n < room.length; n++ )
	{
		for ( var i = 0; i < rooms.length; i++ )
		{
			if(!detectSameZone_2( room[n], rooms[i].pointid )) continue;
			
			var material = [];
			for ( var i2 = 0; i2 < rooms[i].colors.length; i2++ )	
			{
				material[i2] = {};
				material[i2].containerID = rooms[i].colors[i2].containerID;
				
				if(!rooms[i].colors[i2].lot)
				{
					if(material[i2].containerID == 'floor') { rooms[i].colors[i2].lot = { id : 4956 }; }
					if(material[i2].containerID == 'ceil') { rooms[i].colors[i2].lot = { id : 4957 }; }
				}
				
				if(rooms[i].colors[i2].lot.id)
				{  
					if(isNumeric(rooms[i].colors[i2].lot.id))
					{
						material[i2].lotid = rooms[i].colors[i2].lot.id;
					}				
				}
				
				if(rooms[i].colors[i2].matMod)
				{
					if(rooms[i].colors[i2].matMod.colorsets[0].color)
					{
						var color = rooms[i].colors[i2].matMod.colorsets[0].color;
						color.r = Math.round(color.r * 100);
						color.g = Math.round(color.g * 100);
						color.b = Math.round(color.b * 100);
						
						material[i2].color = color;					
					}
					
					if(rooms[i].colors[i2].matMod.texScal)
					{
						material[i2].scale = new THREE.Vector2( rooms[i].colors[i2].matMod.texScal.x, rooms[i].colors[i2].matMod.texScal.y );
					}

					if(rooms[i].colors[i2].matMod.texOffset) 
					{
						material[i2].offset = new THREE.Vector2( rooms[i].colors[i2].matMod.texOffset.x, rooms[i].colors[i2].matMod.texOffset.y );
					}					
					
					if(rooms[i].colors[i2].matMod.mapingRotate) 
					{
						material[i2].rotation = THREE.Math.degToRad( rooms[i].colors[i2].matMod.mapingRotate ); 
					}					
				}								
			}

			room[n].userData.id = rooms[i].id;
			room[n].userData.room.roomType = detectNameRoom('idToText', rooms[i].roomSType);
			setMaterialFloorCeiling(n, material);						
			getYardageSpace( [room[n]] );
			
			
			var plinth = [{o : false, lotid : 0}, {o : false, lotid : 0}];
			
			if(rooms[i].plinthLot) { plinth[0].o = true; plinth[0].lotid = rooms[i].plinthLot.id; }
			if(rooms[i].plinthCeilLot) { plinth[1].o = true; plinth[1].lotid = rooms[i].plinthCeilLot.id; }
			
			
			// если не смогли загрузить плинтус, то очищаем его значения
			var flag = true;
			for ( var i2 = 0; i2 < pool_pop.length; i2++ ) { if(pool_pop[i2].id == plinth[0].lotid) { if(!pool_pop[i2].empty) { flag = false; break; } } } 
			if(flag) { plinth[0] = {o : false, lotid : 0}; }
			
			var flag = true;
			for ( var i2 = 0; i2 < pool_pop.length; i2++ ) { if(pool_pop[i2].id == plinth[1].lotid) { if(!pool_pop[i2].empty) { flag = false; break; } } } 
			if(flag) { plinth[1] = {o : false, lotid : 0}; }			
			
			if(plinth[0].o) { loadPopObj_1({ obj: room[n], lotid : plinth[0].lotid }); }
		}
	}		
	// восстанавливаем пол 	

	centerCamera2D(false);
	centerStartCamera3D();
	
	if(param_ugol.camera)
	{
		if(param_ugol.camera == '3d')
		{
			EditorInvokeFunction('SetView', '3d');
			UIInvokeFunction('SetView', '3d');			
		}
	}



	for ( var i = 0; i < obj_line.length; i++ )
	{
		obj_line[i].material[1].map = null;
		obj_line[i].material[2].map = null;		
		obj_line[i].material[1].envMap = reflectionCube;
		obj_line[i].material[2].envMap = reflectionCube;
		obj_line[i].material[1].color.setHex( 0xffffff );
		obj_line[i].material[2].color.setHex( 0xffffff );
	}

	for ( var i = 0; i < room.length; i++ )
	{
		room[i].material.map = null;	
		room[i].material.envMap = reflectionCube;
		room[i].material.color.setHex( 0xffffff );
	}			

	return { json : wall, obj : arrW };
}






function loadFilePL(arr, cdm) 
{                 		
	if(!arr) return;
	
	console.log(arr);
	
	levelFloor = (arr.floors[0].id) ? arr.floors[0].id : 1;
	height_wall = arr.floors[0].height;
	projName = arr.floors[0].name;
	projVersion = arr.version;
		
	var point = arr.floors[0].points;
	var walls = arr.floors[0].walls;
	var rooms = arr.floors[0].rooms;
	var obj_pop = arr.floors[0].furn;
	
	
	height_wall = Math.round(height_wall * 100) / 100;
	if(height_wall < 0.1) { height_wall = 3; }	
	
	
	
	// устанавливаем окна/двери
	var wall = cdm.json;
	var arrW = cdm.obj;
	for ( var i = 0; i < wall.length; i++ )
	{ 
		var obj = arrW[i];
		
		var point1 = obj.userData.wall.p[0];
		var point2 = obj.userData.wall.p[1];		
		
		for ( var i2 = 0; i2 < wall[i].arrO.length; i2++ )
		{			
			wall[i].arrO[i2].pos.x = point1.position.distanceTo( point2.position ) * wall[i].arrO[i2].pos.x;
			
			var intP = obj.localToWorld( wall[i].arrO[i2].pos.clone() );  						

			// если не смогли загрузить дверь, то загружаем проем
			var flag = true;
			
			for ( var i3 = 0; i3 < pool_pop.length; i3++ ) { if(pool_pop[i3].id == wall[i].arrO[i2].lotid) { if(!pool_pop[i3].empty) { flag = false; break; } } } 
			 
			if(flag) 
			{ 
				if(wall[i].arrO[i2].type == 'door') { wall[i].arrO[i2].lotid = 575; delete wall[i].arrO[i2].open; } 
				else if(wall[i].arrO[i2].type == 'window') { wall[i].arrO[i2].lotid = 8747; }
			}

			var inf = { status : 'load', id : wall[i].arrO[i2].id, lotid: wall[i].arrO[i2].lotid, pos : intP, wall : obj };	 		
			if(wall[i].arrO[i2].size) { inf.size = wall[i].arrO[i2].size; }
			if(wall[i].arrO[i2].open) { inf.open_type = wall[i].arrO[i2].open; } 
			if(wall[i].arrO[i2].options) { inf.options = wall[i].arrO[i2].options; }				
			
			
			loadPopObj_1(inf);  
		}		
	}
	// устанавливаем окна/двери
			
	
	
	// восстанавливаем countId
	for ( var i = 0; i < scene.children.length; i++ ) 
	{ 
		if(scene.children[i].userData.id) 
		{ 
			var index = parseInt(scene.children[i].userData.id);
			if(index > countId) { countId = index; }
		} 
	}
	countId++; 
	// восстанавливаем countId
	
	
	
	//getSkeleton_1(room);
	
	
	
	arrRenderCams = [];
	if(arr.cams)
	{
		for ( var i = 0; i < arr.cams.length; i++ )
		{
			arr.cams[i].position.z *= -1;
			arr.cams[i].target_position.z *= -1;
			
			arrRenderCams[i] = { posCam : arr.cams[i].position, posTarget : arr.cams[i].target_position };
		}		
	}
	
	
	for ( var i = 0; i < obj_line.length; i++ ) 
	{ 
		//var geometry = new THREE.BufferGeometry().fromGeometry( obj_line[i].geometry );
		//obj_line[i].geometry.dispose();
		//obj_line[i].geometry = geometry; 
	}		
	
	changeSizePoint();
	centerCamera2D(false);
	centerStartCamera3D();
	
	if(param_ugol.camera)
	{
		if(param_ugol.camera == '3d')
		{
			EditorInvokeFunction('SetView', '3d');
			UIInvokeFunction('SetView', '3d');			
		}
	}
	
	emitAction('load-project-end');
	emitAction('stop-fake-loading');					
	
	renderCamera();
}



// загрузка objPop
function createObjNewFile(arr, lotid)
{
	var obj_pop = arr.floors[0].furn;
	
	// объекты
	for ( var i = 0; i < obj_pop.length; i++ )
	{		
		if(obj_pop[i].lotid != lotid) continue;
		
		var rot = obj_pop[i].rot; 
		rot.x = THREE.Math.degToRad(rot.x);
		rot.y = THREE.Math.degToRad(rot.y);
		rot.z = THREE.Math.degToRad(rot.z);	

		
		var material = [];
		if(obj_pop[i].colors)
		{
			for ( var i2 = 0; i2 < obj_pop[i].colors.length; i2++ )	
			{						
				if(!obj_pop[i].colors[i2].lot) continue;
				if(!isNumeric(obj_pop[i].colors[i2].lot.id)) continue;

				var n = material.length;
				material[n] = { opacity : 1 };
				material[n].containerID = obj_pop[i].colors[i2].containerID;
				material[n].lotid = obj_pop[i].colors[i2].lot.id;				
				
				if(obj_pop[i].colors[i2].matMod)
				{
					if(obj_pop[i].colors[i2].matMod.colorsets[0].color)
					{
						var color = obj_pop[i].colors[i2].matMod.colorsets[0].color;
						color.r = Math.round(color.r * 100);
						color.g = Math.round(color.g * 100);
						color.b = Math.round(color.b * 100);
						
						material[n].color = color;					
					}
					
					if(obj_pop[i].colors[i2].matMod.texScal)
					{
						material[n].scale = new THREE.Vector2( obj_pop[i].colors[i2].matMod.texScal.x, obj_pop[i].colors[i2].matMod.texScal.y );
					}

					if(obj_pop[i].colors[i2].matMod.texOffset) 
					{
						material[n].offset = new THREE.Vector2( obj_pop[i].colors[i2].matMod.texOffset.x, obj_pop[i].colors[i2].matMod.texOffset.y );
					}					
					
					if(obj_pop[i].colors[i2].matMod.mapingRotate) 
					{
						material[n].rotation = THREE.Math.degToRad( obj_pop[i].colors[i2].matMod.mapingRotate ); 
					}					
				}				
			}					
		}
		
		if(!isNumeric(obj_pop[i].id)) { var id = countId; countId++; }  // если не число
		else { var id = obj_pop[i].id; }	
		 
		loadPopObj_1({ lotid : obj_pop[i].lotid, id : id, pos : obj_pop[i].pos, rot : rot, size : obj_pop[i].size, material : material });
	}	
	// объекты


	
						
}
 


// конверитруем типы в текст комнат
function detectNameRoom(cdm, value)
{
	var list = roomTypes;		
	
	if(cdm == 'idToText')
	{
		if(isNumeric(value)) 		// если число
		{
			for ( var i = 0; i < list.length; i++ ) { if(value == list[i].id) { return list[i].caption; } }
		}
		else
		{
			for ( var i = 0; i < list.length; i++ ) { if(value == list[i].alias) { return list[i].caption; } }		
		}		
	}
	else if(cdm == 'textToId')
	{
		for ( var i = 0; i < list.length; i++ ) { if(value == list[i].caption) { return list[i].alias; } }
	}
	
	return 'null';
}





