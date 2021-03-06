import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SlideButton from '../../components/SlideButton/'

import * as appActions from '../../actions/'

import catalogIcon from '../../svg/ic-chair.svg'
import layoutsIcon from '../../svg/ic-plan.svg'

import { LOTS_CATEGORY, LAYOUT_CATEGORY } from '../../constants';

const mapStateToProps = (state) => {
  return { ...state }
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(appActions, dispatch)
};

class CatalogButtons extends Component {

  constructor(props) {
    super(props);
    this.openModal = this.props.openModal.bind(this);
    this.setLibrary = this.props.setLibrary.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setPreviousPage = this.props.setPreviousPage.bind(this);
    this.setModalPage = this.props.setModalPage.bind(this);
    this.clearFilters = this.props.clearFilters.bind(this);
    this.clearActiveLot = this.props.clearActiveLot.bind(this);
    this.needToUpdateFilters = this.props.needToUpdateFilters.bind(this);
  }

  handleClick(name, id) {
    if ((this.props.modal.window == 'catalog' ||
      this.props.modal.window == 'lots' ||
      this.props.modal.window == 'layouts') &&
      this.props.library === id) {
      this.clearActiveLot();
      this.needToUpdateFilters(false);
      this.openModal(this.props.modal.window, false, false);
    } else {
      this.clearFilters();
      this.setLibrary(id);
      this.setModalPage(0);
      this.clearActiveLot();
      this.setPreviousPage('');
      this.openModal(name, false, false);
    }
  }

  render() {
    return (
      <ul className='catalog-buttons'>
        <li className='catalog-buttons__button'>
          <SlideButton handleClick={() => this.handleClick('layouts', LAYOUT_CATEGORY)} icon={layoutsIcon} caption='Планировки' />
        </li>
        <li className='catalog-buttons__button'>
          <SlideButton handleClick={() => this.handleClick('catalog', LOTS_CATEGORY)} icon={catalogIcon} caption='Каталог товаров' />
        </li>
      </ul>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogButtons)