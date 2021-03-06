package org.implicit.dasboard;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.uva.util.StudyValidator;

import static java.nio.file.FileVisitResult.*;

//UPDATED

public class Manager implements Serializable{
	
	String folderBase;
	String CREATEURL;
	String LOGINURL;
	String REDIRECTLOGIN;
	String os;
	String LOGAGAIN;
	String LOGIN;
	Integer userLocation;
	String projectPath;
	String downloadDir;
	String REDIRECTTTESTLOGIN;
	private static final long serialVersionUID = 1L;
	 
	public Manager(){
		
		//api.setMethod("cloude");
		if (System.getProperty("os.name").startsWith("Windows")) {
			folderBase="C:\\projects\\workspace\\rc5\\app\\user\\";
			projectPath = "bgoldenberg/dashBoard/";
			downloadDir ="ZipFolder";
			DbAPI api = DbAPI.getInstance(false);
			api.setMethod("cloude");
			System.out.println("Using folder:"+folderBase);
			LOGINURL = "user/bgoldenberg/dashBoard/newlogin.html";
			REDIRECTLOGIN = "user/bgoldenberg/dashBoard/dashboard5.html?cmd=start";
			REDIRECTTTESTLOGIN = "user/bgoldenberg/dashBoard/dashboard5.html?cmd=start";
			LOGAGAIN = "http://localhost/implicit/dashboard";
			LOGIN = "user/bgoldenberg/dashBoard/login.html";
			userLocation=6;
			os="windows";
		}else{
			folderBase="//home//dev2//user//";
			projectPath = "bgoldenberg//dashBoard//";
			downloadDir ="ZipFolder";
			LOGINURL = "user/bgoldenberg/dashBoard/newlogin.html";
			REDIRECTLOGIN="user/bgoldenberg/dashBoard/dashboard5.html?cmd=start";
			REDIRECTTTESTLOGIN = "user/bgoldenberg/dashBoard/dashboard5.html?cmd=start";
			LOGIN = "user/bgoldenberg/dashBoard/login.html";
			LOGAGAIN = "http://app-dev-01.implicit.harvard.edu/implicit/dashboard";
			DbAPI api = DbAPI.getInstance(false);
			api.setMethod("oracle");
			userLocation=4;
			os="unix";
			System.out.println("Using folder:"+folderBase);
			
		}
	}
	public Integer getUserLocation(){
		return this.userLocation;
	}
	public String getOs(){
		return os;
	}
	public String getFolderBase(){
		return folderBase;
	}
	public void buildUser(User user) throws Exception{
		System.out.println("starting buildUser");
		//setUserfromDB(user);
		setStudyIdFromDB(user);
		setStudyIdfromFileSystem(user);
		
	};
	public boolean AuthUser(User u){
		String key = u.getKey();
		HashMap userHash = new HashMap();
		DbAPI api = DbAPI.getInstance(false);
		userHash = api.find("Users", "OSFKey", key);
		if (userHash.size()>0) return true;
		return false;
		
		
		
	}
	protected String getpath(String study,String FileNamepath, Manager mng,User user){
		
		String path;
		String folder = user.getFolderName();
		if (study.equals("user")){
			path = mng.getFolderBase()+File.separator+FileNamepath;
		}else{
			if (!study.equals("all")){
				path = mng.getFolderBase()+File.separator+folder+File.separator+FileNamepath;
			}else{
				path = mng.getFolderBase()+File.separator+folder+File.separator+FileNamepath;
			}
		}
		return path;
			
	}
	public void setUserfromDBbyFolder(User user){
		DbAPI api = DbAPI.getInstance(false);
		String name = user.getFolderName();
		HashMap userHash = api.find("Users","FOLDER_NAME", name);
		if (userHash.size()>1) return;
		Map.Entry pairs = (Entry) userHash.entrySet().iterator().next();
		HashMap userRecord = (HashMap) pairs.getValue();
		String id = (String) userRecord.get("id");
		String folder =(String) userRecord.get("userFolder");		
	    String email = (String) userRecord.get("email");
	    String role = (String) userRecord.get("role");
	    user.setFolderName(folder);
	    user.setID(id);
	    user.setEmail(email);
	    user.setRole(role);
		
		
	}
	public void setUserfromDB(User user){
		DbAPI api = DbAPI.getInstance(false);
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
	    String role = (String) userRecord.get("role");
	    user.setFolderName(folder);
	    user.setUserName(name);
	    user.setID(id);
	    user.setEmail(email);
	    user.setRole(role);
		
	}
	
