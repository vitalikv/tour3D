


var cursorP360 = null;
var arrRayObjsP360 = [];	// объекты на которые будет реагировать луч

var listTextureCube = [];
var idealScreenMat = null;



function getXmlPanorama360(file) 
{
	var countReadyCam = 0;		// кол-во загруженных панорам
	
	$.ajax
	({
		url: 'panorama360/xmlToJsonPanorama360.php',
		type: 'POST',
		data: { file: file },
		dataType: 'json',
		success: function(json){ console.log(readerJson(json)); },
		error: function(json) {  }
	});	
	
	// забираем из json только нужную инфу
	function readerJson(json)
	{
		var array = [];
		var loader = new THREE.CubeTextureLoader();
		
		for (i = 0; i < json.scene.length; i++)
		{
			var name = json.scene[i]["@attributes"].name;
			
			array[i] = { id : name.split('scene_')[1] };
			
			var img = [];
			img[0] = json.scene[i].image.left["@attributes"].url;
			img[1] = json.scene[i].image.right["@attributes"].url;
			img[2] = json.scene[i].image.up["@attributes"].url;
			img[3] = json.scene[i].image.down["@attributes"].url;
			img[4] = json.scene[i].image.back["@attributes"].url;
			img[5] = json.scene[i].image.front["@attributes"].url;
			
			array[i].tCube = loader.load(img, function(texture)
			{ 
				texture.image[2] = rotateCanvasImagePanorame(texture.image[2]);
				texture.image[3] = rotateCanvasImagePanorame(texture.image[3]);	
				
				countReadyCam++;
				
				console.log(countReadyCam, json.scene.length);
				
				// все понарамы загрузились, запускаем финиш
				if(countReadyCam == json.scene.length) 
				{ 
					listTextureCube = listCubePanorama360();
					
					for ( var i2 = 0; i2 < arrRenderCams.length; i2++ )
					{
						
						//arrRenderCams[i] = { id : arr.cams[i].id, posCam : arr.cams[i].position, posTarget : arr.cams[i].target_position };
					}

					idealScreenMat = createShaderPanorama360();
				
					goTour360(); 
				}
			});						
		}

		return array;
	}
	
	
	// выполняем скрипт после загрузки всех панорам
	function goTour360()
	{
		cursorP360 = createCursorP360();		
		
		for ( var i = 0; i < listTextureCube.length; i++ )
		{
			var cube = new THREE.Mesh( createGeometryCube(0.2, 0.2, 0.2), new THREE.MeshLambertMaterial( { color : 0xffff00 } ) );
			scene.add( cube ); 
			
			cube.position.copy(listTextureCube[i].p);
			cube.position.y = 0;
		}		
		
		if(1==2)
		{
			camera3D.userData.camera.type = 'first';
			newCameraPosition = { positionFirst: listTextureCube[0].p };
			camera3D.position.copy(listTextureCube[0].p);
			showAllWallRender();			
		}

		// накладываем текстуру панорамы и добавляем объект в массив (реагировать на луч)
		for ( var i = 0; i < obj_line.length; i++ )
		{
			obj_line[i].geometry.computeFaceNormals();
			obj_line[i].geometry.computeVertexNormals();
			obj_line[i].material[0] = idealScreenMat;
			obj_line[i].material[1] = idealScreenMat;
			obj_line[i].material[2] = idealScreenMat;
			obj_line[i].updateMatrixWorld();
			
			arrRayObjsP360[arrRayObjsP360.length] = obj_line[i];	// объекты на которые будет реагировать луч
		}

		for ( var i = 0; i < room.length; i++ )
		{
			room[i].material = idealScreenMat;
			ceiling[i].material = idealScreenMat;
			
			arrRayObjsP360[arrRayObjsP360.length] = room[i];
			arrRayObjsP360[arrRayObjsP360.length] = ceiling[i];
		}
		
		for ( var i = 0; i < arr_door.length; i++ )
		{ 
			textureChild360(arr_door[i]); 
		} 
		for ( var i = 0; i < arr_window.length; i++ )
		{ 
			textureChild360(arr_window[i]); 
		} 
		for ( var i = 0; i < arr_obj.length; i++ )
		{ 
			arr_obj[i].material = idealScreenMat;
			arr_obj[i].geometry.computeFaceNormals();
				
			arrRayObjsP360[arrRayObjsP360.length] = arr_obj[i];
		}		

		
		
		// назначаем текстуру всем объектам входящие в родительский (объект из сцены)
		function textureChild360(obj)
		{
			if(obj.userData.door)
			{
				if(obj.userData.door.type == 'DoorEmpty') return;
			}
			
			var childrens = getAllChildrenObj(obj, []);	
			for ( var i = 0; i < childrens.length; i++ ) 
			{ 
				childrens[i].obj.material = idealScreenMat; 
			}
		}

		renderCamera();
	}
	
	
}





