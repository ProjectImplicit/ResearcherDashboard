package org.implicit.dashboard;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class FolderUnit extends FileObj{

	private String id;
	private String path;
	private String name;
	private String creationDate;
	private String updateDate;
	private String type;
	private ArrayList<FileObj> files;
	
	public FolderUnit(String id,String path,String name){
		this.id=id;
		this.path=path;
		this.name=name;
		this.type="folder";
		files = new ArrayList<FileObj>();
		
	}
	protected void setType(String type){
		this.type=type;
		
	}
	protected void setLastModified(String time){
		this.updateDate = time;
	}
	protected HashMap toMap(){
		HashMap map = new HashMap();
		map.put("id", id);
		map.put("path", path);
		map.put("name", name);
		map.put("type", type);
		map.put("creationDate", creationDate);
		map.put("updateDate", updateDate);
		HashMap Hashfiles = new HashMap();
		for (int i=0;i<files.size();i++){
			Hashfiles.put(i, files.get(i).toMap());
		}
		map.put("files", Hashfiles);
		return map;
	}
	@Override
	protected String getPath() {
		return this.path;
	}
	@Override
	String getID() {
		// TODO Auto-generated method stub
		return this.id;
	}
	
	
}
