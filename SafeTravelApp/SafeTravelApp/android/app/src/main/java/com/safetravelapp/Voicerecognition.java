package com.safetravel; // Replace with your actual package name

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

public class VoiceRecognitionService extends Service {
    private static final int NOTIFICATION_ID = 1;

    @Override
    public void onCreate() {
        super.onCreate();
        // Start voice recognition logic here (with react-native-voice)
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Create a notification for the foreground service
        Notification notification = new NotificationCompat.Builder(this, "CHANNEL_ID")
                .setContentTitle("Voice Recognition Active")
                .setContentText("Listening for voice input...")
                .setSmallIcon(R.drawable.ic_voice) // Replace with your own icon
                .build();

        startForeground(NOTIFICATION_ID, notification);

        // Continue the voice recognition in the background
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // Clean up voice recognition logic here
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
