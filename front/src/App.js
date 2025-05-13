import logo from './logo.svg';
import './App.css';
import Registro from './registro';
import Login from './login';
import Landing from './Landing';
import Imagenes from './imagenes';

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PantallaPrincipal from './PantallaPrincipal';
import Catalogousuario from './Catalogousuario';
import Catalogovendedor from './Catalogovendedor';
import ChatCliente from './ChatCliente';
import ChatVendedor from './ChatVendedor';
import Reportes from './Reportes';
import Perfilcliente from './Perfilcliente';
import Perfilvendedor from './Perfilvendedor';
import Detallesautocliente from './Detallesautocliente';
import Detallesautovendedor from './Detallesautovendedor';
import Publicarauto from './Publicarauto';
import Comprarauto from './Comprarauto';
import Resenascliente from './Resenascliente';
import Editarpublicacion from './Editarpublicacion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Landing/>}></Route>
      <Route path='/Landing' element={<Landing/>}></Route>
      <Route path='/PantallaPrincipal' element={<PantallaPrincipal/>}></Route>
      <Route path='/Catalogousuario' element={<Catalogousuario/>}></Route>
      <Route path='/Catalogovendedor' element={<Catalogovendedor/>}></Route>
      <Route path='/ChatCliente' element={<ChatCliente/>}></Route>
      <Route path='/ChatVendedor' element={<ChatVendedor/>}></Route>
      <Route path='/Reportes' element={<Reportes/>}></Route>
      <Route path='/Perfilcliente' element={<Perfilcliente/>}></Route>
      <Route path='/Perfilvendedor' element={<Perfilvendedor/>}></Route>
      <Route path='/Detallesautocliente' element={<Detallesautocliente/>}></Route>
      <Route path='/Detallesautovendedor' element={<Detallesautovendedor/>}></Route>
      <Route path='/Publicarauto' element={<Publicarauto/>}></Route>
      <Route path='/Comprarauto' element={<Comprarauto/>}></Route>
      <Route path='/Resenascliente' element={<Resenascliente/>}></Route>
      <Route path='/Editarpublicacion' element={<Editarpublicacion/>}></Route>
        <Route path='/SignUp' element={<Registro/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>
        <Route path='/Imagenes' element={<Imagenes/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
