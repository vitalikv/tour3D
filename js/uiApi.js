var uiAPI = (function () {
  return {

    /** 
     * Устанавливает активную кнопку камеры
     * @param value{string} - '2d/3d/walk'
     * 
    */
    SetView: function (value) {
      //TODO: remake original function
      invokeOuterUIFunction('SetView', value);
    },

    /** 
     * Устанавливает доступные кнопки в редакторе
     * @param object{ButtonsArray} - объект с перечнем кнопок
     * 
    */
    SetAvaibleButtons: function (value) {
      editorButtons = value;
      initUIButtons(value);
    },

    /** 
    * Отключает взаимодействие с интерфейсом
    * @param value{bool}
    * 
    */
    DisableUI: function (value) {
      disableUIButtons();
    },

    /** 
    * Вклчюает взаимодействие с интерфейсом
    * @param value{bool}
    * 
    */
    EnableUI: function (value) {
      initUIButtons(editorButtons);
    },

    /** 
    * Устанавливает показ туториала
    * @param value{bool}
    * 
    */
    ShowInterfaceTutorial: function (value) {
      editorShowInterfaceTutorial = value;
      initTutorial(value);
    },

    /** 
    * Устанавливает показ подсказок к тулбарам
    * @param value{bool}
    * 
    */
    ShowToolbarHelp: function (value) {
      editorShowToolbarHelp = value;
    },

    /** 
    * Сбрасывает показ подсказок к тулбарам
    * @param value{bool}
    * 
    */
    ResetToolbarHelp: function (value) {
      UI.clearToolbarHelpLocalStorage(value);
    },

    /** 
    * Устанавливает информацию о проекте
    * @param value{object}
    * 
    */
    SetProjectInfo: function (value) {
      UI.setProjectInfo(value.hash, value.file);
    },

    /** 
    * Показывает уведомление
    * @param value{object} объект с параметрами уведомления
    * @param value.message{string} текст сообщения
    * @param value.type{string} тип уведомления: success|warning|loader
    * @param value.buttonFn{func} добавляет к уведомлению кнопку с этой функцией
    * @param value.loaderId{string} - ID индикатора загрузки
    */
    ShowNotification: function (value) {
      UI.showAlert(value.message, value.type, value.duration, value.buttonFn, value.loaderId)
    },

    /** 
    * Обновляет прогресс загрузчика
    * @param value{object}
    * @param value.id{string} ID индикатора загрузки
    * @param value.total{string} общее значение загрузки
    * @param value.current{func} текущее значение, если равно общему, загрузчик скрывается
    */
    UpdateLoaderProgress: function (value) {
      UI.updateProgressBar(value.id, value.total, value.current)
    },

    /** 
    * Показывает лоадер с фейковой загрузкой
    * @param value{string}
    * 
    */
    ShowFakeLoader: function (value) {
      UI.showAlert('Загрузка объектов', 'loader', '', '', value);
      UI.startFakeLoading(value, 100, 0);
    },

    /** 
    * Скрывает лоадер с фейковой загрузкой
    * @param value{string}
    * 
    */
    HideFakeLoader: function (value) {
      UI.stopFakeLoading(value);
    },

    /** 
    * Показывает отладочную панель three.js
    * @param value{string}
    * 
    */
    ShowStatsPanel: function (value) {
      UI.toggleStatsPanel(value);
    },


    /** 
    * TEMP Устанавливает Превью 
    * @param value{string}
    * 
    */
    ApplyMaterial: function (value) {
      //TODO: rename, remake
      UI('wall-preview').val(msg.payload.preview);
      UI('floor-preview').val(msg.payload.preview);
    },

    /** 
    * Установка значения ползунка камеры
    * @param value{float} 0-1 max-min
    * 
    */
    SetCameraZoom: function (value) {
      invokeOuterUIFunction('SetCameraZoom', value);
    },

    /** 
    * Показ превью у указателя мыши
    * @param value{string} ссылка на картинку
    * 
    */
    ShowPreviewAtCursor: function (value) {
      UI.showObjectPreview(value);
      invokeOuterUIFunction('ShowPreviewAtCursor', value);
    },

    /** 
    * Скрытие превью у указателя мыши
    * 
    */
    HidePreviewAtCursor: function (value) {
      UI.hideObjectPreview();
      invokeOuterUIFunction('HidePreviewAtCursor');
    },

    /** 
    * Старт загрузки дизайна комнаты
    * @param value{number} id лота
    * 
    */
    DesignProjectLoadStart: function (value) {
      invokeOuterUIFunction('DesignProjectLoadStart', value);
    },

    /** 
    * Завершение загрузки дизайна комнаты
    * 
    */
    DesignProjectLoadEnd: function (value) {
      invokeOuterUIFunction('DesignProjectLoadEnd');
    },

    /** 
    * Клик пользователя
    * @param value{object}
    */
    Click: function (value) {
      invokeOuterUIFunction('Click', value);
      sendMessage('EDITOR.CLICK', value);
    },

    /** 
    * Перемещение камеры
    * 
    */
    CameraMove: function (value) {
      invokeOuterUIFunction('CameraMove');
    },

    /** 
    * Перемещение объекта
    * 
    */
    ObjectMove: function (value) {
      invokeOuterUIFunction('ObjectMove');
    },

    /** 
    * Редактор готов к работе
    * 
    */
    EditorReady: function (value) {
      sendMessage('EDITOR.READY', null);
      invokeOuterUIFunction('EditorReady');
    },


    /** 
    * Начало загрузки проекта
    * 
    */
    ProjectLoadStart: function (value) {
      sendMessage('EDITOR.LOAD_START');
      invokeOuterUIFunction('ProjectLoadStart');
    },


    /** 
    * Конец загрузки проекта
    * 
    */
    ProjectLoadEnd: function (value) {
      sendMessage('EDITOR.LOAD_END');
      invokeOuterUIFunction('ProjectLoadEnd');
    },

    /** 
    * Успешное сохрание проекта
    * 
    */
    ProjectSaveSuccess: function (value) {
      invokeOuterUIFunction('ProjectSaveSuccess', value);
    },


    /** 
    * Ошибка сохранения проекта
    * 
    */
    ProjectSaveError: function (value) {
      UI.showAlert('Ошибка сохранения', 'warning');
      invokeOuterUIFunction('ProjectSaveError', value);
    },
  }
})();

