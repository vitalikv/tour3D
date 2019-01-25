var actionInProgress;
var renderMode = 'render';


//Заканчиваем события при отпускании кнопки
$(document).on('mouseup touchend', function () {
  if (typeof actionInProgress !== 'object') return;
  emitAction(
    actionInProgress.action,
    actionInProgress.value,
    actionInProgress.target,
    'end'
  );
  actionInProgress = '';
});


function initUIButtons(buttons, callback) {
  refreshUIButtons();
  console.log(buttons);
  $.each(buttons, function (index, button) {
    var current = $('[data-action="' + index + '"]').parent().find('.overlay-btn');
    var del = 0;
    if (!current.length) {
      del = 1;
      current = $('[data-section="' + index + '"]');
    }
    switch (parseInt(button)) {
      case 0:
        del ? current.remove() : current.addClass('off');
        break;
      case 1:
        current.addClass('on');
        break;
      case 2:
        current.addClass('on');
        current.data({ inactive: true });
        break;
      case 3:
        current.addClass('disabled');
        break;
    }
  });
  if (typeof callback === 'function') {
    callback();
  }
}

function disableUIButtons() {
  disabledButtons = setAllUIButtons(Object.assign({}, editorButtons), 3);
  initUIButtons(disabledButtons);
}

function setAllUIButtons(buttons, stage) {
  $.each(buttons, function (index) {
    buttons[index] = stage;
  })
  return buttons;
}

function refreshUIButtons() {
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
    primitives: 1
  };
  $.each(buttons, function (index) {
    var current = $('[data-action="' + index + '"]').parent().find('.overlay-btn');
    current.removeClass('off');
    current.removeClass('on');
    current.removeClass('disabled');
    current.data({ inactive: false });
  });
}


//Навешиваем события на все data-action
$('[data-action]').on('mousedown touchstart', function (e) {
  var $this = $(this);
  var $target;
  var $action;
  var action;
  var value;
  if ($this.parents('.disabled--in-2d').length > 0) {
    return;
  }

  if ($this.hasClass('disabled') || $this.find('.disabled').length) {
    return;
  }

  $target = $(e.currentTarget);
  $action = $(e.target).data('action') || $(e.currentTarget).data('action');
  action = $action.split(' ')[0];

  if ($this.data('action') === 'zoomIn' ||
    $this.data('action') === 'zoomOut') {
    value = null;
    emitAction(action, value, $target, 'start');
    actionInProgress = {
      target: $target,
      action: action,
      value: value
    };
  }

  if ($this.data('continuous')) {
    emitAction(action, value, $target, 'start');
    actionInProgress = {
      target: $target,
      action: action,
      value: value
    };
  }

});


$('[data-action]').on('mousemove touchmove', moveMouseAboveButton);


function moveMouseAboveButton() {
  if (camera == cameraTop) {
    activeHover2D_2();
  }
}


$('[data-action]').on('click touchstart', function (e) {
  var $target;
  var $action;
  var action;
  var value;
  var $this = $(this);

  if ($this.data('continuous') === true) {
    return;
  }

  if ($this.data('source') === 'select') {
    return;
  }
  if ($this.data('source') === 'texture-select') {
    return;
  }
  if ($this.parents('.disabled--in-2d').length > 0) {
    UI.setView('2D');
    return;
  }

  if ($this.hasClass('disabled') || $this.find('.disabled').length) {
    return;
  }

  if ($this.data('source') === 'radio') {
    $(e.target).data('value') ?
      $target = $(e.target) :
      $target = $(e.target).closest('[data-value]');
    if ($target.length === 0) return;
    switchRadioBtn($this, $target);

    return;
  }

  $target = $(e.currentTarget);
  $action = $(e.target).data('action') || $(e.currentTarget).data('action');
  action = $action.split(' ')[0];

  if (action === 'open-catalog') {
    value = $(e.target).data('catalog') || $(e.currentTarget).data('catalog');
  }

  if (typeof action !== 'string') return;

  if ($this.data('inactive')) {
    sendMessage('EDITOR.ERROR', { code: 403, button: action });
    return;
  }

  emitAction(action, value, $target);
});


//Переключение радио кнопок
function switchRadioBtn($group, $el) {
  var action = $el.data('value');

  $group.children('.b-toolbar__btn_active').removeClass('b-toolbar__btn_active');
  $el.addClass('b-toolbar__btn_active');
  $group.data('selected', action);

  emitAction(action, null, $el);
}

//Подсказки
$('[data-action]').on({
  'mouseenter': function (e) {
    if (e.target.className === 'tooltip' || $(e.currentTarget).hasClass('overlay-menu_open') || $(e.currentTarget).hasClass('overlay-select_open') || UI.isMouseDown) return;
    var self = this;
    UI.tooltipTimer = setTimeout(function () { UI.showTooltip(self); }, 500);
  },
  'mouseleave': function (e) {
    clearTimeout(UI.tooltipTimer);
    if (e.relatedTarget && ($(e.relatedTarget.parentNode).closest('[data-action]')[0] === this)) return;
    UI.hideTooltip(this);
  },
  'click': function (e) {
    clearTimeout(UI.tooltipTimer);
    if (e.relatedTarget && ($(e.relatedTarget.parentNode).closest('[data-action]')[0] === this)) return;
    UI.hideTooltip(this);
  }
});

