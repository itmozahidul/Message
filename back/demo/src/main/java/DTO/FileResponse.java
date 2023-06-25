package DTO;

import java.net.URL;

public class FileResponse {
   String path;
    String name = "";
    String owner = "";
	public FileResponse() {
		// TODO Auto-generated constructor stub
	}
	
	public FileResponse(String url) {
		super();
		this.path = url;
	}

	public FileResponse(String path, String name, String owner) {
		super();
		this.path = path;
		this.name = name;
		this.owner = owner;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}
	

	
	

}
