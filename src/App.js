import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; 
import LeaderBoard from './pages/LeaderBoard';
import ReportCard from './pages/ReportCard';
import Chat from './pages/Chat';
import Performance from './pages/Performance';
import Plan from './pages/Plan';
import Support from './pages/Support'; 
import MyStudent from './pages/MyStudent';
import Dashboard from './pages/Dashboard';
import MyTeacher from './pages/MyTeacher';
import ProfileSetting from './pages/ProfileSetting';
import Settings from './pages/Settings';
import SwitchAccount from './pages/SwitchAccount';



function App() {
  return (
    
    <Router>
    <Routes>
      <Route path="/" element={<h1 style={{ textAlign: 'center' }}>Home Page</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/mystudent" element={<MyStudent />} />
      <Route path="/leaderboard" element={<LeaderBoard />} />
      <Route path="/reportcard" element={<ReportCard />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/performance" element={<Performance />} />
      <Route path="/plan" element={<Plan />} />
      <Route path="/support" element={<Support />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/myteacher" element={<MyTeacher />} />
      <Route path="/profilesetting" element={<ProfileSetting/>} />
      <Route path="/settings" element={<Settings/>} />
      <Route path="/switchaccount" element={<SwitchAccount/>} />
      
   


      


    </Routes>
  </Router>
  );
}

export default App;
