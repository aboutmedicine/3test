import * as axios from 'axios'

const url = `api`;
const config = {
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
};

class HttpService {

    static getPosts(params = config) {
        return new Promise(async (resolve, rej) => {

            try {
                const res = await axios.get(`${url}/posts`, params);
                const data = res.data;

                resolve(data);

            } catch (err) {
                rej(err);
            }

        })
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
        console.log(params);
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
}

export { HttpService }