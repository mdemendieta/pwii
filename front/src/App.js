import logo from './logo.svg';
import './App.css';
import Ejemplo from './Ejemplo';
import Registro from './registro';
import Login from './login';
import Landing from './Componentes/Landing';
import Imagenes from './imagenes';
import Modificar from './Modificar';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path='/SignUp' element={<Registro/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>
        <Route path='/Imagenes' element={<Imagenes/>}></Route>
        <Route path='/Modificar' element={<Modificar/>}></Route>
        <Route path='/' element={<Landing/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