$('[data-action]').on('change', function () {
  $(this).blur();
});

$('[data-action]').on('keyup', function (e) {
  if (e.keyCode === 13) {
    $(this).blur();
  }
});

//Экшены
function emitAction(action, value, $source, stage) {
  var targetName = ($source) ? $source[0].className : false;
  console.log('target: ' + targetName + '\r\n' + 'action: ' + action + '\r\n' + 'value: ' + value + '\r\n' + 'stage: ' + stage);
  if (typeof stage === 'undefined') {


    if (obj_selected) return;

    if (action == 'shape' || action == 'shape1' || action == 'shape2' || action == 'shape3' || action == 'shape4' || action == 'shape5' || action == 'shape6') { createForm(action); }
    else if (action == 'changeView') { UI.changeView(); }
    else if (action == 'changeViewMode') { UI.changeViewMode($source); }
    else if (action == 'line') { clickO.button = 'create_wall'; }
    else if (action == 'add-wall-dot') { clickO.button = 'add_point'; }
    else if (action == 'zone') { clickO.button = 'create_zone'; }
    else if (action == 'window') { clickO.button = 8747; }
    else if (action == 'singleWindow') { clickO.button = 8747; }
    else if (action == 'doubleWindow') { clickO.button = 8740; }
    else if (action == 'tripleWindow') { clickO.button = 31; }
    else if (action == 'balconyDoor') { clickO.button = 10; }
    else if (action == 'balconyLeftDoor') { clickO.button = 11; }
    else if (action == 'balconyCenterDoor') { clickO.button = 12; }
    else if (action == 'balconyRightDoor') { clickO.button = 11; }
    else if (action == 'door') { clickO.button = 9012; }
    else if (action == 'singleDoor') { clickO.button = 9012; }
    else if (action == 'doubleDoor') { clickO.button = 534; }
    else if (action == 'tripleDoor') { clickO.button = 278; }
    else if (action == 'doorway') { clickO.button = 575; }
    else if (action == 'save') { saveFile({}); }
    else if (action == 'save-project-result') { sendMessage('EDITOR.PROJECT_SAVED', value); }
    else if (action == 'undo') { setInfoEvent1('undo'); renderCamera(); }
    else if (action == 'redo') { setInfoEvent1('redo'); renderCamera(); }
    else if (action == 'wallRedBlueArrow') { toggleButtonMenuWidthWall(clickO.obj); }
    else if (action == 'wallBlueArrow') { toggleButtonMenuWidthWall(clickO.obj); }
    else if (action == 'wallRedArrow') { toggleButtonMenuWidthWall(clickO.obj); }
    else if (action == 'room-type') { clickTableZoneUI(value); }
    else if (action == 'delete-wall') { detectDeleteObj(); }
    else if (action == 'delete-door') { detectDeleteObj(); }
    else if (action == 'delete-window') { detectDeleteObj(); }
    else if (action == 'delete-object') { detectDeleteObj(); }
    // else if (action == 'help') { tutorial.show('wall', 0, ['line', 'shape']); }
    // else if (action == 'help') { sendMessage('EDITOR.OPEN_TUTORIAL') }    
    else if (action == 'open-catalog') { sendMessReplaceObj(value); }
    else if (action == 'open-design-catalog') { var r = TEMPgetRoomType(UI('room-type').val()); r && sendMessage('EDITOR.DESIGN_CLICK', { roomType: { id: r.id, caption: r.caption, alias: r.alias } }); }//roomType: { id: null, alias: null } }
    else if (action == 'delete-texture-wall') { deleteTextureWall(clickO.last_obj, clickO.index); renderCamera(); }
    else if (action == 'delete-texture-floor') { deleteTextureFloorCeiling(clickO.last_obj); renderCamera(); }
    else if (action == 'rotate-45-w3d') { materialRotation({ obj: clickO.last_obj, rot: Math.PI / 4, loop: true, index: clickO.index }); }
    else if (action == 'rotate-90-w3d') { materialRotation({ obj: clickO.last_obj, rot: Math.PI / 2, loop: true, index: clickO.index }); }
    else if (action == 'rotate-45-f3d') { materialRotation({ obj: clickO.last_obj, rot: Math.PI / 4, loop: true }); }
    else if (action == 'rotate-90-f3d') { materialRotation({ obj: clickO.last_obj, rot: Math.PI / 2, loop: true }); }
    else if (action == 'clear-plinths-preview') { deletePlinths(clickO.last_obj, false); $source.attr('data-selected', false); }
    else if (action == 'showCatalogButton') { sendMessage('show-catalog-button'); }
    else if (action == 'hideCatalogButton') { sendMessage('hide-catalog-button'); }
    else if (action == 'render') { UI.setRenderMode('render'); changeCamera(camera3D); UI.changeView('render'); }
    else if (action == 'panoRender') { switchPanorama360(true); }
    else if (action == 'vr-panorama') { UI.setRenderMode('vr-panorama'); UI.changeView('render'); }
    else if (action == 'make-render') { saveFile({type :'render'}); }
    else if (action == 'make-pano-render') { UI.setRenderMode('vr-panorama'); saveFile({type :'vr-panorama'}); }
    else if (action == 'preview-pano-render') { camera3D.userData.camera.rot360 = { start: true, angle: 0, qEnd: null } }
    else if (action == 'centerCamera2d') { centerCamera2D(true); }
    else if (action == 'centerCamera3d') { centerCamera3D(); }
    else if (action == 'exitCameraWindow') { changeCamera(camera3D); }
    else if (action == 'cameraWall') { changeCamera(cameraWall); UI.changeView('window'); }
    //else if (action == 'obj_pop_height_above_floor') { inputChangeHeightPopObj(value); } 
    else if (action == 'load-project-start') { UI.showAlert('Загрузка объектов', 'loader', '', '', 'projectLoader'); UI.startFakeLoading('projectLoader', 100, 0); sendMessage('EDITOR.LOAD_START'); disableUIButtons(); }
    else if (action == 'load-project-end') { /*UI.updateProgressBar('projectLoader', 100, 100);*/ UIInvokeFunction('ProjectLoadEnd'); initUIButtons(editorButtons); }
    else if (action == 'stop-fake-loading') { UI.stopFakeLoading('projectLoader') }
    else if (action == 'load_error') { sendMessage('EDITOR.ERROR', { code: value.code, key: getErrorKey(value.code) }); }
    else if (action == 'camera-angle') { camera3D.fov = value / 2 + 35; camera3D.updateProjectionMatrix(); }
    else if (action == 'camera-height') { changeHeightCameraFirst(value); }
    else if (action == 'delete-plinth') { deletePlinths(clickO.last_obj, false); UI('plinth-preview').val(''); UI.setObjectCaption('', 'plinth'); }
    else if (action == 'apply-to-all-walls') { assignTextureOnAllWall(); }
    else if (action == 'rotate-45-object') { inputGizmo(45); }
    else if (action == 'rotate-90-object') { inputGizmo(90); }
    else if (action == 'rotate-0-object') { inputGizmo(0); }
    else if (action == 'door_horizontal') { changeInputPosDoorLeaf(0); renderCamera(); }
    else if (action == 'door_vertical') { changeInputPosDoorLeaf(1); renderCamera(); }
    else if (action == 'delete-handle') { /* deleteHandle() */ UI('handle-preview').val(''); UI.setObjectCaption('', 'handle'); }
    else if (action == 'units') { setUnits(value) }
    else if (action == 'show-interface-tutorial') { showInterfaceTutorial() }
    else if (action == 'show-hotkeys') { showHotkeys() }
    else if (action == 'floor_texture_rotation') { materialRotation({ obj: clickO.last_obj, rot: THREE.Math.degToRad(value) }); }
    else if (action == 'wall_texture_rotation') { materialRotation({ obj: clickO.last_obj, rot: THREE.Math.degToRad(value), index: clickO.index }); }
    else if (action == 'drag') { switchMoveRotateScale(87); }
    else if (action == 'scale') { switchMoveRotateScale(82); }
    else if (action == 'rotate') { switchMoveRotateScale(69); }
    else if (action == 'primitive-cube') { clickO.button = 72184; /*38*/ }
    else if (action == 'primitive-cylinder') { clickO.button = 526; }
    else if (action == 'primitive-sphere') { clickO.button = 177; }
    else if (action == 'door_width_1') { if (value != undefined) inputWidthHeightWD(clickO.last_obj); }
    else if (action == 'door_height_1') { if (value != undefined) inputWidthHeightWD(clickO.last_obj); }
    else if (action == 'texture-select' || action == 'texture-select-edge') {
      clickO.last_obj.userData.obj3D.edge = value;
	  var lotid = clickO.last_obj.children[0].children[value - 1].userData.material.lotid;
      sendMessage('EDITOR.OPEN_CATALOG', { lotid: lotid, category: 'wall-material', filter: '', source: '', replace: true });
    }
    else if (action == 'texture-select-edge') { clickO.last_obj.userData.obj3D.edge = value; }
    else if (action == 'openSubToolbar') {
      if (value == 'settings-object-transform-toolbar') {
        showMenuTextureObjPop(clickO.last_obj);
      }
    }
  }
  if (stage === 'start') {
    if (action == 'zoomIn') { zoomLoop = 'zoomIn'; }
    else if (action == 'zoomOut') { zoomLoop = 'zoomOut'; }
    else if (action == 'wall_texture_offset_x_add') { moveTexture = { axis: 'x', value: -0.005 }; }
    else if (action == 'wall_texture_offset_x_sub') { moveTexture = { axis: 'x', value: 0.005 }; }
    else if (action == 'wall_texture_offset_y_add') { moveTexture = { axis: 'y', value: -0.005 }; }
    else if (action == 'wall_texture_offset_y_sub') { moveTexture = { axis: 'y', value: 0.005 }; }
    else if (action == 'floor_texture_offset_x_add') { moveTexture = { axis: 'x', value: -0.005 }; }
    else if (action == 'floor_texture_offset_x_sub') { moveTexture = { axis: 'x', value: 0.005 }; }
    else if (action == 'floor_texture_offset_y_add') { moveTexture = { axis: 'y', value: -0.005 }; }
    else if (action == 'floor_texture_offset_y_sub') { moveTexture = { axis: 'y', value: 0.005 }; }
  }
  if (stage === 'end') {
    if (action == 'zoomIn') { zoomLoop = ''; }
    else if (action == 'zoomOut') { zoomLoop = ''; }
    else if (action == 'wall_texture_offset_x_add') { moveTexture = {}; }
    else if (action == 'wall_texture_offset_x_sub') { moveTexture = {}; }
    else if (action == 'wall_texture_offset_y_add') { moveTexture = {}; }
    else if (action == 'wall_texture_offset_y_sub') { moveTexture = {}; }
    else if (action == 'floor_texture_offset_x_add') { moveTexture = {}; }
    else if (action == 'floor_texture_offset_x_sub') { moveTexture = {}; }
    else if (action == 'floor_texture_offset_y_add') { moveTexture = {}; }
    else if (action == 'floor_texture_offset_y_sub') { moveTexture = {}; }
  }
}


