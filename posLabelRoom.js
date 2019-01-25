



var skeleton = { line : [], point : [], cycle : [] };





function getSkeleton_1(arrRoom)
{	
	for ( var i = 0; i < skeleton.line.length; i ++ ){ scene.remove( skeleton.line[i] ); }
	for ( var i = 0; i < skeleton.point.length; i ++ ){ scene.remove( skeleton.point[i] ); }
	
	var arrPoint = [];
	skeleton.line = [];	
	skeleton.point = [];		
	
	
	for ( var s = 0; s < arrRoom.length; s++ )
	{		
		skeleton.cycle = [];
		arrPoint = [];
		for ( var i = 0; i < arrRoom[s].p.length - 1; i++ ) 
		{ 		
			arrPoint[i] = createPoint_2(arrRoom[s].p[i].position.clone(), arrRoom[s].p[i].userData.id);				
		}
		
		
		for ( var i = 0; i < arrPoint.length; i++ ) 
		{ 				
			var i2 = (i == 0) ? arrPoint.length - 1 : i - 1;
			var i3 = (i == arrPoint.length - 1) ? 0 : i + 1;
			
			arrPoint[i].p[0] = arrPoint[i2];
			arrPoint[i].start[0] = 1; 
			
			arrPoint[i].p[1] = arrPoint[i3];
			arrPoint[i].start[1] = 0;		
		}			
		
		getSkeleton_2(arrPoint, 0, arrRoom[s].userData.id);

		
		if(skeleton.cycle.length > 0)
		{
			var res = { max : skeleton.cycle[0].num, n : 0 };
			
			for ( var i = 0; i < skeleton.cycle.length; i++ )
			{
				if(res.max < skeleton.cycle[i].num) { res.max = skeleton.cycle[i].num; res.n = i; }
			}
			
			//console.log(arrRoom[s].userData.id, res.n, skeleton.cycle);
			
			
			var sumX = 0;
			var sumZ = 0;
			for (i = 0; i < skeleton.cycle[res.n].p.length; i++) 
			{ 
				sumX += skeleton.cycle[res.n].p[i].x; 
				sumZ += skeleton.cycle[res.n].p[i].z;
			}			
			
			arrRoom[s].label.position.set(sumX / skeleton.cycle[res.n].p.length, 0.2, sumZ / skeleton.cycle[res.n].p.length);						
		}
		else
		{
			console.log(arrRoom[s].userData.id, skeleton);
		}
	}
}