function invokeOuterUIFunction(name, value) {
  window.parent.postMessage({
    type: 'UIInvokeFunction',
    name: name,
    value: value
  }, '*');
}

function UIInvokeFunction(name, value) {
  if (typeof uiAPI[name] === 'function') {
    uiAPI[name](value);
  }
}

function handleUIInvokeFunction(message) {
  if (message.data.type !== 'UIInvokeFunction' || message.source === window) return;
  var name = message.data.name;
  var value = message.data.value;

  UIInvokeFunction(name, value);
}

window.UIInvokeFunction = UIInvokeFunction;
window.addEventListener('message', handleUIInvokeFunction);

/**
* @typedef {Object} ButtonsArray
* @property {number} save 1
* @property {number} clone 1
* @property {number} undo 1
* @property {number} redo 1
* @property {number} line 1
* @property {number} zone 1
* @property {number} door 1
* @property {number} window 1
* @property {number} doorway 1
* @property {number} changeView 1
* @property {number} toggleSizes 1
* @property {number} center 1
* @property {number} centerCamera2d 1
* @property {number} zoomIn 1
* @property {number} zoomOut 1
* @property {number} angle 1
* @property {number} changeViewMode 1
* @property {number} cameraHeight 1
* @property {number} ceilingHeight 1
* @property {number} units 1
* @property {number} render 1
* @property {number} help 1
* @property {number} pickDesign: 1
*/