var menuUI = { select: null, category: '' };




// заменаяем материал/объект
function sendMessReplaceObj(value) {
  if (!clickO.last_obj) return;
  var obj = clickO.last_obj;
  var tag = clickO.last_obj.userData.tag;

  menuUI.category = value;

  if (value == 'wall-material') {
    var lotid = obj.userData.material[clickO.index].lotid;
    UI.catalogFilter = obj.userData.material[clickO.index].filters;
    UI.catalogSource = obj.userData.material[clickO.index].catalog;
  }
  else if (value == 'floor') {
    var lotid = obj.userData.material.lotid;
    UI.catalogFilter = obj.userData.material.filters;
    UI.catalogSource = obj.userData.material.catalog;
  }
  else if (value == 'plinths-select') {
    var lotid = (tag == 'room') ? obj.userData.room.plinth.lotid : obj.userData.ceil.plinth.lotid;
    UI.catalogFilter = obj.userData.material.filters;
    UI.catalogSource = obj.userData.material.catalog;
  }
  else if (value == 'doors') {
    var lotid = obj.userData.door.lotid;
  }
  else if (value == 'handle-select') {
    var lotid = obj.userData.door.lotid;
  }
  else if (value == 'objPOP') {
    var lotid = obj.userData.obj3D.lotid;

    if (obj.userData.obj3D.boxPop) {
      obj.geometry.computeBoundingBox();
      obj.geometry.computeBoundingSphere();
      var x = (Math.abs(obj.geometry.boundingBox.max.x) + Math.abs(obj.geometry.boundingBox.min.x)) / 1;
      var y = (Math.abs(obj.geometry.boundingBox.max.y) + Math.abs(obj.geometry.boundingBox.min.y)) / 1;
      var z = (Math.abs(obj.geometry.boundingBox.max.z) + Math.abs(obj.geometry.boundingBox.min.z)) / 1;

      // поправка на масштаб объекта
      x *= obj.scale.x;
      y *= obj.scale.y;
      z *= obj.scale.z;

      x = Math.round(x * 100) / 100;
      y = Math.round(y * 100) / 100;
      z = Math.round(z * 100) / 100;

      var size = new THREE.Vector3(x, y, z);
    }
  }
  else {
    return;
  }

  var mess = { lotid: lotid, category: value, filter: UI.catalogFilter, source: UI.catalogSource, replace: true };
  if (size) { mess.size = size; };


  sendMessage('EDITOR.OPEN_CATALOG', mess);
}