function getSkeleton_2(arrP, cycle, roomId)
{
	if(arrP.length == 0) return;
	
	// создаем 2 точки смещенные во внутрь помещения (имитация прямой линии)
	var arrLine = [];
	
	for ( var i = 0; i < arrP.length; i++ )
	{
		var i2 = (i == arrP.length - 1) ? 0 : i + 1;
		
		var x1 = arrP[i2].position.z - arrP[i].position.z;
		var z1 = arrP[i].position.x - arrP[i2].position.x;	
		var dir = new THREE.Vector3(x1, 0, z1).normalize();						// перпендикуляр стены	
		dir = new THREE.Vector3().addScaledVector( dir, 0.3 );
		
		var pos1 = arrP[i].position.clone();
		var pos2 = arrP[i2].position.clone();
		pos1.add( dir );
		pos2.add( dir );
		
		var dir = new THREE.Vector3().subVectors( pos2, pos1 ).normalize();
		dir = new THREE.Vector3(Math.round(dir.x * 100) / 100, Math.round(dir.y * 100) / 100, Math.round(dir.z * 100) / 100);
		
		arrLine[arrLine.length] = { point : [{ pos : pos1, id : arrP[i].userData.id, p : arrP[i].p, start : arrP[i].start }, { pos : pos2, id : arrP[i2].userData.id, p : arrP[i2].p, start : arrP[i2].start }], dir : dir };		
	}
	
	
	// создаем точки в местах пересечения математических линий
	var arr = [];
	var str = '';
	for ( var i = 0; i < arrLine.length; i++ )
	{
		var i2 = (i == arrLine.length - 1) ? 0 : i + 1;		

		
		var n = (arrLine[i].point[0].id == arrLine[i2].point[0].id) ? 0 : 1;				
		
		var id = arrLine[i].point[n].id;
		str += ' ' + id;
		
		var point = createPoint_2( crossPointTwoLine(arrLine[i].point[0].pos, arrLine[i].point[1].pos, arrLine[i2].point[0].pos, arrLine[i2].point[1].pos), id );
		point.cross = [];		
		
		
		
		str += ' (';
		for ( var i3 = 0; i3 < arrLine[i].point[n].p.length; i3++ )
		{
			point.cross[i3] = { id : arrLine[i].point[n].p[i3].userData.id };
			point.start[i3] = arrLine[i].point[n].start[i3];
			str += ' '+point.cross[i3].id+ ' ';
		}
		str += ')';
		arr[arr.length] = point;
	}
	//console.log('[' +roomId+ ']', str);  
	
	
	//if(roomId == 18) { showSkeleton(arr, cycle); }
	
	
	// находим линии, которые после пересечения перевернулось и точки у этих линий ... 
	var checkCross = [];
	for ( var i = 0; i < arrLine.length; i++ )
	{
		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			if(arr[i2].userData.id == arrLine[i].point[0].id) { var p1 = arr[i2]; }
			else if(arr[i2].userData.id == arrLine[i].point[1].id) { var p2 = arr[i2]; }	
		}
		
		var dir = new THREE.Vector3().subVectors( p2.position.clone(), p1.position.clone() ).normalize();		
		dir = new THREE.Vector3(Math.round(dir.x * 100) / 100, Math.round(dir.y * 100) / 100, Math.round(dir.z * 100) / 100);	

		if(!comparePos(arrLine[i].dir, dir)) 
		{			
			var n = (p1.cross[0].id == p2.userData.id) ? 0 : 1;
			p1.cross.splice(n, 1);
			p1.start.splice(n, 1);
			var n = (p2.cross[0].id == p1.userData.id) ? 0 : 1;
			p2.cross.splice(n, 1);
			p2.start.splice(n, 1);						

			checkCross[checkCross.length] = { p1 : p1, p2 : p2 };
		}
	}			
	
	
	// назначаем точки
	for ( var i = 0; i < arr.length; i++ )
	{	
		for ( var i2 = 0; i2 < arr[i].cross.length; i2++ )
		{
			for ( var i3 = 0; i3 < arr.length; i3++ )
			{
				if(arr[i].cross[i2].id == arr[i3].userData.id)
				{
					arr[i].p[i2] = arr[i3];						
				}
			}
			
		}	
	}
	
	
	for ( var i = 0; i < checkCross.length; i++ )
	{
		var p1 = checkCross[i].p1;
		var p2 = checkCross[i].p2;
		
		
		
		if(p1.p.length == 0) continue;
		if(p2.p.length == 0) continue;
		if(p1.p[0] == p2.p[0]) continue;
		
		var pos = crossPointTwoLine_2(p1.position, p1.p[0].position, p2.position, p2.p[0].position);
		
		if(pos[1]) continue;
		
		var point = createPoint_2( pos[0], 0 );
		
		point.p[0] = p1.p[0];
		point.start[0] = 1;
		
		point.p[1] = p2.p[0];
		point.start[1] = 0;	
		
		
		var p = p1.p[0];
		var n = (p.p[0] == p1) ? 0 : 1;
		p.p[n] = point;
		
		var p = p2.p[0];
		var n = (p.p[0] == p2) ? 0 : 1;
		p.p[n] = point;			

		for ( var i2 = 0; i2 < arr.length; i2++ )
		{
			if(arr[i2] == p1) { arr.splice(i2, 0, point); break; }
		}
		
		
		for ( var i2 = arr.length - 1; i2 >= 0; i2-- )
		{
			if(p1 == arr[i2]) { arr.splice(i2, 1); }
			if(p2 == arr[i2]) { arr.splice(i2, 1); }
		}
		
		if(roomId == 18) console.log(1111111, point.userData.id);
	}	
	
	
	if(roomId == 18) { showConsoleSkeleton(arr, roomId); }
	
	
	// создаем математические отрезки
	var arrLine = [];
	for ( var i = 0; i < arr.length; i++ )
	{
		var i2 = (i == arr.length - 1) ? 0 : i + 1;			
		
		arrLine[arrLine.length] = { p : [{ pos : arr[i].position, obj : arr[i] }, { pos : arr[i2].position, obj : arr[i2] }], cross : [] };	 		
	}
	
	
	
	// после того, как все точки и линии выстроины , ищем пересечения между уже построенными прямыми
	for ( var i = 0; i < arrLine.length; i++ )
	{		
		for ( var i2 = 0; i2 < arrLine.length; i2++ )
		{
			if(arrLine[i] == arrLine[i2]) continue;
			
			if(arrLine[i].p[0].pos == arrLine[i2].p[0].pos) continue;
			if(arrLine[i].p[0].pos == arrLine[i2].p[1].pos) continue;
			if(arrLine[i].p[1].pos == arrLine[i2].p[0].pos) continue;
			if(arrLine[i].p[1].pos == arrLine[i2].p[1].pos) continue;
			
			if( CrossLine(arrLine[i].p[0].pos, arrLine[i].p[1].pos, arrLine[i2].p[0].pos, arrLine[i2].p[1].pos) ) 
			{ 
				var flag = true;
				for ( var i3 = 0; i3 < arrLine[i].cross.length; i3++ )
				{
					if(arrLine[i].cross[i3].wall == arrLine[i2]) 
					{ 
						flag = false;
						break;
					}
				}
				
				if(flag)
				{
					var pos = crossPointTwoLine(arrLine[i].p[0].pos, arrLine[i].p[1].pos, arrLine[i2].p[0].pos, arrLine[i2].p[1].pos);									
					
					var point = createPoint_2( pos, 0 );					

					arr[arr.length] = point;
					arrLine[i].cross[arrLine[i].cross.length] = { wall : arrLine[i2], point : point };
					arrLine[i2].cross[arrLine[i2].cross.length] = { wall : arrLine[i], point : point };						
				}
			}
		}
	}


	// добавляем дополнительный параметр точкам (чтобы вычислить лишние контуры)
	for ( var i = 0; i < arrLine.length; i++ )
	{		
		if(arrLine[i].cross.length == 1)
		{
			var point = arrLine[i].cross[0].point;
			var wall = arrLine[i];

			var point1 = wall.p[0].obj;
			var point2 = wall.p[1].obj;
			
			point.p[point.p.length] = point1;
			point.p[point.p.length] = point2;
			point.start[point.start.length] = 1;			
			point.start[point.start.length] = 0;
			
			var n = (point1.p[0] == point2) ? 0 : 1;
			point1.p[n] = point;
			var n = (point2.p[0] == point1) ? 0 : 1;
			point2.p[n] = point;
		}			
	}	
	
	
	for ( var i = 0; i < arrLine.length; i++ )
	{
		if(arrLine[i].cross.length == 2)
		{
			var wall = arrLine[i];
			var pointW1 = wall.p[0].obj;
			var pointW2 = wall.p[1].obj;				
			
			var point1 = arrLine[i].cross[0].point;			
			var point2 = arrLine[i].cross[1].point;
			
			var d1 = point1.position.distanceTo(pointW1.position);
			var d2 = point2.position.distanceTo(pointW1.position);						
			
			
			if(d1 < d2) 
			{
				var n = point1.p.length;
				point1.p[n] = pointW1;
				point1.p[n + 1] = point2;
				point1.start[n] = 1;			
				point1.start[n + 1] = 0;
				
				var n = point2.p.length;
				point2.p[n] = point1;
				point2.p[n + 1] = pointW2;
				point2.start[n] = 1;			
				point2.start[n + 1] = 0;								
				
				var n = (pointW1.p[0] == pointW2) ? 0 : 1;
				pointW1.p[n] = point1;	

				var n = (pointW2.p[0] == pointW1) ? 0 : 1;
				pointW2.p[n] = point2;

				//console.log(333333, pointW1, pointW2, point1, point2);
			}
			else
			{
				var n = point2.p.length;
				point2.p[n] = pointW1;
				point2.p[n + 1] = point1;
				point2.start[n] = 1;			
				point2.start[n + 1] = 0;
				
				var n = point1.p.length;
				point1.p[n] = point2;
				point1.p[n + 1] = pointW2;
				point1.start[n] = 1;			
				point1.start[n + 1] = 0;								
				
				var n = (pointW1.p[0] == pointW2) ? 0 : 1;
				pointW1.p[n] = point2;	

				var n = (pointW2.p[0] == pointW1) ? 0 : 1;
				pointW2.p[n] = point1;
				
				//console.log(44444444, pointW1, pointW2, point1, point2);
			}
		}			
	}
	
	
	//showSkeleton(arr, cycle);
	
	
	
	// находим зоны
	var zone = detectRoomZone_2(arr);
	var arr2 = arr;
	var arr = [];
	for ( var i = 0; i < zone.length; i++ )
	{	
		arr[i] = [];
		for ( var i2 = 0; i2 < zone[i].length - 1; i2++ ) { arr[i][i2] = zone[i][i2]; }	
	}
	
	if(arr.length == 0) return;
	
	// если точка принадлежит нескольким зон, то мы ее клонируем
	if(arr.length > 1)
	{
		var arrDouble = [];
		for ( var i = 0; i < arr2.length; i++ )
		{
			
			if(arr2[i].zone.length > 1)
			{
				arrDouble[arrDouble.length] = arr2[i];
			}			
		}		
		
		for ( var i = 0; i < arr.length; i++ )
		{
			for ( var i2 = 0; i2 < arrDouble.length; i2++ )
			{
				for ( var i3 = 0; i3 < arr[i].length; i3++ )
				{
					if(arrDouble[i2] == arr[i][i3])
					{
						arr[i][i3] = createPoint_2( arrDouble[i2].position, arrDouble[i2].userData.id );
					}
				}
			}
		}
		

	}
	
	
	// обновляем параметры у точек после того как созданы зоны
	for ( var i = 0; i < arr.length; i++ )
	{
		for ( var i2 = 0; i2 < arr[i].length; i2++ )
		{
			var i3 = (i2 == 0) ? arr[i].length - 1 : i2 - 1;
			var i4 = (i2 == arr[i].length - 1) ? 0 : i2 + 1;
			
			arr[i][i2].p = []; 
			arr[i][i2].start = []; 
			
			var n = arr[i][i2].p.length;
			arr[i][i2].p[n] = arr[i][i3];
			arr[i][i2].start[n] = 1;
						
			arr[i][i2].p[n + 1] = arr[i][i4];
			arr[i][i2].start[n + 1] = 0;			
		}	
	}	


	// если хоть одна точка контура находится за пределами, предидущей фигуры, то отменяем новую форму
	if(1==2)
	{
		for ( var i = 0; i < arr.length; i++ )
		{
			for ( var i2 = 0; i2 < arr[i].length; i2++ )
			{
				if(!checkPointInsideForm(arr[i][i2], arrP)) { arr[i] = []; break; }
			}		
		}			
	}	

	
	cccc3 = (cccc3 == cccc1) ? cccc2 : cccc1;
	console.log('--------');
	// для визуализации создаем линии пересечения точек
	for ( var i = 0; i < arr.length; i++ )
	{		
		showSkeleton(arr[i], cycle);
	}
	

	for ( var i = 0; i < arr.length; i++ )
	{
		getSkeleton_2(arr[i], cycle + 1, roomId);
	}
	
}



