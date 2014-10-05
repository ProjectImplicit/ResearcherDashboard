package org.implicit.dasboard;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.uva.util.StudyValidator;

import static java.nio.file.FileVisitResult.*;


public class Manager {
	
	String folderBase; 
	DbAPI api = DbAPI.getInstance(false);
	
	//1. get study ids from db
	//2. go over the folder of that user and get study folders 
	public Manager(){
		
		api.setMethod("cloude");
		if (System.getProperty("os.name").startsWith("Windows")) {
			folderBase="C:\\projects\\workspace\\rc5\\app\\user\\";
			System.out.println("Using folder:"+folderBase);
			
		}else{
			folderBase="//home//dev2//user//";
			System.out.println("Using folder:"+folderBase);
			
		}
	}
	public String getFolderBase(){
		return folderBase;
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
		//api.setMethod("cloude");
		HashMap userHash = api.find("Users","OSFKey", key);
		if (userHash.size()>1) return;
		Map.Entry pairs = (Entry) userHash.entrySet().iterator().next();
		HashMap userRecord = (HashMap) pairs.getValue();
		String id = (String) userRecord.get("id");
		String folder =(String) userRecord.get("userFolder");		
	    String name = (String) userRecord.get("userName");
	    String email = (String) userRecord.get("email");
	    user.setFolderName(folder);
	    user.setUserName(name);
	    user.setID(id);
	    user.setEmail(email);
		
	}
	
	public String studyValidator(User user,String study,String filename){
		
		study = takeOutBraclets(study);
		String studyKey = File.separator+"user"+File.separator+user.getFolderName()+File.separator+study+File.separator+filename;
		String type = "";
		List errors=new ArrayList();
		List warnings=new ArrayList();
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
		study = takeOutBraclets(study);
		File file = new File(folderBase+File.separator+folderName+File.separator+study+File.separator+filename);
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
  	        
        	Integer expt = Integer.parseInt((String) studiesRecord.get("study_exptid"));
	        String name = (String) studiesRecord.get("name");
	        String folder = (String) studiesRecord.get("folder_name");
			String status = (String) studiesRecord.get("status");
			HashMap expObj = api.find("EXPT", "STUDYID", studyID);
			Iterator exptIT = expObj.entrySet().iterator();
			ArrayList exptArray = new ArrayList<EXPT>();
			while (exptIT.hasNext()){
				Map.Entry EXPTpairs = (Map.Entry)exptIT.next();
				String exptpid = (String) EXPTpairs.getKey();
		        HashMap exptuserRecord  = (HashMap)EXPTpairs.getValue();
		        String exptFileName = (String) exptuserRecord.get("EXPT_FILE_NAME");
		        String exptID = (String) exptuserRecord.get("EXPT_ID");
		        EXPT ex = new EXPT(exptID,exptFileName);
		        exptArray.add(ex);
				
			}
			
			
			Study study = new Study();
			if (expt!=null) {study.setstudyEXPTID(exptArray);}
			if (name!=null){study.setStudyName(name);}
			if (folder!=null){study.setfolder(folder);}
			if (status!=null){study.setstatus(status);}
			user.addStudy(study);
	        	
	        
	        
	        
		}
	}
	
	protected String takeOutBraclets(String name){
		
		if (name.contains("(")){
			String[] names = name.split("\\(");
			return names[0];
		}else{
			return name;
		}
		
		
	}
	public String trim(String name){
		String trimmed = new String(name);
		trimmed = trimmed.substring(0,trimmed.length()-1);
		return trimmed;
		
	}
	public boolean isStudy(String name){
		//name =trim(name);
		HashMap studys = api.find("Studies", "name",name);
		if (studys.size() > 0) return true;
		return false;
		
	}
