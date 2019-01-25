import * as types from '../constants/';

export default function (state = {}, action) {
  let filters, newlibraries, newFilters = [];
  switch (action.type) {
    case types.OPEN_MODAL:
      return { ...state, modal: { ...state.modal, isOpen: true, window: action.payload.name, pending: action.payload.pending } }

    case types.CLOSE_MODAL:
      return { ...state, modal: { ...state.modal, isOpen: false, pending: '' } }

    case types.ADD_LIBRARY:
      newlibraries = { ...state.libraries };
      newlibraries[action.payload.id] = { ...action.payload }
      return { ...state, libraries: { ...newlibraries } }

    case types.SET_LIBRARY:
      return { ...state, library: action.payload }

    case types.FETCHING_LIBRARY:
      return { ...state, fetchingLibrary: true }

    case types.FETCHING_LIBRARY_END:
      return { ...state, fetchingLibrary: false }

    case types.FETCHING_LOTS:
      return { ...state, fetchingLots: true }

    case types.FETCHING_LOTS_END:
      return { ...state, fetchingLots: false }

    case types.SET_MODAL_HEADER:
      return { ...state, modal: { ...state.modal, ...action.payload } }

    case types.SET_FILTERS:
      filters = action.payload.filters.toString().split(',');
      newFilters = [];
      if (action.payload.onlyOne) {
        newFilters = [...filters];
      } else {
        newFilters = [...state.filters, ...filters];
      }
      return { ...state, filters: newFilters }

    case types.SET_LOTS:
      return {
        ...state,
        lots: action.payload.lots,
        totalLots: action.payload.total,
        avaibleFilters: action.payload.avaibleFilters,
        allAvaibleFilters: action.payload.allAvaibleFilters,
        oldFilters: action.payload.oldFilters,
        pages: { ...state.pages, ...action.payload.pages }
      }

    case types.CLEAR_LOTS:
      return { ...state, lots: [], lotFilters: [], totalLots: 0, pages: { ...state.pages, count: 0 } }

    case types.SET_PREVIOUS_PAGE:
      return { ...state, modal: { ...state.modal, previousPage: action.payload } }

    case types.SET_ALL_FILTERS:
      return { ...state, allFilters: { ...action.payload.allFilters }, allGroups: { ...action.payload.allGroups } }

    case types.CLEAR_FILTERS:
      return { ...state, avaibleFilters: false, allAvaibleFilters: false, selectedFilters: false }

    case types.SET_LOT_FILTERS:
      filters = action.payload.toString().split(',');
      return { ...state, lotFilters: [...filters] }

    case types.CLEAR_LOT_FILTERS:
      return { ...state, lotFilters: [] }

    case types.REMOVE_LOT_FILTERS:
      return { ...state, lotFilters: [...action.payload] }

    case types.SET_MODAL_PAGE:
      return { ...state, modal: { ...state.modal, page: action.payload } }

    case types.SET_CATALOG_PAGE:
      return { ...state, pages: { ...state.pages, current: action.payload } }

    case types.SET_CATEGORY:
      return { ...state, category: action.payload }

    case types.SET_OLD_AVAIBLE_FILTERS:
      return { ...state, oldFilters: action.payload }

    case types.SET_SELECTED_FILTERS:
      return { ...state, selectedFilters: { ...state.selectedFilters, ...action.payload } }

    case types.CLEAR_SELECTED_FILTERS:
      return { ...state, selectedFilters: { ...action.payload } }

    case types.SET_PRICE_ORDER:
      return { ...state, priceOrder: action.payload }

    case types.SET_LAST_MODIFED_FILTER:
      return { ...state, lastModifedFilter: action.payload }

    case types.SET_ACTIVE_LOT:
      return { ...state, activeLot: { ...action.payload } }

    case types.CLEAR_ACTIVE_LOT:
      return { ...state, activeLot: false }

    case types.NEED_TO_UPDATE_FILTERS:
      return { ...state, needToUpdateFilters: action.payload }

    default:
      return state
  }
}