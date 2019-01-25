import React from 'react'

export const Picture = ({ src, alt }) => {
  const parsedSrc = src.match(/(.+)(\..*)/);
  const name = parsedSrc[1];
  const ext = parsedSrc[2];

  return (
    <picture>
      <source
        srcSet={`${name}${ext},
                ${name}@2x${ext} 2x,
                ${name}@3x${ext} 3x`}
        alt={alt} />
      <img src={src} alt={alt}></img>
    </picture>
  )
}
