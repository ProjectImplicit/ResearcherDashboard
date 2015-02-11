package org.implicit.dashboard;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class FileComposite {
	private String topPath="";
	private ArrayList<FileObj> FileObjList;
	private FolderUnit currentFolder;

	
	public FileComposite(){
		FileObjList = new ArrayList<FileObj>();
	};
	public FileComposite(String top){
		FileObjList = new ArrayList<FileObj>();
		this.topPath=top;
	};
	public void addFileorFolder(FileObj obj){
		FileObjList.add(obj);
	}
	protected void setTopPath(String path){
		this.topPath = path;
		
	}
	protected String getTopPath(){
		return this.topPath;
	}
	protected void Clear(){
		topPath="";
		FileObjList = null;
		FileObjList = new ArrayList<FileObj>();
		
	}
	protected FolderUnit getCurrentFolder(){
		return this.currentFolder;
	}
	protected void setCurrentFolder(String id,String path,String name){

		currentFolder = new FolderUnit(id,path,name);
		
	}
	protected String getPath(String id){

		for (int i=0;i<FileObjList.size();i++){
			FileObj obj = FileObjList.get(i);
			String objID = obj.getID();
			if (objID.equals(id)){
				return obj.getPath();
			}
		}
		return "";
		
	}
	protected HashMap toHashMap(){
		HashMap map = new HashMap();
		map.put("toppath", topPath);
		for (int i=0;i<FileObjList.size();i++){
			FileObj obj = FileObjList.get(i);
			map.put(i, obj.toMap());
			
		}
		return map;
	}
	protected FileUnit getFileUnit(String id){
		
		return null;
		
	}
}
