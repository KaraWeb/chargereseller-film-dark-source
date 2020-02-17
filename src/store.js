import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        webserviceDomain: 'https://chr724-app.ir/api',
        requesting: false,
        loadingText: 'در حال بارگذاری...',
        webserviceId: document.getElementById('WebserviceId').value,
        genres:{}
    },
    mutations: {
        setRequestingValue(state, option) {
            state.requesting = option.status;
            state.loadingText = option.title || 'در حال بارگذاری...';
        },
        setGenres(state, genres) {
            genres.map((value)=>{
                state.genres[value.name] = value.title;
            })
        },
    },
    actions: {
        discover: function () {
            return new Promise((resolve, reject) => {
                Axios.get(this.state.webserviceDomain + '/movie/discover', {
                    headers: {}
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        getGenres: function (state) {
            return new Promise((resolve, reject) => {
                Axios.get(this.state.webserviceDomain + '/movie/getGenres', {
                    headers: {}
                })
                    .then(response => {
                        if(response.data.status === 'Success'){
                            state.commit('setGenres',response.data.genres);
                        }
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        getMoviesList: function (state,options) {
            return new Promise((resolve, reject) => {
                Axios.post(this.state.webserviceDomain + '/movie/getList', {trending:options.trending,genre:options.category},{
                    headers: {}
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        search: function (state,options) {
            return new Promise((resolve, reject) => {
                Axios.post(this.state.webserviceDomain + '/movie/search', {query:options.query},{
                    headers: {}
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        getMoviesDetails: function (state,options) {
            return new Promise((resolve, reject) => {
                Axios.post(this.state.webserviceDomain + '/movie/getDetails', {id:options.id,type:options.type},{
                    headers: {}
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        getCart: function (state,options) {
            return new Promise((resolve, reject) => {
                Axios.post(this.state.webserviceDomain + '/movie/getCart', {id:options.id,type:options.type},{
                    headers: {}
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        purchase: function ({commit,state},options) {
            return new Promise((resolve, reject) => {
                Axios.post(this.state.webserviceDomain + '/movie/purchase', {
                    filmId:options.id,
                    filmType:options.type,
                    filmFileId:options.fileId,
                    firstOutputType: "json",
                    secondOutputType: "get",
                    cellphone: options.cellphone,
                    email: "a@gmail.com",
                    redirectUrl: (window.location.protocol !=='https'?'http://':'http://') +window.location.hostname + '/verify',
                    redirectToPage: true,
                    webserviceId:state.webserviceId
                },{
                    headers: {}
                })
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })
            });
        },
        downloadFilm: function (state,options) {
            return new Promise((resolve, reject) => {
                Axios.get(options.link, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/x-www-form-urlencoded'
                    }
                })
                    .then(response => {
                        console.log(response);
                        resolve(response);
                    })
                    .catch(error => {
                        console.log('error:' + error);
                        reject(error);
                    })
            });
        },
        updateRequesting: function (state, option) {
            return new Promise(() => {
                state.commit('setRequestingValue', option);
            });
        }
    },
    getters: {
        isRequesting: function (state) {
            return state.requesting;
        },
        genres: function (state) {
            return state.genres;
        },
        loadingText: function (state) {
            return state.loadingText;
        },
    }
});

export default store;