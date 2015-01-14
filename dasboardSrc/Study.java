package org.implicit.dasboard;

import java.io.Serializable;
import java.util.ArrayList;


//UPDATED
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


public class Study implements Serializable {
	
	ArrayList<EXPT> studyEXPTID;
	String studyName;
	String folder;
	String status;
	String date;
	String studyID;
	
	
	public Study(){
		studyEXPTID = new ArrayList<EXPT>();
	}
	
	public void setID(String id){
		this.studyID= id;
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
	public void setStatus(String o){
		this.status= o;
	}
	public void setStudyName(String o){
		this.studyName= o;
	}
	public void setstudyFolder(String o){
		this.folder = o;
		
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
	public String getStatus(){ 
		return this.status;
	}
	public String getID(){
		return this.studyID;
	}
	public void deleteExpt(String exptName){
		
		for (int i=0;i<studyEXPTID.size();i++){
			EXPT e = studyEXPTID.get(i);
			if (e.exptFileName.equals(exptName)){
				studyEXPTID.remove(i);
			}
		}
	}
	public void addorUpdateEXPT(String exptName,String exptID){
		Boolean found = false;
		for (int i=0;i<studyEXPTID.size();i++){
			EXPT e = studyEXPTID.get(i);
			if (e.exptFileName.equals(exptName)){
				found =true;
				e.expt_id = exptID;
			}
		}
		if (!found){
			EXPT e = new EXPT(exptID,exptName);
			this.addstudyEXPTID(e);
			
		}
		
	}
	

}
