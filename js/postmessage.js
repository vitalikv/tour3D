/* global setCatalogSource, initUIButtons,param_ugol,loadFilePL,getDesignFile, createForm,loadPopObj, setCatalogSource, deletePlinths,param_3d_click, THREE, saveFile, loadFile  */
var editorButtons = null;
var editorShowInterfaceTutorial = false;
var editorShowToolbarHelp = false;

function sendMessage(action, payload) {
  window.parent.postMessage({ 'action': action, 'payload': payload }, '*');
  console.log('%cSENDING', 'color: #8500ff', action, 'payload ', payload);
}


function listener(event) 
{
	if (event.source === window) return;
	var msg = event.data;
	//console.log(msg);
	var source = msg.action && msg.action.split('.')[0];
	var action = msg.action && msg.action.split('.')[1];

	if (source === 'CATALOG') 
	{
 
		if (action === 'OBJECT_PICK') 
		{
			var obj = clickO.last_obj;
			
			clickO.obj = null;
			if(camera == cameraTop) { hideMenuObjUI_2D( obj ) }
			else if(camera == camera3D) { hideMenuObjUI_3D( obj ) }
			else if(camera == cameraWall) { hideMenuObjUI_Wall( obj ) }
			clickO.last_obj = null;
			
			window.focus();
			if(msg.payload.data)
			{
				var json = msg.payload.data;
				var lotGroup = msg.payload.data.lotGroup;
				var type = msg.payload.data.type;
				var preview = msg.payload.data.preview;
				var caption = msg.payload.data.caption;
				var infCatalog = { caption: caption, id: json.id, lotGroup: lotGroup, modifiers: json.modifiers, preview: preview, name: json.shortName }
				console.log('----payload.data | replace: ', msg.payload.replace);			
			}
			else
			{
				var json = msg.payload;
				var lotGroup = msg.payload.lotGroup;
				var type = msg.payload.type;
				var preview = msg.payload.preview;
				if(msg.payload.source) var infCatalog = msg.payload.source;
				if(msg.payload.source) var caption = msg.payload.source.caption;

				var category = menuUI.category;			
				if(category != '') { msg.payload.replace = true; }			
			}
			
			var json = setApiPopObj(json);

	

			if(lotGroup == 'Doors')
			{
				if(camera != cameraTop) { if(!msg.payload.replace) { UI.setView('2D'); return; } }
			}

			if (type != 'TypalRoom') setCatalogSource(infCatalog, lotGroup);

			if (type == 'object' || type == 'TypalRoom') 
			{				
				if (lotGroup == '') { lotGroup = 'Furniture'; }
				
				if (lotGroup == 'Plinths') 
				{				
					deletePlinths(obj, false);
					UI('plinth-preview').val(preview);
					UI.setObjectCaption(caption, 'plinth');
				} 
				else if (lotGroup == 'FurnitureDoorHandle') 
				{
					UI('handle-preview').val(preview);
					UI.setObjectCaption(caption, 'handle');
				} 
				else 
				{
					if (obj) 
					{
						if (obj.userData.tag === 'door') { UI('doors-preview').val(preview); }
					}
				}
				
				
				json.obj = obj;
				json.catalog = infCatalog;
				json.category = category;
				json.replace = msg.payload.replace;
				
				loadPopObj_1(json); 
			}
			else if (type == 'material') 
			{			  
				setCatalogSource(infCatalog, lotGroup);

				UI('wall-preview').val(preview);
				UI('floor-preview').val(preview);
				UI.setObjectCaption(caption);

				

				if (msg.payload.replace) 
				{
					if(obj.userData.tag == 'obj')
					{
						if(obj.userData.obj3D.edge)
						{
							var num = Number(obj.userData.obj3D.edge);
							
							UI('texture-select').val([{id: num, image: preview }]);
						}
					}
					
					var inf = [];
					
					if (obj.userData.tag == 'wall')
					{
						for ( var i = 0; i < arrWallFront.wall.length; i++ ) 
						{ 
							inf[i] = JSON.parse(JSON.stringify(json)); 
							inf[i].obj = arrWallFront.wall[i].obj; 
							inf[i].index = arrWallFront.wall[i].index;
						}
					}
					else
					{
						var inf = [json];
						inf[0].obj = obj;
					}
					
					for ( var i = 0; i < inf.length; i++ )
					{
						inf[i].start = 'new';
						inf[i].catalog = infCatalog;
						inf[i].replace = msg.payload.replace;						
						
						loadPopObj_1(inf[i]);
					}
	
				}
				else
				{
					catalogSelectionObj(json);
				}
			}
		}
	}

	if (source === 'UGOL') 
	{
		switch (action) 
		{
			case 'INIT':

				UIInvokeFunction('SetAvaibleButtons', msg.payload.buttons);
				UIInvokeFunction('DisableUI');
				UIInvokeFunction('SetProjectInfo', {hash: msg.payload.hash, file: msg.payload.file});

				if (typeof msg.payload.tutorial === 'object') {
					UIInvokeFunction('ShowInterfaceTutorial', msg.payload.tutorial.showInterfaceTutorial);
					UIInvokeFunction('ShowToolbarHelp', msg.payload.tutorial.showToolbarHelp);
					UIInvokeFunction('ResetToolbarHelp', msg.payload.tutorial.clearToolbarHelpMemory);
				}

				EditorInvokeFunction('OpenProject', msg.payload);


			break;
			
			case 'REINIT':

				if(msg.payload.buttons) UIInvokeFunction('SetAvaibleButtons', msg.payload.buttons);
				
				if(msg.payload.file) param_ugol.file = msg.payload.file;
				if(msg.payload.hash) param_ugol.hash = msg.payload.hash;
				if(msg.payload.key) param_ugol.key = msg.payload.key;
				if(msg.payload.link_render) param_ugol.link_render = msg.payload.link_render;
				if(msg.payload.link_save) param_ugol.link_save = msg.payload.link_save;
				if(msg.payload.camera) param_ugol.camera = msg.payload.camera;
				
				if(msg.payload.mode) assignBlockParam(value.mode);	

				if (typeof msg.payload.tutorial === 'object') 
				{
					UIInvokeFunction('ShowInterfaceTutorial', msg.payload.tutorial.showInterfaceTutorial);
					UIInvokeFunction('ShowToolbarHelp', msg.payload.tutorial.showToolbarHelp);
					UIInvokeFunction('ResetToolbarHelp', msg.payload.tutorial.clearToolbarHelpMemory);
				}				

			break;			

			case 'CHANGE_VIEW':

				EditorInvokeFunction('SetView', msg.payload.view);
				
			break;			
			
			case 'PROJECT_SAVE':

				EditorInvokeFunction('SaveProject');
				
			break;
			
			case 'REINIT':
			
				UIInvokeFunction('SetAvaibleButtons', msg.payload.buttons);
				sendMessage('EDITOR.REINIT_SUCCESS', null);
				
			break;
			
			case 'DESIGN_PICK':
				
				EditorInvokeFunction('ApplyDesign', msg.payload);

			break;
			
			case 'OBJECT_PICK':

				if (msg.payload.type == 'material') 
				{
					EditorInvokeFunction('ApplyMaterial', msg.payload);
				}
				else
				{	
					EditorInvokeFunction('ApplyObject', msg.payload);
				}

			break;	
			
			case 'LAYOUT_PICK':
			
				EditorInvokeFunction('ApplyLayout', msg.payload.id);
				//loadPopObj_1({ lotid: msg.payload.id, lotGroup: msg.payload.lotGroup });
			
			break;			

			case 'CAMERA_PICK': 

				EditorInvokeFunction('Set3DCameraToRenderPosition',  msg.payload.id);

			break;				
		}
	}
}


