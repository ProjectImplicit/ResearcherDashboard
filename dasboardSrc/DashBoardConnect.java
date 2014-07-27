package org.implicit.dasboard;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import org.uva.util.PITConnection;

public class DashBoardConnect {
	
	
	private static DashBoardConnect singleton;

	private HashMap dataSourceHashMap;

	private Calendar cacheDate;
	
	
	
	
	
	private DashBoardConnect() {
	}

	public static DashBoardConnect getInstance(boolean refreshCache) {
		synchronized (PITConnection.class) {
			
			Context initContext=null;
			Context envContext=null;
			DataSource cloude=null;
				
			
			
			if (singleton == null || refreshCache) {
				singleton = new DashBoardConnect();
				singleton.dataSourceHashMap = new HashMap();
				
				try {
					initContext = new InitialContext();
					envContext = (Context) initContext
							.lookup("java:/comp/env");
					cloude = (DataSource) envContext.lookup("oracle/cloude");
					
				} catch (Exception e) {
					
					System.out.print(e);
				}
					
					singleton.dataSourceHashMap.put("cloude", cloude);
					singleton.cacheDate = new GregorianCalendar();
		
			}
		}
		return singleton;
	}

	
	public static Connection getConnection(String databaseId) throws Exception {
		try {
			
			if (singleton == null) {
				singleton = DashBoardConnect.getInstance(false);
			}
			
			DataSource dataSource = (DataSource) singleton.dataSourceHashMap
					.get(databaseId);
			
			// If you deploy your application to JBoss,try the following code 
			// instead of returning normal java.sql.Conneciton 
			//return ((WrappedConnection) dataSource.getConnection()).getUnderlyingConnection();
			
			return (dataSource.getConnection());
		} catch (SQLException e) {
			
			throw new Exception("Unable to get connection for database id: "
					+ databaseId, e);
			
		}
	}
	
	
	protected static boolean hasConnectionPool(String databaseId) {
		if (singleton == null) {
			singleton = DashBoardConnect.getInstance(false);
		}
		return singleton.dataSourceHashMap.containsKey(databaseId);
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



}
