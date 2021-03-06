var activeHoverControl = null;

function createObjectControlsGroup()
{

	var group = new THREE.Group();
	var x1 = createObjectControl({ size : new THREE.Vector2( 0.3, 0.3 ), axis : 'x', name : 'x' });
	var x2 = createObjectControl({ size : new THREE.Vector2( 0.3, 0.3 ), axis : 'x', name : '-x' });
	var z1 = createObjectControl({ size : new THREE.Vector2( 0.3, 0.3 ), axis : 'z', name : 'z' });
	var z2 = createObjectControl({ size : new THREE.Vector2( 0.3, 0.3 ), axis : 'z', name : '-z' });
	var y1 = createObjectControl({ size : new THREE.Vector2( 0.2, 0.2 ), axis : 'y', name : 'y' });
	
	var x1color = createObjectControl({ size : new THREE.Vector2( 0.3, 0.3 ), axis : 'x', name : 'x', color : 'red' });
	var x2color = createObjectControl({ size : new THREE.Vector2( 0.3, 0.3 ), axis : 'x', name : '-x', color : 'red' });
	var z1color = createObjectControl({ size : new THREE.Vector2( 0.3, 0.3 ), axis : 'z', name : 'z', color : 'blue' });
	var z2color = createObjectControl({ size : new THREE.Vector2( 0.3, 0.3 ), axis : 'z', name : '-z', color : 'blue' });	

	x1.position.set( 1, 0, 0 );
	x1.rotation.set( -Math.PI / 2, 0, 0 );
	x2.position.set( -1, 0, 0 );
	x2.rotation.set( -Math.PI / 2, Math.PI, 0 );
	z1.position.set( 0, 0, -1 );
	z1.rotation.set( -Math.PI / 2, 0, Math.PI / 2 );
	z2.position.set( 0, 0, 1 );
	z2.rotation.set( -Math.PI / 2, 0, -Math.PI / 2 );
	y1.position.set( 0, 1, 0 );
	y1.rotation.set( 0, 0, 0 );
	y1.renderOrder = 11;
	y1.onBeforeRender = function ( renderer ) { renderer.clearDepth(); };

	
	x1color.position.copy(x1.position);
	x1color.rotation.copy(x1.rotation);
	x2color.position.copy(x2.position);
	x2color.rotation.copy(x2.rotation);
	z1color.position.copy(z1.position);
	z1color.rotation.copy(z1.rotation);
	z2color.position.copy(z2.position);
	z2color.rotation.copy(z2.rotation);	
	
	group.controls = 
	{
		x1: x1,
		x2: x2,
		z1: z1,
		z2: z2
	}

	group.yAxis = y1;

	group.add( x1 );
	group.add( x2 );
	group.add( z1 );
	group.add( z2 );
	group.add( x1color );
	group.add( x2color );
	group.add( z1color );
	group.add( z2color );	
	
	x1color.visible = false;
	x2color.visible = false;
	z1color.visible = false;
	z2color.visible = false;
	
	
	group.userData.control = {};
	group.userData.control.x = [x1, x2];
	group.userData.control.z = [z1, z2];
	group.userData.control.x2 = [x1color, x2color];
	group.userData.control.z2 = [z1color, z2color];	
	
	group.visible = false;
	group.yAxis.visible = false;
	scene.add( group );

	return group;

}


function createObjectControl( cdm )
{
	var size = cdm.size;
	var axis = cdm.axis;
	var name = cdm.name;
	
	var geometry = new THREE.PlaneGeometry( size.x, size.y );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, transparent: true, opacity: 1, side: THREE.DoubleSide, depthTest: false } );
	var control = new THREE.Mesh( geometry, material );
	var src = '';

	control.userData.tag = 'move_control';
	control.userData.objPop = null;
	control.pr_axis = axis;
	control.name = name;

	if ( axis == 'x' || axis == 'z' ) 
	{ 
		src = './images/icons/arrow_single.png';
		
		if(cdm.color == 'red') { src = './images/icons/arrow_single_red.png'; }
		else if(cdm.color == 'blue') { src = './images/icons/arrow_single-blue.png'; }
	}
	else if ( axis == 'y' ) { src = './images/icons/arrow_black-round.png'; }

	new THREE.TextureLoader().load
	(
		src,
		function ( image )
		{
			control.material.map = image;
			control.material.needsUpdate = true;
		}
	);

	scene.add( control );

	return control;

}

