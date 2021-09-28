import { createStore } from "redux";

export default createStore(function (state, action) {
  if (state === undefined || 0 || "") {
    return { user_id: "", arg : [] };
  }
  if (action.type === "find_id") {
    return { ...state, user_id: action.user_id };
  }
  if (action.type === "find_pw") {
    return { ...state, user_id: action.user_id };
  }
  if (action.type === "setting_group") {
    return { ...state, group_code: action.group_code };
  }
  if (action.type === 'get_arg'){
    return {...state, arg : action.arg}
  }
});
