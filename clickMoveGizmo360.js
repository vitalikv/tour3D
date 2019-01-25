

 

// создаем Gizmo360
function createGizmo360()
{
	var count = 68; 
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
	
	
	var kf = 0.03;
	var n = 0;
	var v = [];
	for ( var i = 0; i < circle.length; i++ )
	{
		var dir = circle[i].clone().normalize();
		var v1 = new THREE.Vector3().addScaledVector( dir, 0.06 );
		v[n] = new THREE.Vector3().addVectors( circle[i], v1 );
		v[n].y -= kf / 2;		
		n++;		
		
		var v1 = new THREE.Vector3().addScaledVector( dir, -0.06 );
		v[n] = new THREE.Vector3().addVectors( circle[i], v1 );
		v[n].y -= kf / 2;
		n++;
		
		v[n] = v[n - 2].clone();
		v[n].y += kf;
		n++;	
		
		v[n] = v[n - 2].clone();
		v[n].y += kf;
		n++;		
	}	
	
	var n = 0;
	var v2 = [];
	for ( var i = 0; i < circle.length; i++ )
	{
		var dir = circle[i].clone().normalize();
		var v1 = new THREE.Vector3().addScaledVector( dir, 0.001 );
		v2[n] = new THREE.Vector3().addVectors( circle[i], v1 );
		v2[n].y -= kf / 2;		
		n++;		
		
		var v1 = new THREE.Vector3().addScaledVector( dir, -0.001 );
		v2[n] = new THREE.Vector3().addVectors( circle[i], v1 );
		v2[n].y -= kf / 2;
		n++;
		
		v2[n] = v2[n - 2].clone();
		v2[n].y += kf;
		n++;	
		
		v2[n] = v2[n - 2].clone();
		v2[n].y += kf;
		n++;		
	}	
	
	
	var group = new THREE.Object3D();
	var arr = [];
	arr[0] = ['x', new THREE.Vector3(0, 0, 0), 'rgb(48, 154, 186)'];
	arr[1] = ['y', new THREE.Vector3(0, 0, Math.PI/2), 'rgb(168, 69, 69)'];
	arr[2] = ['z', new THREE.Vector3(Math.PI/2, 0, 0), 'rgb(34, 99, 34)'];
	
	for ( var i = 0; i < 3; i++ )
	{
		var obj = new THREE.Mesh( createGeometryCircle(v), new THREE.MeshBasicMaterial({ color: arr[i][2], depthTest: false, transparent: true, opacity: 0.0 }) );
		obj.userData.tag = 'gizmo360'; 
		obj.userData.axis = arr[i][0];		
		//obj.visible = false;
		obj.rotation.set( arr[i][1].x, arr[i][1].y, arr[i][1].z );	
		
	
		var obj2 = new THREE.Mesh( createGeometryCircle(v2), new THREE.MeshLambertMaterial({ color: arr[i][2], depthTest: false, clippingPlanes : [ new THREE.Plane() ], lightMap : lightMap_1 }) );
		obj2.renderOrder = 3;
		//obj2.visible = false;
		obj2.material.clippingPlanes[0].copy(new THREE.Plane());
		obj.add( obj2 );
		
		
		group.add( obj );
	}
	
	scene.add( group );

	
	group.visible = false;
	
	// Sphere
	var geometry = new THREE.SphereGeometry( 0.98, 32, 32 );
	var material = new THREE.MeshLambertMaterial( {color: 0x000000, depthTest: false, transparent: true, opacity: 0.1} );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.renderOrder = 3;
	group.add( sphere );

	//helpers = new THREE.PlaneHelper( obj2.material.clippingPlanes[0], 30, 0xff0000 );
	//scene.add( helpers );
	
	return group;
}


//var helpers = null;


// прячем текстуру если она находится за плоскостью 
function clippingGizmo360( objPop )
{
	var plane = new THREE.Plane();	
	
	var group = new THREE.Group();
	group.position.copy(objPop.position);
	group.lookAt(camera.position);
	group.rotateOnAxis(new THREE.Vector3(0,1,0), -Math.PI / 2);
	group.updateMatrixWorld();
	
	
	//var dir = new THREE.Vector3().subVectors( camera.position, objPop.position ).normalize();
	//var qt = quaternionDirection(dir.clone());
	//var mx = new THREE.Matrix4().compose(objPop.position, qt, new THREE.Vector3(1,1,1));
	//plane.applyMatrix4(mx);	
	plane.applyMatrix4(group.matrixWorld);	
	
	toolHandle.rotate.children[0].children[0].material.clippingPlanes[0].copy(plane);
	toolHandle.rotate.children[1].children[0].material.clippingPlanes[0].copy(plane);
	toolHandle.rotate.children[2].children[0].material.clippingPlanes[0].copy(plane);	
	
	//showHelperNormal(objPop)

}



