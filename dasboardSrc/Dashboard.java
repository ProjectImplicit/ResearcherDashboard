package org.implicit.dashboard;

import static org.junit.Assert.assertNotNull;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.util.List;
import java.util.Map.Entry;

import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.google.gson.Gson;

 
//UPDATED

/**
 * 
 *  
 * 
 * Main servlet controller. 
 * 
 * The Servlet recieves requests from the client and
 * 
 * return responce in the form of a JSON object.
 * 
 * Date created : 29-Jul-2014
 * 
 * @version $Revision: 10728 $
 * 
 * @author Ben G 
 * 
 * 
 * 
 */



public class Dashboard extends HttpServlet implements javax.servlet.Servlet{
	
	
	
	/**
	 * 
	 * Handel Get request redirectde it to doPost.
	 * 
	 * 	 
	 * @param 
	 * 			request and response sevlet objects.
	 *            
	 * 
	 * @return void
	 * 
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)  throws IOException { 
		try {
			System.out.println("starting do get");
			doPost(request,response);
		} catch (ServletException e) {
			e.printStackTrace();
		}
	} 
	
	/**
	 * 
	 * Handel POST and redirectde GET request.
	 * 
	 * Returns the Data requested as a JSON object.
	 * 
	 * 	 
	 * @param 
	 * 			request and response sevlet objects.
	 *            
	 * 
	 * @return JSON object
	 * 
	 **/
	