// отображаем информация в console
function showConsoleSkeleton(arr, roomId)
{
	var str = '[' +roomId+ '] ';
	for ( var i = 0; i < arr.length; i++ )
	{		
		str += ' | ';
		
		var l = [];
		var r = [];
		
		for ( var i2 = 0; i2 < arr[i].p.length; i2++ )
		{ 
			if(arr[i].start[i2] == 1) { l[l.length] = arr[i].p[i2].userData.id; }
			if(arr[i].start[i2] == 0) { r[r.length] = arr[i].p[i2].userData.id; }
		}
		
		for ( var i2 = 0; i2 < l.length; i2++ )
		{
			str += ' '+ l[i2];
		}

		str += ' ('+arr[i].userData.id +')';
		
		for ( var i2 = 0; i2 < r.length; i2++ )
		{
			str += ' '+ r[i2];
		}		
	}	
	console.log(str);		
}


// показываем линии скелетона
function showSkeleton(arr, cycle)
{
	var pv = [];
	var vis = true;
	
	var n2 = skeleton.cycle.length;
	skeleton.cycle[n2] = { num : cycle, p : [] };	
	
	for ( var i = 0; i < arr.length; i++ )
	{
		var flag = true;
		for ( var i3 = 0; i3 < pv.length; i3++ )
		{
			if(pv[i3] == arr[i]) { flag = false; break; }
		}		
		
		if(flag)
		{
			if(vis)
			{
				pv[pv.length] = arr[i];
				
				var point = createPoint( arr[i].position, arr[i].userData.id );				
				
				point.p = arr[i].p;
				point.start = arr[i].start;
				skeleton.point[skeleton.point.length] = point;							
			}
			
			skeleton.cycle[n2].p[skeleton.cycle[n2].p.length] = arr[i].position;
		}
		
		if(vis)
		{
			var i3 = (i == arr.length - 1) ? 0 : i + 1;
			skeleton.line[skeleton.line.length] = createOneWall_4( arr[i].position, arr[i3].position, cccc3 );						
		}
	}	
}



