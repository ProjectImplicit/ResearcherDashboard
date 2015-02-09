package org.implicit.dashboard;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.ListIterator;

//UPDATED
public class User implements Serializable{
	
	String id;
	String OSFKey;
	String folderName;
	ArrayList Studies;
	String userName;
	String pass;
	String email;
	String role;
	FileComposite filesys;
	
	
	public User(){
		Studies = new ArrayList();
	} //
	
	protected void setFileSystem(FileComposite filesys){
		this.filesys=filesys;
	}
	public String getKey(){ return this.OSFKey;}
	
	public void setKey(String key){
		this.OSFKey=key;
	}
	
	public void setRole(String r ){
		this.role=r;
	}
	
	
	public void setID(String id ){
		this.id=id;
	}
	//////////
	
	public String getRole(){ return this.role;}
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
	public void deleteStudy(String studyName){
		ListIterator iterator = Studies.listIterator();
		while (iterator.hasNext()){
			Study s = (Study) iterator.next();
			if (s.getName().equals(studyName)){
				iterator.remove();
			}
		}
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
			String status = study.getStatus();
			ArrayList exptArray = study.getstudyEXPTID();
			HashMap record = new HashMap();
			record.put("name", name);
			record.put("folder", foler);
			record.put("status", status);
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
