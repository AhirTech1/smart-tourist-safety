# Keep Google Play Services
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# Keep Google Maps
-keep class com.google.android.libraries.maps.** { *; }
-dontwarn com.google.android.libraries.maps.**

# Keep location services
-keep class androidx.core.content.** { *; }
-keep class androidx.core.app.** { *; }

# Keep geolocator plugin classes
-keep class com.baseflow.geolocator.** { *; }
-dontwarn com.baseflow.geolocator.**
