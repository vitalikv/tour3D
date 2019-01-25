import React from 'react';

export const CenterSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="0 0 24 24">
    <g transform="translate(2 1)">
      <circle cx="10" cy="10" r="10" />
      <filter width="135%" height="135%" x="-17.5%" y="-12.5%" filterUnits="objectBoundingBox">
        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1" />
        <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1" />
        <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
      </filter>
      <circle cx="10" cy="10" r="8" fill="#FFF" strokeLinejoin="square" strokeWidth="2" />
      <circle cx="10" cy="10" r="2" />
    </g>
  </svg>
)
