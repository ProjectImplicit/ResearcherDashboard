package org.implicit.dashboard;
import oracle.jdbc.OracleTypes;


import java.io.Serializable;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

//UPDATED
public class DbAPI implements Serializable  {
	
	
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
	protected void CloseAllDataSources(){
	//	DashBoardConnect.closeDataSouces();
	}
	protected boolean resetUser(String userid) throws Exception{
		
		Connection connection = null;
		try{
			connection = null;
			DashBoardConnect.getInstance(false);
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			
			String exptQuery ="delete from usersstudies where userid='"+userid+"'";
			PreparedStatement ecs = connection.prepareStatement(exptQuery);
			ecs.execute();
			exptQuery = "delete from studies where studyid not in (select studyid from usersstudies )";
			ecs = connection.prepareStatement(exptQuery);
			ecs.execute();
			exptQuery ="delete from expt where studyid not in (select studyid from studies)";
			ecs = connection.prepareStatement(exptQuery);
			ecs.execute();
			
			
		}catch(Exception e){
			System.out.println(e.getMessage());
			throw e;
		}finally{
			if (connection!=null)
				try {
					connection.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
		return true;
	}
	protected boolean deleteStudy(String studyid) throws Exception{
		
		Connection connection = null;
		try{
			connection = null;
			DashBoardConnect.getInstance(false);
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			String exptQuery ="DELETE FROM USERSSTUDIES WHERE STUDYID='"+studyid+"'";
			PreparedStatement ecs = connection.prepareStatement(exptQuery);
			ecs.execute();
			exptQuery = "DELETE FROM STUDIES WHERE STUDYID='"+studyid+"'";
			ecs = connection.prepareStatement(exptQuery);
			ecs.execute();
			exptQuery ="DELETE FROM EXPT WHERE STUDYID='"+studyid+"'";
			ecs = connection.prepareStatement(exptQuery);
			ecs.execute();
			
			
		}catch(Exception e){
			System.out.println(e.getMessage());
			throw e;
		}finally{
			if (connection!=null)
				try {
					connection.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}

		return true;
	}
	protected boolean deleteFromExptTable(String studyID,String exptFileName){
		Connection connection = null;
		DashBoardConnect.getInstance(false);
		try{
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			String exptQuery ="DELETE FROM EXPT WHERE STUDYID='"+studyID+"' AND EXPT_FILE_NAME='"+exptFileName+"'";
			PreparedStatement ecs = connection.prepareStatement(exptQuery);
			ecs.execute();
			return true;
		}catch(Exception e){
			System.out.println("Error in api.updateTable "+e.getMessage()+ e.getStackTrace());
			return false;
		}
		finally{
			if (connection!=null)
				try {
					connection.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
	}
	public void insertIntoExptTable(int studyID,String exptFileName,String exptID){
		Connection connection = null;
		DashBoardConnect.getInstance(false);
		
		try{
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			String exptQuery ="INSERT INTO EXPT (EID,STUDYID,EXPT_FILE_NAME,EXPT_ID) VALUES (EXPT_SEQUENCE.nextval,?,?,?)";
			PreparedStatement ecs = connection.prepareStatement(exptQuery);
			ecs.setInt(1, studyID);
			ecs.setString(2, exptFileName);
			ecs.setString(3, exptID);
			ecs.execute();
			
		}catch(Exception e){
			System.out.println("Error in api.updateTable "+e.getMessage()+ e.getStackTrace());
		}
		finally{
			if (connection!=null)
				try {
					connection.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
	}
	
	public void updateExptFileName(String studyID,String exptName,String oldExpt){
		
		Connection connection = null;
		DashBoardConnect.getInstance(false);
		
		try{
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			String query = "UPDATE EXPT SET EXPT_FILE_NAME = '"+exptName+"' where studyid='"+studyID+"' and EXPT_FILE_NAME='"+oldExpt+"'";
			PreparedStatement preparedStatement = connection.prepareStatement(query);
			preparedStatement.executeUpdate();
			
		}catch(Exception e){
			System.out.println("Error in api.updateTable "+e.getMessage()+ e.getStackTrace());
		}
		finally{
			if (connection!=null)
				try {
					connection.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
	}
	public void updateExptTable(String studyID,String exptName,String exptid){
		
		Connection connection = null;
		DashBoardConnect.getInstance(false);
		
		try{
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			String query = "UPDATE EXPT SET EXPT_ID = '"+exptid+"' where studyid='"+studyID+"' and EXPT_FILE_NAME='"+exptName+"'";
			PreparedStatement preparedStatement = connection.prepareStatement(query);
			preparedStatement.executeUpdate();
			
		}catch(Exception e){
			System.out.println("Error in api.updateTable "+e.getMessage()+ e.getStackTrace());
		}
		finally{
			if (connection!=null)
				try {
					connection.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
	}
	public void updateTable(String table,String col,String val,String whereCol,String whereVal ){
		System.out.println("starting updateTable ");
		System.out.println("db is:  "+db);
		Connection connection = null;
		DashBoardConnect.getInstance(false);
		
		try{
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			String query = "UPDATE "+table+" SET "+col+"='"+val+"' where "+whereCol+" ='"+whereVal+"'";
			PreparedStatement preparedStatement = connection.prepareStatement(query);
			preparedStatement.executeUpdate();
			
		}catch(Exception e){
			System.out.println("Error in api.updateTable "+e.getMessage()+ e.getStackTrace());
		}
		finally{
			if (connection!=null)
				try {
					connection.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
		
	}
	 
	
	protected Integer createStudy(String name,String exptid,String exptFileName,String datagroup,String folder,String userID) {
		Connection connection = null;
		DashBoardConnect.getInstance(false);
		Integer study_id = null;
		try{
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			
			
			String query = "BEGIN INSERT INTO Studies (StudyID,name, study_exptid,study_schema,folder_name,status) VALUES (study_sequence.nextval,?,?, ?,?,?) returning StudyID into ?; END;";
			CallableStatement cs = connection.prepareCall(query);
			cs.setString(1, name);
			cs.setInt(2,0);
			cs.setString(3, datagroup);
			cs.setString(4, folder);
			cs.setString(5, "N");
			cs.registerOutParameter(6, OracleTypes.NUMBER);
			cs.execute();
			study_id = cs.getInt(6);
			
			if (!exptid.equals("not_set")){
				String exptQuery ="INSERT INTO EXPT (EID,STUDYID,EXPT_FILE_NAME,EXPT_ID) VALUES (EXPT_SEQUENCE.nextval,?,?,?)";
				PreparedStatement ecs = connection.prepareStatement(exptQuery);
				ecs.setInt(1, study_id);
				ecs.setString(2, exptFileName);
				ecs.setString(3, exptid);
				ecs.execute();
			}
			
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
		return study_id;
	}
	public void createUser(String name,String OSFKey,String folder){
		
		
		if (this.method.equals("memory")){
			
			createUserInMemory(name,OSFKey,folder);
			
		}
		if(this.method.equals("oracle") || this.method.equals("cloude")){
			createUserInOracle(name,"","",OSFKey,folder,"","");
		}
	}
	
	
	public void createUserInOracle(String userName,String firstName,String lastName,String hpass,String folder,String email,String salt){
		
		Connection connection = null;
		DashBoardConnect.getInstance(false);
		
		try{
			connection = DashBoardConnect.getConnection(db);
			connection.setAutoCommit(true);
			String insertSQL = "INSERT INTO Users (UserID,USERNAME,FIRST_NAME,LAST_NAME, OSFKey,folder_name,EMAIL,SALT) VALUES (user_sequence.nextval,?,?, ?,?,?,?,?)";
			PreparedStatement preparedStatement = connection.prepareStatement(insertSQL);
			//preparedStatement.setString(1, "user_sequence.nextval");
			preparedStatement.setString(1, userName);
			preparedStatement.setString(2, firstName);
			preparedStatement.setString(3, lastName);
			preparedStatement.setString(4, hpass);
			preparedStatement.setString(5, folder);
			preparedStatement.setString(6, email);
			preparedStatement.setString(7, salt);
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
		db=m;
		
		return "set "+m+" has origin";
		
	}
	
	public HashMap findInMemory(String table,String column, String value){
		
		HashMap res= new HashMap();

		
		return res;
		
		
	}
	public HashMap findInOracle(String table,String column,String value) throws Exception{
		
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
			//connection.setAutoCommit(false);
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
	         		record.put("email", (String)rs.getString(8));
	         		record.put("salt", (String)rs.getString(19));
	         		record.put("role", (String)rs.getString(20));
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
				if (table.equals("EXPT")){
					record.put("EID", (String)rs.getString(1));
					record.put("EXPT_FILE_NAME", (String)rs.getString(2)); 
					record.put("EXPT_ID", (String)rs.getString(3));
					res.put(id, record);
					
										
				}
				
			}
		
		}catch(Exception e ){
			System.out.println(e.getStackTrace());
			throw e;
		}finally{
			try{
			if (connection!=null) connection.close();
			}catch(Exception e){
				System.out.println(e.getStackTrace());
				throw e;
				
			}
		}
		
		
		return res;
		
	}

	
	public HashMap find(String table,String column, String value) throws Exception{
		
		if (this.method.equals("memory")){
			return this.findInMemory(table,column,value);
		}
		if (this.method.equals("oracle") || this.method.equals("cloude") ){
			return this.findInOracle(table,column,value);
		}
		return null;
	};
	
	

}
