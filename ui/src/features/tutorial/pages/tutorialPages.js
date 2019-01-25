import React from 'react';
import { Image, Text, Section, ImageSection } from '../atoms';
import mouseSVG from '../../../images/tutorial/ic-mouse.svg';
import arrowsSVG from '../../../images/tutorial/ic-arrows.svg';
import moveSVG from '../../../images/tutorial/ic-move.svg';
import rotateSVG from '../../../images/tutorial/ic-rotate.svg';
import d3SVG from '../../../images/tutorial/3-d.svg';
import roomSVG from '../../../images/tutorial/ic-room.svg';
import styleSVG from '../../../images/tutorial/ic-style.svg';
import arrowSVG from '../../../images/tutorial/ic-arrow.svg';
import styled from 'styled-components';

const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
`

export const Page1 = () => (
  <PageWrapper>
    <Section>
      <ImageSection>
        <Image>
          <img src={mouseSVG} alt="mouse" />
        </Image>
      </ImageSection>
      <Text >
        Используйте левую кнопку мыши,<br />
        для вращения модели и выбора объектов
    </Text>
    </Section>
    <Section>
      <ImageSection>
        <Image>
          <img src={arrowsSVG} alt="keyboard" />
        </Image>
      </ImageSection>
      <Text>
        Перемещайтесь с помощью<br />
        клавиш клавиатуры
    </Text>
    </Section>
  </PageWrapper>
)

export const Page2 = () => (
  <PageWrapper>
    <Section>
      <ImageSection>
        <Image>
          <img src={moveSVG} alt="move" />
        </Image>
        <Image>
          <img src={rotateSVG} alt="rotate" />
        </Image>
      </ImageSection>
      <Text>
        Перемещайте<br /> и вращайте объекты
    </Text>
    </Section>
  </PageWrapper>
)

export const Page3 = () => (
  <PageWrapper>
    <Section>
      <ImageSection>
        <Image>
          <img src={roomSVG} alt="room" />
        </Image>
      </ImageSection>
      <Text>
        Выберете комнату кликнув на пол
    </Text>
    </Section>
  </PageWrapper>
)

export const Page4 = () => (
  <PageWrapper>
    <Section>
      <ImageSection>
        <Image>
          <img src={styleSVG} alt="style" />
        </Image>
      </ImageSection>
      <Text>
        Примените понравившийся<br />
        дизайн помещения, кликнув на него
    </Text>
    </Section>
  </PageWrapper>
)

export const Page5 = () => (
  <PageWrapper>
    <Section>
      <ImageSection>
        <Text>
          Сохраняйте проект и продолжайте<br />
          работать в Planoplan Editor.<br />
          Используйте все возможности Planoplan
         </Text>
      </ImageSection>
    </Section>
  </PageWrapper>
)

export const Page6 = () => (
  <React.Fragment>
    <Image>
      <img src={d3SVG} alt="3d" />
    </Image>
    <Text>
      Посмотрите результат в 3D
    </Text>
  </React.Fragment>
)

export const Page7 = () => (
  <React.Fragment>
    <Image>
      <img src={arrowSVG} alt="arrow" />
    </Image>
    <Text>
      Сохраните интерактивную модель вашей будущей квартиры.<br />
      Задайте точные размеры своей квартиры после приемки.
    </Text>
  </React.Fragment>
)
