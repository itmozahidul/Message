package com.shk.ConnectMe.Model;

public class RestResponse {
	private final String jwt;

	public RestResponse(String jwt) {
		// TODO Auto-generated constructor stub
		this.jwt=jwt;
	}

	public String getJwt() {
		return jwt;
	}

}
