import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// The demo video of a chapter, with captions and a chapter list.
export default function LabVideo({name}) {
  const path = `/video/${name}`;
  return (
    <video controls preload="metadata" style={{width: '100%', maxWidth: 960}} poster={useBaseUrl(`${path}.png`)}>
      <source src={useBaseUrl(`${path}.mp4`)} type="video/mp4" />
      <track kind="captions" src={useBaseUrl(`${path}.vtt`)} srcLang="en" label="English" default />
      <track kind="chapters" src={useBaseUrl(`${path}.chapters.vtt`)} srcLang="en" label="Chapters" />
    </video>
  );
}
