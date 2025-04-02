import logo from './logo.svg';
import './App.css';
import Registro from './registro';
import Login from './login';
import Landing from './Componentes/Landing';
import Imagenes from './imagenes';

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PantallaPrincipal from './Componentes/PantallaPrincipal';
import Catalogousuario from './Componentes/Catalogousuario';
import Catalogovendedor from './Componentes/Catalogovendedor';
import ChatCliente from './Componentes/ChatCliente';
import ChatVendedor from './Componentes/ChatVendedor';
import Reportes from './Componentes/Reportes';
import Perfilcliente from './Componentes/Perfilcliente';
import Perfilvendedor from './Componentes/Perfilvendedor';
import Detallesautocliente from './Componentes/Detallesautocliente';
import Detallesautovendedor from './Componentes/Detallesautovendedor';
import Publicarauto from './Componentes/Publicarauto';
import Comprarauto from './Componentes/Comprarauto';
import Resenascliente from './Componentes/Resenascliente';
import Editarpublicacion from './Componentes/Editarpublicacion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Landing/>}></Route>
      <Route path='/Componentes/Landing' element={<Landing/>}></Route>
      <Route path='/Componentes/PantallaPrincipal' element={<PantallaPrincipal/>}></Route>
      <Route path='/Componentes/Catalogousuario' element={<Catalogousuario/>}></Route>
      <Route path='/Componentes/Catalogovendedor' element={<Catalogovendedor/>}></Route>
      <Route path='/Componentes/ChatCliente' element={<ChatCliente/>}></Route>
      <Route path='/Componentes/ChatVendedor' element={<ChatVendedor/>}></Route>
      <Route path='/Componentes/Reportes' element={<Reportes/>}></Route>
      <Route path='/Componentes/Perfilcliente' element={<Perfilcliente/>}></Route>
      <Route path='/Componentes/Perfilvendedor' element={<Perfilvendedor/>}></Route>
      <Route path='/Componentes/Detallesautocliente' element={<Detallesautocliente/>}></Route>
      <Route path='/Componentes/Detallesautovendedor' element={<Detallesautovendedor/>}></Route>
      <Route path='/Componentes/Publicarauto' element={<Publicarauto/>}></Route>
      <Route path='/Componentes/Comprarauto' element={<Comprarauto/>}></Route>
      <Route path='/Componentes/Resenascliente' element={<Resenascliente/>}></Route>
      <Route path='/Componentes/Editarpublicacion' element={<Editarpublicacion/>}></Route>
        <Route path='/SignUp' element={<Registro/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>
        <Route path='/Imagenes' element={<Imagenes/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