function getErrorKey(code) {
  switch (parseInt(code)) {
    case 404:
      return 'project_not_found';
    case 403:
      return 'forbidden';
    default:
      return 'error';
  }
}

//Изменение инпутов по стрелочкам
$('[data-source="input"]').on('keydown', function (e) {
  if (e.keyCode != 38 && e.keyCode != 40) return;

  var $input = $(this);
  var incVal = parseFloat($input.data('step')) || 10;
  var minValue = $input.data('min');
  var value;

  if (e.altKey) { incVal = (incVal / 10 < 0.1) ? 0.1 : incVal / 10; }
  else if (e.ctrlKey) { incVal = incVal * 10; }
  else if (e.shiftKey) { incVal = incVal * 100; }

  if (e.keyCode == 38) {
    value = parseFloat($input.val()) || 0;
    $input.val(toFixed(value + incVal));
    e.preventDefault();
  }

  if (e.keyCode == 40) {
    value = parseFloat($input.val()) || 0;
    if (typeof minValue !== 'undefined') {
      value = (value - incVal <= minValue) ? minValue : value - incVal;
    } else {
      value = value - incVal;
    }

    $input.val(toFixed(value));
    e.preventDefault();
  }

  function toFixed(value) {
    return Math.round(value * 100) / 100;
  }

  emitAction($input.data('action'), $input.val(), $input);
});

