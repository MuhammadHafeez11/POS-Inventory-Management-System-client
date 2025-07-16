import axios from "axios";
// import https from "https-browserify"
// const agent = new https.Agent({
//   rejectUnauthorized: false,
//   requestCert: false,
//   agent: false,
// });
const fbrAxiosInstance = axios.create({

    baseURL: 'https://esp.fbr.gov.pk:8244/FBR',
    responseType: 'json',
    withCredentials: true,
    rejectUnauthorized: false,
    requestCert: false,
    agent: false,
    // httpsAgent: agent
  });
  export default fbrAxiosInstance;