	public void doPost(HttpServletRequest request,HttpServletResponse response)
			throws IOException, ServletException{
		
		//PrintWriter out = response.getWriter();
		System.out.println("starting dashboard");
		ServletOutputStream out = response.getOutputStream();
		String res = "";
		String cmd="";
		String APIcmd = null;
		String key =null;
		User user=null;
		Manager mng=null;
				
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		try{
			if (isMultipart){
				ManageFiles(request,response);
			}else{
				
				DbAPI api = DbAPI.getInstance(false);
				//response.setContentType("application/json");
				StringBuffer requestURL = request.getRequestURL();
				String completeURL = requestURL.toString();
				String[] arr = completeURL.split("/");
				
				if (arr.length>5) {// if this is a get request
					cmd  = arr[5];
				}else{// if this is a post request
					if (request.getParameter("cmd")!=null) cmd =request.getParameter("cmd"); 
					if (request.getParameter("api")!=null) APIcmd = request.getParameter("api"); 
					if (request.getParameter("OSFKey")!=null) key =request.getParameter("OSFKey"); 
				}
				System.out.println("cmd is: "+cmd);
				if (!cmd.equals("login") && !cmd.equals("newpass") && !cmd.equals("")){
					HttpSession session = request.getSession(false);
					
					try{
						System.out.println("starting session cheack");
						if (session.getAttribute("userobject")==null){//logged out
							System.out.println("inside timed out");
							Manager newMng = new Manager(); 
							String url = new String (newMng.LOGAGAIN);
							response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
						    response.setHeader("Location", response.encodeRedirectURL(url.toString()));
						    response.flushBuffer();
							return;
						}else{
							user = (User )session.getAttribute("userobject");
							mng = (Manager )session.getAttribute("mng");
						}
						
					}catch(Exception e){
						System.out.println(e.getMessage());
						System.out.println("log out exception");
						Manager newMng = new Manager(); 
						String url = new String (newMng.LOGAGAIN);
						response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
					    response.setHeader("Location", response.encodeRedirectURL(url.toString()));
					    response.flushBuffer();
						return;
						
					}
					
					
				}
				
				if (APIcmd!=null){
					//res = processAPICalls(request,api);
				}else{
					if (key!=null){
						
						//user.setKey(key);
						if (cmd.equals("Auth")){
							if (mng.AuthUser(user)){
								res="OK";
							}else{
								res = "NOT FOUND";
							}
						}
						if(cmd.equals("getstudies")){
							System.out.println("starting getstudies");
							mng.buildUser(user);
							HashMap studyNames = user.getNames();
							String names = JSONValue.toJSONString(studyNames);
							out.write(names.getBytes("UTF8"));
							out.flush();
						}   
					}else{ 
						if (cmd.equals("configure")){
							configureFileModule(request,user,mng,out);
						}
						if (cmd.equals("multipledelete")){
							res=multipleDelete(request,user,mng);
						}
						if (cmd.equals("drilldown")){
							drillDown(request,user,mng,out);
							
						}
						if (cmd.equals("drillup")){
							drillUp(request,user,mng,out);
						}
						if (cmd.equals("rename")){
							res = rename(request,user,mng,api);
							
						}
						if (cmd.equals("create")){
							res = createFolder(arr,request,response);
	
						}
						if (cmd.equals("delete")){
							res = deleteFile(request,response,mng,user);
						}
						if (cmd.equals("filesys")){
							processFileSys(arr,key,mng,out,user);
						}				   
						if (cmd.equals("validate")){
							processValidate(request,key,mng,out,user);
						}
						if (cmd.equals("view")){
							downLoadFile(arr,request,response,cmd,out,false);							
						}
						if (cmd.equals("download") ){
							downLoadFile(arr,request,response,cmd,out,true);
						}
						if (cmd.equals("createstudy") ){
							res=createStudy(arr,api,user,mng);
						}
						if (cmd.equals("studyvalidate")){
							
							String errors = studyValidator(request,api,response,user,mng);
							out.print(errors);
							out.flush();
							
						}
						if (cmd.equals("getexpt")){
							ArrayList EXPTres= getEXPT(arr,mng,user);
							HashMap exptObj = new HashMap();
							for (int i=0;i<EXPTres.size();i++){
								EXPT ex= (EXPT) EXPTres.get(i);
								exptObj.put("exptID."+String.valueOf(i), ex.expt_id);
								exptObj.put("exptFile."+String.valueOf(i), ex.exptFileName);
								//exptObj.put("exptName."+String.valueOf(i), ex.exptFileName);
							}
							
							String expt = JSONValue.toJSONString(exptObj);
							out.write(expt.getBytes("UTF8"));
							out.flush();
							
							
						}
						if (cmd.equals("getname")){
							System.out.println("starting getname");
							HashMap name = getName(user,mng);
							String expt = JSONValue.toJSONString(name);
							out.write(expt.getBytes("UTF8"));
							out.flush();
							 
						}
						if (cmd.equals(("exist"))){
							
							String userFolder = user.getFolderName();
							String uploadFolder = request.getParameter("path");
							String name = request.getParameter("file");
							String study = request.getParameter("study");
     						String path = mng.getpath(study, "", user);
     						path =path + File.separator+name;
							File file = new File(path);
							if (file.exists()) {
								res="yes";
							}else{
								res="no";
							}
						}
						if (cmd.equals(("register"))){
							register(request,api);
						}
						if (cmd.equals("downloadFolder")){
							res = zipfolder(request,response,mng);
							
							
						}
						if (cmd.equals("login")){
							res =login(request,api,res,response);
						}
						if (cmd.equals("newpass")){
							createNewPassword(request,api,response);
						}
						
						if (cmd.equals("review")){
							submitForreview(request,api,response,user);
						}
						if (cmd.equals("")){
							Manager startmng = new Manager();
							String url = startmng.LOGIN;
							RequestDispatcher rd = request.getRequestDispatcher(url);
							rd.forward(request, response);
						}
						if (cmd.equals("logout")){
							System.out.println("inside log out");
							HttpSession session = request.getSession(false);
							session.removeAttribute("userobject");
							String url = new String (mng.LOGAGAIN);
							session.removeAttribute("mng");
							res=url;
						}
						if (cmd.equals("deleteStudy")){
							res=mng.deleteStudy(request.getParameter("studyid"),user,mng,api);
							
						}
						if (cmd.equals("remove")){
							res = submitRemove(request, mng);
						}
						if (cmd.equals("change")){
							res = submitChange(request, mng);
						}
						if (cmd.equals("renamestudy")){
							renameStudy(request,user,mng,api);
						}
						if (cmd.equals("refreshstudy")){
							user.refreshStudyFromDB(mng);
							HashMap result = new HashMap();
							HashMap studyNames = user.getNames();
							String names = JSONValue.toJSONString(studyNames);
							out.write(names.getBytes("UTF8"));
							out.flush();
							
						}


					}//else end
				}//else end
			}//else
					
		}catch(Exception e){
			System.out.println("error in dashboard ");
			e.printStackTrace();
			res = "error: "+e.getMessage();
			out.write(res.getBytes("UTF8"));
			out.flush();
			out.close();
			
		}
		finally{
			if (res.equals("redirect")) return;
			out.write(res.getBytes("UTF8"));
			out.flush();
			out.close();
		}
	}
	
