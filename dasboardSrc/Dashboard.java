package org.implicit.dasboard;

import static org.junit.Assert.assertNotNull;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONValue;

import java.util.List;

import org.apache.commons.fileupload.servlet.ServletFileUpload;

 


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



public class Dashboard extends HttpServlet{
	
	
	
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
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException { 
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
	 */
	
	public void doPost(HttpServletRequest request,HttpServletResponse response)
			throws IOException, ServletException{
		
		//PrintWriter out = response.getWriter();
		System.out.println("starting dashboard");
		ServletOutputStream out = response.getOutputStream();
		String res = "";
		String cmd="";
		String APIcmd = null;
		String key =null;
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		try{
			if (isMultipart){
				res=ManageFiles(request,response);
			}else{
				
				DbAPI api = DbAPI.getInstance(false);
				//response.setContentType("application/json");
				StringBuffer requestURL = request.getRequestURL();
				String completeURL = requestURL.toString();
				String[] arr = completeURL.split("/");
				Manager mng = new Manager();
				if (arr.length>5) {
					cmd  = arr[5];
				}else{
					if (request.getParameter("cmd")!=null) cmd =request.getParameter("cmd"); 
					if (request.getParameter("api")!=null) APIcmd = request.getParameter("api"); 
					if (request.getParameter("OSFKey")!=null) key =request.getParameter("OSFKey"); 
				}
				
				
				if (APIcmd!=null){
					res = processAPICalls(request,api);
				}else{
					if (key!=null){
						User user = new User();
						user.setKey(key);
						if (cmd.equals("Auth")){
							if (mng.AuthUser(user)){
								res="OK";
							}else{
								res = "NOT FOUND";
							}
						}
						if(cmd.equals("getstudies")){
							mng.buildUser(user);
							HashMap studyNames = user.getNames();
							String names = JSONValue.toJSONString(studyNames);
							out.write(names.getBytes("UTF8"));
							out.flush();
						}   
					}else{ 
						 //System.out.println("5 is: "+arr[5]);
						 
						if (cmd.equals("create")){
							res = createFolder(arr,request,response);
	
						}
						if (cmd.equals("delete")){
							res = deleteFile(request,response);
						}
						if (cmd.equals("test")){
							processTest(arr,key,mng,out);
						}				   
						if (cmd.equals("validate")){
							processValidate(arr,key,mng,out);
						}
						if (cmd.equals("view")){
							downLoadFile(arr,request,response,cmd,out,false);							
						}
						if (cmd.equals("download") ){
							downLoadFile(arr,request,response,cmd,out,true);
						}
						if (cmd.equals("createstudy") ){
							res=createStudy(arr,api,mng);
						}
						if (cmd.equals("studyvalidate")){
							String ukey = (String)arr[6];
							String study = (String) arr[8];
							String fileName = (String) arr[9];
							User user = new User();
							user.setKey(ukey);
							mng.setUserfromDB(user);
							String errors = mng.studyValidator(user,study,fileName);
							System.out.println("string is:"+errors);
							out.print(errors);
							out.flush();
							
						}
						if (cmd.equals("getexpt")){
							ArrayList EXPTres= getEXPT(arr,mng);
							String expt = JSONValue.toJSONString(EXPTres);
							out.write(expt.getBytes("UTF8"));
							out.flush();
							
							
						}
						if (cmd.equals("getname")){
							String ukey = (String)arr[6];
							User user = new User();
							user.setKey(ukey);
							mng.setUserfromDB(user);
							//String name = user.getFolderName();
							HashMap name = new HashMap();
							name.put("name", user.getFolderName());
							name.put("email", user.getEmail());
							String expt = JSONValue.toJSONString(name);
							out.write(expt.getBytes("UTF8"));
							out.flush();
							
						}
						
					}//else end
				}//else end
			}//else
					
		}catch(Exception e){
			System.out.println("error in dashboard "+e.getMessage());
			out.println("error: "+e.getMessage());
		}
		finally{
			out.write(res.getBytes("UTF8"));
			out.flush();
			out.close();
		}
	}
	
	protected ArrayList getEXPT(String[] arr,Manager mng){
		String ukey = (String)arr[6];
		String study = (String)arr[7];
		User user = new User();
		user.setKey(ukey);
		mng.setUserfromDB(user);
		mng.setStudyIdFromDB(user);
		Study mainstudy = user.getStudy(study);
		return mainstudy.getstudyEXPTID();
	}
	private String createStudy(String[] arr,DbAPI api,Manager mng){
		
		String studyName = arr[8];
		String key  = arr[6];
		User user = new User();
		user.setKey(key);
		mng.setUserfromDB(user);
		FileUploadManager fileMng = new FileUploadManager();
		boolean success = fileMng.createFolder("/", studyName, key);
		String path = mng.getFolderBase()+File.separator+user.getFolderName()+File.separator+studyName;
		api.createStudy(studyName, "not_set","not_set","not_set", path, user.getID());
		
		if (success){
			return "Study was created";
		}else{
			return "There was a problem creating the study";
		}
		
				
		
		
	}
	private String deleteFile(HttpServletRequest request,HttpServletResponse response){
		String key;
		String path;
		key = request.getParameter("key");
		path = request.getParameter("path");
		FileUploadManager fileMng = new FileUploadManager();
		ServletContext ctx = getServletContext();
		return fileMng.deleteFile(path,key);
		
		
		
	}
	private void downLoadFile(String[] arr,HttpServletRequest request,HttpServletResponse response,String cmd,ServletOutputStream out,boolean download){
		//PrintWriter out = response.getWriter();
		String key;
		String fileName;
		if (cmd.equals("download")|| cmd.equals("view")){
			key = request.getParameter("key");
			fileName = request.getParameter("path");
			
		}else{
			key = arr[7];
			fileName = arr[8];
		}
		FileUploadManager fileMng = new FileUploadManager();
		ServletContext ctx = getServletContext();
		Manager mng = new Manager();
		fileMng.downLoadFile(key,mng.trim(fileName),ctx,request,response,out,download);
	}
	private String createFolder(String[] arr,HttpServletRequest request,HttpServletResponse response) throws IOException{
		ServletOutputStream out = response.getOutputStream();
		String key = request.getParameter("key");
		String folderUnder = request.getParameter("uploadFolder");
		String folderToCreate = request.getParameter("folderCreate");
		FileUploadManager fileMng = new FileUploadManager();
		boolean success =fileMng.createFolder(folderUnder, folderToCreate, key);
		if(success){
			return ("Folder was created");
		}else{
			return ("Error creating folder");
		}
		
	}
	private String ManageFiles(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException{
		FileUploadManager fileMng = new FileUploadManager();
		if (fileMng.UploadFile(request, response)){
			return "File was uploaded";
		}else{
			return "File was not uploaded";
		}
		
		
		
		
	}
	private void processValidate(String[] arr,String key,Manager mng,ServletOutputStream out){
		
		try {
			System.out.println("starting process validate");
			String ukey = (String)arr[6];
			String study = (String) arr[8];
			String fileName = (String) arr[9];
			User user = new User();
			user.setKey(ukey);
			mng.setUserfromDB(user);
			String fileString = mng.getFile(user,study,fileName);
			System.out.println("string is:"+fileString);
			out.write(fileString.getBytes("UTF8"));
			out.flush();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	private void processTest(String[] arr,String key,Manager mng,ServletOutputStream out){
		
		String ukey = (String)arr[6];
		String study = (String) arr[8];
		System.out.println("user and key: "+ukey+"/"+study);
		User user = new User();
		user.setKey(ukey);
		mng.setUserfromDB(user);
		mng.setStudyIdFromDB(user);
		HashMap filesPresent = new HashMap();
		filesPresent = mng.listFiles(user, study);
		System.out.println(String.valueOf(filesPresent.size()));
		String jsonText = JSONValue.toJSONString(filesPresent);
		System.out.println("printing out"+jsonText);
		try {
			out.write(jsonText.getBytes("UTF8"));
			out.flush();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	/**
	 * 
	 * Process a set of API that query the Database.
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
	 */
	private String processAPICalls(HttpServletRequest req,DbAPI api){
		
		HashMap resHash=null;
		String res="";
		
		String cmd  = req.getParameter("api");
		String table = null;
		String name = null;
		String key =null;
		String folder =null;
		String col=null;
		String val=null;
		String base=null;
		String expt=null;
		String userID=null;
		
		if (cmd.equals("find")){
			table = req.getParameter("table");
			col = req.getParameter("col");
			val = req.getParameter("value");
			resHash = api.find(table, col, val);
			res = JSONValue.toJSONString(resHash);
						
		}
		if (cmd.equals("create")){
			table = req.getParameter("table");
			name = req.getParameter("name");
			key = req.getParameter("key");
			folder = req.getParameter("folder");
			userID = req.getParameter("userid");
			expt = req.getParameter("exptid");
			if (table.equals("Users")){
				api.createUser(name,key,folder);
				res="table: User was updates";
			}
			if (table.equals("Studies")){
				//api.createStudy(name, expt,"", folder, userID);
				res="table: Studies was updates";
				
			}
		}
		if (cmd.equals("origin")){
			base = req.getParameter("base");
			if (base.equals("cloude")){
				res=api.setMethod(base);
			}
		}
		
		return res;
		
	}
	
	
	
}