function detectRoomZone_2(arrP)
{		
	var arrRoom = [];
	
	for ( var i = 0; i < arrP.length; i++ )
	{			
		if(arrP[i].p.length < 2){ continue; }

		for ( var i2 = 0; i2 < arrP[i].p.length; i2++ )
		{
			if(arrP[i].p[i2].p.length < 2){ continue; }				

			var p = getContour_2([arrP[i]], arrP[i].p[i2]); 					 
			
			if(p[0] != p[p.length - 1]){ continue; }	
			if(p.length > 5){ if(p[1] == p[p.length - 2]) continue; }  		
			if(checkClockWise_2(p) <= 0){ continue; }	//var txt = ''; for ( var i3 = 0; i3 < p.length; i3++ ) { txt += ' | ' + p[i3].userData.id; } console.log(1111111, checkClockWise(p), txt);
			
			if(detectSameZone( arrP[i].zone, p )){ continue; }			


			for ( var i3 = 0; i3 < p.length - 1; i3++ ) 
			{  
				p[i3].zone[p[i3].zone.length] = { p : p };						
			}
			
			arrRoom[arrRoom.length] = p;					
			break; 
		}
	}

	return arrRoom;
}




//площадь многоугольника (нужно чтобы понять положительное значение или отрецательное, для того чтобы понять напрвление по часовой или проитв часовой)
function checkClockWise_2( arrP )
{  
	var res = 0;
	var n = arrP.length;
	
	for (i = 0; i < n; i++) 
	{
		var i2 = (i == arrP.length - 1) ? 0 : i + 1;
		
		for (i3 = 0; i3 < arrP[i].p.length; i3++)
		{
			if(arrP[i].p[i3] == arrP[i2])
			{
				if(arrP[i].start[i3] != 0) return -1;
			}			
		}
		
		
		var p1 = arrP[i].position;
		
		if (i == 0)
		{
			var p2 = arrP[n-1].position;
			var p3 = arrP[i+1].position;					
		}
		else if (i == n-1)
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[0].position;			
		}
		else
		{
			var p2 = arrP[i-1].position;
			var p3 = arrP[i+1].position;			
		}
		
		res += p1.x*(p2.z - p3.z);
	}
	
	
	res = res / 2;
	//res = Math.round(res * 10) / 10;
	
	return res;
}






