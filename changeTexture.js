




function setCatalogSource(catalogSource, lotGroup) 
{
	if (!clickO.last_obj) { return; }
	var obj = clickO.last_obj;
	if (!obj.pr_catalog)  obj.pr_catalog = {};
	var source = {
		activeLot: catalogSource.activeLot,
		category: catalogSource.category,
		page: catalogSource.page,
		filters: catalogSource.filters,
		categoryFilters: catalogSource.categoryFilters,
		allFilters: catalogSource.allFilters,
		selectedFilters: catalogSource.selectedFilters,
		caption: catalogSource.caption,
		priceOrder: catalogSource.priceOrder
	}
	
	if (lotGroup == 'Plinths') 
	{
		(!obj.pr_catalog) ? obj.pr_catalog = { plinthSource: source } : obj.pr_catalog.plinthSource = source;
	}
	else if (lotGroup == 'FurnitureDoorHandle')
	{
		(!obj.pr_catalog) ? obj.pr_catalog = { handleSource: source } : obj.pr_catalog.handleSource = source;
	}
	else
	{
		obj.pr_catalog = source; 
		obj.userData.catalog = source;
	}
}



// меняем текстуру  
function setMultyMaterialSide3(cdm)
{	
	var obj = cdm.obj;
	var scale = cdm.scale;
	var index = cdm.index;
	
	var texture = cdm.image.clone();
	texture.needsUpdate = true;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = renderer.capabilities.getMaxAnisotropy();  
	
	var tag = null;	
	if(obj.userData.tag) tag = obj.userData.tag;
	 
	if(index == 2) { texture.repeat.x = -scale.x; } 
	else { texture.repeat.x = scale.x; }  
	texture.repeat.y = scale.y; 
	
	if(tag == 'room') { texture.repeat.y *= -1; }
	
 
	var material = (cdm.index) ? obj.material[cdm.index] : obj.material;

	material.map = texture;   
	material.needsUpdate = true; 
	material.lightMap = lightMap_1;
	
	if(obj.userData.tag) 
	{ 
		if(obj.userData.tag == 'plinths') 
		{ 
			obj.room.userData.room.plinth.mat = material;
		}
		else if(obj.userData.tag == 'platband3' || obj.userData.tag == 'complement3') 
		{
			texture.rotation += Math.PI/2; 
		}		
		
		if(obj.userData.tag == 'obj_children' && obj.material.map)
		{
			obj.userData.material.uvs = obj.geometry.attributes.uv.clone(); console.log(9999, obj.userData.material);
		}
		
		menuSettingTexture( { obj : obj, index : cdm.index } );		// обнуляем в меню поворот/смещение		 
	}
	
	// поворот 
	if(cdm.rotation)
	{
		if(tag == 'wall') { if(index == 1) cdm.rotation *= -1; }
		texture.rotation = cdm.rotation;
	}
	
	// смещение
	setOffsetUVS_1( cdm );
}


// смещение текстуры 
function setOffsetUVS_1( cdm )
{
	var obj = cdm.obj;
	
	if(!cdm.offset) return;
	if(!obj.userData.tag) return;
	if(!obj.material.map) return;
	
	var tag = obj.userData.tag;
	var x = cdm.offset.x;
	var y = cdm.offset.y;	
	
	if(tag == 'wall' || tag == 'room' || tag == 'ceiling' || tag == 'obj_children'){}
	else { return; }
	
 
  
	if(tag == 'wall') 
	{ 
		x /= 1/obj.material[cdm.index].map.repeat.x;
		y *= 1/obj.material[cdm.index].map.repeat.y;			
	}
	else if(tag == 'room' || tag == 'ceiling') 
	{ 
		x *= 1/obj.material.map.repeat.x;
		y *= 1/obj.material.map.repeat.y;		
	}
	
	if(tag == 'wall' || tag == 'room' || tag == 'ceiling')
	{
		for (var i = 0; i < obj.geometry.faces.length; i++) 
		{			
			if(tag == 'wall') if(obj.geometry.faces[i].materialIndex != cdm.index) continue;

			if(cdm.offset.x != 0)
			{ 
				obj.geometry.faceVertexUvs[0][i][0].x += x;
				obj.geometry.faceVertexUvs[0][i][1].x += x;
				obj.geometry.faceVertexUvs[0][i][2].x += x;			
			}
			
			if(cdm.offset.y != 0)
			{
				obj.geometry.faceVertexUvs[0][i][0].y += y;
				obj.geometry.faceVertexUvs[0][i][1].y += y;
				obj.geometry.faceVertexUvs[0][i][2].y += y;						
			}		
		}				
	}
	else if(tag == 'obj_children') 
	{
		var uvs = obj.geometry.attributes.uv;
		
		if(cdm.offset.x != 0)
		{
			for (var i = 0; i < uvs.count; i++)
			{
				uvs.setX(i, uvs.getX(i) + cdm.offset.x);
			}
		}
		if(cdm.offset.y != 0)
		{
			for (var i = 0; i < uvs.count; i++)
			{
				uvs.setY(i, uvs.getY(i) + cdm.offset.y);
			}			
		}
		
		uvs.needsUpdate = true;
		//showMenuTextureObjPop_2( obj );
	}

	obj.geometry.uvsNeedUpdate = true;			
	if(tag == 'wall') { obj.userData.material[cdm.index].offset = cdm.offset; }
	else { obj.userData.material.offset = cdm.offset; }	
}