//	public Study getStudy(String id){
//		
//		Study study = new Study();
//		HashMap studys = api.find("Studies", "id",id);
//	    Iterator studyIT = studys.entrySet().iterator();
//	    Map.Entry pairs = (Map.Entry)studyIT.next();
//	    HashMap studyRecord = (HashMap) pairs.getValue();
//	    study.setStudyName((String)studyRecord.get("studyName"));
//	    
//	    study.setstudyEXPTID((String)studyRecord.get("exptID"));
//	    
//		
//		
//		return study;
//	}
	public Study createStudy(String exptid,String expFileName,String studyName){
		Study study = new Study();
		EXPT ex = new EXPT(exptid,expFileName);
		study.addstudyEXPTID(ex);
		study.setStudyName(studyName);
		
		return study;
		
	}
	public void updateStudy(String exptid,String exptFileName,String datagroup,String studyName,boolean existEXPT,boolean updateSchema){
		HashMap study = api.find("Studies", "name", studyName);
		Map.Entry pairs = (Entry) study.entrySet().iterator().next();
		HashMap studyRecord = (HashMap) pairs.getValue();
		String id = (String) studyRecord.get("id");
		if (!existEXPT){
			api.insertIntoExptTable(Integer.parseInt(id), exptFileName, exptid);
			
		}else{
			api.updateTable("EXPT", "EXPT_ID", exptid, "STUDYID", id);
		}
		if (updateSchema) api.updateTable("studies", "study_schema", datagroup, "name", studyName);

	}
	public String getSchema(File file){
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
	        		exptID = list[3];
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
	public ArrayList cheackforExpt(File file){
		ArrayList files = new ArrayList<File>();
		File[] fList = file.listFiles();
		for (File f : fList) {
			if (f.isFile()){
				if (f.getName().contains("expt")){
					//return getExptID(f);
					files.add(f);
				}
			}
			
		}
		
		
		return files;
		
	}
	
	protected String getStudyRelativePath(String studyPath,String userfolderName){
		String res="";
		Boolean found=false;
		String[] splitArray = studyPath.split("\\\\");
		for (int i=0;i<splitArray.length;i++){
			if (found){
				res=res+splitArray[i]+"\\";	
			}
			if (splitArray[i].equals(userfolderName)){
				found=true;
			}
			
		}
		
		return res;
	}
	public HashMap listFiles(User user,String study){
		
		HashMap fileMap= new HashMap();
		File directory;
		try{
			
			String folderName=user.getFolderName();
			
			if (study.equals("all")){
				directory = new File(folderBase+File.separator+folderName);
				System.out.println("directory"+directory);
			}else{
				Study s = user.getStudy(study);
				String studyFolder = s.getFolderName();
				directory = new File(folderBase+"//"+folderName+"//"+studyFolder);
				//directory = new File(studyFolder);
			}
			
			File[] fList = directory.listFiles();
			walkFiles(fList,fileMap);
		
		}catch(Exception e){
			System.out.println("error:"+e.getMessage());
			
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
	
	protected String getNameNoExtention(File file){
		String name = file.getName();
		String[] names =name.split("\\.");
		return names[0];
	}
//	protected void createStudyinDB(String studyName, String exptID,String exptFileName,String datagroup, String path, String userID){
//		api.createStudy(studyName, exptID,exptFileName,datagroup, path, userID);
//		
//	}
	
	private void walkFileSystem(File directory,User user){
		
		try{
			File[] fList = directory.listFiles();
			for (File file : fList) {
				System.out.println(file.getName());
				if (file.isFile()) {
		          
		        }else{
		        	if (!user.existStudy(file.getName())){//study doesnt exist in db
		        		File exptFile;
		        		ArrayList files = cheackforExpt(file);
		        		if (files.size()>0){// the folder is a study there is an expt file
		        			if (files.size()==1){
		        				String exptID=getExptID((File)files.get(0));
		        				String schema = getSchema((File)files.get(0));
		        				String exptFileName = ((File)files.get(0)).getName();
		        				
			        			api.createStudy(file.getName(), exptID,exptFileName,schema, getStudyRelativePath(file.getAbsolutePath(),user.getFolderName()), user.getID());
			        			user.addStudy(createStudy(exptID,exptFileName,file.getName()));
		        				
		        			}else{//there is more then one expt
		        				String exptID=getExptID((File)files.get(0));
		        				String schema = getSchema((File)files.get(0));
		        				String exptFileName = ((File)files.get(0)).getName();
		        				Integer id =api.createStudy(file.getName(), exptID,exptFileName,schema, getStudyRelativePath(file.getAbsolutePath(),user.getFolderName()), user.getID());
		        				user.addStudy(createStudy(exptID,exptFileName,file.getName()));
		        				for (int i=1;i<files.size();i++){
		        					File exptfile = (File) files.get(i);
		        					exptID=getExptID(exptfile);
		        					//schema = getSchema((File)files.get(0));
		        					api.insertIntoExptTable(id, exptfile.getName(), exptID);
		        					Study s =user.getStudy(file.getName());
		        					EXPT e = new EXPT(exptID,exptfile.getName());
		        					s.addstudyEXPTID(e);
		        							        					
		        					
		        					
		        				}
		        			}
		        			
		        			
		        		}
		        	}else{//study exist in db
		        		
		        	}
		        	walkFileSystem(file,user);
		        }//else
			}// for
			
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
		
	}
	public void setStudyIdfromFileSystem(User user){
		
		try{
			String folderName=user.getFolderName();
			File directory = new File(folderBase+folderName);
			walkFileSystem(directory,user);
			
		}catch(Exception e){
			System.out.println();
		}
		
		
	}
	protected boolean deleteExptFromDB(User user,String studyName,String exptFileName){
		String userID = user.getID();
		String studyID = null;
		boolean found=false;
		HashMap records =api.find("UsersStudies","USERID", userID);
		Iterator it = records.entrySet().iterator();
		while (it.hasNext()&& !found) {
			Map.Entry pairs = (Map.Entry)it.next();
	        String pid = (String) pairs.getKey();
	        HashMap userRecord  = (HashMap)pairs.getValue();
	        studyID = (String) userRecord.get("StudyID");
	        HashMap studiesRecords = api.find("Studies", "STUDYID", studyID);
	        Map.Entry studiesPairs = (Entry) studiesRecords.entrySet().iterator().next();
			HashMap studyRecord = (HashMap) studiesPairs.getValue();
			String name = (String) studyRecord.get("name");
	        if (name.equals(studyName)){
	        	found=true;
	        }
		}
		api.deleteFromExptTable(studyID, exptFileName);
		
		return true;
	}
	
	

}
