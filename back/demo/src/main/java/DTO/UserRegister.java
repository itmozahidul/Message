package DTO;

public class UserRegister {
private String name;
private boolean result;
public UserRegister(String name, boolean result) {
	super();
	this.name = name;
	this.result = result;
}
public UserRegister() {
	super();
	// TODO Auto-generated constructor stub
}
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public boolean isResult() {
	return result;
}
public void setResult(boolean result) {
	this.result = result;
}


}
