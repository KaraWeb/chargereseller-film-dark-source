<template>
    <div class="content">
        <div class="dialog" id="InternetPackageDialog" v-if="showCart">
            <div class="dialog-box dialog-small">
                <h2 class="fa fa fa-window-close text-grey pointer" @click="showCart=false"
                    style="margin-left: auto"></h2>
                <h3 class="text-grey dialog-heading">انتخاب کیفیت فیلم و پرداخت</h3>
                <ul class="dialog-list-header">
                    <li>حجم</li>
                    <li>کیفیت</li>
                    <li>قیمت</li>
                </ul>
                <ul class="dialog-list">
                    <li v-for="(item,index) in cart" v-bind:class="{active:fileId === item.id}"
                        @click="setFileId(item.id)" :key="index">
                        <span>{{item.size}}</span>
                        <span>{{item.quality}}</span>
                        <span>{{item.amount.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}} تومان</span>
                    </li>
                </ul>
                <div class="custom-input" style="margin: 10px auto;">
                    <input v-model="cellphone" @input="changeCellphone()" class="text-grey" type="text"
                           placeholder="شماره موبایل خود را وارد کنید..."><i
                        class="fa fa-mobile text-grey"></i>
                </div>
                <button class="btn btn-success" @click="purchase()" v-bind:class="{disabled:fileId === null}"
                        v-bind:disabled="fileId === null">پرداخت
                </button>
            </div>
        </div>
        <div class="film-detail" v-if="movie !== null">
            <img class="film-detail-image" :src="movie.poster">
            <img class="film-detail-image-responsive" style="display: none;" :src="movie.backDrop">
            <div class="film-detail-content">
                <div class="film-detail-content-header">
                    <p class="film-detail-name">{{movie.title}}</p>
                    <p class="film-detail-score">{{movie.rate}}</p>
                    <div class="clear"></div>
                </div>
                <div class="film-detail-description">
                    <p class="film-detail-title">درباره فیلم:</p>
                    <p>{{movie.overview}}</p>
                </div>
                <div class="film-detail-actors">
                    <p class="film-detail-title" v-if="movie.casts.length !== 0">بازیگران:</p>
                    <p>
                        <span v-for="(cast,index) in movie.casts" :key="index">
                            {{cast.nameFa}}
                            <span v-if="index+1 !== movie.casts.length">،</span>
                        </span>
                    </p>
                </div>
                <div class="film-detail-info">
                    <div class="film-detail-year">
                        <p class="film-detail-title">سال تولید:</p>
                        <p>{{movie.year}}</p>
                    </div>
                    <div class="film-detail-director">
                        <p class="film-detail-title">کارگردان:</p>
                        <p>{{movie.director}}</p>
                    </div>
                </div>
                <div class="film-seasons" v-if="movie.type==='series'">
                    <h4 v-if="movie.type==='series'">انتخاب فصل و قسمت سریال</h4>
                    <div class="film-seasons-select">
                        <div class="select col-md-4">
                            <select v-model="selectedSeason">
                                <option v-for="(season,index) in movie.seasons"
                                        v-bind:selected="selectedSeason === index" :value="index" :key="index">
                                    فصل
                                    {{index}}
                                </option>
                            </select>
                            <i class="fa fa-caret-down"></i>
                        </div>
                        <div class="select col-md-4">
                            <select v-model="selectedEpisode">
                                <option v-for="(episode,index) in movie.seasons[selectedSeason]"
                                        v-bind:selected="selectedEpisode === index+1" :value="index+1" :key="index+1">
                                    {{episode.nameFa}}
                                </option>
                            </select>
                            <i class="fa fa-caret-down"></i>
                        </div>
                    </div>
                </div>
                <div class="film-detail-download-button" @click="getCart">همین حالا تماشا کنید</div>
            </div>
        </div>
        <div v-else>
            هیچ فیلمی پیدا نشد.
        </div>
    </div>

