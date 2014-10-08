define([], function () {
    
    var settings = function () {
    	var dbString='newwarehouse';
    	var curl = 'http://app-dev-01.implicit.harvard.edu/implicit/research/library/randomStudiesConfig/RandomStudiesConfig.xml';
        var hurl = 'http://app-dev-01.implicit.harvard.edu/implicit/research/library/randomStudiesConfig/HistoryRand.xml';
    	//var db = 'Research';
    	//var current = 'Any';
    	var baseURL = 'http://app-dev-01.implicit.harvard.edu/implicit';

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
       