function listCubePanorama360()
{
	var list = [];
	
	list[0] = { n : 3, p : new THREE.Vector3(0.7945, 1.3500, 3.9354), t : getTextureCube('') };
	list[1] = { n : 4, p : new THREE.Vector3(1.1068, 1.3500, 2.1951), t : getTextureCube('_2') };
	list[2] = { n : 5, p : new THREE.Vector3(1.3020, 1.3500, 0.1601), t : getTextureCube('_3') };
	list[3] = { n : 6, p : new THREE.Vector3(-1.0904, 1.3500, 1.8717), t : getTextureCube('_4') };
	list[4] = { n : 7, p : new THREE.Vector3(4.2564, 1.3500, 2.0684), t : getTextureCube('_5') };
	
	return list;
}


// создаем шейдер биганто
function createShaderPanorama360()
{
	var fragmentShader = document.getElementById('2d-fragment-shader').text;
	var vertexShader = document.getElementById('2d-vertex-shader').text;
	
	
	
	var uniforms = 
	{ 
		mixAlpha: {type: "f", value: 0},
		tCubePosition0: {type: "v3", value: listTextureCube[0].p},
		tCubePosition1: {type: "v3", value: listTextureCube[1].p},
		uBoxMatrix0: {type: "mat4", value: new THREE.Matrix4()},
		uBoxMatrix1: {type: "mat4", value: new THREE.Matrix4()},
		tCube0: {type: "t", value: listTextureCube[0].t}, 
		tCube1: {type: "t", value: listTextureCube[1].t},
	}
				
				
	var material = new THREE.ShaderMaterial({ fragmentShader: fragmentShader, vertexShader: vertexShader, uniforms: uniforms, transparent: true});

	return material;
}



// загружаем изображение для панорамы
function getTextureCube(str)
{	
	var path = "panorama360/img/";
	var format = str + '.jpg';
	
	var urls = 
	[ 
		path + 'left' + format, path + 'right' + format,
		path + 'up' + format, path + 'down' + format,
		path + 'back' + format, path + 'front' + format,
	];
		
	var loader = new THREE.CubeTextureLoader();	
	//loader.setCrossOrigin('anonymous');
	//loader.setCrossOrigin('');
	var textureCube = loader.load(urls, function(texture)
	{ 
		texture.image[2] = rotateCanvasImagePanorame(texture.image[2]);
		texture.image[3] = rotateCanvasImagePanorame(texture.image[3]);	
	});
	


	return textureCube;
}



// поворачиваем 2 изображения (up.jpg и down.jpg) на 180 градусов 
function rotateCanvasImagePanorame(img)
{
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");	
	var imgNew = new Image();
	
	canvas.width = img.width;
	canvas.height = img.height;
	
	var ang = 180; //angle
	var cache = img; //cache the local copy of image element for future reference
	
	ctx.save(); //saves the state of canvas
	ctx.fillStyle = 'rgba(255,255,255,1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);	
	ctx.translate(img.width, img.height); //let translate
	ctx.rotate(Math.PI / 180 * ang); //increment the angle and rotate the image 
	ctx.drawImage(img, 0, 0, img.width, img.height); //draw the image ;)
	ctx.restore(); //restore the state of canvas	
	
	
	imgNew.src = img.src; //img	
	
	var texture = new THREE.Texture(canvas);
	texture.needsUpdate = true;		
	
	return texture.image;
}



var tour3D = resetTour();
function resetTour()
{
	return { o : false, pos : new THREE.Vector3(), keyCode : 51, speed : 0.04 };
}




