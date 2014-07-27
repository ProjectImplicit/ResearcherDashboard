package org.implicit.dasboard;
import oracle.jdbc.OracleTypes;

import org.uva.dao.ConnectionPool;
import org.uva.util.PITConnection;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;


public class DbAPI  {
	
	
	HashMap Users = new HashMap();
	Integer userID=0;
	HashMap Studies = new HashMap() ;
	Integer styudiesID=0;
	HashMap UserStudies = new HashMap();
	Integer UserStudiesID=0;
	
	String method="memory";
	String db = "testnew";
	
	private static DbAPI singleton;
	
	
	
	public static DbAPI getInstance(boolean refreshCache) {
		synchronized (DbAPI.class){ 
			
			if (singleton == null || refreshCache) {
				singleton = new DbAPI();
				
			}
		}
		return singleton;
	}
	public void createStudy(String name,String expt,String folder,String uid ){
		if (this.method.equals("memory")){
			
			//createStudyInMemory(name,id,folder,user_id);
			
		}
		if(this.method.equals("oracle") || this.method.equals("cloude")){
			createStudyInOracle(name,expt,folder,uid);
		}
	}
	private void createStudyInMemory(String name,String study_expt,String folder,String user_id){
		
//		HashMap record = new HashMap();
//		record.put("id",String.valueOf(++this.styudiesID));
//		record.put("name", name);
//		record.put("studyID", study_expt);
//		record.put("studyFolder", folder);
//		this.Studies.put(this.styudiesID, record);
//		HashMap record2 = new HashMap();
//		record.put("id",String.valueOf(++this.UserStudiesID));
//		record.put("user_id", user_id);
//		record.put("user_id", String.valueOf(this.styudiesID));
//		
//		
		
		
		
		
		
	}
	 
	private void createStudyInOracle(String name,String exptid,String folder,String userID) {
		Connection connection = null;
		DashBoardConnect.getInstance(false);
		
		try{
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			String query = "BEGIN INSERT INTO Studies (StudyID,name, study_exptid,folder_name) VALUES (study_sequence.nextval,?, ?,?) returning StudyID into ?; END;";
			CallableStatement cs = connection.prepareCall(query);
			cs.setString(1, name);
			cs.setString(2, exptid);
			cs.setString(3, folder);
			cs.registerOutParameter(4, OracleTypes.NUMBER);
			cs.execute();
			Integer study_id = cs.getInt(4);
//			String insertSQL = "INSERT INTO Studies (studyname, study_exptid,study_folder) VALUES (?, ?,?)";
//			PreparedStatement preparedStatement = connection.prepareStatement(insertSQL);
//			preparedStatement.setString(1, name);
//			preparedStatement.setString(2, exptid);
//			preparedStatement.setString(3, folder);
//			preparedStatement.executeUpdate();
			
			String insertSQL = "INSERT INTO UsersStudies  (UserStudyID,UserID, StudyID) VALUES (userstudy_sequence.nextval,?, ?)";
			PreparedStatement preparedStatement = connection.prepareStatement(insertSQL);
			preparedStatement.setLong(1, Integer.parseInt(userID));
			preparedStatement.setLong(2, study_id);
			preparedStatement.executeUpdate();
			
			
			
			
		}catch(Exception e){
			System.out.println();
		}finally{
			try{
				if (connection!=null) connection.close();
			}catch(Exception e){
				System.out.println("Error in createtudy at DbAPI");
			}
		}
	}
	public void createUser(String name,String OSFKey,String folder){
		
		
		if (this.method.equals("memory")){
			
			createUserInMemory(name,OSFKey,folder);
			
		}
		if(this.method.equals("oracle") || this.method.equals("cloude")){
			createUserInOracle(name,OSFKey,folder);
		}
	}
	
	
	private void createUserInOracle(String userName,String key,String folder){
		
		Connection connection = null;
		DashBoardConnect.getInstance(false);
		
		try{
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			String insertSQL = "INSERT INTO Users (UserID,username, OSFKey,folder_name) VALUES (user_sequence.nextval,?, ?,?)";
			PreparedStatement preparedStatement = connection.prepareStatement(insertSQL);
			//preparedStatement.setString(1, "user_sequence.nextval");
			preparedStatement.setString(1, userName);
			preparedStatement.setString(2, key);
			preparedStatement.setString(3, folder);
			preparedStatement.executeUpdate();
			
		}catch(Exception e){
			System.out.println();
		}finally{
			try{
				if ((connection!=null)) connection.close();
			}catch(Exception e){}
		}
		
	}
	private void createUserInMemory(String userName,String key,String folder){
		
//		HashMap record = new HashMap();
//		record.put("id",String.valueOf(++this.userID));
//		record.put("userName", userName);
//		record.put("OSFKey", key);
//		record.put("userFolder", folder);
//		this.Users.put(this.userID, record);
//		
	}
	
