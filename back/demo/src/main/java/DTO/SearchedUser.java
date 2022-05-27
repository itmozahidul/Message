package DTO;

public class SearchedUser {
	private String name;
	private String image;

	public SearchedUser() {
		// TODO Auto-generated constructor stub
		
	}
	
	

	public SearchedUser(String name, String image) {
		super();
		this.name = name;
		this.image = image;
	}



	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}
	
	

}
