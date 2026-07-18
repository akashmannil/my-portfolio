import { useState } from 'react';
import NavBar from './components/NavBar';
import ScrollStage from './components/three/ScrollStage';
import TabView from './components/TabView';
import { setStageTab } from './components/three/stagePose';
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
    setStageTab(id);
    setTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

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