// вращение текстуры 
function materialRotation(cdm)
{
	if(!isNumeric(cdm.rot)) return;
	
	var obj = cdm.obj;
	
	var tag = obj.userData.tag;
	
	if(obj.userData.tag == 'obj') 
	{ 
		if(obj.userData.obj3D.edge)
		{
			var obj = obj.children[0].children[obj.userData.obj3D.edge - 1];  
		}
	}	
	
	if(!obj) return; 
	
	var map = (obj.userData.tag == 'wall') ? obj.material[cdm.index].map : obj.material.map; 
	
	if(!map) return;
	
	if(obj.userData.tag == 'wall') { if(cdm.index == 1 && cdm.loop) cdm.rot *= -1; }
		
	map.rotation = (cdm.loop) ? cdm.rot + map.rotation : cdm.rot; 

		
	if(tag == 'obj') { showMenuTextureObjPop_2( obj ); }
	else { menuSettingTexture( { obj : obj, index : cdm.index } ); }
	
	renderCamera();
}


// смещение текстуры через стерлки 
function offsetTexture()
{
	if(!moveTexture.axis) return;
	
	var obj = clickO.last_obj;
	
	if(!obj) return; 

	var tag = obj.userData.tag;
	
	if(obj.userData.tag == 'obj') 
	{ 
		if(obj.userData.obj3D.edge)
		{
			var obj = obj.children[0].children[obj.userData.obj3D.edge - 1];  
		}
	}	
	 
	var map = (obj.userData.tag == 'wall') ? obj.material[clickO.index].map : obj.material.map;
	
	if(!map) return;			
	
	
	if(tag == 'obj') 
	{
		var uvs = obj.geometry.attributes.uv;
		
		var value = moveTexture.value * -1;
		
		if(moveTexture.axis == 'x')
		{
			for (var i = 0; i < uvs.count; i++)
			{
				uvs.setX(i, uvs.getX(i) + value);
			}
		}
		else if(moveTexture.axis == 'y')
		{
			for (var i = 0; i < uvs.count; i++)
			{
				uvs.setY(i, uvs.getY(i) + value);
			}			
		}
		
		uvs.needsUpdate = true;
		showMenuTextureObjPop_2( obj );
	}
	else
	{  
		var inf = { obj : obj };
		if(obj.userData.tag == 'wall') { inf.index = clickO.index; }
		if(moveTexture.axis == 'x') { inf.offset = new THREE.Vector2(moveTexture.value, 0); }
		if(moveTexture.axis == 'y') { inf.offset = new THREE.Vector2(0, moveTexture.value); }
		
		setOffsetUVS_1( inf );				

		menuSettingTexture( { obj : obj, index : clickO.index } );			
	}
	
	renderCamera();
}



