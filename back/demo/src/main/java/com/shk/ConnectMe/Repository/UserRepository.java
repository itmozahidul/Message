package com.shk.ConnectMe.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.shk.ConnectMe.Model.User;



@Repository
public interface UserRepository extends CrudRepository<User, Long> {
	@Query(value="select * from user where user.name = ?1", nativeQuery = true)
	public User getUsersByKey(String key);
	
	@Query(value="select user.name from user where user.fname like %?1% "+" or "+" user.lname like %?1% " + "or" +" user.name like %?1% ", nativeQuery = true)
	public List<String> getSearchedUserNamesByKey( String keyn);
	
	@Transactional
	@Modifying
	@Query(value="update user set user.spokento = ?1 where user.name=?2", nativeQuery = true)
	public void UpdateUserSpokenToEntry(String spokento, String name); 
	
	@Transactional
	@Modifying
	@Query(value="update user u set u.fname=?1, u.lname=?2,u.adress=?3,u.number=?4,u.image = ?5,u.role = ?6 where u.name=?7", nativeQuery = true)
	public void UpdateUserEntry(String fname,String lname,String adress,String number,String image,String role, String name); 
	
	@Transactional
	@Modifying
	@Query(value="update user u set u.fname=?1 where u.name=?2", nativeQuery = true)
	public void UpdateUserEntryfname(String fname, String name); 
	
	@Transactional
	@Modifying
	@Query(value="update user u set u.lname=?1 where u.name=?2", nativeQuery = true)
	public void UpdateUserEntrylname(String lname,String name); 
	
	@Transactional
	@Modifying
	@Query(value="update user u set u.adress=?1 where u.name=?2", nativeQuery = true)
	public void UpdateUserEntryadress(String adress, String name); 
	
	@Transactional
	@Modifying
	@Query(value="update user u set u.mobile=?1 where u.name=?2", nativeQuery = true)
	public void UpdateUserEntrymobile(String mobile, String name); 
	
	@Transactional
	@Modifying
	@Query(value="update user u set u.image = ?1 where u.name=?2", nativeQuery = true)
	public void UpdateUserEntryimage(String image, String name); 
	
	@Transactional
	@Modifying
	@Query(value="update user u set u.role = ?1 where u.name=?2", nativeQuery = true)
	public void UpdateUserEntryrole(String role, String name); 
	
	@Transactional
	@Modifying
	@Query(value="insert into user_chat value(?1,?2)", nativeQuery = true)
	public void UpdateUser_ChatEntryrole(String userid, String chatid);
	
//	@Transactional
//	@Modifying
//	@Query(value="update user u set u.fname=?1, u.lname=?2,u.adress=?3,u.number=?4,u.image = ?5,u.about = ?6 where user.name=?2", nativeQuery = true)
//	public void UpdateUserEntry(String fname,String lname,String adress,String number,String image,String about, String name); 

}