// кликнули на gizmo
function clickGizmo360( intersect )
{	
	var axis = intersect.object.userData.axis;
	param_pivot.pr_axis = axis;	
				
	
	var obj = param_pivot.obj;			// objPop
	obj_selected = intersect.object; 	// gizmo
	
	param_obj.vrs1 = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	
	var per1 = obj.worldToLocal( intersect.point.clone() );
	
	if(axis == 'x')
	{
		per1.x = obj.geometry.boundingSphere.center.x;
		per1.z = obj.geometry.boundingSphere.center.z;	
		var dr = new THREE.Vector3( 0, 1, 0 );
		var rotY = Math.PI/2;
	}	
	else if(axis == 'y')
	{
		per1.y = obj.geometry.boundingSphere.center.y;
		per1.z = obj.geometry.boundingSphere.center.z;	
		var dr = new THREE.Vector3( 0, 0, 1 );
		var rotY = -Math.PI/2;
	}
	else if(axis == 'z')
	{
		per1.x = obj.geometry.boundingSphere.center.x;
		per1.y = obj.geometry.boundingSphere.center.y;	
		var dr = new THREE.Vector3( 1, 0, 0 );
		var rotY = Math.PI/2;
	}

	
	per1 = obj.localToWorld( per1.clone() );
	
	planeMath2.position.copy( per1 );		
	

	var quaternion = new THREE.Quaternion().setFromAxisAngle( dr, rotY );								// создаем Quaternion повернутый на выбранную ось	
	var q2 = new THREE.Quaternion().setFromEuler( obj.rotation ).multiply ( quaternion );		// конвертируем rotation в Quaternion и умножаем на предведущий Quaternion			
	planeMath2.rotation.copy( new THREE.Euler().setFromQuaternion( q2 ) );								// конвертируем из Quaternion в rotation

	
	planeMath2.updateMatrixWorld();
	var dir = planeMath2.worldToLocal( intersect.point.clone() );	
	param_obj.rotY = Math.atan2(dir.x, dir.z);	
	
	hideMenuTextureObjPop();
}




function moveGizmo360( event )
{	
	var intersects = rayIntersect( event, planeMath2, 'one' );
	 
	if ( intersects.length > 0 )
	{				
		var obj = param_pivot.obj;  
		
		if(param_pivot.pr_axis == 'x'){ var dr = new THREE.Vector3( 0, 1, 0 ); }
		else if(param_pivot.pr_axis == 'y'){ var dr = new THREE.Vector3( 1, 0, 0 ); }
		else if(param_pivot.pr_axis == 'z'){ var dr = new THREE.Vector3( 0, 0, 1 ); }
		
		
		
		var dir = planeMath2.worldToLocal( intersects[ 0 ].point.clone() );	
		var rotY = Math.atan2(dir.x, dir.z);
		
		
		var quaternion = new THREE.Quaternion().setFromAxisAngle( dr, rotY - param_obj.rotY );		
		var q2 = new THREE.Quaternion().setFromEuler( obj.rotation ).multiply ( quaternion );		
		obj.rotation.copy( new THREE.Euler().setFromQuaternion( q2 ) );

		obj.updateMatrixWorld();
		var vrs2 = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );		
		obj.position.add( new THREE.Vector3().subVectors( param_obj.vrs1, vrs2 ) );		
		
		param_obj.rotY = rotY; 
		
		toolHandle.rotate.rotation.copy( obj.rotation ); 
		
		upMenuRotateObjPop(obj);
	}
}



// смещение объекта через input
function inputRotateObjPop_360(cdm)  
{
	var obj = cdm.obj;
	
	if(!obj) return;
	
	var oldPos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
	
	var x = $('[data-action="object_rotate_X"]').val();
	var y = $('[data-action="object_rotate_Y"]').val();
	var z = $('[data-action="object_rotate_Z"]').val();
	
	var x = x.replace(",", ".");
	var y = y.replace(",", ".");
	var z = z.replace(",", ".");
	
	x = (!isNumeric(x)) ? obj.rotation.x : THREE.Math.degToRad(x);
	y = (!isNumeric(y)) ? obj.rotation.y : THREE.Math.degToRad(y);
	z = (!isNumeric(z)) ? obj.rotation.z : THREE.Math.degToRad(z);
	console.log(x, y, z);
	var quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));	
	obj.quaternion.copy(quaternion);
	
	obj.updateMatrixWorld();
	var newPos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );	 	
	obj.position.add( new THREE.Vector3().subVectors( oldPos, newPos ) );

	toolHandle.rotate.rotation.copy( obj.rotation );
	upMenuRotateObjPop(obj);
	
	hideMenuTextureObjPop();
	
	renderCamera();	
}



// обновляем в меню rotate
function upMenuRotateObjPop(obj)
{	
	//var rot = new THREE.Euler().setFromQuaternion(obj.getWorldQuaternion(new THREE.Quaternion()));
	//console.log(rot);
	
	UI( 'object_rotate_X' ).val( Math.round( THREE.Math.radToDeg(obj.rotation.x) ) );
	UI( 'object_rotate_Y' ).val( Math.round( THREE.Math.radToDeg(obj.rotation.y) ) );
	UI( 'object_rotate_Z' ).val( Math.round( THREE.Math.radToDeg(obj.rotation.z) ) );	
}


