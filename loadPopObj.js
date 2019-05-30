

var pool_pop = [];

// добавляем любой lotid
function createAnyObject(cdm) 
{
	var lotid = cdm.lotid;
	
	if(!isNumeric(lotid)) return;	
	
	loadPopObj_1({ lotid : lotid, lib : '92da6c1f72c1ebca456a86d978af1dfc7db1bcb24d658d710c5c8ae25d98ba52'});
}


// скачиваем с сервера json файл, добавляем его в общий массив/библиотеку
// отправляем json в обработку, чтобы добавить на сцену
function loadPopObj_1(cdm) 
{			
	if(!Array.isArray(cdm)) { var cdm = [cdm]; }		
	if(!isNumeric(cdm[0].lotid)) { return; } // если не число, то отбой	
	
	
	if(cdm[0].size)
	{ 
		if((/,/i).test( cdm[0].size )) { var size = cdm[0].size.split(','); cdm[0].size = new THREE.Vector3(parseFloat(size[0]),parseFloat(size[1]),parseFloat(size[2])); }		
	}	
	
	// если лот уже есть в библиотеке, то достаем его от туда и НЕ обращаемся к серверу
	for ( var i = 0; i < pool_pop.length; i++ ) 
	{ 
		if(pool_pop[i].id == cdm[0].lotid) 
		{ 				
			loadPopObj_2(pool_pop[i], cdm[0]); 
			return; 
		} 
	} 	
	
		
	cdm[0].emptyCube = createEmptyCube(cdm[0]);  	// если это мебель, то создаем пустой объект 		
	cdm[0].arrLotid = [cdm[0].lotid];
	cdm[0].mess = 'new obj';
	
	addJsonPopBase_1(cdm[0]);		// лота нет, в хранилище (добавляем его туда, а после добавления обратно отправляем в эту ф-цию)
}


// создаем куб размером с объект (он находится в сцене, пока не подгрузится реальный объект)
// куб создается только для нового объекта в сцене (из каталога) 
function createEmptyCube(json) 
{
	if(json.replace) return null;	// если мы заменяем один объект на другой, то куб не создаем
	
	if(json.lotGroup == 'Furniture' || json.lotGroup == 'Light' || json.lotGroup == 'FurnitureSanitaryEngineering')
	{					 
		var material = new THREE.MeshLambertMaterial({ color: colWin, transparent: true, opacity: 0.5, side: THREE.DoubleSide }); 
		var cube = new THREE.Mesh( createGeometryCube(json.size.x, json.size.y, json.size.z), material ); 			
		
		if(1==1) 
		{
			var arr = json.modifiers.split(';');			
			for ( var i2 = 0; i2 < arr.length; i2++ ) 
			{ 
				if(arr[i2] == 'SnapToCeil') { cube.position.y = Number(height_wall); break; } 								// объекты крепятся потолку
				
				// объекты крепятся на заданную высоту	
				if((/SetupBeginOverfloor/i).test( arr[i2] )) 
				{ 
					var num = arr[i2].split('*')[1]; 
					num = num.replace(",", "."); 
					if(Number(num)) { cube.position.y = Number(num); }
					break; 
				}	
			}
			console.log(json);	
		}
		else
		{
			if(typeof json.allModifiers.SnapToCeil !== "undefined") { cube.position.y = Number(height_wall); }											// объекты крепятся к потолку	
			if(typeof json.allModifiers.SetupBeginOverfloor !== "undefined") { cube.position.y = Number(json.allModifiers.SetupBeginOverfloor[0]); }	// объекты крепятся на заданную высоту			
		}
		
		setPlaneMath2(cube.position, json.size.z/2);
		
		cube.userData.tag = 'obj'; 
		cube.userData.obj3D = { size : json.size };
		cube.userData.obj3D.last = { pos : new THREE.Vector3() };
		obj_selected = cube; 
		

		if(camera == cameraWall)
		{
			var obj3D = cube;
			var vec1 = new THREE.Vector3(1, 0, 0);
			var dir = new THREE.Vector3().subVectors( arrWallFront.bounds.max.x, arrWallFront.bounds.min.x ).normalize();
			
			if(arrWallFront.index == 1)	{ dir = new THREE.Vector3(-dir.x, -dir.y, -dir.z); } 
			
			var rad = -Math.PI/2 + Math.atan2(dir.x, dir.z);	// из вектора в радианы		
			obj3D.rotation.set(0, rad, 0);
			
			obj3D.updateMatrixWorld();
			obj3D.geometry.computeBoundingSphere();
			offset = new THREE.Vector3().subVectors( obj3D.position, obj3D.localToWorld(new THREE.Vector3(0, obj3D.geometry.boundingSphere.center.y, 0)) );
			
			//obj3D.userData.obj3D = {};
			//showSizePopObj(obj3D); 
		}

		scene.add( cube );		
		
		return cube;					
	}
	
	
	return null;
}



