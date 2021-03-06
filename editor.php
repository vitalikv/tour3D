<?php $withUI = !isset($_GET['onlyEditor']); ?>
<?php $hideUI = isset($_GET['hideUI']) ? 'none' : 'block'; ?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Webgl-editor</title>
<?php if ($withUI): ?>
  <link rel="stylesheet" href="css/simplebar.css">  
  <link rel="stylesheet" href="css/style.css?=62">
  <script src="js/fontfaceobserver.js"></script>
    <script>
        var AvenirNextCyr = new FontFaceObserver('AvenirNextCyr', {
            weight: 400
        });

        var AvenirNextCyrMedium = new FontFaceObserver('AvenirNextCyr', {
            weight: 500
        });

        var AvenirNextCyrBold = new FontFaceObserver('AvenirNextCyr', {
            weight: 600
        });

        Promise.all(
            [AvenirNextCyr.load(), AvenirNextCyrMedium.load(), AvenirNextCyrBold.load()]
        ).then(function() {
            document.documentElement.className += 'font-loaded';
        });
	
    </script>
<?php else : ?>
<style>
    body {
      margin: 0;
    }
    canvas {
      width: 100%;
      height: 100%;
      background: #ffffff;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
      -webkit-touch-callout: none;
    }
</style>
<?php endif; ?>
</head>
<body>
<?php if ($withUI): ?>
  <div class="ui-layer" style="display: <?=$hideUI?>">

    <div class="toolbar-wrap">

      <div class="toolbar">
       
        <ul class="toolbar__group">
          <li>
            <span class="overlay-btn" data-action="save">
          <svg class="svg-ic-save-dims">
							<use xlink:href="images/icons/sprite.svg#ic-save"></use>
            </svg>
          </span>
          </li>
          <li><span class="overlay-btn" data-action="clone">
          <svg class="svg-ic-clone-dims">
							<use xlink:href="images/icons/sprite.svg#ic-clone"></use>
            </svg>
          </span>
          </li>
        </ul>
        <ul class="toolbar__group">
          <li><span class="overlay-btn" data-action="undo">
          <svg class="svg-ic-undo-dims">
							<use xlink:href="images/icons/sprite.svg#ic-undo"></use>
						</svg>    
        </span>
          </li>
          <li><span class="overlay-btn" data-action="redo">
          <svg class="svg-ic-redo-dims">
							<use xlink:href="images/icons/sprite.svg#ic-redo"></use>
						</svg>    
        </span>
          </li>
        </ul>
        <ul class="toolbar__group">
          <li><span class="overlay-btn" data-action="line">
          <svg class="svg-ic-line-dims">
							<use xlink:href="images/icons/sprite.svg#ic-line"></use>
						</svg>    
        </span></li>
          <li class="hidden"><span class="overlay-btn" data-action="shape">
          <svg class="svg-ic-shape-dims">
							<use xlink:href="images/icons/sprite.svg#ic-shape"></use>
						</svg>
          </span>
            <ul class="toolbar__submenu">
              <div class="toolbar__submenu_grid">
                <li class="toolbar__submenu-grid-item" data-action="shape1" data-action="shape1">
                  <span class="sub-grid-icon">
                  <svg class="svg-shape-type-1-dims">
							<use xlink:href="images/icons/sprite.svg#shape-type-1"></use>
            </svg>
