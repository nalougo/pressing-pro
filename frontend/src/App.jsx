import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AuthForm from './pages/form';
import Client from './pages/client';
import Authpressing from './pages/preform'
import Pressing from './pages/pressing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/client" element={<Client />} />
        <Route path="/authp" element={<Authpressing />} />
        <Route path="/pressing" element={<Pressing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;