// создаем форму окна/двери/балкона при загрузки объекта (вставка формы двери в сцену)
function createEmptyFormWD(json, cdm)
{  

	if(json.lotGroup == 'Windows' || json.lotGroup == 'Doors')
	{
		var form = { type : '' , v : new THREE.Vector2( 0, 0 ) };
		
		var size = (cdm.size) ? cdm.size : json.size;  
		
		if(!cdm.status)
		{
			if(cdm.lotid == 575 || cdm.lotid == 9012 || cdm.lotid == 278) { size.x = 0.9; size.y = 2.1; }
		}		
		
		
		var material = new THREE.MeshLambertMaterial({ color: (json.lotGroup == 'Windows') ? colWin : colDoor, transparent: true, opacity: 1.0, depthTest: false });  
		
		if(camera == cameraTop)
		{ 
			material.depthTest = false;
			material.transparent = true;		
			material.opacity = 1.0; 		 	
		}
		else
		{ 		
			material.depthTest = true;
			material.transparent = true;
			material.opacity = 0;					
		}		
		
		var arr = json.modifiers.split(';'); 
		
		//console.log(json.allModifiers);
		
		if(typeof json.allModifiers.CutContourData !== "undefined") { /*console.log(json.allModifiers.CutContourData[0]);*/ } 
		


		for ( var i = 0; i < arr.length; i++ ) 
		{ 
			if((/CutContourData*/i).test( arr[i] )) 
			{
				var str = arr[i].split('CutContourData*')[1].split('|');				
				
				var spline = [];
				for ( var i2 = 0; i2 < str.length; i2+=2 ) { spline[spline.length] = new THREE.Vector2( parseFloat(str[i2]), parseFloat(str[i2 + 1]) ); }
				
				var shape = new THREE.Shape( spline );
				var obj = new THREE.Mesh( new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 0.2 } ), material );
				
				var v = obj.geometry.vertices;
				
				var minX = [], maxX = [], minY = [], maxY = [], minZ = [], maxZ = [];
				
				for ( var i = 0; i < v.length; i++ )
				{
					v[i].z = Math.round(v[i].z * 100) / 100;
					if(v[i].z == 0) { minZ[minZ.length] = i; v[i].z = -0.1; }
					if(v[i].z == 0.2) { maxZ[maxZ.length] = i; v[i].z = 0.1; } 
				}
				
				obj.geometry.computeBoundingBox();	

				for ( var i = 0; i < v.length; i++ )
				{
					if(obj.geometry.boundingBox.min.x + 0.05 > v[i].x) { minX[minX.length] = i; }
					if(obj.geometry.boundingBox.max.x - 0.05 < v[i].x) { maxX[maxX.length] = i; }
					if(obj.geometry.boundingBox.min.y + 0.05 > v[i].y) { minY[minY.length] = i; }
					if(obj.geometry.boundingBox.max.y - 0.05 < v[i].y) { maxY[maxY.length] = i; }
				}
				
				
				var arr = { minX : minX, maxX : maxX, minY : minY, maxY : maxY, minZ : minZ, maxZ : maxZ };
				
				form = { type : 'spline' , v : arr };
				//form.type = '';
				
				// scale для формы двери
				if(cdm.size)
				{
					var scale = new THREE.Vector3(cdm.size.x/json.size.x, cdm.size.y/json.size.y, cdm.size.z/json.size.z); 	
					var v = obj.geometry.vertices; 
					var f = form.v;
					
					for ( var i = 0; i < f.minX.length; i++ ) { v[f.minX[i]].x *= scale.x; }
					for ( var i = 0; i < f.maxX.length; i++ ) { v[f.maxX[i]].x *= scale.x; }
					for ( var i = 0; i < f.minY.length; i++ ) { v[f.minY[i]].y *= scale.y; }
					for ( var i = 0; i < f.maxY.length; i++ ) { v[f.maxY[i]].y *= scale.y; }


					obj.geometry.verticesNeedUpdate = true;
					obj.geometry.elementsNeedUpdate = true;	
					obj.geometry.computeBoundingSphere();						
				}
				
				if(cdm.lotid == 575) 
				{
					// подгоняем под нужный размер, вместо scale
					var v = obj.geometry.vertices; 
					var f = form.v;
					
					for ( var i = 0; i < f.minX.length; i++ ) { v[f.minX[i]].x = -size.x / 2; }
					for ( var i = 0; i < f.maxX.length; i++ ) { v[f.maxX[i]].x = size.x / 2; }
					for ( var i = 0; i < f.minY.length; i++ ) { v[f.minY[i]].y = -size.y / 2; }
					for ( var i = 0; i < f.maxY.length; i++ ) { v[f.maxY[i]].y = size.y / 2; }

					obj.geometry.verticesNeedUpdate = true;
					obj.geometry.elementsNeedUpdate = true;				
					
					//obj.scale.set( size.x / (obj.geometry.boundingBox.max.x - obj.geometry.boundingBox.min.x), size.y / (obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y), 1 );
					//console.log(obj.scale);
				}
				
				break;
			}					
		}		
		
		if(form.type == '')
		{
			var obj = new THREE.Mesh( createGeometryWD(size.x, size.y, 0.2), material );

			var arr = { minX : [0,1,6,7], maxX : [2,3,4,5], minY : [0,3,4,7], maxY : [1,2,5,6], minZ : [4,5,6,7], maxZ : [0,1,2,3] };
			form = { type : 'box' , v : arr };
		} 
		
		var v = obj.geometry.vertices;
		var width = Math.round((v[arr.maxZ[0]].z - v[arr.minZ[0]].z) * 100) / 100;
		
		
		obj.userData.tag = 'free_dw';
		obj.userData.catalog = cdm.catalog;
		obj.userData.door = {};
		obj.userData.door.size = new THREE.Vector3( size.x, size.y, json.size.z );
		obj.userData.door.form = form;
		obj.userData.door.bound = {}; 
		obj.userData.door.floorCenterY = 0;  // центр wd над полом
		obj.userData.door.width = width;
		obj.userData.door.h1 = 0;
		obj.userData.door.color = obj.material.color; 
		obj.userData.door.popObj = null;
		obj.userData.door.wall = null;
		obj.userData.door.controll = {};
		obj.userData.door.ruler = {};
		obj.userData.door.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3(), x : 0, y : 0 };
		obj.userData.door.totalLoad = false;
		obj.userData.door.goList = { setEmptyBox : false, setPopObj : false, setPlinths : false };
		obj.userData.door.status = '';
		
		if(cdm.lotid == 575 || cdm.lotid == 10 || cdm.lotid == 11 || cdm.lotid == 12 || cdm.lotid == 9012 || cdm.lotid == 534 || cdm.lotid == 278 || cdm.lotid == 8747 || cdm.lotid == 8740 || cdm.lotid == 31)
		{
			obj.userData.door.topMenu = true;
		}
		else 
		{
			obj.userData.door.topMenu = false;
		}
		
		
		if(cdm.id) 	// загрузка двери/окна из xml
		{ 
			obj.userData.id = cdm.id; 
			obj.userData.door.status = cdm.status; 
		} 
		else if(cdm.replace)	// замена двери/окна
		{	
			obj.userData.id = cdm.obj.userData.id;
			obj.position.copy(cdm.obj.position);
			obj_selected = null;
			//clickO.last_obj = null;
		}      	
		else 		// вставка новой двери/окна из редактора
		{ 
			obj_selected = obj; 
			clickO.last_obj = obj; 
		}
			
		
		cdm.emptyBox = obj;
		obj.renderOrder = 1;
		
		// выставляем мат.плоскость на заданный уровень
		if(1==1)
		{
			obj.updateMatrixWorld();
			obj.geometry.computeBoundingBox();			
			var y = obj.localToWorld( new THREE.Vector3(0, obj.geometry.boundingBox.min.y, 0) ).y;			

			var k = (json.lotGroup == 'Windows') ? 0.6 : 0;			// высота вставки двери/окна	
			obj.userData.door.floorCenterY = obj.position.y - y + k;
			planeMath.position.set( 0, obj.userData.door.floorCenterY, 0 );
			planeMath.rotation.set(-Math.PI/2, 0, 0);
			
			if(camera == cameraTop) { objDeActiveColor_2D(); hideMenuObjUI_2D(clickO.last_obj); } 					
		}

		scene.add( obj ); 		
	}
}




