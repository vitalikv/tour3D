<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webgl-editor</title>
</head>

<body>
  <div id="root"></div>

  <script src="ugol/dist/bundle.js"></script>
  <script>
    var editorFrame = window.frames.editor;
    var editorElement = document.getElementById('editor');
    
    window.addEventListener('message', handlePostMessage);

    function EditorInvokeFunction(name, value) {
      if (name === 'PointerOnInterface') {
        editorElement.style.pointerEvents = value === 0 ? 'all' : 'none';
      }

      editorFrame.postMessage({
        type: 'EditorInvokeFunction',
        name: name,
        value: value
      }, '*');
    }

    function handlePostMessage(event) {
      var message = event.data;

      if (message.type === 'UIInvokeFunction') {
        if (typeof window.UIInvokeFunction === 'function') {
          window.UIInvokeFunction(message.name, message.value);
        }
      }
      
      var buttons = {
        save: 1,
        clone: 1,
        undo: 1,
        redo: 1,
        line: 1,
        zone: 1,
        door: 1,
        window: 1,
        doorway: 1,
        changeView: 1,
        toggleSizes: 1,
        center: 1,
        centerCamera2d: 1,
        zoomIn: 1,
        zoomOut: 1,
        angle: 1,
        changeViewMode: 1,
        cameraHeight: 1,
        ceilingHeight: 1,
        units: 1,
        render: 1,
        panoRender: 1,
        help: 1,
        pickDesign: 1,
        primitives: 1
      }

      if (message.action === 'EDITOR.READY') {
        editorFrame.postMessage({
        type: 'UIInvokeFunction',
        name: 'SetAvaibleButtons',
        value: buttons
        }, '*');

        var url = new URL(window.location.href); 
        var file = url.searchParams.get('file');  		
        
        EditorInvokeFunction('OpenProject', { 
          file: file,
          mode : 0,
		  version : 'planoplan',
        });		
      }
    }
  </script> 
</body>

</html>