$('[data-source="input"]').on('change keyup', function () {
  var $input = $(this);
  var value = $input.val();

  if ($input.data('noChangeHandle')) return;

  if (value.replace(/\s/g, '') === '') {
    value = 0;
  }

  emitAction($input.data('action'), value, $input);
});

$('[data-source="input"]').on('blur', function () {
  var $input = $(this);
  var value = $input.val();

  if (value.replace(/\s/g, '') === '') {
    $input.val(0);
  }
})

//Вводим только числа
$('[data-source="input"]').on('keypress paste', function (e) {
  if (e.type === 'paste' && !e.originalEvent.clipboardData.getData('text').match(/^[\d.,-]+$/)) { return false; }
  if (e.type === 'keypress' && !e.originalEvent.key.match(/^[\d.,-]+$/) && e.originalEvent.key.length == 1) { return false; }
});

//Не даём спуститься событиям в редактор
$('.toolbar__submenu, .b-toolbar, .interface-shade, .i-help-wrap, .i-help, .help__wrap,  .overlay-btn, .angle-range, .camera-range, .make-render, .render-button')
.on('mousedown touchestart touchmove wheel DOMMouseScroll mousewheel', function (e) {
  e.stopPropagation();
});

$('.toolbar__submenu, .b-toolbar, .interface-shade, .i-help-wrap, .i-help, .help__wrap,  .overlay-btn, .angle-range, .camera-range, .make-render, .render-button')
.on('mousedown touchestart', function (e) {
  EditorInvokeFunction('PointerClickOnInterface', e);
});

$('[data-source="input"').on('keydown keyup keypress', function (e) {
  if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
    e.stopPropagation();
  }
});

$('.toolbar__submenu, .b-toolbar, .overlay-btn').on('mousemove touchmove', function (e) {
  if (UI.isMouseDown) {
    $('.ui-layer').css('pointerEvents', 'none');
    return;
  }
  e.stopPropagation();
});


//Верхний тулбар, подменю
$('.toolbar__submenu').on('click touchstart', function () {
  $(this).hide();
  var $that = $(this);
  setTimeout(function () { $that.show(); }, 100);
});


//Скрытие селектов, нижний тулбар
$('.ui-layer').on('click touchstart', function (e) {
  if (e.target.className !== 'select__value') {
    $('.select').each(function () {
      $(this).removeClass('select_open');
    });
  }
});


//Скрытие оверлей-селектов(единицы измерения, ползунки камер)
$('.ui-layer').on('click touchstart', function (e) {
  if (e.target.className !== 'overlay-select__value') {
    $('.overlay-select').each(function () {
      if (!$(this).hasClass('overlay-select_open')) return;
      var $el = $(this);
      var $items = $el.find('.overlay-select__items');
      toggleAnimation($items, $el, 'overlay-select_open');
    });
  }
  if (e.target.className !== 'overlay-menu__control' && e.target.className !== 'range-slider-track' && e.target.className !== 'dragger') {
    $('.overlay-menu_open').each(function () {
      var $el = $(this);
      var $items = $el.find('.overlay-menu__items');
      if ($items.length === 0) $items = $el.find('.overlay-menu__items_vertical');
      toggleAnimation($items, $el, 'overlay-menu_open');
    });
  }
  if (e.target.className !== 'overlay-select-menu__value') {
    $('.overlay-select-menu').removeClass('overlay-select-menu--open');
  }
  if (e.target.className !== 'b-toolbar__input input-with-select__input' && e.target.className !== 'input-with-select__button') {
    $('.input-with-select--open').removeClass('input-with-select--open');
  }
});


//Работа селекта, нижний тулбар
$('.select').on('touchstart click', function (e) {
  $(this).toggleClass('select_open');
  if (e.target.className === 'select__option') {
    $(e.currentTarget).children('.select__value').html(e.target.innerHTML);
    emitAction($(this).data('action'), e.target.innerHTML, $(this));
  }
});


//Селект оверлея
$('.overlay-select__value').on('touchstart click', function () {
  if ($(this).hasClass('disabled') || $(this).find('.disabled').length) return;
  var $el = $(this);
  var $items = $el.siblings('.overlay-select__items');
  var $parent = $el.closest('.overlay-select');
  toggleAnimation($items, $parent, 'overlay-select_open');
});


