import axios from "axios";

export const axiosInstance = axios.create({});

// here url is the endpoint that we want to hit eg./course/showAllCategories
// here method are: post,get,put,delete 
// here bodyData is the data that we want to send to the server  eg. {name:'xyz',description:'xyz'}
// here params is the query string that we want to send to the server eg. {id:1}
// here headers are the headers that we want to send to the server eg. {Authorization

export const apiConnector = async (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData? bodyData : null,
        headers: headers? headers : null,
        params: params? params : null
    })
};