// смещение текстуры (при нажатии enter)
function offsetTextureInput()  
{
	var obj = clickO.last_obj;
	
	if(!obj) return;  
	
	var map = (obj.userData.tag == 'wall') ? obj.material[clickO.index].map : obj.material.map;
	
	if(!map) return;
	
	var str = (obj.userData.tag == 'wall') ? 'wall' : 'floor';
	
	var x = UI(str+'_texture_offset_x').val();
	var y = UI(str+'_texture_offset_y').val();
	
	if(!isNumeric(x)) return;
	if(!isNumeric(y)) return;				
	
	var offset_2 = new THREE.Vector2(Number(x), Number(y));
	
	//var offset_1 = getOffsetTexture({obj : obj, index : clickO.index});
	
	if(obj.userData.tag == 'wall') { var offset_1 = obj.userData.material[clickO.index].offset; }
	else { var offset_1 = obj.userData.material.offset; }
	
	var offset = new THREE.Vector2(offset_2.x - offset_1.x, offset_2.y - offset_1.y);
	
	var inf = { obj : obj, offset : offset };
	if(obj.userData.tag == 'wall') { inf.index = clickO.index; }
	
	setOffsetUVS_1( inf );

	menuSettingTexture( { obj : obj, index : clickO.index } );
	
	renderCamera();
}




function upUvs_1( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	
    for (var i = 0; i < faces.length; i++) 
	{				
        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				
 
        geometry.faceVertexUvs[0][i] =
		[
            new THREE.Vector2(v1['x'], v1['y']),
            new THREE.Vector2(v2['x'], v2['y']),
            new THREE.Vector2(v3['x'], v3['y'])
        ];
    }

    geometry.uvsNeedUpdate = true;
	geometry.elementsNeedUpdate = true;
	
	setOffsetUVS( obj );
}


// ставим текстуру по центру стены и если есть смещение, то смещаем
function setOffsetUVS( obj )
{
	if(obj.userData.tag)
	{
		if(obj.userData.tag == 'wall')
		{			
			obj.geometry.computeBoundingSphere();
			var centerV = obj.geometry.boundingSphere.center.clone();
			centerV.y = -0.1; 	


			var arr = [];
			var n = [0, 0];
			for (var i = 0; i < obj.geometry.faces.length; i++) 
			{			
				if(obj.userData.tag == 'wall') 
				{
					if(obj.geometry.faces[i].materialIndex == 1) { if(n[0]==0) { arr[0] = { face : i, side : 1}; n[0] = 1; if(n[1]==1) break; } }
					if(obj.geometry.faces[i].materialIndex == 2) { if(n[1]==0) { arr[1] = { face : i, side : 2}; n[1] = 1; if(n[0]==1) break; } }
				}						
			}
			
			var x = [];
			var y = [];
			
			x[0] = obj.geometry.vertices[obj.geometry.faces[arr[0].face].a].x - obj.geometry.faceVertexUvs[0][arr[0].face][0].x - centerV.x;  
			x[1] = obj.geometry.vertices[obj.geometry.faces[arr[1].face].a].x - obj.geometry.faceVertexUvs[0][arr[1].face][0].x - centerV.x; 
			
			y[0] = obj.geometry.faceVertexUvs[0][arr[0].face][0].y - obj.geometry.vertices[obj.geometry.faces[arr[0].face].a].y;			
			y[1] = obj.geometry.faceVertexUvs[0][arr[1].face][0].y - obj.geometry.vertices[obj.geometry.faces[arr[1].face].a].y;
			
			var arr = [{x : x[0] + obj.userData.material[1].offset.x, y : y[0] + obj.userData.material[1].offset.y, side : 1}, {x : x[1] - obj.userData.material[2].offset.x, y : y[1] + obj.userData.material[2].offset.y, side : 2}]; 
			//console.log('side 1', x[0], offset[0].x);
			//console.log('side 2', x[1], offset[1].x); 
			for (var m = 0; m < arr.length; m++)
			{
				
				for (var i = 0; i < obj.geometry.faces.length; i++) 
				{			
					if(obj.userData.tag == 'wall') { if(obj.geometry.faces[i].materialIndex != arr[m].side) continue; }
					
					obj.geometry.faceVertexUvs[0][i][0].x += arr[m].x;
					obj.geometry.faceVertexUvs[0][i][1].x += arr[m].x;
					obj.geometry.faceVertexUvs[0][i][2].x += arr[m].x;  
					
					obj.geometry.faceVertexUvs[0][i][0].y += arr[m].y;
					obj.geometry.faceVertexUvs[0][i][1].y += arr[m].y;
					obj.geometry.faceVertexUvs[0][i][2].y += arr[m].y;			
				}						
			}
			obj.geometry.uvsNeedUpdate = true;  
		}
		else if(obj.userData.tag == 'room' || obj.userData.tag == 'ceiling')
		{
			if(!obj.userData.material) return;
			if(!obj.userData.material.offset) return;
			
			var x = obj.userData.material.offset.x;
			var y = obj.userData.material.offset.y;
		

			for (var i = 0; i < obj.geometry.faces.length; i++) 
			{			
				obj.geometry.faceVertexUvs[0][i][0].x += x;
				obj.geometry.faceVertexUvs[0][i][1].x += x;
				obj.geometry.faceVertexUvs[0][i][2].x += x;
				
				obj.geometry.faceVertexUvs[0][i][0].y -= y;
				obj.geometry.faceVertexUvs[0][i][1].y -= y;
				obj.geometry.faceVertexUvs[0][i][2].y -= y;				
			}

			obj.geometry.uvsNeedUpdate = true;	
		}
	}	
}