$('.overlay-select__items [data-value]').on('click touchstart', function () {
  var $target = $(this);
  var $select = $target.closest('.overlay-select');
  var $items = $target.closest('.overlay-select__items');

  $select.attr('data-selected', $target.data('value'));
  toggleAnimation($items, $select, 'overlay-select_open');
  $select.children('.overlay-select__value').html($target.html());

  emitAction($select.data('action'), $target.data('value'), $select);
});


$('.overlay-select-menu__value').on('click touchstart', function () {
  if ($(this).hasClass('disabled') || $(this).find('.disabled').length) return;
  var $el = $(this);
  var $parent = $el.closest('.overlay-select-menu');
  $parent.toggleClass('overlay-select-menu--open');
})


$('.overlay-select-menu__list').on('click touchstart', function () {
  var $el = $(this);
  var $parent = $el.closest('.overlay-select-menu');
  $parent.toggleClass('overlay-select-menu--open');
})


//Показ/скрытие регулировок угла обзора
$('.overlay-menu__control').on('click touchstart', function () {
  var $el = $(this);
  var $items = $el.siblings('.overlay-menu__items, .overlay-menu__items_vertical');
  toggleAnimation($items, $el.closest('.overlay-menu'), 'overlay-menu_open');
});


//Анимации по открытию/закрытию
function toggleAnimation($el, $parent, className) {
  $el.data({ 'animationName': $el.css('animationName') });
  $el.css({ 'animationName': 'unset' });
  var dir = ($el.css('animationDirection') === 'reverse') ? 'normal' : 'reverse';
  if (dir == 'normal') {
    $el.data('isOpen', true);
    $el.show();
    if (typeof $parent !== 'undefined') {
      $parent.addClass(className);
    }
  }
  if (dir == 'reverse') {
    $el.data({ 'animationHiding': true });
    if (typeof $parent !== 'undefined') {
      $parent.removeClass(className);
    }
  }
  $el.css({ 'animationName': $el.data('animationName'), 'animationDirection': dir });
  $el.on('animationend', function () {
    if ($el.css('animationDirection') == 'reverse') {
      $el.hide();
      $el.data('isOpen', false);
    }
  });
}


$('.img-select__clear-btn').on('click touchstart', function () {
  $(this).siblings('.img-select__img').css({ 'background-image': '' });
  emitAction('clear-plinths-preview', null, $(this));
});

$('[data-chain]').each(function () {
  new ChainInput(this);
});


RS(document.querySelector('.range-slider'), {
  value: 60, // initial value
  vertical: false, // vertical or horizontal slider?
  // create: function(value, target) { }, // create event
  // start: function(value, target, event) { }, // start event
  drag: function (e) { emitAction('camera-angle', e); } // drag event
  // stop: function(value, target, event) { } // stop event
}); //angle
RS(document.querySelector('.range-slider1'), {
  value: 60, // initial value
  vertical: false, // vertical or horizontal slider?
  // create: function(value, target) { }, // create event
  // start: function(value, target, event) { }, // start event
  drag: function (e) { emitAction('camera-angle', e); } // drag event
  // stop: function(value, target, event) { } // stop event
});
RS(document.querySelector('.range-slider2'), {
  value: 50, // initial value 
  vertical: true, // vertical or horizontal slider?
  // create: function(value, target) { }, // create event
  // start: function(value, target, event) { }, // start event
  drag: function (e) { emitAction('camera-height', Math.abs(e - 100)); } // drag event
  // stop: function(value, target, event) { } // stop event
});  //camera

$('.range-slider2').attr("value", 50);


function Loader(text) {
  this.visible = false;
  this.$loader = $('.loader');
  this.$content = $('.loader__content');
  this.$textElement = $('.loader__text');
  this.$textElement.html(text || '');
  this.show = function (text) {
    this.$textElement.html(text);
    this.visible = true;
    this.$loader.show();
  };
  this.hide = function () {
    this.$loader.fadeOut();
  };
  var self = this;
  this.$content.on('click touchstart', function () {
    self.$loader.toggleClass('loader-small');
  });
}


var loader = new Loader('Загрузка проекта');