// после того, как полностью получен json начинаем применять его к сцене
function loadPopObj_2(json, cdm)
{
	if(json.empty) 
	{ 
		sendMessage('EDITOR.OBJECT_PICK_ERROR');
		if(cdm.emptyCube) { scene.remove( cdm.emptyCube ); obj_selected = null; }
		return; 
	}
	
	
	if(cdm.replace) 
	{ 
		var stop = true;
		
		if(!cdm.obj) return;
		
		var tag = cdm.obj.userData.tag;
		
		

		if(tag == 'wall') { if(json.type == 'material') stop = false; }
		else if (tag == 'room') { if(json.type == 'material' || json.lotGroup == 'Plinths') stop = false; }
		else if (tag == 'ceiling') { if(json.type == 'material' || json.lotGroup == 'Plinths') stop = false; }		
		else if (tag == 'door' && cdm.obj.userData.door.type == 'DoorPattern') { if(json.lotGroup == 'Doors' || json.lotGroup == 'FurnitureDoorHandle') stop = false; } 
		else if (tag == 'door') { if(json.lotGroup == 'Doors') stop = false; } 
		else if (tag == 'obj') 
		{ 
			if(json.lotGroup == 'Furniture' || json.lotGroup == 'Light' || json.lotGroup == 'FurnitureSanitaryEngineering') { stop = false; }
			else
			{
				var obj = cdm.obj;
				
				if(obj.userData.obj3D.edge) 
				{
					stop = false;
					cdm.obj = obj.children[0].children[Number(obj.userData.obj3D.edge) - 1];
				}
			}
		}
		
		
		if(stop) 
		{ 
			sendMessage('EDITOR.OBJECT_PICK_ERROR');
			console.log('stop replace = ', tag, ' : ', json.type, cdm);
			if(cdm.emptyCube) { scene.remove( cdm.emptyCube ); obj_selected = null; }
			resetMenuUI(); 			
			return; 
		}
		else
		{
			sendMessage('EDITOR.OBJECT_PICK_SUCCESS');
		}
	}

	if(json.type == 'object') 
	{	
		if(json.lotGroup == 'Furniture' || json.lotGroup == 'Light' || json.lotGroup == 'FurnitureSanitaryEngineering') { loaderObjPop(cdm, json); }				
		else if(json.lotGroup == 'Doors' || json.lotGroup == 'Windows') { createEmptyFormWD(json, cdm); loaderWD(cdm, json); }
		else if(json.lotGroup == 'Plinths') { getLengthPlinths( cdm.obj, json ); }
		else if(json.lotGroup == 'TypalRoom') { loadFile(json.fileRender); }
		if(json.lotGroup == 'FurnitureDoorHandle') { replaceHabdleDoor_2(cdm, json); }
	} 
	else if(json.type == 'material')
	{		
		loadPopMaterial(cdm, json);
	}		
}


