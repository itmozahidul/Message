package com.shk.ConnectMe.Model;

public class Gifformat {
	private String url;
	private String itemurl;
	private String hasaudio;
	private String title;

	public Gifformat() {
		// TODO Auto-generated constructor stub
	}

	public Gifformat(String url, String itemurl, String hasaudio, String title) {
		super();
		this.url = url;
		this.itemurl = itemurl;
		this.hasaudio = hasaudio;
		this.title = title;
	}

	public Gifformat(String url, String itemurl) {
		super();
		this.url = url;
		this.itemurl = itemurl;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getItemurl() {
		return itemurl;
	}

	public void setItemurl(String itemurl) {
		this.itemurl = itemurl;
	}

	public String getHasaudio() {
		return hasaudio;
	}

	public void setHasaudio(String hasaudio) {
		this.hasaudio = hasaudio;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	

}
