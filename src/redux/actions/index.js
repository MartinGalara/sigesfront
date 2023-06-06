import axios from "axios";
export const GET_ALL_OPTICKETS = "GET_ALL_OPTICKETS";
export const DELETE_OPTICKETS = "DELETE_OPTICKETS";
export const GET_ALL_COMPUTERS = "GET_ALL_COMPUTERS";
export const GET_COMPUTER = "GET_COMPUTER";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const GET_USER_INFO = "GET_USER_INFO";

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
        if (resultado.data.message === "Inicio de sesión exitoso") {
          dispatch({ type: LOGIN_SUCCESS , payload: input.email});
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

  export function resetPassword(username){
    return async function () {
      try {
      const userInfo = await axios.get(`https://sigesback-production.up.railway.app/webusers?username=${username}&reset=true`); 
      console.log(userInfo) 
      alert(`Correo enviado a ${userInfo.data.email} para recuperar la contraseña`)
      } catch (error) {
        alert(error.response.data.message)
      }
    };
  }

  export function changePassword (username,password){
    return async function () {
      try {
        await axios.put(`https://sigesback-production.up.railway.app/webusers`,{
          username,
          password
        }); 
      alert(`Contraseña cambiada!`)
      } catch (error) {
        alert(error.response.data.message)
      }
    };
  }