// утсанавливаем мат.плоскость, при вставки POP объекта
function setPlaneMath2(pos, z)
{
	if(camera == cameraWall)
	{
		var x1 = arrWallFront.bounds.max.x.z - arrWallFront.bounds.min.x.z;
		var z1 = arrWallFront.bounds.min.x.x - arrWallFront.bounds.max.x.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	
		dir = new THREE.Vector3().addScaledVector( dir, z );
			
		if(arrWallFront.index == 1)	{ dir = new THREE.Vector3(-dir.x, -dir.y, -dir.z); }
			
		var pos = new THREE.Vector3().subVectors( arrWallFront.bounds.max.x, arrWallFront.bounds.min.x ).divideScalar( 2 ).add( arrWallFront.bounds.min.x );		
		pos.add(dir);
		
		planeMath2.position.copy( pos );
		planeMath2.rotation.set( 0, arrWallFront.wall[0].obj.rotation.y + Math.PI / 2, Math.PI / 2 );			
	}
	else
	{			
		planeMath2.position.copy( pos );
		planeMath2.rotation.set( 0, 0, 0 );			
	}	
}

// создаем мебель
function loaderObjPop(cdm, json)
{	
	// замена выделенного объекта
	var parO = { pos : new THREE.Vector3(), rot : new THREE.Vector3() };
	
	var pos = (cdm.pos) ? new THREE.Vector3(Number(cdm.pos.x), Number(cdm.pos.y), Number(cdm.pos.z)) : new THREE.Vector3();
	var rot = (cdm.rot) ? new THREE.Vector3(Number(cdm.rot.x), Number(cdm.rot.y), Number(cdm.rot.z)) : new THREE.Vector3();

	
	var obj = cdm.obj;
	
	if(obj) 
	{ 
		if(cdm.replace) 
		{ 
			parO.pos = new THREE.Vector3(obj.position.x, obj.position.y, -obj.position.z); 
			parO.rot = new THREE.Vector3(obj.rotation.x + Math.PI, obj.rotation.y + Math.PI, obj.rotation.z + Math.PI); 
			deleteObjCatalog(obj);   
		}
		else 
		{
			param_pivot.obj = null;
			pivot.visible = false;
			gizmo.visible = false;				
		}
	}				
		
	
	// объект новый, добавляем из каталога на сцену (или заменяем на уже существующий объект)
	if(!cdm.id)
	{
		if(!cdm.replace)
		{
			if(typeof json.allModifiers.SnapToCeil !== "undefined") { parO.pos.y = Number(height_wall); }											// объекты крепятся к потолку	
			
			// объекты крепятся на заданную высоту	
			if(typeof json.allModifiers.SetupBeginOverfloor !== "undefined") 
			{ 
				var num = json.allModifiers.SetupBeginOverfloor[0];
				num = num.replace(",", ".");
				if(Number(num)) { parO.pos.y = Number(num); }
			}					
		}
		
		offset = new THREE.Vector3();
		
		setPlaneMath2(parO.pos, json.size.z/2);
				
		pos.copy( parO.pos ); 									
		rot.copy( parO.rot ); 		
	}
	
	// json parse
	//var obj = new THREE.ObjectLoader().parse( json.fileJson );
	
	new THREE.ObjectLoader().parse
	(
		json.fileJson, 
		
		function ( obj ) 
		{

			var obj3D = createCopyPopForm(obj);  		
			
			if(cdm.id) { var id = cdm.id; }
			else { var id = countId; countId++; }
						

				
			obj3D.pr_group = null;
			obj3D.pr_catalog = Object.assign({}, cdm.catalog);
			obj3D.pr_filters = json.filters;
			obj3D.pr_preview = json.preview;
			
			obj3D.userData.id = id;
			obj3D.userData.tag = 'obj';
			obj3D.userData.catalog = cdm.catalog;
			obj3D.userData.obj3D = { lotid : json.id, lotGroup : json.lotGroup, size : (cdm.id) ? cdm.size : json.size, filters : json.filters, preview : json.preview, caption : json.caption, catalog : Object.assign({}, cdm.catalog), last : { pos : new THREE.Vector3()}, sizeMinMaxLimit : null, boxPop : null };
			obj3D.userData.obj3D.size = (cdm.id) ? cdm.size : json.size;
			obj3D.userData.obj3D.sizeStart = json.size;
			
			if(typeof json.allModifiers.ResizeOption !== "undefined") { obj3D.userData.obj3D.boxPop = boxPop; }	// объекту можно менять высоту/ширину/длину
			if(typeof json.allModifiers.SizeMinMaxLimit !== "undefined") { obj3D.userData.obj3D.sizeMinMaxLimit = JSON.parse(json.allModifiers.SizeMinMaxLimit[0]); }	// ограничение размера
			

			obj3D.userData.obj3D.controller = 'pivot'; 
			
			if(obj3D.userData.obj3D.lotid == 72184) 
			{
				obj3D.userData.obj3D.edge = 1; 
			}
			
			if(cdm.id)
			{
				
				if(typeof json.allModifiers.ResizeOption !== "undefined")
				{
					if(cdm.size.x < 0.00001) { cdm.size.x = 1; }
					if(cdm.size.y < 0.00001) { cdm.size.y = 1; }
					if(cdm.size.z < 0.00001) { cdm.size.z = 1; }

					obj3D.scale.set(cdm.size.x / json.size.x, cdm.size.y / json.size.y, cdm.size.z / json.size.z);		// восстановить 					
				}
				else
				{
					obj3D.scale.set(1, 1, 1);				
				}
													
				assignTextureAllChildrensLoadPop(obj, cdm.material);
				obj3D.position.set(pos.x, pos.y, -pos.z); 					// ковертируем с помощью -pos.z		
			}
			else
			{
				assignTextureAllChildrens(obj, json.components);

				if(cdm.emptyCube) { obj3D.position.copy( cdm.emptyCube.position ); scene.remove( cdm.emptyCube ); }
				else { obj3D.position.set(pos.x, pos.y, -pos.z); }   

				if(!cdm.replace) 
				{ 
					obj_selected = obj3D;
					clickO.last_obj = obj3D;
				}
				else 
				{
					obj3D.geometry.computeBoundingSphere();
					setPivotOnPopObj( obj3D );
					showTablePopObjUI( obj3D );
					clickO.last_obj = obj3D; 

					showToolHandle( obj3D );		// показываем pivot/rotate/scale
				}	
			}

			popChangeMaxAnisotropy(obj);			
	
			obj3D.material = idealScreenMat;
			//obj3D.material = new THREE.MeshLambertMaterial( { color : 0xff0000, lightMap : lightMap_1 } )
	
	
			
			// ковертируем с помощью Math.PI
			if(obj.userData.version == "2.0" || obj.userData.version == 2.0) { obj3D.rotation.set(rot.x, -rot.y, rot.z); obj3D.userData.version = obj.userData.version; }
			else { obj3D.rotation.set(rot.x + Math.PI, rot.y, rot.z + Math.PI); }	

			
			// если объект добавляется в режиме стена, то заносим его в массив, чтобы можно было его передвигать
			if(!cdm.id && camera == cameraWall)
			{
				var vec1 = new THREE.Vector3(1, 0, 0);
				var dir = new THREE.Vector3().subVectors( arrWallFront.bounds.max.x, arrWallFront.bounds.min.x ).normalize();
				
				if(arrWallFront.index == 1)	{ dir = new THREE.Vector3(-dir.x, -dir.y, -dir.z); } 
				
				var rad = -Math.PI/2 + Math.atan2(dir.x, dir.z);	// из вектора в радианы		
				obj3D.rotation.set(0, rad, 0);
				
				obj3D.updateMatrixWorld();
				obj3D.geometry.computeBoundingSphere();
				offset = new THREE.Vector3().subVectors( obj3D.position, obj3D.localToWorld(new THREE.Vector3(0, obj3D.geometry.boundingSphere.center.y, 0)) );
				 
				arrWallFront.objPop.obj_1[arrWallFront.objPop.obj_1.length] = obj3D;
				arrWallFront.total[arrWallFront.total.length] = obj3D;
				//showSizePopObj(obj3D); 
				
				arrWallFront.objPop.arrPos = [];
				arrWallFront.objPop.arrPos_2 = [];
				
				// привязка
				var wall = arrWallFront.wall[0].obj;    
				showControllWD( wall, obj3D );				
				clickPopObjCameraWall( obj3D );		
			}
			
			
			
			arr_obj[arr_obj.length] = obj3D; 

			if(cdm.group) 
			{ 
				var box = cdm.group;
				box.add( obj3D );
				var n = box.userData.arrO.length;
				box.userData.arrO[n] = obj3D;
				box.userData.pos_obj[n] = obj3D.position.clone();
				obj3D.pr_group = box; 
			}		 

			resetMenuUI();
			renderCamera();		
		},
		// onProgress callback
		function ( xhr ) 
		{
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},

		// onError callback
		function ( err ) 
		{
			console.error( 'An error happened' );
		}
		
	);

}



