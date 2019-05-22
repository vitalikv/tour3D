var editorApi = (function () {
  return {
    OpenProject: function (value) {

      param_ugol.file = (value.file) ? value.file : '';
      param_ugol.hash = (value.hash) ? value.hash : '';
      param_ugol.key = (value.key) ? value.key : libs;
      param_ugol.link_render = (value.link_render) ? value.link_render : '';
      param_ugol.link_save = (value.link_save) ? value.link_save : '';
	  if(value.env) { param_ugol.env = value.env; }
      if(value.camera) { param_ugol.camera = value.camera; }
	  if(value.version) { param_ugol.version = value.version; }
	  else { param_ugol.version = 'ugol'; }
	  
	if(param_ugol.env) 
	{
		if(param_ugol.env == 'lite')
		{
			infProject.scene.type.startMoveCamera = true;
			infProject.scene.type.startMoveObj = true; 			
		}
	}	  
	else
	{
		addJsonPopBase_1({ arrLotid: [8747, 8740, 31, 10, 9012, 278, 575, 4954, 4956, 4957, 11, 12, 38, 526, 177] });
	}
	
	  
      console.log(param_ugol);
      
      assignBlockParam(value.mode); 


      if (param_ugol.file == '') {

        if (window.location.hostname == 'tour3d' || window.location.hostname == 'plan3' || window.location.hostname == 'webgl-editor' || window.location.hostname == 'pp.ksdev.ru') 
		{

          if (1 == 2) {
            UIInvokeFunction('ShowFakeLoader', 'projectLoader');
            UIInvokeFunction('ProjectLoadStart');
            UIInvokeFunction('DisableUI');

            UIInvokeFunction('HideFakeLoader', 'projectLoader');
            UIInvokeFunction('ProjectLoadEnd');
            UIInvokeFunction('EnableUI');

            createForm('level_2');
          }
          else 
		  {         
			loadFile('');
          }
 
          UIInvokeFunction('ShowStatsPanel', 'fps');

          if (1 == 2) {
            loadPopObj_1({ lotid: 60777 });
            loadPopObj_1({ lotid: 12196 });
            loadPopObj_1({ lotid: 12199 });
          }
        }
        else { loadTotalLotid({ code_server: 'new project' }); }
      }
      else {
        loadFile(param_ugol.file);
      }
    },

    SaveProject: function (value) {
      saveFile({});
    },

    ProjectSaveAsNew: function (value) {
		param_ugol.link_save = 'https://' + window.location.hostname + '/projects/save/';
      saveFile({ about_standalone : 1 });
    },

    ApplyDesign: function (value) { 

		if(param_ugol.env) 
		{ 
			if(param_ugol.env == 'lite')
			{ 
				var room_id = value.allModifiers.GetRoomTypeAsDesign[0];
				value = { room_id : room_id, file : value.fileRender, preview : value.preview, replace : true, type : 'planoplan', lotid : value.id };
			}		
		}
	
      if (value.replace) { getDesignFile(value); }
      else { catalogSelectionObj(value); }
    },

    ApplyMaterial: function (value) {
      catalogSelectionObj(value);
      UIInvokeFunction('ApplyMaterial', value.preview);
    },

    ApplyObject: function (value) {
      loadPopObj_1([{ lotid: value.id, pr_id: 'new', pos: new THREE.Vector3(), rot: new THREE.Vector3(), catalog: value.source, lotGroup: value.lotGroup, size: value.size, modifiers: value.modifiers }]);
    },


    ApplyLayout: function (value) {
      loadPopObj_1({ lotid: value });
    },

    Set3DCameraToRenderPosition: function (value) {
      switchCamers3D(value);
    },

    PointerOnInterface: function (value) {
    },

    PointerClickOnInterface: function (value) {  
		//if(obj_selected) { mouseDownRight(); }
		if(obj_selected) { console.log(77777); }
    },

    SetView: function (value) { 
      if (value == '2d') { UI.setView('2D'); }
      else if (value == '3d') { UI.setView('3D'); }
      //TODO переключение камер '2d/3d/walk'; UIInvokeFunction('SetView', '2d/3d/walk');
    },

    SetCameraZoom: function (value) {
		if(camera == cameraTop) 
		{
			//value = interpolationsQuadratic( value, 0, 0.9999, 1 ); 
			cameraZoomTop( THREE.Math.lerp ( 20, 0.5, value ) );  
			
			renderCamera();
		}
    },

    SetCameraToCenter: function (value) {
		if(camera == cameraTop) { centerCamera2D(true); }
		else if(camera == camera3D) { centerCamera3D(); }		
    },

    ShowGrid: function (value) {
	
    },

    ShowSun: function (value) {

    },

    ShowCustomCams: function (value) {

    },

    GetInfoForBugreport: function (value) {

    },

    MouseClick: function (value) {
      onDocumentMouseDown(value);
      onDocumentMouseUp(value);
    },
  }
})();


 
function EditorInvokeFunction(name, value) {
  if (typeof editorApi[name] === 'function') {
    editorApi[name](value);
  }
}

function handleEditorInvokeFunction(message) {
  if (message.data.type !== 'EditorInvokeFunction') return;
  var name = message.data.name;
  var value = message.data.value;

  EditorInvokeFunction(name, value);
}

window.EditorInvokeFunction = EditorInvokeFunction;
window.addEventListener('message', handleEditorInvokeFunction);
