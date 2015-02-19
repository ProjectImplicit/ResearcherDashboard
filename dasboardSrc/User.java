package org.implicit.dashboard;

import java.io.File;
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
	protected void setUserName(String n ){
		this.userName=n;
	}
	protected void setFolderName(String f ){
		this.folderName=f;
	}
	
	protected String getFolderName(){
		return this.folderName;
	}
	protected boolean existStudy(String studyName){
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
	
	protected void addStudy(Study o){
		Studies.add(o);
	}
	protected Study getStudy (String studyName){
		for (int i=0;i<Studies.size();i++){
			Study s = (Study) Studies.get(i);
			if (s.getName().equals(studyName)) return s;
		}
		return null;
		
		
	}
	protected void deleteStudy(String studyName){
		ListIterator iterator = Studies.listIterator();
		while (iterator.hasNext()){
			Study s = (Study) iterator.next();
			if (s.getName().equals(studyName)){
				iterator.remove();
			}
		}
	}
	protected FileComposite getComposite(){
		return this.filesys;
	}
	protected String getEmail(){
		return email;
	}
	protected void setEmail(String o){
		email=o;
	}
	protected void updateExpt(String oldPath,String newName,DbAPI api){
		try{
			String[] array = oldPath.split("\\"+File.separator);
			String Exptname= array[array.length-1];
			String studyName= array[array.length-2];
			Study s = this.getStudy(studyName);
			EXPT e = s.getExpt(Exptname);
			String EXPTID = e.expt_id;
			s.updateExpt(Exptname, newName);
			String studyid = s.getID();
			api.updateExptFileName(studyid, newName, Exptname);
		}catch (Exception e){
			System.out.println(e.getStackTrace());
			throw e;
		}
		
		
	}
	protected void updateStudy(String studyName,String newName,DbAPI api){
		try{
			Study s = this.getStudy(studyName);
			s.setStudyName(newName);
			String studyid = s.getID();
			api.updateTable("studies", "Name", newName, "studyID", studyid);
			
		}catch (Exception e){
			System.out.println(e.getStackTrace());
			throw e;
		}
		
	}
	protected HashMap getNames(){
		
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
