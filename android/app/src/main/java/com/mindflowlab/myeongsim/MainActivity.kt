package com.mindflowlab.myeongsim

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.android.billingclient.api.*
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback

class MainActivity : AppCompatActivity(), PurchasesUpdatedListener {

    private lateinit var webView: WebView
    private lateinit var billingClient: BillingClient
    private var mInterstitialAd: InterstitialAd? = null

    companion object {
        const val PRODUCT_REMOVE_ADS = "remove_ads_3300"
        const val PRODUCT_AI_SERVER_98000 = "myeongsim_ai_api_server_98000"
        const val WEB_APP_URL = "https://myeongsimcoaching.com"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Google Mobile Ads (AdMob) 초기화
        MobileAds.initialize(this) {}
        loadInterstitialAd()

        // 2. Google Play Billing Client 초기화 (인앱 상품 3,300원)
        setupBillingClient()

        // 3. 네이티브 웹뷰 생성 및 세팅
        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.cacheMode = WebSettings.LOAD_DEFAULT
            settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            webViewClient = WebViewClient()
            webChromeClient = WebChromeClient()

            // 자바스크립트 브릿지 연결: window.AndroidBridge
            addJavascriptInterface(WebAppInterface(), "AndroidBridge")
        }

        setContentView(webView)
        webView.loadUrl(WEB_APP_URL)
    }

    private fun setupBillingClient() {
        val pendingPurchasesParams = PendingPurchasesParams.newBuilder()
            .enableOneTimeProducts()
            .build()

        billingClient = BillingClient.newBuilder(this)
            .setListener(this)
            .enablePendingPurchases(pendingPurchasesParams)
            .build()

        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    queryPurchases()
                }
            }

            override fun onBillingServiceDisconnected() {
                // 재연결
            }
        })
    }

    // 인앱/구독 상품 구매창 호출 (3,300원 광고 제거 또는 98,000원 AI 서버 해제)
    fun launchPurchaseFlow(productId: String = PRODUCT_REMOVE_ADS) {
        val isSubscription = productId == PRODUCT_AI_SERVER_98000
        val productType = if (isSubscription) BillingClient.ProductType.SUBS else BillingClient.ProductType.INAPP

        val productList = listOf(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(productId)
                .setProductType(productType)
                .build()
        )

        val params = QueryProductDetailsParams.newBuilder().setProductList(productList).build()

        billingClient.queryProductDetailsAsync(params) { billingResult, queryProductDetailsResult ->
            val productDetailsList = queryProductDetailsResult.productDetailsList
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && !productDetailsList.isNullOrEmpty()) {
                val productDetails = productDetailsList[0]
                val productDetailsParamsBuilder = BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(productDetails)

                if (isSubscription) {
                    val offerToken = productDetails.subscriptionOfferDetails?.firstOrNull()?.offerToken
                    if (!offerToken.isNullOrEmpty()) {
                        productDetailsParamsBuilder.setOfferToken(offerToken)
                    }
                }

                val billingFlowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(listOf(productDetailsParamsBuilder.build()))
                    .build()

                runOnUiThread {
                    billingClient.launchBillingFlow(this, billingFlowParams)
                }
            } else {
                // 구독으로 조회 실패 시 인앱 상품(INAPP)으로 폴백 조회 (개발자 콘솔 설정 유연성 보장)
                if (isSubscription) {
                    launchInAppFallback(productId)
                } else {
                    runOnUiThread {
                        Toast.makeText(this@MainActivity, "상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    private fun launchInAppFallback(productId: String) {
        val productList = listOf(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(productId)
                .setProductType(BillingClient.ProductType.INAPP)
                .build()
        )
        val params = QueryProductDetailsParams.newBuilder().setProductList(productList).build()
        billingClient.queryProductDetailsAsync(params) { billingResult, queryProductDetailsResult ->
            val productDetailsList = queryProductDetailsResult.productDetailsList
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && !productDetailsList.isNullOrEmpty()) {
                val productDetails = productDetailsList[0]
                val billingFlowParams = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(listOf(
                        BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(productDetails).build()
                    ))
                    .build()
                runOnUiThread {
                    billingClient.launchBillingFlow(this, billingFlowParams)
                }
            } else {
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "상품 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    override fun onPurchasesUpdated(billingResult: BillingResult, purchases: List<Purchase>?) {
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (purchase in purchases) {
                handlePurchase(purchase)
            }
        }
    }

    private fun handlePurchase(purchase: Purchase) {
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            val isAiServer = purchase.products.contains(PRODUCT_AI_SERVER_98000)
            if (!purchase.isAcknowledged) {
                val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
                    .setPurchaseToken(purchase.purchaseToken)
                    .build()
                billingClient.acknowledgePurchase(acknowledgePurchaseParams) { billingResult ->
                    if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                        if (isAiServer) {
                            notifyAiServerUnlockedToWeb()
                        } else {
                            notifyAdRemovedToWeb()
                        }
                    }
                }
            } else {
                if (isAiServer) {
                    notifyAiServerUnlockedToWeb()
                } else {
                    notifyAdRemovedToWeb()
                }
            }
        }
    }

    private fun queryPurchases() {
        // 1. INAPP 조회 (3,300원 및 1회권)
        billingClient.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build()
        ) { _, purchases ->
            for (purchase in purchases) {
                if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
                    if (purchase.products.contains(PRODUCT_AI_SERVER_98000)) {
                        notifyAiServerUnlockedToWeb()
                    } else if (purchase.products.contains(PRODUCT_REMOVE_ADS)) {
                        notifyAdRemovedToWeb()
                    }
                }
            }
        }
        // 2. SUBS 조회 (98,000원 월정액 구독)
        billingClient.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build()
        ) { _, purchases ->
            for (purchase in purchases) {
                if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
                    if (purchase.products.contains(PRODUCT_AI_SERVER_98000)) {
                        notifyAiServerUnlockedToWeb()
                    }
                }
            }
        }
    }

    // 웹뷰에 자바스크립트 콜백 전달 (광고 완전 제거)
    private fun notifyAdRemovedToWeb() {
        runOnUiThread {
            webView.evaluateJavascript("if (window.onAdRemovedPurchased) { window.onAdRemovedPurchased(); }", null)
            Toast.makeText(this, "3,300원 광고 제거가 정상 적용되었습니다! 🎉", Toast.LENGTH_LONG).show()
        }
    }

    // 웹뷰에 자바스크립트 콜백 전달 (모든 AI API 서버 이용료 해제 완료)
    private fun notifyAiServerUnlockedToWeb() {
        runOnUiThread {
            webView.evaluateJavascript("if (window.onAiServerUnlocked) { window.onAiServerUnlocked(); }", null)
            Toast.makeText(this, "명심 앱내 모든 인공지능 상세 API 서버 이용료 해제 완료! 🎉", Toast.LENGTH_LONG).show()
        }
    }

    // AdMob 전면 광고 로드
    private fun loadInterstitialAd() {
        val adRequest = AdRequest.Builder().build()
        // 구글 공식 테스트 전면 광고 단위 ID
        InterstitialAd.load(this, "ca-app-pub-3940256099942544/1033173712", adRequest, object : InterstitialAdLoadCallback() {
            override fun onAdLoaded(interstitialAd: InterstitialAd) {
                mInterstitialAd = interstitialAd
            }
        })
    }

    // 자바스크립트에서 호출 가능한 네이티브 인터페이스
    inner class WebAppInterface {
        @JavascriptInterface
        fun purchaseRemoveAds() {
            launchPurchaseFlow(PRODUCT_REMOVE_ADS)
        }

        @JavascriptInterface
        fun purchaseAiServerService() {
            launchPurchaseFlow(PRODUCT_AI_SERVER_98000)
        }

        @JavascriptInterface
        fun restorePurchases() {
            queryPurchases()
        }

        @JavascriptInterface
        fun showInterstitialAd() {
            runOnUiThread {
                mInterstitialAd?.show(this@MainActivity)
                loadInterstitialAd()
            }
        }

        @JavascriptInterface
        fun isNativeApp(): Boolean {
            return true
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
