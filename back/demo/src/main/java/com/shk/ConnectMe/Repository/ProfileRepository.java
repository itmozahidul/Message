package com.shk.ConnectMe.Repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.shk.ConnectMe.Model.Profile;

@Repository
public interface ProfileRepository extends CrudRepository<Profile, Long>{

	@Query(value="select * from profile where profile.user_id = ?1", nativeQuery = true)
	public Profile getProfilesByUserId(String id);
	
	@Transactional
	@Modifying
	@Query(value="update profile p set p.city=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrycity(String city, String id); 
	
	@Transactional
	@Modifying
	@Query(value="update profile p set p.plz=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryplz(String plz, String id); 
	
	@Transactional
	@Modifying
	@Query(value="update profile p set p.country=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrycountry(String country, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.iban=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryiban(String iban, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.street=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrystreet(String street, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.house=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryhouse(String house, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.musics=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrymusics(String musics, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.movies=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrymovies(String movies, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.hobby=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryhobby(String hobby, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.about=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryabout(String about, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.post=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrypost(String post, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.status=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrystatus(String status, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.school=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryschool(String school, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.university=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryuniversity(String university, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.education=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryeducation(String education, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.job=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryjob(String job, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.experience=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryexperience(String experience, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.gps_location=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrygps_location(String gps_location, String id);
	@Transactional
	@Modifying
	@Query(value="update profile p set p.joined=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryjoined(String joined, String id); 
	@Transactional
	@Modifying
	@Query(value="update profile p set p.secretquestion1=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrysecretquestion1(String secretquestion1, String id); 
	@Transactional
	@Modifying
	@Query(value="update profile p set p.secretquestion2=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrysecretquestion2(String secretquestion2, String id); 
	@Transactional
	@Modifying
	@Query(value="update profile p set p.secretquestion3=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntrysecretquestion3(String secretquestion3, String id); 
	@Transactional
	@Modifying
	@Query(value="update profile p set p.answer1=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryanswer1(String answer1, String id); 
	@Transactional
	@Modifying
	@Query(value="update profile p set p.answer2=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryanswer2(String answer2, String id); 
	@Transactional
	@Modifying
	@Query(value="update profile p set p.answer3=?1 where p.id=?2", nativeQuery = true)
	public void UpdateProfileEntryanswer3(String answer3, String id); 

}
