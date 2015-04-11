define([], function () {
      
    var settings = function () {
    	//var dbString='newwarehouse';
        var dbString='test';
    	var curl = 'http://app-dev-01.implicit.harvard.edu/implicit/research/library/randomStudiesConfig/RandomStudiesConfig.xml';
        var hurl = 'http://app-dev-01.implicit.harvard.edu/implicit/research/library/randomStudiesConfig/HistoryRand.xml';
    	var testStudyURL = 'http://app-dev-01.implicit.harvard.edu/implicit/Launch?study=/user/';
        //var db = 'Research';
    	//var current = 'Any';
    	var baseURL = 'http://app-dev-01.implicit.harvard.edu/implicit';
        // Configure the url for the download folder the folder where the system saves
        // the zipped folders. 
        var uploadDir ='/research/dashBoard/ZipFolder';


        var urlDownload = '/implicit/dashboard/download';
        // Configure the url 
        var urlView = '/implicit/dashboard/view/';

        // Configure the general user folder. Default is 'user'
        var userFolder ='user';
        this.getUserFolder = function(){

            return userFolder;
        }
        this.getUrlView = function(){
            return urlView;
        }
        this.getUrlDownload = function(){
            return urlDownload;
        }
        this.getZipFolder=function(){
            return uploadDir;
        }
        this.gettestStudyURL=function(){
            return testStudyURL;
        }
    	this.getDbString = function(){
    		return dbString;

    	}
    	this.getCurl = function(){
    		return curl;
    		
    	}
        this.getHurl = function(){
            return curl;
            
        }

    	this.getBaseURL = function(){
    		return baseURL;
    		
    	}
    	this.setDbString = function(s){
    		dbString=s;

    	}
    	this.setCurl = function(s){
    		curl=s;
    		
    	}
    	this.setBaseURL = function(s){
    		baseURL=s;
    		
    	}
    	

	};

    return settings;
        
});
       