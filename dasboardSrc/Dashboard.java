package org.implicit.dasboard;

import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
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
		
		PrintWriter out = response.getWriter();
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		if (isMultipart){
			ManageFiles(request,response);
		}
		String res = null;
		DbAPI api = DbAPI.getInstance(false);
		try{
			//response.setContentType("application/json");
			StringBuffer requestURL = request.getRequestURL();
			String completeURL = requestURL.toString();
			String[] arr = completeURL.split("/");
			Manager mng = new Manager();
			String APIcmd = request.getParameter("api");
			String cmd =request.getParameter("cmd");
			String key =request.getParameter("OSFKey");
			
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
						out.print(names);
						out.flush();
					}   
				}else{ 
					 System.out.println("5 is: "+arr[5]);
					if (arr[5].equals("test")){
						processTest(arr,key,mng,out);
					}				   
					if (arr[5].equals("validate")){
						processValidate(arr,key,mng,out);
					}
					if (arr[5].equals("studyvalidate")){
						System.out.println("starting study validate");
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
					if (arr[5].equals("getname")){
						String ukey = (String)arr[6];
						User user = new User();
						user.setKey(ukey);
						mng.setUserfromDB(user);
						String name = user.getFolderName();
						out.print(name);
						out.flush();
						
					}
					
				}
				
				
			}
			
			
				
				
		}catch(Exception e){
			System.out.println();
			out.println("error: "+e.getMessage());
		}
		finally{
			out.write(res);
			out.close();
		}
	}
	
	private void ManageFiles(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException{
		FileUploadManager fileMng = new FileUploadManager();
		fileMng.UploadFile(request, response);
		
		
		
	}
	private void processValidate(String[] arr,String key,Manager mng,PrintWriter out){
		
		System.out.println("starting process validate");
		String ukey = (String)arr[6];
		String study = (String) arr[8];
		String fileName = (String) arr[9];
		User user = new User();
		user.setKey(ukey);
		mng.setUserfromDB(user);
		String fileString = mng.getFile(user,study,fileName);
		System.out.println("string is:"+fileString);
		out.print(fileString);
		out.flush();
	}
	private void processTest(String[] arr,String key,Manager mng,PrintWriter out){
		
		String ukey = (String)arr[6];
		String study = (String) arr[8];
		System.out.println("user and key: "+ukey+"/"+study);
		User user = new User();
		user.setKey(ukey);
		mng.setUserfromDB(user);
		HashMap filesPresent = new HashMap();
		filesPresent = mng.listFiles(user, study);
		System.out.println(String.valueOf(filesPresent.size()));
		String jsonText = JSONValue.toJSONString(filesPresent);
		System.out.println("printing out"+jsonText);
		out.print(jsonText);
		out.flush();
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
				api.createStudy(name, expt, folder, userID);
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
