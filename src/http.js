import * as axios from 'axios'

const url = `api`;
const config = {
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
};

class HttpService {

    static async getPosts(params = config) {
        // return new Promise(async (resolve, rej) => {

        //     try {
        //         const res = await axios.get(`${url}/posts`, params);
        //         const data = res.data;

        //         resolve(data);

        //     } catch (err) {
        //         rej(err);
        //     }


        // })
        const res = await axios.get(`${url}/posts`, params);
        return res.data;
    }

    static getCategories() {
        return new Promise(async (resolve, rej) => {

            try {
                const res = await axios.get(`${url}/categories`, config);
                const data = res.data;

                resolve(data);

            } catch (err) {
                rej(err);
            }

        })
    }

    static getArticlesIn(params) {
        // console.log(params);
        return new Promise(async (resolve, rej) => {
            try {
                const res = await axios.get(`${url}/articles`, { params });
                const data = res.data;
                resolve(data);

            } catch (err) {
                console.error(err.response.data.message);
                rej(err);
            }

        })
    }

    static createPost(data) {
        return axios.post(`${url}/posts`, data);
    }

    // logIn || signUp
    static auth(action, credentials) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(`${url}/auth/${action}`, credentials, config);
                resolve(res.data);
            } catch (err) {
                reject(err.response.data.filter(x => x.message)[0]);
            }
        });
    }

    static logOut() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}/auth/logout`);
                resolve(res.data);
            } catch (err) {
                reject(err.response);
            }
        });
    }

    static getUser() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}/auth/user`, config);
                resolve(res.data);
            } catch (err) {
                reject(err.response);
            }
        });
    }

    static articleCreate(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(`${url}/articles/create`, data, config);
                resolve(res.data);
            } catch (err) {
                console.log(err.response);
                reject(err.response.data.message);
            }
        })
    }
    static articleDelete(data) {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(`${url}/articles/delete`, data, config);
                resolve(res.data);
            } catch (err) {
                console.log(err.response);
                reject(err.response.data.message);
            }
        })
    }
    static articleEdit(data) {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(`${url}/articles/edit`, data, config);
                resolve(res.data);
            } catch (err) {
                console.log(err.response);
                reject(err.response.data.message);
            }
        })
    }

    static searchArticles(query) {
        // console.log(query);
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}/articles/search?text=${query}`, config);
                resolve(res.data);
            } catch (err) {
                console.log(err.response);
                reject(err.response.data.message);
            }
        })
    }
}

export { HttpService }