// устанавливаем у POP для map и lightMap максимальное значение anisotropy
function popChangeMaxAnisotropy(obj) 
{
	for (var i = obj.children.length - 1; i >= 0; i--) 
	{
		var child = obj.children[i];		
	
		if(child.material)
		{
			if(child.material.map) child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy(); 
			if(child.material.lightMap) child.material.lightMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
		}
		
		popChangeMaxAnisotropy(child);			
	}
}



//var pop8747 = null; new THREE.ObjectLoader().load( 'pop/8747.json', function ( obj ) { pop8747 = obj; console.log(111111); });


// создаем окно/дверь
function loaderWD(cdm, json)
{
	
	var obj = cdm.emptyBox;

	obj.userData.door.lotid = json.id;
	obj.userData.door.type = (json.lotGroup == 'Windows') ? 'WindowSimply' : ((/DoorPattern*/i).test( json.modifiers )) ? 'DoorPattern' : 'DoorSimply';
	
	var mirror = false;
	if((/MirrorCondition*/i).test( json.modifiers ))
	{
		if( (/Mirrored/i).test( json.modifiers.split('MirrorCondition*')[1] ) ) mirror = true;
	}
	obj.userData.door.mirror = mirror;
	
	obj.caption = json.caption;
	obj.pr_catalog = Object.assign({}, cdm.catalog);
	obj.pr_filters = json.filters;
	obj.lotid = json.id;
	obj.pr_preview = json.preview;
	 	
	
	// кликнули/выбрали дверь, заменяем на другую
	if(cdm.replace) 
	{	
		cdm.id = Number(cdm.obj.userData.id);
		
		cdm.pos = cdm.obj.position.clone();
		
		cdm.obj.updateMatrixWorld();
		cdm.obj.geometry.computeBoundingBox();					
		var y = cdm.obj.localToWorld( new THREE.Vector3(0, cdm.obj.geometry.boundingBox.min.y, 0) ).y; 		
		var y2 = obj.localToWorld( new THREE.Vector3(0, obj.geometry.boundingBox.min.y, 0) ).y;		
		cdm.pos.y += y - y2;			
		
		cdm.wall = cdm.obj.userData.door.wall;		
		if(cdm.obj.userData.door.open_type) { cdm.open_type = cdm.obj.userData.door.open_type; }
		obj_selected = null;

		//obj.userData.door.width = cdm.obj.userData.door.width;
		
		deleteWinDoor( cdm.obj );
		delete cdm.obj;	 	
	}	
	
	if(obj.userData.door.type == 'DoorPattern')
	{  					
		createJambDoor(json, cdm);  // параметрическая дверь   		
	}
	else 
	{  
		if(json.fileJson) { var popObj = (json.fileJson.geometries) ? new THREE.ObjectLoader().parse( json.fileJson ) : null; }
		else { var popObj = null; }				
				
		obj.userData.door.popObj = popObj;	
		obj.userData.door.goList.setPopObj = true; 
		
		if(json.id == 9012) { obj.pr_filters = [3856, 3864]; }
		else if(json.id == 278) { obj.pr_filters = [3770]; }		
		else if(json.id == 575) { obj.pr_filters = [3856, 3864]; }
		
		if(popObj)
		{
			if(!popObj.geometry) 
			{
				if(popObj.children[0]) { obj.userData.door.popObj = popObj.children[0]; obj.add( popObj ); }
			}
		}		
		
		//var arr = json.modifiers.split(';');
		//for ( var i = 0; i < arr.length; i++ ) { if((/Mirrored/i).test( arr[i] )) { size.x *= -1; } }
		
		var existObj = (obj.userData.door.popObj) ? (obj.userData.door.popObj.geometry) ? true : false : false;
		
		if(existObj)
		{  
			var size = (cdm.size) ? cdm.size : json.size;
			
			popObj = obj.userData.door.popObj;
			
			popObj.geometry.computeBoundingBox();		
			var dX = popObj.geometry.boundingBox.max.x - popObj.geometry.boundingBox.min.x;
			var dY = popObj.geometry.boundingBox.max.y - popObj.geometry.boundingBox.min.y;
			popObj.scale.set( size.x / dX, size.y / dY, 1 );	 				

			assignTextureAllChildrens(popObj, json.components);		
			obj.add( popObj );			
		}
		else 
		{
			obj.userData.door.type = 'DoorEmpty';			
			obj.userData.door.popObj = null;
		}		
	}
	
	if(obj) { (obj.userData.door.type === 'DoorPattern') ? UI.show('doorPattern') : UI.hide('doorPattern'); }
	
	
	
	// если объект добавляется в режиме стена, то заносим его в массив, чтобы можно было его передвигать
	if(cdm.replace && camera == cameraWall)
	{		
		obj.updateMatrixWorld();
		obj.geometry.computeBoundingBox();
		obj.geometry.computeBoundingSphere();
		 
		arrWallFront.total[arrWallFront.total.length] = obj; 
	}	
	
	
	// если это загрузка (из xml), то вставляем дверь 
	if(cdm.id) 
	{ 
		if(obj.userData.door.type == 'DoorSimply' || obj.userData.door.type == 'DoorPattern')
		{
			if(cdm.open_type) obj.userData.door.open_type = cdm.open_type;
		}
		
		if(cdm.status)
		{
			if(cdm.status == 'load')
			{					
				var middleY = (obj.geometry.boundingBox.max.y - obj.geometry.boundingBox.min.y) / 2;
				cdm.pos.y += middleY;  
			}
		}
		
		cdm.obj = obj;
		addWD( cdm ); 
	}		  	 
 	
}





