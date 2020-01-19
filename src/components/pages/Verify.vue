<template>
    <div class="content">
        <div v-if="result !==null">
            <div class="purchase-verify" v-if="result.status ==='Success'">
                <div class="purchase-verify-status success">
                    <i class="fa fa-check font-1 text-white"></i>
                </div>
                <div class="purchase-verify-box">
                    <h2 class="text-grey">تراکنش با موفقیت انجام شد.</h2>
                    <div class=" b-radius-1 purchase-verify-info ">
                        <div class="purchase-verify-info-title flex-self-start">
                            <i class="fa fa-dot-circle text-grey"></i>
                            <span class="text-grey">کد پیگیری:</span>
                        </div>
                        <p class="text-grey text-ltr font-4">{{result.refId}}</p>
                    </div>
                    <div class=" b-radius-1 purchase-verify-info ">
                        <div class="purchase-verify-info-title flex-self-start">
                            <i class="fa fa-dot-circle text-grey"></i>
                            <span class="text-grey">زمان خرید:</span>
                        </div>
                        <p class="text-grey text-ltr font-4">{{result.date}}</p>
                    </div>
                    <div class=" b-radius-1 purchase-verify-info ">
                        <div class="purchase-verify-info-title flex-self-start">
                            <i class="fa fa-dot-circle text-grey"></i>
                            <span class="text-grey">نام فیلم:</span>
                        </div>
                        <p class="text-grey text-ltr font-4">{{result.products.name}}</p>
                    </div>
                    <div class=" b-radius-1 purchase-verify-info ">
                        <div class="purchase-verify-info-title flex-self-start">
                            <i class="fa fa-dot-circle text-grey"></i>
                            <span class="text-grey">مبلغ فیلم:</span>
                        </div>
                        <p class="text-grey text-ltr font-4">{{result.products.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}} تومان</p>
                    </div>
                    <div class=" b-radius-1 purchase-verify-info ">
                        <div class="purchase-verify-info-title flex-self-start">
                            <i class="fa fa-dot-circle text-grey"></i>
                            <span class="text-grey">شماره موبایل:</span>
                        </div>
                        <p class="text-grey text-ltr font-4">{{result.products.details.cellphone}}</p>
                    </div>
                    <button @click="downloadFilm()" class="btn col-md-12 btn-success b-radius-1">دانلود فایل فیلم</button>
                    <router-link class="btn col-md-12 btn-primary b-radius-1" to="/">بازگشت به صفحه اصلی</router-link>
                </div>
            </div>
            <div v-else class="purchase-verify ">
                <div class="purchase-verify-status success">
                    <i class="fa fa-check font-1 text-white"></i>
                </div>
                <div class="purchase-verify-status error">
                    <i class="fa fa-times font-1 text-white"></i>
                </div>
                <div class="purchase-verify-box">
                    <h2 class="text-grey">تراکنش ناموفق بود.</h2>
                    <div class="flex-self-start">
                        <p class="text-grey font-3">تراکنش تایید نشد.</p>
                        <p class="text-grey font-4">چنانچه وجه از حساب شما کسر شده است، طی 72 ساعت کاری آینده
                            از طرف بانک وجه به حساب شما باز می گردد.
                        </p>
                    </div>
                    <router-link class="btn col-md-12 btn-primary b-radius-1" to="/">بازگشت به صفحه اصلی</router-link>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    export default {
        data() {
            return {
                result: null
            }
        },
        methods: {
            show: function () {
                var parsedWordArray = this.$CryptoJS.enc.Base64.parse(this.$route.query.data);
                var parsedStr = parsedWordArray.toString(this.$CryptoJS.enc.Utf8);
                this.result = JSON.parse(parsedStr);
            },
            downloadFilm: function () {
                this.$store.dispatch('downloadFilm', {link: this.result.products.details.downloadUrl})
                    .then(response => {
                        if (response.data.status !== 'Success') {
                            this.$swal('خطا', response.data.errorMessage, 'error');
                            return;
                        }
                        window.location.href = response.data.downloadUrl;
                    })
                    .catch(error => {
                        this.$store.dispatch('updateRequesting', {status:false});
                        this.$swal('خطا', 'خطای غیر منتظره رخ داده است لطفا دوباره امتحان کنید.', 'error');
                    })
            }
        },
        mounted() {
            this.show()
        },
    }
</script>