function showObjectControls( obj )
{

	setObjectControlsPosition( obj );
	objectControls.visible = true;

	if(obj.userData.obj3D)
	{
		if(obj.userData.obj3D.boxPop)
		{
			objectControls.userData.control.x[0].visible = false;
			objectControls.userData.control.x[1].visible = false;
			objectControls.userData.control.z[0].visible = false;
			objectControls.userData.control.z[1].visible = false;
			
			objectControls.userData.control.x2[0].visible = true;
			objectControls.userData.control.x2[1].visible = true;
			objectControls.userData.control.z2[0].visible = true;
			objectControls.userData.control.z2[1].visible = true;			
		}
		else
		{
			objectControls.userData.control.x[0].visible = true;
			objectControls.userData.control.x[1].visible = true;
			objectControls.userData.control.z[0].visible = true;
			objectControls.userData.control.z[1].visible = true;

			objectControls.userData.control.x2[0].visible = false;
			objectControls.userData.control.x2[1].visible = false;
			objectControls.userData.control.z2[0].visible = false;
			objectControls.userData.control.z2[1].visible = false;				
		}
	}
	
	if ( camera !== cameraTop ) objectControls.yAxis.visible = true;
	updateObjectControlRotation();

	UI.setCursor();

}

function hideObjectControls()
{

  objectControls.visible = false;
  objectControls.yAxis.visible = false;

}

function setObjectControlsPosition( object )
{
	if ( !object ) return;
	if ( !object.geometry.boundingBox ) object.geometry.computeBoundingBox();

	var x = object.geometry.boundingBox.max.x;
	var z = object.geometry.boundingBox.max.z;
	var y = object.geometry.boundingBox.max.y;
	var offset = 0.3;

	x = x > 0.2 ? 0.2 : x;
	z = z > 0.2 ? 0.2 : z;

	objectControls.position.copy( object.position );
	
	var dir = object.getWorldDirection(new THREE.Vector3());
	var rotY = Math.atan2(dir.x, dir.z);	
	objectControls.rotation.set( 0, rotY, 0 );

	for ( var i = 0; i < objectControls.children.length; i++ )
	{
		var axis = objectControls.children[ i ];
		var vector;
		switch ( axis.name )
		{
			case 'x':
				vector = new THREE.Vector3( x + offset, 0, 0 );
			break;
			case '-x':
				vector = new THREE.Vector3( -x - offset, 0, 0 );
			break;
			case 'z':
				vector = new THREE.Vector3( 0, 0, -z - offset );
			break;
			case '-z':
				vector = new THREE.Vector3( 0, 0, z + offset );
			break;
			case 'y':
				vector = new THREE.Vector3( 0, y + offset, 0 );
				axis.rotation.set( 0, 0, 0 );
			break;
		}
		axis.position.copy( vector );
	}
	
	objectControls.yAxis.position.copy( new THREE.Vector3( object.position.x, object.position.y + y + 0.6, object.position.z ) );
	adjustObjectControlsScale();
	updateObjectControlRotation();
}

function updateObjectControlsPosition( object )
{
	objectControls.position.copy( object.position );
	objectControls.yAxis.position.copy( new THREE.Vector3( object.position.x, objectControls.yAxis.position.y, object.position.z ) );

	var dir = object.getWorldDirection(new THREE.Vector3());
	var rotY = Math.atan2(dir.x, dir.z);	
	objectControls.rotation.set( 0, rotY, 0 );	
}

function clickObjectControls( rayhit )
{
	if ( !param_pivot.obj ) return;
	obj_selected = rayhit.object;

	var position = objectControls.position;
	var axis = rayhit.object.pr_axis;

	param_obj.off = [];
	offset = new THREE.Vector3().subVectors( position, rayhit.point );
	param_pivot.posS = new THREE.Vector3().addVectors( rayhit.point, offset );
	param_pivot.pr_axis = axis;

	if ( axis == 'x' )
	{
		planeMath2.rotation.set( 0, 0, 0 );
		var dir = param_pivot.obj.getWorldDirection(new THREE.Vector3());
		param_pivot.dir = new THREE.Vector3( -dir.z, 0, dir.x ).normalize();
		param_pivot.qt = quaternionDirection( param_pivot.dir );
		UI.setCursor( 'move' );
	}
	else if ( axis == 'z' )
	{
		planeMath2.rotation.set( 0, 0, 0 );
		//param_pivot.dir = param_pivot.obj.getWorldDirection(new THREE.Vector3());	// локальный dir

		var dir = param_pivot.obj.getWorldDirection(new THREE.Vector3());
		param_pivot.dir = new THREE.Vector3( dir.x, 0, dir.z ).normalize();				// глобальный dir

		param_pivot.qt = quaternionDirection( param_pivot.dir );
		UI.setCursor( 'move' );
	}
	else if ( axis == 'y' )
	{
		var dir = new THREE.Vector3().subVectors( planeMath2.position, camera.position ).normalize();
		var angle = Math.atan2( dir.x, dir.z );
		planeMath2.rotation.set( 0, 0, Math.PI / 2 );
		planeMath2.rotation.y = angle + Math.PI / 2;
		param_pivot.dir = dir_y.clone();
		param_pivot.qt = qt_plus_y.clone();
		UI.setCursor( 'grabbing' );
	}


	param_pivot.minVertY = param_pivot.obj.geometry.boundingBox.min.y;



	planeMath2.position.copy( rayhit.point );
	param_pivot.obj.updateMatrixWorld();

	if ( param_pivot.pr_axis == 'y' )
	{
		var pos3 = param_pivot.obj.localToWorld( new THREE.Vector3(0, param_pivot.minVertY, 0) );
		param_obj.off[ 0 ] = new THREE.Vector3().subVectors( position, pos3 );
	}

	hideInactiveObjectControls( objectControls, axis );
	hideGizmo();
	updateObjectControlRotation();

	adjustObjectControlsScale();
	adjustGizmoScale();

	if ( camera === cameraTop )
	{
		objectControls.yAxis.visible = false;
	}

	inititalObjectOffset = offset.clone();
	inititalObjectRotation = param_pivot.obj.rotation.clone();

	param_pivot.click = true;
	
	hideMenuTextureObjPop();
}