var cccc1 = new THREE.Color('#aaf0d1');
var cccc2 = 0x808080;
var cccc3 = cccc1;


// создание визуальных точек
function createPoint_2( pos, id )
{
	var point = {};		

	point.position = pos;
	point.p = [];
	point.start = [];		
	point.zone = [];
	
	
	if(id == 0) { id = countId; countId++; }
	point.userData = {};	
	point.userData.id = id;	
	point.userData.tag = 'point';		
	
	return point;
}


// создание визуальных линий
function createOneWall_4( pos1, pos2, cccc3 ) 
{	
	var d = pos1.distanceTo( pos2 );	
	
	var material = new THREE.MeshLambertMaterial( { color : 0xedded4, clippingPlanes : [ clippingMaskWall ], lightMap : lightMap_1 } );		
	var materials = [ new THREE.MeshLambertMaterial( { color: cccc3, clippingPlanes: [ clippingMaskWall ], lightMap : lightMap_1 } ), material.clone(), material.clone() ];		
	var geometry = createGeometryWall(d, 1, 0.04, 0);	
	var wall = new THREE.Mesh( geometry, materials ); 
	
	wall.position.copy( pos1 );
	
	var dir = new THREE.Vector3().subVectors( pos1, pos2 ).normalize();
	var angleDeg = Math.atan2(dir.x, dir.z);
	wall.rotation.set(0, angleDeg + Math.PI / 2, 0);			
	
	scene.add( wall );
	
	return wall;
}


 