function upUvs_2( obj )
{
	obj.updateMatrixWorld();
	var geometry = obj.geometry;
	
    geometry.faceVertexUvs[0] = [];
	var faces = geometry.faces;
	var n = 1;
	
    for (var i = 0; i < faces.length; i++) 
	{				
        var v1 = geometry.vertices[faces[i].a];
        var v2 = geometry.vertices[faces[i].b];
        var v3 = geometry.vertices[faces[i].c];				

        geometry.faceVertexUvs[0][i] =
		[
            new THREE.Vector2(v1.z * n, v1.y * n),
            new THREE.Vector2(v2.z * n, v2.y * n),
            new THREE.Vector2(v3.z * n, v3.y * n)
        ];
    }

    geometry.uvsNeedUpdate = true;	
}




// удаляем текстуру на стене (восстанавливаем стандарт)
function deleteTextureWall( wall, index )
{ 
	if(!wall) return;
	//new THREE.Color('rgb(93%,87%,83%)')			

	for ( var i = 0; i < arrWallFront.wall.length; i++ )
	{
		var obj = arrWallFront.wall[i].obj;
		var side = arrWallFront.wall[i].index;
		obj.material[side] = new THREE.MeshLambertMaterial( { color: 0xedded4, clippingPlanes: [ clippingMaskWall ], lightMap : lightMap_1 } );	 	
		obj.userData.material[side] = { lotid : 4954, caption : '', color : obj.material[side].color, scale : new THREE.Vector2(1,1), filters : 1039, preview : '', catalog : '' };		
	}
	
	UI( 'wall-preview' ).val( '' ); 
	UI.setObjectCaption( '', 'wall-preview' );	
	
	menuSettingTexture( { obj : wall, index : index } ); 
}



// удаляем текстуру на полу/потолке (восстанавливаем стандарт)
function deleteTextureFloorCeiling(obj)
{ 
	if(!obj) return;
	
	if(obj.userData.tag == 'room') 
	{
		var colorDefault = 0xe3e3e5;
		var lotid = 4956;
	}
	else
	{
		var colorDefault = 0xffffff;
		var lotid = 4957;		
	}
	
	obj.material = new THREE.MeshLambertMaterial( { color : colorDefault, lightMap : lightMap_1 } );
		
	obj.pr_preview = '';
	obj.pr_catalog = '';
	
	obj.userData.material = { lotid : lotid, containerID : null, caption : '', color : { r : 1, g : 1, b : 1 }, scale : new THREE.Vector2(1,1), filters : 1039, preview : '', catalog : null };
	
	UI( 'floor-preview' ).val( '' ); 
	UI.setObjectCaption( '', 'floor-preview' );	

	menuSettingTexture( { obj : obj } );
}




// обновляем значения текстур в меню (стена/пол/потолок) (смещение/поворот)
function menuSettingTexture( cdm )
{
	var obj = cdm.obj;
	
	if(!obj) return;	
	if(obj.userData.tag == 'wall' || obj.userData.tag == 'room' || obj.userData.tag == 'ceiling' || obj.userData.tag == 'obj_children'){} 
	else { return; }
	
	var rot = 0;
	var offset = new THREE.Vector2();
	
	var map = (obj.userData.tag == 'wall') ? obj.material[cdm.index].map : obj.material.map;
	
	if(map)
	{
		rot = Math.round(THREE.Math.radToDeg(map.rotation));  
	}
				
	offset = getOffsetTexture( cdm );
	
	var str = (obj.userData.tag == 'wall') ? 'wall' : 'floor';
	UI(str+'_texture_rotation').val(rot);
	UI(str+'_texture_offset_x').val(Math.round(offset.x * 100)/100);
	UI(str+'_texture_offset_y').val(Math.round(offset.y * 100)/100);	 	
}


