package org.implicit.dasboard;
import static java.nio.file.FileVisitResult.*;

import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.Path;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashMap;


public class fileWalker extends SimpleFileVisitor<Path> {

	HashMap fileTree;
	
	public fileWalker(){
		fileTree = new HashMap();
	}
	public FileVisitResult visitFile(Path file,
            BasicFileAttributes attr) {
		if (attr.isSymbolicLink()) {
		System.out.format("Symbolic link: %s ", file);
		} else if (attr.isRegularFile()) {
		System.out.format("Regular file: %s ", file);
		} else {
		System.out.format("Other: %s ", file);
		}
		System.out.println("(" + attr.size() + "bytes)");
		return CONTINUE;
	}

	public FileVisitResult postVisitDirectory(Path dir,
            IOException exc) {
		System.out.format("Directory: %s%n", dir);
		return CONTINUE;
	}
	
	
	
	public FileVisitResult visitFileFailed(Path file,
            IOException exc) {
			System.err.println(exc);
			return CONTINUE;
	}
}
