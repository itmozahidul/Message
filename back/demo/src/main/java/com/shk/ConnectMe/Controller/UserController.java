package com.shk.ConnectMe.Controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shk.ConnectMe.Model.Geheim;
import com.shk.ConnectMe.Model.Profile;
import com.shk.ConnectMe.Model.RestResponse;
import com.shk.ConnectMe.Model.SpokenToEntry;
import com.shk.ConnectMe.Model.User;
import com.shk.ConnectMe.Repository.GeheimRepository;
import com.shk.ConnectMe.Repository.ProfileRepository;
import com.shk.ConnectMe.Repository.UserRepository;
import com.shk.ConnectMe.utils.JwtTokenUtil;

import org.json.simple.parser.ParseException;
import org.json.simple.parser.JSONParser;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.json.simple.JSONObject;

import DTO.SearchedUser;
import DTO.UserRegister;
import DTO.UserUpdate;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserRepository user_rpt;
	@Autowired
	private ProfileRepository prf_rpt;
	@Autowired
	private GeheimRepository geheim_rpt;
	private String jwt = "";
	private JSONObject job_info = new JSONObject();
	@Autowired
	private JwtTokenUtil jwtutil;

	private List<SearchedUser> smlObjUsers = new ArrayList<SearchedUser>();
	private List<User> Objusers = new ArrayList<User>();
	private List<String> names = new ArrayList<String>();
	private List<String> photos = new ArrayList<String>();

	@PostMapping("/register")
	ResponseEntity<?> register(@RequestBody String string_info) {
		JSONObject ans = new JSONObject();
		ans.put("name", "User");
		ans.put("result", "false");
		this.job_info = new JSONObject();
		try {
			job_info = (JSONObject) new JSONParser().parse(string_info);
			User user = new User("", this.job_info.get("fname").toString(), this.job_info.get("lname").toString(),
					this.job_info.get("mobile").toString(), this.job_info.get("adress").toString(),
					this.job_info.get("image").toString());
			Geheim geheim = new Geheim(this.job_info.get("imp").toString());
			geheim.setUser(user);
			user.setCard(geheim);
			Profile profile = new Profile(this.now());
			profile.setUser(user);
			user.setProfile(profile);
			User user2 = this.user_rpt.save(user);
			user2.setName(user2.getFname() + user2.getId());
			user2.setRole("User");
			user2 = this.user_rpt.save(user2);
			ans.put("name", user2.getName());
			ans.put("result", "true");

			return ResponseEntity.ok(ans.toJSONString());

		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.badRequest().build();
		}

	}

	public static final String DATE_FORMAT_NOW = "yyyy-MM-dd HH:mm:ss";

	public static String now() {
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat(DATE_FORMAT_NOW);
		return sdf.format(cal.getTime());
	}

	@PostMapping("/search")
	ResponseEntity<?> search(@RequestBody String key) {

		try { // this.user_rpt.getUsersByKey("shakil");
			this.names = this.user_rpt.getSearchedUserNamesByKey(key);
//			List<User> users = this.user_rpt.getUsersByKey(key);
//			for(User u:users) {
//				this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return ResponseEntity.ok(this.names);
	}

	@PostMapping("/spokenTo")
	ResponseEntity<?> getSpokenTo(@RequestBody String key) {
		String spokenTo = "";
		try { // this.user_rpt.getUsersByKey("shakil");
			User u = this.user_rpt.getUsersByKey(key);// key means username
			spokenTo = u.getSpokenTo();
//			List<User> users = this.user_rpt.getUsersByKey(key);
//			for(User u:users) {
//				this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return ResponseEntity.ok(new SpokenToEntry(spokenTo));
	}

	@PostMapping("/get")
	ResponseEntity<?> getUser(@RequestBody String key) {

		User u = null;
		try { // this.user_rpt.getUsersByKey("shakil");
			u = this.user_rpt.getUsersByKey(key);// key means username

//			List<User> users = this.user_rpt.getUsersByKey(key);
//			for(User u:users) {
//				this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//			}
			UserUpdate up = new UserUpdate(Integer.toString(u.getId()), u.getName(), u.getFname(), u.getLname(),
					u.getMobile(), u.getAdress(), u.getImage(), u.getRole());
			return ResponseEntity.ok(up);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

			return ResponseEntity.notFound().build();
		}

	}

	@PostMapping("/profile")
	ResponseEntity<?> getUserProfile(@RequestBody String id) {

		Profile p = null;
		try { // this.user_rpt.getUsersByKey("shakil");
			p = this.prf_rpt.getProfilesByUserId(id);// key means username

//			List<User> users = this.user_rpt.getUsersByKey(key);
//			for(User u:users) {
//				this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//			}

			return ResponseEntity.ok(p);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();

			return ResponseEntity.notFound().build();
		}

	}

	@PostMapping("/photo")
	ResponseEntity<?> getUserPhoto(@RequestBody String key) {
		this.photos = new ArrayList<String>();
		String photo = "";
		try { // this.user_rpt.getUsersByKey("shakil");
			User u = this.user_rpt.getUsersByKey(key);// key means username
			photo = u.getImage();
//			List<User> users = this.user_rpt.getUsersByKey(key);
//			for(User u:users) {
//				this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			photo = "";
		}
		this.photos.add(photo);

		return ResponseEntity.ok(this.photos);
	}

	@PostMapping("/update/single")
	ResponseEntity<?> updateUser(@RequestBody String string_info) {
		this.job_info = new JSONObject();

		boolean ans = false;
		try { // this.user_rpt.getUsersByKey("shakil");
			job_info = (JSONObject) new JSONParser().parse(string_info);
			String key = this.job_info.get("key").toString();
			String p_id = this.job_info.get("p_id").toString();
			String value = this.job_info.get("value").toString();
			ans = true;

			switch (key) {
			case "fname":
                this.user_rpt.UpdateUserEntryfname(value,p_id);
				break;
			case "lname":
				this.user_rpt.UpdateUserEntrylname(value,p_id);
				break;
			case "adress":
				this.user_rpt.UpdateUserEntryadress(value,p_id);
				break;
			case "mobile":
				this.user_rpt.UpdateUserEntrymobile(value,p_id);
				break;
			case "image":
				this.user_rpt.UpdateUserEntryimage(value,p_id);
				break;
			case "role":
				this.user_rpt.UpdateUserEntryrole(value,p_id);
				break;

			default:
				ans = false;
				break;
			}

			
//			List<User> users = this.user_rpt.getUsersByKey(key);
//			for(User u:users) {
//				this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			ans = false;
		}

		return ResponseEntity.ok(ans);
	}

	@PostMapping("profile/update/single")
	ResponseEntity<?> updateUserProfileSingleEntry(@RequestBody String string_info) {
		this.job_info = new JSONObject();

		boolean ans = false;
		try { // this.user_rpt.getUsersByKey("shakil");
			job_info = (JSONObject) new JSONParser().parse(string_info);

			String key = this.job_info.get("key").toString();
			String p_id = this.job_info.get("p_id").toString();
			String value = this.job_info.get("value").toString();
			ans = true;
			switch (key) {
			case "city":
				this.prf_rpt.UpdateProfileEntrycity(value, p_id);

				break;
			case "plz":
				this.prf_rpt.UpdateProfileEntryplz(value, p_id);

				break;
			case "country":
				this.prf_rpt.UpdateProfileEntrycountry(value, p_id);

				break;
			case "iban":
				this.prf_rpt.UpdateProfileEntryiban(value, p_id);

				break;
			case "street":
				this.prf_rpt.UpdateProfileEntrystreet(value, p_id);

				break;
			case "house":
				this.prf_rpt.UpdateProfileEntryhouse(value, p_id);

				break;

			case "musics":
				this.prf_rpt.UpdateProfileEntrymusics(value, p_id);

				break;
			case "movies":
				this.prf_rpt.UpdateProfileEntrymovies(value, p_id);

				break;
			case "hobby":
				this.prf_rpt.UpdateProfileEntryhobby(value, p_id);

				break;
			case "about":
				this.prf_rpt.UpdateProfileEntryabout(value, p_id);

				break;
			case "post":
				this.prf_rpt.UpdateProfileEntrypost(value, p_id);

				break;
			case "status":
				this.prf_rpt.UpdateProfileEntrystatus(value, p_id);

				break;
			case "school":
				this.prf_rpt.UpdateProfileEntryschool(value, p_id);

				break;
			case "university":
				this.prf_rpt.UpdateProfileEntryuniversity(value, p_id);

				break;
			case "education":
				this.prf_rpt.UpdateProfileEntryeducation(value, p_id);

				break;
			case "job":
				this.prf_rpt.UpdateProfileEntryjob(value, p_id);

				break;
			case "experience":
				this.prf_rpt.UpdateProfileEntryexperience(value, p_id);

				break;
			case "secretquestion1":
				this.prf_rpt.UpdateProfileEntrysecretquestion1(value, p_id);

				break;
			case "secretquestion2":
				this.prf_rpt.UpdateProfileEntrysecretquestion2(value, p_id);

				break;
			case "secretquestion3":
				this.prf_rpt.UpdateProfileEntrysecretquestion3(value, p_id);

				break;
			case "answer1":
				this.prf_rpt.UpdateProfileEntryanswer1(value, p_id);

				break;
			case "answer2":
				this.prf_rpt.UpdateProfileEntryanswer2(value, p_id);

				break;
			case "answer3":
				this.prf_rpt.UpdateProfileEntryanswer3(value, p_id);

				break;
			case "gps_location":
				this.prf_rpt.UpdateProfileEntrygps_location(value, p_id);

				break;
			case "joined":
				this.prf_rpt.UpdateProfileEntryjoined(value, p_id);

				break;
			default:
				ans = false;
				break;
			}

//			List<User> users = this.user_rpt.getUsersByKey(key);
//			for(User u:users) {
//				this.userNames.add(new SearchedUser(u.getName(),u.getImage()));
//			}

		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			ans = false;
		}

		return ResponseEntity.ok(ans);
	}

	@PostMapping("/login")
	ResponseEntity<?> login(@RequestBody String string_info) {
		this.jwt = null;
		this.job_info = new JSONObject();
		try {
			this.job_info = (JSONObject) new JSONParser().parse(string_info);
			this.user_rpt.findAll().forEach((u) -> {
				if (u.getAdress().equals(this.job_info.get("adress").toString())) {
					this.geheim_rpt.findAll().forEach((g) -> {
						if (g.getUser().getId() == u.getId()
								&& g.getPass().equals(this.job_info.get("imp").toString())) {
							this.jwt = this.jwtutil.generateToken(u.getName());

						}
					});
				}
			});
			return ResponseEntity.ok(new RestResponse(this.jwt));

		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.notFound().build();
		}

	}

}
