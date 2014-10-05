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
	String email;
	
	
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
	public String getUserName(){
		return userName;
	}
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
		try{
			
			for (int i=0;i<Studies.size();i++){
				Study study = (Study) Studies.get(i);
				String Name = study.getName();
				if (Name.contains("(")){
					String[] names = Name.split("\\(");
					Name= names[0];
					
				}
				if (Name.equals(studyName)){
					return true;
					
				}
			}
			
			
		}catch(Exception e){
			System.out.println(e.getMessage());
			
		}
		return false;
		
	}
	
	public void addStudy(Study o){
		Studies.add(o);
	}
	public Study getStudy (String studyName){
		for (int i=0;i<Studies.size();i++){
			Study s = (Study) Studies.get(i);
			if (s.getName().equals(studyName)) return s;
		}
		return null;
		
		
	}
	public String getEmail(){
		return email;
	}
	public void setEmail(String o){
		email=o;
	}
	
	public HashMap getNames(){
		
		HashMap studiesMap = new HashMap();
		for (int index=0;index<this.Studies.size();index++){
			Study study = (Study) this.Studies.get(index);
			String name = study.getName();
			String foler = study.getFolderName();
			ArrayList exptArray = study.getstudyEXPTID();
			HashMap record = new HashMap();
			record.put("name", name);
			record.put("folder", foler);
			for (int i=0;i<exptArray.size();i++){
				EXPT ex= (EXPT) exptArray.get(i);
				record.put("exptID."+String.valueOf(i), ex.expt_id);
				record.put("exptName."+String.valueOf(i), ex.exptFileName);
			}
			studiesMap.put(name, record);
			
		}
		
		
		return studiesMap;
	}
	

}