var roomTypes = [{ 'id': 2, 'caption': 'Кухня', 'color': 'e0e0e0', 'options': '', 'alias': 'kitchen' },
{ 'id': 4, 'caption': 'Гостиная', 'color': 'e0e0e0', 'options': 'IsDefault', 'alias': 'living room' },
{ 'id': 3, 'caption': 'Кухня-гостиная', 'color': 'e0e0e0', 'options': '', 'alias': '' },
{ 'id': 5, 'caption': 'Спальня', 'color': 'e0e0e0', 'options': '', 'alias': 'bedroom' },
{ 'id': 6, 'caption': 'Гардеробная', 'color': 'e0e0e0', 'options': '', 'alias': 'dressing room' },
{ 'id': 7, 'caption': 'Кабинет', 'color': 'e0e0e0', 'options': '', 'alias': 'home office' },
{ 'id': 8, 'caption': 'Детская', 'color': 'e0e0e0', 'options': '', 'alias': 'child\'s room' },
{ 'id': 9, 'caption': 'Прихожая', 'color': 'e0e0e0', 'options': '', 'alias': 'hall' },
{ 'id': 10, 'caption': 'Коридор', 'color': 'e0e0e0', 'options': '', 'alias': 'corridor' },
{ 'id': 11, 'caption': 'Туалет', 'color': 'e0e0e0', 'options': '', 'alias': 'toilet/WC' },
{ 'id': 12, 'caption': 'Ванная', 'color': 'e0e0e0', 'options': '', 'alias': '173_bathroom' },
{ 'id': 13, 'caption': 'С/у совмещенный', 'color': 'e0e0e0', 'options': '', 'alias': 'bathroom_combined' },
{ 'id': 15, 'caption': 'Балкон', 'color': 'e0e0e0', 'options': '', 'alias': '73_balcon' },
{ 'id': 18, 'caption': 'Техническое помещение', 'color': 'e0e0e0', 'options': '', 'alias': 'technical room' },
{ 'id': 19, 'caption': 'Кладовая', 'color': 'e0e0e0', 'options': '', 'alias': 'storage room' },
{ 'id': 20, 'caption': 'Лоджия', 'color': 'e0e0e0', 'options': '', 'alias': 'loggia' }];


function TEMPgetRoomType(name) {
  for (var i = 0; i < roomTypes.length; i++) {
    if (roomTypes[i].caption === name) {
      return roomTypes[i];
    }
  }
}


function initRoomTypeSelect(roomTypes) {
  var $select = $('[data-action="room-type"]').find('.select__options');
  for (var i = 0; i < roomTypes.length; i++) {
    $select.append('<li class="select__option">' + roomTypes[i].caption + '</li>');
  }
  new SimpleBar($('.select__sb')[0]);
}

function initInputWithSelect(input, start, end) {
  var $items = $('.input-with-select[data-rel-action="' + input + '"]');

  $items.each(function (index, el) {
    var $el = $(el);
    var $select = $el.find('.input-with-select__options');
    var $button = $el.find('.input-with-select__button');
    var $list = $el.find('.input-with-select__options-list');
    var $input = $el.find('.input-with-select__input');

    $list.empty();

    for (var i = start; i >= end; i -= 100) {
      var $option = $(`
      <li class="input-with-select__option" data-value="${i}">
      Проем ${i + 100}
      <div class="input-with-select__option-desc">
        Полотно ${i}
        </div>
      </li>
     `);
      (function (i) {
        $option.on('click touchstart', function () {
          $input.val(i);
          emitAction($input.data('action'), i, $input)
        })
      })(i);
      $list.append($option);
    }

    if ($button) {
      $button.on('click touchstart', function () {
        var isOpen = false;

        if ($el.hasClass('input-with-select--open')) {
          isOpen = true;
        }

        $('.input-with-select--open').removeClass('input-with-select--open');

        if (isOpen) {
          $el.removeClass('input-with-select--open');
        } else {
          $el.addClass('input-with-select--open');
        }
      })
    }

    if ($select.length) {
      new SimpleBar($select[0]);
    }
  });

}

initInputWithSelect('door_width_1', 1000, 400);
initInputWithSelect('door_height_1', 2300, 1900);

$('[data-subtoolbar]').on('click touchstart', function () {
  var $this = $(this);
  var targetToolbar = $this.data('subtoolbar');
  var toolbarIsOpen = $this.data('open');

  $this.data('open', !toolbarIsOpen);

  if (toolbarIsOpen) {
    UI.hideSubToolbar(targetToolbar)
  } else {
    UI.showSubToolbar(targetToolbar);
  }

  if (!toolbarIsOpen) {
    emitAction('openSubToolbar', $this.data('subtoolbar'));
  }
});

$('.b-toolbar__toggle-btn').on('click touchstart', function () {
  var $this = $(this);
  var toolbarIsOpen = $this.data('open');

  toolbarIsOpen ?
    $this.addClass('b-toolbar__toggle-btn--active') :
    $this.removeClass('b-toolbar__toggle-btn--active');
});


$('[data-rel]').on('mousedown touchstart', handleRellMouseDown);

function handleRellMouseDown() {
  var $this = $(this);
  var targetAction = $this.data('rel');
  var $target = $('[data-action="' + targetAction + '"]');
  var action = $this.data('relAction');
  var step = $target.data('step');
  var interval = $this.data('relInt');
  var mouseDown = true;
  var minInterval = 25;
  var decreaseStep = 200;
  var firstDelay = 500;

  repeatableAction(interval);

  function repeatableAction(interval) {
    var _interval = interval;

    function repeat() {
      if (!firstDelay) {
        _interval = _interval <= minInterval ? _interval = minInterval : _interval -= decreaseStep;
      }

      if (mouseDown) {
        emitAction(targetAction, doRelAction($target, action, step), $target)
        setTimeout(repeat, firstDelay ? firstDelay : _interval);
      }
      firstDelay = false;
    }

    return repeat();
  }

  function clear() {
    mouseDown = false;
    $(document).off('mouseup touchend', $this, clear);
  }

  $(document).on('mouseup touchend', $this, clear);
}


