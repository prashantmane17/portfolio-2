import React from 'react';
import PageCanvas from './components/canvas/PageCanvas';
import StoryRoot from './components/story/StoryRoot';
import CarStage from './components/story/CarStage';
import HeroScene from './components/story/scenes/HeroScene';
import RevealScene from './components/story/scenes/RevealScene';
import PerformanceScene from './components/story/scenes/PerformanceScene';
import AeroScene from './components/story/scenes/AeroScene';
import InteriorScene from './components/story/scenes/InteriorScene';
import CustomizerScene from './components/story/scenes/CustomizerScene';
import FooterScene from './components/story/scenes/FooterScene';
import { SmoothScroll } from './providers/SmoothScroll';
import { car3d } from './config/car';
import { stations } from './config/story';

function App() {
  return (
    <SmoothScroll>
      <PageCanvas />
      <main>
        <StoryRoot stage={<CarStage model={car3d} stations={stations} />}>
          <HeroScene />
          <RevealScene />
          <PerformanceScene />
          <AeroScene />
          <InteriorScene />
          <CustomizerScene />
          <FooterScene />
        </StoryRoot>
      </main>
    </SmoothScroll>
  );
}

export default App;
