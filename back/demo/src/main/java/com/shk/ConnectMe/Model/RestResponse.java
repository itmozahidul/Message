package com.shk.ConnectMe.Model;

public class RestResponse {
	private  String jwt;
	
	public RestResponse() {
		// TODO Auto-generated constructor stub
		this.jwt="";
	}

	public RestResponse(String jwt) {
		// TODO Auto-generated constructor stub
		this.jwt=jwt;
	}

	public String getJwt() {
		return jwt;
	}
	
	public void setJwt(String jwt) {
		this.jwt = jwt;
	}

}