// создаем один объект из нескольких дочерних (объединяем)
function createCopyPopForm(objPop)
{ 
	var obj = new THREE.Mesh( new THREE.Geometry() );
	
	var childrens = getAllChildrenObj(objPop, []);
	
	var modelGeometry = new THREE.Geometry();
	
	if(objPop.geometry)
	{
		var geometry = new THREE.Geometry().fromBufferGeometry( objPop.geometry.clone() );
		modelGeometry.merge(geometry);		
	}
	
	for ( var i = 0; i < childrens.length; i++ )
	{
		if(!childrens[i].obj.geometry) continue;
		//if(childrens[i].obj.name== 'GeoSphere001_fake') continue;
		
		childrens[i].obj.userData.tag = 'obj_children';
		childrens[i].obj.userData.parent = obj;
		
		var clone = childrens[i].obj.clone();
		
		if(childrens[i].obj.parent)
		{
			childrens[i].obj.parent.updateMatrixWorld();
			clone.updateMatrixWorld();
			clone.applyMatrix(childrens[i].obj.parent.matrixWorld); 					
		}
		var geometry = new THREE.Geometry().fromBufferGeometry( clone.geometry );
		
		modelGeometry.merge(geometry, clone.matrix);
	}
	
	if(objPop.geometry)
	{
		var v = modelGeometry.vertices;
		
		for ( var i = 0; i < v.length; i++ )
		{
			v[i].x *= objPop.scale.x;
			v[i].y *= objPop.scale.y;
			v[i].z *= objPop.scale.z;
		}		
	}	

	obj.geometry = new THREE.BufferGeometry().fromGeometry(modelGeometry);
	//modelGeometry = new THREE.Geometry().fromBufferGeometry( modelGeometry );	
				
	scene.add(obj);  

	return obj;
}





