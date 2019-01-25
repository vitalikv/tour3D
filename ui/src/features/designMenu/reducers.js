import { createSymbiote } from 'redux-symbiote';
import { request, invokeEditorAction } from '../../api';
import { actions as mainActions } from '../../reducer';

const initialState = {
  categories: [],
  items: {},
  category: 0,
  loadingDesign: 0,
}

const keys = 'gTrXmAvwpGAZ2yi5j1RH8P3YEPp6NQE6rIh4fdcjnpgup00NlvymB1vC153Pen77';
// const local = process.env.NODE_ENV !== 'production';
const local = false;

export const { actions, reducer } = createSymbiote(initialState, {
  fetchLibraries: {
    start: (state) => {
      return { ...state }
    },
    failed: (state, error) => { console.error('Loading api error:', error); return { ...state } },
    finish: (state) => {
      return {
        ...state,
      }
    }
  },
  fetchLibrariesTemp: {
    start: (state) => {
      return { ...state }
    },
    failed: (state, error) => { console.error('Loading api error:', error); return { ...state } },
    finish: (state, data) => {
      return {
        ...state,
        designs: data
      }
    }
  },
  applyDesignsData: (state, value) => {
    return {
      ...state,
      ...value,
    }
  },
  setCategory: (state, value) => {
    return {
      ...state,
      category: value,
    }
  },
  designProjectLoadStart: (state, value) => {
    return {
      ...state,
      loadingDesign: value,
    }
  },
  designProjectLoadEnd: (state) => {
    return {
      ...state,
      loadingDesign: false,
    }
  },
}, 'designMenu');

export const getDesigns = () => async (dispatch) => {
  const librariesTempUrl = await dispatch(getLibraries());
  const libraries = await dispatch(getLibrariesTemp(librariesTempUrl));
  const data = await getAllLots(libraries);

  dispatch(actions.applyDesignsData(data));
}

const getAllLots = async (categories) => {
  const items = {};
  const categoriesList = [];

  for (let i in categories) {
    const result = await getLotsInCategory(categories[i].id);
    const id = categories[i].id;

    if (result) {
      items[id] = result;
      categoriesList.push({
        id,
        title: categories[i].name,
        image: categories[i].image,
      })
    }
  }


  return {
    items,
    categories: categoriesList,
    category: categoriesList.length ? categoriesList[0].id : 0,
  };
}


const getLotsInCategory = async (id) => {
  let data;

  try {
    data = local
      ? await request.get('./api/' + id + '.json')
      : await request.get(`https://catalog.planoplan.com/api/v2.1/search/?keys[0]=${keys}&categories[0]=${id}&lang=ru`);
  }
  catch (error) {

  }

  if (!data || typeof data.items === 'undefined') {
    return;
  }

  return data.items;
}

const getLibrariesTemp = (link) => async (dispatch) => {
  let data;

  dispatch(actions.fetchLibrariesTemp.start())
  try {
    data = local
      ? await request.get('./api/librariesTemp.json')
      : await request.get(link);
  }
  catch (error) {
    dispatch(actions.fetchLibrariesTemp.failed(error.message))
  }

  if (!data || !Object.keys(data).length) {
    return;
    // throw new Error('Ошибка api');
  }

  dispatch(actions.fetchLibrariesTemp.finish(data));

  return data.categories[0].categories
}

const getLibraries = () => async (dispatch) => {
  let data;

  dispatch(actions.fetchLibraries.start())
  try {
    data = local
      ? await request.get('./api/libraries.json')
      : await request.get('https://catalog.planoplan.com/init/?lang=ru&keys[0]=' + keys);
  }
  catch (error) {
    dispatch(actions.fetchLibraries.failed(error.message))
  }

  if (!data || !Object.keys(data).length) {
    return;
    // throw new Error('Ошибка api');
  }

  dispatch(actions.fetchLibraries.finish(data));

  return data.librariesTemp[0];
}

export const pickDesign = ({ event, desigId }) => (dispatch, getState) => {
  const { category, items } = getState().designMenu;
  const object = items[category].find(({ id }) => id === desigId);

  dispatch(mainActions.updateMousePosition(event));

  invokeEditorAction({
    name: 'ApplyDesign',
    value: object
  });
}
