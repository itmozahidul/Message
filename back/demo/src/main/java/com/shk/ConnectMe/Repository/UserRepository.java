package com.shk.ConnectMe.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.shk.ConnectMe.Model.User;



@Repository
public interface UserRepository extends CrudRepository<User, Long> {
	@Query(value="select * from user where user.name = ?1", nativeQuery = true)
	public User getUsersByKey(String key);
	
	@Query(value="select user.name from user where user.first_name like %?1% "+" or "+" user.last_name like %?1% " + "or" +" user.name like %?1% ", nativeQuery = true)
	public List<String> getSearchedUserNamesByKey( String keyn);
	

}
