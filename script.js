var w_w = window.innerWidth;
var w_h = window.innerHeight;
var aspect = w_w/w_h;
var d = 5;

var renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, /*antialias : true*/});
renderer.localClippingEnabled = true;
//renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( w_w, w_h );
//renderer.setClearColor (0xffffff, 1);
//renderer.setClearColor (0x9c9c9c, 1);
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

//----------- cameraTop
var cameraTop = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraTop.position.set(0, 10, 0);
cameraTop.lookAt(scene.position);
cameraTop.userData.tag = 'cameraTop';
//----------- cameraTop


//----------- camera3D
var camera3D = new THREE.PerspectiveCamera( 95, w_w / w_h, 0.2, 1000 );  
camera3D.rotation.order = 'YZX';		//'ZYX'
camera3D.position.set(5, 7, 5);
camera3D.lookAt(scene.position);
camera3D.rotation.z = 0;
camera3D.userData.tag = 'camera3D';
camera3D.userData.camera = { type : 'fly', height : camera3D.position.y, startProject : true, rot360 : { start : false, angle : 0, qEnd : null } };
//----------- camera3D




//----------- cameraWall
var cameraWall = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
cameraWall.zoom = 2;
cameraWall.userData.tag = 'cameraWall';
//----------- cameraWall


//----------- Light 
scene.add( new THREE.AmbientLight( 0xffffff, 0.7 ) ); 


var directionalLight = new THREE.DirectionalLight( 0xcccccc, 0.3 );
//var directionalLight = new THREE.PointLight( 0xffffff, 0.5 );
//directionalLight.castShadow = true;
directionalLight.position.set(-5,6,5);
directionalLight.lookAt(scene.position);
//scene.add( directionalLight );
//----------- Light


var cubes = [];
for ( var i = 0; i < 0; i++ )
{
	cubes[i] = new THREE.Mesh( createGeometryCube(0.07, 0.07, 0.07), new THREE.MeshLambertMaterial( { color : 0xff0000, transparent: true, opacity: 1, depthTest: false } ) );
	scene.add( cubes[i] ); 		 
}


var cubObj = null;
var cubObj2 = null;
var reflectionCube = null;
var reflectionCube2 = null;


if(1==2)
{
	var path = "https://threejs.org/examples/textures/cube/SwedishRoyalCastle/";
	var format = '.jpg';
	var urls = [ 
	path + 'px' + format, path + 'nx' + format,
	path + 'ny' + format, path + 'py' + format,
	path + 'pz' + format, path + 'nz' + format
	];
	var reflectionCube = new THREE.CubeTextureLoader().load( urls );
	reflectionCube.format = THREE.RGBFormat;
	// Create car
	var chromeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: reflectionCube, lightMap : lightMap_1, side: THREE.DoubleSide} );
	var car = new THREE.Mesh( new THREE.BoxGeometry( 121, 61, 71 ), chromeMaterial );
	scene.add( car );
	
}

// Update the render target cube




// Render the scene



// показать все переменные
if(1==2)
{	
	for (var prop in window) 
	{
		if (window.hasOwnProperty(prop)) { console.log(prop, window[prop]); }
	}
} 

if(1==2)
{
	var cube2 = new THREE.Mesh( createGeometryCube(1.2, 1.2, 1.2), new THREE.MeshLambertMaterial( { color : 0xffff00 } ) );

	for ( var i = 0; i < cube2.geometry.faces.length; i++ ) 
	{	
		var color = new THREE.Color( 0xffffff ).setHSL( Math.random(), 0.5, 0.5 );
		cube2.geometry.faces[ i ].vertexColors[0] = color;	
		cube2.geometry.faces[ i ].vertexColors[1] = color;
		cube2.geometry.faces[ i ].vertexColors[2] = color;
//clipGeometry.faces[ i ].color.set(0xe5e5e5);		
	}

	//console.log(cube2.geometry.faces);
	//geometry.colorsNeedUpdate = true;
	scene.add( cube2 ); 	
}

var selectedObjects = [];

//----------- render
function animate() 
{
	requestAnimationFrame( animate );
	
	stats.begin();
	
	previewRender360();
	cameraZoomTopLoop();	
	moveCameraToNewPosition();
	offsetTexture();
	
	//renderer.clearDepth();
	updateKeyDown();

	stats.end();
}



function renderCamera()
{
	drawRender();
}


var lastFrameTime = new Date().getTime();

var moveTexture = { };

function drawRender()
{
	if (new Date().getTime() - lastFrameTime < 20) console.log(new Date().getTime() - lastFrameTime);
	//if ( new Date().getTime() - lastFrameTime < 20 ) return;
	//lastFrameTime = new Date().getTime(); 
	
	camera.updateMatrixWorld();		
	
	if (selectedObjects.length > 0) 
	{
		renderer.autoClear = false;
		changeVisibilityOfSelectedObjects( false );
		renderer.render( scene, camera, depthTexture, true );
		changeVisibilityOfSelectedObjects( true );

		changeVisibilityOfNonSelectedObjects( false );
		scene.overrideMaterial = maskMaterial;
		maskMaterial.uniforms[ "cameraNearFar" ].value = new THREE.Vector2( camera.near, camera.far );
		maskMaterial.uniforms[ "depthTexture" ].value = depthTexture.texture;
		renderer.render( scene, camera, maskTexture, true );
		scene.overrideMaterial = null;
		changeVisibilityOfNonSelectedObjects( true );

		edgeDetectionMaterial.uniforms[ "maskTexture" ].value = maskTexture.texture;
		edgeDetectionMaterial.uniforms[ "texSize" ].value = new THREE.Vector2( size.width, size.height );

		renderer.render( scene, camera, outlineQuadTexture, true );

		postProcessQuad.material.texture = outlineQuadTexture.texture;

		renderer.clear();
		renderer.render( scene, camera );
		renderer.render( outlineScene, outlineCamera );
		
	} 
	else 
	{  
		
		
		renderer.autoClear = true;
		renderer.clear();
		renderer.render(scene, camera);
	}
	
	//renderer.clearDepth();
}


