package DTO;

public class UserUpdate {
	private String id;
	private String name;
	private String fname;
	private String lname;
	private String mobile;
	private String adress;
	private String image;
	private String role;
	public UserUpdate() {
		// TODO Auto-generated constructor stub
	}
	public UserUpdate(String id,String name, String fname, String lname, String mobile, String adress, String image, String role) {
		super();
		this.id=id;
		this.name = name;
		this.fname = fname;
		this.lname = lname;
		this.mobile = mobile;
		this.adress = adress;
		this.image = image;
		this.role= role;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getAdress() {
		return adress;
	}
	public void setAdress(String adress) {
		this.adress = adress;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getFname() {
		return fname;
	}
	public void setFname(String fname) {
		this.fname = fname;
	}
	public String getLname() {
		return lname;
	}
	public void setLname(String lname) {
		this.lname = lname;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	

}