// получаем значение смещения текстуры
function getOffsetTexture( cdm ) 
{
	var obj = cdm.obj;
	var offset = new THREE.Vector2();
	
	if(obj.userData.tag == 'wall' && obj.material[cdm.index].map)
	{
		var centerV = obj.geometry.boundingSphere.center.clone();		
		
		
		var arr = [];
		var n = [0, 0];
		for (var i = 0; i < obj.geometry.faces.length; i++) 
		{			
			if(obj.userData.tag == 'wall') 
			{
				if(obj.geometry.faces[i].materialIndex == 1) { if(n[0]==0) { arr[0] = { face : i }; n[0] = 1; if(n[1]==1) break; } }
				if(obj.geometry.faces[i].materialIndex == 2) { if(n[1]==0) { arr[1] = { face : i }; n[1] = 1; if(n[0]==1) break; } }
			}						
		}	 			
		
		if(cdm.index == 1)
		{
			offset.x =  centerV.x + obj.geometry.faceVertexUvs[0][arr[0].face][0].x - obj.geometry.vertices[obj.geometry.faces[arr[0].face].a].x;
			offset.y =  obj.geometry.faceVertexUvs[0][arr[0].face][0].y - obj.geometry.vertices[obj.geometry.faces[arr[0].face].a].y;
			obj.userData.material[1].offset = offset.clone();
		}
		if(cdm.index == 2)
		{
			offset.x = obj.geometry.vertices[obj.geometry.faces[arr[1].face].a].x - obj.geometry.faceVertexUvs[0][arr[1].face][0].x - centerV.x;
			offset.y = obj.geometry.faceVertexUvs[0][arr[1].face][0].y - obj.geometry.vertices[obj.geometry.faces[arr[1].face].a].y;
			obj.userData.material[2].offset = offset.clone();
		}	

		if(cdm.index == 2) offset.x *= -1; 		
		offset.x /= obj.material[cdm.index].map.repeat.x;
		offset.y *= obj.material[cdm.index].map.repeat.y;			
	}
	if(obj.userData.tag == 'room' && obj.material.map || obj.userData.tag == 'ceiling' && obj.material.map)
	{
		offset.x = obj.geometry.faceVertexUvs[0][0][0].x - obj.geometry.vertices[0].x;
		offset.y = obj.geometry.vertices[0].y - obj.geometry.faceVertexUvs[0][0][0].y;
		
		obj.userData.material.offset = offset.clone(); 

		offset.y *= -1;
		offset.x *= obj.material.map.repeat.x;
		offset.y *= obj.material.map.repeat.y;		
	}
	if(obj.userData.tag == 'obj_children' && obj.material.map)
	{
		console.log(5555555, obj.geometry.attributes);
		
	}
		
	return offset;
}



//------------



// применить текстуру ко всем стенам одного помещения
function assignTextureOnAllWall()
{
	if(!clickO.last_obj) { return; }
	
	var wall = clickO.last_obj;
	var index = clickO.index;	
	

	var num = -1;
	
	for ( var i = 0; i < room.length; i++ ) 
	{  
		for ( var i2 = 0; i2 < room[i].w.length; i2++ )
		{
			if(wall == room[i].w[i2])
			{
				var side = (index == 1) ? 1 : 0;
				
				if(side == room[i].s[i2]) { num = i; }
				
				break;
			}
		}	
	}

	if(num == -1) { return; /* стена не принадлежит ни одному помещению */ };
	
	 
	
	for ( var i = 0; i < room[num].w.length; i++ ) 
	{  
		loadPopObj_1([{ obj: room[num].w[i], lotid: wall.userData.material[index].lotid, start : 'new', index : (room[num].s[i] == 1) ? 1 : 2, color : wall.userData.material[index].color, scale : wall.userData.material[index].scale, catalog : wall.userData.material[index].catalog }]); 
	}	
	
}







