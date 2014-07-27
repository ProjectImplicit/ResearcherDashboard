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

public class Dashboard extends HttpServlet{
	
	
		
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException { 
		try {
			System.out.println("starting do get");
			doPost(request,response);
		} catch (ServletException e) {
			e.printStackTrace();
		}
	} 
	
	public void doPost(HttpServletRequest request,HttpServletResponse response)
			throws IOException, ServletException{
		
		PrintWriter out = response.getWriter();
		
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
						out.print(listOfStudiesString(studyNames));
						out.flush();
					}
				}else{
					if (arr[5].equals("test")){
						String ukey = (String)arr[6];
						String study = (String) arr[8];
						User user = new User();
						user.setKey(ukey);
						mng.setUserfromDB(user);
						HashMap filesPresent = new HashMap();
						filesPresent = mng.listFiles(user, study);
						String jsonText = JSONValue.toJSONString(filesPresent);
						out.print(jsonText);
						out.flush();
					
					}
					if (arr[5].equals("validate")){
						String ukey = (String)arr[6];
						String study = (String) arr[8];
						String fileName = (String) arr[9];
						User user = new User();
						user.setKey(ukey);
						mng.setUserfromDB(user);
						String fileString = mng.getFile(user,study,fileName);
						out.print(fileString);
						out.flush();
						
					}
					if (arr[5].equals("studyvalidate")){
						String ukey = (String)arr[6];
						String study = (String) arr[8];
						String fileName = (String) arr[9];
						User user = new User();
						user.setKey(ukey);
						mng.setUserfromDB(user);
						String errors = mng.studyValidator(user,study,fileName);
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
			res = createJson(resHash);
			
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
	private String listOfStudiesString (HashMap o){
		
		String res=new String();
		Iterator it = o.entrySet().iterator();
		while (it.hasNext()) {
			 Map.Entry pairs = (Map.Entry)it.next();
	         String pid = (String) pairs.getKey();
	         HashMap record = (HashMap) pairs.getValue();
	         Iterator itII = record.entrySet().iterator();
	         while (itII.hasNext()) {
	        	 pairs = (Map.Entry)itII.next();
	        	 String name = (String) pairs.getValue();
	        	 res += name;
	        	 if (it.hasNext()) res+="/";
	         }
		}
		return res;
	}
	
	public String createJson(HashMap o){
		
		String res = "";
		String eol = System.getProperty("line.separator"); 
		Iterator it = o.entrySet().iterator();
		while (it.hasNext()) {
			 Map.Entry pairs = (Map.Entry)it.next();
	         String pid = (String) pairs.getKey();
	         HashMap record = (HashMap) pairs.getValue();
	         res += record.toString()+eol;
	         
		}
		
//		String res =" data: { "+"/n";
//		
//		 Iterator it = o.entrySet().iterator();
//			//go through user records
//		 while (it.hasNext()) {
//		 
//			 Map.Entry pairs = (Map.Entry)it.next();
//	         String pid = (String) pairs.getKey();
//	         HashMap record = (HashMap) pairs.getValue();
//	         res += "{ "+"/n";
//	         Iterator itII = record.entrySet().iterator();
//	         while (itII.hasNext()) {
//	        	 Map.Entry pairsII = (Map.Entry)itII.next();
//	        	 String key = (String) pairsII.getKey();
//	        	 String value = (String) pairsII.getValue();
//	        	 res += "    "+key+": "+value+"/n";
//	         }
//	         res += "} "+"/n";
//		 }
		return res;
		
	}


}