	public String studyValidator(User user,String study,String path,String filename){
		
		study = takeOutBraclets(study);
		String studyKey=""; //= File.separator+"user"+File.separator+user.getFolderName()+File.separator+study+File.separator+filename;
		String type = "";
		List errors=new ArrayList();
		List warnings=new ArrayList();
		if (study.equals("user")){
			studyKey = File.separator+"user"+File.separator+path.substring(0, path.length()-1);
		}else{
			if (study.equals("all")){
				studyKey = File.separator+"user"+File.separator+user.getFolderName()+File.separator+path.substring(0, path.length()-1);
				
			}else{
				Study s =user.getStudy(study);
				studyKey = File.separator+"user"+File.separator+user.getFolderName()+File.separator+s.getFolderName()+filename;
			}
		}
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
	public String getFile(User user,String study,String fileName,String path) throws Exception{
		
		
		String folderName=user.getFolderName();
		String filePath="";
		if (study.equals("user")){
			filePath = folderBase+File.separator+path;
		}else{
			if (!study.equals("all")){
				//mng.setStudyIdFromDB(user);
				Study s =user.getStudy(study);
				filePath = folderBase+File.separator+folderName+File.separator+path;
				
			}else{
				filePath = folderBase+File.separator+folderName+File.separator+path;
			}
			
		}
		File file = new File(filePath);
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
			throw e;
			
		}finally{
			try {
				if (br!=null) br.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw e;
			}
			
		}
		return sb.toString();
		
	}
	
	public void setStudyIdFromDB(User user){
		System.out.println("starting setStudyIdFromDB");
		DbAPI api = DbAPI.getInstance(false);
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
			if (status!=null){study.setStatus(status);}
			if (studyID !=null) {study.setID(studyID);}
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
		DbAPI api = DbAPI.getInstance(false);
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
	public Study createStudy(String exptid,String expFileName,String studyName,String folder,String studyID){
		Study study = new Study();
		if (!exptid.equals("not_set")){
			EXPT ex = new EXPT(exptid,expFileName);
			study.addstudyEXPTID(ex);
		}
		study.setStudyName(studyName);
		study.setfolder(folder);
		study.setStatus("NA");
		study.setID(studyID);
		
		return study;
		
	}
	//TODO
	public void updateStudy(String exptid,String exptFileName,String datagroup,String studyName,boolean existEXPT,boolean updateSchema,User user){
		
		DbAPI api = DbAPI.getInstance(false);
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
	        String name = (String) studiesRecord.get("name");
	        if (name.equals(studyName)){
	        	if (!existEXPT){
	    			api.insertIntoExptTable(Integer.parseInt(studyID), exptFileName, exptid);
	    			
	    		}else{
	    			api.updateExptTable(studyID,exptFileName,exptid);
	    			//api.updateTable("EXPT", "EXPT_ID", exptid, "STUDYID", studyID);
	    		}
	    		if (updateSchema) api.updateTable("studies", "study_schema", datagroup, "STUDYID", studyID);
	        }
		}
	        	
	        
		
		
		
		
		
		
//		HashMap study = api.find("Studies", "name", studyName);
//		Map.Entry pairs = (Entry) study.entrySet().iterator().next();
//		HashMap studyRecord = (HashMap) pairs.getValue();
//		String id = (String) studyRecord.get("id");
//		if (!existEXPT){
//			api.insertIntoExptTable(Integer.parseInt(id), exptFileName, exptid);
//			
//		}else{
//			api.updateTable("EXPT", "EXPT_ID", exptid, "STUDYID", id);
//		}
//		if (updateSchema) api.updateTable("studies", "study_schema", datagroup, "name", studyName);

	}
	
