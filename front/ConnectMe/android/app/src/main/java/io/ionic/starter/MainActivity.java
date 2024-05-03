package io.ionic.starter;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Intent serviceintent = new Intent(this, NotificationService.class);
    startForegroundService(serviceintent);
  }
}