	public ArrayList runSQL(String sql){
		
		return null;
	}
	public String setMethod(String m){ 
	
		this.method=m;
		if (m.equals("cloude")){
			this.db="cloude";
		}
		return "set "+m+" has origin";
		
	}
	
	public HashMap findInMemory(String table,String column, String value){
		
		HashMap res= new HashMap();
//		if (table.equals("Users")){
//			
//			 Iterator studyIT = Users.entrySet().iterator();
//				//go through user records
//				 while (studyIT.hasNext()) {
//					 
//					 Map.Entry pairs = (Map.Entry)studyIT.next();
//			         String pid = String.valueOf(pairs.getKey());
//			         HashMap userRecord = (HashMap)pairs.getValue();
//			         if (column==null || column.equals("") ){
//			        	 res.put(pid, userRecord.clone());
//			        	 
//			         }else{
//			        	 String col = 	(String) userRecord.get(column);
//			        	 if (col.equals(value)){
//			        		 res.put(pid, userRecord.clone());
//			        	 }
//			        	 
//			         }
//					 
//				 }
//				    	
//			
//		}
//		if (table.endsWith("Studies")){
//			
//		}
//		if(table.equals("UserStudies")){
//			
//		}
//		
//		
//		
		return res;
//		
		
	}
	public HashMap finfInOracle(String table,String column,String value){
		
		HashMap res= new HashMap();
		Connection connection = null;
		String questionare=null;
		try{
		
			if (column==null ||column.equals("")){
				questionare = "select * from "+table;
				
			}else{
				questionare = "select * from "+table+" where "+column+" ='"+value+"'";
			}
			DashBoardConnect.getInstance(false);
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(false);
			PreparedStatement ps = connection.prepareStatement(questionare);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				HashMap record = new HashMap();
				// change when table structure is known
				String id = String.valueOf(rs.getInt(1));
				if (table.equals("Users")){
					record.put("userName", (String)rs.getString(2)); 
					record.put("OSFKey", (String)rs.getString(4));
					record.put("userFolder", (String)rs.getString(5));
	         		record.put("id", id);
					res.put(id, record);
					
				}
				if (table.equals("Studies")){
					record.put("name", (String)rs.getString(2)); 
					record.put("study_exptid", (String)rs.getString(3));
					record.put("folder_name", (String)rs.getString(4));
					record.put("last_modified", (String)rs.getString(5));
					record.put("status", (String)rs.getString(6));
	         		record.put("id", id);
					res.put(id, record);
					
					
				}
				if (table.equals("UsersStudies")){
					record.put("UserID", (String)rs.getString(2)); 
					record.put("StudyID", (String)rs.getString(3));
					record.put("id", id);
					res.put(id, record);

					
				}
				
			}
		
		}catch(Exception e ){
			System.out.println();
		}finally{
			try{
			if (connection!=null) connection.close();
			}catch(Exception e){
				
			}
		}
		
		
		return res;
		
	}

	
	public HashMap find(String table,String column, String value){
		
		if (this.method.equals("memory")){
			return this.findInMemory(table,column,value);
		}
		if (this.method.equals("oracle") || this.method.equals("cloude") ){
			return this.finfInOracle(table,column,value);
		}
		return null;
	};
	
	

}