// смещение объекта через input
function inputMoveObjPop(cdm) 
{
	var obj = cdm.obj;
	
	if(!obj) return;
	

	var dir = obj.getWorldDirection(new THREE.Vector3());
	dir = new THREE.Vector3( dir.x, 0, dir.z );		// глобальное смещение
	
	var x2 = UI( 'object_offset_Y' ).val();
	var z2 = UI( 'object_offset_X' ).val();

	x2 = x2.replace(",", ".");
	z2 = z2.replace(",", ".");	
	
	if(!isNumeric(x2)) { x2 = 0; }
	if(!isNumeric(z2)) { z2 = 0; }	
	
	var v1 = new THREE.Vector3().addScaledVector( dir, x2 );  
	obj.position.add(v1);
	

	dir = new THREE.Vector3( dir.z, 0, -dir.x ).normalize();        // dir (перпендикуляр стены)
	var v1 = new THREE.Vector3().addScaledVector( dir, z2 );  
	obj.position.add(v1); 

	UI( 'object_offset_X' ).val(0);
	UI( 'object_offset_Y' ).val(0);
	
	
	gizmo.position.copy( obj.position );
	updateObjectControlRotation();
	updateObjectControlsPosition( obj );
	adjustObjectControlsScale();
	adjustGizmoScale();	
	
	hideMenuTextureObjPop();
	
	renderCamera();	
}


function moveObjectControls( event )
{
	if(param_pivot.click)
	{
		param_pivot.click = false;
	}
	
	if(infProject.scene.type.startMoveObj)
	{ 
		infProject.scene.type.startMoveObj = false;
		UIInvokeFunction('ObjectMove');	 			
	}		
	
  // planeMath2.lookAt(camera.position);
  var intersects = rayIntersect( event, planeMath2, 'one' );

  if ( intersects.length <= 0 ) return;

  var pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, offset );
  var subV = new THREE.Vector3().subVectors( pos, param_pivot.posS );
  var locD = localTransformPoint( subV, param_pivot.qt );
  var v1 = new THREE.Vector3().addScaledVector( param_pivot.dir, locD.z );
  
  if(param_pivot.pr_axis == 'x') 
  {
	  UI('object_offset_X').val( Math.round(v1.z * 100)/100 );
  }
  if(param_pivot.pr_axis == 'z') 
  {
	  UI('object_offset_Y').val( Math.round(v1.z * 100)/100 );
  }  

  pos = new THREE.Vector3().addVectors( param_pivot.posS, v1 );

  if ( param_pivot.pr_axis == 'y' ) 
  {
    if ( pos.y - param_obj.off[ 0 ].y < 0 ) { pos.y = param_obj.off[ 0 ].y - 0; }
  }

  var pos2 = new THREE.Vector3().subVectors( pos, objectControls.position );


  if ( param_pivot.pr_axis == 'y' )
  {
	var objPop = objectControls.userData.objPop;
	
	if(!objPop.userData.obj3D.boxPop) { UI( 'obj_pop_height_above_floor' ).val( Math.round( objectControls.position.y * 10 ) / 10 ); }
	else { UI( 'object_offset_Z' ).val( Math.round( objectControls.position.y * 10 ) / 10 ); }	

    var newPos = snapToPlane( param_pivot.obj, pos2, offset, intersects[ 0 ].point, inititalObjectOffset, inititalObjectRotation ).pos;
  }
  else
  {
    param_pivot.obj.position.add( pos2 );
  }

  gizmo.position.copy( param_pivot.obj.position );
  updateObjectControlRotation();
  updateObjectControlsPosition( param_pivot.obj );
  adjustObjectControlsScale();
  adjustGizmoScale();

}


