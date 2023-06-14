import './App.css';
import { Route } from "react-router-dom";
import LandingPage from './components/LandingPage/LandingPage';
import TicketForm from './components/TicketForm/TicketForm'
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import OpTickets from './components/OpTickets/OpTickets';
import Computers from './components/Computers/Computers';
import ComputerDetail from './components/ComputerDetail/ComputerDetail';
import CreateAccount from './components/CreateAccount/CreateAccount';
import NewUser from './components/NewUser/NewUser';
import ResetPassword from './components/ResetPassword/ResetPassword';
import NewPassword from './components/NewPassword/NewPassword';
import Recomendaciones from './components/Recomendaciones/Recomendaciones';
import Soporte from './components/Soporte/Soporte';
import Manuales from './components/Manuales/Manuales';
import EditorDashboard from './components/EditorDashboard/EditorDashboard';
import NuevaRecomendacion from './components/EditorDashboard/Recomendaciones/NuevaRecomendacion';
import ModificarRecomendacion from './components/EditorDashboard/Recomendaciones/ModificarRecomendacion';

function App() {
  return (
    <div className="App">
      <Route exact path='/'>
        <LandingPage/>
      </Route>
      <Route exact path='/createaccount'>
        <CreateAccount/>
      </Route>
      <Route exact path='/newuser'>
        <NewUser/>
      </Route>
      <Route exact path='/resetpassword'>
        <ResetPassword/>
      </Route>
      <Route exact path='/newpassword'>
        <NewPassword/>
      </Route>
      <Route exact path='/recomendaciones'>
        <Recomendaciones/>
      </Route>
      <Route exact path='/recomendaciones/crear'>
        <NuevaRecomendacion/>
      </Route>
      <Route exact path='/recomendaciones/modificar/:id'>
        <ModificarRecomendacion/>
      </Route>
      <Route exact path='/soporte'>
        <Soporte/>
      </Route>
      <Route exact path='/manuales'>
        <Manuales/>
      </Route>
      <Route exact path='/ticket'>
        <TicketForm/>
      </Route>
      <Route exact path='/editor'>
        <EditorDashboard/>
      </Route>
      <Route exact path='/admin'>
        <AdminDashboard/>
      </Route>
      <Route exact path='/admin/optickets'>
        <OpTickets/>
      </Route>
      <Route exact path='/admin/computers/:id'>
        <ComputerDetail/>
      </Route>
      <Route exact path='/admin/computers'>
        <Computers/>
      </Route>
      
    </div>
  );
}

export default App;