</template>
<script>
    export default {
        data() {
            return {
                movie: null,
                cart: 1,
                showCart: false,
                fileId: null,
                showSeasons: false,
                genres: this.$store.getters.genres,
                cellphone: null,
                selectedSeason: 1,
                selectedEpisode: 1
            }
        },
        methods: {
            getMoviesDetails: function () {
                this.$store.dispatch('updateRequesting', {status:true});
                this.$store.dispatch('getMoviesDetails', {id: this.$route.params.id, type: this.$route.params.type})
                    .then(response => {
                        this.$store.dispatch('updateRequesting', {status:false});
                        if (response.data.status !== 'Success') {
                            this.$swal('خطا', response.data.errorMessage, 'error');
                            return;
                        }
                        this.movie = response.data.movies;
                    })
                    .catch(() => {
                        this.$store.dispatch('updateRequesting', {status:false});
                        this.$swal('خطا', 'خطای غیر منتظره رخ داده است لطفا دوباره امتحان کنید.', 'error');
                    })
            },
            getCart: function () {
                this.$store.dispatch('updateRequesting', {status:true});
                this.$store.dispatch('getCart', {
                    type: this.movie.type === 'series' ? 'episode' : this.movie.type,
                    id: this.movie.type === 'series' ? this.movie.seasons[this.selectedSeason][this.selectedEpisode - 1]['id'] : this.movie.id,
                    cellphone: this.cellphone
                })
                    .then(response => {
                        this.$store.dispatch('updateRequesting', {status:false});
                        if (response.data.status !== 'Success') {
                            this.$swal('خطا', response.data.errorMessage, 'error');
                            return;
                        }
                        this.cart = response.data.cart
                        this.showCart = true
                    })
                    .catch(() => {
                        this.$store.dispatch('updateRequesting', {status:false});
                        this.$swal('خطا', 'خطای غیر منتظره رخ داده است لطفا دوباره امتحان کنید.', 'error');
                    })
            },
            changeCellphone: function () {
                if (this.cellphone.length > 11) {
                    this.cellphone = this.cellphone.slice(0, 11);
                }
                this.cellphone = this.convertToEnglishDigit(this.cellphone).replace(/[^\d.-]/g, '');
            },
            setFileId: function (id) {
                this.fileId = id;
            },
            convertToEnglishDigit: function (string) {
                return string.replace(/[۰-۹]/g, function (w) {
                    var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
                    return persian.indexOf(w);
                })
            },
            purchase: function () {
                if (this.cellphone === null || this.cellphone.length !== 11 || !['093', '090', '091', '092'].includes(this.cellphone.substr(0,3))) {
                    this.$swal('خطا', 'لطفا شماره موبایل خود را کامل و صحیح وارد کنید.', 'error');
                    return;
                }
                this.$store.dispatch('updateRequesting', {status:true});
                this.$store.dispatch('purchase', {
                    type: this.movie.type,
                    id: this.movie.type === 'series' ? this.movie.seasons[this.selectedSeason][this.selectedEpisode - 1]['id']:this.movie.id,
                    fileId: this.fileId,
                    cellphone: this.cellphone
                })
                    .then(response => {
                        this.$store.dispatch('updateRequesting', {status:true,title:'در حال انتقال به بانک...'});
                        if (response.data.status !== 'Success') {
                            this.$store.dispatch('updateRequesting', {status:false});
                            this.$swal('خطا', response.data.errorMessage, 'error');
                            return;
                        }
                        window.location.href = response.data.paymentInfo.url;
                    })
                    .catch((error) => {
                        console.log(error);
                        this.$store.dispatch('updateRequesting', {status:false});
                        this.$swal('خطا', 'خطای غیر منتظره رخ داده است لطفا دوباره امتحان کنید.', 'error');
                    })
            }
        },
        mounted() {
            this.getMoviesDetails();
        },
    }
</script>