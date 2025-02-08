import React, { useState } from 'react';
import Layout from './components/Layout';
import WorldClock from './components/WorldClock';
import Alarm from './components/Alarm';
import Timer from './components/Timer';

function App() {
  const [activeTab, setActiveTab] = useState('worldclock');

  const renderContent = () => {
    switch (activeTab) {
      case 'worldclock':
        return <WorldClock />;
      case 'alarms':
        return <Alarm />;
      case 'timer':
        return <Timer />;
      case 'stopwatch':
        return <div>Stopwatch Coming Soon</div>;
      default:
        return <WorldClock />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;