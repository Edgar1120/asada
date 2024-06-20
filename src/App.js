import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Usuario/Login';
import Usuario from './components/Usuario/Usuario';
import Sidebar from './components/Sidebar';
import Bodega from './components/Bodega/Bodega';
import Categoria from './components/Categoria/Categoria';
import Articulo from './components/Articulo/Articulo';
import Inventario from './components/Inventario/Inventario';
import MovimientoInve from './components/Movimiento/MovimientoInve';

function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem('login');
    if (loginStatus === 'true') {
      setShowSidebar(true);
    } else {
      navigate('/');
    }

    const handleBeforeUnload = (event) => {
       
      if (event.currentTarget.performance.navigation.type !== 1) {
     
        return;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [navigate]);

  return (
    <>
      {showSidebar && <Sidebar>{children}</Sidebar>}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={
          <AuthWrapper>
            <Routes>
              <Route path="/Usuario" element={<Usuario />} />
              <Route path="/Bodega" element={<Bodega />} />
              <Route path="/Categoria" element={<Categoria />} />
              <Route path="/Articulo" element={<Articulo />} />
              <Route path="/Inventario" element={<Inventario />} />
              <Route path="/Movimiento" element={<MovimientoInve />} />
            </Routes>
          </AuthWrapper>
        } />
      </Routes>
    </Router>
  );
}

export default App;