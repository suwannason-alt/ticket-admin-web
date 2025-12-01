import axios, { AxiosInstance } from 'axios';
import getENV from '@/app/env';
import Cookies from 'js-cookie';

const TOKEN_COOKIE_KEY = 'token';
const REFRESH_COKIE_KEY = 'refreshToken'
const REFRESH_TOKEN_PATH = 'credential/refresh'

let cachedEnv: any = null;
let envPromise: any = null;

/**
 * ฟังก์ชันสำหรับโหลด ENV เพียงครั้งเดียว
 * @returns {Promise<{userAPI: string, credentialAPI: string}>}
 */
async function loadEnvOnce() {
    if (cachedEnv) {
        return cachedEnv;
    }
    if (envPromise) {
        return envPromise;
    }

    envPromise = getENV().then(env => {
        cachedEnv = env;
        envPromise = null;
        return env;
    }).catch(error => {
        envPromise = null;
        throw error;
    });

    return envPromise;
}
// ------------------------------------

let cachedApiInstance: AxiosInstance;

export default async function authenticated() {
    if (cachedApiInstance) {
        return cachedApiInstance;
    }

    const env = await loadEnvOnce(); 
    const { userAPI, credentialAPI } = env;

    const api = axios.create()

    api.interceptors.request.use(async (config) => {
        config.baseURL = userAPI; 
        
        const token = Cookies.get(TOKEN_COOKIE_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    async function refreshToken() {
        try {
            const token = Cookies.get(TOKEN_COOKIE_KEY);
            const refreshTokenResponse = await axios.patch(`${credentialAPI}/api/v1/credential/refresh`, {
                refreshToken: Cookies.get(REFRESH_COKIE_KEY)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return refreshTokenResponse.data;
        } catch (error) {
            Cookies.remove(TOKEN_COOKIE_KEY);
            Cookies.remove(REFRESH_COKIE_KEY);
            if (typeof window !== 'undefined') {
                 window.location.href = '/'
            }
            throw error;
        }
    }

    api.interceptors.response.use((response) => {
        return response
    }, async (error) => {

        const originalRequest = error.config;
        // console.log(error.response?.status === 401 && originalRequest.url.indexOf(REFRESH_TOKEN_PATH) !== -1);
        console.log({ originalRequest: originalRequest.url, REFRESH_TOKEN_PATH, idxOf: originalRequest.url.indexOf(REFRESH_TOKEN_PATH) });
        console.log(error.response?.status);
        
        
        if (error.response?.status === 401 && originalRequest.url.indexOf(REFRESH_TOKEN_PATH) === -1) {
            console.log('call refresh')
            // const newAccessTokenData = await refreshToken();
            
            // if (newAccessTokenData?.data?.token) {
            //     const newToken = newAccessTokenData.data.token;
                
            //     Cookies.set(TOKEN_COOKIE_KEY, newToken);
            //     Cookies.set(REFRESH_COKIE_KEY, newAccessTokenData.data.refreshToken);
            //     originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                
            //     return api(originalRequest)
            // }
        }

        return Promise.reject(error)
    })

    cachedApiInstance = api;

    return api
}