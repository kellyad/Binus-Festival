var sx, prms = '';
var tempDetail = [],gradeDataTable='';

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
    title: 'Konfigurasi Sistem - Binusmaya',
    require: 'event/binusfestival',
    rel: 'FestivalContent',
    gradeDataTable:'',
    onLoaded: function(arg)
    {   sx= this;
        $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        sx = this;
        prms = BM.popupparam;
        sx.init();
      
      
    },
    loadInstitution : function() {
        sx= this;
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
        sx =this;
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
                   sx.loadPeriod();
                });
                sx.loadCampus();
                sx.loadPeriod();
            }
        });
    },
    loadCampus : function() {
        sx= this;
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
                 
                //sx.loadFaculty();
            }
        });
    },
    loadPeriod : function() {
        sx= this;
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
              //     sx.loadSystemName();
                });
               //sx.loadSystemName();
            }
        });
    },
    
    loadReportType : function() {
        sx = this;
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
    loadInit: function() {
        sx = this; 
        $('#tableTopicPopUp').remove();
        var copy = $('#tableTopicPopUp_Copy').clone().removeAttr('id').css('display', '').attr('id','tableTopicPopUp');
       $('#tableTopicPopUp_wrapper').remove();
       $('#tableTopicPopUp_Copy').after(copy);
        //gradeDataTable = $('#tableOfficialNotesPopUp').dataTable();
       // if(gradeDataTable) gradeDataTable.destroy();
         $('#tableTopicPopUp tbody').append('<tr class="dataPopUpLoading"><td colspan="24" style="text-align:center;"><div id="iLoading"/></td></tr>');
                 $("#iLoading").html($('<span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span>'));
        
        BM.ajax({
            url : BM.serviceUri + "BinusFestival/getAllTopicAttribute",
            type: "POST",
            data: JSON.stringify({ Period:$('#ddlPeriod option:selected').val(), Campus: $('#ddlCampus option:selected').val() }),
            beforeSend: function(){
                        $('.dataPopUp').remove();
                        if (sx.gradeDataTable.length >0){$('#tableTopicPopUp').dataTable().fnDestroy();}
                        $('.dataPopUpLoading').remove();
                    $('#tableTopicPopUp tbody').append('<tr class="dataPopUpLoading"><td colspan="24" style="text-align:center;"><div id="iLoading"/></td></tr>');
                    $("#iLoading").html($('<span class="loader"><span class="indicator"></span><span class="progress-text">Loading...</span></span>'));
            $('#btnSearch').attr("disabled",true);
           },
            success: function(data){
                $('#btnSearch').attr("disabled",false);
           if (sx.gradeDataTable.length >0){$('#tableTopicPopUp').dataTable().fnDestroy();}
           $('#tableTopicPopUp tbody').empty(); 
               if(data.length>0) {$.each(data, function(a, e) {
                    var c = $('#iTopicPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                    if(e.Room=='ANG731')console.log(c);
                    $('.iOption', c).append('<a target="_blank" class="icon icon-edit"  style="cursor:pointer;"></a>');
                    $('.iOption .icon-edit', c).click(function(){
                    BM.filter={Period : $("#ddlPeriod").val(), Campus : $("#ddlCampus").val(), TopicID : e.BinusFestivalAttendanceID};
                        window.location = "#/event/binusfestival/TopicAttribute#editTopic";
                    });
                    $('.iSystem ',c).attr("data",e.SystemID);
                    $('.iSystem ', c).html(e.SystemName);
                    $('.iParticipantGroupName ', c).html(e.StudentParticipantGroupName);
                    $('.iTopic ', c).html(e.Topic);
                    $('.iEventType ', c).html(e.EventTypeName);
                    $('.iDate ', c).html(e.StartDate);
                    $('.iStartTime ', c).html(e.StartTime);
                    $('.iEndTime ', c).html(e.EndTime);
                    $('.iDuration ', c).html(e.ShiftDuration + " Minutes");
                    $('.iRoom ', c).html(e.Room);
                    $('.iCapacity ', c).html(e.CapacityFilled+'/'+e.Capacity);
                   //$('.iLecturerName ', c).html(e.N_OFFICIAL_NM);
                    //$('.iStatus ', c).html((e.Status=="data has been conflicted ")?e.Status+" in "+e.kampus:e.Status);
                    $('#tableTopicPopUp tbody').append(c);
                   
                     
                });}
                $('.dataPopUpLoading').remove();

                 sx.gradeDataTable = $('#tableTopicPopUp').DataTable({
                        destroy:    true,
                        scrollY:        "300px",
                        scrollX:        true,
                        scrollCollapse: true,
                        paging:         false
                    
                });

           // new $.fn.dataTable.FixedColumns( sx.gradeDataTable  );
            }
        });
            $('#damnClick').click();

    },
    loadNewInstructor: function()
    {
        sx = this;
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
    init: function() {
         sx = this;
        sx.loadPeriod();
        sx.loadCampus();
       // sx.loadNewInstructor();
        $('#btnSearch').click(function () {
           sx.loadInit();
      });
    },
    
    initFilter: function(initParam) {
         sx = this;
        $('#ddlPopupAcademicInstitution').val(initParam.Institution);
        $('#ddlPopupCampus').val(initParam.Campus);
        $('#ddlPopupDegreeByID').val(initParam.Career).change();
        $('#ddlPopupPeriod').val(initParam.Period).change();
        sx.refreshCombobox();
    }
    
};