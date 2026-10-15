import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// The demo video of a chapter, with a chapter list. The captions are burned into the picture.
export default function LabVideo({name}) {
  const path = `/video/${name}`;
  return (
    <video controls preload="metadata" style={{width: '100%', maxWidth: 960}} poster={useBaseUrl(`${path}.png`)}>
      <source src={useBaseUrl(`${path}.mp4`)} type="video/mp4" />
      <track kind="chapters" src={useBaseUrl(`${path}.chapters.vtt`)} srcLang="en" label="Chapters" />
    </video>
  );
}
