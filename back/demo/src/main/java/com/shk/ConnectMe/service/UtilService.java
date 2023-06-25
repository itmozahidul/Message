package com.shk.ConnectMe.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import org.springframework.stereotype.Service;

@Service
public class UtilService {

	public UtilService() {
		// TODO Auto-generated constructor stub
	}
	public static final String DATE_FORMAT_NOW = "yyyy-MM-dd HH:mm:ss";

	public  String now() {
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT_NOW);
		return sdf.format(cal.getTime());
	}

}