//----------- render


//----------- onWindowResize
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize() 
{ 
	var aspect = window.innerWidth / window.innerHeight;
	var d = 5;
	
	cameraTop.left = -d * aspect;
	cameraTop.right = d * aspect;
	cameraTop.top = d;
	cameraTop.bottom = -d;
	cameraTop.updateProjectionMatrix();

	 
	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();
	
	cameraWall.left = -d * aspect;
	cameraWall.right = d * aspect;
	cameraWall.top = d;
	cameraWall.bottom = -d;
	cameraWall.updateProjectionMatrix();
	
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	renderCamera();
}
//----------- onWindowResize






var abo = { wall : {}, window : {}, door : {}, point : {}, room : {}, objPop : {} };

abo.wall = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };
abo.window = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };
abo.door = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };
abo.point = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };
abo.objPop = { create : true, delete : true, click2D : true, click3D : true, move : true, replace : true };


// включаем параметры блокировки различных действий
function assignBlockParam(value)
{
	if(value == undefined) return;
	
	var flag = (value == 0) ? true : false;
	
	abo.wall.click2D = flag;

	abo.point.click2D = flag; 
	abo.point.click3D = flag;

	abo.window.click2D = flag; 
	abo.window.click3D = flag; 

	abo.door.move = flag; 
	abo.door.delete = flag; 	
}


//----------- start


var resolutionD_w = window.screen.availWidth;
var resolutionD_h = window.screen.availHeight;

var kof_rd = 1440 / resolutionD_h;

var camera = cameraTop;

var infProject = { settings : {}, scene : {} };
var fileInfo = { last : {cam : { obj : camera, type : '', pos : new THREE.Vector3(), rot : new THREE.Vector3() }} }; 

var countId = 2;
var levelFloor = 1;
var projName = 'Новый проект';
var projVersion = '1';
var keys = [];
var libs = '92da6c1f72c1ebca456a86d978af1dfc7db1bcb24d658d710c5c8ae25d98ba52';  
//var libs = 'fb5f95f84fa11b73e0ebfa0969de65176902c1b7337652d43537a66a09d7028d';

var height_wall = 3.0;
var width_wall = 0.3;
var obj_point = [];
var obj_line = [];
var arr_window = [];
var arr_door = [];
var arr_obj = [];
var room = [];
var ceiling = [];
var arrWallFront = {};
var actColorWin = new THREE.Color('rgb(255,0,0)');
var colorHover = new THREE.Color('rgb(55, 125, 61)');
var colDoor = 'rgb(166, 151, 99)';
var colWin = 'rgb(122, 160, 195)';
var default_wall_matId = [ { lotid : 4954, color : {r : 93, g : 87, b : 83 }, scale : new THREE.Vector2(1,1) }, { lotid : 4954, color : {r : 93, g : 87, b : 83 }, scale : new THREE.Vector2(1,1) } ];

infProject.settings = { countId : countId, projName : projName, libs : libs, projVersion : projVersion }
infProject.scene.array = { point : obj_point, wall : obj_line, window : arr_window, door : arr_door, room : room, ceiling : ceiling, obj : arr_obj }
infProject.scene.type = {}




var clippingMaskWall = new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 1 );	// маска для стены   
var lightMap_1 = new THREE.TextureLoader().load('img/lightMap_1.png');
var grid_Sm = new THREE.TextureLoader().load('img/UV_Grid_Sm.jpg');

// cutoff боковые отсечки для линеек
// format_1 линейки для отображения длины/высоты стены в режиме cameraWall
// format_2 линейки для окон/мебели
// format_3 нижние размеры между мебелью в режиме cameraWall 
// cube контроллеры для изменения ширины/длины wd
var arrSize = { cutoff : createRulerCutoff(), format_1 : {}, format_2 : {}, format_3 : {line : [], label : []}, cube : createControllWD() };
var labelGeometry_1 = createGeometryPlan2(0.2 * kof_rd, 0.1 * kof_rd); 
arrSize.format_1 = { line : createRulerWin({count : 6, color : 0xcccccc}), label : createLabelCameraWall({ count : 2, text : 100, size : 50, border : 'white', geometry : labelGeometry_1 }) };
arrSize.format_2 = { line : createRulerWin({count : 6, color : 0x000000}), label : createLabelCameraWall({ count : 6, text : 100, size : 50, border : 'border line', geometry : labelGeometry_1 }) };
arrSize.numberTexture = { line : createRulerWin({count : 6, color : 0x000000, material : 'standart'}), label : createLabelCameraWall({ count : 6, text : [1,2,3,4,5,6], materialTop : 'no', size : 85, ratio : {x:256, y:256}, geometry : createGeometryPlan(0.25, 0.25) }) };
var wallVisible = [];
var circle = createCircleSpline();
var p_tool = createToolPoint();
var d_tool = createToolDoorPoint();
// createGrid();
//var pointGrid = createPointGrid(100);
var pointGrid = {visible : true};


