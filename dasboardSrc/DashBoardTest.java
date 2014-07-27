package org.implicit.dasboard;
import java.util.HashMap;

import junit.framework.TestCase;


public class DashBoardTest extends TestCase {
	User user;
	Manager mng;
	DbAPI api;
	String testUserpath = "c:/";
	String testStudyPath = "";
	String key="test123";
	
	public DashBoardTest(String testName) {
		
		super(testName);
		
	}
		
		 
		
	protected void setUp() throws Exception {
	
		super.setUp();
		user = new User();
		mng=new Manager();
		api= new DbAPI();
		
	
	
	
	}
	
	 
	
	protected void tearDown() throws Exception {
	
		super.tearDown();

	}
	
	protected void assertFileMng(){
		user.setKey(key);
		//HashMap filepresent = mng.getFiles(user, "study1");
		assertEquals("test","test");
		
		
		
	}
	protected void assertUserStudyBuild(){
		String key="222";
		//user.setKey(key);
		//mng.setStudyIdFromDB(user);
		assertEquals("222",key);
		
		
	}
	

}
