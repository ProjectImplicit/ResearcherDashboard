package org.implicit.dasboard;

import java.util.ArrayList;
import java.util.HashMap;

public class User {
	
	String id;
	String OSFKey;
	String folderName;
	ArrayList Studies;
	String userName;
	String pass;
	
	
	public User(){
		Studies = new ArrayList();
	} //
	
	public String getKey(){ return this.OSFKey;}
	
	public void setKey(String key){
		this.OSFKey=key;
	}
	
	public void setID(String id ){
		this.id=id;
	}
	
	public String getID(){ return this.id;}
	public void setUserName(String n ){
		this.userName=n;
	}
	public void setFolderName(String f ){
		this.folderName=f;
	}
	
	public String getFolderName(){
		return this.folderName;
	}
	public boolean existStudy(String studyName){
		for (int i=0;i<Studies.size();i++){
			Study study = (Study) Studies.get(i);
			if (study.getName().equals(studyName)){
				return true;
				
			}
		}
		return false;
	}
	
	public void addStudy(Study o){
		Studies.add(o);
	}
	
	public HashMap getNames(){
		
		HashMap studiesMap = new HashMap();
		for (int index=0;index<this.Studies.size();index++){
			Study study = (Study) this.Studies.get(index);
			String name = study.getName();
			String exptID = study.getstudyEXPTID();
			HashMap record = new HashMap();
			record.put("name."+String.valueOf(index), name);
			record.put("exptID."+String.valueOf(index), exptID);
			studiesMap.put(String.valueOf(index), record);
			
		}
		
		
		return studiesMap;
	}
	

}
