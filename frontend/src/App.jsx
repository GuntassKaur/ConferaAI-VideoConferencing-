import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const Home = lazy(() => import('./pages/Home.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const MeetingRoom = lazy(() => import('./pages/MeetingRoom.jsx'));

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-white">
      {/* Dynamic Background Blurs */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent opacity-20 blur-[120px] rounded-full animate-float" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-purple-600 opacity-10 blur-[100px] rounded-full animate-float" style={{ animationDelay: '-5s' }} />
      
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Loading Confera AI...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/room/:id" element={<MeetingRoom />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

export default App;
