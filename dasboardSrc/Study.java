package org.implicit.dasboard;

import java.util.ArrayList;

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
	
	ArrayList<EXPT> studyEXPTID;
	String studyName;
	String folder;
	String status;
	String date;
	
	
	public Study(){
		studyEXPTID = new ArrayList<EXPT>();
	}
	
	public void setstudyEXPTID(ArrayList o){
		studyEXPTID=o;
	}
	public void addstudyEXPTID(EXPT o){
		studyEXPTID.add(o);
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
	public String getFolderName(){
		return this.folder;
	}
	public ArrayList getstudyEXPTID(){ 
		return this.studyEXPTID;
	}
	
	

}
