<template>
    <div id="app">
        <div class="loading" v-if="this.$store.getters.isRequesting">
            <img src="../../assets/img/loading.svg" alt="در حال بارگذاری"/>
            <h4 class="text-darkblue">
                {{this.$store.getters.loadingText}}
            </h4>
        </div>
        <div class="container">
            <nav class="mobile-nav-wrap" role="navigation">
                <ul class="mobile-header-nav" v-if="this.$store.getters.genres.length !== 0" v-bind:class="{'mobile-header-nav-open':toggledMenu}">
                    <li v-for="(genre,index) in this.$store.getters.genres" :key="index">
                        <router-link :to="'/list/'+index">
                            {{genre}}
                        </router-link>
                    </li>
                </ul>
            </nav>
            <div class="header">
                <div class="header-logo">
                    <router-link tag="a" to="/"><img src="../../assets/img/logo.png"/></router-link>
                    <router-link tag="a" to="/"><h1>{{title}}</h1></router-link>
                </div>
                <a class="mobile-menu-toggle js-toggle-menu hamburger-menu" href="#" @click="toggleMenu()"  v-bind:class="{open:toggledMenu}">
                    <span class="menu-item"></span>
                    <span class="menu-item"></span>
                    <span class="menu-item"></span>
                </a>
            </div>
            <div class="main-section">
                <div class="side-bar">
                    <h3>دسته بندی ها</h3>
                    <ul v-if="this.$store.getters.genres.length !== 0">
                        <li v-for="(genre,index) in this.$store.getters.genres" :key="index">
                            <router-link :to="'/list/'+index">
                                {{genre}}
                            </router-link>
                        </li>
                    </ul>
                </div>
                <router-view></router-view>
            </div>
            <div class="footer">
                <div>
                    <h3>ما را دنبال کنید</h3>
                    <ul class="social-media">
                        <li><a :href="social.instagram" class="fab fa-instagram"></a></li>
                        <li><a :href="social.twitter" class="fab fa-twitter"></a></li>
                        <li><a :href="social.telegram" class="fab fa-telegram"></a></li>
                    </ul>
                </div>
                <div class="col-md-3 col-sm-12">
                    <h3>پشتیبانی</h3>
                    <p class="text-grey">
                        از شنبه تا چهارشنبه ساعت 9 تا 17
                        شماره پشتیبانی
                        <a href="#">88019574-021</a>
                        در خدمت شماست.
                    </p>
                </div>
                <div>
                    <h3>کپی رایت</h3>
                    <p class="text-grey">
                        تمامی حقوق این وب سایت متعلق به
                        <router-link to="/">{{title}}</router-link>
                        می باشد.
                    </p>
                </div>
            </div>
            <div class="circle-blue"></div>
            <div class="circle-red"></div>
        </div>
    </div>
</template>
<style src="../../assets/css/style.css"></style>
<style src="../../assets/css/iransans/fontiran.css"></style>
<style src="../../assets/css/font-awesome.css"></style>
<script>
    export default {
        data() {
            return {
                toggledMenu: false,
                title:'',
                social: {
                    "instagram":"#",
                    "telegram":"#",
                    "twitter":"#",
                },
            }
        },
        mounted() {
            this.toggledMenu = false;
            this.initialize();
            this.$store.dispatch('updateRequesting', {status:true});
            this.$store.dispatch('getGenres')
                .then(() => {
                    this.$store.dispatch('updateRequesting', {status:false});
                })
                .catch(() => {
                    this.$store.dispatch('updateRequesting', {status:false});
                })
        },
        methods: {
            toggleMenu: function () {
                this.toggledMenu = ! this.toggledMenu;
            },
            initialize: function(){
                this.title = document.getElementById('siteTitle').value;
                document.title = document.getElementById('siteTitle').value + '-' + document.getElementById('title').value;
                document.querySelector('meta[name="description"]').setAttribute("content", document.getElementById('description').value);
                document.querySelector('meta[name="keywords"]').setAttribute("content", document.getElementById('keywords').value);
                this.social.instagram = document.getElementById('instagram').value;
                this.social.telegram = document.getElementById('telegram').value;
                this.social.twitter = document.getElementById('twitter').value;
            }
        },
        watch: {
            $route: function () {
                this.toggledMenu = false;
                this.initialize();
            },
        }
    }
</script>