	public String getSchema(File file) throws Exception{
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
			throw e;
			
		}finally{  
			try {
				br.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw e;
			}
			
		}
	}
	public String getExptID(File file) throws Exception{
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
			throw e;
			
		}finally{  
			try {
				br.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw e;
			}
			
		}
	}
	public ArrayList cheackforExpt(File file){
		ArrayList files = new ArrayList<File>();
		File[] fList = file.listFiles();
		for (File f : fList) {
			if (f.isFile()){
				if (f.getName().contains(".expt")){
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
		if (userfolderName.indexOf(File.separator)!=-1){
			String[] splitArray = userfolderName.split("\\"+File.separator);
			int length = splitArray.length;
			userfolderName = splitArray[length-1];
			
		}
		String[] splitArray = studyPath.split("\\"+File.separator);
		for (int i=0;i<splitArray.length;i++){
			if (found){
				res=res+splitArray[i]+File.separator;	
			}
			if (splitArray[i].equals(userfolderName)){
				found=true;
			}
			
		}
		if (res.equals("")){
			//System.out.println("returning from getStudyRelativePath: "+studyPath);
			return studyPath;
		}else{
			//System.out.println("returning from getStudyRelativePath: "+res);
			return res;
		}
		
	}
	private void copyHashMap(HashMap copyto,HashMap copy,String folderName){
		Iterator i  = copy.entrySet().iterator();
		while (i.hasNext()) {
			Map.Entry pairs = (Map.Entry)i.next();
	        String key = (String) pairs.getKey();
	        key = folderName+File.separator+key;
	        String value  = (String)pairs.getValue();
	        copyto.put(key, value);
		}
	}
	public HashMap listFilesThreaded(User user,String study) throws Exception{
		
		HashMap fileMap= new HashMap();
		HashMap openStruct = new HashMap();
		HashMap res = new HashMap();
		File directory;
		ArrayList<Thread> threads = new ArrayList<Thread>();
		try{
			
			String folderName=user.getFolderName();
			if (study.equals("user")){
				directory = new File(folderBase);
			}else{
				if (study.equals("all")){
					directory = new File(folderBase+File.separator+folderName);
				}else{
					directory = new File(folderBase+File.separator+folderName);
				}
			}
			File[] fList = directory.listFiles();
			ArrayList <fileWalker> walkers = new ArrayList();
			for (File file : fList) {
				
				fileWalker walker = new fileWalker(file);
				walkers.add(walker);
				Thread t = new Thread(walker);
				threads.add(t);
		        t.start();
			}
			for (int i=0;i<threads.size();i++){ threads.get(i).join();}
			for (int i=0;i<walkers.size();i++){
				fileWalker walker = walkers.get(i);
				File file = walker.getFile();
				copyHashMap(openStruct,walker.getOpenStruct(),walker.getFile().getName());
				//openStruct.put(walker.getOpenStruct());
				fileMap.put(file.getName(),walker.getFileM());
			}
			walkers.clear();
		}catch(Exception e){
			System.out.println("error:"+e.getMessage());
			throw e;
		}
		res.put("filesys", fileMap);
		res.put("openfilesys", openStruct);
		return res;
	}
	
	public HashMap listFiles(User user,String study){
		
		HashMap fileMap= new HashMap();
		HashMap openStruct = new HashMap();
		HashMap res = new HashMap();
		File directory;
		try{
			
			String folderName=user.getFolderName();
			if (study.equals("user")){
				directory = new File(folderBase);
			}else{
				if (study.equals("all")){
					directory = new File(folderBase+File.separator+folderName);
					//System.out.println("directory"+directory);
				}else{
					directory = new File(folderBase+File.separator+folderName);
					//Study s = user.getStudy(study);
					//String studyFolder = s.getFolderName();
					//directory = new File(folderBase+"//"+folderName+"//"+studyFolder);
					//directory = new File(studyFolder);
				}
				
			}
			
			
			File[] fList = directory.listFiles();
			walkFiles(fList,directory,fileMap,openStruct);
		
		}catch(Exception e){
			System.out.println("error:"+e.getMessage());
			throw e;
		}
		
		res.put("filesys", fileMap);
		res.put("openfilesys", openStruct);
		return res;
	}
	
	protected boolean migrate(String folderName){
		
		File directory = new File(folderBase);
		File[] fList = directory.listFiles();
		
		return false;
		
		
	}
	private ArrayList migrateWaliking(File[] files,String folderName){
		
		ArrayList<File> userDirectory=new ArrayList();
		for (File file : files) {
	        if (file.isDirectory()) {
	            if (file.getName().equals(folderName)){
	            	userDirectory.add(file);
	            }
	            migrateWaliking(file.listFiles(),folderName); // Calls same method again.
	        } else {
	        	
	        }
	    }
		
		
		return userDirectory;
		
		
	}
	
	private void walkFiles(File[] files,File basepath,HashMap fileM,HashMap openStruct){
		
		for (File file : files) {
	        if (file.isDirectory()) {
	            //System.out.println("Directory: " + file.getName());
	        	String path = getStudyRelativePath(file.getAbsolutePath(),basepath.getAbsolutePath());
	        	openStruct.put(path, "close");
	            HashMap dirctory= new HashMap();
	            dirctory.put("path****", path);
	            fileM.put(file.getName(),dirctory );
	            walkFiles(file.listFiles(),basepath,dirctory,openStruct); // Calls same method again.
	        } else {
	        	HashMap attrb= new HashMap();
	        	//attrb.put("size", file.length());
	        	fileM.put(file.getName(),attrb );
	            //System.out.println("File: " + file.getName());
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
	
	private void walkFileSystem(File directory,User user) throws Exception{
		
		try{
			DbAPI api = DbAPI.getInstance(false);
			File[] fList = directory.listFiles();
			for (File file : fList) {
				//System.out.println(file.getName());
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
		        				String studyrelative = getStudyRelativePath(file.getAbsolutePath(),user.getFolderName());
		        				Integer id =api.createStudy(file.getName(), exptID,exptFileName,schema, studyrelative, user.getID());
			        			String studyID = String.valueOf(id);
			        			user.addStudy(createStudy(exptID,exptFileName,file.getName(),studyrelative,studyID));
		        				
		        			}else{//there is more then one expt
		        				String exptID=getExptID((File)files.get(0));
		        				String schema = getSchema((File)files.get(0));
		        				String exptFileName = ((File)files.get(0)).getName();
		        				String studyrelative = getStudyRelativePath(file.getAbsolutePath(),user.getFolderName());
		        				Integer id =api.createStudy(file.getName(), exptID,exptFileName,schema,studyrelative , user.getID());
		        				user.addStudy(createStudy(exptID,exptFileName,file.getName(),studyrelative,String.valueOf(id)));
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
			throw e;
		}
		
	}
	public void setStudyIdfromFileSystem(User user) throws Exception{
		System.out.println("starting setStudyIdfromFileSystem");
		try{
			String folderName=user.getFolderName();
			File directory = new File(folderBase+folderName);
			walkFileSystem(directory,user);
			
		}catch(Exception e){
			System.out.println();
			throw e;
		}
		
		
	}
	protected boolean deleteExptFromDB(User user,String studyName,String exptFileName){
		DbAPI api = DbAPI.getInstance(false);
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
