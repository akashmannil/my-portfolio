import { useState } from 'react';
import NavBar from './components/NavBar';
import ScrollStage from './components/three/ScrollStage';
import TabView from './components/TabView';
import TabProgress from './components/TabProgress';
import ProjectHotspot from './components/ProjectHotspot';
import AmbientSky from './components/AmbientSky';
import { setStageTab } from './components/three/stagePose';
import useEdgeNav, { markTabNav } from './hooks/useEdgeNav';
import useAmbient from './hooks/useAmbient';
import { tabs } from './constants';

const initialTab = () => {
  const id = window.location.hash.replace('#', '');
  return tabs.some((t) => t.id === id) ? id : 'home';
};

const App = () => {
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
      />
      <ScrollStage activeTab={tab} ambient={ambient} ambientOn={ambientOn} />
      <AmbientSky enabled={ambientOn} ambient={ambient} />
      <main className="relative z-10">
        <TabView tab={tab} onSelect={selectTab} />
      </main>
      <TabProgress activeTab={tab} onSelect={selectTab} />
      <ProjectHotspot activeTab={tab} />
    </div>
  );
};

export default App;