	protected String submitRemove (HttpServletRequest request,Manager mng) throws IOException{
		try{
			FileWriter out;
			String tr = request.getParameter("tr");
			String filepath = mng.removeForm;
			out = new FileWriter(filepath, true);
			out.write(tr);
	        out.close();
			return "Study remove request submitted";
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
	
	}
	protected String submitChange (HttpServletRequest request,Manager mng) throws IOException{
		try{
			FileWriter out;
			String tr = request.getParameter("tr");
			String filepath = mng.changeForm;
			out = new FileWriter(filepath, true);
	        out.write(tr);
	        out.close();
			return "Study changet request submitted";
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
		
	}
	protected String zipfolder(HttpServletRequest request,HttpServletResponse response,Manager mng) throws Exception{
		
		String returnPath="";
		ZipDirectory zipUtil = new ZipDirectory();
		String id  = request.getParameter("path");
		String study =  request.getParameter("study");
		User user = (User) request.getSession().getAttribute("userobject");
		FileComposite composite = user.getComposite();
		FileObj obj =composite.getUnit(id);
		String path = obj.getPath();
		//String path =mng.getpath(study, directoryToDownload,user);
		String DownloadDirctory = mng.downloadDir;
		try {
			returnPath = zipUtil.zip(path,DownloadDirctory);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		}
		
		return returnPath;
		
		
		
	}
	protected String multipleDelete(HttpServletRequest request,User user,Manager mng) throws Exception{
		String study = request.getParameter("study");
		String model = request.getParameter("modelarray");
		String msg="";
		HashMap res= new HashMap();
		Object obj=JSONValue.parse(model);
		JSONArray array=(JSONArray)obj;
		for (int i=0;i<array.size();i++){
			JSONObject obj1 = (JSONObject)array.get(i);
			String id = (String) obj1.get("id");
			if (i==array.size()-1){
				msg=msg+mng.deleteFile(id,"", user, study);
			}else{
				msg=msg+mng.deleteFile(id,"", user, study)+",";
			}
			
		}
		if (!msg.equals("")){
			msg="alert:The following Files were deleted "+msg;
		}
		user.getComposite().refresh();
		res.put("msg", msg);
		res.put("filesys", user.getComposite().toHashMap());
		String jsonText = JSONValue.toJSONString(res);
		return jsonText;
		
		
	}
	protected String studyValidator(HttpServletRequest request,DbAPI api,HttpServletResponse response,User user,Manager mng) throws Exception{
		String id = request.getParameter("path");
		String study = request.getParameter("study");
		String name = request.getParameter("filename");
		String path = mng.getpath(study, id, user);
		String errors = mng.studyValidator(path,user);
		return errors;
		
	}
	
	protected void submitForreview(HttpServletRequest request,DbAPI api,HttpServletResponse response,User user){
		String studyname = request.getParameter("studyname");
		Study s = user.getStudy(studyname);
		String studyID = s.getID();
		api.updateTable("studies", "status", "UR", "studyid", studyID);
	}
	
	protected void createNewPassword(HttpServletRequest request,DbAPI api,HttpServletResponse response) throws Exception{
		System.out.println("starting createNewPassword ");
		String pass = request.getParameter("pass");
		PasswordHash passHash = new PasswordHash();
		String saltedHash = new String("");
		try {
			saltedHash = passHash.createHash(pass);
			System.out.println("saltedhash:  "+saltedHash);
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			System.out.println("error in createNewPassword "+e.getMessage());
			e.printStackTrace();
			throw e;
		} catch (InvalidKeySpecException e) {
			System.out.println("error in createNewPassword "+e.getMessage());
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		}
		try {
			String[] saltedArr = saltedHash.split(":");
			String salt = saltedArr[1];
			String hashedPas = saltedArr[2];
			System.out.println("before sessions");
			HttpSession session = request.getSession(false);
			System.out.println("inside new pass session is:"+session.getId());
			if (session.getAttribute("userobject")==null){
				System.out.println("usr is null");
			}else{
				System.out.println("usr is not null");
			}
				
			User user = (User) session.getAttribute("userobject");
			System.out.println("user: "+user.getUserName());
			Manager mng = (Manager) session.getAttribute("mng");
			System.out.println("before updating tables use is: "+user.getUserName());
			api.updateTable("USERS", "OSFKEY", hashedPas, "USERNAME",user.getUserName() );
			api.updateTable("USERS", "SALT", salt, "USERNAME", user.getUserName());
			System.out.println("after updating tables");
			user.setKey(hashedPas);
			mng.setUserfromDB(user);
			String url = mng.REDIRECTLOGIN;
			//response.sendRedirect(url);
			RequestDispatcher rd = request.getRequestDispatcher(url);
			rd.forward(request, response);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println(e.getMessage());
			e.printStackTrace();
			throw e;
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			System.out.println(e.getMessage());
			e.printStackTrace();
			throw e;
		}
		 
		
	}
	protected HashMap getName(User user,Manager mng){
		try{
			HashMap name = new HashMap();
			System.out.println("inside get name");
			name.put("name", user.getUserName());
			name.put("email", user.getEmail());
			name.put("folder",user.getFolderName());
			name.put("role", user.getRole());
			name.put("os", mng.getOs());
			System.out.println("name is: "+name);
			return name;
		}catch (Exception e){
			e.printStackTrace();
			throw e;
		}
		
	}
	protected String login(HttpServletRequest request,DbAPI api,String res,HttpServletResponse response) throws Exception{
		
		System.out.println("starting  login");
		Manager mng = new Manager();
		String username = request.getParameter("username");
		String pass = request.getParameter("password");
		username = username.trim();
		pass = pass.trim();
		HashMap records = api.findInOracle("Users", "USERNAME", username);
		if (records.size()>1){
			res="More then one record returned";
			return res;
		}
		if (records.size()==0){
			System.out.println("No user found user: "+username+" and pass: "+pass);
			res="There was a problem with your user name or password";
			return res;
		}
		Map.Entry pairs = (Entry) records.entrySet().iterator().next();
		HashMap userRecord = (HashMap) pairs.getValue();
		String salt = (String) userRecord.get("salt");
		String key = (String) userRecord.get("OSFKey");
		System.out.println("the key is: "+key);
		if(key.length()<10){// this is a temporary password
			try {
				System.out.println("key is less then 10");
				if (!key.equals(pass)){
					res="There was a problem with your user name or password";
					return res;
				}
				String url = mng.LOGINURL;
				User user = new User();
				user.setKey(key);
				mng.setUserfromDB(user);
				HttpSession session = request.getSession(true);
				System.out.println("in login session is: "+session.getId());
				session.setAttribute("userobject", user);
				session.setAttribute("mng", mng);
				//response.sendRedirect(url);
				session.setAttribute("_session", "_value");
				response.setContentType("text/html");
				RequestDispatcher rd = request.getRequestDispatcher(url);
				rd.forward(request, response);
			} catch (ServletException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw e;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw e;
			}
		}else{
			PasswordHash passHash = new PasswordHash();
			String mesh =passHash.PBKDF2_ITERATIONS+ ":" + salt + ":" +  key;
			try {
				if (passHash.validatePassword(pass, mesh)){
					User user = new User();
					user.setKey(key);
					mng.setUserfromDB(user);
					HttpSession session = request.getSession(true);
					session.setAttribute("userobject", user);
					session.setAttribute("mng", mng);
					System.out.println("set user object"+session.getAttribute("userobject"));
					res= "success";
					String url="";
					if (request.getRequestURI().contains("test")){
						url = mng.REDIRECTTTESTLOGIN;
					}else{
						url = mng.REDIRECTLOGIN;
						
					}
					
					response.setContentType("text/html");
					RequestDispatcher rd = request.getRequestDispatcher(url);
					rd.include(request, response);
					//response.sendRedirect(url);
				}else{
					System.out.println("record is 0 system report problem with user name");
					res= "There was a problem with your user name or password";
				}
			} catch (NoSuchAlgorithmException e) {
				// TODO Auto-generated catch block
				System.out.println("error  login");
				e.printStackTrace();
				throw e;
			} catch (InvalidKeySpecException e) {
				// TODO Auto-generated catch block
				System.out.println("error  login");
				e.printStackTrace();
				throw e;
			} catch (IOException e) {
				// TODO Auto-generated catch block
				System.out.println("error  login");
				e.printStackTrace();
				throw e;
			} catch (ServletException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				throw e;
			}
			
		}
		
		return res;
	}
	
	protected boolean register(HttpServletRequest request,DbAPI api) throws Exception{
		
		try {
			System.out.println("starting register");
			String userName = request.getParameter("user");
			String firstName = request.getParameter("first");
			String lastName = request.getParameter("last");
			String email = request.getParameter("email");
			String folder = request.getParameter("folder");
			String pass = request.getParameter("pass");
			String migrate = request.getParameter("migrate");
			PasswordHash passHash = new PasswordHash();
			String saltedHash;
			saltedHash = passHash.createHash(pass);
			String[] saltedArr = saltedHash.split(":");
			String salt = saltedArr[1];
			String hashedPas = saltedArr[2];
			api.createUserInOracle(userName,firstName, lastName, hashedPas, folder, email, salt);
			if (migrate!=null){
				
			}
					
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			System.out.println("error in register "+e.getMessage());
			e.printStackTrace();
			throw e;
		} catch (InvalidKeySpecException e) {
			// TODO Auto-generated catch block
			System.out.println("error in register "+e.getMessage());
			e.printStackTrace();
			throw e;
		}
		
		return true;
		
	}
	protected ArrayList getEXPT(String[] arr,Manager mng,User user){
		
		String studyID = (String)arr[7];
		Study mainstudy = user.getStudyByID(studyID);
		
		return mainstudy.getstudyEXPTID();
	}
	private String createStudy(String[] arr,DbAPI api,User user,Manager mng){
		
		String studyName = arr[8];
		String key  = arr[6];
		if(user.existStudy(studyName)){
			return "ERROR:Study with this name already exists.";
		}
		FileUploadManager fileMng = new FileUploadManager();
		String createPath = "";
		String path="";
		if (key.equals("CURRENT")){
			createPath = user.getComposite().getCurrentFolder().getPath()+File.separator+studyName;
			path = mng.getStudyRelativePath(createPath, user.getFolderName());
		}else{
			createPath = mng.getPath("/", studyName,"all",user,mng);
			path = studyName+File.separator;
		}
		
		boolean success = fileMng.createFolder(createPath);
		Integer id = api.createStudy(studyName, "not_set","not_set","not_set", path, user.getID());
		user.addStudy(mng.createStudy("not_set","not_set",studyName,path,String.valueOf(id)));
		
		if (success){
			return "Study was created";
		}else{
			return "ERROR:There was a problem creating the study";
		}
	
		
	}
	private String deleteFile(HttpServletRequest request,HttpServletResponse response,Manager mng,User user) throws Exception{
		String key;
		String path;
		String study;
		Boolean result;
		String msg="";
		key = request.getParameter("key");
		path = request.getParameter("path");
		study = request.getParameter("study");
		
		FileUploadManager fileMng = new FileUploadManager();
		ServletContext ctx = getServletContext();
		msg = mng.deleteFile(path,key,user,study);
		//result = fileMng.deleteFile(path,key,user,mng,study);
		if (!msg.equals("")){
			if (path.contains(".expt")){
				String[] splits = path.split("\\"+File.separator);
				int size = splits.length;
				String fileName = splits[size-1];
				//mng.setUserfromDB(user);
				if ( study.equals("all") ){
					study = splits[0];
				}
				if ( study.equals("user") ){
					study = splits[1];
				}
				mng.deleteExptFromDB(user, study, fileName);
				Study s = user.getStudy(study);
				s.deleteExpt(fileName);

			}
		}
		if (!msg.equals("")){
			msg="alert:The following file has been deleted "+msg;
			user.getComposite().refresh();
			HashMap res = new HashMap();
			res.put("filesys", user.getComposite().toHashMap());
			res.put("msg", msg);
			String jsonText = JSONValue.toJSONString(res);
			return jsonText;
			
		}else{
			Exception e = new Exception("error: file was not deleted");
			System.out.println(e.getMessage());
			throw e;
		}
	
	}
	private void downLoadFile(String[] arr,HttpServletRequest request,HttpServletResponse response,String cmd,ServletOutputStream out,boolean download) throws Exception{
		//PrintWriter out = response.getWriter();
		String key;
		String fileName;
		String study = null;
		if (cmd.equals("download")|| cmd.equals("view")){
			key = request.getParameter("key");
			fileName = request.getParameter("path");
			study = request.getParameter("study");
		}else{
			key = arr[7];
			fileName = arr[8];
		}
		fileName =java.net.URLDecoder.decode(fileName, "UTF-8");
		//fileName=new java.net.URI(fileName).getPath();
		FileUploadManager fileMng = new FileUploadManager();
		ServletContext ctx = getServletContext();
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("userobject");
		Manager mng = (Manager) session.getAttribute("mng");
		fileMng.downLoadFile(user,mng,fileName,ctx,request,response,out,download,study);
	}
	
	private String createFolder(String[] arr,HttpServletRequest request,HttpServletResponse response) throws Exception{
		ServletOutputStream out = response.getOutputStream();
		String key = request.getParameter("key");
		String folderUnder = request.getParameter("uploadFolder");
		String folderToCreate = request.getParameter("folderCreate");
		String study = request.getParameter("study");
		FileUploadManager fileMng = new FileUploadManager();
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("userobject");
		Manager mng = (Manager) session.getAttribute("mng");
		String userFolder = user.getFolderName();
		//String path=mng.getPath(folderUnder, folderToCreate, study, user, mng);
		boolean success = mng.createFolder(folderToCreate, study,folderUnder, user);
		//boolean success =fileMng.createFolder(path, user,study);
		if(success){
			HashMap res = new HashMap();
			user.getComposite().refresh();
			res.put("filesys", user.getComposite().toHashMap());
			String jsonText = JSONValue.toJSONString(res);
			return jsonText;
		}else{
			Exception e = new Exception("Error creating folder");
			System.out.println(e.getMessage());
			throw e;
		}
		
	}
	private void ManageFiles(HttpServletRequest request,HttpServletResponse response) throws Exception{
		FileUploadManager fileMng = new FileUploadManager();
		String msg="";
		if (!(msg=fileMng.UploadFile(request, response)).equals("")){
			msg="Uploaded the following files: "+msg;
			HashMap res = new HashMap();
			HttpSession session = request.getSession();
			User user = (User) session.getAttribute("userobject");
			user.getComposite().refresh();
			res.put("filesys", user.getComposite().toHashMap());
			res.put("msg", msg);
			String jsonText = JSONValue.toJSONString(res);
			ServletOutputStream out = response.getOutputStream();
			out.write(jsonText.getBytes("UTF8"));
			out.flush();
			jsonText =null;
			//return jsonText;
		}else{
			Exception e = new Exception("error:File was not uploaded");
			System.out.println(e.getMessage());
			throw e;
		}
	
		
	}
	private void processValidate(HttpServletRequest request,String key,Manager mng,ServletOutputStream out,User user) throws Exception{
		
		try {
			System.out.println("starting process validate");
			
			String study = (String) request.getParameter("study");
			String fileName = (String) request.getParameter("filename");
			String path = (String) request.getParameter("path");
			String fileString = mng.getFile(user,study,fileName,path);
			out.write(fileString.getBytes("UTF8"));
			out.flush();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		}
		
	}
	protected void configureFileModule(HttpServletRequest request,User user,Manager mng,ServletOutputStream out) throws Exception{
		try{
			String options = request.getParameter("options");
			HashMap data = new HashMap();
			data.put("role", user.getRole());
			String jsonText = JSONValue.toJSONString(data);
			out.write(jsonText.getBytes("UTF8"));
			out.flush();
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
		
	}
	protected String renameStudy(HttpServletRequest request,User user,Manager mng,DbAPI api) throws Exception{
		
		try{
			HashMap res = new HashMap();
			String newname = request.getParameter("newname");
			String studyname = request.getParameter("study");
			if (user.existStudy(newname)){
				throw new Exception ("A study with this name already exist.");
			}
			Study s =user.getStudy(studyname);
			String studyfolder = s.getFolderName();
			String fullpath = mng.getFolderBase()+user.getFolderName()+File.separator+studyfolder;
			File f = new File(fullpath);
			if (mng.isStudy(user, f)){
				FileUploadManager fileMng = new FileUploadManager();
				user.renameStudy(studyname,newname,api,mng,fileMng);
				res.put("updatestudy", "true");
			}

			return null;
			
		}catch(Exception e){
			e.printStackTrace();
			throw e;
			
		}
		
		
	}
	protected String rename(HttpServletRequest request,User user,Manager mng,DbAPI api) throws Exception{
		try{
			HashMap res = new HashMap();
			String ident = request.getParameter("identifier");
			String id = request.getParameter("id");
			String newName = request.getParameter("newname");
			FileObj obj = user.getComposite().getUnit(id);
			String oldPath = obj.getPath();
			if (obj.getType().equals("folder")){
				if (mng.isStudy(user, obj)){
					return "msg: The folder is a study folder, please use 'Rename Study' from the home page";
				}
			}
			boolean success = mng.rename(id,newName,mng,user);
			if (success){
				if (oldPath.contains(".expt.xml")){
					user.updateExpt(oldPath,newName,api);
//				}else{
//					if (obj.getType().equals("folder")){
//						if (mng.isStudy(user, obj)){
//							user.updateStudy(obj.getName(),newName,api);
//							res.put("updatestudy", "true");
//						}
//					}
				}
				user.getComposite().refresh();
				res.put("filesys", user.getComposite().toHashMap());
				String jsonText = JSONValue.toJSONString(res);
				return jsonText;
			}
			
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
		
	
		return null;
	}
	protected void drillUp(HttpServletRequest request,User user,Manager mng,ServletOutputStream out) throws Exception{
		try{
			
			HashMap filesPresent  = mng.drillUp(user);
			String jsonText = JSONValue.toJSONString(filesPresent);
			filesPresent=null;
			out.write(jsonText.getBytes("UTF8"));
			out.flush();
			jsonText =null;
			
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
	}
	protected void drillDown(HttpServletRequest request,User user,Manager mng,ServletOutputStream out) throws Exception{
		try{
			String id = request.getParameter("id");
			HashMap filesPresent  = mng.drillDown(user,id);
			String jsonText = JSONValue.toJSONString(filesPresent);
			filesPresent=null;
			out.write(jsonText.getBytes("UTF8"));
			out.flush();
			jsonText =null;
			
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
	}
	private void processFileSys(String[] arr,String key,Manager mng,ServletOutputStream out,User user) throws Exception{
		
		String ukey = (String)arr[6];
		String study = (String) arr[8];
		try {
			System.out.println("user and key: "+ukey+"/"+study);
			HashMap filesPresent = mng.listFiles(user,study);
			//filesPresent = mng.listFilesThreaded(user, study);
			System.out.println(String.valueOf(filesPresent.size()));
			String jsonText = JSONValue.toJSONString(filesPresent);
			filesPresent=null;
			//System.out.println("printing out"+jsonText);
		
			out.write(jsonText.getBytes("UTF8"));
			out.flush();
			jsonText =null;
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		}
		
	}
	
	
	
	
	
}
