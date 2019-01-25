// создаем Gizmo
function createGizmo()
{

	var visibleGizmoGeometry = createCircle( 48, 1.1, 0.01, 0.015 );
	var visibleGizmoMesh;
	var group = new THREE.Object3D();

	var arr = [];
	arr[ 0 ] = [ 'x', new THREE.Vector3( 0, 0, 0 ), 'rgb(150, 150, 150)' ];
	arr[ 1 ] = [ 'y', new THREE.Vector3( 0, 0, Math.PI / 2 ), 'rgb(34, 99, 34)' ];
	arr[ 2 ] = [ 'z', new THREE.Vector3( Math.PI / 2, 0, 0 ), 'rgb(48, 154, 186)' ];

	for ( var i = 0; i < 1; i++ )
	{
		var material = new THREE.MeshLambertMaterial( { color: arr[ i ][ 2 ], transparent: true, opacity: 0.5, depthTest: false } );
		var visibleGizmoMesh = createGizmoMesh( visibleGizmoGeometry, 'gizmo_visible', arr[ i ][ 0 ], arr[ i ][ 1 ], material );
		group.add( visibleGizmoMesh );
	}

	var colliderGeometry = createCircle( 48, 0.9, 0.01, 0.3 );
	var colliderMaterial = new THREE.MeshLambertMaterial( { color: 'rgb(150, 150, 150)', transparent: true, opacity: 0, depthTest: false } );
	var colliderMesh = createGizmoMesh( colliderGeometry, 'gizmo', 'x', new THREE.Vector3( 0, 0, 0 ), colliderMaterial, 'calcBoundingBox' );

	group.add( colliderMesh );

	var gizmoControl = createGizmoControl(
		new THREE.Vector2( 0.5, 0.5 ),
		new THREE.Vector3( -Math.PI / 2, 0, 0 ),
		new THREE.Vector3( 0, 0, -2.1 ),
		'rotate_control'
	);
	var gizmoControl2 = createGizmoControl(
		new THREE.Vector2( 0.5, 0.5 ),
		new THREE.Vector3( -Math.PI / 2, 0, 0 ),
		new THREE.Vector3( 0, 0, 2.1 ),
		'rotate_control'
	);

	group.add( gizmoControl );
	group.add( gizmoControl2 );

	scene.add( group );
	group.visible = false;

	return group;
}





function createGizmoMesh( geometry, tag, axis, rotation, material, boundingBox )
{

	var mesh = new THREE.Mesh( createGeometryCircle( geometry ), material );
	mesh.userData.tag = tag;
	mesh.pr_axis = axis;
	mesh.renderOrder = 2;
	mesh.rotation.set( rotation.x, rotation.y, rotation.z );
	boundingBox && mesh.geometry.computeBoundingBox();

	return mesh;

}


//Создаем стрелочки для гизмо
function createGizmoControl( size, rotation, position, tag )
{

	var geometry = new THREE.PlaneGeometry( size.x, size.y );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, transparent: true, opacity: 1, side: THREE.DoubleSide, depthTest: false } );
	var mesh = new THREE.Mesh( geometry, material );

	new THREE.TextureLoader().load(
		'./images/icons/arrow_double.png',
		function ( image )
		{
			mesh.material.map = image;
			mesh.material.needsUpdate = true;
		}
	)

	mesh.userData.tag = tag;
	mesh.rotation.set( rotation.x, rotation.y, rotation.z );
	mesh.position.set( position.x, position.y, position.z );

	mesh.renderOrder = 10;
	mesh.onBeforeRender = function ( renderer ) { renderer.clearDepth(); };

	return mesh;

}


//Создаем геомтрию гизмо
function createCircle( count, radius, height, width )
{

	var circle = [];
	var g = ( Math.PI * 2 ) / count;

	for ( var i = 0; i < count; i++ )
	{
		var angle = g * i;
		circle[ i ] = new THREE.Vector3();
		circle[ i ].x = Math.sin( angle );
		circle[ i ].z = Math.cos( angle );
		//circle[i].y = 0;
	}

	var kf = height;
	var n = 0;
	var v = [];

	for ( var i = 0; i < circle.length; i++ )
	{
		var dir = circle[ i ].clone().normalize();
		var v1 = new THREE.Vector3().addScaledVector( dir, radius );
		v[ n ] = new THREE.Vector3().addVectors( circle[ i ], v1 );
		v[ n ].y -= kf / 2;
		n++;

		var v1 = new THREE.Vector3().addScaledVector( dir, radius + width );
		v[ n ] = new THREE.Vector3().addVectors( circle[ i ], v1 );
		v[ n ].y -= kf / 2;
		n++;

		v[ n ] = v[ n - 2 ].clone();
		v[ n ].y += kf;
		n++;

		v[ n ] = v[ n - 2 ].clone();
		v[ n ].y += kf;
		n++;
	}

	return v;

}

