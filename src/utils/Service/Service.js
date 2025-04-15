// const SERVER = 'https://web-rtc-backend-test.herokuapp.com';
import axios from 'axios';
const SERVER = process.env.REACT_APP_SERVER;

export const getApi = (api) => {
    return {
        url: SERVER + '/' + api,
    };
};

export const fetchData = async (api) => {
    // console.log("calllllled");
    const res = await fetch(SERVER + '/' + api)
    const json = await res.json();
    // console.log(json);
    return json
}

export const fetchPostData = async (api, bodyParam) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyParam)
    };
    const res = await fetch(SERVER + '/' + api, requestOptions)
    const json = await res.json();
    console.log("resjson", json);
    return json
}

export const fetchLoginPostData = async (api, bodyParam) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyParam)
    };
    const res = await fetch(SERVER + '/' + api, requestOptions);
    console.log('checking userData = == 111 ', res);

    return res;
}

export const fetchDeleteData = async (api, bodyParam) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyParam)
    };
    console.log(requestOptions);
    const res = await fetch(SERVER + '/' + api, requestOptions);
    return res;
}


export const pushAuditsData = async (bodyParam) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyParam)
    };
    const res = await fetch(SERVER + '/createAuditReport', requestOptions);
    return res;
}

export const updateAgentCallStatus = async (userId, userStatus, testUserStatus) => {
    try {
        const currentEpochTime = Math.floor(Date.now() / 1000);
        // Construct the URL with the epoch time as a query parameter
        const url = `${process.env.REACT_APP_SERVER}/updateAgentCallStatus?currentEpochTime=${currentEpochTime}`;

        const response = await axios.post(url, {
            status: userStatus,
            userId: userId,
            testUserStatus: testUserStatus,
        });
        console.log('Updated status of user call', response.data);
    } catch (e) {
        console.error(e);
    }
};