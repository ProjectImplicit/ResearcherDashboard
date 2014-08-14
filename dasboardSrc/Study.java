package org.implicit.dasboard;

/**
 * 
 * 
 * Class that represent a study in the DashBoard. 
 * 
 * Date created : 01-Feb-2014
 * 
 * @version $Revision: 10716 $
 * 
 * @author Ben G 
 * 
 * 
 * 
 */
public class Study {
	
	String studyEXPTID;
	String studyName;
	String folder;
	String status;
	String date;
	
	
	public Study(){}
	
	public void setstudyEXPTID(String o){
		this.studyEXPTID= o;
	}
	public void setfolder(String o){
		this.folder= o;
	}
	public void setstatus(String o){
		this.status= o;
	}
	public void setStudyName(String o){
		this.studyName= o;
	}
	public String getName(){ 
		return this.studyName;
	}
	public String getstudyEXPTID(){ 
		return this.studyEXPTID;
	}
	
	

}