// vertex для Gizmo
function createGeometryCircle( vertices )
{
	var geometry = new THREE.Geometry();

	var faces = [];

	var n = 0;
	for ( var i = 0; i < vertices.length - 4; i += 4 )
	{
		faces[ n ] = new THREE.Face3( i + 0, i + 4, i + 6 ); n++;
		faces[ n ] = new THREE.Face3( i + 6, i + 2, i + 0 ); n++;

		faces[ n ] = new THREE.Face3( i + 2, i + 6, i + 7 ); n++;
		faces[ n ] = new THREE.Face3( i + 7, i + 3, i + 2 ); n++;

		faces[ n ] = new THREE.Face3( i + 3, i + 7, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 1, i + 3 ); n++;

		faces[ n ] = new THREE.Face3( i + 0, i + 1, i + 5 ); n++;
		faces[ n ] = new THREE.Face3( i + 5, i + 4, i + 0 ); n++;
	}


	faces[ n ] = new THREE.Face3( i + 0, 0, 2 ); n++;
	faces[ n ] = new THREE.Face3( 2, i + 2, i + 0 ); n++;

	faces[ n ] = new THREE.Face3( i + 2, 2, 3 ); n++;
	faces[ n ] = new THREE.Face3( 3, i + 3, i + 2 ); n++;

	faces[ n ] = new THREE.Face3( i + 3, 3, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, i + 1, i + 3 ); n++;

	faces[ n ] = new THREE.Face3( i + 0, i + 1, 1 ); n++;
	faces[ n ] = new THREE.Face3( 1, 0, i + 0 ); n++;



	geometry.vertices = vertices;
	geometry.faces = faces;
	geometry.computeFaceNormals();
	geometry.uvsNeedUpdate = true;

	return geometry;
}

// кликнули на gizmo Global
function clickGizmo( intersect )
{
	var axis = intersect.object.pr_axis;
	param_pivot.pr_axis = axis;


	var obj = param_pivot.obj;
	obj_selected = intersect.object;
	param_obj.vrs1 = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );

	planeMath2.position.set( obj.position.x, intersect.point.y, obj.position.z );
	planeMath2.rotation.set(0, 0, 0);
	

	planeMath2.updateMatrixWorld();
	var dir = planeMath2.worldToLocal( intersect.point.clone() );
	param_obj.rotY = Math.atan2( dir.x, dir.z );

	hideObjectControls();
	UI.setCursor( 'grabbing' );

	param_pivot.click = true;
	
	hideMenuTextureObjPop();
}


function moveGizmo( event )
{
	if( param_pivot.click )
	{
		param_pivot.click = false;
	}
	
	if(infProject.scene.type.startMoveObj)
	{ 
		infProject.scene.type.startMoveObj = false;
		UIInvokeFunction('ObjectMove');	 			
	}	
	
	var intersects = rayIntersect( event, planeMath2, 'one' );

	if ( intersects.length > 0 )
	{
		var obj = param_pivot.obj;
		
		var dir = planeMath2.worldToLocal( intersects[ 0 ].point.clone() );
		var rotY = Math.atan2( dir.x, dir.z );
		
		obj.rotateOnWorldAxis(new THREE.Vector3(0,1,0), rotY - param_obj.rotY);
		 
		param_obj.rotY = rotY;

		gizmo.lookAt( new THREE.Vector3( intersects[ 0 ].point.x, gizmo.position.y, intersects[ 0 ].point.z ) );

		updateObjectControlsPosition( obj );
		updateObjectControlRotation( obj );
	}

}