var planeMath = createPlaneMath();
var planeMath2 = createPlaneMath2();

var boxPop = createBoxPop();  

var toolHandle = { move : null, rotate : null, scale : null, point : null };
toolHandle.rotate = createGizmo360();
toolHandle.scale = {};
toolHandle.scale.box = boxPop;
toolHandle.scale.cube3D = createControlBoxPop3D();

var geometryLabelWall = createGeometryPlan(0.25 * kof_rd, 0.125 * kof_rd);
var geometryLabelFloor = createGeometryPlan(0.5 * kof_rd, 0.125 * kof_rd);
 

var pivot = createPivot();
var gizmo = createGizmo();
var objectControls = createObjectControlsGroup();
var arrRenderCams = [];
var nameRoomDef = 'Гостиная';
var param_ugol = { file : '', hash : '', key : '', link_render : '', link_save : '', start : false };

var lineAxis_1 = createLineAxis( new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0) );
var lineAxis_2 = createLineAxis( new THREE.Vector3(0,0,0), new THREE.Vector3(1,0,0) );
lineAxis_1.visible = false;
lineAxis_2.visible = false;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
  

var arrOutline = { obj : null, outline : null };	// выделение стены/пола 



//----------- start


$( ".ui-layer" ).mouseout(function(){
	//console.log(333333); 	
});


function createGrid()
{
	var geom_line = new THREE.Geometry();
	var count_grid1 = 100;
	var count_grid2 = (count_grid1 * 0.5) / 2;
	geom_line.vertices.push(new THREE.Vector3( - count_grid2, 0, 0 ) );
	geom_line.vertices.push(new THREE.Vector3( count_grid2, 0, 0 ) );
	linesMaterial = new THREE.LineBasicMaterial( { color: 0xd6d6d6, opacity: .2, linewidth: .1 } );

	for ( var i = 0; i <= count_grid1; i ++ ) 
	{
		var line = new THREE.Line( geom_line, linesMaterial );
		line.position.z = ( i * 0.5 ) - count_grid2;
		line.position.y = -0.01;
		scene.add( line );

		var line = new THREE.Line( geom_line, linesMaterial );
		line.position.x = ( i * 0.5 ) - count_grid2;
		line.position.y = -0.01;
		line.rotation.y = 90 * Math.PI / 180;
		scene.add( line );
	}	
}


function createPointGrid(size) {
  var pointMaterial = new THREE.PointsMaterial({ size: 0.04, color: 0xafafaf });
  var pointGeometry = new THREE.Geometry();
  var x = y = z = 0;
  for (var i = -size; i < size; i++) {
    for (var k = -size; k < size; k++) {
      
      var point = new THREE.Vector3();
      point.x = x + i * 0.5;
      point.y = -0.05;
      point.z = z + k * 0.5;
      
      // pointMaterial.sizeAttenuation = false;
      pointGeometry.vertices.push(point);
    }
  }
  
  var pointGrid = new THREE.Points(pointGeometry, pointMaterial);

  scene.add(pointGrid);
  
  return pointGrid;
}


function createPlaneMath()
{
	var geometry = new THREE.PlaneGeometry( 10000, 10000 );
	var mat_pm = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0, side: THREE.DoubleSide } );
	mat_pm.visible = false; 
	var planeMath = new THREE.Mesh( geometry, mat_pm );
	planeMath.rotation.set(-Math.PI/2, 0, 0);
	planeMath.userData.tag = 'planeMath';	
	scene.add( planeMath );	
	
	return planeMath;
}



function createPlaneMath2()
{
	var geometry = createGeometryCube(10000, 0.0001, 10000);
	var mat_pm = new THREE.MeshLambertMaterial( {color: 0xffff00, transparent: true, opacity: 0.0, side: THREE.DoubleSide } );
	mat_pm.visible = false;
	var planeMath = new THREE.Mesh( geometry, mat_pm );
	planeMath.rotation.set(0, 0, 0);
	planeMath.userData.tag = 'planeMath3';	
	scene.add( planeMath );	
	
	return planeMath;
}
 



function createGeometryPlan(x, y)
{
	var geometry = new THREE.Geometry();
	var vertices = [
				new THREE.Vector3(-x,0,-y),
				new THREE.Vector3(-x,0,y),
				new THREE.Vector3(x,0,y),
				new THREE.Vector3(x,0,-y),
			];

	var faces = [
				new THREE.Face3(0,1,2),
				new THREE.Face3(2,3,0),
			];
	var uvs1 = [
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
			];
	var uvs2 = [
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
			];			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2];
	geometry.computeFaceNormals();
	
	geometry.uvsNeedUpdate = true;
	
	return geometry;
}



function createGeometryPlan2(x, y)
{
	var geometry = new THREE.Geometry();
	var vertices = [
				new THREE.Vector3(-x,-y,0),
				new THREE.Vector3(-x,y,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,-y,0),
			];

	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
			];
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2];
	geometry.computeFaceNormals();
	
	geometry.uvsNeedUpdate = true;
	
	return geometry;
}



