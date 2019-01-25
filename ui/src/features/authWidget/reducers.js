import { createSymbiote } from 'redux-symbiote';
import { request } from '../../api/request';
import { invokeEditorAction } from '../../api';
import { wrapInPromise } from '../../utils';
import { actions as rootActions } from '../../reducer';

const initialState = {
  authSuccess: false,
  regSuccess: false,
  saveSuccess: false,
  designFetching: false,
  authErrorText: '',
  regErrorText: '',
  userName: '',
  userLastName: '',
  userAvatar: '',
  saveErrorText: '',
}

export const { actions, reducer } = createSymbiote(initialState, {
  authRequestSuccess: (state, data) => {
    return {
      ...state,
      authSuccess: true,
    };
  },
  regRequestSuccess: (state, data) => {
    return {
      ...state,
      regSuccess: true,
    };
  },
  regSaveSuccess: (state, data) => {
    return {
      ...state,
      saveSuccess: true,
    };
  },
  projectSaveSuccess: (state) => {
    return {
      ...state,
      saveSuccess: true,
      saveErrorText: '',
    }
  },
  projectSaveError: (state, value) => {
    let error = value;
    
    if (value === 'Out of limit') {
      error = 'Ошибка сохранения: отсутствует место для нового проекта'
    }

    return {
      ...state,
      saveSuccess: false,
      saveErrorText: error,
    }
  },
  setAuthErrorText: (state, value) => {
    return {
      ...state,
      authErrorText: value,
    }
  },
  setRegErrorText: (state, value) => {
    return {
      ...state,
      regErrorText: value,
    }
  },
  setUserData: (state, { name = '', lastName = '', avatar = '' }) => {
    return {
      ...state,
      userName: name,
      userLastName: lastName,
      userAvatar: avatar,
    }
  },
  openWidget: (state) => {
    return { ...state }
  }
}, 'authWidget')

export const authRequest = ({ email, password }) => async (dispatch) => {
  const response = await request.authRequest({
    email,
    password,
    'password-clone': password,
  });

  if (!response.errorText) {
    dispatch(actions.authRequestSuccess(response))
  } else {
    dispatch(actions.setAuthErrorText(response.errorText))
  }
}

export const regRequest = ({ email, password }) => async (dispatch) => {
  const response = await request.regRequest({
    name: email,
    email,
    password,
    'password-clone': password,
    agreements: 1,
    dont_send_mail: 1,
  });

  if (!response.errorText) {
    dispatch(actions.regRequestSuccess(response));
    dispatch(projectSaveAsNew());
  } else {
    dispatch(actions.setRegErrorText(response.errorText))
  }

}

export const projectSaveAsNew = () => (dispatch) => {
  invokeEditorAction({ name: 'ProjectSaveAsNew', value: '' });
}

export const hideWidget = () => async (dispatch) => {
  setTimeout(() => {
    dispatch(rootActions.hideAuthWidget())
  }, 300);
}

export const vkAuthRequest = () => async (dispatch) => {
  // eslint-disable-next-line no-undef
  const vkResponse = await vkLogin();

  if (!vkResponse.session) return;

  const { id, first_name, last_name } = vkResponse.session.user;
  const avatar = await getVKAvatar(id);

  dispatch(actions.setUserData({
    avatar: avatar.response[0].photo,
    name: first_name,
    lastName: last_name,
  }));

  const response = await request.vkAuthRequest();

  if (response.success) {
    dispatch(actions.authRequestSuccess(response))
  }
}

export const fbAuthRequest = () => async (dispatch) => {
  const fbResponse = await fbLogin();

  if (!fbResponse.authResponse) return;

  const fbInfo = await getFbInfo();

  if (fbInfo) {
    const { name, picture } = fbInfo;

    dispatch(actions.setUserData({
      avatar: picture.data.url,
      name: name,
      lastName: '',
    }));
  }

  const response = await request.fbAuthRequest();

  if (response.success) {
    dispatch(actions.authRequestSuccess(response))
  }
}

function vkLogin() {
  // eslint-disable-next-line no-undef
  return wrapInPromise(VK.Auth.login)
}

function fbLogin() {
  // eslint-disable-next-line no-undef
  return wrapInPromise(FB.login)
}

function getVKAvatar(uid) {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    VK.api("users.get", { "uids": uid, "fields": "photo", "v": 5.92 }, (response) => resolve(response));
  })
}

function getFbInfo() {
  return new Promise((resolve) => {
    // eslint-disable-next-line no-undef
    FB.api('/me', { fields: ['name', 'picture', 'last_name'] }, (response) => resolve(response));
  })
}
