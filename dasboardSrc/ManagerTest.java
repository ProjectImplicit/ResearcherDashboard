package org.implicit.dasboard;

import static org.junit.Assert.*;

import java.util.HashMap;

import org.json.simple.JSONValue;
import org.junit.Test;

public class ManagerTest {

	
	protected void setUp() throws Exception {
		
		//super.setUp();
		//user = new User();
		//mng=new Manager();
		//api= new DbAPI();
	
	}
	
	protected void tearDown() throws Exception {
	
	//	super.tearDown();

	}
	
	public void testListFiles(){

		User user = new User();
		Manager mng = new Manager();
		String key = "testkey123456";
		user.setKey(key);
		user.setFolderName("bgoldenberg");
		//mng.setUserfromDB(user);
		HashMap filesPresent = new HashMap();
		filesPresent = mng.listFiles(user, "lateneg3");
		assertNotNull(filesPresent);
		String jsonText = JSONValue.toJSONString(filesPresent);
		assertNotNull(jsonText);
		
		
	}
	public void testGetFile(){
		User user = new User();
		Manager mng = new Manager();
		String key = "testkey123456";
		user.setKey(key);
		user.setFolderName("bgoldenberg");
		String study = "lateneg3";
		String fileName="ampp.js";
		//String fileString = mng.getFile(user,study,fileName);
		//assertNotNull(fileString);
		
		
	}
	
	@Test
	public void test() {
		//fail("Not yet implemented");
		testGetFile();
		
	}

}
