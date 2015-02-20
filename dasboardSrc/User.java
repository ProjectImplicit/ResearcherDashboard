package org.implicit.dashboard;

import java.io.File;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.ListIterator;

import org.apache.commons.lang.StringUtils;

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
			e.printStackTrace();
			
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
	protected void refreshStudyFromDB(Manager mng) throws Exception{
		this.Studies = new ArrayList();
		mng.setStudyIdFromDB(this);
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
			e.printStackTrace();
			throw e;
		}
		
		
	}
	protected boolean deleteStudy(String studyName,DbAPI api,Manager mng,FileUploadManager fileMng) throws Exception{
		try{
			Study s = this.getStudy(studyName);
			String id = s.getID();
			String studypath = s.getFolderName();
			if (studypath.equals("") || studypath.equals(File.separator) || studypath==null) throw new Exception ("Cannot delete wrong path");
			String studyFullPath = mng.getFolderBase()+this.getFolderName()+File.separator+studypath;
			this.deleteStudy(studyName);
			api.deleteStudy(id);
			fileMng.deleteFile(this, mng, studyFullPath);
			return false;
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}
	}
	protected void renameStudy(String studyName,String newName,DbAPI api,Manager mng,FileUploadManager fileMng) throws Exception{
		try{
			Study s = this.getStudy(studyName);
			String studyPath = s.getFolderName();
			if (newName.equals("") || newName.equals(File.separator) || newName==null) throw new Exception ("Cannot delete new name not valid: "+newName);
			if (studyPath.equals("") || studyPath.equals(File.separator) || studyPath==null) throw new Exception ("Cannot delete wrong path: "+studyPath);
			String fullStudyPath = mng.getFolderBase()+this.getFolderName()+File.separator+studyPath;
			String[] array = studyPath.split("\\" + File.separator);
			array[array.length-1] = newName;
			String newpath = StringUtils.join(array,File.separator);
			if (newpath.equals("") || newpath.equals(File.separator) || newpath==null) throw new Exception ("Cannot delete new path not valid: "+newpath);
			String newFullStudyPath = mng.getFolderBase()+this.getFolderName()+File.separator+newpath;
			boolean success =fileMng.rename(fullStudyPath, newFullStudyPath);
			if (success){
				s.setStudyName(newName);
				s.setstudyFolder(newpath+File.separator);
				String studyid = s.getID();
				api.updateTable("studies", "Name", newName, "studyID", studyid);
				api.updateTable("studies", "folder_name", newpath+File.separator, "studyID", studyid);
			}
			
			
		}catch (Exception e){
			e.getStackTrace();
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