// заменяем id на lotid
function setApiPopObj(cdm)
{
	if(!cdm.id) return cdm;
	
	cdm.lotid = cdm.id;
	delete cdm.id;
	
	return cdm;	
}



// выбрали объект/материал из основного каталога (превью приклепляеется к мыши)
function catalogSelectionObj(msg)
{ 
	if(clickO.last_obj) { hideMenuObjUI_3D(clickO.last_obj); clickO.last_obj = null; }		
	if(camera == cameraTop) { objDeActiveColor_2D(); hideMenuObjUI_2D(clickO.last_obj); }   
	
	UIInvokeFunction('ShowPreviewAtCursor', msg.preview);	
	
	menuUI.select = msg;	
	
	addJsonPopBase_1({ arrLotid : [msg.lotid] });   
}


// кликнули на что-то когда у нас выбран объект/материал из каталога
function catalogClickObj(obj, intersect)
{ 
	if(!menuUI.select) return;
	
	if(obj)
	{
		var flag = false;
		var index = 0;
		
		if(menuUI.select.room_id)
		{
			if(obj.userData.tag == 'room') { flag = true; }
		}
		else
		{
			if(obj.userData.tag == 'wall') { index = intersect.face.materialIndex; if(index == 1 || index == 2) { flag = true; } }
			else if(obj.userData.tag == 'room') { flag = true; }	
			else if(obj.userData.tag == 'ceiling') { flag = true; }
		}
		
		if(flag)
		{
			if(menuUI.select.room_id) { getDesignFile(menuUI.select); }
			else 
			{ 
				if (obj.userData.tag == 'wall')
				{
					var sel = menuUI.select;
					
					for ( var i = 0; i < arrWallFront.wall.length; i++ )
					{ 
						var obj = arrWallFront.wall[i].obj;
						var index = arrWallFront.wall[i].index;
						
						loadPopObj_1({ obj: obj, lotid: sel.lotid, start: 'new', index: index, catalog : sel.source });
						setUIPreview( obj, obj.userData.material[index].preview, obj.userData.material[index].catalog, index);
					}
				}
				else
				{
					loadPopObj_1({ obj: obj, lotid: menuUI.select.lotid, start: 'new', index: index, catalog : menuUI.select.source }); 
				}								
			}			
		}
	}
		
	menuUI.select = null;
	
	UI.hideObjectPreview();
}


// скрываем превью у мыши
function catalogResetObj()
{
	menuUI.select = null;
	
	UI.hideObjectPreview();
}



window.addEventListener('message', listener);


