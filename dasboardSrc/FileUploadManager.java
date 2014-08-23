package org.implicit.dasboard;

import javax.servlet.http.HttpServlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
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

 

 

public class FileUploadManager {
	
	private ServletFileUpload uploader = null;
	private Manager mng =null;

	public FileUploadManager(){}
	public void init() throws ServletException{
		
//		
//	    DiskFileItemFactory fileFactory = new DiskFileItemFactory();
//	    fileFactory.setRepository(filesDir);
//	    this.uploader = new ServletFileUpload(fileFactory);
//		
	}
	
	
	 protected void UploadFile(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		 
		
		 if(!ServletFileUpload.isMultipartContent(request)){
			 throw new ServletException("Content type is not multipart/form-data");
		 }
		 try {
     		response.setContentType("text/html");
		    PrintWriter out = response.getWriter();
            out.write("<html><head></head><body>");
			User user = new User();
			mng = new Manager();
			user.setKey(key);
			mng.setUserfromDB(user);
			String folder = user.getFolderName();
			String path = mng.getFolderBase()+File.separator+folder;
			List <FileItem> fileItemsList = uploader.parseRequest(request);
			Iterator<FileItem> fileItemsIterator = fileItemsList.iterator();
			while(fileItemsIterator.hasNext()){

                FileItem fileItem = fileItemsIterator.next();
                if (fileItem.isFormField()) {
                    processFormField(fileItem);
                } else {
                    processUploadedFile(fileItem);
                }
                System.out.println("FieldName="+fileItem.getFieldName());
                System.out.println("FileName="+fileItem.getName());
                System.out.println("ContentType="+fileItem.getContentType());
                System.out.println("Size in bytes="+fileItem.getSize());
                File file = new File(path+File.separator+fileItem.getName());
                System.out.println("Absolute Path at server="+file.getAbsolutePath());
                fileItem.write(file);
                out.write("File "+fileItem.getName()+ " uploaded successfully.");
                out.write("<br>");
                out.write("<a href=\"UploadDownloadFileServlet?fileName="+fileItem.getName()+"\">Download "+fileItem.getName()+"</a>");
      		
			}
			
		} catch (FileUploadException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 
		 
	 }
	 private processFormField(FileItem fileItem)


	

}
