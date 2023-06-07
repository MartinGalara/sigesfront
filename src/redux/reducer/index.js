import {
  GET_ALL_OPTICKETS,
  DELETE_OPTICKETS,
  GET_ALL_COMPUTERS,
  GET_COMPUTER,
  LOGIN_SUCCESS,
  GET_USER_INFO,
  LOG_OUT
} from "../actions"; 
 
 const initialState = {
    optickets: [],
    computers: [],
    computerDetail: {},
    userEmail: "",
    userRole: "",
    userId: "",
    userActive: "",
    token: "",
    userInfo:{
      empty: true,
    }
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {

      case GET_ALL_OPTICKETS:
      const auxiliar = [];
      action.payload.map(el => auxiliar.push(el))
      return {
        ...state,
        optickets: auxiliar,
      };

      case DELETE_OPTICKETS:
      return {
        ...state,
        optickets: state.optickets.filter((el) => el.id !== action.payload),
      };

      case GET_ALL_COMPUTERS:
      const aux = [];
      action.payload.map(el => aux.push(el))
      return {
        ...state,
        computers: aux,
      };

      case GET_COMPUTER:
        return {
          ...state,
          computerDetail: action.payload,
        };

      case "CLEAR_DETAIL":
        return{
            ...state,
            computerDetail:{},
        }

      case LOGIN_SUCCESS:
        return {
          ...state,
          userEmail: action.payload.email,
          userRole: action.payload.role,
          userId: action.payload.userId,
          userActive: action.payload.active,
          token: action.payload.token
        };

      case GET_USER_INFO:
        return{
          ...state,
          userInfo: action.payload
        }

      case LOG_OUT:
        return{
          ...state,
          userEmail: "",
          userRole: "",
          userId: "",
          userActive: "",
          token:""
          }

      default:
      return state;
      
    }
  };
  
  export default rootReducer;
  