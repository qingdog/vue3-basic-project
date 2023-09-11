const axios = require('axios');

// 导入 env
require('dotenv').config();
const chatApi = process.env.ENV_CHAT_API;
const chatApiSecret = process.env.ENV_CHAT_API_SECRET;

const _axios = axios.create({
    baseURL: chatApi,
    withCredentials: true,
    timeout: 5000
});

// 9. 拦截器
_axios.interceptors.request.use(
    function (config) {
        // 比如在这里添加统一的 headers
        config.headers = {
            Authorization: 'Bearer ' + chatApiSecret
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

_axios.interceptors.response.use(
    function (response) {
        // 2xx 范围内走这里
        return response;
    },
    function (error) {
        if (error.response?.status === 400) {
            console.log('请求参数不正确');
            return Promise.resolve(400);
        } else if (error.response?.status === 401) {
            console.log('跳转至登录页面');
            return Promise.resolve(401);
        } else if (error.response?.status === 404) {
            console.log('资源未找到');
            return Promise.resolve(404);
        }
        // 超出 2xx, 比如 4xx, 5xx 走这里
        return Promise.reject(error);
    }
);

module.exports = _axios;