// назначаем текстуру всем объектам входящие в родительский (объект загружается из xml)
function assignTextureAllChildrensLoadPop(obj, mat)
{
	var childrens = getAllChildrenObj(obj, []);  

	var containerID = [];
	for ( var i = 0; i < mat.length; i++ ) containerID[i] = mat[i].containerID;	
	
	for ( var i = 0; i < childrens.length; i++ ) childrens[i].name = childrens[i].name.replace(/_CRUNCHED/i, '');
	for ( var i = 0; i < mat.length; i++ ) mat[i].containerID = mat[i].containerID.replace(/_CRUNCHED/i, '');
	
	
	for ( var i = 0; i < childrens.length; i++ )
	{		
		var length = 0;
		var index = 0;
		
		for ( var i2 = 0; i2 < mat.length; i2++ )
		{			
			if(new RegExp( mat[i2].containerID ,'i').test( childrens[i].name ))
			{		
				if(length < mat[i2].containerID.length) { length = mat[i2].containerID.length; index = i2; }
			}
		}
		
		if(length > 0) 
		{  
			childrens[i].obj.userData.material = { containerID : containerID[index] };
			var inf = { obj: childrens[i].obj, lotid: mat[index].lotid, start : 'load', containerID : containerID[index], color : mat[index].color, scale : mat[index].scale };
			if(mat[index].offset) { inf.offset = mat[index].offset; } 
			if(mat[index].rotation) { inf.rotation = mat[index].rotation; }
			
			loadPopObj_1(inf);
		}
	}	
}





// назначаем текстуру всем объектам входящие в родительский (объект из сцены)
function assignTextureAllChildrens(obj, components)
{
	var childrens = getAllChildrenObj(obj, []);
	
	var containerID = [];
	for ( var i = 0; i < components.length; i++ ) containerID[i] = components[i].alias;		
	
	for ( var i = 0; i < childrens.length; i++ ) childrens[i].name = childrens[i].name.replace(/_CRUNCHED/i, '');
	for ( var i = 0; i < components.length; i++ ) components[i].alias = components[i].alias.replace(/_CRUNCHED/i, '');
	
	
	for ( var i = 0; i < childrens.length; i++ )
	{		
		var length = 0;
		var index = 0;
		
		for ( var i2 = 0; i2 < components.length; i2++ )
		{			
			if(new RegExp( components[i2].alias ,'i').test( childrens[i].name ))
			{			
				if(length < components[i2].alias.length) { length = components[i2].alias.length; index = i2; }
			}				
		}
		childrens[i].obj.material = idealScreenMat;
		if(length > 0) 
		{  
			if(components[index].lots) 
			{
				childrens[i].obj.userData.material = { containerID : containerID[index] };
				//loadPopObj_1({ obj: childrens[i].obj, lotid: components[index].lots[0], start : 'new', containerID : containerID[index] });
			} 
		}
	}
}



// находим все Children у ПОП объекта (рекурсия дерево)
function getAllChildrenObj(obj, arr)
{
	if(obj.geometry) arr[arr.length] = { obj : obj, name : obj.geometry.name };
	
	var arr2 = [];
	
	for ( var i = 0; i < obj.children.length; i++ )
	{
		var arr3 = getAllChildrenObj(obj.children[i], arr);
		
		if(obj.children.length - 1 == i) { return arr3.concat( arr2 ); }
		else { arr3.concat( arr2 ); }
	}
	
	return arr;
}



// загрузка материала 
function loadPopMaterial(cdm, json) 
{

}



 
// добавляем массив лотов в хранилище
function addJsonPopBase_1( cdm )   
{				
	var arrLotid = []; 
	for ( var i = 0; i < cdm.arrLotid.length; i++ ) { if(isNumeric(cdm.arrLotid[i])) { arrLotid[arrLotid.length] = cdm.arrLotid[i]; } } 
 
	// убираем лоты, которые уже есть в хранилище
	var arrLotid_2 = [];	
	for ( var i = 0; i < arrLotid.length; i++ ) 
	{
		var exist = false;
		for ( var i2 = 0; i2 < pool_pop.length; i2++ )
		{ 
			if(arrLotid[i] == pool_pop[i2].id) { exist = true; break; }
		}
		if(!exist) { arrLotid_2[arrLotid_2.length] = arrLotid[i]; }
	}
	arrLotid = arrLotid_2;	
	
	
	if(arrLotid.length > 0) { cdm.arrLotid = arrLotid; ajaxRequest(cdm); }
	else { sendArrJson(cdm); }
}