function createGeometryCube(x, y, z)
{
	var geometry = new THREE.Geometry();
	x /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,0,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,0,z),
				new THREE.Vector3(x,0,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,0,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}



function createGeometryWD(x, y, z) 
{
	var geometry = new THREE.Geometry();
	x /= 2;
	y /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(-x,-y,z),
				new THREE.Vector3(-x,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,-y,z),
				new THREE.Vector3(x,-y,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(-x,y,-z),
				new THREE.Vector3(-x,-y,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs3 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs4 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(0.95,1),
			];
	var uvs2 = [
				new THREE.Vector2(0.95,1),
				new THREE.Vector2(1-0.95,1),
				new THREE.Vector2(0,0),
			];				


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs3, uvs4, uvs3, uvs4, uvs3, uvs4, uvs1, uvs2, uvs3, uvs4, uvs3, uvs4];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}



function createGeometryWall(x, y, z, pr_offsetZ)
{
	var geometry = new THREE.Geometry();
	
	var h1 = -0.1;
	
	if(1==2)
	{
		var z1 = z / 2 + pr_offsetZ / 2;
		var z2 = -z / 2 + pr_offsetZ / 2;  		
	}
	else
	{
		var z1 = z / 2 + pr_offsetZ;
		var z2 = -z / 2 + pr_offsetZ;  		
	}
		
	var vertices = [
				new THREE.Vector3(0,h1,z1),
				new THREE.Vector3(0,y,z1),
				new THREE.Vector3(0,h1,0),
				new THREE.Vector3(0,y,0),
				new THREE.Vector3(0,h1,z2),
				new THREE.Vector3(0,y,z2),								
								
				new THREE.Vector3(x,h1,z1),
				new THREE.Vector3(x,y,z1),
				new THREE.Vector3(x,h1,0),
				new THREE.Vector3(x,y,0),
				new THREE.Vector3(x,h1,z2),
				new THREE.Vector3(x,y,z2),						
			];	
			
	var faces = [
				new THREE.Face3(0,6,7),
				new THREE.Face3(7,1,0),
				new THREE.Face3(4,5,11),
				new THREE.Face3(11,10,4),				
				new THREE.Face3(1,7,9),
				new THREE.Face3(9,3,1),					
				new THREE.Face3(9,11,5),
				new THREE.Face3(5,3,9),				
				new THREE.Face3(6,8,9),
				new THREE.Face3(9,7,6),				
				new THREE.Face3(8,10,11),
				new THREE.Face3(11,9,8),
				
				new THREE.Face3(0,1,3),
				new THREE.Face3(3,2,0),	

				new THREE.Face3(2,3,5),
				new THREE.Face3(5,4,2),	

				new THREE.Face3(0,2,8),
				new THREE.Face3(8,6,0),

				new THREE.Face3(2,4,10),
				new THREE.Face3(10,8,2),					
			];
	
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];					


			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;	
	
	geometry.faces[0].materialIndex = 1;
	geometry.faces[1].materialIndex = 1;	
	geometry.faces[2].materialIndex = 2;
	geometry.faces[3].materialIndex = 2;	
	
	
	return geometry;
}



function createLineAxis( p1, p2 ) 
{
	var geometry = createGeometryCube(0.5, 0.01, 0.01);
	
	var d = p1.distanceTo( p2 );	
	var v = geometry.vertices;
	
	v[3].x = v[2].x = v[5].x = v[4].x = d;
	v[0].x = v[1].x = v[6].x = v[7].x = 0;
	
	
	var wall = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color : 0xff0000, transparent: true, depthTest: false } ) );
	wall.position.copy( p1 );
	wall.renderOrder = 3;
	scene.add( wall );		

	
	var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);			
	
	wall.position.y = 3;
	
	return wall;
}



function createGeometryPivot(x, y, z)
{
	var geometry = new THREE.Geometry();
	y /= 2;
	z /= 2;
	var vertices = [
				new THREE.Vector3(0,-y,z),
				new THREE.Vector3(0,y,z),
				new THREE.Vector3(x,y,z),
				new THREE.Vector3(x,-y,z),
				new THREE.Vector3(x,-y,-z),
				new THREE.Vector3(x,y,-z),
				new THREE.Vector3(0,y,-z),
				new THREE.Vector3(0,-y,-z),
			];	
			
	var faces = [
				new THREE.Face3(0,3,2),
				new THREE.Face3(2,1,0),
				new THREE.Face3(4,7,6),
				new THREE.Face3(6,5,4),				
				new THREE.Face3(0,1,6),
				new THREE.Face3(6,7,0),					
				new THREE.Face3(1,2,5),
				new THREE.Face3(5,6,1),				
				new THREE.Face3(2,3,4),
				new THREE.Face3(4,5,2),				
				new THREE.Face3(3,0,7),
				new THREE.Face3(7,4,3),
			];
	
	var uvs1 = [
				new THREE.Vector2(0,0),
				new THREE.Vector2(1,0),
				new THREE.Vector2(1,1),
			];
	var uvs2 = [
				new THREE.Vector2(1,1),
				new THREE.Vector2(0,1),
				new THREE.Vector2(0,0),
			];	

			
	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.faceVertexUvs[0] = [uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2, uvs1, uvs2];
	geometry.computeFaceNormals();	
	geometry.uvsNeedUpdate = true;		
	
	return geometry;
}



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
		circle[i].z = Math.cos(angle);
		//circle[i].y = 0;
	}

	return circle;
}

