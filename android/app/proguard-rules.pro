# Proguard rules for Myeongsim App

# Keep JavascriptInterface for WebView
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep Google Play Billing
-keep class com.android.billingclient.api.** { *; }

# Keep AdMob
-keep class com.google.android.gms.ads.** { *; }

# Keep App Models and Bridge
-keep class com.mindflowlab.myeongsim.** { *; }
