package org.implicit.dasboard;

import javax.servlet.http.HttpServlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletContext;


 

 

public class FileUploadManager {
	
	private ServletFileUpload uploader = null;
	private Manager mng =null;
	String path;
	String uploadFolder;
	String userKey;
	String study;
	

	public FileUploadManager(){}
	public void init() throws ServletException{
		
//		
//	    DiskFileItemFactory fileFactory = new DiskFileItemFactory();
//	    fileFactory.setRepository(filesDir);
//	    this.uploader = new ServletFileUpload(fileFactory);
//		
	}
	
	protected boolean createFolder(String folderUnder,String folderToCreate,String key){
		User user = new User();
		mng = new Manager();
		user.setKey(key);
		mng.setUserfromDB(user);
		String folder = user.getFolderName();
		if (folderUnder.equals("/")){
			path = mng.getFolderBase()+File.separator+folder+File.separator+folderToCreate;
			
		}else{
			path = mng.getFolderBase()+File.separator+folder+File.separator+folderUnder+File.separator+folderToCreate;
		}
		
		Boolean success = new File(path).mkdir();
		if (success){
			return true;
		}else{
			return false;
		}
		
		
	}
	protected String deleteFile(String filePath,String key){
		try{
			
			User user = new User();
			mng = new Manager();
			user.setKey(key);
			mng.setUserfromDB(user);
			String folder = user.getFolderName();
			path = mng.getFolderBase()+File.separator+folder+File.separator+filePath;
			File file = new File(path); 
    		 
    		if(file.delete()){
    			System.out.println(file.getName() + " is deleted!");
    			return "File/Folder was deleted";
    		}else{
    			return "File/Folder was not deleted";
    		}
 
    	}catch(Exception e){
 
    		e.printStackTrace();
 
    	}
		return "";
	}
	protected void downLoadFile(String key,String fileName,ServletContext ctx,HttpServletRequest request,HttpServletResponse response,
			ServletOutputStream os,boolean download){
		
		try {
			User user = new User();
			mng = new Manager();
			user.setKey(key);
			mng.setUserfromDB(user);
			String folder = user.getFolderName();
			path = mng.getFolderBase()+File.separator+folder+File.separator+fileName;
			File file = new File(path);
			if(!file.exists()){
				System.out.println("File doesn't exists on server.");
			}
			InputStream fis = new FileInputStream(file);
			String mimeType = ctx.getMimeType(file.getAbsolutePath());
			if (mimeType!=null){
				response.setContentType(mimeType);
				
			}else{
				response.setContentType("application/octet-stream");
				
			}
			//response.setContentType(mimeType != null? mimeType:"application/octet-stream");
			response.setContentLength((int) file.length());
			if (download){
				response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
				
			}
			System.out.println("file size: "+file.length());
			
			//ServletOutputStream os = response.getOutputStream();
			
			byte[] bufferData = new byte[1024];
			int read=0;
			while((read = fis.read(bufferData))!= -1){
				os.write(bufferData, 0, read);
			}
			os.flush();
			os.close();
			fis.close();
			System.out.println("File downloaded at client successfully");

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		

		
		
	}
	 protected boolean UploadFile(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		 
		boolean uploaded=false;
		 if(!ServletFileUpload.isMultipartContent(request)){
			 throw new ServletException("Content type is not multipart/form-data");
		 }
		 try {
     		response.setContentType("text/html");
		    //PrintWriter out = response.getWriter();
     		//ServletOutputStream out = response.getOutputStream();
            //out.write("<html><head></head><body>".getBytes("UTF8"));
            DiskFileItemFactory fileFactory = new DiskFileItemFactory();
            this.uploader = new ServletFileUpload(fileFactory);
			List <FileItem> fileItemsList = uploader.parseRequest(request);
			Iterator<FileItem> fileItemsIterator = fileItemsList.iterator();
			while(fileItemsIterator.hasNext()){

                FileItem fileItem = fileItemsIterator.next();
                if (fileItem.isFormField()) {
                	processFormField(fileItem);
                    
                }
			}
			User user = new User();
   			mng = new Manager();
   			user.setKey(userKey);
   			mng.setUserfromDB(user);
   			mng.setStudyIdFromDB(user);
   			String userFolder = user.getFolderName();
   			Study studyObj = user.getStudy(study);
   			String studyPath = studyObj.getFolderName();
   			path = studyPath+File.separator+uploadFolder;
   			File filesDir = new File(path);
   			fileFactory.setRepository(filesDir);
   			fileItemsIterator = fileItemsList.iterator();
			while(fileItemsIterator.hasNext()){

                FileItem fileItem = fileItemsIterator.next();
                if (!fileItem.isFormField()) {
                	uploaded=processUploadedFile(fileItem,user);
                }
			}
			
		} catch (FileUploadException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return uploaded; 
		 
	 }
	 private void processFormField(FileItem item){
		 String name = item.getFieldName();
		 String value;
		 if (name.equals("UserKey")){
			 userKey = item.getString();
		 }
		 if (name.equals("folder")){
			 uploadFolder = item.getString();
		 }
		 if (name.equals("study")){
			 study = item.getString();
		 }
		 
		 
		 
	 }
	 private boolean existEXPT(ArrayList exptfiles,File file){
		 for (int i=0;i<exptfiles.size();i++){
			 File f = (File) exptfiles.get(i);
			 if (f.getName().equals(file.getName())){
				 return true;
			 }
		 }
		 return false;
		 
	 }
	 private boolean processUploadedFile(FileItem fileItem,User user) throws ServletException{
		 
		 boolean uploaded = false;
		 System.out.println("FieldName="+fileItem.getFieldName());
         System.out.println("FileName="+fileItem.getName());
         System.out.println("ContentType="+fileItem.getContentType());
         System.out.println("Size in bytes="+fileItem.getSize());
         File file = new File(path+File.separator+fileItem.getName());
         if (fileItem.getName().contains("expt")){
        	 String[] folders = uploadFolder.split("/");
        	 String studyFolderName = folders[folders.length-1];
        	 if (mng.isStudy(studyFolderName)){
        		 System.out.println("Absolute Path at server="+file.getAbsolutePath());
                 try {
                	ArrayList exptfiles  = mng.cheackforExpt(new File(path));
                	if (exptfiles.size()==0){//if there are no expt files
                		fileItem.write(file);
                		uploaded=true;
            			mng.updateStudy(mng.getExptID(file),file.getName(),mng.getSchema(file),mng.trim(uploadFolder),false,true);
            			
            			
                	}
                	if (exptfiles.size()>0){
                		if (existEXPT(exptfiles,file)){//expt exist
                			fileItem.write(file);
                    		uploaded=true;
                    		mng.updateStudy(mng.getExptID(file),file.getName(),mng.getSchema(file),mng.trim(uploadFolder),true,true);
                			
                		}else{//new expt
                			fileItem.write(file);
                    		uploaded=true;
                    		mng.updateStudy(mng.getExptID(file),file.getName(),mng.getSchema(file),mng.trim(uploadFolder),false,false);
                    		//String studyName = studyFolderName+"("+mng.getNameNoExtention(file)+")";
                    		//String folderPath = mng.getFolderBase()+File.separator+user.getFolderName()+File.separator+studyFolderName;
                    		//mng.createStudyinDB(studyName, mng.getExptID(file),mng.getSchema(file),path, user.getID(),false);
                			
                		}
                	}
        			
        		} catch (Exception e) {
        			// TODO Auto-generated catch block
        			e.printStackTrace();
        		}
        		 
        	 }else{
        		 throw new ServletException("Expt file can be uploaded only to a study folder");
        	 }
         }else{
        	 try {
     			fileItem.write(file);
     			uploaded=true;
     		} catch (Exception e) {
     			// TODO Auto-generated catch block
     			e.printStackTrace();
     		}
         }
         
         return uploaded;
		 
	 }


	

}
