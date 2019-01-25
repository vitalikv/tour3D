<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1280, height=720">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Planoplan Editor</title>
  <style>
    body {
      margin: 0;
    }
    .wrapper  {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
    }
  </style>
</head>

<body>
  <div id="root"></div>
  <div id="modalRoot"></div>
  <div class="wrapper">
    <iframe 
      id="editor"
      name="editor"
      width="100%"
      height="100%"
      frameborder="0"
      src="./editor.php?hideUI"
      allowfullscreen>
    </iframe>
  </div>
  <script src="//vkontakte.ru/js/api/openapi.js" type="text/javascript"></script>
  <script type="text/javascript">VK.init({ apiId: "3192013" })</script>
  <script type="text/javascript">window.fbAsyncInit = function () { FB.init({ appId: "271237832978902", cookie: !0, version: "v3.0" }) }, function (e) { var n, t = "facebook-jssdk"; e.getElementById(t) || ((n = e.createElement("script")).id = t, n.async = !0, n.src = "//connect.facebook.net/ru_RU/all.js", e.getElementsByTagName("head")[0].appendChild(n)) }(document)</script>
  <script src="./ui/build/static/js/main.js"></script>
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
          camera: '3d',
          env: 'lite',
		  link_save : 'https://' + window.location.hostname + '/projects/save/',
		  version : 'planoplan',
        });		
      }
    }
  </script> 
  
 
</body>

</html>