package org.implicit.dashboard;

import java.io.File;
import java.text.SimpleDateFormat;
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
		this.currentFolder.setType("currentFolder");
		map.put("current", this.currentFolder.toMap());
		return map;
	}
	protected void refresh(){
		
		int index=0;
		String path = this.currentFolder.getPath();
		this.Clear();
		File directory = new File(path);
		setCurrentFolder("folder."+index++,path,directory.getName());
		File[] fList = directory.listFiles();
		for (File file : fList) {
	        if (!file.isDirectory()) {
	        	FileUnit f =  new FileUnit("file."+index++,file.getAbsolutePath(),file.getName());
	        	SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
	        	f.setLastModified(sdf.format(file.lastModified()));
	        	addFileorFolder(f);
	        } else {
	        	FolderUnit f = new FolderUnit("folder."+index++,file.getAbsolutePath(),file.getName());
	        	SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
	        	f.setLastModified(sdf.format(file.lastModified()));
	        	addFileorFolder(f);
	        }
	        
	    }
		this.setTopPath(path);
		
	}
	protected FileObj getUnit(String id) throws Exception{
		
		try{
			if (id.equals(this.currentFolder.getID())) return this.currentFolder;
			for (int i=0;i<FileObjList.size();i++){
				FileObj obj = FileObjList.get(i);
				String objID = obj.getID();
				if (objID.equals(id)){
					return obj;
				}
			}
		}catch(Exception e){
			System.out.println(e.getStackTrace());
			throw e;
		}
		
		throw new Exception("No Unit Found");
		
	}
}