</span></li>
                <li class="toolbar__submenu-grid-item" data-action="shape2" data-action="shape2">
                  <span class="sub-grid-icon">
                  <svg class="svg-shape-type-2-dims">
							<use xlink:href="images/icons/sprite.svg#shape-type-2"></use>
						</svg>
                  </span>
                </li>
                <li class="toolbar__submenu-grid-item" data-action="shape3" data-action="shape3">
                  <span class="sub-grid-icon">
                  <svg class="svg-shape-type-3-dims">
							      <use xlink:href="images/icons/sprite.svg#shape-type-3"></use>
                  </svg>
                  </span>
                </li>
                <li class="toolbar__submenu-grid-item" data-action="shape4" data-action="shape4">
                  <span class="sub-grid-icon">
                  <svg class="svg-shape-type-4-dims">
							<use xlink:href="images/icons/sprite.svg#shape-type-4"></use>
						</svg>
                  </span>
                </li>
                <li class="toolbar__submenu-grid-item" data-action="shape5" data-action="shape5">
                  <span class="sub-grid-icon">
                  <svg class="svg-shape-type-5-dims">
							<use xlink:href="images/icons/sprite.svg#shape-type-5"></use>
						</svg>
                  </span>
                </li>
                <li class="toolbar__submenu-grid-item" data-action="shape6" data-action="shape6">
                  <span class="sub-grid-icon">
                  <svg class="svg-shape-type-6-dims">
							<use xlink:href="images/icons/sprite.svg#shape-type-6"></use>
						</svg>
                  </span>
                </li>
              </div>
            </ul>
          </li>
          <li><span class="overlay-btn" data-action="zone">
          <svg class="svg-ic-zone-dims">
							<use xlink:href="images/icons/sprite.svg#ic-zone"></use>
						</svg>    
        </span>
          </li>
        </ul>
        <ul class="toolbar__group">
          <li><span class="overlay-btn" data-action="door">
            <svg class="svg-ic-door-dims">
							<use xlink:href="images/icons/sprite.svg#ic-door"></use>
						</svg>
          </span>
            <ul class="toolbar__submenu">
              <li class="toolbar__submenu-item" data-action="singleDoor" data-action="doorway">
                <span class="sub-icon">
                <svg class="svg-simple-door-dims">
							<use xlink:href="images/icons/sprite.svg#simple-door"></use>
            </svg>
          </span>Межкомнатная</li>
              <li class="toolbar__submenu-item hidden" data-action="doubleDoor">
                <span class="sub-icon">	
                  <svg class="svg-double-door-dims">
							<use xlink:href="images/icons/sprite.svg#double-door"></use>
            </svg>
          </span>Межкомнатная двойная</li>
              <li class="toolbar__submenu-item" data-action="tripleDoor">
                <span class="sub-icon">
                <svg class="svg-enter-door-dims">
							<use xlink:href="images/icons/sprite.svg#enter-door"></use>
            </svg>
          </span>Входная</li>
            </ul>
          </li>
          <li><span class="overlay-btn" data-action="window">
          <svg class="svg-ic-window-dims">
							<use xlink:href="images/icons/sprite.svg#ic-window"></use>
						</svg>
          </span>
            <ul class="toolbar__submenu">
              <li class="toolbar__submenu-item" data-action="singleWindow">
                <span class="sub-icon">
                <svg class="svg-simple-window-dims">
							<use xlink:href="images/icons/sprite.svg#simple-window"></use>
            </svg>
          </span>Одностворчатое</li>
              <li class="toolbar__submenu-item" data-action="doubleWindow">
                <span class="sub-icon">
                <svg class="svg-double-window-dims">
							<use xlink:href="images/icons/sprite.svg#double-window"></use>
            </svg>
          </span>Двустворчатое</li>
              <li class="toolbar__submenu-item" data-action="tripleWindow">
                <span class="sub-icon">
                <svg class="svg-triple-window-dims">
							<use xlink:href="images/icons/sprite.svg#triple-window"></use>
            </svg>
          </span>Трехстворчатое</li>
            <li class="toolbar__submenu-item" data-action="balconyDoor">
                <span class="sub-icon">
                <svg class="svg-simple-window-dims">
							<use xlink:href="images/icons/sprite.svg#simple-window"></use>
            </svg>
          </span>Балконная дверь</li>
              <li class="toolbar__submenu-item" data-action="balconyRightDoor">
                <span class="sub-icon">
                <svg class="svg-balcony-right-dims">
							<use xlink:href="images/icons/sprite.svg#balcony-right"></use>
            </svg>
          </span>Дверь справа</li>
              <li class="toolbar__submenu-item" data-action="balconyLeftDoor">
                <span class="sub-icon">
                  <svg class="svg-balcony-left-dims">
							<use xlink:href="images/icons/sprite.svg#balcony-left"></use>
            </svg>
          </span>Дверь слева</li>
              <li class="toolbar__submenu-item" data-action="balconyCenterDoor">
                <span class="sub-icon">
                <svg class="svg-balcony-center-dims">
							<use xlink:href="images/icons/sprite.svg#balcony-center"></use>
            </svg>
          </span>Дверь по центру</li>
            </ul>
          </li>
          <li><span class="overlay-btn" data-action="doorway">
          <svg class="svg-ic-doorway-dims">
							<use xlink:href="images/icons/sprite.svg#ic-doorway"></use>
            </svg>
          </span></li>
          <li><span class="overlay-btn" data-action="primitives">
            <svg class="svg-i-cube-dims">
							<use xlink:href="images/icons/sprite.svg#i-cube"></use>
						</svg>
          </span>
            <ul class="toolbar__submenu">
              <li class="toolbar__submenu-item" data-action="primitive-cube">
                <span class="sub-icon">
                <svg class="svg-cube-dims">
							<use xlink:href="images/icons/sprite.svg#cube"></use>
            </svg>
          </span>Куб</li>
              <li class="toolbar__submenu-item" data-action="primitive-cylinder">
                <span class="sub-icon">	
                  <svg class="svg-cylinder-dims">
							<use xlink:href="images/icons/sprite.svg#cylinder"></use>
            </svg>
          </span>Цилиндр</li>
              <li class="toolbar__submenu-item" data-action="primitive-sphere">
                <span class="sub-icon">
                <svg class="svg-sphere-dims">
							<use xlink:href="images/icons/sprite.svg#sphere"></use>
            </svg>
          </span>Сфера</li>
            </ul>
          </li>
        </ul>
        <ul class="toolbar__group render-group">
          <li><span class="overlay-btn overlay-btn_inverted" data-action="render">
            <svg class="svg-ic-render-dims">
							<use xlink:href="images/icons/sprite.svg#ic-render"></use>
						</svg>
          </span>
            <!-- <ul class="toolbar__submenu">
              <li class="toolbar__submenu-item" data-action="render">
                <span class="sub-icon">
                <svg class="svg-render-dims">
							<use xlink:href="images/icons/sprite.svg#render"></use>
            </svg>
          </span>Фотореалистичный снимок</li> -->
              <!--<li class="toolbar__submenu-item" data-action="vr-panorama">
                <span class="sub-icon">	
                  <svg class="svg-vr-dims">
							<use xlink:href="images/icons/sprite.svg#vr"></use>
            </svg>
          </span>VR панорама</li> -->
            <!-- </ul> -->
          </li>
          <li><span class="overlay-btn overlay-btn_inverted" data-action="panoRender">
            <svg class="svg-i-360-dims">
							<use xlink:href="images/icons/sprite.svg#i-360"></use>
						</svg>
          </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="b-toolbar-wrap">

      <div class="help__wrap">
        <div class="help__content-wrap">
          <button class="help__arrow help__arrow-prev">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20">
              <path fill="#FFF" fill-rule="nonzero" d="M8.139.325a1.076 1.076 0 0 1 1.542 0 1.126 1.126 0 0 1 0 1.572L2.5 9.214a1.126 1.126 0 0 0 0 1.572l7.18 7.317a1.126 1.126 0 0 1 0 1.572 1.076 1.076 0 0 1-1.541 0L.958 12.357a3.378 3.378 0 0 1 0-4.714L8.138.325z"/>
            </svg>
          </button>
          <div class="help__content"></div>
          <button class="help__arrow help__arrow-next">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20">
              <path fill="#FFF" fill-rule="nonzero" d="M1.861.325a1.076 1.076 0 0 0-1.542 0 1.126 1.126 0 0 0 0 1.572L7.5 9.214a1.126 1.126 0 0 1 0 1.572L.32 18.103a1.126 1.126 0 0 0 0 1.572 1.076 1.076 0 0 0 1.541 0l7.181-7.318a3.378 3.378 0 0 0 0-4.714L1.862.325z"/>
            </svg>
          </button>
        </div>
        <button class="help__close">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
          <path fill="#FFF" fill-rule="nonzero" d="M8.414 7l5.293 5.293a1 1 0 0 1-1.414 1.414L7 8.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L5.586 7 .293 1.707A1 1 0 0 1 1.707.293L7 5.586 12.293.293a1 1 0 0 1 1.414 1.414L8.414 7z"/>
        </svg>
        </button>
      </div>

      <div class="b-toolbar b-toolbar--subtoolbar settings-wall-3d-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep">

            <div class="b-toolbar-group" data-help="rotate">
              <div class="b-toolbar-group__label">
                Поворот
              </div>

              <input type="text" data-source="input" data-type="degrees" data-step="1" data-decor="&#176;" class="b-toolbar__input" value="0" data-action="wall_texture_rotation">

              <div class="b-toolbar__r-btn" data-action="rotate-45-w3d">
                <svg class="svg-rotate-45-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-45"></use>
                </svg>
              </div>
              <div class="b-toolbar__r-btn" data-action="rotate-90-w3d">
                <svg class="svg-rotate-90-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-90"></use>
                </svg>
              </div>

            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar-group" data-help="rotate">
              <div class="b-toolbar-group__label">
                Смещение по X
              </div>

              <input type="text" data-source="input" data-step="0.1" class="b-toolbar__input" value="0" data-action="wall_texture_offset_x">

              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_x_sub" data-continuous="true">
                <svg class="svg-arrow-left-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-left"></use>
                </svg>
              </div>
              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_x_add" data-continuous="true">
                <svg class="svg-arrow-right-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-right"></use>
                </svg>
              </div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar-group" data-help="rotate">
              <div class="b-toolbar-group__label">
                по Y
              </div>

              <input type="text" data-source="input" data-step="0.1" class="b-toolbar__input" value="0" data-action="wall_texture_offset_y">

              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_y_add" data-continuous="true">
                <svg class="svg-arrow-up-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-up"></use>
                </svg>
              </div>
              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_y_sub" data-continuous="true">
                <svg class="svg-arrow-down-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-down"></use>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="b-toolbar wall-3d-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep">

            <div class="b-toolbar__design-btn-wrap">
              <div class="b-toolbar__design-btn  b-toolbar__design-btn-icon--brush" data-help="preview" data-source="preview" data-action="open-catalog wall-preview" data-catalog="wall-material">
               
              </div>
            </div>

              <div class="b-toolbar__toggle-btn" data-subtoolbar="settings-wall-3d-toolbar" data-open="false">
                <svg class="svg-settings-dims">
                  <use xlink:href="images/icons/sprite.svg#settings"></use>
                </svg>
              </div>

          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="apply">
            <div class="b-toolbar-group">

              <div class="b-toolbar__text-btn" data-action="apply-to-all-walls">
                Применить ко всем стенам помещения
              </div>

            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="objects">
            <div class="b-toolbar-group">

              <div class="b-toolbar__text-btn" data-action="cameraWall">
                Объекты на стене
              </div>

            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="delete">
            <div class="b-toolbar__trashbin-btn" data-action="delete-texture-wall">
              <svg class="svg-trash-bin-dims">
                <use xlink:href="images/icons/sprite.svg#trash-bin"></use>
              </svg>

            </div>
          </div>
        </div>
      </div>

      <div class="b-toolbar camera-wall-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep" >

            <div class="b-toolbar__design-btn-wrap">
              <div class="b-toolbar__design-btn  b-toolbar__design-btn-icon--brush" data-help="preview" data-source="preview" data-action="open-catalog wall-preview" data-catalog="wall-material">
               
              </div>
            </div>

                        <div class="b-toolbar-group" data-help="rotate">
              <div class="b-toolbar-group__label">
                Поворот
              </div>

              <input type="text" data-source="input" data-type="degrees" data-step="1" data-decor="&#176;" class="b-toolbar__input" value="0" data-action="wall_texture_rotation">

              <div class="b-toolbar__r-btn" data-action="rotate-45-w3d">
                <svg class="svg-rotate-45-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-45"></use>
                </svg>
              </div>
              <div class="b-toolbar__r-btn" data-action="rotate-90-w3d">
                <svg class="svg-rotate-90-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-90"></use>
                </svg>
              </div>

            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar-group" data-help="rotate">
              <div class="b-toolbar-group__label">
                Смещение по X
              </div>

              <input type="text" data-source="input" data-step="0.1" class="b-toolbar__input" value="0" data-action="wall_texture_offset_x">

              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_x_sub" data-continuous="true">
                <svg class="svg-arrow-left-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-left"></use>
                </svg>
              </div>
              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_x_add" data-continuous="true">
                <svg class="svg-arrow-right-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-right"></use>
                </svg>
              </div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar-group" data-help="rotate">
              <div class="b-toolbar-group__label">
                по Y
              </div>

              <input type="text" data-source="input" data-step="0.1" class="b-toolbar__input" value="0" data-action="wall_texture_offset_y">

              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_y_add" data-continuous="true">
                <svg class="svg-arrow-up-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-up"></use>
                </svg>
              </div>
              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_y_sub" data-continuous="true">
                <svg class="svg-arrow-down-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-down"></use>
                </svg>
              </div>
            </div>

          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="delete">
            <div class="b-toolbar__trashbin-btn" data-action="delete-texture-wall">
              <svg class="svg-trash-bin-dims">
                <use xlink:href="images/icons/sprite.svg#trash-bin"></use>
              </svg>

            </div>
          </div>
        </div>
      </div>

      <div class="b-toolbar wall-2d-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep" data-help="wallLength">
            <div class="b-toolbar-group" data-chain="wall_length_1,wall_length_2">
              <span class="b-toolbar-group__label">Длина</span>
              <input type="text" data-source="input" data-min="0" data-step="10" class="b-toolbar__input" value="3000" data-action="wall_length_1">
              <div class="b-toolbar__chain-btn">
                <svg class="svg-chain-dims">
                  <use xlink:href="images/icons/sprite.svg#chain"></use>
                </svg>


              </div>
              <input type="text" data-source="input" data-min="0" data-step="10" class="b-toolbar__input" value="3000" data-action="wall_length_2">
            </div>
            <div class="b-toolbar-group" data-source="radio" data-action="wall-dots" data-selected="wallRedBlue">
              <div class="b-toolbar__btn" data-value="wallRedDot">
                <svg class="svg-wall-red-dot-dims">
                  <use xlink:href="images/icons/sprite.svg#wall-red-dot"></use>
                </svg>
              </div>
              <div class="b-toolbar__btn b-toolbar__btn_active" data-value="wallRedBlue">
                <svg class="svg-wall-redblue-dims">
                  <use xlink:href="images/icons/sprite.svg#wall-redblue"></use>
                </svg>
              </div>
              <div class="b-toolbar__btn" data-value="wallBlueDot">
                <svg class="svg-wall-blue-dot-dims">
                  <use xlink:href="images/icons/sprite.svg#wall-blue-dot"></use>
                </svg>
              </div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="thickness">
            <span class="b-toolbar-group__label">Толщина</span>
            <input type="text" data-source="input" data-min="0" data-step="10" class="b-toolbar__input" value="154" data-action="wall_width_1">
            <div class="b-toolbar-group" data-source="radio" data-action="wall-resize" data-selected="wallRedBlueArrow">
              <div class="b-toolbar__btn" data-value="wallBlueArrow">
                <svg class="svg-wall-blue-arrow-dims">
                  <use xlink:href="images/icons/sprite.svg#wall-blue-arrow"></use>
                </svg>
              </div>
              <div class="b-toolbar__btn b-toolbar__btn_active" data-value="wallRedBlueArrow">
                <svg class="svg-wall-redblue-arrow-dims">
                  <use xlink:href="images/icons/sprite.svg#wall-redblue-arrow"></use>
                </svg>

              </div>
              <div class="b-toolbar__btn" data-value="wallRedArrow">
                <svg class="svg-wall-red-arrow-dims">
                  <use xlink:href="images/icons/sprite.svg#wall-red-arrow"></use>
                </svg>

              </div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="separate">
            <div class="b-toolbar__dot-btn" data-action="add-wall-dot">
              <svg class="svg-add-dot-dims">
                <use xlink:href="images/icons/sprite.svg#add-dot"></use>
              </svg>

            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="delete">
            <div class="b-toolbar__trashbin-btn" data-action="delete-wall">
              <svg class="svg-trash-bin-dims">
                <use xlink:href="images/icons/sprite.svg#trash-bin"></use>
              </svg>

            </div>
          </div>
        </div>
      </div>


      <div class="b-toolbar door-2d-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__design-btn-wrap">
              <div class="b-toolbar__design-btn  b-toolbar__design-btn-icon--brush" data-help="preview" data-source="preview" data-action="open-catalog doors-preview" data-catalog="doors">

              </div>
          </div>

          <div class="b-toolbar__sub-design-btn-wrap" data-show="doorPattern">
              <div class="b-toolbar__sub-design-btn b-toolbar__design-btn-icon--handle" data-source="preview" data-action="open-catalog handle-preview" data-catalog="handle-select">
              </div>
                <!-- <div class="b-toolbar__sub-design-btn-clear" data-action="delete-handle" data-target="handle-preview"></div> -->
          </div>
          
          <div data-action="door-params" data-source="radio"  data-tab-controller="door-params" data-selected="info"></div>

          <div class="b-toolbar-group" data-help="sizes" data-rel-controller="door-params" data-tab="info">
            <input type="text" data-source="input" class="b-toolbar__object-input" value="90x90x4" data-action="door_size" disabled="true">
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-rel-controller="door-params" data-tab="edit">
            <div class="b-toolbar-group">
              <span class="b-toolbar-group__label">Ширина</span>
              <div class="input-with-select" data-rel-action="door_width_1" data-type="input-with-select">
                <input type="text" data-source="input" data-action="door_width_1" data-no-change-handle="true" data-min="0" data-step="100" class="b-toolbar__input input-with-select__input">
                <button class="input-with-select__button"></button>
                <div class="input-with-select__options-wrap">
                  <div class="input-with-select__options">
                    <ul class="input-with-select__options-list">

                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="b-toolbar-group">
              <span class="b-toolbar-group__label">Высота</span>
              <div class="input-with-select" data-rel-action="door_height_1" data-type="input-with-select">
                <input type="text" data-source="input" data-action="door_height_1" data-no-change-handle="true" data-min="0" data-step="100" class="b-toolbar__input input-with-select__input">
                <button class="input-with-select__button"></button>
                <div class="input-with-select__options-wrap">
                  <div class="input-with-select__options">
                    <ul class="input-with-select__options-list">

                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep"  data-help="direction">

            <span class="b-toolbar-group__label">Положение двери</span>


            <div class="b-toolbar-group">
              <div class="b-toolbar__d-btn" data-action="door_horizontal">
                <svg class="svg-horizontal-dims">
                  <use xlink:href="images/icons/sprite.svg#horizontal"></use>
                </svg>
              </div>
              <div class="b-toolbar__d-btn" data-action="door_vertical">
                <svg class="svg-vertical-dims">
                  <use xlink:href="images/icons/sprite.svg#vertical"></use>
                </svg>
              </div>

            </div>

          </div>
          <div class="b-toolbar__section b-toolbar__section_sep" data-help="delete">
            <div class="b-toolbar__trashbin-btn" data-action="delete-door">
              <svg class="svg-trash-bin-dims">
                <use xlink:href="images/icons/sprite.svg#trash-bin"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="b-toolbar window-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep" data-help="sizes">
            <div class="b-toolbar-group">
              <span class="b-toolbar-group__label">Ширина</span>
              <input type="text" data-source="input" data-min="0" data-step="10" class="b-toolbar__input" value="2060" data-action="window_width_1">
              <span class="b-toolbar-group__label">Высота</span>
              <input type="text" data-source="input" data-min="0" data-step="10" class="b-toolbar__input" value="2060" data-action="window_height_1">
            </div>
          </div>
          <div class="b-toolbar__section b-toolbar__section_sep" data-help="floorDistance">
            <div class="b-toolbar-group">
              <span class="b-toolbar-group__label">Над полом</span>
              <input type="text" data-source="input"  data-min="0" data-step="10" class="b-toolbar__input" value="2060" data-action="window_above_floor_1">
            </div>

          </div>


          <div class="b-toolbar__section b-toolbar__section_sep" data-help="delete">
            <div class="b-toolbar__trashbin-btn" data-action="delete-window">
              <svg class="svg-trash-bin-dims">
                <use xlink:href="images/icons/sprite.svg#trash-bin"></use>
              </svg>

            </div>
          </div>
        </div>
      </div>

      <div class="b-toolbar floor-2d-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep" data-help="design">

            <div class="b-toolbar-group">
              <div class="b-toolbar__select select" data-source="select" data-action="room-type">
                <div class="select__list">
                  <div class="select__title">
                    Тип помещения
                  </div>
                  <div class="select__sb">
                  <ul class="select__options">	
                    
                  </ul>
                  </div>
                </div>
                <div class="select__value">Тип помещения</div>

              </div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="apply" data-section="pickDesign">
            <div class="b-toolbar-group">

              <div class="b-toolbar__design-select b-toolbar__design-select--blue" data-action="open-design-catalog" data-catalog="design">
                Выбрать дизайн
              </div>

            </div>

          </div>

          <!-- <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar__trashbin-btn" data-action="delete-floor">
              <svg class="svg-trash-bin-dims">
                <use xlink:href="images/icons/sprite.svg#trash-bin"></use>
              </svg>
            </div>
          </div> -->
        </div>
      </div>

      <div class="b-toolbar b-toolbar--subtoolbar settings-floor-3d-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep">

            <div class="b-toolbar-group">
              <div class="b-toolbar-group__label">
                Поворот
              </div>

              <input type="text" data-source="input" data-type="degrees" data-step="1" data-decor="&#176;" class="b-toolbar__input" value="0" data-action="floor_texture_rotation">

              <div class="b-toolbar__r-btn" data-action="rotate-45-f3d">
                <svg class="svg-rotate-45-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-45"></use>
                </svg>
              </div>
              <div class="b-toolbar__r-btn" data-action="rotate-90-f3d">
                <svg class="svg-rotate-90-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-90"></use>
                </svg>
              </div>

            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar-group">
              <div class="b-toolbar-group__label">
                Смещение по X
              </div>

              <input type="text" data-source="input" data-step="0.1" class="b-toolbar__input" value="0" data-action="floor_texture_offset_x">

              <div class="b-toolbar__arrow-btn" data-action="floor_texture_offset_x_sub" data-continuous="true">
                <svg class="svg-arrow-left-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-left"></use>
                </svg>
              </div>
              <div class="b-toolbar__arrow-btn" data-action="floor_texture_offset_x_add" data-continuous="true">
                <svg class="svg-arrow-right-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-right"></use>
                </svg>
              </div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar-group">
              <div class="b-toolbar-group__label">
                по Y
              </div>

              <input type="text" data-source="input" data-step="0.1" class="b-toolbar__input" value="0" data-action="floor_texture_offset_y">

              <div class="b-toolbar__arrow-btn" data-action="floor_texture_offset_y_add" data-continuous="true">
                <svg class="svg-arrow-up-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-up"></use>
                </svg>
              </div>
              <div class="b-toolbar__arrow-btn" data-action="floor_texture_offset_y_sub" data-continuous="true">
                <svg class="svg-arrow-down-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-down"></use>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="b-toolbar floor-3d-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep">

            <div class="b-toolbar__design-btn-wrap">
              <div class="b-toolbar__design-btn b-toolbar__design-btn-icon--brush" data-help="preview" data-source="preview" data-action="open-catalog floor-preview" data-catalog="floor">

              </div>
            </div>

            <div class="b-toolbar__toggle-btn" data-subtoolbar="settings-floor-3d-toolbar" data-open="false">
              <svg class="svg-settings-dims">
                <use xlink:href="images/icons/sprite.svg#settings"></use>
              </svg>
            </div>

          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar__sub-design-btn-wrap">
              <div class="b-toolbar__sub-design-btn b-toolbar__design-btn-icon--plinth" data-help="plinth" data-source="preview" data-action="open-catalog plinth-preview" data-catalog="plinths-select">
              </div>
                <div class="b-toolbar__sub-design-btn-clear" data-action="delete-plinth" data-target="plinth-preview"></div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="delete">
            <div class="b-toolbar__trashbin-btn" data-action="delete-texture-floor">
              <svg class="svg-trash-bin-dims">
                <use xlink:href="images/icons/sprite.svg#trash-bin"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="b-toolbar object-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep">

            <div class="b-toolbar__design-btn-wrap">
              <div class="b-toolbar__design-btn  b-toolbar__design-btn-icon--brush" data-help="preview" data-source="preview" data-action="open-catalog object-preview" data-category="" data-catalog="objPOP">

              </div>
            </div>

            <div class="b-toolbar-group" data-help="sizes">
              <input type="text" data-source="input" class="b-toolbar__object-input" value="90x90x4" data-action="obj_pop_size" disabled="true">
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="rotate">
            <div class="b-toolbar-group">
            <div class="b-toolbar__r-btn" data-action="rotate-0-object">
                <svg class="svg-rotate-0-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-0"></use>
                </svg>
              </div>
              <div class="b-toolbar__r-btn" data-action="rotate-45-object">
                <svg class="svg-rotate-45-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-45"></use>
                </svg>
              </div>
              <div class="b-toolbar__r-btn" data-action="rotate-90-object">
                <svg class="svg-rotate-90-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-90"></use>
                </svg>
              </div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="floorDistance">
            <div class="b-toolbar-group">

              <div class="b-toolbar-group__label">
                Над полом
              </div>
              <input type="text" data-source="input"  data-min="0" data-step="0.1" class="b-toolbar__input" value="0" data-action="obj_pop_height_above_floor">

            </div>

          </div>

          <div class="b-toolbar__section b-toolbar__section_sep" data-help="delete">
            <div class="b-toolbar__trashbin-btn" data-action="delete-object">
              <svg class="svg-trash-bin-dims">
                <use xlink:href="images/icons/sprite.svg#trash-bin"></use>
              </svg>

            </div>
          </div>

        </div>
      </div>

      <div class="b-toolbar b-toolbar--subtoolbar settings-object-transform-toolbar" data-action="panel-settings-cube-texture">
        <div class="b-toolbar__content">

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar__texture-select-wrap">
              <div class="texture-select" data-action="texture-select" data-source="texture-select" data-selected="1">
                <div class="texture-select__wrap">
                  <div class="texture-select__back">
                  </div>
                  <div class="texture-select__selected">
                    <div class="texture-select__icon texture-select__selected-icon" data-catalog="wall-material"></div>
                    <div class="texture-select__open-button">
                      <div class="texture-select__selected-text">1</div>
                      <svg class="svg-up-white-dims texture-select__button-icon">
                        <use xlink:href="images/icons/sprite.svg#up-white"></use>
                      </svg>
                    </div>
                  </div>
                  <div class="texture-select__options">
                    <div class="texture-select__option" data-index="6">
                      <div class="texture-select__icon"></div>
                      6
                    </div>
                    <div class="texture-select__option" data-index="5">
                      <div class="texture-select__icon"></div>
                      5
                    </div>
                    <div class="texture-select__option" data-index="4">
                      <div class="texture-select__icon"></div>
                      4
                    </div>
                    <div class="texture-select__option" data-index="3">
                      <div class="texture-select__icon"></div>
                      3
                    </div>
                    <div class="texture-select__option" data-index="2">
                      <div class="texture-select__icon"></div>
                      2
                    </div>
                    <div class="texture-select__option" data-index="1">
                      <div class="texture-select__icon"></div>
                      1
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">

            <div class="b-toolbar-group" data-help="rotate">
              <div class="b-toolbar-group__label">
                Поворот
              </div>

              <input type="text" data-source="input" data-type="degrees" data-step="1" data-decor="&#176;" class="b-toolbar__input" value="0" data-action="wall_texture_rotation">

              <div class="b-toolbar__r-btn" data-action="rotate-45-w3d">
                <svg class="svg-rotate-45-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-45"></use>
                </svg>
              </div>
              <div class="b-toolbar__r-btn" data-action="rotate-90-w3d">
                <svg class="svg-rotate-90-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate-90"></use>
                </svg>
              </div>

            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar-group" data-help="rotate">
              <div class="b-toolbar-group__label">
                Смещение по X
              </div>

              <input type="text" data-source="input" data-step="0.1" class="b-toolbar__input" value="0" data-action="wall_texture_offset_x">

              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_x_sub" data-continuous="true">
                <svg class="svg-arrow-left-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-left"></use>
                </svg>
              </div>
              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_x_add" data-continuous="true">
                <svg class="svg-arrow-right-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-right"></use>
                </svg>
              </div>
            </div>
          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar-group" data-help="rotate">
              <div class="b-toolbar-group__label">
                по Y
              </div>

              <input type="text" data-source="input" data-step="0.1" class="b-toolbar__input" value="0" data-action="wall_texture_offset_y">

              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_y_add" data-continuous="true">
                <svg class="svg-arrow-up-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-up"></use>
                </svg>
              </div>
              <div class="b-toolbar__arrow-btn" data-action="wall_texture_offset_y_sub" data-continuous="true">
                <svg class="svg-arrow-down-dims">
                  <use xlink:href="images/icons/sprite.svg#arrow-down"></use>
                </svg>
              </div>
            </div>
          </div>

        </div>
       </div>

       <div class="b-toolbar object-transform-toolbar">
        <div class="b-toolbar__content">
          <div class="b-toolbar__section b-toolbar__section_sep">

            <div class="b-toolbar__design-btn-wrap" data-action="planoplan-preview">
              <div class="b-toolbar__design-btn  b-toolbar__design-btn-icon--brush" data-help="preview" data-source="preview" data-action="open-catalog object-preview" data-category="" data-catalog="objPOP">

              </div>
            </div>

            <div class="b-toolbar__toggle-btn" data-subtoolbar="settings-object-transform-toolbar" data-open="false" data-action="settings-cube-texture"> 
              <svg class="svg-settings-dims">
                <use xlink:href="images/icons/sprite.svg#settings"></use>
              </svg>
            </div>

          </div>

          <div class="b-toolbar__section b-toolbar__section_sep">
            <div class="b-toolbar-group" data-source="radio" data-action="transform-type" data-tab-controller="transform-type" data-selected="drag">
              <div class="b-toolbar__btn b-toolbar__btn--dark b-toolbar__btn_active" data-radio="transform-type" data-value="drag">
                <svg class="svg-drag-rotate-dims">
                  <use xlink:href="images/icons/sprite.svg#drag-rotate"></use>
                </svg>
              </div>
              <div class="b-toolbar__btn b-toolbar__btn--dark" data-radio="transform-type" data-value="rotate">
                <svg class="svg-rotate-dims">
                  <use xlink:href="images/icons/sprite.svg#rotate"></use>
                </svg>
              </div> 
              <div class="b-toolbar__btn b-toolbar__btn--dark" data-radio="transform-type" data-value="scale">
                <svg class="svg-scale-dims">
                  <use xlink:href="images/icons/sprite.svg#scale"></use>
                </svg>
              </div>
            </div>

            <div class="b-toolbar-tab" data-rel-controller="transform-type" data-tab="drag">
              <div class="b-toolbar-tab__content">
                <div class="b-toolbar-group">
                  <div class="b-toolbar-group__label">
                    Смещение по X
                  </div>
                  <input class="b-toolbar__input b-toolbar__input--red" type="text" data-source="input" value="0" data-action="object_offset_X">
                </div>
                
                <div class="b-toolbar-group">
                  <div class="b-toolbar-group__label">
                    по Y
                  </div>
                  <input class="b-toolbar__input b-toolbar__input--blue" type="text" data-source="input" value="0" data-action="object_offset_Y">
                </div>
    
                <div class="b-toolbar-group">
                  <div class="b-toolbar-group__label">
                    Над полом
                  </div>
                  <input class="b-toolbar__input b-toolbar__input--green" type="text" data-source="input" value="0" data-action="object_offset_Z">
                </div>
              </div>

            </div>

            <div class="b-toolbar-tab" data-rel-controller="transform-type" data-tab="rotate">
              <div class="b-toolbar-tab__content">
                <div class="b-toolbar-group__label">
                  Вращение объекта
                </div>
                <div class="b-toolbar-group">
                  <div class="b-toolbar-group">
                    <div class="b-toolbar-group__label">
                      X
                    </div>
                    <input class="b-toolbar__input b-toolbar__input--red" type="text" data-source="input" value="0" data-action="object_rotate_X">
                  </div>
                  
                  <div class="b-toolbar-group">
                    <div class="b-toolbar-group__label">
                      Y
                    </div>
                    <input class="b-toolbar__input b-toolbar__input--blue" type="text" data-source="input" value="0" data-action="object_rotate_Y">
                  </div>
      
                  <div class="b-toolbar-group">
                    <div class="b-toolbar-group__label">
                      Z
                    </div>
                    <input class="b-toolbar__input b-toolbar__input--green" type="text" data-source="input" value="0" data-action="object_rotate_Z">
                  </div>
                </div>
              </div>
  
            </div>

            <div class="b-toolbar-tab" data-rel-controller="transform-type" data-tab="scale" style="padding-left: 3px;">
              <div class="b-toolbar-tab__content">
  
                <div class="b-toolbar-group">
                  <div class="b-toolbar-group__label">
                    Длина объекта
                  </div>
                  <input class="b-toolbar__input b-toolbar__input--red" type="text" data-source="input" value="0" data-action="object_scale_X">
                </div>
                
                <div class="b-toolbar-group">
                  <div class="b-toolbar-group__label">
                    Ширина
                  </div>
                  <input class="b-toolbar__input b-toolbar__input--blue" type="text" data-source="input" value="0" data-action="object_scale_Y">
                </div>
    
                <div class="b-toolbar-group">
                  <div class="b-toolbar-group__label">
                    Высота
                  </div>
                  <input class="b-toolbar__input b-toolbar__input--green" type="text" data-source="input" value="0" data-action="object_scale_Z">
                </div>
              </div>

            </div>

          </div>
        
          <div class="b-toolbar__section b-toolbar__section_sep" data-help="delete">
            <div class="b-toolbar__trashbin-btn" data-action="delete-object">
              <svg class="svg-trash-bin-dims">
                <use xlink:href="images/icons/sprite.svg#trash-bin"></use>
              </svg>

            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="view-controls-wrap">
      <div class="view-controls">

        <div class="view-controls__top">
          <div class="overlay-btn overlay-btn_circle icon-3d-wrap" data-action="changeView" data-selected="2D">
            <svg class="svg-ic-3-d-dims icon-3d">
              <use xlink:href="images/icons/sprite.svg#ic-3-d"></use>
            </svg>
            <svg class="svg-ic-3-d-dims icon-2d">
              <use xlink:href="images/icons/sprite.svg#ic-2-d"></use>
            </svg>
            <svg class="svg-ic-exit-dims exit-mode">
              <use xlink:href="images/icons/sprite.svg#ic-exit"></use>
            </svg> 
           </span>
          </div>
          <div class="overlay-btn overlay-btn_circle icon-eye toggle-sizes" data-action="toggleSizes">
            <svg class="svg-ic-eye-dims">
              <use xlink:href="images/icons/sprite.svg#ic-eye"></use>
            </svg>
          </div>
          <div class="overlay-btn overlay-btn_circle ic-man change-view-mode" data-action="changeViewMode" data-selected="bird">
            <svg class="svg-ic-man-dims">
              <use xlink:href="images/icons/sprite.svg#ic-man"></use>
            </svg>
            <svg class="svg-ic-bird-dims">
              <use xlink:href="images/icons/sprite.svg#ic-bird"></use>
            </svg> 
          </div>
        </div>
        <div class="view-controls__middle">

          <div class="view-controls__control control-2d">
            <div class="overlay-btn overlay-btn_circle" data-action="centerCamera2d">
              <svg class="svg-ic-center-dims">
                <use xlink:href="images/icons/sprite.svg#ic-center"></use>
              </svg>
            </div>
            <div class="view-controls__group">
              <div class="overlay-btn overlay-btn_circle" data-action="zoomIn">
                <svg class="svg-ic-plus-dims">
                  <use xlink:href="images/icons/sprite.svg#ic-plus"></use>
                </svg>
              </div>
              <div class="overlay-btn overlay-btn_circle" data-action="zoomOut">
                <svg class="svg-ic-minus-dims">
                  <use xlink:href="images/icons/sprite.svg#ic-minus"></use>
                </svg>
              </div>
            </div>
          </div>

          <div class="view-controls__control control-bird">
            <div class="overlay-btn overlay-btn_circle" data-action="centerCamera3d">
              <svg class="svg-ic-center-dims">
                <use xlink:href="images/icons/sprite.svg#ic-center"></use>
              </svg>
            </div>
            <div class="view-controls__group">
              <div class="overlay-btn overlay-btn_circle" data-action="zoomIn">
                <svg class="svg-ic-plus-dims">
                  <use xlink:href="images/icons/sprite.svg#ic-plus"></use>
                </svg>
              </div>
              <div class="overlay-btn overlay-btn_circle" data-action="zoomOut">
                <svg class="svg-ic-minus-dims">
                  <use xlink:href="images/icons/sprite.svg#ic-minus"></use>
                </svg>
              </div>
            </div>
            <div class="overlay-menu" data-action="angle">
              <div class="overlay-menu__control">
                <div class="overlay-btn overlay-btn_circle">
                  <svg class="svg-ic-view-angle-dims">
                    <use xlink:href="images/icons/sprite.svg#ic-view-angle"></use>
                  </svg>
                </div>
              </div>
              <div class="overlay-menu__items">
                <div class="angle-range">
                  <div class="range-slider"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="view-controls__control control-man">
            <div class="overlay-menu" data-action="angle">
              <div class="overlay-menu__control">
                <div class="overlay-btn overlay-btn_circle">
                  <svg class="svg-ic-view-angle-dims">
                    <use xlink:href="images/icons/sprite.svg#ic-view-angle"></use>
                  </svg>
                </div>
              </div>
              <div class="overlay-menu__items">
                <div class="angle-range">
                  <div class="range-slider1"></div>
                </div>
              </div>
            </div>
            <div class="overlay-menu" data-action="cameraHeight">
              <div class="overlay-menu__control">
                <div class="overlay-btn overlay-btn_circle">
                  <svg class="svg-ic-camera-level-dims">
                    <use xlink:href="images/icons/sprite.svg#ic-camera-level"></use>
                  </svg>
                </div>
              </div>
              <div class="overlay-menu__items_vertical">
                <div class="camera-range">
                  <div class="range-slider2"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="view-controls__bottom">
          <div class="help-btn">

            <div class="overlay-select-menu">
              <div class="overlay-select-menu__value">
                <div class="overlay-btn overlay-btn_circle icon-question overlay-select-menu__button" data-action="help">
                  <svg class="svg-ic-question-dims">
                    <use xlink:href="images/icons/sprite.svg#ic-question"></use>
                  </svg>
                </div>
                <div class="overlay-select-menu__close"></div>
              </div>
              <ul class="overlay-select-menu__list">
                <li data-action="show-interface-tutorial">Знакомство с интерфейсом</li>
                <li data-action="show-hotkeys">Горячие клавиши</li>
              </ul>
            </div>

          </div>

          <div class="powered-by" style="display: none;">
            <a class="powered-by__link" href="https://planoplan.com/" target="_blank" rel="nofollow noopener">
              <svg class="svg-poweredbypop-dims">
                <use xlink:href="images/icons/sprite.svg#poweredbypop"></use>
              </svg>
            </a>
          </div>

        </div>

      </div>


    </div>

    <div class="left-controls-wrap">
      <div class="left-controls">
        <div class="left-controls__bottom overlay-select" data-action="units" data-source="select" data-selected="ic-mm">
          <div class="overlay-select__value--disabled" style="pointer-events: none;">
            <div class="overlay-btn overlay-btn_circle">
              <svg class="svg-ic-mm-dims">
                <use xlink:href="images/icons/sprite.svg#ic-mm"></use>
              </svg>
            </div>
          </div>
          <div class="overlay-select__items overlay-select__items--top overlay-select__submenu">
            <div class="overlay-select__items-wrap overlay-select__items-wrap--vertical">
            <div data-value="m">
              <div class="overlay-btn overlay-btn_circle">
                <svg class="svg-ic-m-dims">
                  <use xlink:href="images/icons/sprite.svg#ic-m"></use>
                </svg>
              </div>
            </div>
            <div data-value="cm">
              <div class="overlay-btn overlay-btn_circle">
                <svg class="svg-ic-cm-dims">
                  <use xlink:href="images/icons/sprite.svg#ic-cm"></use>
                </svg>
              </div>
            </div>
            <div data-value="mm">
              <div class="overlay-btn overlay-btn_circle">
                <svg class="svg-ic-mm-dims">
                  <use xlink:href="images/icons/sprite.svg#ic-mm"></use>
                </svg>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div class="left-controls__bottom" data-action="ceilingHeight">
          <div class="overlay-btn overlay-input">
            h&nbsp;<input class="overlay-input__input" data-action="ceiling-height" data-source="input" data-resizable="true" data-min="0" data-step="0.1">
            <div class="resizable-buffer"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="render-buttons single-render">
      <button class="render-button make-render" data-action="make-render">
        Сделать фотореалистичный снимок
      </button>
    </div>
    <div class="render-buttons pano-render">
      <button class="render-button" data-action="preview-pano-render">
        Превью панорамы 360&deg;
      </button>
      <button class="render-button render-button--blue" data-action="make-pano-render">
        Сделать панораму 360&deg;
      </button>
    </div>
      <ul class="catalog-buttons">
      <li class="catalog-buttons__button" data-action="plans">
      </li>
      <li class="catalog-buttons__button" data-action="catalog">
      </li>
    </ul>
    <div class="loader">
      <div class="loader__content">
        <div id="preloader-wrap">
        <svg viewBox="0 0 200 200" width="200" height="200" xml:space="preserve" id="preloader" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="70" stroke="#ff3e53" fill="none" stroke-width="5" stroke-linecap="round"></circle>
        </svg>
        </div>
        <div class="loader__text">
        </div>
      </div>
    </div>

    <div class="interface-shade"></div>
  </div>
  <div class="alert-container" 
  <?php if ($withUI) : ?> 
    style="z-index: 1; top: 65px;"
  <?php endif; ?>
  >
    </div>
