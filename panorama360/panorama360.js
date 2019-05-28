




var listTextureCube = [];
var idealScreenMat = createShaderPanorama360();


function listCubePanorama360()
{
	var list = [];
	
	list[0] = { p : new THREE.Vector3(0.7945, 1.3500, 3.9354), t : getTextureCube('') };
	list[1] = { p : new THREE.Vector3(1.1068, 1.3500, 2.1951), t : getTextureCube('_2') };
	list[2] = { p : new THREE.Vector3(1.3020, 1.3500, 0.1601), t : getTextureCube('_3') };
	list[3] = { p : new THREE.Vector3(-1.0904, 1.3500, 1.8717), t : getTextureCube('_4') };
	list[4] = { p : new THREE.Vector3(4.2564, 1.3500, 2.0684), t : getTextureCube('_5') };
	
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
	return { o : false, pos : new THREE.Vector3(), keyCode : 51 };
}


// плавное перемещение от точки к точки
function moveOnPoint()
{
	if ( !tour3D.o ) return;
	
	camera3D.position.lerp(tour3D.pos, 0.04);

	var d = camera3D.position.distanceTo( tour3D.pos );

	idealScreenMat.uniforms['mixAlpha'].value = 1-d/tour3D.dist;	
	
	console.log(idealScreenMat.uniforms['mixAlpha'].value);
	
	if(comparePos(camera3D.position, tour3D.pos)) 
	{ 
		camera.updateMatrixWorld();
		idealScreenMat.uniforms['mixAlpha'].value = 1;
		idealScreenMat.needsUpdate = true;
		
		tour3D.o = false; 
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
	
	setUniformsCube0();
	
	idealScreenMat.uniforms['mixAlpha'].value = 0;
	tour3D.o = true;
	tour3D.keyCode = e.keyCode;	
}


// откуда идем
function setUniformsCube0()
{

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
	
}	
 
 

// находим ближайшую точку (позицию камеры) при перемещение 
function getNearPositionCam360()
{
	var lineHelper_1 = new THREE.ArrowHelper(new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 0, 0 ), 5, 0x00ff00 );
	scene.add( lineHelper_1 );
	
	var x = Math.sin( camera.rotation.y );
	var z = Math.cos( camera.rotation.y );
	var dir = new THREE.Vector3( -x, 0, -z ).normalize();		
	
	lineHelper_1.position.copy( camera.position );
	lineHelper_1.position.y = 0.2; 
	lineHelper_1.setDirection( dir );
	
	var A = camera.position.clone(); 
	var B = camera.position.clone().add( new THREE.Vector3().addScaledVector( dir, 20 ) );	
	
	for ( var i = 0; i < listTextureCube.length; i++ )
	{
		var C = spPoint(A, B, listTextureCube[i].p);	// точка пересечния с направлением камеры
		
		var lineHelper_2 = new THREE.ArrowHelper(new THREE.Vector3( 0, 0, 1 ), new THREE.Vector3( 0, 0, 0 ), 5, 0xff0000 );
		scene.add( lineHelper_2 );	

		lineHelper_2.position.copy( listTextureCube[i].p );
		lineHelper_2.position.y = 0.2;
		lineHelper_2.setDirection( new THREE.Vector3( C.x - listTextureCube[i].p.x, 0, C.z - listTextureCube[i].p.z ).normalize() );			
	}

	
}
	