// поворот ПОП объекта на 45 и 90 градусов
function inputGizmo( angle )
{
	var obj = clickO.last_obj;

	if(obj.userData.tag == 'move_control') { obj = param_pivot.obj; }
	if(obj.userData.tag == 'gizmo') { obj = param_pivot.obj; }	
	
	if(obj.userData.tag != 'obj') return;
		
	var radians = THREE.Math.degToRad( angle );

	( angle === 0 ) ? obj.rotation.y = 0 : obj.rotation.y -= radians;  //сбрасываем поворот, если передали 0
	obj.rotation.x = 0;
	obj.rotation.z = 0;
	// gizmo.rotation.y -= radians;
	objectControls.rotation.y = obj.rotation.y;
	
	if(obj.userData.obj3D.controller == 'scale') { showBoxPop(obj); }
	
	obj.updateMatrixWorld();
	 
	if(camera == cameraWall) { showSizeFormat_3(); showControllWD( arrWallFront.wall[0].obj, obj ); }
	
	renderCamera();
}


//Установка первоначального размера круга
function adjustInitialGizmoSize( object )
{

	if ( typeof object.geometry.boundingBox === 'undefined' || !object.geometry.boundingBox ) object.geometry.computeBoundingBox();

	var max = object.geometry.boundingBox.max.x > object.geometry.boundingBox.max.z ?
		object.geometry.boundingBox.max.x :
		object.geometry.boundingBox.max.z;

	max = max * 0.8;
	if ( max < 0.3 ) max = 0.3;
	if ( max > 0.35 ) max = 0.35;

	gizmo.initialScale = max;
	gizmo.scale.set( max, 1, max );

}


//Изменение размера круга в зависимости от дальности от камеры
function adjustGizmoScale( initialScale )
{
	var initialScale = initialScale ? initialScale : gizmo.initialScale;

	if ( camera === camera3D )
	{
		var k = 1;
		var maxDistance = 4;
		var distance = camera.position.distanceTo( gizmo.position );

		if ( distance < maxDistance ) k = initialScale / ( maxDistance / distance );
		if ( distance >= maxDistance ) k = initialScale;

		gizmo.scale.multiplyScalar( 1 / ( gizmo.scale.x / k ) );
	}
	else if ( camera === cameraTop ) 
	{
		var multiplier = ( initialScale / camera.zoom ) * 1.4;

		gizmo.scale.multiplyScalar( 1 / ( gizmo.scale.x / multiplier ) );
	}


}


//Подсветка при наведении, поворот к мыши
function hlGizmo( rayhit )
{

	for ( var i = 0; i < gizmo.children.length; i++ )
	{
		var children = gizmo.children[ i ];
		if ( children.userData.tag === 'rotate_control' || children.userData.tag === 'gizmo_visible' )
		{
			children.material.opacity = 1;
		}
	}
	var obj = param_pivot.obj;
	if ( !obj ) return;

	gizmo.lookAt( new THREE.Vector3( rayhit.point.x, gizmo.position.y, rayhit.point.z ) );

	UI.setCursor( 'grab' );
	fadeAllObjectControls();

}

function fadeGizmo()
{
	for ( var i = 0; i < gizmo.children.length; i++ )
	{
		var children = gizmo.children[ i ];
		if ( children.userData.tag === 'rotate_control' || children.userData.tag === 'gizmo_visible' )
		{
			children.material.opacity = 0.5;
		}
	}


}


//Удаление подсветки
function removeHlGizmo()
{

	for ( var i = 0; i < gizmo.children.length; i++ )
	{
		var children = gizmo.children[ i ];
		if ( children.userData.tag === 'rotate_control' || children.userData.tag === 'gizmo_visible' )
		{
			children.material.opacity = 1;
		}
	}
	restoreObjectControls();

	UI.setCursor();

}


function hideGizmo()
{

	gizmo.visible = false;

}


function showGizmo()
{

	gizmo.visible = true;

}


function get360Degree( objectRotation ) 
{
	return THREE.Math.radToDeg( getRadians( objectRotation ) );
}

function getRadians( objectRotation ) 
{

	var rotation;
	var rotationY;
	
	if ( typeof objectRotation === 'object' ) 
	{
		rotation = objectRotation.clone();

		if ( rotation.order === 'XYZ' ) 
		{
			rotation.reorder( 'YXZ' );
		}	
		rotationY = rotation.y;
	} 
	else 
	{
		rotationY = objectRotation;
	}

	var  radians = rotationY > 0 ? rotationY : ( 2 * Math.PI ) + rotationY;

	return radians;

}