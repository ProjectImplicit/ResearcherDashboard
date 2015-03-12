package org.implicit.dashboard;
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

import org.apache.commons.lang.StringUtils;
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
	String changeForm;
	String removeForm;
	private static final long serialVersionUID = 1L;
	 
	public Manager(){
		
		//api.setMethod("cloude");
		if (System.getProperty("os.name").startsWith("Windows")) {
			folderBase="C:\\projects\\workspace\\rc5\\app\\user\\";
			projectPath = "research/dashBoard/";
			downloadDir ="C:\\projects\\workspace\\rc5\\app\\research\\dashBoard\\ZipFolder";
			changeForm = "C:\\projects\\workspace\\rc5\\app\\forms\\changeform.html";
			removeForm = "C:\\projects\\workspace\\rc5\\app\\forms\\removeform.html";
			DbAPI api = DbAPI.getInstance(false);
			api.setMethod("cloude");
			System.out.println("Using folder:"+folderBase);
			LOGINURL = "research/dashBoard/newlogin.html";
			REDIRECTLOGIN = "research/dashBoard/dashboard5.html?cmd=start";
			REDIRECTTTESTLOGIN = "research/dashBoard/dashboard5.html?cmd=start";
			LOGAGAIN = "http://localhost/implicit/dashboard";
			LOGIN = "research/dashBoard/login.html";
			userLocation=6;
			os="windows";
		}else{
			folderBase="//home//dev2//user//";
			projectPath = "research//dashBoard//";
			downloadDir ="//home//dev2//app//research//dashBoard//ZipFolder";
			changeForm = "//home//dev2//app//forms//changeform.html";
			removeForm = "//home//dev2//app//forms//removeform.html";
			LOGINURL = "research/dashBoard/newlogin.html";
			REDIRECTLOGIN="research/dashBoard/dashboard5.html?cmd=start";
			REDIRECTTTESTLOGIN = "research/dashBoard/dashboard5.html?cmd=start";
			LOGIN = "research/dashBoard/login.html";
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
	public boolean AuthUser(User u) throws Exception{
		String key = u.getKey();
		HashMap userHash = new HashMap();
		DbAPI api = DbAPI.getInstance(false);
		userHash = api.find("Users", "OSFKey", key);
		if (userHash.size()>0) return true;
		return false;
		
		
		
	}
	protected String getPath(String folderUnder,String folderToCreate,String identifaier,User user,Manager mng ){
		
		String path="";
		String userFolder = user.getFolderName();
		if (identifaier.equals("user")){
			path = mng.getFolderBase()+File.separator+folderUnder+File.separator+folderToCreate;
		}else{
			if (!identifaier.equals("all")){
				if (folderUnder.equals(File.separator)){
					Study s =user.getStudy(identifaier);
					String relativePath = mng.getStudyRelativePath(s.getFolderName(),user.getFolderName());
					path = mng.getFolderBase()+File.separator+userFolder+File.separator+relativePath+File.separator+folderToCreate;
				}else{
					path = mng.getFolderBase()+File.separator+userFolder+File.separator+folderUnder+File.separator+folderToCreate;
				}
			}else{
				if (folderUnder.equals(File.separator)){
					path = mng.getFolderBase()+File.separator+userFolder+File.separator+folderToCreate;
					
				}else{
					path = mng.getFolderBase()+File.separator+userFolder+File.separator+folderUnder+File.separator+folderToCreate;
				}
			}
			
		}
		return path;
	}
	protected boolean createFolder(String folderToCreate,String study,String id,User user) throws Exception{
		String path = this.getpath(study, id, user);
		path=path+File.separator+folderToCreate;
		FileUploadManager fileMng = new FileUploadManager();
		boolean result  = fileMng.createFolder(path);
		return result;
		
	}
	protected boolean rename(String id,String newName,Manager mng,User user) throws Exception{
		try{
			boolean res=false;
			FileObj obj = user.getComposite().getUnit(id);
			String path = obj.getPath();
			String[] array = path.split("\\"+File.separator);
			array[array.length-1]=newName;
			String dest = StringUtils.join(array,File.separator);
			FileUploadManager fileMng = new FileUploadManager();
			return fileMng.rename(path, dest);
			
			
			
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
	}
	protected String deleteFile(String id,String key,User user,String study) throws Exception{
		try{
			String msg="";
			String pathToFile = this.getpath(study, id, user);
			FileUploadManager fileMng = new FileUploadManager();
			File folder = new File(pathToFile);
			if (isStudy(user, folder)) throw new Exception("Cannot delete study folder" );
			msg =fileMng.deleteFile(user,this,pathToFile);
			return msg;
			
		}catch(Exception e){

			e.printStackTrace();
			throw e;
		}
		
		
		
	}
	protected String getpath(String study,String FileNamepathorID, User user) throws Exception{
		
		try{
			String path = "";
			String folder = user.getFolderName();
			if (study.indexOf("_")==0){
				if (study.contains("USER")){
					path = this.getFolderBase()+folder;
				}
				if (study.contains("ROUTER")){
					String[] array = study.split("_");
					String studyID = array[2];
					String studyFolder = user.getStudyByID(studyID).getFolderName();
					path = this.getFolderBase()+folder+File.separator+studyFolder;
				}
				if (study.contains("ID")){
					FileComposite compose = user.getComposite();
					FileObj obj = compose.getUnit(FileNamepathorID);
					path = obj.getPath();
		
				}
				if (study.contains("PATH")){
					return downloadDir+File.separator+FileNamepathorID;
				}
				if (study.contains("CURRENT")){
					FileComposite compose = user.getComposite();
					FileObj obj=compose.getCurrentFolder();
					path = obj.getPath();
				}
			}else{
				if (study.equals("user")){
					path = this.getFolderBase()+FileNamepathorID;
				}else{
					if (!study.equals("all")){
						path = this.getFolderBase()+folder+File.separator+FileNamepathorID;
					}else{
						path = this.getFolderBase()+folder+File.separator+FileNamepathorID;
					}
				}
			}
			
			return path;
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
			
	}
	public void setUserfromDBbyFolder(User user) throws Exception{
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
	public void setUserfromDB(User user) throws Exception{
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
	
	public String studyValidator(String path,User user){
		
		//study = takeOutBraclets(study);
		//String studyKey=""; //= File.separator+"user"+File.separator+user.getFolderName()+File.separator+study+File.separator+filename;
		String studyKey =  File.separator+"user"+File.separator+user.getFolderName()+File.separator+this.getStudyRelativePath(path, user.getFolderName());
		String type = "";
		List errors=new ArrayList();
		List warnings=new ArrayList();
//		if (study.equals("user")){
//			studyKey = File.separator+"user"+File.separator+path.substring(0, path.length()-1);
//		}else{
//			if (study.equals("all")){
//				studyKey = File.separator+"user"+File.separator+user.getFolderName()+File.separator+path.substring(0, path.length()-1);
//				
//			}else{
//				Study s =user.getStudy(study);
//				studyKey = File.separator+"user"+File.separator+user.getFolderName()+File.separator+s.getFolderName()+filename;
//			}
//		}
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
		
		
//		String folderName=user.getFolderName();
//		String filePath="";
//		if (study.equals("user")){
//			filePath = folderBase+File.separator+path;
//		}else{
//			if (!study.equals("all")){
//				//mng.setStudyIdFromDB(user);
//				Study s =user.getStudy(study);
//				filePath = folderBase+File.separator+folderName+File.separator+path;
//				
//			}else{
//				filePath = folderBase+File.separator+folderName+File.separator+path;
//			}
//			
//		}
		String filePath = this.getpath(study, path, user);
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

			e.printStackTrace();
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
	
	public void setStudyIdFromDB(User user) throws Exception{
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
	protected String getUserfolder(String path){
		String[] array = path.split("\\" + File.separator);
		for (int i=0;i<array.length;i++){
			if (array[i].equals("user")){
				return array[i+1];
			}
		}
		return "";
		
	}
	public boolean isStudy(User user,File folder) throws Exception{
		try{
			String folderPath = folder.getAbsolutePath();
			String folderName = folder.getName();
			Study s = user.getStudy(folderName);
			if (s!=null){
				String studypath = s.getFolderName();
				String relativeFolderPath = this.getStudyRelativePath(folderPath, user.getFolderName());
				if (relativeFolderPath.equals(studypath)){
					return true;
				}else{
					return false;
				}
				
			}else{
				if (user.getRole().equals("SU")){
					if (!folderPath.contains(user.getFolderName())){
						String userPathFolder = getUserfolder(folderPath);
						User regularUser = new User();
						regularUser.setFolderName(userPathFolder);
						this.setUserfromDBbyFolder(regularUser);
						this.setStudyIdFromDB(regularUser);
						//this.setStudyIdfromFileSystem(regularUser);
						
						Study regularS = regularUser.getStudy(folderName);
						if (regularS!=null){
							String studypath = regularS.getFolderName();
							String relativeFolderPath = this.getStudyRelativePath(folderPath, regularUser.getFolderName());
							if (relativeFolderPath.equals(studypath)){
								return true;
							}else{
								return false;
							}
						}else{
							return false;
						}
						//throw new Exception ("Super user cannot modify user folder");
					}else{
						return false;
					}
					
					
				}else{
					return false;
					
				}

			}
			
		}catch(Exception e){

			e.printStackTrace();
			throw e;
		}
	}
	public boolean isStudy(User user,FileObj folder) throws Exception{
		try{
			String folderPath = folder.getPath();
			String folderName = folder.getName();
			Study s = user.getStudy(folderName);
			if (s!=null){
				String studypath = s.getFolderName();
				String relativeFolderPath = this.getStudyRelativePath(folderPath, user.getFolderName());
				if (relativeFolderPath.equals(studypath)){
					return true;
				}
				
			}else{
				if (user.getRole().equals("SU")){
					if (!folderPath.contains(user.getFolderName())){
						String userPathFolder = getUserfolder(folderPath);
						User regularUser = new User();
						regularUser.setFolderName(userPathFolder);
						this.setUserfromDBbyFolder(regularUser);
						this.setStudyIdFromDB(regularUser);
						//this.setStudyIdfromFileSystem(regularUser);
						Study regularS = regularUser.getStudy(folderName);
						if (regularS!=null){
							String studypath = regularS.getFolderName();
							String relativeFolderPath = this.getStudyRelativePath(folderPath, regularUser.getFolderName());
							if (relativeFolderPath.equals(studypath)){
								return true;
							}else{
								return false;
							}
						}else{
							return false;
						}
						//throw new Exception ("Super user cannot modify user folder");
					}else{
						return false;
					}
					
					
				}else{
					return false;
					
				}

			}
			
		}catch(Exception e){
			e.printStackTrace();

			throw e;
		}
		return false;
	}
	
	public boolean isStudy(String name) throws Exception{
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
	public void updateStudy(String exptid,String exptFileName,String datagroup,String studyName,boolean existEXPT,boolean updateSchema,User user) throws Exception{
		
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
	protected HashMap drillUp (User user){
		try{
			FileComposite composite = user.getComposite();
			FileUploadManager fileSys = new FileUploadManager();
			fileSys.drillUp(composite);
			HashMap res = new HashMap();
			HashMap topsysHash = composite.toHashMap();
			res.put("filesys", topsysHash);		
			
			return res;
			
		}catch(Exception e ){

			System.out.println(e.getStackTrace());
			throw e;
		}
	}
	protected HashMap drillDown (User user,String id){
		try{
			FileComposite composite = user.getComposite();
			FileUploadManager fileSys = new FileUploadManager();
			fileSys.drillDown(composite,id);
			HashMap res = new HashMap();
			HashMap topsysHash = composite.toHashMap();
			res.put("filesys", topsysHash);		
			
			return res;
		}catch(Exception e){

			e.printStackTrace();
			throw e;
		}
		
	}
	public HashMap listFiles(User user,String study) throws Exception{
		
		HashMap fileMap= new HashMap();
		HashMap openStruct = new HashMap();
		HashMap res = new HashMap();
		File directory;
		try{
			String path = this.getpath(study, "",user);
			directory = new File(path);
			if (study.indexOf("_")==0){
				FileUploadManager fileSys = new FileUploadManager();
				FileComposite topSys = fileSys.getTopLevelFiles(path);
				user.setFileSystem(topSys);
				HashMap topsysHash = topSys.toHashMap();
				res.put("filesys", topsysHash);
				
			}else{
				File[] fList = directory.listFiles();
				walkFiles(fList,directory,fileMap,openStruct);
				res.put("filesys", fileMap);
				res.put("openfilesys", openStruct);
			}
			

			
			
		
		}catch(Exception e){
			System.out.println("error:"+e.getMessage());
			throw e;
		}
		
	
		return res;
	}
	
	/*
	 * 	Delete study by first delete the file system 
	 *  then delete the database trail and updtae the 
	 *  User memory object.
	 * 
	 */
	protected String deleteStudy(String studyid,User user,Manager mng,DbAPI api) throws Exception{
		try{
			FileUploadManager fileMng = new FileUploadManager();
			String msg="";
			if (user.deleteStudy(studyid, api, mng, fileMng)){
				msg="Study "+ user.getStudyByID(studyid).getName()+ " has been deleted.";
			}
			return msg;
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
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
	
	public void setUserFileSystem(User user,Manager mng,String study) throws Exception{
		String path = this.getpath(study, "",user);
		FileUploadManager fileMng = new FileUploadManager();
		FileComposite filesys = fileMng.getTopLevelFiles(path);
		user.setFileSystem(filesys);
		
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
			e.printStackTrace();
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
	protected boolean deleteExptFromDB(User user,String studyName,String exptFileName) throws Exception{
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
