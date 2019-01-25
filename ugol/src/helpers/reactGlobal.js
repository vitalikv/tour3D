const reactGlobal = {
  editorLoaded: false,
  eventTypes: [],
  win: '',
  init: function () {
    this.editorLoaded = true
    this.win = window.frames.editor
    let e = this.getEvent('load');
    if (e) {
      this.emit('load')
    }
  },
  sendMessage: function (action, payload) {
    if (!this.win) { console.error('no editor initiated'); return; }
    this.win.postMessage({ 'action': action, 'payload': payload }, '*');
    this.win.focus();
  },

  on: function (event, callback) {
    let e = this.getEvent(event)
    if (e) {
      e.callbacks.push(callback);
    } else {
      let newE = { name: event, callbacks: [callback] }
      this.eventTypes.push(newE);
    }
  },
  getEvent: function (event) {
    for (let i = 0; i < this.eventTypes.length; i++) {
      if (this.eventTypes[i].name === event) {
        return this.eventTypes[i]
      }
    }
    return false;
  },
  emit: function (event, ...args) {
    let e = this.getEvent(event);
    if (e) {
      for (let i = 0; i < e.callbacks.length; i++) {
        e.callbacks[i].apply(this, args);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
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

  function listener(event) {
    if (event.source === window) return;

    const msg = event.data;

    if (typeof msg.action === 'undefined') return;

    const source = msg.action.split('.')[0];
    const action = msg.action.split('.')[1];

    console.log('%cRECIEVING', 'color: #8500ff', (msg.action || msg.source))

    if (source === 'UGOL') {
      reactGlobal.sendMessage(msg.action, msg.payload);
      switch (action) {
        case 'INIT':
          if (msg.payload.key) {
            reactGlobal.key = (typeof msg.payload.key === 'object') ? [...msg.payload.key] : [msg.payload.key];
          }
      }
    }
    if (source === 'EDITOR') {
      const button = document.querySelector('.catalog-buttons');
      button.className = 'catalog-buttons';

      switch (action) {
        case 'OPEN_CATALOG':
          reactGlobal.emit('showmodal', 'catalog', msg.payload)
          break;
        case 'READY':
          if (window.parent === window) {
            reactGlobal.init();
            reactGlobal.sendMessage('UGOL.INIT', { buttons: buttons, url: window.location.href });
          }
          reactGlobal.init();
          window.parent.postMessage({ action: msg.action, payload: msg.payload }, '*');
          break;
        case 'OPEN_TUTORIAL':
          reactGlobal.emit('showmodal', 'tutorial');
          break;
        case 'DISABLE_CATALOG_BUTTONS':
          button.className = 'catalog-buttons';
          button.classList.add('catalog-buttons--' + msg.payload)
          break;
        case 'ENABLE_CATALOG_BUTTONS':
          button.className = 'catalog-buttons';
          break;
        default:
          window.parent.postMessage({ action: msg.action, payload: msg.payload }, '*');
      }
    }
  }

  window.addEventListener('message', listener);

})

export default reactGlobal
