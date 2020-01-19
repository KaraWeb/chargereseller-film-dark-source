<template>
    <div class="content">
        <flickity  ref="flickity" v-if="topMovies !== null" :options="flickityOptions" class="slider">
            <div v-for="movie in topMovies" class="cell" :key="movie.id">
                <div class="slider-bg">
                    <div class="overlay"></div>
                    <img :src="movie.backDrop"/>
                </div>
                <div class="slider-content">
                    <div class="slider-title">
                        <h1>{{movie.title}}</h1>
                        <router-link tag="button" :to="'/view/'+movie.type+'/'+movie.id" class="btn btn-secondary col-md-12">
                            <h2>تماشا کنید</h2>
                        </router-link>
                    </div>
                    <div class="slider-footer">
                        <h3>ژانر</h3>
                        <h4>
                            <span v-for="(genre,index) in movie.genres.split(',')" :key="genre">
                                {{genres[genre.toLowerCase()]}}
                                <span v-if="index+1 !== movie.genres.split(',').length">,</span>
                            </span>
                        </h4>
                    </div>
                </div>
            </div>
        </flickity>
        <div class="category-list" v-if="categoryList !==null">
            <h2>بهترین های هر ژانر</h2>
            <div class="genre" v-for="(category,index) in categoryList" :key="index">
                <div class="genre-title">
                    <img :src="require('../../assets/img/'+category.genre.toLowerCase()+'.png')" class="genre-icon"/>
                    <h3>
                        {{genres[category.genre.toLowerCase()]}}
                    </h3>
                    <router-link style="margin-right: auto" :to="'/list/'+category.genre.toLowerCase()"><h6>مشاهده همه ...</h6></router-link>
                </div>
                <carousel :nav="true" :autoplay="true" :margin="15" :rtl="true" :items="4" class="slide">
                    <router-link tag="div" :to="'/view/'+movie.type+'/'+movie.id" class="item" v-for="(movie,index) in category.list" :key="index">
                        <div class="slider-bg">
                            <div class="overlay"></div>
                            <img :src="movie.poster"/>
                        </div>
                        <h3 class="slide-title">{{movie.title}}</h3>
                    </router-link>
                </carousel>
            </div>
        </div>
    </div>
</template>
<script>
    import carousel from 'vue-owl-carousel';
    import flickity from 'vue-flickity';

    export default {
        components: {
            flickity,
            carousel
        },
        data() {
            return {
                flickityOptions: {
                    autoPlay: 5000,
                    prevNextButtons: false,
                    pageDots: true,
                    ImagesLoaded: true,
                    adaptiveHeight:true
                    // any options from Flickity can be used
                },
                topMovies:null,
                categoryList:null,
                genres:this.$store.getters.genres
            }
        },
        methods: {
            discover() {
                this.$store.dispatch('discover')
                    .then(response => {
                        this.$store.dispatch('updateRequesting', {status:false});
                        if(response.data.status !== 'Success'){
                            this.$swal('خطا', response.data.errorMessage, 'error');
                        }
                        this.topMovies = response.data.discover.topMovies;
                        this.categoryList = response.data.discover.categoriesList;
                    })
                    .catch(error => {
                        this.$store.dispatch('updateRequesting', {status:false});
                        console.log(error);
                    })
            }
        },
        mounted() {
            this.$store.dispatch('updateRequesting', {status:true});
            this.discover();
        }
    }
</script>
