package org.implicit.dasboard;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.uva.util.StudyValidator;

import static java.nio.file.FileVisitResult.*;


public class Manager {
	
	String folderBase; 
	DbAPI api = new DbAPI();
	
	//1. get study ids from db
	//2. go over the folder of that user and get study folders 
	public Manager(){
		if (System.getProperty("os.name").startsWith("Windows")) {
			folderBase="C:\\projects\\workspace\\rc4\\app\\user\\";
			System.out.println("Using folder:"+folderBase);
			
		}else{
			folderBase="//home//dev2//user//";
			System.out.println("Using folder:"+folderBase);
			
		}
	}
	public void buildUser(User user){
		
		setUserfromDB(user);
		setStudyIdFromDB(user);
		setStudyIdfromFileSystem(user);
		
		
		
		
	};
	public boolean AuthUser(User u){
		String key = u.getKey();
		HashMap userHash = new HashMap();
		userHash = api.find("Users", "OSFKey", key);
		if (userHash.size()>0) return true;
		return false;
		
		
		
	}
	
	public void setUserfromDB(User user){
		
		String key = user.getKey();
		api.setMethod("cloude");
		HashMap userHash = api.find("Users","OSFKey", key);
		if (userHash.size()>1) return;
		Map.Entry pairs = (Entry) userHash.entrySet().iterator().next();
		HashMap userRecord = (HashMap) pairs.getValue();
		String id = (String) userRecord.get("id");
		String folder =(String) userRecord.get("userFolder");		
	    String name = (String) userRecord.get("userName");
	    user.setFolderName(folder);
	    user.setUserName(name);
	    user.setID(id);
		
	}
	