// выполняем запроск к api
function ajaxRequest(cdm)
{

	var list = '';
	for ( var i = 0; i < cdm.arrLotid.length; i++ ) { list += '&id['+i+']=' + cdm.arrLotid[i]; }
	
	var lib = (cdm.lib) ? cdm.lib : param_ugol.key;
	
	$.ajax
	({
		url: 'https://catalog.planoplan.com/api/v2.1/search/?keys[0]='+lib+'&disregard_price=1&disregard_structure=1'+list+'&lang=ru',
		type: 'GET', 
		dataType: 'json',
		success: function(arrJson)
		{ 		
			// если после опращения к API нам не выдали лот, то либо у нас нету прав или что-то другое, тогда добавляем его как пустой объект
			for ( var i = 0; i < cdm.arrLotid.length; i++ ) 
			{  
				var exist = false;
				for ( var i2 = 0; i2 < arrJson.items.length; i2++ )
				{
					if(cdm.arrLotid[i] == arrJson.items[i2].id) { exist = true; break; }
				}
				if(!exist) { pool_pop[pool_pop.length] = { id : cdm.arrLotid[i], empty : true }; }
			}
			
			loadObjFromXML(arrJson, cdm);
		}, 
		error: function(json)
		{
			console.log('error', cdm);
		}
	});	
}


// подготавливаем полученный json 
function loadObjFromXML(arrJson, cdm)
{
	var pool_xml = [];
	var url = [];
	
	// ищем дочерние объекты (есть у составных дверей) и добавляем к общий массив
	if(arrJson.children_items) { for ( var i = 0; i < arrJson.children_items.length; i++ ) { arrJson.items.push(arrJson.children_items[i]); } }
	
	
	for ( var i = 0; i < arrJson.items.length; i++ ) 
	{  			
		var json = upResJson(arrJson.items[i]);
		
		var n = pool_xml.length;
		pool_xml[n] = json;
		if(pool_xml[n].fileJson) { if(pool_xml[n].fileJson != '') { url[url.length] = n; } }
	}
	
	if(url.length > 0)
	{ 
		getJsonModel_A2(url, 0, cdm, pool_xml);
	}
	else
	{ 
		loadPopObj_XML_2(cdm, pool_xml);
	}	
}


// обрабатываем json
function upResJson(json)
{
	json.preview = (json.preview == '') ? '' : 'https:'+json.preview;
	if(json.sourceImageURL) { json.sourceImageURL = 'https:'+makeThumbUrl(json.sourceImageURL, 256); }			
	if((/,/i).test( json.filters )) { json.filters = json.filters.split(','); }
	else { var f = []; f[0] = parseFloat(json.filters); json.filters = f; }			
	if((/,/i).test( json.size )) { var size = json.size.split(','); json.size = new THREE.Vector3(parseFloat(size[0]),parseFloat(size[1]),parseFloat(size[2])); }

	if(json.type == 'material') { json.size.x = 1/json.size.x; json.size.y = 1/json.size.y; };
	
	return json;
}


// скачиваем с сервера json 3D модели
function getJsonModel_A2(url, num, cdm, pool_xml)
{	
	var n = url[num];
	var count = url.length;
	
	$.ajax
	({
		url: pool_xml[n].fileJson,
		type: 'GET',
		dataType: 'json',
		success: function(json) 
		{ 
			num += 1; 
			pool_xml[n].fileJson = json; 
			if(count == num) { loadPopObj_XML_2(cdm, pool_xml) }	// после того, как скачали все модели добавляем в хранилище
			else 
			{ 
				getJsonModel_A2(url, num, cdm, pool_xml); 				
			}

			if(cdm.mess) 
			{
				if(cdm.mess == 'loadXML') createObjNewFile(cdm.jsonXML, pool_xml[n].id);					 
			}			
		},		
		error: function(json) {  }		
	});	
}




// сохраняем массив json  в хранилище
function loadPopObj_XML_2(cdm, pool_xml)
{		
	// добавляем массив json  в хранилище
	for ( var i = 0; i < pool_xml.length; i++ ) { pool_pop[pool_pop.length] = pool_xml[i]; }
	
	// находим в массиве лотах дочерние лоты (в компонентах) и заносим в массив новых лот
	var arrLotid = [];
	for ( var i = 0; i < pool_xml.length; i++ )
	{
		if(pool_xml[i].components)
		{
			for ( var i2 = 0; i2 < pool_xml[i].components.length; i2++ )
			{
				if(!pool_xml[i].components[i2].lots) continue;
				arrLotid[arrLotid.length] = pool_xml[i].components[i2].lots[0];
			}
		}
	}
	

	if(arrLotid.length > 0) { cdm.arrLotid = arrLotid; addJsonPopBase_1(cdm); }
	else { sendArrJson(cdm); }
}


// после того, как все лоты загружены выполняем следующее действие
function sendArrJson(cdm)
{
	if(cdm.mess)
	{
		if(cdm.mess == 'loadXML') { loadFilePL(cdm.jsonXML, cdm.wall); }
		else if(cdm.mess == 'DoorPattern') { parseJsonDoorCompile2( cdm ); }
		else if(cdm.mess == 'new obj') { loadPopObj_1(cdm); }
	}	
}





