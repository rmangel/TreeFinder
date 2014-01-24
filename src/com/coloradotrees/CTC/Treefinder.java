package com.coloradotrees.CTC;

import android.os.Bundle;
import org.apache.cordova.DroidGap;
//import android.app.Activity;
//import android.view.Menu;

public class Treefinder extends DroidGap {

	@Override
	  public void onCreate(Bundle savedInstanceState) {
	      super.onCreate(savedInstanceState);
	      super.loadUrl("file:///android_asset/www/index.html");
	      //setContentView(R.layout.activity_main);
	  }
}
