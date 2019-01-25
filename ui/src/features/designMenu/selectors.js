import { getDesigns, actions, pickDesign } from './reducers';
import { createSelector } from 'reselect';
import { makeThumbUrl } from '../../utils';

const getDesignMenu = (state) => state.designMenu;

export const mapDesignMenuToProps = createSelector(
  [getDesignMenu],
  (designMenu) => {
    const items = designMenu.items[designMenu.category] || [];
    let itemsWithLoading = items.slice();

    if (designMenu.loadingDesign) {
      itemsWithLoading = items.map((item) => {
        if (item.id === designMenu.loadingDesign) {
          return {
            ...item,
            loading: true,
          }
        }

        return item
      });
    }

    const itemsWithResizedPreview = itemsWithLoading.map((item) => ({
      ...item,
      preview: makeThumbUrl(item.preview, '210x135'),
    }))

    return {
      items: itemsWithResizedPreview,
      category: designMenu.category,
      categories: designMenu.categories,
    }
  }
)

export const mapDesignMenuDispatch = (dispatch) => ({
  getDesigns: () => dispatch(getDesigns()),
  setCategory: (value) => dispatch(actions.setCategory(value)),
  handleClick: (value) => dispatch(pickDesign(value)),
})
