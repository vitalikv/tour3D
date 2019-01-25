import { mappedButtons } from '../features/toolbars/buttons/mapButtons';
import { actions } from '../features/toolbars/reducers';
import { actions as designMenuActions } from '../features/designMenu/reducers';
import { actions as designMenuApiActions } from '../features/designMenu/apiActions';
import { actions as authActions } from '../features/authWidget/reducers';
import { actions as authApiActions } from '../features/authWidget/apiActions';
import { actions as mainActions } from '../reducer';
import { actions as mainApiActions } from '../apiActions';
import { actions as tutorialActions } from '../features/tutorial/reducers';
import { actions as tutorialApiActions } from '../features/tutorial/apiActions';
class Api {
  dispatch = null;
  getState = null;
  awaitingActions = [];
  isInitiated = false;

  registerDispatch(dispatch, getState) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.isInitiated = true;
    this.awaitingActions.map((action) => this.dispatchAction(action.methodName, action.methodValue));
  }

  getActions(methodName) {
    const editorActionsArray = Object.values(mappedButtons);

    return editorActionsArray.filter((button) => (button.name === methodName));
  }

  getNewState(methodName, methodValue) {
    const actions = this.getActions(methodName);
    const newState = {};

    if (actions.length) {
      actions.reduce((state, action) => {
        state[action.alias] = action.value ? (methodValue === action.value) : methodValue;
        return state;
      }, newState);
    }

    return newState;
  }

  dispatchAction(methodName, methodValue) {
    if (!this.isInitiated) {
      this.saveActionIfNotInitiated(methodName, methodValue);

      return false;
    }

    let buttonAction = true;

    if (typeof authApiActions[methodName] !== 'undefined') {
      const actionName = authApiActions[methodName].action;

      this.dispatch(authActions[actionName](methodValue));
      buttonAction = false;
    }

    if (typeof mainApiActions[methodName] !== 'undefined') {
      const actionName = mainApiActions[methodName].action;

      this.dispatch(mainActions[actionName](methodValue));
      buttonAction = false;
    }

    if (typeof designMenuApiActions[methodName] !== 'undefined') {
      const actionName = designMenuApiActions[methodName].action;

      this.dispatch(designMenuActions[actionName](methodValue));
      buttonAction = false;
    }

    if (typeof tutorialApiActions[methodName] !== 'undefined') {
      const actionName = tutorialApiActions[methodName].action;

      this.dispatch(tutorialActions[actionName](methodValue));
      buttonAction = false;
    }


    if (buttonAction) {
      const newState = this.getNewState(methodName, methodValue);

      this.dispatch(actions.uiSetState(newState));
    }
  }

  saveActionIfNotInitiated(methodName, methodValue) {
    this.awaitingActions.push({
      methodName: methodName,
      methodValue: methodValue
    })
  }
}

export const API = new Api();