<?php endif; ?>
  <?php $vrs = '=94' ?>
	
    <script>
	var vr = "<?=$vrs ?>";
	console.log('version '+ vr);
    if (window.parent === window) window.stop();
	  
	if('<?=$hideUI?>' == 'block') { var typeUI = 'ugol'; }
	else { var typeUI = 'planoplan'; }
	  
    </script>
    <script src="js/three.min.js?<?=$vrs?>"></script>
    <script src="js/jquery.js"></script>
    <script src="js/url-polyfill.min.js"></script>
    <script src="js/ThreeCSG.js"></script>    
    
    <script src="stats.min.js?<?=$vrs?>"></script>
    <script src="units.js?<?=$vrs?>"></script>
    <script src="rulerWin.js?<?=$vrs?>"></script>
    <script src="clickMoveObjectControls.js?<?=$vrs?>"></script>
    <script src="calculationArea.js?<?=$vrs?>"></script>
    <script src="snapToWall.js?<?=$vrs?>"></script>
    <script src="crossWall.js?<?=$vrs?>"></script>
    <script src="addPoint.js?<?=$vrs?>"></script>
    <script src="addWindowDoor.js?<?=$vrs?>"></script>
    <script src="mouseClick.js?<?=$vrs?>"></script>
	<script src="changeCamera.js?<?=$vrs?>"></script>
    <script src="moveCamera.js?<?=$vrs?>"></script>
    <script src="clickChangeWD.js?<?=$vrs?>"></script>
    <script src="clickMovePoint.js?<?=$vrs?>"></script>
    <script src="clickMoveWall.js?<?=$vrs?>"></script>
    <script src="clickMoveWD.js?<?=$vrs?>"></script>
    <script src="deleteObj.js?<?=$vrs?>"></script>
    <script src="floor.js?<?=$vrs?>"></script>
    <script src="detectZone.js?<?=$vrs?>"></script>
	<script src="plinths.js?<?=$vrs?>"></script>
    <script src="clickPopObj.js?<?=$vrs?>"></script>
    <script src="clickMovePivot.js?<?=$vrs?>"></script>
    <script src="clickMoveGizmo.js?<?=$vrs?>"></script>
	<script src="clickMoveGizmo360.js?<?=$vrs?>"></script>
    <script src="inputWall.js?<?=$vrs?>"></script>
    <script src="dragWindowDoorUI.js?<?=$vrs?>"></script>
    <script src="changeTexture.js?<?=$vrs?>"></script>
  	<script src="loadPopObj.js?<?=$vrs?>"></script>
	<script src="createParamWD.js?<?=$vrs?>"></script>
	<script src="boxPop.js?<?=$vrs?>"></script>
	
	<script src="clickActiveObj.js?<?=$vrs?>"></script>
	<script src="activeHover2D.js?<?=$vrs?>"></script>
    
    <script src="undoRedo.js?<?=$vrs?>"></script>
    <script src="saveLoad.js?<?=$vrs?>"></script>
	<script src="estimate.js?<?=$vrs?>"></script>
	<script src="getDesign.js?<?=$vrs?>"></script>
	<script src="posLabelRoom.js?<?=$vrs?>"></script>
	
    <script src="outlineShaders.js?<?=$vrs?>"></script>	
    <script src="script.js?<?=$vrs?>"></script>
    <script src="outline.js?<?=$vrs?>"></script>	
	<script src="eventKey.js?<?=$vrs?>"></script>
	
