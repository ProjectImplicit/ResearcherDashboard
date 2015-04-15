package org.implicit.dashboard;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import org.uva.dao.ConnectionPool;
import org.uva.util.PITConnection;

//UPDATED
public class DashBoardConnect {
	
	
	private static DashBoardConnect singleton;

	private HashMap dataSourceHashMap;

	private Calendar cacheDate;
	
	private static final int MILISECONDS_BEFORE_REFRESH=600000;

	
	
	
	private DashBoardConnect() {
	}

	public static DashBoardConnect getInstance(boolean refreshCache) {
		synchronized (PITConnection.class) {
			
			Context initContext=null;
			Context envContext=null;
			DataSource cloude=null;
			DataSource newDash=null;
				
			
			
			if (singleton == null || refreshCache) {
				singleton = new DashBoardConnect();
				singleton.dataSourceHashMap = new HashMap();
				
				try {
					initContext = new InitialContext();
					envContext = (Context) initContext
							.lookup("java:/comp/env");
					cloude = (DataSource) envContext.lookup("oracle/cloude");
					newDash = (DataSource) envContext.lookup("new/dashboard");
					
				} catch (Exception e) {
					
					System.out.print(e);
				}
					
					singleton.dataSourceHashMap.put("cloude", cloude);
					singleton.dataSourceHashMap.put("oracle", newDash);
					singleton.cacheDate = new GregorianCalendar();
		
			}
		}
		return singleton;
	}

	
	public static Connection getConnection(String databaseId) throws Exception {
		
		DataSource dataSource = null;
		Connection conn = null;
		try {
			
			if (singleton == null) {
				singleton = DashBoardConnect.getInstance(false);
			}else{
				if(singleton.cacheDate.getTimeInMillis()+MILISECONDS_BEFORE_REFRESH<GregorianCalendar.getInstance().getTimeInMillis())
				{
					singleton = DashBoardConnect.getInstance(true);
					try{
						//testConnection("cloude");			
						testConnection("oracle");
					
					}
					catch(Exception e)
					{
						
						
					}
					
				}
			}
			
			dataSource = (DataSource) singleton.dataSourceHashMap
					.get(databaseId);
			
			conn = dataSource.getConnection();

			
			return (conn);

		} catch (SQLException e) {
			
			System.out.println("Unable to get connection for database trying again ");
			try{
				conn =  dataSource.getConnection();
				return conn;
				
			}catch(SQLException e1){
				System.out.println("Unable to get connection for database trying a second time ");
				conn =  dataSource.getConnection();
				return conn;
				
			}

			
		}catch(Exception e){
			System.out.println(e.getStackTrace());
		}
		return null;
		//return (dataSource.getConnection());
	}
	
	
	protected static boolean hasConnectionPool(String databaseId) {
		if (singleton == null) {
			singleton = DashBoardConnect.getInstance(false);
		}
		return singleton.dataSourceHashMap.containsKey(databaseId);
	}

	public static void closeDataSources(){
		
		DataSource cloude = (DataSource) singleton.dataSourceHashMap.get("cloude");
		DataSource oracle = (DataSource) singleton.dataSourceHashMap.get("cloude");
		
		
	}
	/**
	 * Returns the connection pool cache date formatted as a date-time stamp
	 * 
	 * @return the date the connection pool was created in date-time stamp
	 *         format
	 */
	public static String getCacheDateFormatted() {
		return singleton.cacheDate.toString();
	}
private static void testConnection(String schema) {
		
		
		String dataQuery = "select * from users where userid=-999";
//		String dataQuery = "SELECT study_name " +
//
//				"FROM yuiat_sessions_v " +
//
//				"WHERE session_id=-9999 " +
//
//				"GROUP BY study_name ORDER BY study_name";

		Connection connection = null;

		try {

			connection = DashBoardConnect.getConnection(schema);

			PreparedStatement ps = connection.prepareStatement(dataQuery);

		

			ResultSet rs = ps.executeQuery();

			

		} catch (Exception e) {

			System.out.println("log4j  Unable to execute query " + dataQuery+ e);

			

		} finally {

			try {

				connection.close();

			} catch (Exception ce) {
			}
			;

		}

	}


}
