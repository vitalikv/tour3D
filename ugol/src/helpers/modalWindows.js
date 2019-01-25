import React from 'react'
import CatalogCategories from '../containers/CatalogCategories'
import CatalogLots from '../containers/CatalogLots'
import StartModal from '../containers/StartModal'
import TutorialPage from '../components/TutorialPage'
import LAYOUT_CATEGORY from '../constants/'
import LOTS_CATEGORY from '../constants/'

import tutor1 from '../images/tutor-pic-1.png'
import tutor2 from '../images/tutor-pic-2.png'
import tutor3 from '../images/tutor-pic-3.png'

const modalWindows = {
  catalog: {
    name: 'Каталог товаров',
    el: <CatalogCategories />,
    nextModal: 'lots',
    prevModal: '',
    library: LOTS_CATEGORY,
    type: 'catalog'
  },
  layouts: {
    name: 'Выбрать из каталога',
    el: <CatalogCategories />,
    nextModal: 'layoutLots',
    prevModal: 'startModal',
    library: LAYOUT_CATEGORY,
    type: 'catalog'
  },
  layoutLots: {
    name: '',
    el: <CatalogLots />,
    nextModal: '',
    prevModal: 'layouts',
    type: 'catalog'
  },
  lots: {
    name: 'lots',
    el: <CatalogLots />,
    nextModal: '',
    prevModal: 'catalog',
    type: 'catalog'
  },
  startModal: {
    name: 'Начало работы',
    el: <StartModal />,
    nextModal: 'layouts',
    prevModal: '',
    type: 'catalog'
  },
  tutorialPage1: {
    name: 'Знакомство с редактором',
    el: <TutorialPage />,
    nextModal: 'layouts',
    prevModal: '',
    type: 'tutorial',
    content: {
      image: tutor1,
      text: 'В редакторе вы можете легко создать свою планировку, применять дизайн-проекты, добавлять\r\n предметы интерьера, менять отделку, работать в 2D и 3D режимах, а так же создавать\r\n фотореалистичные снимки.',
      next: 'Далее'
    },
    pages: [{ id: 0, page: 'tutorialPage1' }, { id: 1, page: 'tutorialPage2' }, { id: 2, page: 'tutorialPage3' }],
    page: 0
  },
  tutorialPage2: {
    name: 'Дизайн-проект',
    el: <TutorialPage />,
    nextModal: 'layouts',
    prevModal: '',
    type: 'tutorial',
    content: {
      image: tutor2,
      text: 'После создания помещения назначьте ему тип, далее в поле Дизайн нажмите «Выбрать».\r\nВ открывшемся каталоге выберете понравивщийся дизайн-проект.',
      next: 'Далее'
    },
    pages: [{ id: 0, page: 'tutorialPage1' }, { id: 1, page: 'tutorialPage2' }, { id: 2, page: 'tutorialPage3' }],
    page: 1
  },
  tutorialPage3: {
    name: 'Просмотр проекта в 3D',
    el: <TutorialPage />,
    nextModal: 'layouts',
    prevModal: '',
    type: 'tutorial',
    content: {
      image: tutor3,
      text: 'Перейдите в 3D-режим и посмотрите на проект со всех сторон. Режим Полета позволяет оценить\r\n общий вид проекта, режим Прогулки дает рассмотреть детали.',
      next: 'Понятно'
    },
    pages: [{ id: 0, page: 'tutorialPage1' }, { id: 1, page: 'tutorialPage2' }, { id: 2, page: 'tutorialPage3' }],
    page: 2
  },
  layoutAlert: {
    text: 'Выбор новой планировки перезапишет текущий проект, вернуться к нему будет невозможно!',
    accept: 'Продолжить',
    decline: 'Отменить',
    type: 'warning'
  }
}

export default modalWindows