function createToolPoint()
{	
	var n = 0;
	var v = [];
	for ( var i = 0; i < circle.length; i++ )
	{
		v[n] = new THREE.Vector3().addScaledVector( circle[i].clone().normalize(), 0.1 );
		v[n].y = 0;		
		n++;		
		
		v[n] = new THREE.Vector3();
		v[n].y = 0;
		n++;
		
		v[n] = v[n - 2].clone();
		v[n].y = height_wall + 0.01;
		n++;	
		
		v[n] = new THREE.Vector3();
		v[n].y = height_wall + 0.01;
		n++;		
	}	

	
	var obj = new THREE.Mesh( createGeometryCircle(v), new THREE.MeshLambertMaterial( { color : 0x333333, wireframe:false } ) ); 
	obj.userData.tag = 'tool_point';
	obj.renderOrder = 1;
	obj.position.set(0,0,0);
	obj.visible = false;	
	scene.add( obj );
	
	return obj;
}



function createToolDoorPoint()
{
	var mat = new THREE.MeshLambertMaterial( { color : 0x222222 } );	
	var geom = createGeometryCube(0.12, 0.01, 0.12);
	obj = new THREE.Mesh( geom, mat );
	obj.userData.tag = 'd_tool';
	obj.door = null;
	obj.position.set(0,0,0);
	obj.visible = false;
	obj.renderOrder = 1.1;
	scene.add( obj );
	
	return obj;
}



function createForm(cdm) 
{
	var arrP = [];
	resetScene();
	if(cdm == 'shape' || cdm == 'shape1') { var arrP = [new THREE.Vector3(-3,0,-3), new THREE.Vector3(-3,0,3), new THREE.Vector3(3,0,3), new THREE.Vector3(3,0,-3)]; }
	else if(cdm == 'shape2') { var arrP = [new THREE.Vector3(-3,0,-2), new THREE.Vector3(-3,0,2), new THREE.Vector3(3,0,2), new THREE.Vector3(3,0,-2)]; }
	else if(cdm == 'shape3') { var arrP = [new THREE.Vector3(-3,0,-3), new THREE.Vector3(-3,0,3), new THREE.Vector3(0,0,3), new THREE.Vector3(0,0,0), new THREE.Vector3(3,0,0), new THREE.Vector3(3,0,-3)]; }
	else if(cdm == 'shape4') { var arrP = [new THREE.Vector3(-3,0,0), new THREE.Vector3(-3,0,3), new THREE.Vector3(3,0,3), new THREE.Vector3(3,0,-3), new THREE.Vector3(0,0,-3), new THREE.Vector3(0,0,0)]; }	
	else if(cdm == 'shape5') { var arrP = [new THREE.Vector3(-4,0,-1.5), new THREE.Vector3(-4,0,3), new THREE.Vector3(0,0,3), new THREE.Vector3(4,0,3), new THREE.Vector3(4,0,-1.5), new THREE.Vector3(2,0,-1.5), new THREE.Vector3(1,0,-3), new THREE.Vector3(-1,0,-3), new THREE.Vector3(-2,0,-1.5)]; }
	else if(cdm == 'shape6') { var arrP = [new THREE.Vector3(-3,0,-3), new THREE.Vector3(-3,0,0), new THREE.Vector3(0,0,3), new THREE.Vector3(3,0,3), new THREE.Vector3(3,0,-3)]; }
	
	
	for ( var i = 0; i < arrP.length; i++ ) { createPoint( arrP[i], 0 ); }
	
	for ( var i = 0; i < obj_point.length; i++ )
	{
		var i2 = (i == obj_point.length - 1) ? 0 : i + 1;		
		createOneWall3( obj_point[i], obj_point[i2], width_wall, {} );
	}		

	
	if(cdm == 'level_2')
	{
		var arrP1 = [new THREE.Vector3(-3,0,-3), new THREE.Vector3(-3,0,0), new THREE.Vector3(0,0,3), new THREE.Vector3(3,0,3), new THREE.Vector3(3,0,-3),];
		
		var h2 = height_wall + 0.1;
		var arrP2 = [new THREE.Vector3(0,h2,0), new THREE.Vector3(0,h2,3), new THREE.Vector3(3,h2,6), new THREE.Vector3(6,h2,6), new THREE.Vector3(6,h2,0)]; 

		var arrPo1 = [];
		var arrPo2 = [];
		for ( var i = 0; i < arrP1.length; i++ ) { arrPo1[arrPo1.length] = createPoint( arrP1[i], 0 ); }
		for ( var i = 0; i < arrP2.length; i++ ) { arrPo2[arrPo2.length] = createPoint( arrP2[i], 0 ); }
		
		for ( var i = 0; i < arrPo1.length; i++ )
		{
			var i2 = (i == arrPo1.length - 1) ? 0 : i + 1;		
			createOneWall3( arrPo1[i], arrPo1[i2], width_wall, {} );
		}	

		for ( var i = 0; i < arrPo2.length; i++ )
		{
			var i2 = (i == arrPo2.length - 1) ? 0 : i + 1;		
			createOneWall3( arrPo2[i], arrPo2[i2], width_wall, {} );
		}			
	}
	
	if(1==2)
	{
		var roofB = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ), new THREE.MeshLambertMaterial( {color: 0xff0000, transparent: true, opacity: 1, side: THREE.DoubleSide } ) );
		roofB.rotation.set(-Math.PI/4, 0, 0);
		roofB.position.set(0, 6, 0);
		//roofB.userData.tag = 'planeMath';	
		scene.add( roofB );
		
		var roofB = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ), new THREE.MeshLambertMaterial( {color: 0xff0000, transparent: true, opacity: 1, side: THREE.DoubleSide } ) );
		roofB.rotation.set(Math.PI/4, 0, 0);
		roofB.position.set(0, 6, 0);	
		scene.add( roofB );			
	}
	
	
	
	for ( var i = 0; i < obj_point.length; i++ ) { upLineYY(obj_point[i]); }	
	detectRoomZone(nameRoomDef);
	upLabelPlan_1(obj_line);	
	
	width_wall = 0.3;
}