function updateObjectControlRotation()
{

  if ( !objectControls ) return;

  if ( camera.rotation.x < -Math.PI / 2 + 0.3 )
  {
    objectControls.yAxis.visible = false;
  } else
  {
    if ( objectControls.visible ) objectControls.yAxis.visible = true;
    // objectControls.yAxis.lookAt( camera.position.x, 0, camera.position.z );
    objectControls.yAxis.lookAt( camera.position );
  }

}



function checkHoverObjectControl( event )
{

  if ( isMouseDown1 ) { return; }

  var rayhit = detectRayHit( event, 'activeHover' );

  if ( rayhit ) 
  {
    var object = rayhit.object;
    var tag = object.userData.tag;

    if ( tag === 'move_control' ) { hlObjectControls( object ) }
    else if ( tag === 'gizmo' ) { hlGizmo( rayhit ) }

    activeHoverControl = object;
  }
  else
  {
    checkHoverObjectControl_2();
  }

}

function checkHoverObjectControl_2()
{

  if ( !activeHoverControl ) { return; }

  var object = activeHoverControl;
  var tag = object.userData.tag;

  if ( tag === 'move_control' ) { removeHlObjectControls( object ) }
  else if ( tag === 'gizmo' ) { removeHlGizmo() }

  activeHoverControl = null;

}


function hideInactiveObjectControls( object, axis )
{

  for ( var i = 0; i < object.children.length; i++ )
  {
    var child = object.children[ i ];
    if ( child.pr_axis !== axis )
    {
      child.material.opacity = 0;
    }
    else if ( child.pr_axis === axis ) 
    {
      child.material.opacity = 1;
    }
  }

  if ( axis !== 'y' ) objectControls.yAxis.material.opacity = 0;

}


function hlObjectControls( object )
{

  if ( object.pr_axis === 'y' ) fadeAllObjectControls(); fadeGizmo(); UI.setCursor( 'grab' );
  object.material.opacity = 1;
  fadeAnotherControls( object );

}

function fadeAnotherControls( object ) 
{
  if ( object.pr_axis === 'y' ) return
  objectControls.yAxis.material.opacity = 0.5;
  var childrens = object.parent.children
  for ( var i = 0; i < childrens.length; i++ )
  {
    if ( childrens[ i ] !== object )
    {
      childrens[ i ].material.opacity = 0.5;
    }
  }
  fadeGizmo();

}

function fadeAllObjectControls()
{
  objectControls.yAxis.material.opacity = 0.5;

  for ( var i = 0; i < objectControls.children.length; i++ )
  {
    objectControls.children[ i ].material.opacity = 0.5;
  }
}


function removeHlObjectControls()
{

  objectControls.yAxis.material.opacity = 1;

  for ( var i = 0; i < objectControls.children.length; i++ )
  {
    objectControls.children[ i ].material.opacity = 1;
  }

  UI.setCursor();
  removeHlGizmo();

}


function restoreObjectControls( axis )
{

  objectControls.yAxis.material.opacity = 1;

  for ( var i = 0; i < objectControls.children.length; i++ )
  {
    var child = objectControls.children[ i ];
    if ( child.pr_axis !== axis )
    {
      child.material.opacity = 1;
    }
  }

  UI.setCursor();

}


function adjustObjectControlsScale( initialScale )
{

  var initialScale = initialScale ? initialScale : 1;

  if ( camera === camera3D )
  {
    var k = 1;
    var maxDistance = 4;
    var distance = camera.position.distanceTo( objectControls.position );
    var yPosition;

    if ( distance < maxDistance ) k = initialScale / ( maxDistance / distance );
    if ( distance >= maxDistance ) k = initialScale;

    objectControls.scale.multiplyScalar( 1 / ( objectControls.scale.x / k ) );
    objectControls.yAxis.scale.copy( objectControls.scale );

    yPosition = objectControls.yAxis.position.y * ( 1 / ( objectControls.yAxis.position.y / k ) );
    // if ( yPosition + 0.5 < objectControls.position.y ) yPosition = objectControls.position.y + 0.5;
    objectControls.yAxis.position.y = objectControls.position.y + yPosition;
  }
  else if ( camera === cameraTop ) 
  {
    var multiplier = ( initialScale / camera.zoom ) * 1.4;

    objectControls.scale.multiplyScalar( 1 / ( objectControls.scale.x / multiplier ) );
  }

}