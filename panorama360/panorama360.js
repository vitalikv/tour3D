





var idealScreenMat = createShaderPanorama360();

// создаем шейдер биганто
function createShaderPanorama360()
{
	//var fragmentShader = document.getElementById('2d-fragment-shader').text;
	//var vertexShader = document.getElementById('2d-vertex-shader').text;
	
	var fragmentShader = document.getElementById('2d-fragment-shader').text;
	var vertexShader = document.getElementById('2d-vertex-shader').text;
	
	var uniforms = 
	{ 
		mixAlpha: {type: "f", value: 1},
		uBoxPosition0: {type: "v3", value: new THREE.Vector3(-1.0092, 1.3500, 6.0727)},
		uBoxPosition1: {type: "v3", value: new THREE.Vector3(-0.9165, 1.3500, 8.7597)},
		uBoxMatrix0: {type: "mat4", value: new THREE.Matrix4()},
		uBoxMatrix1: {type: "mat4", value: new THREE.Matrix4()},
		tCube0: {type: "t", value: 'CubeTexture'}, 
		tCube1: {type: "t", value: 'CubeTexture'},
	}

	uniforms[ "tCube0" ].value = getTextureCube(0);
	uniforms[ "tCube1" ].value = getTextureCube(1);
				
				
	var material = new THREE.ShaderMaterial({ fragmentShader: fragmentShader, vertexShader: vertexShader, uniforms: uniforms, transparent: true});

	return material;
}



// загружаем изображение для панорамы
function getTextureCube(ind)
{	
	var path = "img/";
	var format = '.jpg';
	if(ind==1){format = '_2.jpg';}
	
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



// поворачиваем img на 180 градусов 
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
	return { o : false, pos : new THREE.Vector3() };
}

function moveOnPoint()
{
	if ( !tour3D.o ) return;
	
	camera3D.position.lerp(tour3D.pos, 0.04);

	var d = camera3D.position.distanceTo( tour3D.pos );
		
	
	if(!tour3D.type && 1==1)
	{		
		idealScreenMat.uniforms['mixAlpha'].value = d/tour3D.dist;  			
		
		//if(d < 0.35) tour3D = resetTour();
	}
	if(tour3D.type && 1==1)
	{		
		idealScreenMat.uniforms['mixAlpha'].value = 1-d/tour3D.dist;			
	}
	
	
	if(comparePos(camera3D.position, tour3D.pos)) 
	{ 
		goToNextScene();
		tour3D = resetTour(); 
		console.log('STOP'); 
	};
	
	renderCamera();
}




function goToNextScene()
{
	// set position
	camera.updateMatrixWorld();
	//idealScreenMat.uniforms.posCam.value = camera.position.clone();
	// set alpha
	
	idealScreenMat.uniforms['mixAlpha'].value = tour3D.type;

	idealScreenMat.needsUpdate = true;
	//console.log(idealScreenMat.uniforms['mixAlpha'], idealScreenMat.uniforms['scale0'].value);
}	
 