	public String studyValidator(User user,String study,String filename){
		
		String studyKey = "/user//"+user.getFolderName()+"//"+study+"//"+filename;
		String type = "";
		ArrayList errors=new ArrayList();
		ArrayList warnings=new ArrayList();
		if(!(type==null)&&type.equals("xml")){
		StudyValidator.ValidateXml(StudyValidator.studyRealPath+studyKey, errors, warnings, "XML File",true);
		}
		else{
			if(!(type==null)&&type.equals("html")){
				StudyValidator.ValidateXml(StudyValidator.studyRealPath+studyKey, errors, warnings, "html file",false);
			}else{
		StudyValidator.validateExpt(studyKey,errors,warnings);}
		}
		String urlString = "?&E=";
		for (int x = 0; x < errors.size(); x++) {

			urlString += "Error: "+ errors.get(x)+"<br/>";
			
			// response.addHeader("StudyName", studies.get(x).getStudy());
			// response.addHeader("StudyWeight",
			// studies.get(x).getStudyWeight()+"");

		}
		for (int x = 0; x < warnings.size(); x++) {

			urlString += "Warning: " + warnings.get(x)+"<br/>";
			
			// response.addHeader("StudyName", studies.get(x).getStudy());
			// response.addHeader("StudyWeight",
			// studies.get(x).getStudyWeight()+"");

		}
		if(urlString.length()>3000)
		{
			urlString=urlString.substring(0,3000);
		}
		return urlString;
	
	}
	public String getFile(User user,String study,String filename){
		
		
		String folderName=user.getFolderName();
		File file = new File(folderBase+"//"+folderName+"//"+study+"//"+filename);
		BufferedReader br =null;
		StringBuilder sb =  null;
		boolean exit=false;
		try{
			br = new BufferedReader( new FileReader(file.getPath()) );
			sb = new StringBuilder();
	        String line = br.readLine();
	        while (line != null ) {
	        	sb.append(line);
	            sb.append(System.lineSeparator());
	            line = br.readLine();
	        }
	        //String everything = sb.toString();
	        
		}catch(Exception e){
			System.out.println(e.getMessage());
			
		}finally{
			try {
				if (br!=null) br.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		return sb.toString();
		
	}
	
	public void setStudyIdFromDB(User user){
		
		String id = user.getID();
		HashMap userStudiesHash = api.find("UsersStudies", "UserID", String.valueOf(id));
		Iterator it = userStudiesHash.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry pairs = (Map.Entry)it.next();
	        String pid = (String) pairs.getKey();
	        HashMap userRecord  = (HashMap)pairs.getValue();
	        String studyID = (String) userRecord.get("StudyID");
	        HashMap dbObject = api.find("Studies","StudyID",studyID);
	        pairs = (Entry) dbObject.entrySet().iterator().next();
	        HashMap studiesRecord = (HashMap) pairs.getValue();
  	        
        	String expt = (String) studiesRecord.get("study_exptid");
	        String name = (String) studiesRecord.get("name");
	        String folder = (String) studiesRecord.get("folder_name");
			String status = (String) studiesRecord.get("status");
			Study study = new Study();
			if (expt!=null) {study.setstudyEXPTID(expt);}
			if (name!=null){study.setStudyName(name);}
			if (folder!=null){study.setfolder(folder);}
			if (status!=null){study.setstatus(status);}
			user.addStudy(study);
	        	
	        
	        
	        
		}
	}
	
	
	public Study getStudy(String id){
		
		Study study = new Study();
		HashMap studys = api.find("Studies", "id",id);
	    Iterator studyIT = studys.entrySet().iterator();
	    Map.Entry pairs = (Map.Entry)studyIT.next();
	    HashMap studyRecord = (HashMap) pairs.getValue();
	    study.setStudyName((String)studyRecord.get("studyName"));
	    study.setstudyEXPTID((String)studyRecord.get("exptID"));
	    
		
		
		return study;
	}
	public Study createStudy(String exptid,String studyName){
		Study study = new Study();
		study.setstudyEXPTID(exptid);
		study.setStudyName(studyName);
		
		return study;
		
	}
	public String getExptID(File file){
		BufferedReader br =null;
		String exptID = null;
		boolean exit=false;
		try{
			br = new BufferedReader( new FileReader(file.getPath()) );
			StringBuilder sb = new StringBuilder();
	        String line = br.readLine();
	        while (line != null && exit==false) {
	        	if (line.contains("<Study")){
	        		
	        		String[] list = line.split("\"");
	        		exptID = list[1];
	        		exit=true;
	        		
	        	}
	            sb.append(line);
	            sb.append(System.lineSeparator());
	            line = br.readLine();
	        }
	        //String everything = sb.toString();
	        return exptID;
		}catch(Exception e){
			System.out.println(e.getMessage());
			
		}finally{  
			try {
				br.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
		}
		return null;
	}
	public File cheackforExpt(File file){
		
		File[] fList = file.listFiles();
		for (File f : fList) {
			if (f.isFile()){
				if (f.getName().contains("expt")){
					//return getExptID(f);
					return f;
				}
			}
			
		}
		
		
		return null;
		
	}
	public void setUser(User user){
		
		
	}
	public HashMap listFiles(User user,String study){
		
		HashMap fileMap= new HashMap();
		File directory;
		try{
			
			String folderName=user.getFolderName();
			if (study.equals("all")){
				directory = new File(folderBase+"\\"+folderName);
			}else{
				directory = new File(folderBase+"\\"+folderName+"\\"+study);
			}
			
			File[] fList = directory.listFiles();
			walkFiles(fList,fileMap);
		
		}catch(Exception e){
			System.out.println(e.getMessage());
			
		}
		
		
		return fileMap;
	}
	
	
	private void walkFiles(File[] files,HashMap fileM){
		
		for (File file : files) {
	        if (file.isDirectory()) {
	            System.out.println("Directory: " + file.getName());
	            HashMap dirctory= new HashMap();
	            fileM.put(file.getName(),dirctory );
	            walkFiles(file.listFiles(),dirctory); // Calls same method again.
	        } else {
	        	HashMap attrb= new HashMap();
	        	attrb.put("size", file.length());
	        	fileM.put(file.getName(),attrb );
	            System.out.println("File: " + file.getName());
	        }
	    }
		
	}
	
	
	public void setStudyIdfromFileSystem(User user){
		
		try{
			String folderName=user.getFolderName();
			File directory = new File(folderBase+folderName);
			File[] fList = directory.listFiles();
			for (File file : fList) {
				System.out.println(file.getName());
				if (file.isFile()) {
		          
		        } else if (file.isDirectory()) {
		        	
		        	if (!user.existStudy(file.getName())){//study doesnt exist in db
		        		File exptFile;
		        		if ((exptFile=cheackforExpt(file))!=null){// the folder is a study there is an expt file
		        			String exptID=getExptID(exptFile);
		        			api.createStudy(file.getName(), exptID, file.getName(), user.getID());
		        			user.addStudy(createStudy(exptID,file.getName()));
		        			
		        		}
		        		
		        	}
		        	
		        }
			}
			
		}catch(Exception e){
			System.out.println();
		}
		
		
	}
	
	

}
