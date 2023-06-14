import axios from "axios";
export const GET_ALL_OPTICKETS = "GET_ALL_OPTICKETS";
export const DELETE_OPTICKETS = "DELETE_OPTICKETS";
export const GET_ALL_COMPUTERS = "GET_ALL_COMPUTERS";
export const GET_COMPUTER = "GET_COMPUTER";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const GET_USER_INFO = "GET_USER_INFO";
export const LOG_OUT = "LOG_OUT";

export function createTicket(arg) {
    return async function () {
      try {
         await axios.post("https://sigesback-production.up.railway.app/optickets", { 
          name: arg.name,
          client: arg.client,
          detail: arg.detail,
          }); 
          alert("Ticket creado");
      } catch (error) {
        alert(error.response.data)
      }
    };
  }

  export function getAllOpTickets() {
    return async function (dispatch) {
      var allOpTickets = await axios.get(`https://sigesback-production.up.railway.app/optickets`);
      return dispatch({
        type: GET_ALL_OPTICKETS,
        payload: allOpTickets.data,
      });
    };
  }

  export function deleteOpTickets(id) {
    return async function (dispatch) {
      await axios.delete(`https://sigesback-production.up.railway.app/optickets?id=${id}`);
      return dispatch({
        type: DELETE_OPTICKETS,
        payload: id,
      });
    };
  }

  export function getAllComputers() {
    return async function (dispatch) {
      var allComputers = await axios.get(`https://sigesback-production.up.railway.app/computers`);
      return dispatch({
        type: GET_ALL_COMPUTERS,
        payload: allComputers.data,
      });
    };
  }

  export function getComputer(id) {
    return async function (dispatch) {
      const computer = await axios.get(`https://sigesback-production.up.railway.app/computers/${id}`);
      return dispatch({
        type: GET_COMPUTER,
        payload: computer.data,
      });
    };
  }

  export function clearDetail(){
    return{
      type: "CLEAR_DETAIL",
    }
  }

  export function editComputer(id,input) {
    return async function () {
      await axios.put(`https://sigesback-production.up.railway.app/computers/${id}`,input);
    };
  }

  export function login(input) {
    return async function (dispatch) {
      try {
        const resultado = await axios.post("https://sigesback-production.up.railway.app/login", input); 
        if (resultado.data.token) {
          dispatch({ type: LOGIN_SUCCESS , payload: resultado.data});
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    };
  }

  export function findUser(id) {
    return async function (dispatch) {
      try {
        const resultado = await axios.get(`https://sigesback-production.up.railway.app/users?id=${id}`); 
        return dispatch({
          type: GET_USER_INFO,
          payload: resultado.data[0] ? resultado.data[0] : {},
        });
      } catch (error) {
        alert(error.response.data.message)
      }
    };
  }

  export function createWebUser(data) {
    return async function () {
      try {
      await axios.post(`https://sigesback-production.up.railway.app/webusers`,data); 

      } catch (error) {
        alert(error.response.data.message)
      }
    };
  }

  export function activateUser(email,role){
    return async function () {
      try {
      await axios.put(`https://sigesback-production.up.railway.app/webusers`,{
        email,
        role
      }); 
        alert("Usuario activado con exito")
      } catch (error) {
        alert(error.response.data.message)
      }
    };
  }

  export function resetPassword(email){
    return async function () {
      try {
      const userInfo = await axios.get(`https://sigesback-production.up.railway.app/webusers?email=${email}&reset=true`); 
      alert(`Correo enviado a ${userInfo.data.email} para recuperar la contraseña`)
      } catch (error) {
        alert(error.response.data.message)
      }
    };
  }

  export function changePassword (email,password){
    return async function () {
      try {
        await axios.put(`https://sigesback-production.up.railway.app/webusers`,{
          email,
          password
        }); 
      alert(`Contraseña cambiada!`)
      } catch (error) {
        alert(error.response.data.message)
      }
    };
  }

  export function loginWithToken(token) {
    return async function (dispatch) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
  
        const resultado = await axios.get("https://sigesback-production.up.railway.app/login", config);
        console.log(resultado)
        if (resultado.data.token) {
          console.log("hago el dispatch")
          dispatch({ type: LOGIN_SUCCESS, payload: resultado.data });
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    };
  }

  export function logOut() {
    return async function (dispatch) {
      try {
          dispatch({ type: LOG_OUT });
      } catch (error) {
        alert(error.response.data.message);
      }
    };
  }

  export function getRecommendations() {
    return async function (dispatch) {
      try {
          dispatch({ type: LOG_OUT });
      } catch (error) {
        alert(error.response.data.message);
      }
    };
  }