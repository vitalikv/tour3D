




var listTextureCube = [];
var idealScreenMat = createShaderPanorama360();


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
	
	listTextureCube = listCubePanorama360();
	
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
		textureCube.image[2] = rotateCanvasImagePanorame(textureCube.image[2]);
		textureCube.image[3] = rotateCanvasImagePanorame(textureCube.image[3]);	
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




function wallCamToCam(e)
{
	if(e.keyCode == 51)
	{
		tour3D.pos.copy(listTextureCube[0].p);	// куда идем
		tour3D.dist = camera.position.distanceTo( tour3D.pos );
		
		idealScreenMat.uniforms[ "tCube1" ].value = listTextureCube[0].t;	// куда идем
		idealScreenMat.uniforms.tCubePosition1.value = listTextureCube[0].p;
	}	
	else if(e.keyCode == 52)
	{
		tour3D.pos.copy(listTextureCube[1].p);
		tour3D.dist = camera.position.distanceTo( tour3D.pos );		
		
		idealScreenMat.uniforms[ "tCube1" ].value = listTextureCube[1].t;		
		idealScreenMat.uniforms.tCubePosition1.value = listTextureCube[1].p;	// куда идем
	}
	else if(e.keyCode == 53)
	{		
		tour3D.pos.copy(listTextureCube[2].p);
		tour3D.dist = camera.position.distanceTo( tour3D.pos );		
		
		idealScreenMat.uniforms[ "tCube1" ].value = listTextureCube[2].t;
		idealScreenMat.uniforms.tCubePosition1.value = listTextureCube[2].p;	// куда идем	
	}
	else if(e.keyCode == 54)
	{		
		tour3D.pos.copy(listTextureCube[3].p);
		tour3D.dist = camera.position.distanceTo( tour3D.pos );		
		
		idealScreenMat.uniforms[ "tCube1" ].value = listTextureCube[3].t;
		idealScreenMat.uniforms.tCubePosition1.value = listTextureCube[3].p;	// куда идем	
	}
	else if(e.keyCode == 55)
	{		
		tour3D.pos.copy(listTextureCube[4].p);
		tour3D.dist = camera.position.distanceTo( tour3D.pos );		
		
		idealScreenMat.uniforms[ "tCube1" ].value = listTextureCube[4].t;
		idealScreenMat.uniforms.tCubePosition1.value = listTextureCube[4].p;	// куда идем	
	}	
	else 
	{
		return;
	}
	
	
	// откуда идем
	if(tour3D.keyCode == 51)
	{
		idealScreenMat.uniforms[ "tCube0" ].value = listTextureCube[0].t;
		idealScreenMat.uniforms.tCubePosition0.value = listTextureCube[0].p;	
	}
	if(tour3D.keyCode == 52)
	{
		idealScreenMat.uniforms[ "tCube0" ].value = listTextureCube[1].t;
		idealScreenMat.uniforms.tCubePosition0.value = listTextureCube[1].p;	
	}
	if(tour3D.keyCode == 53)
	{
		idealScreenMat.uniforms[ "tCube0" ].value = listTextureCube[2].t;
		idealScreenMat.uniforms.tCubePosition0.value = listTextureCube[2].p;	
	}
	if(tour3D.keyCode == 54)
	{
		idealScreenMat.uniforms[ "tCube0" ].value = listTextureCube[3].t;
		idealScreenMat.uniforms.tCubePosition0.value = listTextureCube[3].p;	
	}
	
	
	idealScreenMat.uniforms['mixAlpha'].value = 0;
	tour3D.o = true;
	tour3D.keyCode = e.keyCode;	
}



// интерполяция чисел 0-1
function getInterpolationsFloat(t, p0, p1, p2)
{
	function QuadraticBezierP0( t, p ) { var k = 1 - t; return k * k * p; }
	function QuadraticBezierP1( t, p ) { return 2 * ( 1 - t ) * t * p; }
	function QuadraticBezierP2( t, p ) { return t * t * p; }

	return QuadraticBezierP0( t, p0 ) + QuadraticBezierP1( t, p1 ) + QuadraticBezierP2( t, p2 );		
}


 
 

// находим ближайшую точку (позицию камеры) при перемещение 
function getNearPositionCam360(keyCode)
{
	if (tour3D.o) { tour3D.speed = 0.1; return; }
	
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
		if(comparePos(camera.position, pos)) 
		{
			listTextureCube[i].dist = 999999;	// ставим max значение, чтобы после sort, был в конце
			continue;
		}			
		
		// угол между направление движения и новой позиции камеры
		var dir_1 = new THREE.Vector3( pos.x - camera.position.x, 0, pos.z - camera.position.z ).normalize();
		listTextureCube[i].angle = THREE.Math.radToDeg( Math.acos(dir.x * dir_1.x + dir.z * dir_1.z) );
		if(listTextureCube[i].angle > 20) continue;			

		
		// расстояние до позиции камеры, нужно для sort
		listTextureCube[i].dist = new THREE.Vector3(pos.x, 0, pos.z).distanceTo( new THREE.Vector3(camera.position.x, 0, camera.position.z) );			
	}

	listTextureCube.sort(function (a, b) { return a.dist - b.dist });
	
	console.log(listTextureCube);
	
	if(listTextureCube[0].angle < 20)
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
	