function doRelAction($target, action, step) {
  var floatValue = parseFloat($target.val()) || 0;
  var floatStep = parseFloat(step) || 1;

  function toFixed(value) {
    return Math.round(value * 100) / 100;
  }

  switch (action) {
    case 'add':
      $target.val(toFixed(floatValue + floatStep));
      return $target.val();
    case 'sub':
      $target.val(toFixed(floatValue - floatStep));
      return $target.val();
    default:
      $target.val();
  }
}


function addDecor($el, decor) {
  $el.val($el.val() + decor);
}

$('[data-source="input"][data-decor]').each(function () {
  addDecor($(this), $(this).data('decor'));
});

$('[data-source="input"][data-decor]').focusout(function () {
  addDecor($(this), $(this).data('decor'));
});

$('[data-source="input"][data-decor]').focus(function () {
  var $this = $(this);
  var value = parseInt($this.val());
  value ? $this.val(value) : $this.val(0);
})

function formatInputValue($el) {
  if (!$el.is(":focus") && $el.data('decor')) {
    addDecor($el, $el.data('decor'));
  }
}

$('[data-resizable]').on('input keydown focus', function () {
  adjustResizableInputWidth(this);
})

function adjustResizableInputWidth(input) {
  var $this = $(input);
  var $buffer = $('.resizable-buffer');
  $buffer.text($this.val());
  $this.width($buffer.width());
}

$('[data-action="ceiling-height"]').focusout(function () {
  changeMenuHeightWall();
})

$('[data-tab-controller]').on('click touchstart', setActiveToolbarTab);
$('[data-tab-controller]').each(setActiveToolbarTab);

function setActiveToolbarTab(e, el) {
  var $this = $(el).length ? $(el) : $(this);
  var tabsSelector = $this.data('tab-controller');
  var selected = $this.data('selected');

  $('[data-rel-controller="' + tabsSelector + '"]').hide();
  $('[data-tab="' + selected + '"]').show();
}

$('.texture-select').on('click touchstart', '.texture-select__open-button', function (e) {
  const $root = $(e.delegateTarget);

  $root.addClass('texture-select--open');
})

$('.texture-select').on('click touchstart', '.texture-select__option', function (e) {
  const $root = $(e.delegateTarget);
  const $current = $(e.currentTarget);
  const $selectedText = $root.find('.texture-select__selected-text');
  const $selectedIcon = $root.find('.texture-select__selected-icon');
  const index = $current.data('index');
  const value = $current.data('value');

  $root.data('selected', index);
  $root.data('value', value || '');
  $selectedText.html(index);
  if (value) {
    $selectedIcon.css({ 'background-image': getBackgroundValue(value) });
  } else {
    $selectedIcon.css({ 'background-image': '' });
  }
  $root.removeClass('texture-select--open');
  emitAction('texture-select-edge', index);
})

function setTextureSelectValue($root, value, optionIndex, isActive) {
  if (typeof value === 'object') {
    for (let i in value) {
      setTextureSelectValue($root, value[i].image, value[i].id, value[i].active);
    }
    return;
  }
  const index = optionIndex || $root.data('selected');
  const $selectedText = $root.find('.texture-select__selected-text');
  const $selectedIcon = $root.find('.texture-select__selected-icon');
  const $option = $root.find('[data-index="' + index + '"]');
  const $optionIcon = $option.find('.texture-select__icon');

  if (!optionIndex || optionIndex === $root.data('selected') || (optionIndex && isActive)) {
    $root.data('selected', index);
    $root.data('value', value);
    $selectedText.html(index);
    $selectedIcon.css({ 'background-image': getBackgroundValue(value) });
  }
  $root.removeClass('texture-select--open');
  $option.data('value', value);
  $optionIcon.css({ 'background-image': getBackgroundValue(value) });
}

function getBackgroundValue(value) {
  let backgroundValue = '';

  if (value.match(/#.*/)) {
    const fullHex = convertToFullHex(value);

    backgroundValue = 'linear-gradient(125deg, ' + fullHex + '60, ' + fullHex + ')';
  } else {
    backgroundValue = 'url(' + value + ')';
  }

  return backgroundValue
}

function convertToFullHex(value) {
  if (value.length === 7 || value.length !== 4) return value;

  const color = value.split('').reduce((acc, item, index) => {
    if (!index) {
      return acc;
    }
    return acc + item + item
  }, '#');

  return color
}

$('.texture-select').on('click touchstart', '.texture-select__selected-icon', function (e) {
  const $root = $(e.delegateTarget, this);

  emitAction($root.data('action'), $root.data('selected'));
})

setTimeout(function () { changeMenuHeightWall(); }, 100);

initRoomTypeSelect(roomTypes);
svg4everybody();