// плавное перемещение от точки к точки
function moveOnPoint()
{
	if ( !tour3D.o ) return;
	
	camera3D.position.lerp(tour3D.pos, tour3D.speed);

	var d = camera3D.position.distanceTo( tour3D.pos );

	idealScreenMat.uniforms['mixAlpha'].value = getInterpolationsFloat( 1-d/tour3D.dist, 0, 0.8, 1 );
	
	//console.log(idealScreenMat.uniforms['mixAlpha'].value);
	
	if(comparePos(camera3D.position, tour3D.pos)) 
	{ 
		idealScreenMat.uniforms['mixAlpha'].value = 1;
		
		tour3D.o = false;
		tour3D.speed = 0.04;		
		console.log('STOP'); 
	};
	
	renderCamera();
}






// интерполяция чисел 0-1
function getInterpolationsFloat(t, p0, p1, p2)
{
	function QuadraticBezierP0( t, p ) { var k = 1 - t; return k * k * p; }
	function QuadraticBezierP1( t, p ) { return 2 * ( 1 - t ) * t * p; }
	function QuadraticBezierP2( t, p ) { return t * t * p; }

	return QuadraticBezierP0( t, p0 ) + QuadraticBezierP1( t, p1 ) + QuadraticBezierP2( t, p2 );		
}


 
 

// находим ближайшую точку (позицию камеры) при перемещение с клавиатуры 
function getNearPositionCam360(keyCode)
{
	//if (tour3D.o) { tour3D.speed = 0.1; return; }
	
	if(keyCode == 87 || keyCode == 38)
	{
		var x = Math.sin( camera.rotation.y );
		var z = Math.cos( camera.rotation.y );
		var dir = new THREE.Vector3( -x, 0, -z ).normalize();		
	}
	else if(keyCode == 83 || keyCode == 40)
	{
		var x = Math.sin( camera.rotation.y );
		var z = Math.cos( camera.rotation.y );
		var dir = new THREE.Vector3( x, 0, z );		
	}
	else if (keyCode == 65 || keyCode == 37) 
	{
		var x = Math.sin( camera.rotation.y - 1.5707963267948966 );
		var z = Math.cos( camera.rotation.y - 1.5707963267948966 );
		var dir = new THREE.Vector3( x, 0, z );
	}
	else if (keyCode == 68 || keyCode == 39) 
	{
		var x = Math.sin( camera.rotation.y + 1.5707963267948966 );
		var z = Math.cos( camera.rotation.y + 1.5707963267948966 );
		var dir = new THREE.Vector3( x, 0, z );
	}
	else 
	{
		return;
	}
	
	if(1==2)
	{
		var lineHelper_1 = new THREE.ArrowHelper(dir, camera.position, 5, 0x00ff00 );
		lineHelper_1.position.y = 0.2;
		scene.add( lineHelper_1 );		
	}			
	
	for ( var i = 0; i < listTextureCube.length; i++ )
	{
		listTextureCube[i].dist = 9999;
		listTextureCube[i].angle = 0;
		
		var pos = listTextureCube[i].p;
		
		// точка на которой стоим
		if(comparePos(tour3D.pos, pos)) 
		{
			listTextureCube[i].dist = 999999;	// ставим max значение, чтобы после sort, был в конце
			continue;
		}			
		
		// угол между направление движения и новой позиции камеры
		var dir_1 = new THREE.Vector3( pos.x - camera.position.x, 0, pos.z - camera.position.z ).normalize();
		listTextureCube[i].angle = THREE.Math.radToDeg( Math.acos(dir.x * dir_1.x + dir.z * dir_1.z) );
		if(listTextureCube[i].angle > 25) continue;			

		
		// расстояние до позиции камеры, нужно для sort
		listTextureCube[i].dist = new THREE.Vector3(pos.x, 0, pos.z).distanceTo( new THREE.Vector3(camera.position.x, 0, camera.position.z) );			
	}

	listTextureCube.sort(function (a, b) { return a.dist - b.dist });
	
	if(listTextureCube[0].angle < 25)
	{
		// куда идем
		tour3D.pos.copy(listTextureCube[0].p);	
		tour3D.dist = camera.position.distanceTo( tour3D.pos );		
		idealScreenMat.uniforms[ "tCube1" ].value = listTextureCube[0].t;	
		idealScreenMat.uniforms.tCubePosition1.value = listTextureCube[0].p;	
		
		// откуда идем
		idealScreenMat.uniforms[ "tCube0" ].value = listTextureCube[listTextureCube.length - 1].t;
		idealScreenMat.uniforms.tCubePosition0.value = listTextureCube[listTextureCube.length - 1].p;

		idealScreenMat.uniforms['mixAlpha'].value = 0;
		tour3D.o = true;			
	}
}
	

