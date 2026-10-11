import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import { Scenes } from './components/scenes';
import Reveal from './components/ui/Reveal';
import { SmoothScroll } from './providers/SmoothScroll';
import { sections } from './config/sections';
import { heroImage } from './data/portfolio';

function App() {
  const sceneSections = sections.filter((s) => s.scene);
  const plainSections = sections.filter((s) => !s.scene);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col font-sans selection:bg-primary-500/30">
        <Navbar />
        <main className="flex-grow">
          <Scenes.Root>
            <Scenes.Backdrop src={heroImage.src} focus={heroImage.focus} />
            {sceneSections.map(({ id, Component, sceneClass, sceneStackedClass }) => (
              <Scenes.Scene key={id} id={id} className={sceneClass} stackedClassName={sceneStackedClass}>
                <Component />
              </Scenes.Scene>
            ))}
          </Scenes.Root>
          {plainSections.map(({ id, Component }) => (
            <Reveal key={id} id={id}>
              <Component />
            </Reveal>
          ))}
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </SmoothScroll>
  );
}

export default App;
