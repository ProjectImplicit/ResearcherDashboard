package org.implicit.dashboard;

import javax.servlet.http.HttpServlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;















import javax.servlet.ServletContext;


 
//UPDATED
 

public class FileUploadManager {
	
	private ServletFileUpload uploader = null;
	private Manager mng =null;
	String path;
	String uploadFolder;
	String userKey;
	String study;
	

	public FileUploadManager(){}
	public void init() throws ServletException{
		
	
	}
	
	protected boolean createFolder(String path){
		
		Boolean success = new File(path).mkdir();
		if (success){
			return true;
		}else{
			return false;
		}
		
		
	}
	protected void drillUp(FileComposite compose){
		try{
			int index = 0;
			FolderUnit folder = compose.getCurrentFolder();
			String path = folder.getPath();
			File currentFolder = new File(path);
			File directory = currentFolder.getParentFile();
			String topPath= compose.getTopPath();
			compose.Clear();
			compose.setCurrentFolder("folder."+index++, directory.getAbsolutePath(), directory.getName());
			File[] fList = directory.listFiles();
			for (File file : fList) {
		        if (!file.isDirectory()) {
		        	FileUnit f =  new FileUnit("file."+index++,file.getAbsolutePath(),file.getName());
		        	SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
		        	f.setLastModified(sdf.format(file.lastModified()));
		        	compose.addFileorFolder(f);
		        } else {
		        	FolderUnit f = new FolderUnit("folder."+index++,file.getAbsolutePath(),file.getName());
		        	SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
		        	f.setLastModified(sdf.format(file.lastModified()));
		        	compose.addFileorFolder(f);
		        }

		    }
			
			String[] array = topPath.split("\\"+File.separator);
			
			ArrayList<String> collectArray = new ArrayList<String>(Arrays.asList(array));
			collectArray.remove(collectArray.size()-1);
			String joined = "";
			for (String s : collectArray)
			{
				joined += s + File.separator;
			}
			joined = joined.substring(0,joined.length()-1);
			compose.setTopPath(joined);
			
		}catch(Exception e ){
			System.out.println(e.getStackTrace());
			throw e;
		}
		
	}
	protected void drillDown(FileComposite compose,String id){
		try{
			int index = 0;
			String path = compose.getPath(id);
			String topPath= compose.getTopPath();
			compose.Clear();
			File directory = new File(path);
			compose.setCurrentFolder("folder."+index++, path, directory.getName());
			File[] fList = directory.listFiles();
			for (File file : fList) {
		        if (!file.isDirectory()) {
		        	FileUnit f =  new FileUnit("file."+index++,file.getAbsolutePath(),file.getName());
		        	SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
		        	f.setLastModified(sdf.format(file.lastModified()));
		        	compose.addFileorFolder(f);
		        } else {
		        	FolderUnit f = new FolderUnit("folder."+index++,file.getAbsolutePath(),file.getName());
		        	SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
		        	f.setLastModified(sdf.format(file.lastModified()));
		        	compose.addFileorFolder(f);
		        }

		    }
			compose.setTopPath(topPath+File.separator+directory.getName());
			
		}catch(Exception e ){
			System.out.println(e.getStackTrace());
			throw e;
		}
		

		
	}
	protected FileComposite getTopLevelFiles(String path){
		int index = 0;
		FileComposite compose = new FileComposite();
		//compose.load(path)
		File directory = new File(path);
		compose.setCurrentFolder("folder."+index++,path,directory.getName());
		File[] fList = directory.listFiles();
		for (File file : fList) {
	        if (!file.isDirectory()) {
	        	FileUnit f =  new FileUnit("file."+index++,file.getAbsolutePath(),file.getName());
	        	SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
	        	f.setLastModified(sdf.format(file.lastModified()));
	        	compose.addFileorFolder(f);
	        } else {
	        	FolderUnit f = new FolderUnit("folder."+index++,file.getAbsolutePath(),file.getName());
	        	SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
	        	f.setLastModified(sdf.format(file.lastModified()));
	        	compose.addFileorFolder(f);
	        }
	        
	    }
		compose.setTopPath(path);
		return compose;
		
		
	}
	protected boolean rename(String oldpath,String dest) throws Exception{

		try{
			File f = new File(oldpath);
			File nf = new File(dest);
			if (f.exists()){
				f.renameTo(nf);
				return true;
			}
		}catch(Exception e ){
			System.out.println(e.getStackTrace());
			throw e;
			
		}
		
		
	return false;
	}
	protected String deleteFile(User user,Manager mng,String path) throws Exception{
		
		boolean result=false;
		String msg="";

		try{

			File file = new File(path);
			if (file.isDirectory()){
				FileUtils util = new FileUtils();
				util.deleteDirectory(file);
				result=true;
				msg=msg+file.getName();
//				String studyName = file.getName();
//				if( user.existStudy(studyName) ){// in user study list, but need to check if it is indeed a study
//					String folder = user.getFolderName();
//					String studypath = mng.getFolderBase()+folder+File.separator+studyName;
//					String deleteStudyPath =file.getAbsolutePath(); 
//					if (studypath.equals(deleteStudyPath)){
//						throw new Exception ("Folder is a study folder");
//					}else{// not a study can delete
//						FileUtils util = new FileUtils();
//						util.deleteDirectory(file);
//						result=true;
//					}
//				}else{// not in the user study list, not a study can delete
						
//				}
			}else{// it is a file not a directory
				if(file.delete()){
	    			System.out.println(file.getName() + " is deleted!");
	    			result=true;
	    			msg=msg+file.getName();
	    		}else{
	    			System.out.println(" file was not deleted, path: "+file.getName() );
	    			result= false;
	    		}
			}
			
    	}catch(Exception e){
 
    		e.printStackTrace();
    		throw e;
    	}
		return msg;
	}
	protected void setpath(String study,String fileName, Manager mng,User user){
		
		String folder = user.getFolderName();
		if (study.equals("user")){
			path = mng.getFolderBase()+File.separator+fileName;
		}else{
			if (!study.equals("all")){
				//mng.setStudyIdFromDB(user);
				Study s =user.getStudy(study);
				path = mng.getFolderBase()+File.separator+folder+File.separator+fileName;
				
			}else{
				path = mng.getFolderBase()+File.separator+folder+File.separator+fileName;
			}
			
		}
		
		
		
		
	}
	protected void downLoadFile(User user,Manager mng,String fileName,ServletContext ctx,HttpServletRequest request,HttpServletResponse response,
			ServletOutputStream os,boolean download,String study) throws Exception{
		
		try {
			//setpath(study,fileName,mng,user);
			path = mng.getpath(study, fileName, user);
			//path = mng.downloadDir+File.separator+fileName;
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
				String[] names= path.split("\\" +File.separator);
				String name = names[names.length-1];
				response.setHeader("Content-Disposition", "attachment; filename=\"" + name+ "\"");
				response.setHeader("Content-Length", String.valueOf(new File(path).length()));
			}
			//System.out.println("file size: "+file.length());
			
			//ServletOutputStream os = response.getOutputStream();
			
			byte[] bufferData = new byte[1024];
			int read=0; 
			while((read = fis.read(bufferData))!= -1){
				os.write(bufferData, 0, read);
			}
			os.flush();
			os.close();
			fis.close();
			System.out.println("File downloaded at client successfully: "+file.getAbsolutePath());
			if (file.getAbsolutePath().contains(mng.downloadDir)){
				System.out.println("Deleting file: "+file.getAbsolutePath());
				file.delete();
			}
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		}
	
		
	}
	
	 protected String UploadFile(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, Exception {
		 
		 String msg="";
		 if(!ServletFileUpload.isMultipartContent(request)){
			 throw new ServletException("Content type is not multipart/form-data");
		 }
		 try {
     		response.setContentType("text/html");
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
			HttpSession session = request.getSession();
			User user = (User) session.getAttribute("userobject");
			Manager mng = (Manager) session.getAttribute("mng");
   			String userFolder = user.getFolderName();
   			path = mng.getpath(study, "", user);
   			File filesDir = new File(path);
   			fileFactory.setRepository(filesDir);
   			fileItemsIterator = fileItemsList.iterator();
			while(fileItemsIterator.hasNext()){

                FileItem fileItem = fileItemsIterator.next();
                if (!fileItem.isFormField()) {
                	boolean notlast = fileItemsIterator.hasNext();
                	msg=msg+processUploadedFile(fileItem,user,mng,study,notlast);
                }
			}
			
		} catch (FileUploadException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			throw e;
		}
		return msg; 
		 
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
	 private String processUploadedFile(FileItem fileItem,User user,Manager mng,String study,boolean notlast) throws Exception{
		 
		 boolean uploaded = false;
		 String msg="";
		 System.out.println("FieldName="+fileItem.getFieldName());
         System.out.println("FileName="+fileItem.getName());
         System.out.println("ContentType="+fileItem.getContentType());
         System.out.println("Size in bytes="+fileItem.getSize());
         
         File file = new File(path+File.separator+fileItem.getName());
         System.out.println("upload to: "+file.getAbsolutePath());
         if (fileItem.getName().contains(".expt")){
        	 if (study.equals("user")){// in super user case
        		 String seperator = "\\" + File.separator;
            	 String[] folders = file.getAbsolutePath().split(seperator);
            	 String folderName = folders[mng.getUserLocation()];
            	 System.out.println("user location: "+folderName);
        		 User diffrentUser = new User();
        		 diffrentUser.setFolderName(folderName);
        		 mng.setUserfromDBbyFolder(diffrentUser);
        		 mng.setStudyIdFromDB(diffrentUser);
        		 user=null;
        		 user=diffrentUser;
        	 }
        	 String seperator = "\\" + File.separator;
        	 String[] folders = file.getAbsolutePath().split(seperator);
        	 String studyFolderName = folders[folders.length-2];
        	 Study s = user.getStudy(studyFolderName);
        	 
        	 if (s!=null){
        		 System.out.println("Absolute Path at server="+file.getAbsolutePath());
                 try {
                	ArrayList exptfiles  = mng.cheackforExpt(new File(path));
                	if (exptfiles.size()==0){//if there are no expt files
                		fileItem.write(file);
                		uploaded=true;
                		if(notlast){
                			msg=msg+file.getName()+",";
                		}else{
                			msg=msg+file.getName();
                		}
                		
                		String exptID = mng.getExptID(file);
            			mng.updateStudy(exptID,file.getName(),mng.getSchema(file),studyFolderName,false,true,user);
            			s.addorUpdateEXPT(file.getName(), exptID);
            			
            			
                	}
                	if (exptfiles.size()>0){
                		if (existEXPT(exptfiles,file)){//expt exist
                			fileItem.write(file);
                    		uploaded=true;
                    		if(notlast){
                    			msg=msg+file.getName()+",";
                    		}else{
                    			msg=msg+file.getName();
                    		}

                    		String exptID = mng.getExptID(file);
                    		mng.updateStudy(exptID,file.getName(),mng.getSchema(file),studyFolderName,true,true,user);
                    		s.addorUpdateEXPT(file.getName(), exptID);
                			
                		}else{//new expt
                			fileItem.write(file);
                    		uploaded=true;
                    		if(notlast){
                    			msg=msg+file.getName()+",";
                    		}else{
                    			msg=msg+file.getName();
                    		}

                    		String exptID = mng.getExptID(file);
                    		mng.updateStudy(exptID,file.getName(),mng.getSchema(file),studyFolderName,false,false,user);
                    		s.addorUpdateEXPT(file.getName(), exptID);
                    		//String studyName = studyFolderName+"("+mng.getNameNoExtention(file)+")";
                    		//String folderPath = mng.getFolderBase()+File.separator+user.getFolderName()+File.separator+studyFolderName;
                    		//mng.createStudyinDB(studyName, mng.getExptID(file),mng.getSchema(file),path, user.getID(),false);
                			
                		}
                	}
        			
        		} catch (Exception e) {
        			// TODO Auto-generated catch block
        			e.printStackTrace();
        			throw e;
        		}
        		 
        	 }else{
        		 uploaded=false;
        		 //throw new ServletException("Expt file can be uploaded only to a study folder");
        	 }
         }else{
        	 try {
     			fileItem.write(file);
     			uploaded=true;
     			if(notlast){
        			msg=msg+file.getName()+",";
        		}else{
        			msg=msg+file.getName();
        		}
     		} catch (Exception e) {
     			// TODO Auto-generated catch block
     			e.printStackTrace();
     			throw e;
     		}
         }
         
         return msg;
		 
	 }


	

}
