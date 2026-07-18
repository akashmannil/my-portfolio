import { useState } from 'react';
import NavBar from './components/NavBar';
import ScrollStage from './components/three/ScrollStage';
import TabView from './components/TabView';
import { setStageTab } from './components/three/stagePose';
import useEdgeNav, { markTabNav } from './hooks/useEdgeNav';
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
      <NavBar activeTab={tab} onSelect={selectTab} />
      <ScrollStage />
      <main className="relative z-10">
        <TabView tab={tab} onSelect={selectTab} />
      </main>
    </div>
  );
};

export default App;
