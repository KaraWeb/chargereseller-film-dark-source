<template>
    <div class="content">
        <h2>
            ژانر:
            {{this.$store.getters.genres[this.$route.params.category]}}
        </h2>
        <div class="film-sorting">
            <p>مرتب سازی بر اساس:</p>
            <div class="film-sorting-items">
                <router-link tag="div" :to="this.$route.path + '?sort=2'" class="film-sort-item" v-bind:class="{active:trending == 2}">جدیدترین</router-link>
                <router-link tag="div" :to="this.$route.path + '?sort=3'" class="film-sort-item" v-bind:class="{active:trending == 3}">محبوب ترین</router-link>
                <router-link tag="div" :to="this.$route.path + '?sort=4'" class="film-sort-item" v-bind:class="{active:trending == 4}">امتیاز</router-link>
            </div>
        </div>
        <div class="film-list" v-if="movies !== null">
            <router-link tag="div"  :to="'/view/'+movie.type+'/'+movie.id" class="film" v-for="(movie,index) in movies" :key="index">
                <img class="film-image" :src="movie.poster">
                <img class="film-image-responsive" style="display: none;" :src="movie.backDrop">
                <div class="film-content">
                    <div class="film-content-header">
                        <p class="film-name">{{movie.title}}</p>
                        <p class="film-score">{{movie.rate}}</p>
                        <div class="clear"></div>
                        <p class="film-genre">
                            <span v-for="(genre,index) in movie.genres.split(',')" :key="genre">
                                {{genres[genre.toLowerCase()]}}
                                <span v-if="index+1 !== movie.genres.split(',').length">,</span>
                            </span>
                        </p>
                    </div>
                    <div class="film-description">
                        <p>{{movie.overview}}</p>
                    </div>
                </div>
            </router-link>
        </div>
        <div v-else style="margin-top: 50px;text-align: center">
            هیچ فیلمی یافت نشد.
        </div>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                movies: null,
                trending: this.$route.query.sort || 2,
                genres: this.$store.getters.genres
            }
        },
        methods: {
            getMoviesList: function () {
                this.$store.dispatch('updateRequesting', {status:true});
                this.$store.dispatch('getMoviesList', {category:this.$route.params.category,trending:this.trending})
                    .then(response => {
                        this.$store.dispatch('updateRequesting', {status:false});
                        if (response.data.status !== 'Success') {
                            this.$swal('خطا', response.data.errorMessage, 'error');
                        }
                        this.movies = null;
                        this.movies = response.data.movies.length === 0 ?null:response.data.movies;
                        console.log(this.movies);
                    })
                    .catch(error => {
                        this.$store.dispatch('updateRequesting', {status:false});
                        console.log(error)
                    })
            }
        },
        mounted() {
            this.getMoviesList();
        },
        watch: {
            $route: function () {
                this.trending = this.$route.query.sort || 2;
                this.getMoviesList();
            },
        }
    }
</script>
