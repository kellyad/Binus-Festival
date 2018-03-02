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
            url : BM.serviceUri + "BifestController/GeneralHandler/getAcademicInstitutionNoFilter",
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
    loadAutoComplete: function()
    {   sx= this;
        BM.ajax({
            url: BM.serviceUri + "loginAs/Student/getAutoCompleteNameBinusian",
            type: "POST",
            beforeSend: function() { $('#wait').show();},
            complete: function() { $('#wait').hide(); },
            success: function(data) {
                 autoData = [];
                for(var i = 0; i < data.length; i++) autoData.push(data[i].BINUSIANID.trim()+ ' - ' + data[i].BINUSIANNAME.trim());
                $("#txtParticipant").BMautocomplete({
                    dataset: autoData
                });
            }
        });
    },
    loadDegree : function() {
        $("#ddlDegree").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderDegree').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/GeneralHandler/getAcademicCareer",
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
            url : BM.serviceUri + "BifestController/GeneralHandler/getCampus",
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
                    sx.loadProgram();
                });
                sx.loadProgram();
            }
        });
    },
    loadPeriod : function() {
        $("#ddlPeriod").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriod').show();
        BM.ajax({
            url : BM.serviceUri + "BifestController/SystemHandler/getAllSystemPeriod",
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
            url : BM.serviceUri + "BifestController/GeneralHandler/getJurusan",
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
                        option = "<option value='"+data[i].Jurusan+"'>"+data[i].DESCR+"</option>";
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
            url : BM.serviceUri + "BifestController/GeneralHandler/getAllBinusian",
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
            url : BM.serviceUri + "BifestController/GeneralHandler/getFaculty",
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
           $('.iCapacity ',c).html(tempDetail[i].Total +'/'+((tempDetail[i].Capacity=='-1')?'Infinite(-)':tempDetail[i].Capacity));
                     }
                        }
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
        if($.inArray($('#txtParticipant').val(), autoData) < 0 && $('#txtParticipant').val()!="")
        {  BM.message({
                    targetid : '#popup-message',
                    title : 'Error!',
                    message : 'Participant does not exist',
                    width : '400px',
                    button : ['OK']
                },
                function(result){
                    if(result == "OK")
                    {

                    }
                });
        }else if($.inArray($('#txtParticipant').val(), autoData) > 0){
             $('#tableTappingAreaPopUp').remove();
        var copy = $('#tableTappingAreaPopUp_Copy').clone().removeAttr('id').css('display', '').attr('id','tableTappingAreaPopUp');
       $('#tableTappingAreaPopUp_wrapper').remove();
       $('#tableTappingAreaPopUp_Copy').after(copy);
            BM.ajax({
            url : BM.serviceUri + "BifestController/ParticipantScheduleHandler/getParticipantData",
            type: "POST",
            data: JSON.stringify({    BinusianID:$('#txtParticipant').val().split(' - ')[0],
                Institution:"",
                    Acad_Career:"",
                    Campus:"",
                    Period:"",
                    ACAD_ORG:"",
                    ACAD_PROG:"",
                    ACAD_YEAR:""  
                                }),
                    beforeSend: function() {
                     $('.dataPopUp').remove();
                    $('#tableTappingAreaPopUp tbody').append('<tr class="dataPopUpLoading"><td colspan="24" style="text-align:center;"><div id="iLoading"/></td></tr>');
                 $("#iLoading").html($('<span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span>'));
                  
                    },
            success: function(result){
                $('#tableTappingAreaPopUp tbody').empty(); 
                $('#divContent').show();
                  if(result.length>0){
                    $.each(result, function(a, e) {
                           var c = $('#iTappingAreaPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                     $('.iStudentID ',c).html(e.BinusianID + ' - ' + e.NAME);
                     $('.iStudentID ',c).attr("StudentBinusFestivalID", e.StudentBinusFestivalID);
                     $('.iStudentID ',c).attr("BinusFestivalAttendanceID", e.BinusFestivalAttendanceID);
                     $('.iStudentID ',c).attr("SystemID", e.SystemID);
                     $('.iStudentID ',c).attr("ParticipantGroupID", e.ParticipantGroupID);
                     $('.iStudentID ',c).attr("IsContributor", e.IsContributor);
                     $('.iSession ',c).html(e.Session);
                     $('.iAction', c).append('<a class="icon icon-checklist"  style="cursor:pointer;"></a><a class="icon icon-trash"  style="cursor:pointer;"></a>');
                    $('.iAction .icon-checklist',c).click(function(d){
                        d.preventDefault();
                        BM.ajax({
                            url: BM.serviceUri + 'BifestController/ParticipantScheduleHandler/updateParticipantData',
                            type: "POST",
                            data: JSON.stringify({
                                    StudentBinusFestivalID:e.StudentBinusFestivalID,
                                    SystemID:e.SystemID,
                                    ParticipantGroupID:e.ParticipantGroupID,
                                    Session:e.Session,
                                    IsContributor:(e.IsContributor==null)?'':e.IsContributor,
                                    Topic:$(".iTopic #ddlTopic",c).val(),
                                    Date:$(".iDate #ddlDate",c).val(),
                                    Room:$(".iRoom #ddlRoom",c).val(),
                                    Time:$(".iTime #ddlTime",c).val()
                                }),
                            success: function(data) {
                                if(data[0].Status=="Success"){

                                for(i=0 ; i < tempDetail.length ; i++){
                                    if(tempDetail[i].BinusFestivalAttendanceID == $('.iStudentID ',c).attr("BinusFestivalAttendanceID")){
                                        tempDetail[i].Total = tempDetail[i].Total-1;
                                    }
                                    if(tempDetail[i].BinusFestivalAttendanceID == data[0].BinusFestivalAttendanceID){
                                        tempDetail[i].Total = tempDetail[i].Total+1;
                                        $('.iStudentID ',c).attr("BinusFestivalAttendanceID",tempDetail[i].BinusFestivalAttendanceID);
                                        $('.iCapacity ',c).html(tempDetail[i].Total +'/'+((tempDetail[i].Capacity=='-1')?'Infinite(~)':tempDetail[i].Capacity));
                              
                                    }
                                      }
                                    alert("data has Been Changed Successfully");
                                }

                            }
                        });
                    });
                    $('.iAction .icon-trash',c).click(function(d){
                        d.preventDefault();
                        BM.ajax({
                            url: BM.serviceUri + 'BifestController/ParticipantScheduleHandler/deleteParticipantData',
                            type: 'POST',
                            data: JSON.stringify({
                                    StudentBinusFestivalID:e.StudentBinusFestivalID
                                }),
                            success: function(data) {
                                if(data[0].Status=="Success"){
                                    $(c).remove();
                                    alert("data has Been Deleted Successfully");
                                }
                            }
                        });
                    });

                     $('.iCapacity ',c).html(e.Total +'/'+((e.Capacity=='-1')?'Infinite(-)':e.Capacity));
                        for(i=0 ; i < tempTopicDetail.length ; i++){
                        if(tempTopicDetail[i].SystemID == e.SystemID && tempTopicDetail[i].Session == e.Session &&  tempTopicDetail[i].ParticipantGroupID == e.ParticipantGroupID &&  tempTopicDetail[i].IsContributor == e.IsContributor ){
                            option = "<option value='"+tempTopicDetail[i].Topic+"'>"+tempTopicDetail[i].Topic+"</option>";
                            $(".iTopic #ddlTopic",c).append(option);
                            }
                        }
                            $(".iTopic #ddlTopic",c).val(e.Topic);
                            $(".iTopic #ddlTopic",c).closest(".custom-combobox").find(".combobox-label").remove();
                            $(".iTopic #ddlTopic",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
                        for(i=0 ; i < tempDateDetail.length ; i++){
                        if(tempDateDetail[i].SystemID == e.SystemID && tempDateDetail[i].Session == e.Session &&  tempDateDetail[i].ParticipantGroupID == e.ParticipantGroupID &&  tempDateDetail[i].IsContributor == e.IsContributor &&  $(".iTopic #ddlTopic",c).val() ==tempDateDetail[i].Topic ){
                            option = "<option value='"+tempDateDetail[i].StartDate+"'>"+tempDateDetail[i].DateStart+"</option>";
                            $(".iDate #ddlDate",c).append(option);
                            }
                        }
                            $(".iDate #ddlDate",c).val(e.StartDate);   
                            $(".iDate #ddlDate",c).closest(".custom-combobox").find(".combobox-label").remove();
                            $(".iDate #ddlDate",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
                      
                        for(i=0 ; i < tempRoomDetail.length ; i++){
                        if(tempRoomDetail[i].SystemID == e.SystemID && tempRoomDetail[i].Session == e.Session &&  tempRoomDetail[i].ParticipantGroupID == e.ParticipantGroupID &&  tempRoomDetail[i].IsContributor == e.IsContributor &&  $(".iTopic #ddlTopic",c).val() ==tempRoomDetail[i].Topic &&   $(".iDate #ddlDate",c).val() ==tempRoomDetail[i].StartDate ){
                            option = "<option value='"+tempRoomDetail[i].Room+"'>"+tempRoomDetail[i].Room+"</option>";
                            $(".iRoom #ddlRoom",c).append(option);
                            }
                        }   
                            $(".iRoom #ddlRoom",c).val(e.Room);  
                            $(".iRoom #ddlRoom",c).closest(".custom-combobox").find(".combobox-label").remove();
                            $(".iRoom #ddlRoom",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
                      
                        for(i=0 ; i < tempTimeDetail.length ; i++){
                        if(tempTimeDetail[i].SystemID == e.SystemID && tempTimeDetail[i].Session == e.Session &&  tempTimeDetail[i].ParticipantGroupID == e.ParticipantGroupID &&  tempTimeDetail[i].IsContributor == e.IsContributor &&  $(".iTopic #ddlTopic",c).val() ==tempTimeDetail[i].Topic &&  $(".iDate #ddlDate",c).val() ==tempTimeDetail[i].StartDate && $(".iRoom #ddlRoom",c).val() ==tempTimeDetail[i].Room){
                            option = "<option value='"+tempTimeDetail[i].TimeStart +' - '+tempTimeDetail[i].TimeEnd+"'>"+tempTimeDetail[i].TimeStart +' - '+tempTimeDetail[i].TimeEnd+"</option>";
                            $(".iTime #ddlTime",c).append(option);
                            }
                        }   
                            $(".iTime #ddlTime",c).val(e.TimeStart +' - '+e.TimeEnd);  
                             $(".iTime #ddlTime",c).closest(".custom-combobox").find(".combobox-label").remove();
                             $(".iTime #ddlTime",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
                         $('.iTopic #ddlTopic',c).change(function(){
                              sx.loadDate(c);
                            });
                         $('.iDate #ddlDate',c).change(function(){
                              sx.loadRoom(c);
                            });
                         $('.iRoom #ddlRoom',c).change(function(){
                              sx.loadTime(c);
                            });
                         $('.iTime #ddlTime',c).change(function(){
                              sx.loadCapacity(c);
                            });
                         $('#tableTappingAreaPopUp tbody').append(c);
                    });
                    }
                    $('.loader').hide();
                     sx.gradeDataTable = $('#tableTappingAreaPopUp').DataTable({
                                    destroy:        true,
                                    scrollY:        "300px",
                                    scrollX:        true,
                                    scrollCollapse: true,
                                    paging:         false,
                                   
                                    "fnInitComplete": function() {
                                    this.fnAdjustColumnSizing(true);
                                    }
                                 // paging      : false,
                                 // ordering    : true,
                                 // info        : false,
                                 // scrollX     : false,
                                 // bScrollCollapse: true,
                                 // bFilter : true,
                                 // o..rrder: []
                            });
                }
            });
           
        }else{
            $('#tableTappingAreaPopUp').remove();
        var copy = $('#tableTappingAreaPopUp_Copy').clone().removeAttr('id').css('display', '').attr('id','tableTappingAreaPopUp');
       $('#tableTappingAreaPopUp_wrapper').remove();
       $('#tableTappingAreaPopUp_Copy').after(copy);
            BM.ajax({
            url : BM.serviceUri + "BifestController/ParticipantScheduleHandler/getParticipantData",
            type: "POST",
            data: JSON.stringify({        
                BinusianID : "",
                Institution:$('#ddlAcademicInstitution').val(),
                    Acad_Career:$('#ddlDegree').val(),
                    Campus:$('#ddlCampus').val(),
                    Period:$('#ddlPeriod').val(),
                    ACAD_ORG:$('#ddlAcadOrganization').val(),
                    ACAD_PROG:$('#ddlAcadProgram').val(),
                    ACAD_YEAR:$('#ddlBinusian').val()            }),
                    beforeSend: function() {
                     $('.dataPopUp').remove();
                      $('#tableTappingAreaPopUp tbody').append('<tr class="dataPopUpLoading"><td colspan="24" style="text-align:center;"><div id="iLoading"/></td></tr>');
                 $("#iLoading").html($('<span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span>'));
                    },
            success: function(result){
                $('#tableTappingAreaPopUp tbody').empty(); 
                $('#divContent').show();
                  if(result.length>0){
                    $.each(result, function(a, e) {
                           var c = $('#iTappingAreaPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                     $('.iStudentID ',c).html(e.BinusianID + ' - ' + e.NAME);
                     $('.iStudentID ',c).attr("StudentBinusFestivalID", e.StudentBinusFestivalID);
                     $('.iStudentID ',c).attr("BinusFestivalAttendanceID", e.BinusFestivalAttendanceID);
                     $('.iStudentID ',c).attr("SystemID", e.SystemID);
                     $('.iStudentID ',c).attr("ParticipantGroupID", e.ParticipantGroupID);
                     $('.iStudentID ',c).attr("IsContributor", e.IsContributor);
                     $('.iSession ',c).html(e.Session);
                     $('.iAction', c).append('<a class="icon icon-checklist"  style="cursor:pointer;"></a><a class="icon icon-trash"  style="cursor:pointer;"></a>');
                    $('.iAction .icon-checklist',c).click(function(d){
                        d.preventDefault();
                        BM.ajax({
                            url: BM.serviceUri + 'BifestController/ParticipantScheduleHandler/updateParticipantData',
                            type: "POST",
                            data: JSON.stringify({
                                    StudentBinusFestivalID:e.StudentBinusFestivalID,
                                    SystemID:e.SystemID,
                                    ParticipantGroupID:e.ParticipantGroupID,
                                    Session:e.Session,
                                    IsContributor:(e.IsContributor==null)?'':e.IsContributor,
                                    Topic:$(".iTopic #ddlTopic",c).val(),
                                    Date:$(".iDate #ddlDate",c).val(),
                                    Room:$(".iRoom #ddlRoom",c).val(),
                                    Time:$(".iTime #ddlTime",c).val()
                                }),
                            success: function(data) {
                                if(data[0].Status=="Success"){

                                for(i=0 ; i < tempDetail.length ; i++){
                                    if(tempDetail[i].BinusFestivalAttendanceID == $('.iStudentID ',c).attr("BinusFestivalAttendanceID")){
                                        tempDetail[i].Total = tempDetail[i].Total-1;
                                    }
                                    if(tempDetail[i].BinusFestivalAttendanceID == data[0].BinusFestivalAttendanceID){
                                        tempDetail[i].Total = tempDetail[i].Total+1;
                                        $('.iStudentID ',c).attr("BinusFestivalAttendanceID",tempDetail[i].BinusFestivalAttendanceID);
                                        $('.iCapacity ',c).html(tempDetail[i].Total +'/'+((tempDetail[i].Capacity=='-1')?'Infinite(~)':tempDetail[i].Capacity));
                              
                                    }
                                      }
                                    alert("data has Been Changed Successfully");
                                }

                            }
                        });
                    });
                    $('.iAction .icon-trash',c).click(function(d){
                        d.preventDefault();
                        BM.ajax({
                            url: BM.serviceUri + 'BifestController/ParticipantScheduleHandler/deleteParticipantData',
                            type: 'POST',
                            data: JSON.stringify({
                                    StudentBinusFestivalID:e.StudentBinusFestivalID
                                }),
                            success: function(data) {
                                if(data[0].Status=="Success"){
                                    $(c).remove();
                                    alert("data has Been Deleted Successfully");
                                }
                            }
                        });
                    });

                     $('.iCapacity ',c).html(e.Total +'/'+((e.Capacity=='-1')?'Infinite(-)':e.Capacity));
                        for(i=0 ; i < tempTopicDetail.length ; i++){
                        if(tempTopicDetail[i].SystemID == e.SystemID && tempTopicDetail[i].Session == e.Session &&  tempTopicDetail[i].ParticipantGroupID == e.ParticipantGroupID &&  tempTopicDetail[i].IsContributor == e.IsContributor ){
                            option = "<option value='"+tempTopicDetail[i].Topic+"'>"+tempTopicDetail[i].Topic+"</option>";
                            $(".iTopic #ddlTopic",c).append(option);
                            }
                        }
                            $(".iTopic #ddlTopic",c).val(e.Topic);
                            $(".iTopic #ddlTopic",c).closest(".custom-combobox").find(".combobox-label").remove();
                            $(".iTopic #ddlTopic",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
                        for(i=0 ; i < tempDateDetail.length ; i++){
                        if(tempDateDetail[i].SystemID == e.SystemID && tempDateDetail[i].Session == e.Session &&  tempDateDetail[i].ParticipantGroupID == e.ParticipantGroupID &&  tempDateDetail[i].IsContributor == e.IsContributor &&  $(".iTopic #ddlTopic",c).val() ==tempDateDetail[i].Topic ){
                            option = "<option value='"+tempDateDetail[i].StartDate+"'>"+tempDateDetail[i].DateStart+"</option>";
                            $(".iDate #ddlDate",c).append(option);
                            }
                        }
                            $(".iDate #ddlDate",c).val(e.StartDate);   
                            $(".iDate #ddlDate",c).closest(".custom-combobox").find(".combobox-label").remove();
                            $(".iDate #ddlDate",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
                      
                        for(i=0 ; i < tempRoomDetail.length ; i++){
                        if(tempRoomDetail[i].SystemID == e.SystemID && tempRoomDetail[i].Session == e.Session &&  tempRoomDetail[i].ParticipantGroupID == e.ParticipantGroupID &&  tempRoomDetail[i].IsContributor == e.IsContributor &&  $(".iTopic #ddlTopic",c).val() ==tempRoomDetail[i].Topic &&   $(".iDate #ddlDate",c).val() ==tempRoomDetail[i].StartDate ){
                            option = "<option value='"+tempRoomDetail[i].Room+"'>"+tempRoomDetail[i].Room+"</option>";
                            $(".iRoom #ddlRoom",c).append(option);
                            }
                        }   
                            $(".iRoom #ddlRoom",c).val(e.Room);  
                            $(".iRoom #ddlRoom",c).closest(".custom-combobox").find(".combobox-label").remove();
                            $(".iRoom #ddlRoom",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
                      
                        for(i=0 ; i < tempTimeDetail.length ; i++){
                        if(tempTimeDetail[i].SystemID == e.SystemID && tempTimeDetail[i].Session == e.Session &&  tempTimeDetail[i].ParticipantGroupID == e.ParticipantGroupID &&  tempTimeDetail[i].IsContributor == e.IsContributor &&  $(".iTopic #ddlTopic",c).val() ==tempTimeDetail[i].Topic &&  $(".iDate #ddlDate",c).val() ==tempTimeDetail[i].StartDate && $(".iRoom #ddlRoom",c).val() ==tempTimeDetail[i].Room){
                            option = "<option value='"+tempTimeDetail[i].TimeStart +' - '+tempTimeDetail[i].TimeEnd+"'>"+tempTimeDetail[i].TimeStart +' - '+tempTimeDetail[i].TimeEnd+"</option>";
                            $(".iTime #ddlTime",c).append(option);
                            }
                        }   
                            $(".iTime #ddlTime",c).val(e.TimeStart +' - '+e.TimeEnd);  
                             $(".iTime #ddlTime",c).closest(".custom-combobox").find(".combobox-label").remove();
                             $(".iTime #ddlTime",c).closest(".custom-combobox").data("has-init","no").binus_combobox();
                         $('.iTopic #ddlTopic',c).change(function(){
                              sx.loadDate(c);
                            });
                         $('.iDate #ddlDate',c).change(function(){
                              sx.loadRoom(c);
                            });
                         $('.iRoom #ddlRoom',c).change(function(){
                              sx.loadTime(c);
                            });
                         $('.iTime #ddlTime',c).change(function(){
                              sx.loadCapacity(c);
                            });
                         $('#tableTappingAreaPopUp tbody').append(c);
                    });
                    }
                    $('.loader').hide();
               
               sx.gradeDataTable = $('#tableTappingAreaPopUp').DataTable({
                                    destroy:        true,
                                    scrollY:        "300px",
                                    scrollX:        true,
                                    scrollCollapse: true,
                                    paging:         false,
                                   
                                    "fnInitComplete": function() {
                                    this.fnAdjustColumnSizing(true);
                                    }
                                         // paging      : false,
                                         // ordering    : true,
                                         // info        : false,
                                         // scrollX     : false,
                                         // bScrollCollapse: true,
                                         // bFilter : true,
                                         // o..rrder: []
                                    }); }


            });
        }

          
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
            url: BM.serviceUri + 'BifestController/ParticipantScheduleHandler/getGeneralData',
            type: 'GET',
            success: function(data) {
              tempDetail = data;
            }
        });
        BM.ajax({
            url: BM.serviceUri + 'BifestController/ParticipantScheduleHandler/getTopicData',
            type: 'GET',
            success: function(data) {
              tempTopicDetail = data;
            }
        });
        BM.ajax({
            url: BM.serviceUri + 'BifestController/ParticipantScheduleHandler/getDateData',
            type: 'GET',
            success: function(data) {
              tempDateDetail = data;
            }
        });
        BM.ajax({
            url: BM.serviceUri + 'BifestController/ParticipantScheduleHandler/getRoomData',
            type: 'GET',
            success: function(data) {
              tempRoomDetail = data;
            }
        });
        BM.ajax({
            url: BM.serviceUri + 'BifestController/ParticipantScheduleHandler/getTimeData',
            type: 'GET',
            success: function(data) {
              tempTimeDetail = data;
            }
        });
    },
    init: function() {
        var sx = this;
        $(".datepicker" ).datepicker( {dateFormat: "yy-mm-dd"});
        sx.loadAutoComplete();
        $(window).keydown(function(event){
            if(event.keyCode == 13) {
              event.preventDefault();
              return false;
            }
          });
        sx.loadInstitution();
        sx.loadPeriod();
        sx.loadData();
        sx.loadReportType();
        //sx.loadAllRoom();
       // sx.loadNewInstructor();
        $('#btnSearch').click(function () {
            sx.loadInit();
        });
        $('#btnAssign').click(function () {
           window.location.href=BM.baseUri + "newstaff/#/event/binusfestival/ParticipantSchedule#AssignParticipantForm";
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