
    require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        'jQuery': 'https://code.jquery.com/jquery-2.1.3.min',
        'bootstrap': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min',
        'jshint': 'jshint.min',
        'csvToTable':'jquery.csvToTable',
        'tablesorter':'tablesorter/jquery.tablesorter',
        'datepicker':'datepicker/js/bootstrap-datepicker',
        'context':'Contextmaster/context'
        

        

    },
    waitSeconds: 25,
    shim: {
        'jQuery': {
            exports: '$'
        },
        'bootstrap' : ['jQuery'],
        'csvToTable': ['jQuery'],
        'tablesorter':['jQuery'],
        'datepicker': ['jQuery','bootstrap'],
        'jshint':['jQuery'],
        'context':['jQuery']
        
        
        
    }
});
require(['domReady','api','jQuery','tracker','settings','deploy','fileSys','change','remove','bootstrap','jshint','csvToTable',
  'tablesorter','context'],
 function (domReady,API,$,Tracker,Settings,Deploy,fileSys,Change,Remove) {
 

  window.onload = function() {
    $('#studyModel').modal('show');
  };  
    // do something with the loaded modules
  domReady(function () {
      
      var model={};
      var api = new API();
      //$('#studyModel').modal('show');
      api.init(model,setStudies,SetUser);
      var id=0;
      var fileTableModel ={};
      fileTableModel.user=false;
      var fileObj;
      context.init({preventDoubleContext: false},model);
      var file = new fileSys(model,fileTableModel,2);
      var change = new Change(model);
      change.configure();
      var remove = new Remove(model);
      remove.configure();
      setLiseners();
       $("[rel='tooltip']").tooltip();
       
      // context.attach('.folder', [
      //   {header: 'Options'},
      //   {text: 'Upload File', action: uploadFile},
      //   {text: 'Create New Folder', action: newFolder},
      //   {text: 'Delete Folder', action: deleteFolder}
        
      // ]);
      // context.attach('.file', [
      //   {header: 'Options'},
      //   {text: 'View File', action: viewFile},
      //   {text: 'Download File', action: downloadFile},
      //   {text: 'Delete File', action: deleteFile}
      
        
      // ]);

      //$(document).find('input[type=file]').on('change', prepareUpload);
      $.ajaxSetup({
        statusCode: {
            401: requestUnauthorized,
        }
      });

      window.onerror = function(message, uri, line) {
        var fullMessage = 'error: '+location.href + '\n' + uri + '\n' + line +'\n'+message;
        alert(fullMessage);
        return false;
      }
      function requestUnauthorized(xhr){
        alert('You are logged out');
        window.location.href = xhr.getResponseHeader("Location");
      }
     

      $(document).on("click","#logout",function(){
        api.logout();

      });
      
     
      function getStudyPath(study){
        var study = findStudy(study);
        var folder = study.folder;
        var user = model.user;
        var found=false;
        var res='';
        var splitArray = folder.split(fileSeperator());
        for(var i=0;i<splitArray.length;i++){
          if (found){
            res=res+splitArray[i]+fileSeperator();
          }
          if (splitArray[i]===user.folder){
            found=true;
          }
        }
        return res;
      }
     

      function getStudyFromFileSys(fileSystem,info){
        
        $.each(fileSystem, function(k, v) {
          if (k.indexOf(".")===-1&& k!='id'&&k!='state'&&k!='path****'){//if folder
            if (k===info.study){
              info.studyObj=v;
              return false;
            }else{
              getStudyFromFileSys(v,info);
            }
          }
        });


      }
    
      $(document).on('click','.review',function(){
        var butt = $(this);
        var tr = $(this).parent();
        var studyName = $(tr).find('#studyRaw').val;
        api.submitforreview(studyName);
        alert('Your study was submitted.');
      });
      
      $(document).on('click','#personalFolder',function(){
        $('#fileSys').click();
      });
      $(document).on('click','#userFolder',function(){
        $('#uploadedModal').modal('show');
        $('#studyTablePanel').hide();
        $('#instruct').css("display","none");
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'file';
        model.active='';
        model.study='user';
        api.getFiles(model.key,model.study,setStudyTable);
      });

    
    
      function refreshStudyList(data){

            if (typeof data =='string'){
            if (data.indexOf('msg:')!=-1){
              var text = data.split(':')[1];
              $('#msgspan').text(text);
              $('#msgModal').modal('show');
              return;
            }else{
              if (data.indexOf('error:')!=-1){
                var text = data.split(':')[1];
                $('#msgspan').text(text);
                $('#msgModal').modal('show');
                return;
              }

            }

          } 
          $('#msgspan').text(data);
          $('#msgModal').modal('show');
          api.refreshStudy(setStudies);  
        
      }

      $('#newStudyNamePressCLOSE').on('click',function(){
        $('#studyexistalert').text('');
        $('#studyexistalert').hide();
        $('#newStudyNameModal').modal('hide');
      })
      $('#newStudyNamePressOK').on('click',function(){
          $('#studyexistalert').hide();
          var newname = $('#newstudyName').val();
          $('#newstudyName').val('');
          if (isStudyExist(newname)){
            $('#studyexistalert').text('Study named \''+newname +'\' already exist choose a different name.');
            $('#studyexistalert').show();

          }else{
            $('#newStudyNameModal').modal('hide');
            $('#newstudyName').val('');
            if(model.chosenStudy){
               api.renameStudy(model.chosenStudy,newname,function(data){
                refreshStudyList('Study was renamed');
               });
            }else{
              model.newname = newname;
              api.renameStudy(model.study,newname,function(data){
                refreshStudyList('Study was renamed');

              });
            }

          }
          
          

      })
      $(document).on('click','#renamestudytable', function(){
        var tr = $(this).parent().parent();
        var chosenStudy = $(tr).find('.studyRaw').text();
        model.chosenStudy=chosenStudy;
        $('#newStudyNameModal').modal('show');
        // $('#newStudyNamePressOK').on('click',function(){
        //   var newname = $('#newstudyName').val();
        //   $('#newstudyName').val('');
        //   api.renameStudy(chosenStudy,newname,refreshStudyList);

        // })
        
        
      })

      $(document).on('click','#renamestudy', function(){
        //var studyname = model.study;
        model.chosenStudy=false;
        $('#newStudyNameModal').modal('show');
        // $('#newStudyNamePressOK').on('click',function(){
        //   var newname = $('#newstudyName').val();
        //   $('#newstudyName').val('');
        //   model.newname = newname;
        //   api.renameStudy(model.study,newname,refreshStudyList);

        // })
      })
      $(document).on('click','#deleteStudy', function(){
        var tr =$(this).parent().parent();
        var chosenStudy = $(tr).find('.studyRaw').text();
        var studyid = $(tr).attr('id');
        $('#studyDeleteMsg').text('Study, \''+chosenStudy+'\' are going to be deleted, Are You Sure ? ');
         $('#deleteStudyModal').modal('show');
         $(document).one('click','#deleteStudyOK', function(){
          $('#uploadedModal').modal('show');
           api.deleteStudy(studyid,function(data){
              $('#uploadedModal').modal('hide');
              if (typeof data ==='string'){
                $('#msgspan').text(data);
                $('#msgModal').modal('show');

              } 
              refreshStudyList(data);
           });    

         });
      });
      $(document).on('click','#newStudy', function(){
        if (model.activePage==='file'){
          $('#location').html('<input id="locationcheck" type="checkbox"/> Create study in current location?');
        }
        $('#NewStudyModal').modal('show');

      });
      $(document).on('click','#newStudyOK',function(){
        debugger;
        var studyName = $('#studyName').val();
        $('#studyName').val('');
        model.study=studyName;
        //$('#uploadedModal').modal('show');
        if ($('#locationcheck').prop('checked')){
          model.key='CURRENT';

        }

        api.newStudy(takespaces(studyName),model.key,function(data){
          if (data.indexOf(":")!=-1){
            var msg = data.split(":")[1];
            alert(msg);
            //$('#uploadedModal').modal('hide');
          }else{
            var studies = model.studyNames;
            var user = model.user;
            var studyname = model.study;
            studies[studyname] = {name:studyname,exptID:'not_set',folder:user.folder+"/"+studyname,status:null};
            setStudies(studies);
            $('#instruct').hide();
            $('#result').html('');
            $('#studyTablePanel').hide();
            $('#studyTable').hide();
            setSideMenu();
            model.activePage = 'study';
            file.setFileSysTable();
            //populateFileTable();
          }
        });
        //api.getStudies(model.key,setStudies);

      });

      $(document).on("click",'.tableVal', function(){
         debugger;
        console.log($(this).text());
        model.activePage = 'study';
        var study = $(this).text();
        model.study = $(this).text();

        $('#instruct').hide();
        $('#result').html('');
        //$('#studyTablePanel').html('');
        $('#studyTablePanel').hide();
        $('#studyTable').hide();
        $('.studyButt').html(model.study+'<span class="caret"></span>');
        setSideMenu();
        file.setFileSysTable();
        
      });

      $(document).on('click','.studyRaw', function(){

        model.activePage = 'study';
        var tr =$(this).parent();
        var chosenStudy = $(tr).find('.studyRaw').text();
        var chosenStudyID = $(tr).attr('id');
        model.studyID= chosenStudyID;
        model.studsyObj = model.studyNames[chosenStudy];
        $('#instruct').hide();
        $('#result').html('');
        $('#studyTablePanel').hide();
        $('#studyTable').hide();
        file.setFileSysTable();
        setSideMenu();
        
      });

    
      $(document).on("click",'#deploy', function(){
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'deploy';
        var deployObj = new Deploy(model,'design1');
        deployObj.setHtml();
        model.active = deployObj;
      });  
      
      
      
      $(document).on('dragenter', function (e) 
      {
          e.stopPropagation();
          e.preventDefault();
      });
      $(document).on('dragover', function (e) 
      {
        e.stopPropagation();
        e.preventDefault();
        //obj.css('border', '2px dotted #0B85A1');
      });
      $(document).on('drop', function (e) 
      {
          e.stopPropagation();
          e.preventDefault();
      });

      /**
      * Desc: main listener for the 
      * 'rde' top menu navigetaion bar.
      *
      *
      */

      $(document).on("click",'#rde', function(){
        $('#result').html('');
        model.activePage = 'rde';
        model.active='';

      });

      /**
      * Desc: main listener for the 
      * 'home' top menu navigetaion bar.
      *
      */  

      $(document).on("click",'#home', function(){
        $('#result').html('');
        model.activePage = 'home';
        var menu = $('#sideMenu');
        menu.html( '</br>'+
                     '<strong>My Studies </strong>'+
                     '<div class="dropdown" style="display: inline">'+
                          '<button class="btn btn-default dropdown-toggle btn-sm studyButt" type="button" id="dropdownMenu1" data-toggle="dropdown">'+
                            'Studies '+
                            '<span class="caret"></span>'+
                          '</button>'+
                          '<ul class="dropdown-menu dropdownLI"  role="menu" aria-labelledby="dropdownMenu1">'+
                          '</ul>'+
                    '</div>'+ 
                    '<hr>'+
                    '<li class="active"><a href="#" id="home"><i class="fa fa-bullseye"></i> Home</a></li>'+
                    '<li><a href="#" id="fileSys"><i class="fa fa-tasks" ></i> File System</a></li>'+                    
                    '<li><a href="#" id="newStudy"><i class="fa fa-globe"></i> Create Study</a></li>'
                  );
        var sortedArray = sortStudies(model.studyNames);
        $.each(sortedArray, function(key, value) {
            $('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">'+value+'</a></li>');
        });
        setLiseners();
        $('#studyTablePanel').show();
        $('#studyTable').show();

      }); 

      /********************************
      *   
      * Listener for the 'File System' menu.
      * if the currnet request is for the file syste,
      * and not for a study, then 'model.activepage'    
      * would be set for 'file'.
      * We call the api getFiles command with the function
      * to render the file list.
      * model.active that is not set here is about to set an object
      * listener that will be triggerd when there is a changein the view.
      */
      


      $(document).on("click",'#fileSys', function(){
        
        
        $('#studyTablePanel').hide();
        $('#instruct').css("display","none");
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'file';
        model.active='';
        model.study='all';
        file.setFileSysTable();
        // api.getFiles(model.key,model.study,setStudyTable);

      });


    
      /**
      * Desc: main listener for the 
      * 'test' top menu navigetaion bar.
      *
      */ 

      $(document).on("click",'#managestudy', function(){
        
        $('#instruct').hide();
        $('#result').html('');
        $('#studyTablePanel').hide();
        $('#studyTable').hide();
        file.setFileSysTable();
        setSideMenu();

      });

      

      $(document).on("click",'.copyLink',function(){

         var button = $(this);
         var span = $(button).parent().parent().parent().parent().parent().find('.fileNameSpan');
         console.log(span);
         var fname = takespaces($(span).text());
         var tr = $(span).parent();
         var id = $(tr).attr("id");
         model.elementID = id;
         api.getUser(takespaces(model.key),function(data){
           var userObj = jQuery.parseJSON( data );
           var user = userObj.folder;
           var path='';
           if (model.activePage = 'file'){
            var toppath = $('#toppath').text();
            var array;
            var found=false;
           
            if (toppath.indexOf('\\')!=-1){
              array = toppath.split('\\');
            }else{
              array = toppath.split('/');
            }
            for (var i=0;i<array.length;i++){
              if (found){
                path=path+array[i]+'/';
              }

              if (array[i]===user) found=true;
            }
           }
           
           var settings = new Settings();
           var url = settings.gettestStudyURL();
           $('#copytextinput').val(url+user+"/"+studyName+"/"+fname+"&refresh=true");
           $('#CopyModal').modal('show');
           $(document).find('#CopyModal').on('shown.bs.modal',function(){
           $('#copytextinput').select();
             //$(this).select();
           });
           

         });



      });
      $(document).on("click",'.testStudy',function(){
         
         console.log($(this));
         //debugger;
         var button = $(this);
         var span = $(button).parent().parent().parent().parent().parent().find('.fileNameSpan');
         console.log(span);
         var fname = takespaces($(span).text());
         var tr = $(span).parent();
         var id = $(tr).attr("id");
         model.elementID = id;
         var path='';
         api.getUser(takespaces(model.key),function(data){

           var userObj = jQuery.parseJSON( data );
           var user = userObj.folder;
           if (model.activePage = 'file'){
            var toppath = $('#toppath').text();
            var array;
            var found=false;
           
            if (toppath.indexOf('\\')!=-1){
              array = toppath.split('\\');
            }else{
              array = toppath.split('/');
            }
            for (var i=0;i<array.length;i++){
              if (found){
                path=path+array[i]+'/';
              }

              if (array[i]===user) found=true;
            }
            
            // var pathA = new Array();
            // var path='';
            // var info = {};
            // info.found = false;
            // getPath(model.fileSystem,model.elementID,pathA,info);
            // for (var i=0;i<pathA.length;i++){
            //   path+=pathA[i]+"/";// dont change this is the right seperator for a URL.
            // }
            // studyName=path;
            // fname='';
            // if (model.study==='user') user='';

           }
           var settings = new Settings();
           var url = settings.gettestStudyURL();
           var random =Math.random();
           window.open(url+user+"/"+path+fname+"&refresh=true&_="+random);

         });
      });
      $(document).on("click",'.Svalidate',function(){
         var element = $(this);
         var tr = $(element).parent().parent();
         var td = $(tr).find('.file');
         var id = $(td).attr("id");
         model.elementID = id;
         //var span = $(element).parent().parent().find('.fileNameSpan');
         //var fname = $(span).text();
         api.Studyvalidate('','_ID',id,'',openStudyValidation);

      });
      $(document).on("click",'.validate',function(){
         console.log($(this));
         //debugger;
         var button = $(this);
         var span = $(button).parent().parent().find('.fileNameSpan');
         console.log(span);
         var fname = $(span).text();
         var id = $(span).parent().attr("id");
         model.elementID = id;
         // var pathA = new Array();
         // var path='';
         // var info = {};
         // info.found = false;
         // getPath(model.fileSystem,model.elementID,pathA,info);
         // for (var i=0;i<pathA.length;i++){
         //  path+=pathA[i]+fileSeperator();
         // }
         api.validateFile('','_ID',model.elementID,'',openValidation);

      });
      
      

      $(document).on('click','#removeStudy',function(){
        remove.setHtml();
      })

      $(document).on('click','#changeStudy',function(){
        change.setHtml();
      })

      /**
      * Desc: Listener for pressing a folder
      * in the file system
      * 
      *
      */

      

      $(document).on("click",'.test',function(){
        
        model.activePage = 'test';     
        fileTableModel.user=true;
        console.log($(this));
        var button = $(this);
        var anchor = $(button).parent().parent().find('a');
        model.study = $(anchor).text();
        $('.studyButt').text(model.study);
        $('#test').click();
        


      });
      $(document).on('click','#statsFile',function(){
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'trackmenu';
        var studyExpt;
        if (model.study!=undefined){
          var exptName = $(this).parent().parent().text();
          var study = model.study+"("+exptName+")";
          studyExpt = getExptid(study);
          if (studyExpt==='not_set'){
            api.getExpt(model.key,model.study,function(data){
              studyExpt = data;
              appendTracker(studyExpt);
            })
          }else{
            appendTracker(studyExpt);
          }
          
        }else{
          api.getUserName(takespaces(model.key),function(data){
          appendTracker(data);
           
          });
        }


      });
      $(document).on("click",'#trackmenu', function(){
        $('#result').html('');
        $('#studyTable').hide();
        model.activePage = 'trackmenu';
        var studyExpt=[];
        if (model.studyID!=undefined){
          //studyExpt = getExptid(model.study);
          //if (studyExpt==='not_set'){
          api.getExpt(model.key,model.studyID,function(data){
            var obj = jQuery.parseJSON( data );
            $.each(obj, function(key, value){
              if (key.indexOf('exptID')!=-1){
                  studyExpt.push(value);
                }
              
            })

            appendTracker(studyExpt);
          })
          //}else{
            //appendTracker(studyExpt);
          ///}
          
        }else{
          api.getUserName(takespaces(model.key),function(data){
          appendTracker(data);
           
          });
        }
      });
    

      $(document).on("click",'.statistics',function(){

        var button = $(this);
        var anchor = $(button).parent().parent().find('a');
        var study = $(anchor).text();
        setChartData(study);
        

      });
      // $("input[name='fileName']" ).change(function () {
      //     $('#upload').click();
      // });
///////////////////////////fUNCTIONS////////////////////////////////////

      function setLiseners(){
        $('#sideMenu li').click(function(e) {
          //alert('inside hover');
          $('#sideMenu li.active').removeClass('active');
          var $this = $(this);
          if (!$this.hasClass('active')) {
              $this.addClass('active');
          }
          e.preventDefault();
        });
      }

      function setSideMenu(){
        var menu = $('#sideMenu');
        menu.html(  '</br>'+
                     '<strong>My Studies </strong>'+
                     '<div class="dropdown" style="display: inline">'+
                          '<button class="btn btn-default dropdown-toggle btn-sm studyButt" type="button" id="dropdownMenu1" data-toggle="dropdown">'+
                            ''+
                            '<span class="caret"></span>'+
                          '</button>'+
                          '<ul class="dropdown-menu dropdownLI" role="menu" aria-labelledby="dropdownMenu1">'+
                          '</ul>'+
                    '</div>'+
                    '<hr>'+
                    '<li ><a href="#" id="home"><i class="fa fa-bullseye"></i> Home</a></li>'+
                    '<li class="active"><a href="#" id="managestudy"><i class="fa fa-tasks" ></i> Manage Study </a></li>'+
                    '<li><a href="#" id="trackmenu"><i class="fa fa-tasks" ></i> Statistics </a></li>'+
                    '<!--<li><a href="#" class="disabled"><i class="fa fa-tasks" ></i> Data </a></li>-->'+                    
                    '<li><a href="#" id="deploy"><i class="fa fa-tasks" ></i> Deploy </a></li>'+
                    '<li><a href="#" id="changeStudy"><i class="fa fa-tasks" ></i> Study Change Request </a></li>'+
                    '<li><a href="#" id="removeStudy"><i class="fa fa-tasks" ></i> Study Removal </a></li>'+
                    '<!--<li><a href="#" id="submitReview"><i class="fa fa-tasks" ></i> Submit for Review </a></li>-->'+
                    '<li><a href="#" id="newStudy"><i class="fa fa-globe"></i> Create Study</a></li>'
                  );
        

        var sortedArray = sortStudies(model.studyNames);
        $.each(sortedArray, function(key, value) {
            $('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">'+value+'</a></li>');
        });
        $('.studyButt').html(model.study+'<span class="caret"></span>');
        setLiseners();
      }

      function getEXPTIDFromStudy(EXPTFile,study){
        var num;
        var id;
        $.each(study,function(k,v){
          if (v.indexOf(EXPTFile)!=-1){
            var numArray = k.split(".");
            num = numArray[1];
            return false;
          }
        })
        $.each(study,function(k,v){
          if (k.indexOf('exptID')!=-1 && k.indexOf(num)!=-1){
            id=v;
            
          }
        })
        return id;
      }

    
    
      function newStudySuccess(studyname){
        //alert('study was created');
        var studies = model.studyNames;
        var user = model.user;
        studies[studyname] = {name:studyname,exptID:'not_set',folder:user.folder+"/"+studyname};
        //studies.push({name:studyname,exptID:'not_set'});
        setStudies(studies);
        model.study=studyname;
        $('#instruct').hide();
        $('#result').html('');
        //$('#studyTablePanel').html('');
        $('#studyTablePanel').hide();
        $('#studyTable').hide();
        setSideMenu();
        file.setFileSysTable();
        //populateFileTable();
      }

   
        
      function folderID(fileSystem){
        var res;
        $.each(fileSystem, function(k, v) {
          if (k==='id'){
            res=v;
            return false;
          }
        });
        return res;
      }
      function findElement(fileSystem,elementID,info){
        
        $.each(fileSystem, function(k, v) {
               if (info.found) return false; 
               //var extension = k.split(".");
               if (isFile(k,fileSystem)){
                 if (v.id===elementID){
                  info.folder = k;
                  info.found=true;
                  return false;
                 }
               }else{
                 if (k!='state' && k!='id' && k!='path****'){
                   if (folderID(v)===elementID){
                    info.found=true;
                    info.folder = v;
                    return false;
                   }else{
                    findElement(v,elementID,info);
                    
                   }
                   
                 }
               }
             
          });
        
      }
      /**
      * Desc: using file or folder id
      * get the path of thar file/folder
      * return an array of path elements.
      *
      */
      


      function getPath(fileSystem,elementID,pathA,info){
        
          $.each(fileSystem, function(k, v) {
               if (info.found) return false; 
               //var extension = k.split(".");
               if (isFile(k,fileSystem)){
                 if (v.id===elementID){
                  if (!info.found) pathA.push(k);
                  info.found=true;
                  return false;
                 }
               }else{
                 if (k!='state' && k!='id' && k!='path****'){
                   if (!info.found) pathA.push(k);
                   if (folderID(v)===elementID){
                    info.found=true;
                    return false;
                   }else{
                    getPath(v,elementID,pathA,info);
                    if (!info.found) pathA.pop();

                   }
                   
                 }
               }
             
          });
    
      }
      /**
      * Desc: Get the path to file or folder
      * goes over the 'fileSystem' Object and calculate the
      * path according to the id stored in model.elementID
      *
      */
      function getPathToFile(){

        var pathA = new Array();
        var path='';
        var info = {};
        info.found = false;
        getPath(model.fileSystem,model.elementID,pathA,info);
        for (var i=0;i<pathA.length;i++){
          path+=pathA[i]+fileSeperator();
        }
        return path;
      }

   
      function downLoadSuccess(data){
        //alert('download syccesfull');
        
      }
      
    
      function uploadError(jqXHR, textStatus, errorThrown){
        console.log('ERRORS: ' + textStatus);

      }
     
      
      function setChartData(study){
         var data = {};
         var studyExpt = getExptid(study);
         var ctx = document.getElementById("myChart").getContext("2d");
         var settings = new Settings();
         var currentdate = new Date();
         var since = new Date();
         since.setDate(since.getDate()-7);

         var sinceTxt = (since.getMonth()+1)+"/"+since.getDate()+"/"+since.getFullYear();
         var untilTxt = (currentdate.getMonth()+1)+"/"+currentdate.getDate()+"/"+currentdate.getFullYear(); 
         data.db = 'Research';
         data.testDB= "test";
         data.current = 'Any';
         data.study = studyExpt;
         //data.study = 'cebersole.ml3full';
         data.task = '';
         data.since = sinceTxt;
         data.until = untilTxt;
         data.refresh ='no';
         data.endTask='';
         data.filter = '';
         data.endTask='';
         data.studyc ='true';
         data.taskc = 'false';
         data.datac = 'false';
         data.timec = 'true';
         data.dayc = 'true';
         data.weekc = 'false';
         data.monthc = 'false';
         data.yearc = 'false';
         data.method = '3';
         data.curl= settings.getCurl();
         data.hurl= settings.getHurl();
         data.cpath='';
         data.hpath='';
         data.tasksM='3';
         data.threads = 'yes';
         data.threadsNum = '1';
         data.baseURL = settings.getBaseURL();

         api.getTracker(data,function(result){

          console.log(result);
          var resultRaws = result.replace( /\n/g, " " ).split( " " );
         
          var datactx = {};
          var labels =[];
          var datasets = [{
            label: "CR%",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: []
          }];

          for (var i=1;i<resultRaws.length-2;i++){
            var raws = resultRaws[i].split(",");
            labels[i-1]=raws[1];
            var cr = raws[4];
            cr = cr.substring(0,cr.length-2);
            datasets[0].data[i-1] = cr;
            
          }

          datactx.labels = labels;
          datactx.datasets = datasets;
          var myChart = new ChartFX(ctx);
          var myBarChart = myChart.Bar(datactx);
          $('#myStats').modal('show');


         });

          
      }
      function parseline(str,a,b,c,d){
        var res = str.replace('{a}',a);
        res = res.replace('{b}',b);
        res = res.replace('{c}',c);
        res = res.replace('{d}',d);
        return res;
      }

      function SetUser(data){
        var userObj = jQuery.parseJSON( data );
        model.user = userObj;
        $('#userName').html('<i class="glyphicon glyphicon-user"></i><span class="caret"></span>'+userObj.name);
        api.getStudies('',setStudies);
      }
     
      function sortStudies(studyArray){
        var sortArray= new Array();
        $.each(studyArray, function(key, value) {
            console.log(key + "/"+value);
            sortArray.push(value);
            //update(key);
            
        });
        sortArray.sort(function (a, b) {
          var namea= a.name;
          var nameb = b.name;

          if (namea.toLowerCase() < nameb.toLowerCase()) return -1;
          if (namea.toLowerCase() > nameb.toLowerCase()) return 1;
          return 0;

          //return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        //sortArray.sort();
        return sortArray;
      }
     

      function isStudyExist(studyname){
        var studies = model.studyNames;
        for (var key in studies) {
          if (studies.hasOwnProperty(key)) {
              if (key===studyname){
                return true;
              }
          }
        }
       
        return false;
      }

      function setFilters (array){
        var filterArray=[];
        for (var i=0;i<array.length;i++){
          var study = array[i];
          var path = study.folder;
          var studyarray;
          if (path.indexOf('/')!=-1){
            studyarray = path.split('/');
          }else{
            studyarray = path.split('\\');
          }
          filterArray.push(studyarray);

        }
        return filterArray;
      }

      function setStudies (data){
        
       console.log(data);
       
       $('.dropdownLI').html('');
        $('#studyTable > tbody').html('');
        var obj;
        var studies=[];
        if(typeof data =='object'){
          obj = data;
        }else{
          obj = $.parseJSON( data );
        }
        model.studyNames=obj;
        model.selectedName='';
        var sortArray = sortStudies(obj);
        var filterArray = setFilters(sortArray);
        setFilterDropDowns(filterArray,0);
        createStudyTable(sortArray);
      }

      function setFilterDropDowns(array,level){
        var filterarray=[];
        $('#filterbox').append('<div >Filter: '+
          '<div class="dropdown" style="display:inline;">'+
            '<button style="display:inline;" class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">'+
              'Studies'+
              '<span class="caret"></span>'+
            '</button>'+
            '<ul id="dropoptions"class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">'+
                            
            '</ul>'+
          '</div>'+

        '</div>');
        for (x=0;x<array.length;x++){
          var a = array[x];
          var object = a[level];
          if (a[level].length>0){
            filterarray.push(a[level]);  
          }
          
        }
        for (var i=0;i<filterarray.length;i++){
          $('#dropoptions').append('<li role="presentation"><a class="optionselect" role="menuitem" tabindex="-1" href="#">'+filterarray[i]+'</a></li>');
        }


      }
      $(document).on('click','.optionselect',function(){
        var newstudyarray=[];
        var option = $(this);
        var selection = $(option).text();
        var studies = model.studyNames;
        $.each(studies,function(key,value){
          if (value.name===selection) newstudyarray.push(value);
        })
        createStudyTable(newstudyarray);

      });
      function createStudyTable(sortArray){
        $('#studyTable > tbody').html('');
        for (var i=0;i<sortArray.length;i++){
          var value = sortArray[i];
          update(value.name,value);
        }
        if (model.newname!=undefined){
          $('.studyButt').html(model.newname+' <span class="caret"></span>');
          model.newname=undefined;
        }
        if (model.activePage === 'file'){
           //$('#fileSys').click();

        }
        $('#studyModel').modal('hide');  
      }

      function openStudyValidation(data){
        //debugger;
        var errors = data.split("<br/>");
        console.log(errors);
        var len = errors[0].length;
        errors[0]=errors[0].slice(4,len);
        $('#validatetitle').text('Study Validation');
        $('#validateTable > tbody').empty();
        if (errors.length===0){
          $('#validateTable > tbody').append('<tr><td>No Errors Found</td></tr>');
        }
        for (var i=0;i<errors.length;i++){
          var error = errors[i];
          $('#validateTable > tbody').append('<tr><td>'+error+'</td></tr>');
        }
        $('#validateModal').modal('show');
      }

      function openValidation(data){
        console.log(data);
        var configuration = '/* jshint undef: true, es3:true */';
        var globals = '/* global define,xGetCookie,$,top */';
        var cont =globals+'\n'+configuration+'\n'+data;
        JSHINT(cont);
        console.log(JSHINT.errors);
         $('#validateTable > tbody').empty();
        for (var i=0;i<JSHINT.errors.length;i++){

              //console.log(JSHINT.errors[i]);
              var obj = JSHINT.errors[i];
              var a = obj.a;
              var b = obj.b;
              var c = obj.c;            
              var d = obj.d;            
              var objerr = obj.id;
              var rawobj = obj.raw;
              var rawS = parseline(rawobj,a,b,c,d);
              var line = obj.line;
              var char = obj.character;
              var error = 'Error: '+objerr+'     '+'Description: '+rawS+'     '+'line: '+line+'     '+'charecter: '+char;
              //var error = JSON.stringify(obj, null, 2);
              $('#validateTable > tbody').append('<tr><td>'+error+'</td></tr>');
              
        }
        if (JSHINT.errors.length===0){
         $('#validateTable > tbody').append('<tr><td>No Errors Found</td></tr>');
        }
        $('#validateModal').modal('show');
      }

      /**
      * Desc: changes the folder from open
      * to close state or vise versa when
      * it is being clicked.
      */
      function fileSeperator(){
        if(model.user.os==='unix'){
            return '/';
          }else{
            return '\\';
          }
      }
      function changeFolderState(name,id){
        var obj = model.openStruct;
        var pathA = new Array();
        var path='';
        var info = {};
        info.found = false;
        getPath(model.fileSystem,id,pathA,info);
        for (var i=0;i<pathA.length;i++){
          path+=pathA[i]+fileSeperator();
        }
        var element = obj[path];
        if (element==='open'){
          obj[path]='close';
          return 'close';
        }else{
          obj[path]='open';
          return 'open';
        }
                   
      }



   

      function takespaces(name){ return name.replace(/\s+/g, '');}

      /* Returns the folder object according to name


      */

      function findFolder(ObjTree,name,id){
        var res;
        //debugger;
        $.each(ObjTree, function(k, v) {
          if (k===name){
            res= v;
            return false;
          }
          if (k.indexOf(".")===-1 && k!='state' && k!='id' && k!='path****'){
            res = findFolder(v,name);
            if (res!=undefined){
              return false;
            }
            
          }
          
         });
        return res;
      }

      
      function sortedKeys(filesObj){
        var sortArray= new Array();
        $.each(filesObj, function(key, value) {
            sortArray.push(key);
        });
        sortArray.sort(function (a, b) {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        //sortArray.sort();
        return sortArray;
      }
      function createUserButtons(){
        var user = model.user;
        var role = user.role;
        if (role==='SU'){
          if (model.study==='all' || model.study==='user'){
            $('#result').append('<div><button class="btn btn-success btn-sm" type="button" id="userFolder" type="button">User</button>'+
            '<button class="btn btn-success btn-sm" type="button" id="personalFolder" type="button" style="margin-left:10px;">Personal</button></div>');
          }
  
        }
      }
      function isFile(k,obj){
        if (k==='state' || k==='id' || k==='path****'){
          return false;
        }
        var object = obj[k];
        var path = object['path****'];
        if (path!=undefined){
          return false;
        }else{
          return true;
        }

      }
      function createRawsRecursive(filesObj,recursive,user){

         fileTableModel.level=fileTableModel.level+1;
        var keys = sortedKeys(filesObj);
        console.log('in create raws:' +model.study);
        if (recursive===false){//entering this function for the first time

          $('#result').html('');
          createDandD();
          createUserButtons();
          createTable();
        }

       var numOfElements=0;
       for (var i=0;i<keys.length;i++){
          var k = keys[i];
          if (k!='state' && k!='id' && k!='path****'){
             numOfElements++;
          }

          var extension = k.split(".");
          if (isFile(k,filesObj)){
            if (extension[1]==='jsp' && user===false){
             addJspRaw(k,fileTableModel.level,filesObj[k]);
           }else{
             if (extension[1]==='expt' && user===false){
             addExptRaw(k,fileTableModel.level,filesObj[k]);
             }else{
               if (extension[1]==='js' && user===false){
                 addJSRaw(k,fileTableModel.level,filesObj[k]);
               }else{
                 addFileRaw(k,fileTableModel.level,filesObj[k]);
               }
             }
           }
          }else{
           if (k!='state' && k!='id' && k!='path****'){
             addFolderRaw(k,fileTableModel.level,filesObj[k]);
             if (FolderState(filesObj[k])==='open'){
               createRaws(filesObj[k],true,user);
               fileTableModel.level=fileTableModel.level-1;
             }
           }
          
         }


            
         }
         if (numOfElements===0){
          addEmptyRaw(fileTableModel.level);

         }
      }
      
      function createRaws(filesObj,recursive,user){

        
        createRawsRecursive(filesObj,recursive,user);
        var currentFolder={};
        var check;
        if (model.currentFolder != null && model.currentFolder != undefined){
         currentFolder = model.currentFolder;
         var td = $(document).find('#'+currentFolder.id);
         var tr  = td.parent();
         check = $(tr).find('[type=checkbox]');
         $(check).prop('checked', true);
         currentFolder.name = takespaces($(tr).find('.folder').text());
         
        }
        
        $('#currentName').text(currentFolder.name);
      }
      
      function getStudyTestlHtml(){
        var html='<div class="dropdown" style="display: inline">'+
                    '<button type="button" id="dropdownTest" style="margin-left:20px;" class="btn btn-primary btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="true">'+
                      'Study Tester'+
                      '<span class="caret"></span>'+
                    '</button>'+
                    '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownTest">'+
                      '<li><a class="testStudy nohref">Run Study</a></li>'+
                      '<li><a  class="copyLink nohref">Copy link</a></li>'+
                    '</ul>'+
                  '</div>';
        return html;

      }
      function addExptRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;

        
        var html = '<tr>'+
          '<td class="file" id="'+v.id+'" >'+
            '<span class="fileNameSpan" style="margin-left:'+level*50+'px" ><input type="checkbox" class="check" style="margin-right:10px;">'+
              '<i class="fa fa-file-text" ></i> '+file+
            '</span>'+
          '</td>'+
          '<td>'+
              '<button type="button" class="btn btn-primary btn-xs Svalidate">Run study validator</button>'+getStudyTestlHtml()+
              '<!--<button type="button" style="margin-left:20px;" class="btn btn-primary btn-xs testStudy">Test the study</button>'+
              '<button type="button" style="margin-left:20px;" class="btn btn-primary btn-xs runData">Run data tester</button>-->'+
              '<button type="button" id="viewFile" style="margin-left:20px;" class="btn btn-primary btn-xs">View File</button>'+
              '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
              '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
              '<!--<button type="button" id="deployButton" style="margin-left:20px;" class="btn btn-primary btn-xs">Deploy</button>'+
              '<button type="button" style="margin-left:20px;" id="statisticsButton" class="btn btn-primary btn-xs ">Statistics</button>'+
              '<button type="button" style="margin-left:20px;" id="dataFile" class="btn btn-primary btn-xs ">Data</button>-->'+
            '</td>'+
          '</tr>';
          
          
        $('#fileTabale > tbody').append(html);
      }
      function addJspRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+v.id+'" >'+
            '<span class="fileNameSpan" style="margin-left:'+level*50+'px"><input type="checkbox" class="check" style="margin-right:10px;"><i class="fa fa-file-text" >'+
            '</i> '+file+
            '</span>'+
          '</td>'+
          '<td>'+
                '<button type="button" id="viewFile" class="btn btn-primary btn-xs">View File</button>'+
                '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
                '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
          '</td>'+
        '</tr>');
      }
      function addJSRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+v.id+'">'+
            '<span class="fileNameSpan" style="margin-left:'+level*50+'px"> <input type="checkbox" class="check" style="margin-right:10px;">'+
              '<i class="fa fa-file-text" ></i> '+file+
            '</span>'+
          '</td>'+
          '<td>'+
            '<button type="button" class="btn btn-primary btn-xs validate">Check js syntax</button>'+
            '<button type="button" id="viewFile" style="margin-left:20px;" class="btn btn-primary btn-xs">View File</button>'+
            '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
            '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+     
           '</td>'+
        '</tr>');

      }    
      function addFileRaw(file,level,v){
        fileTableModel.row = fileTableModel.row+1;
        $('#fileTabale > tbody').append('<tr>'+
          '<td class="file" id="'+v.id+'" >'+
            '<span class="fileRaw fileNameSpan" style="margin-left:'+level*50+'px"><input type="checkbox" class="check" style="margin-right:10px;">'+
              '<i class="fa fa-file-text"  ></i> '+file+
            '</span>'+
          '</td>'+
          '<td>'+
                '<button type="button" id="viewFile" class="btn btn-primary btn-xs">View File</button>'+
                '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
                '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
          '</td>'+
        '</tr>');
      }
      
      function addFolderRaw(file,level,v){

        fileTableModel.row = fileTableModel.row+1;
        var raw = fileTableModel.row;
        $('#fileTabale > tbody').append('<tr>'+
            '<td id="'+v.id+'" >'+
              '<span  style="margin-left:'+level*50+'px"><input type="checkbox" class="check" style="margin-right:10px;">'+
                '<span class="folder" style="cursor:pointer"><i class="fa fa-folder" ></i> <span id="folderNameR">'+file+'</span></span>'+
              '</span>'+
            '</td>'+
            '<td>'+
                '<button type="button" id="uploadFile" class="btn btn-primary btn-xs">Upload File</button>'+
                '<button type="button" style="margin-left:20px;" id="newFolder" class="btn btn-primary btn-xs">Create New Folder</button>'+
                '<button type="button" style="margin-left:20px;" id="deleteFolder" class="btn btn-primary btn-xs ">Delete Folder</button>'+
                '<button type="button" style="margin-left:20px;" id="downloadFolder" class="btn btn-primary btn-xs ">Download Folder</button>'+
            '</td>'+
          '</tr>');

      }
      function addEmptyRaw(level){

        fileTableModel.row = fileTableModel.row+1;
        var raw = fileTableModel.row;
        $('#fileTabale > tbody').append('<tr>'+
            '<td class="" id="" >'+
              '<span style="margin-left:'+level*50+'px;">'+
                'Folder is Empty'+
              '</span>'+
            '</td>'+
            '<td>'+
            '</td>'+
          '</tr>');

      }


      function setFilePerUser(data){

        fileObj = jQuery.parseJSON( data );
        createTable();
        createUserRaws(fileObj,false);

      }

      // function setOpenStruct(fileObj){
      //   for (var k in fileObj) {
      //     if (fileObj.hasOwnProperty(k)) {
      //       var v = fileObj[k];
      //       //alert(key + " -> " + p[key]);
      //       var extension = k.split(".");
      //       if (extension.length>1){//file 
      //       }else{
      //         if (k!='state' && k!='id'){
      //           var obj = model.openStruct;
      //           for (var k2 in v) {
      //             if (v.hasOwnProperty(k2)) {
      //               var v2 = fileObj[k];
      //               if (k2==='id'){
      //                 var pathA = new Array();
      //                 var path='';
      //                 var info = {};
      //                 info.found = false;
      //                 getPath(model.fileSystem,v2,pathA,info);
      //                 for (var i=0;i<pathA.length;i++){
      //                   path+=pathA[i]+'/';
      //                 }
      //                 obj[path] = 'close';
      //               }
      //             }
      //           }
      //           setOpenStruct(v);
                
      //         }
              
      //       }

      //     }
      //   }
      // }
      function setOpenStruct(fileObj){
      
       $.each(fileObj, function(k, v) {
          //var extension = k.split(".");
          if (isFile(k,fileObj)){//file 
          }else{
            if (k!='state' && k!='id' && k!='path****'){
              var obj = model.openStruct;
              $.each(v, function(k2, v2) {
                if (k2==='id'){
                  var pathA = new Array();
                  var path='';
                  var info = {};
                  info.found = false;
                  getPath(model.fileSystem,v2,pathA,info);
                  for (var i=0;i<pathA.length;i++){
                    path+=pathA[i]+fileSeperator();
                  }
                  obj[path] = 'close';
                }
              });
              setOpenStruct(v);
              
            }
            
          }
        });
         
      }
     

      function addFolderRawB (file,level,v){
          
          $('#fileTabale > tbody').append(
            '<tr>'+
              '<td class="folder" id="'+v.id+'" >'+
                '<span  style="margin-left:'+level*50+'px"><i class="fa fa-folder" ></i> '+file+'</span>'+
              '</td>'+
              '<td>'+
                '<button type="button" id="uploadFile" class="btn btn-primary btn-xs">Upload File</button>'+
              '</td>'+  
              '<td>'+  
                  '<button type="button" style="margin-left:20px;" id="newFolder" class="btn btn-primary btn-xs">Create New Folder</button>'+
              '</td>'+    
              '<td>'+    
                  '<button type="button" style="margin-left:20px;" id="deleteFolder" class="btn btn-primary btn-xs ">Delete Folder</button>'+
              '</td>'+
            '</tr>'
          );
      }

      function addFileRawB (file,level,v){

          
          $('#fileTabale > tbody').append(
            '<tr>'+
             '<td class="file" id="'+v.id+'" >'+
               '<span class="fileRaw" style="margin-left:'+level*50+'px">'+
                  '<i class="fa fa-file-text"  ></i> '+file+
                '</span>'+
              '</td>'+
              '<td>'+
                '<button type="button" id="viewFile" class="btn btn-primary btn-xs">View File</button>'+
              '</td>'+
              '<td>'+
                '<button type="button" style="margin-left:20px;" id="downloadFile" class="btn btn-primary btn-xs">Download File</button>'+
              '</td>'+  
              '<td>'+
                '<button type="button" style="margin-left:20px;" id="deleteFile" class="btn btn-primary btn-xs ">Delete File</button>'+
              '</td>'+
            '</tr>');
     }
      
      
      function setIds(filesObj,index){

        $.each(filesObj, function(k, v) {
          index.index++;
          //var extension = k.split(".");
          if (isFile(k,filesObj)){
            v.id='file'+index.index;
          }else{
            if (k!='state' && k!='id' && k!='path****'){
              v.id="folder"+index.index;
              setIds(v,index);
              
            }
          }
        });

      }
      /**
      * Desc: Used as a callback function to 
      * render the list of files.
      * get the list of files and folders
      * as a jason object from the back end.
      * 'openfilesys' is a data stracture to save
      * the state of folders.
      */

      function setStudyTable(data){
        
        $('#uploadedModal').modal('hide');
        var dataObj = jQuery.parseJSON( data );
        fileObj = dataObj.filesys;
        model.openStruct= dataObj.openfilesys;
        var index ={};
        index.index=0;
        setIds(fileObj,index);
        model.fileSystem = fileObj;
        model.studyFileSystem=fileObj;
        fileTableModel.user = false;
        //$('.dropdownLI').append('<li role="presentation"><a class="tableVal" role="menuitem" tabindex="-1" href="#">Studies</a></li>');
        console.log('before createRaws'+model.study);
        createRaws(fileObj,false,fileTableModel.user);
        console.log('in setStudyTable'+model.study);
        

      }
      function createDandD(){
        var name;
        if (model.currentFolder != null && model.currentFolder != undefined){
          var currentFolder = model.currentFolder;
          name = currentFolder.name;
        }else{
          name='';
        }

        $('#result').append('<label style="position:relative;left:-10px;color:#92AAB0;" id="currentfolder">Current folder: <span id="currentName">'+name+'</span></label></br><div id="dragandrophandler">Drag & Drop Files Here</div>');
        var obj = $("#dragandrophandler");
        obj.on('dragenter', function (e) 
        {
            e.stopPropagation();
            e.preventDefault();
            $(this).css('border', '2px solid #0B85A1');
        });
        obj.on('dragover', function (e) 
        {
             e.stopPropagation();
             e.preventDefault();
        });
        obj.on('drop', function (e) 
        {
         
             $(this).css('border', '2px dotted #0B85A1');
             e.preventDefault();
             var filesI = e.originalEvent.dataTransfer.files;
             var files = e.originalEvent.dataTransfer.items;
             //var length = e.originalEvent.dataTransfer.items.length;
             //We need to send dropped files to Server
             $('#uploadedModal').modal('show');
             if (   (navigator.userAgent).indexOf('Mozilla')!=-1    ) {
              DrophandleFileUpload(filesI,obj);

             }else{
              DrophandleFileUpload(files,obj);
             }
             
        });
      }

   
      function errorHandler(data){
        console.log(data);
      }
    
      /**
      * Desc: returns the satet of the folder
      * input: folder key/value object
      *
      */
      function FolderState(folder){
        var id;
        var state;
        var path=folder['path****'];
        id = folder['id'];
        var obj = model.openStruct;
        return obj[path];
      }
      
      function createTable(){
        fileTableModel.row =0;
        fileTableModel.level =0;
        //if (model.activePage === 'file'){                    
          //$('#result').append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');          
        //}else{
          $('#result').append('<table id="fileTabale" class="table table-striped table-hover"><thead><th></th><th></th></thead><tbody id="body"></tbody></table>');
          $('#fileTabale > tbody').append(
            '<tr>'+
              '<td id="0" >'+
                '<span  style="margin-left:0px;">+<span class="folder" ></span></span>'+
              '</td>'+
              '<td>'+
                '<button type="button" id="uploadFile" class="btn btn-primary btn-xs">Upload File</button>'+
                '<button type="button" style="margin-left:20px;" id="newFolder" class="btn btn-primary btn-xs">Create New Folder</button>'+
                '<button type="button" style="margin-left:20px;" id="multiple" class="btn btn-primary btn-xs">Multiple Download</button>'+
                '<button type="button" style="margin-left:20px;" id="multipleDelete" class="btn btn-primary btn-xs">Multiple Delete</button>'+
              '</td>'+    
            '</tr>'
          );
        //}
        

      }
      function update(name,value){
        $('.dropdownLI').append('<li id="'+value.id+'" role="presentation"><a class="tableVal" role="menuitem" tabindex="0" href="#">'+name+'</a></li>');
        $('#studyTable > tbody').append(makerow(name,value));

      }
      function makerow(val,obj){

        id++;
        var html='';
        var status = obj.status;
        if (status===null || status=='N'){
          status='NA';
        }
        html+='<tr id="'+obj.id+'" class="tableRaw" style="cursor:pointer">'+
                '<td class="studyRaw"><span href="#" data-toggle="modal" data-target="#myModal" class="studyspan">'+val+'</span>'+
                '</td>'+
                '<td class=""><button type="button" id="deleteStudy" class="btn btn-primary btn-xs">Delete Study</button>'+
                '</td>'+
                '<td class="">'+
                    '<button type="button" id="renamestudytable" class="btn btn-primary btn-xs">Rename Study</button>'+
                '</td>'+
                '<!--<td class="">'+
                    '<button type="button" class="btn btn-primary btn-xs test" >Test</button>'+
                '</td>'+
               '<td class="">'+
                    '<button type="button" class="btn btn-primary btn-xs" id="1deploy">Deploy</button>'+
                '</td>-->'+
          '</tr>';
        return html;
      }
      
      function findStudy(study){
        var obj = model.studyNames;
        var res;
        $.each(obj, function(key, value) {
          $.each(value, function(key2, value2) {
              if (key2.indexOf('name')!=-1){
                if (value2===study){
                  res=value;
                  return false;

                }
                   
              }
               
          });    
        });
        return res;
      }
      function getExptid(name){
        
         var study = findStudy(name);
         var res=[];
         api.getEXPT(study.name,function(data){
          res=data;
         })
        // $.each(study, function(key, value) {
        //     if (key.indexOf('exptID')!=-1){
        //       res.push(value);
              
        //     }
               
        // });
        return res;    
      }

      function doNothing(){

      }
     
      function takeOutBraclet(name){
        var studyName;
        if (name.indexOf("(")!=-1){
           var studies = name.split("(");
           studyName = studies[0];
           return studyName;  
         }else{
          return name;

         }
      }
      function appendTracker(studyExpt){
        var track;
        if (model.activeTracker===undefined){
          track = new Tracker(model,'design1');
          model.tracker={};
          model.tracker.db = 'Research';
          model.tracker.list = 'Any';
          model.activeTracker =track;
          model.active = track;
        }else{
          //track = model.activeTracker;
        }
        
        //Tracker(model,'design1');
        
        //Tracker.getTracker(studyExpt);
        model.activeTracker.getTracker(studyExpt);
        ////track.getTable(studyExpt,true);
        
      }

     
  });
        
});