<?php if ($withUI) : ?>
	<script src="https://threejs.org/examples/js/loaders/OBJLoader.js"></script>
    <script src="js/range-slider.js?<?=$vrs?>"></script>
    <script src="js/editable-input.js?<?=$vrs?>"></script>
    <script src="js/svg4everybody.min.js?<?=$vrs?>"></script>
    <script src="js/simplebar.js?<?=$vrs?>"></script>
    <script src="js/chaininput.js?<?=$vrs?>"></script>
    <script src="js/toolbar-help.js?<?=$vrs?>"></script>
    <script src="js/ui.js?<?=$vrs?>"></script>
    <script src="js/log.js?<?=$vrs?>"></script>
    <script src="js/interface-tutorial.js?<?=$vrs?>"></script>
    <script src="js/tutorial.js?<?=$vrs?>"></script>
    <script src="js/postmessage.js?<?=$vrs?>"></script>
    <script src="js/overlay.js?<?=$vrs?>"></script>
    <script src="js/editorApi.js?<?=$vrs?>"></script>
    <script src="js/uiApi.js?<?=$vrs?>"></script>
<?php else : ?>
    <script src="js/editorApi.js?<?=$vrs?>"></script>
<?php endif; ?>


<script>console.log('<?=$_SERVER['SERVER_NAME']?>', 'new')</script>
  
<? 
	if($_SERVER['SERVER_NAME']=='plan3' || $_SERVER['SERVER_NAME']=='webgl-editor') {?> <script>console.log('stop metrika')</script> <?}
	else { ?> <script>console.log('metrika')</script> <? } 
 ?> 


</body>

</html>