import { useState } from 'react';
import NavBar from './components/NavBar';
import ScrollStage from './components/three/ScrollStage';
import TabView from './components/TabView';
import TabProgress from './components/TabProgress';
import ProjectHotspot from './components/ProjectHotspot';
import AmbientSky from './components/AmbientSky';
import GlassView from './components/GlassView';
import ArcadeView from './arcade/ArcadeView';
import { setStageTab } from './components/three/stagePose';
import useEdgeNav, { markTabNav } from './hooks/useEdgeNav';
import useAmbient from './hooks/useAmbient';
import { readViewMode, setViewMode } from './hooks/useViewMode';
import { tabs } from './constants';

const initialTab = () => {
  const id = window.location.hash.replace('#', '');
  return tabs.some((t) => t.id === id) ? id : 'home';
};

const StandardView = () => {
  const [tab, setTab] = useState(() => {
    const id = initialTab();
    setStageTab(id);
    return id;
  });
  const { enabled: ambientOn, toggle: toggleAmbient, ambient, manual, setManual } = useAmbient();

  const selectTab = (id) => {
    if (id === tab) return;
    markTabNav();
    setStageTab(id);
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  const index = tabs.findIndex((t) => t.id === tab);
  useEdgeNav({
    onNext: index < tabs.length - 1 ? () => selectTab(tabs[index + 1].id) : undefined,
    onPrev: index > 0 ? () => selectTab(tabs[index - 1].id) : undefined,
  });

  return (
    <div className="grain">
      <NavBar
        activeTab={tab}
        onSelect={selectTab}
        ambientOn={ambientOn}
        onToggleAmbient={toggleAmbient}
        ambient={ambient}
        manual={manual}
        onManualChange={setManual}
        onEnterArcade={() => setViewMode('arcade')}
      />
      <ScrollStage activeTab={tab} ambient={ambient} ambientOn={ambientOn} />
      <AmbientSky enabled={ambientOn} ambient={ambient} />
      <main className="relative z-10">
        <TabView tab={tab} onSelect={selectTab} />
      </main>
      <GlassView enabled={ambientOn} ambient={ambient} />
      <TabProgress activeTab={tab} onSelect={selectTab} />
      <ProjectHotspot activeTab={tab} />
    </div>
  );
};

// the two views are mutually exclusive and swap on a full reload, so the
// outgoing view's WebGL/canvas contexts tear down cleanly
const App = () => (readViewMode() === 'arcade' ? <ArcadeView /> : <StandardView />);

export default App;
