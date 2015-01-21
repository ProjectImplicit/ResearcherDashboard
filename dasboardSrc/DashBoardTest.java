package org.implicit.dasboard;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import org.junit.BeforeClass;
import org.junit.Test;

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
		
		 
	@BeforeClass	
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
	/* Test for zipping a folder */
	
	protected void testZip(String path){
		ZipDirectory zipUtil = new ZipDirectory();
		String DownloadDirctory = mng.folderBase+mng.projectPath+mng.downloadDir;
		try {
			zipUtil.zip(path,DownloadDirctory);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		
	}
	@Test
	public void test() {
		String pathtoZip = mng.folderBase+"bgoldenberg"+ File.separator+"newTestStudy";
		String DownloadDirctory = mng.folderBase+mng.projectPath+mng.downloadDir+File.separator+"newTestStudy.zip";
		testZip(pathtoZip);
		File test = new File(DownloadDirctory);
		assertNotNull(test);
		
	}
	

}
