package com.shk.ConnectMe.Model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
//@Table(name = "Profile")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) 
public class Profile {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;
	private String city;
	private String plz;
	private String country;
	private String iban;
	private String street;
	private String house;
	private String musics;
	private String movies;
	private String hobby;
	private String about;
	private String post;
	private String status;
	private String school;
	private String university;
	private String education;
	private String job;
	private String experience;
	private String secretquestion1;
	private String secretquestion2;
	private String secretquestion3;
	private String answer1;
	private String answer2;
	private String answer3;
	private String gps_location;
	private String joined;
	
	@OneToOne(fetch = FetchType.LAZY)
	  @JoinColumn(name = "user_id", nullable = false, unique = true) 
	  @JsonIgnoreProperties({"profile","card","sendMessageList","recievedMessageList"})
	  
	  private User user;

	public Profile() {
		// TODO Auto-generated constructor stub
	}
	
	

	public Profile( String joined) {
		super();
		this.city = "";
		this.plz = "";
		this.country = "";
		this.iban = "";
		this.street = "";
		this.house = "";
		this.musics = "";
		this.movies = "";
		this.hobby = "";
		this.about = "";
		this.post = "";
		this.status = "";
		this.school = "";
		this.university = "";
		this.education = "";
		this.job = "";
		this.experience = "";
		this.secretquestion1 = "";
		this.secretquestion2 = "";
		this.secretquestion3 = "";
		this.answer1 = "";
		this.answer2 = "";
		this.answer3 = "";
		this.gps_location = "";
		this.joined = joined;
	}



	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getPlz() {
		return plz;
	}

	public void setPlz(String plz) {
		this.plz = plz;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getIban() {
		return iban;
	}

	public void setIban(String iban) {
		this.iban = iban;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getHouse() {
		return house;
	}

	public void setHouse(String house) {
		this.house = house;
	}

	public String getMusics() {
		return musics;
	}

	public void setMusics(String musics) {
		this.musics = musics;
	}

	public String getMovies() {
		return movies;
	}

	public void setMovies(String movies) {
		this.movies = movies;
	}

	public String getHobby() {
		return hobby;
	}

	public void setHobby(String hobby) {
		this.hobby = hobby;
	}

	public String getAbout() {
		return about;
	}

	public void setAbout(String about) {
		this.about = about;
	}

	public String getPost() {
		return post;
	}

	public void setPost(String post) {
		this.post = post;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getSchool() {
		return school;
	}

	public void setSchool(String school) {
		this.school = school;
	}

	public String getUniversity() {
		return university;
	}

	public void setUniversity(String university) {
		this.university = university;
	}

	public String getEducation() {
		return education;
	}

	public void setEducation(String education) {
		this.education = education;
	}

	public String getJob() {
		return job;
	}

	public void setJob(String job) {
		this.job = job;
	}

	public String getExperience() {
		return experience;
	}

	public void setExperience(String experience) {
		this.experience = experience;
	}

	public String getSecretquestion1() {
		return secretquestion1;
	}

	public void setSecretquestion1(String secretquestion1) {
		this.secretquestion1 = secretquestion1;
	}

	public String getSecretquestion2() {
		return secretquestion2;
	}

	public void setSecretquestion2(String secretquestion2) {
		this.secretquestion2 = secretquestion2;
	}

	public String getSecretquestion3() {
		return secretquestion3;
	}

	public void setSecretquestion3(String secretquestion3) {
		this.secretquestion3 = secretquestion3;
	}

	public String getAnswer1() {
		return answer1;
	}

	public void setAnswer1(String answer1) {
		this.answer1 = answer1;
	}

	public String getAnswer2() {
		return answer2;
	}

	public void setAnswer2(String answer2) {
		this.answer2 = answer2;
	}

	public String getAnswer3() {
		return answer3;
	}

	public void setAnswer3(String answer3) {
		this.answer3 = answer3;
	}

	public String getGps_location() {
		return gps_location;
	}

	public void setGps_location(String gps_location) {
		this.gps_location = gps_location;
	}

	public String getJoined() {
		return joined;
	}

	public void setJoined(String joined) {
		this.joined = joined;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	

}
