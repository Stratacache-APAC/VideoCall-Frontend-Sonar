export const DASHBOARD_SET_USERNAME = 'DASHBOARD.SET_USERNAME';
export const DASHBOARD_SET_USERTYPE = 'DASHBOARD.SET_USERTYPE';
export const DASHBOARD_SET_ACTIVE_USERS = 'DASHBOARD.SET_ACTIVE_USERS';
export const DASHBOARD_SET_GROUP_CALL_ROOMS = 'DASHBOARD.SET_GROUP_CALL_ROOMS';

export const setUsername = (username) => {
  return {
    type: DASHBOARD_SET_USERNAME,
    username
  };
}
;


export const setActiveUsers = (activeUsers) => {
  return {
    type: DASHBOARD_SET_ACTIVE_USERS,
    activeUsers
  };
}
;

export const setGroupCalls = (groupCallRooms) => {
  return {
    type: DASHBOARD_SET_GROUP_CALL_ROOMS,
    groupCallRooms
  };
};

// new 

export const usertypeop = 'OPERATOR';
export const usertypemc = 'MACHINE';
export const userreasonmc = {
  a:'Not Able To Find Language',
  b:'Not Able To Find Terminal',
  BUGGY: 'BUGGY',
  LOSTPROPERTY: "LOST PROPERTY",
  WHEELCHAIRSERVICES: "WHEELCHAIR SERVICES",
  OTHERS: "OTHERS",
  छोटीगाड़ीसेवा: "छोटी गाड़ी सेवा",
  व्हीलचेयरसहायता: "व्हील चेयर सहायता",
  खोयाहुआसामान: "खोया हुआ सामान",
  अन्य: "अन्य"
};
export const kiosk = {
  kiosk1: '114',
  kiosk2: '115'
};