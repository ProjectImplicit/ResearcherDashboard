package org.implicit.dasboard;


import java.io.File;
import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.SimpleDateFormat;
import java.util.HashMap;

//UPDATED
public class fileWalker implements Runnable  {
	

	HashMap openStruct;
	HashMap fileM;
	File root;
	
	public fileWalker(File file){
		openStruct = new HashMap();
		fileM = new HashMap();
		root = file;
		
	}
	
	public void run() {
		if (root.isFile()){
			HashMap attrb= new HashMap();
        	fileM.put(root.getName(),attrb );
		}else{
			File[] fList = root.listFiles();
			walkFiles(fList,root);
		}
	
	}
	public File getFile(){
		return root;
	}
	public HashMap getOpenStruct(){
		return openStruct;
	}
	public HashMap getFileM(){
		return fileM;
	}
	protected String getStudyRelativePath(String studyPath,String userfolderName){
		String res="";
		Boolean found=false;
		if (userfolderName.indexOf(File.separator)!=-1){
			String[] splitArray = userfolderName.split("\\"+File.separator);
			int length = splitArray.length;
			userfolderName = splitArray[length-1];
			
		}
		String[] splitArray = studyPath.split("\\"+File.separator);
		for (int i=0;i<splitArray.length;i++){
			if (found){
				res=res+splitArray[i]+File.separator;	
			}
			if (splitArray[i].equals(userfolderName)){
				found=true;
			}
			
		}
		if (res.equals("")){
			//System.out.println("returning from getStudyRelativePath: "+studyPath);
			return studyPath;
		}else{
			//System.out.println("returning from getStudyRelativePath: "+res);
			return res;
		}
		
	}
	private void walkFiles(File[] files,File basepath){
			
		for (File file : files) {
	       if (file.isDirectory()) {
	            //System.out.println("Directory: " + file.getName());
	        	String path = getStudyRelativePath(file.getAbsolutePath(),basepath.getAbsolutePath());
	        	openStruct.put(path, "close");
	            HashMap dirctory= new HashMap();
	            dirctory.put("path****", path);
	            fileM.put(file.getName(),dirctory );
	            walkFiles(file.listFiles(),basepath); // Calls same method again.
	        } else {
	        	HashMap attrb= new HashMap();
	        	SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
	        	attrb.put("date", sdf.format(file.lastModified()));
	        	fileM.put(file.getName(),attrb );
	            //System.out.println("File: " + file.getName());
	        }
	    } 
   		
   }
	
}
