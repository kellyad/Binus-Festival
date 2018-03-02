var sx, prms = ''; var $i=0;
var tempDetail = [],tempTopicDetail = [],tempDateDetail = [],tempRoomDetail = [],tempTimeDetail = [],gradeDataTable='';

var tempData = {};
(function($){
    $.fn.openOneCloseAll = function(){
        this.addClass('open');
        this.parent().parent().parent().nextAll().children().next().children().children().next().removeClass('open');
        this.parent().parent().parent().prevAll().children().next().children().children().next().removeClass('open');
        
        return this;
    };
 }(jQuery));
var subView = {
    title: 'Binus Festival Attendance Tapping Area - Binusmaya',
    require: 'event/binusfestival',
    rel: 'FestivalContent',
    gradeDataTable:'',
    onLoaded: function(arg)
    {
        $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        sx = this;
        prms = BM.popupparam;
        sx.init();
      
      
    },
    loadInstitution : function() {
        $("#ddlAcademicInstitution").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderInstitution').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAcademicInstitutionJSON",
            type: "POST",
            success: function(data){
                $('#loaderInstitution').hide();
                $('#ddlAcademicInstitution').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].AcademicInstitution+"'>"+data[i].Description+"</option>";
                        $("#ddlAcademicInstitution").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlAcademicInstitution").append(option);
                }
                $("#ddlAcademicInstitution").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlAcademicInstitution").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlAcademicInstitution').change(function(){
                    sx.loadDegree();
                });
                sx.loadDegree();
            }
        });
    },
    loadDegree : function() {
        $("#ddlDegree").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderDegree').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAcademicCareer",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val()
                }),
            success: function(data){
                $('#loaderDegree').hide();
                $('#ddlDegree').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].Acad_Career+"'>"+data[i].Descr+"</option>";
                        $("#ddlDegree").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlDegree").append(option);
                }
                $("#ddlDegree").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlDegree").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlDegree').change(function(){
                   sx.loadCampus();
                   //sx.loadPeriod();
                });
                sx.loadCampus();
                //sx.loadPeriod();
            }
        });
    },
    loadCampus : function() {
        $("#ddlCampus").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCampus').show();
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getCampus",
            type: "POST",
            data: JSON.stringify({
                }),
            success: function(data){
               $('#loaderCampus').hide();
                $('#ddlCampus').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].CAMPUS+"'>"+data[i].DESCR+"</option>";
                        $("#ddlCampus").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlCampus").append(option);
                }
                $("#ddlCampus").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlCampus").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlCampus').change(function(){
                    sx.loadLocation();
                });
                sx.loadLocation();
            }
        });
    },
    loadPeriod : function() {
        $("#ddlPeriod").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriod').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllSystemPeriod",
            type: "POST",
            data: JSON.stringify({
                }),
            success: function(data){
                $('#loaderPeriod').hide();
                $('#ddlPeriod').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].STRM+"'>"+data[i].DESCR+"</option>";
                        $("#ddlPeriod").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlPeriod").append(option);
                }
                $("#ddlPeriod").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlPeriod").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlPeriod').change(function(){
                 //  sx.loadSystemName();
                });
              // sx.loadSystemName();
            }
        });
    },
    loadJurusan : function() {
        var sx = this;
         $("#ddlAcadProgram").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderAcadProgram').show();
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getJurusan",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val(),
                    Campus:$("#ddlCampus").val(),
                    Faculty:$("#ddlAcadOrganization").val(),
                    Term:$("#ddlPeriod").val()
                }),
            success: function(data){
                $('#loaderAcadProgram').hide();
                $('#ddlAcadProgram').empty();
                    option = "<option value = ''>All</option>";
                    $("#ddlAcadProgram").append(option);
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].ACAD_PROG+"'>"+data[i].DESCR+"</option>";
                        $("#ddlAcadProgram").append(option);
                    }
                } else {
                }
                $("#ddlAcadProgram").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlAcadProgram").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlAcadProgram').change(function(){
                   sx.loadBinusian();
                });
               sx.loadBinusian();
            }
        });
    },
     loadBinusian : function() {
        $("#ddlBinusian").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderBinusian').show();
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getAllBinusian",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val(),
                    Campus:$("#ddlCampus").val(),
                    ACAD_ORG:$("#ddlAcadOrganization").val(),
                    ACAD_PROG:$("#ddlAcadProgram").val(),
                    Term:$("#ddlPeriod").val()
                }),
            success: function(data){
                 $('#loaderBinusian').hide();
                $('#ddlBinusian').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].ACAD_YEAR+"'>"+data[i].YEAR_DESCR+"</option>";
                        $("#ddlBinusian").append(option);
                    }
                } else {
                }
                $("#ddlBinusian").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlBinusian").closest(".custom-combobox").data("has-init","no").binus_combobox();
                //psx.loadCourseAttribute();
            }
        });
    },
    loadProgram : function() {
        var sx = this;
        $("#ddlAcadOrganization").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderAcadOrganization').show();
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getFaculty",
            type: "POST",
            data: JSON.stringify({
                    Institution:$('#ddlAcademicInstitution').val(),
                    AcademicCareer:$('#ddlDegree').val(),
                    Campus:$('#ddlCampus').val(),
                    Term:$('#ddlPeriod').val()
                }),
            success: function(data){
                $('#loaderAcadOrganization').hide();
                $('#ddlAcadOrganization').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].ACAD_ORG+"'>"+data[i].DESCR+"</option>";
                        $("#ddlAcadOrganization").append(option);
                    }
                } else {
                }
                $("#ddlAcadOrganization").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlAcadOrganization").closest(".custom-combobox").data("has-init","no").binus_combobox();
            $('#ddlAcadOrganization').change(function(){
                  sx.loadJurusan();
                });
             sx.loadJurusan();
            }

    }); 
    },
    loadValidation : function() {
        var sx = this;
        $("#ddlValidate").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderValidate').show();

                option = "<option value='"+''+"'>"+"All"+"</option>";
                $("#ddlValidate").append(option);
                option = "<option value='"+'0'+"'>"+"Unvalidate"+"</option>";
                $("#ddlValidate").append(option);
                option = "<option value='"+'1'+"'>"+"Validate"+"</option>";
                $("#ddlValidate").append(option);
                $('#loaderValidate').hide();
   
                $("#ddlValidate").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlValidate").closest(".custom-combobox").data("has-init","no").binus_combobox();
           
    },
    loadReportType : function() {
        $("#ddlReportType").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderReportType').show();
        option = "<option value='"+"Summary"+"'>"+"SUMMARY"+"</option>";
        $("#ddlReportType").append(option);
        option = "<option value='"+"Detail"+"'>"+"DETAIL"+"</option>";
        $("#ddlReportType").append(option);
        $("#ddlReportType").closest(".custom-combobox").find(".combobox-label").remove();
        $("#ddlReportType").closest(".custom-combobox").data("has-init","no").binus_combobox();
        $('#loaderReportType').hide();
    },
    loadDate : function(c) {
        var sx = this; 
        console.log("Masuk");
        $(".iDate #ddlDate",c).empty();
        $(".iDate #loaderDate",c).show();
       for(i=0 ; i < tempDateDetail.length ; i++){
        if(tempDateDetail[i].SystemID ==  $('.iStudentID ',c).attr("SystemID") && tempDateDetail[i].Session == $('.iSession ',c).html() &&  tempDateDetail[i].ParticipantGroupID == $('.iStudentID ',c).attr("ParticipantGroupID") &&  tempDateDetail[i].IsContributor == $('.iStudentID ',c).attr("IsContributor") &&  $(".iTopic #ddlTopic",c).val() ==tempDateDetail[i].Topic ){
            option = "<option value='"+tempDateDetail[i].StartDate+"'>"+tempDateDetail[i].DateStart+"</option>";
            $(".iDate #ddlDate",c).append(option);
            }
        }   
            $(".iDate #ddlDate",c).closest(".custom-combobox").find(".combobox-label").remove();
            $(".iDate #ddlDate",c).closest(".custom-combobox").data("has-init","no").binus_combobox();           
        $(".iDate #loaderDate",c).hide();
        sx.loadRoom(c);
    },
    loadRoom : function(c) {
        var sx = this; 
        console.log("Masuk");
        $(".iRoom #ddlRoom",c).empty();
        $(".iRoom #loaderRoom",c).show();
     for(i=0 ; i < tempRoomDetail.length ; i++){
                    if(tempRoomDetail[i].SystemID == $('.iStudentID ',c).attr("SystemID") && tempRoomDetail[i].Session == $('.iSession ',c).html() &&  tempRoomDetail[i].ParticipantGroupID == $('.iStudentID ',c).attr("ParticipantGroupID") &&  tempRoomDetail[i].IsContributor ==  $('.iStudentID ',c).attr("IsContributor") &&  $(".iTopic #ddlTopic",c).val() ==tempRoomDetail[i].Topic &&   $(".iDate #ddlDate",c).val() ==tempRoomDetail[i].StartDate ){
                        option = "<option value='"+tempRoomDetail[i].Room+"'>"+tempRoomDetail[i].Room+"</option>";
                        $(".iRoom #ddlRoom",c).append(option);
                        }
                    }   
                        $(".iRoom #ddlRoom",c).closest(".custom-combobox").find(".combobox-label").remove();
                        $(".iRoom #ddlRoom",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
       $(".iRoom #loaderRoom",c).hide(); 
        sx.loadTime(c);
    },
    loadTime : function(c) {
        var sx = this; 
        console.log("Masuk");
        $(".iTime #ddlTime",c).empty();
        $(".iTime #loaderTime",c).show();
    for(i=0 ; i < tempTimeDetail.length ; i++){
                    if(tempTimeDetail[i].SystemID == $('.iStudentID ',c).attr("SystemID") && tempTimeDetail[i].Session == $('.iSession ',c).html() &&  tempTimeDetail[i].ParticipantGroupID == $('.iStudentID ',c).attr("ParticipantGroupID") &&  tempTimeDetail[i].IsContributor == $('.iStudentID ',c).attr("IsContributor") &&  $(".iTopic #ddlTopic",c).val() ==tempTimeDetail[i].Topic &&  $(".iDate #ddlDate",c).val() ==tempTimeDetail[i].StartDate && $(".iRoom #ddlRoom",c).val() ==tempTimeDetail[i].Room){
                        option = "<option value='"+tempTimeDetail[i].TimeStart +' - '+tempTimeDetail[i].TimeEnd+"'>"+tempTimeDetail[i].TimeStart +' - '+tempTimeDetail[i].TimeEnd+"</option>";
                        $(".iTime #ddlTime",c).append(option);
                        }
                    }    $(".iTime #ddlTime",c).closest(".custom-combobox").find(".combobox-label").remove();
                         $(".iTime #ddlTime",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
     $(".iTime #loaderTime",c).hide();
        sx.loadCapacity(c);
    },
   loadCapacity : function(c) {
        var sx = this;
    for(i=0 ; i < tempDetail.length ; i++){
        if(tempDetail[i].SystemID == $('.iStudentID ',c).attr("SystemID") && tempDetail[i].Session == $('.iSession ',c).html() &&  tempDetail[i].ParticipantGroupID == $('.iStudentID ',c).attr("ParticipantGroupID") &&  tempDetail[i].IsContributor == $('.iStudentID ',c).attr("IsContributor") &&  $(".iTopic #ddlTopic",c).val() ==tempDetail[i].Topic &&  $(".iDate #ddlDate",c).val() ==tempDetail[i].StartDate && $(".iRoom #ddlRoom",c).val() ==tempDetail[i].Room && $(".iTime #ddlTime",c).val() ==(tempDetail[i].TimeStart +' - '+tempDetail[i].TimeEnd)){
           $('.iCapacity ',c).html(tempDetail[i].Total +'/'+((tempDetail[i].Capacity=='-1')?'Infinite(~)':tempDetail[i].Capacity));
                     }
                        }
    },
    loadLocation : function() {
        $("#ddlLocation").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderLocation').show();
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getLocation",
            type: "POST",
            data: JSON.stringify({ Campus: $('#ddlCampus option:selected').val(),Institution: $('#ddlAcademicInstitution option:selected').val() }),
            success: function(data){
                $('#loaderLocation').hide();
                $('#ddlLocation').empty();
                if(data.length) {
                        option = "<option value='"+""+"'>"+"ALL"+"</option>";
                        $("#ddlLocation").append(option);
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].LOCATION+"'>"+data[i].LOCATION+"</option>";
                        $("#ddlLocation").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlLocation").append(option);
                }
                $("#ddlLocation").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlLocation").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlLocation').change(function(){
        // console.log("kis");
        //            sx.loadInit();
                });
             //  sx.loadInit();
            }
        });
    },                    
    loadInit: function() {
        var sx = this; 
        $('.filter').show();
        // $('#divContent').show();
        // $('#LabelInstitution').html($('#ddlAcademicInstitution').closest('.custom-combobox').find('.combobox-label').html());
        // $('#LabelAcadCareer').html($('#ddlDegree').closest('.custom-combobox').find('.combobox-label').html());
        // $('#LabelSTRM').html($('#ddlPeriod').closest('.custom-combobox').find('.combobox-label').html());
        // $('#LabelCampus').html($('#ddlCampus').closest('.custom-combobox').find('.combobox-label').html());
        // $('#LabelLocation').html($('#ddlLocation').closest('.custom-combobox').find('.combobox-label').html());
        // $('#labelStartDate').html(($('#TxtStartDate').val()=="")?"ALL" :new Date($('#TxtStartDate').val()).toString("dd MMMM yyyy"));
        // $('#labelEndDate').html(($('#TxtEndDate').val()=="")?"ALL" :new Date($('#TxtEndDate').val()).toString("dd MMMM yyyy"));
         BM.ajax({
            url : BM.serviceUri + "BinusFestival/GetAttendanceData",
            type: "POST",
            data: JSON.stringify({   
            Institution: $('#ddlAcademicInstitution option:selected').val(),
            Acad_Career: $('#ddlDegree option:selected').val(),            
            Campus: $('#ddlCampus option:selected').val(),            
            STRM: $('#ddlPeriod option:selected').val(),            
            Location: $('#ddlLocation option:selected').val(),            
            ValidateStatus: $('#ddlValidate option:selected').val(),            
            StartDate: $('#TxtStartDate ').val(),            
            EndDate: $('#TxtEndDate ').val()             }),
            beforeSend: function() {
             $('.dataPopUp').remove();
            },
            success: function(result){
           if (sx.gradeDataTable.length >0){$('#tableTappingAreaPopUp').DataTable().destroy();}
                $('#LabelInstitution').html($('#ddlAcademicInstitution').closest('.custom-combobox').find('.combobox-label').html());
                $('#LabelAcadCareer').html($('#ddlDegree').closest('.custom-combobox').find('.combobox-label').html());
                $('#LabelSTRM').html($('#ddlPeriod').closest('.custom-combobox').find('.combobox-label').html());
                $('#LabelCampus').html($('#ddlCampus').closest('.custom-combobox').find('.combobox-label').html());
                $('#LabelLocation').html($('#ddlLocation').closest('.custom-combobox').find('.combobox-label').html());
                $('#LabelStartDate').html(($('#TxtStartDate').val()=="")?"ALL" :new Date($('#TxtStartDate').val()).toString("dd MMMM yyyy"));
                $('#LabelEndDate').html(($('#TxtEndDate').val()=="")?"ALL" :new Date($('#TxtEndDate').val()).toString("dd MMMM yyyy"));
                if(result.length>0){
                     $.each(result, function(a, e) {
                var c = $('#iTappingAreaPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                 $('.iDate ',c).html(e.DateStart);
                 $('.iTime ',c).html(e.TimeStart+" - "+e.TimeEnd);
                 $('.iTopic ',c).html(e.Topic);
                 $('.iRoom ',c).html(e.Room);
                 $('.iCampus ',c).html(e.Campus);
                 $('.iLocation ',c).html(e.Location);
                 $('.iNote',c).html(e.Notes);
                 $('.iValidationData ',c).html((e.IsValidate==0)?' - ' :e.UserValidate +"<br/>"+e.Datevalidate);
                 $('.iValidation > .icon',c).addClass(e.IsValidate==1?'icon-submitAttendance':'icon-notSubmitAttendance');
                 //$('.iValidate > .icon',c).addClass(e.IsValidate==1?'icon-submitAttendance':'icon-notSubmitAttendance');
                 $('.iValidate .iValidateCbx',c).attr('ID',e.BinusFestivalAttendanceID).data('BinusFestivalAttendanceID',e.BinusFestivalAttendanceID);
                 if(e.IsValidate=='1')
                 $('.iValidate',c).html('');//.attr('Title',v.IsSubmitted==1?'Already Submitted':'Not Submitted');
                // $('.iValidation ',c).html((e.IsValidate=0)?' - ' :e.UserValidate +"<br/>"+e.Datevalidate);
                 $('#ddlActionPopup',c).append($("<option value='"+"1"+"'>"+"Submit Attendance"+"</option>"));
              if(e.IsValidate =='1')  
               $('#ddlActionPopup',c).append($("<option value='"+"2"+"'>"+"Unvalidate"+"</option>"));
                 var buttonSubmit = '<input type="button" value="Submit" ID="btnSubmit" data-id="'+e.BinusFestivalAttendanceID+'" class="button button-primary" style="min-height:40px" />';
                var warning =  '<span class="alert has-error" id="spanErrorMessagePopup" style="text-align:center;margin-bottom:0px;display:none;white-space: nowrap; height:40px; line-height:2; width:250px;"></span>';
                 $('.iAction',c).html('<div style="text-align:center">'+warning+'</div>');
                    $('#spanErrorMessagePopup',c).show().html('Please Choose the Action!');
                 $("#ddlActionPopup",c).closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlActionPopup",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
                      
                 $('#ddlActionPopup',c).change(function(){
                    //  $('.iAction',c).html('<div style="text-align:center">'+buttonSubmit+'</div>');
                  if($('#ddlActionPopup',c).val()=="-1") { 
                    $('.iAction',c).html('<div style="text-align:center">'+warning+'</div>');
                    $('#spanErrorMessagePopup',c).show().html('Please Choose the Action!');
                    }
                    else if($('#ddlActionPopup',c).val()=='1'){
                        $('.iAction',c).html('<div style="text-align:center">'+buttonSubmit+'</div>');
                        $('#btnSubmit',c).click(function(){
                            //if($('#ddlActionPopup',c).val()=="1"){
                                window.open(BM.baseUri+"newstaff/#/event/binusfestival/submitAttendance."+e.BinusFestivalAttendanceID);
                            //}
                          //  else if($('#ddlActionPopup',c).val()=="2"){
                                
                         //   }
                         });
                     }
                     else if($('#ddlActionPopup',c).val()=='2'){
                        if(e.IsValidate=='1'){
                        $('.iAction',c).html('<div style="text-align:center">'+buttonSubmit+'</div>');
                         $('#btnSubmit',c).click(function(){
                            var request =
                                {
                                    "IsValidate": 0,
                                    'BinusFestivalAttendanceID': e.BinusFestivalAttendanceID
                                };
                                BM.deleteConfirmation('Are you sure want to unvalidate?',
                                function(){
                                    $('.action').find('.btnYes').remove();
                                    $('.action').find('.btnNo').remove();
                                    $('.action').append('<center id="validateAllLoader"><span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span></center>');
                                    BM.ajax({
                                        url: BM.serviceUri + 'BinusFestival/ValidateAttendance',
                                        type: "POST",
                                        data:JSON.stringify(request),
                                        success: function (data) {
                                            $('.action').find('#validateAllLoader').remove();
                                            if(data.Status==1)
                                            {
                                                $.fancybox.close();
                                                var message = "unValidate Success";
                                                BM.successMessage(message,'success', function() {
                                                    sx.loadInit();
                                                });
                                            }else if(data.status==-1)
                                            {
                                                alert('You are not authorized');
                                                window.location.href=BM.loginUri;
                                            }
                                        }
                                    });
                               },
                               function(){
                                    $.fancybox.close();
                                });
                         });
                    }
                        else {
                             $('.iAction',c).html('<div style="text-align:center">'+warning+'</div>');
                             $('#spanErrorMessagePopup',c).show().html('The Topic has not been Validated!');
                        }

                     }
                });
                 
              //   $('.iAction', c).append('<a class="icon icon-checklist"  style="cursor:pointer;"></a><a class="icon icon-trash"  style="cursor:pointer;"></a>');
                 $('#tableTappingAreaPopUp tbody').append(c);
                    });
                }
                 $('.loader').hide();
                 $('#divContent').show();
               
                }
            });
              // sx.gradeDataTable = $('#tableTappingAreaPopUp').DataTable({
              //                       destroy:        true,
              //                       scrollY:        "300px",
              //                       scrollX:        true,
              //                       scrollCollapse: true,
              //                       paging:         false,
              //                       bSort : false
              //                    // paging      : false,
              //                    // ordering    : true,
              //                    // info        : false,
              //                    // scrollX     : false,
              //                    // bScrollCollapse: true,
              //                    // bFilter : true,
              //                    // order: []
              //               });
    },
    loadNewInstructor: function()
    {
        var sx = this;
        BM.ajax({
            url: BM.serviceUri + 'loginAs/Lecturer/getAutoCompleteNameLecturer',
            type: 'GET',
            success: function(data) {
                listInstructor = [];

                for (var i = 0; i < data.length; i++) 
                    listInstructor.push(data[i].LECTURERID.trim() + " - " + data[i].LECTURERNAME.trim());

                $("#txtNewInstructor").BMautocomplete({
                    dataset: listInstructor
                });
            }
        });
    },
    loadData: function()
    {
        var sx = this;
        BM.ajax({
            url: BM.serviceUri + 'BinusFestival/getManualData',
            type: 'GET',
            success: function(data) {
              tempDetail = data;
            }
        });
        BM.ajax({
            url: BM.serviceUri + 'BinusFestival/getManualTopicData',
            type: 'GET',
            success: function(data) {
              tempTopicDetail = data;
            }
        });
        BM.ajax({
            url: BM.serviceUri + 'BinusFestival/getManualDateData',
            type: 'GET',
            success: function(data) {
              tempDateDetail = data;
            }
        });
        BM.ajax({
            url: BM.serviceUri + 'BinusFestival/getManualRoomData',
            type: 'GET',
            success: function(data) {
              tempRoomDetail = data;
            }
        });
        BM.ajax({
            url: BM.serviceUri + 'BinusFestival/getManualTimeData',
            type: 'GET',
            success: function(data) {
              tempTimeDetail = data;
            }
        });
    },
    init: function() {
        var sx = this;
        $(".datepicker" ).datepicker( {dateFormat: "yy-mm-dd"});
        sx.loadInstitution();
        sx.loadPeriod();
        sx.loadValidation();
        //sx.loadReportType();
        //sx.loadAllRoom();
       // sx.loadNewInstructor();
        $('#btnSearch').click(function () {
            sx.loadInit();
        });
         $('#btnValidate').click(function(e){
            $('#spanErrorMessagePopup').hide();
            if($('.iValidateCbx:checked').length==0)
            {
                $('#spanErrorMessagePopup').show().text('Topic must be selected.');
                return;
            }

           var ValidateClass = [];
            $('.iValidateCbx:checked').each(function(){
                ValidateClass.push({
                    "StudentBinusFestivalAttendanceID": ($(this).data('BinusFestivalAttendanceID')),
                    //"BinusianID" : (BinusianID==''?$(this).closest('tr').find('.iLecturer').data('BinusianID'):(BinusianID+','+$(this).closest('tr').find('.iLecturer').data('BinusianID'))),
                    //"LecturerID" : ($(this).closest('tr').find('.iLecturer').text()=='-'?'':($(this).closest('tr').find('.iLecturer').text().split('-')[0].trim())),
                    "IsValidate" : 1
                });
            });
            //console.log(ValidateClass);

            var request =
            {
                "ValidateClass": ValidateClass
            };
            BM.deleteConfirmation('Are you sure want to validate?',
                function(){
                    $('.action').find('.btnYes').remove();
                    $('.action').find('.btnNo').remove();
                    $('.action').append('<center id="validateAllLoader"><span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span></center>');
                    BM.ajax({
                        url: BM.serviceUri + 'BinusFestival/ValidateAllAttendance',
                        type: "POST",
                        data:JSON.stringify(request),
                        success: function (data) {
                            $('.action').find('#validateAllLoader').remove();
                            if(data.Status==1)
                            {
                                $.fancybox.close();
                                var message = "Validate Success";
                                BM.successMessage(message,'success', function() {
                                    sx.loadInit();
                                });
                            }else if(data.status==-1)
                            {
                                alert('You are not authorized');
                                window.location.href=BM.loginUri;
                            }
                        }
                    });
               },
               function(){
                    $.fancybox.close();
                }
            );
        });
    },
    
    initFilter: function(initParam) {
        var sx = this;
        $('#ddlPopupAcademicInstitution').val(initParam.Institution);
        $('#ddlPopupCampus').val(initParam.Campus);
        $('#ddlPopupDegreeByID').val(initParam.Career).change();
        $('#ddlPopupPeriod').val(initParam.Period).change();
        sx.refreshCombobox();
    },
    loadBindCmb: function(datas) {
        var sx = this;
        var requestFormData = {
            listField: ['TermbyCareer'],
            Acad_Career: $('#ddlPopupDegreeByID option:selected').val(),
            CAMPUS: $('#ddlPopupCampus option:selected').val(),
            ACAD_INSTITUTION: $('#ddlPopupAcademicInstitution option:selected').val(),
            ACAD_GROUP: $('#ddlPopupGroup option:selected').val()
        };
        BM.ajax({
            url: BM.serviceUri + "General_Head_Prefect/getFilterData",
            data: JSON.stringify(requestFormData),
            type: "POST",
            async: false,
            dataType: "json",
            success: function(data) {
                $('#ddlPopupPeriod').empty();
                var strm = data.TermbyCareer;
                $.each(strm, function(a, e) {
                    $('#ddlPopupPeriod').append("<option value='" + e.STRM + "'>" + e.DESCR + "</option>");
                });
                if (typeof datas != "undefined") {
                    $('#ddlPopupPeriod').val(data.STRM);
                }
                $('#ddlPopupPeriod').unbind().change(function() {
                    sx.loadBindCmbClass(datas);
                });
                $('#ddlPopupGroup').unbind().change(function() {
                    sx.loadBindCmbClass(datas);
                });
                $('#ddlPopupGroup').change();
                sx.refreshCombobox();
            }
        });
    },
    loadBindCmbClass: function(datas) {
        var sx = this;
        var requestFormData = {
            listField: ['ClassType'],
            Acad_Career: $('#ddlPopupDegreeByID option:selected').val(),
            CAMPUS: $('#ddlPopupCampus option:selected').val(),
            ACAD_INSTITUTION: $('#ddlPopupAcademicInstitution option:selected').val(),
            ACAD_GROUP: $('#ddlPopupGroup option:selected').val(),
            STRM: $('#ddlPopupPeriod option:selected').val()
        };
        BM.ajax({
            url: BM.serviceUri + "General_Head_Prefect/getFilterData",
            data: JSON.stringify(requestFormData),
            type: "POST",
            async: false,
            dataType: "json",
            success: function(data) {
                $('#ddlClassType').empty();
                var classType = data.ClassType;
                if (classType.length == 0) {
                    $('#ddlClassType').append("<option value=''>No data Available</option>");
                }
                $.each(classType, function(a, e) {
                    $('#ddlClassType').append("<option value='" + e.FIELDVALUE + "'>" + e.XLATLONGNAME + "</option>");
                });
                if (typeof datas != "undefined") {
                    console.log(datas);
                    $('#ddlClassType').val(datas.SSR_COMPONENT);
                }
                sx.refreshCombobox();
                $('#ddlClassType').unbind().change(function() {
                    sx.loadBindofBindCmb();

                });
                $('#ddlClassType').change();

            }
        });
    }
   
};