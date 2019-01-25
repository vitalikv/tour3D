import React from 'react';
import { WidgetViewToolbar } from '../../features/toolbars'
import { mapMainToProps, mapMainDispatch } from '../../selectors';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { PopIcon } from '../atoms';
import { AuthWidget } from '../../features/authWidget';
import { DesignMenu } from '../../features/designMenu';
import { CursorPreview } from '../../features/cursorPreview/pages';
import { Tutorial } from '../../features/tutorial/pages';

const enchance = compose(
  connect(mapMainToProps, mapMainDispatch),
)

export const Main = enchance(({ toolbarsVisible, designMenuVisible, cursorPreview, mouseX, mouseY,
  handlePreviewHide, authWidgetVisible }) => (
    <div>
      <PopIcon />
      <WidgetViewToolbar visible={toolbarsVisible} />
      <DesignMenu visible={designMenuVisible} />
      <AuthWidget visible={authWidgetVisible} />
      <CursorPreview
        hidePreview={handlePreviewHide}
        preview={cursorPreview}
        initialX={mouseX}
        initialY={mouseY} />
      <Tutorial />
    </div>
  ));