function createPoint( pos, id )
{
	var point = obj_point[obj_point.length] = new THREE.Mesh( p_tool.geometry, new THREE.MeshLambertMaterial( { color : 0x333333, transparent: true, opacity: 0.6 } ) ); 
	point.position.copy( pos );		

	point.w = [];
	point.p = [];
	point.start = [];		
	point.zone = [];
	point.zoneP = [];
	
	
	if(id == 0) { id = countId; countId++; }	
	point.userData.id = id;	
	point.userData.tag = 'point';
	point.userData.point = {};
	point.userData.point.color = point.material.color.clone();
	point.userData.point.cross = null;
	point.userData.point.type = null;
	point.userData.point.last = { pos : pos.clone(), cdm : '', cross : null };
	point.userData.point.actList = abo.point;

	if(!abo.point.click2D) { point.visible = false; }
	
	point.visible = (camera == cameraTop) ? true : false;
	
	scene.add( point );	
	
	return point;
}




//renderer.clippingPlanes = [ clippingMaskWall ];

function createOneWall3( point1, point2, width, cdm ) 
{
	var offsetZ = (cdm.offsetZ) ? cdm.offsetZ : 0;
	var height = (cdm.height) ? cdm.height : height_wall;
	height = (width == 0.01) ? 0.003 : height;
	var matId = (cdm.material) ? cdm.material : default_wall_matId;
	
	var p1 = point1.position;
	var p2 = point2.position;	
	var d = p1.distanceTo( p2 );
	
	var material = new THREE.MeshLambertMaterial( { color : 0xedded4, clippingPlanes : [ clippingMaskWall ], lightMap : lightMap_1 } );		
	var materials = [ new THREE.MeshLambertMaterial( { color: 0x808080, clippingPlanes: [ clippingMaskWall ], lightMap : lightMap_1 } ), material.clone(), material.clone() ];		
	var geometry = createGeometryWall(d, height, width, offsetZ);	
	var wall = obj_line[obj_line.length] = new THREE.Mesh( geometry, materials ); 
 	

	wall.label = [];	
	wall.label[0] = createLabelCameraWall({ count : 1, text : 0, size : 85, ratio : {x:256*2, y:256}, geometry : geometryLabelWall })[0]; 
	wall.label[1] = createLabelCameraWall({ count : 1, text : 0, size : 85, ratio : {x:256*2, y:256}, geometry : geometryLabelWall })[0];
	wall.label[0].visible = (camera == cameraTop) ? true : false;
	wall.label[1].visible = (camera == cameraTop) ? true : false;
	
	wall.position.copy( p1 );
	
	// --------------
	if(!cdm.id) { cdm.id = countId; countId++; }
	
	wall.userData.tag = 'wall';
	wall.userData.id = cdm.id;
	
	wall.userData.wall = {};				
	wall.userData.wall.p = [];
	wall.userData.wall.p[0] = point1;
	wall.userData.wall.p[1] = point2;	
	wall.userData.wall.width = Math.round(width * 100) / 100;
	wall.userData.wall.height_0 = -0.1;
	wall.userData.wall.height_1 = Math.round(height * 100) / 100;		
	wall.userData.wall.offsetZ = Math.round(offsetZ * 100) / 100;
	wall.userData.wall.outline = null;
	wall.userData.wall.arrO = [];
	wall.userData.wall.last = { pos : new THREE.Vector3(), rot : new THREE.Vector3() }; 
	
	var v = wall.geometry.vertices;
	wall.userData.wall.v = [];
	
	for ( var i = 0; i < v.length; i++ ) { wall.userData.wall.v[i] = v[i].clone(); }
	
	wall.userData.material = [];
	var inf = [{lotid : 0, filters : 0}, {lotid : 4954, filters : 1039}, {lotid : 4954, filters : 1039}];
	
	for ( var i = 0; i < inf.length; i++ ) 
	{
		wall.userData.material[i] = {};
		wall.userData.material[i].lotid = inf[i].lotid;
		wall.userData.material[i].color = wall.material[i].color;
		wall.userData.material[i].offset = new THREE.Vector2(0,0);
		wall.userData.material[i].scale = new THREE.Vector2(1,1);
		wall.userData.material[i].filters = inf[i].filters;
		wall.userData.material[i].preview = '';
		wall.userData.material[i].catalog = '';
	}
	
	// --------------
	
	
	wall.userData.wall.actList = abo.wall;
	
	
	if(matId.length > 0) 
	{  
		var inf_1 = { obj: wall, lotid: matId[0].lotid, start : 'load', index : 1, color : matId[0].color, scale : matId[0].scale };
		var inf_2 = { obj: wall, lotid: matId[1].lotid, start : 'load', index : 2, color : matId[1].color, scale : matId[1].scale };
		
		if(matId[0].rotation) { inf_1.rotation = matId[0].rotation; } 
		if(matId[1].rotation) { inf_2.rotation = matId[1].rotation; }
		
		if(matId[0].offset) { inf_1.offset = matId[0].offset; }
		if(matId[1].offset) { inf_2.offset = matId[1].offset; }		
		 
		loadPopObj_1([inf_1]);				 
		loadPopObj_1([inf_2]);
	}			
	
	//console.log(wall);
	
	var dir = new THREE.Vector3().subVectors( p1, p2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);
	
	
	var n = point1.w.length;		
	point1.w[n] = wall;
	point1.p[n] = point2;
	point1.start[n] = 0;	

	
	var n = point2.w.length;		
	point2.w[n] = wall;
	point2.p[n] = point1;
	point2.start[n] = 1;
	
	
	scene.add( wall );
	
	return wall;
}


 

