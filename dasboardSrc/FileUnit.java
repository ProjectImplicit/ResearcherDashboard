package org.implicit.dashboard;

import java.util.HashMap;

public class FileUnit extends FileObj {

	private String id;
	private String path;
	private String name;
	private String creationDate;
	private String updateDate;
	private String type;
	
	

	public FileUnit(String id,String path,String name){
		
		this.id=id;
		this.path=path;
		this.name=name;
		this.type="file";
	}

	protected void setLastModified(String timestamp){
		this.updateDate = timestamp;
	}
	protected HashMap toMap(){
		HashMap map = new HashMap();
		map.put("id", id);
		//map.put("path", path);
		map.put("name", name);
		map.put("type", type);
		map.put("creationDate", creationDate);
		map.put("updateDate", updateDate);
		
		
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