// находим ближайшую точку (позицию камеры) при перемещение с клика
function getNearMousePositionCam360(event)
{
	var intersects = rayIntersect( event, arrRayObjsP360, 'arr' );

	if(intersects.length == 0) return;

	var pos = intersects[ 0 ].point.clone();
	pos.y = 0;
	

	for ( var i = 0; i < listTextureCube.length; i++ )
	{
		listTextureCube[i].dist = 9999;
		listTextureCube[i].angle = 0;
		
		var pos2 = listTextureCube[i].p;
		
		// точка на которой стоим
		if(comparePos(tour3D.pos, pos2)) 
		{
			listTextureCube[i].dist = 999999;	// ставим max значение, чтобы после sort, был в конце
			continue;
		}					
		
		// расстояние до позиции камеры, нужно для sort
		listTextureCube[i].dist = new THREE.Vector3(pos2.x, 0, pos2.z).distanceTo( pos );			
	}

	listTextureCube.sort(function (a, b) { return a.dist - b.dist });
	
	// куда идем
	tour3D.pos.copy(listTextureCube[0].p);	
	tour3D.dist = camera.position.distanceTo( tour3D.pos );		
	idealScreenMat.uniforms[ "tCube1" ].value = listTextureCube[0].t;	
	idealScreenMat.uniforms.tCubePosition1.value = listTextureCube[0].p;	
	
	// откуда идем
	idealScreenMat.uniforms[ "tCube0" ].value = listTextureCube[listTextureCube.length - 1].t;
	idealScreenMat.uniforms.tCubePosition0.value = listTextureCube[listTextureCube.length - 1].p;

	idealScreenMat.uniforms['mixAlpha'].value = 0;
	tour3D.o = true;			
}



// создаем круг для курсора
function createCursorP360()
{	
	var circle = createCircleSpline();
	
	function createCircleSpline()
	{
		var count = 48;
		var circle = [];
		var g = (Math.PI * 2) / count;
		
		for ( var i = 0; i < count; i++ )
		{
			var angle = g * i;
			circle[i] = new THREE.Vector3();
			circle[i].x = Math.sin(angle);
			circle[i].y = Math.cos(angle);
			//circle[i].y = 0;
		}

		return circle;
	}

	var n = 0;
	var v = [];
	
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.1 );
		v[n].z = 0.001;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].z = 0.001;
		n++;
		
		v[n] = v[n - 2].clone();
		v[n].z = -0.001;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].z = -0.001;
		n++;		
	}	

	
	var obj = new THREE.Mesh( createGeometryCircle(v), new THREE.MeshLambertMaterial( { color : 0x00ff00, transparent: true, opacity: 0.5 } ) ); 
	obj.userData.tag = 'cursorP360';
	obj.renderOrder = 1;
	obj.position.set(0,0,0);
	//obj.visible = false;	
	scene.add( obj );
	
	return obj;
}





// при перемещение курсора перетаскивается круг
function mouseRayPanorama360(event)
{ 
	var intersects = rayIntersect( event, arrRayObjsP360, 'arr' );

	if(intersects.length == 0) return;
	
	//console.log(intersects[ 0 ].face.normal);	
	cursorP360.position.set( 0, 0, 0 );
	
	var normalMatrix = new THREE.Matrix3().getNormalMatrix( intersects[ 0 ].object.matrixWorld );
	var normal = intersects[ 0 ].face.normal.clone().applyMatrix3( normalMatrix ).normalize();
	
	cursorP360.lookAt( normal );
	cursorP360.position.copy( intersects[ 0 ].point );		
}