function rayIntersect( event, obj, t ) 
{
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	
	var intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); }
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }	
	
	return intersects;
}




function showObjTool( tag )
{			
	if(camera == cameraWall)
	{
		planeMath.position.copy( clickO.last_obj.position );
		planeMath.rotation.copy( clickO.last_obj.rotation );  		
		hideSizeWD(clickO.obj); 		
	}
	else
	{
		planeMath.position.set( 0, hp, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);			
	}
	
	if(camera == cameraTop) { clickO.obj = null; objDeActiveColor_2D(); } 
}



	


// изменение высоты стен
function changeHeightWall( h2 )
{
	h2 = h2.replace(",", ".");
	if(!isNumeric(h2)) return;  
	h2 = Number(h2);
	
	h2 = h2/units;

	if(h2 < 0.01) { h2 = 0.01; }
	if(h2 > 6) { h2 = 6; }
	h2 = Math.round(h2 * 100) / 100;
	
	height_wall = h2;
	
	clickMovePoint_BSP( obj_line );
	
	for ( var i = 0; i < obj_line.length; i++ )
	{
		var v = obj_line[i].geometry.vertices;
		
		if(v[1].y < 0.005) continue;
			
		v[1].y = h2;
		v[3].y = h2;
		v[5].y = h2;
		v[7].y = h2;
		v[9].y = h2;
		v[11].y = h2;
		obj_line[i].geometry.verticesNeedUpdate = true;
		obj_line[i].geometry.elementsNeedUpdate = true;
		obj_line[i].userData.wall.height_1 = h2;
	}	
	 
	upLabelPlan_1( obj_line );
	clickPointUP_BSP( obj_line );
	

	changeSizePoint();

	
	for ( var i = 0; i < ceiling.length; i++ ) { ceiling[i].position.set( 0, height_wall, 0 ); }
	
	if(camera == cameraWall) 
	{
		var wall = arrWallFront.wall[0].obj;
		detectDirectionWall_1(wall, arrWallFront.wall[0].index, detectRoomWallSide(wall, (arrWallFront.wall[0].index == 1) ? 1 : 0));
		showRuleCameraWall();
	}
	
	changeMenuHeightWall();
	
	renderCamera();
}



// обновляем размер высоты в меню
function changeMenuHeightWall()
{
	var h = height_wall*units;
	
	if(units == 1) { h = Math.round(h * 100) / 100; }
	else { h = Math.round(h); }
	
	UI('ceiling-height').val(h);
}
	

// меняем размер точек
function changeSizePoint()
{
	var v = p_tool.geometry.vertices;	
	var n = 0;
	for ( var i = 0; i < circle.length; i++ )
	{		
		v[ n ] = new THREE.Vector3().addScaledVector( circle[ i ].clone().normalize(), 0.1 / camera.zoom );
		v[ n ].y = 0;
		n++;

		v[ n ] = new THREE.Vector3();
		v[ n ].y = 0;
		n++;
		
		v[ n ] = v[ n - 2 ].clone();
		v[ n ].y = height_wall + 0.01;
		n++;

		v[ n ] = new THREE.Vector3();
		v[ n ].y = height_wall + 0.01;
		n++; 		
	}	
	p_tool.geometry.verticesNeedUpdate = true;
	p_tool.geometry.elementsNeedUpdate = true;
}	
	
	
	

var doorPatternLength_1 = 0;
var doorPatternLength_2 = 0;



	

