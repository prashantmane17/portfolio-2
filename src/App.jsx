import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import { sections } from './config/sections';

function App() {
  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col font-sans selection:bg-primary-500/30">
      <Navbar />
      <main className="flex-grow">
        {sections.map(({ id, Component }) => (
          <div key={id} id={id}>
            <Component />
          </div>
        ))}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