// нажали на кнопку интерфейса, загружаем объект	
function clickButton( event )
{
	if(!clickO.button) return;
	
	if(camera == cameraTop)
	{
		planeMath.position.set(0, 0, 0);
		planeMath.rotation.set(-Math.PI/2, 0, 0);
	}

	var intersects = rayIntersect( event, planeMath, 'one' );
	
	
	if ( intersects.length > 0 )
	{
		if ( camera == cameraTop ) { clickO.obj = null; hideMenuObjUI_2D( clickO.last_obj ); clickO.last_obj = null; }	// снимаем выделение с последнего объекта
		
		if(isNumeric(clickO.button))
		{  
			loadPopObj_1({ lotid: clickO.button });
		}
		else
		{ 
			var point = createPoint( intersects[0].point, 0 );
			point.position.y = 0;
			point.userData.point.type = clickO.button; 
			obj_selected = point;

			if(point.userData.point.type == 'create_zone') { point.userData.point.type = 'create_wall'; }
		}		
		
		clickO.buttonAct = clickO.button;
		clickO.button = null;
	}
	
}	
	

	
// переключаем инструменты перемещения/вращения/масштабирование	
function switchMoveRotateScale(cdm)
{  
	var obj = clickO.last_obj;
	
	if(!obj) return;
	
	if(obj.userData.tag == 'move_control') { obj = objectControls.userData.objPop; }
	if(obj.userData.tag == 'gizmo') { obj = objectControls.userData.objPop; }
	if(obj.userData.tag == 'gizmo360') { obj = param_pivot.obj; }
	
	if(obj.userData.tag != 'obj') return;	
	if(!obj.userData.obj3D.boxPop) return; 	
	
	
	if(cdm == 87) { obj.userData.obj3D.controller = 'pivot'; }			// move
	else if(cdm == 69) { obj.userData.obj3D.controller = 'rotate'; }	// rotate	 
	else if(cdm == 82) { obj.userData.obj3D.controller = 'scale'; }		// scale
	else { return; }
	
	
	hidePivotGizmo_2();			// скрываем pivot/rotate/scale у предыддущего obj (если они были показаны)	
	showToolHandle(obj);		// показываем pivot/rotate/scale
	
	renderCamera();

}	
	



var dir_y = new THREE.Vector3(0, 1, 0);
var qt_plus_y = quaternionDirection( new THREE.Vector3(0, 1, 0) );



//----------- Math			
function localTransformPoint(dir1, qt)
{	
	return dir1.clone().applyQuaternion( qt.clone().inverse() );
}


function worldTransformPoint(dir1, dir_local)
{	
	var qt = quaternionDirection(dir1);			
	return dir_local.applyQuaternion( qt );
}


function quaternionDirection(dir1)
{
	var mx = new THREE.Matrix4().lookAt( dir1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0) );
	return new THREE.Quaternion().setFromRotationMatrix(mx);	
}
//----------- Math
 


// screenshot
function saveAsImage(cdm) 
{
	try 
	{
		pointGrid.visible = false;		
		renderer.setSize( 400, 226 );
		renderer.render( scene, camera );		
		
		var strMime = "image/jpeg";
		var imgData = renderer.domElement.toDataURL(strMime, 0.7);
	
		pointGrid.visible = true;	
		renderer.setSize( w_w, w_h );
		renderer.render( scene, camera );		
 
		if(cdm.open) { openFileImage(imgData.replace(strMime, "image/octet-stream"), "test.jpg"); }
		if(cdm.binary) { return atob(imgData.split('base64,')[1]); }
	} 
	catch (e) 
	{
		console.log(e);
		return;
	}
}

// открыть или сохранить screenshot
var openFileImage = function (strData, filename) 
{
	var link = document.createElement('a');
	
	if(typeof link.download === 'string') 
	{
		document.body.appendChild(link); //Firefox requires the link to be in the body
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link); //remove the link when done
	} 
	else 
	{
		location.replace(uri);
	}
} 
 


	 
//https://catalog.planoplan.com/api/v2.1/search/?keys[0]=92da6c1f72c1ebca456a86d978af1dfc7db1bcb24d658d710c5c8ae25d98ba52&id[0]=13256&lang=ru
//https://catalog.planoplan.com/lots/search/?keys[0]=92da6c1f72c1ebca456a86d978af1dfc7db1bcb24d658d710c5c8ae25d98ba52&id[0]=9337&lang=ru
//https://catalog.planoplan.com/api/v2.1/search/?keys[0]=fb5f95f84fa11b73e0ebfa0969de65176902c1b7337652d43537a66a09d7028d&id[0]=13256&lang=ru

		
// определение размера Json файла
function roughSizeOfObject( object ) {

    var objectList = [];
    var stack = [ object ];
    var bytes = 0;

    while ( stack.length ) {
        var value = stack.pop();

        if ( typeof value === 'boolean' ) {
            bytes += 4;
        }
        else if ( typeof value === 'string' ) {
            bytes += value.length * 2;
        }
        else if ( typeof value === 'number' ) {
            bytes += 8;
        }
        else if
        (
            typeof value === 'object'
            && objectList.indexOf( value ) === -1
        )
        {
            objectList.push( value );

            for( var i in value ) {
                stack.push( value[ i ] );
            }
        }
    }
    return bytes;
}


// конвертация bytes в KB/MB
function formatSizeUnits(bytes){
      if      (bytes>=1073741824) {bytes=(bytes/1073741824).toFixed(2)+' GB';}
      else if (bytes>=1048576)    {bytes=(bytes/1048576).toFixed(2)+' MB';}
      else if (bytes>=1024)       {bytes=(bytes/1024).toFixed(2)+' KB';}
      else if (bytes>1)           {bytes=bytes+' bytes';}
      else if (bytes==1)          {bytes=bytes+' byte';}
      else                        {bytes='0 byte';}
      return bytes;
}



$(document).ready(function () 
{
	param_ugol.start = true;
	UIInvokeFunction('EditorReady');
});

		
console.log( detectBrowser() ); 


var stats = new Stats();

animate();
renderCamera();


