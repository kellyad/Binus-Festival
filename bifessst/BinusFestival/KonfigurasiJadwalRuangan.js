var sx, prms = '',total=0,hasSubmitted = false;
var tempDetail = [],parameter;
(function($){
    $.fn.openOneCloseAll = function(){
        this.addClass('open');
        this.parent().parent().parent().nextAll().children().next().children().children().next().removeClass('open');
        this.parent().parent().parent().prevAll().children().next().children().children().next().removeClass('open');
        return this;
    };
 }(jQuery));
var subView = {
    title: 'Konfigurasi Jadwal Ruangan - Binusmaya',
    require: 'event/binusfestival',subject:"",
    rel: 'FestivalContent',
    onLoaded: function(arg)
    {
        // $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        parameter = arg;
        sx = this;
        prms = BM.popupparam;
        this.subject = BM.popUpResult;
        $('#actionTitle').append(sx.subject.group[sx.subject.current].SystemName.toUpperCase());
      //  $('#lblSession').html(this.subject);
        sx.init(arg);
        if (typeof BM.headPrefectConfiguration != "undefined") {
            sx.initFilter(BM.headPrefectConfiguration);
        }
        $('#btnAddTopicUp').click(function(event){
        BM.filter={SystemID : arg, ParticipantGroupID: sx.subject.group[sx.subject.current].ParticipantGroupID,SessionID:sx.subject.session+1};
                        window.location = "#/event/binusfestival/konfigurasiJadwalRuangan."+arg+"#AddNewTopic";
                    }); 
        $('#btnGroupConfig').click(function(event){
        BM.filter={SystemID : arg, ParticipantGroupID: sx.subject.group[sx.subject.current].ParticipantGroupID,ParticipantGroupName: sx.subject.group[sx.subject.current].ParticipantGroupName,SessionID:sx.subject.session+1};
                        window.location = "#/event/binusfestival/konfigurasiJadwalRuangan."+arg+"#GroupingConfiguration";
                    });
        $('#lblParticipantGroupName').html( sx.subject.group[sx.subject.current].ParticipantGroupName);
        $('#lblSession').html( sx.subject.session+1);
        $('#btnExportToExcel').click(function(event){
        sx.ExportToExcel();
        });
       $('#btnSubmit').click(function(event){
       // BM.filter={SystemID : arg, ParticipantGroupID: sx.subject.group[sx.subject.current].ParticipantGroupID,SessionID:sx.subject.current};
        if($('#btnSubmit').val()=="Save And Finish") {
            window.location = "#/event/binusfestival/konfigurasiSystem";
        }else{
         if(!hasSubmitted){
            sx.subject.session++;
         }else{ sx.subject.session =0; sx.subject.current++;}
                        window.location = "#/event/binusfestival/konfigurasiJadwalRuangan."+arg;
                        sx.loadTable();
                    }

        $('#lblParticipantGroupName').html( sx.subject.group[sx.subject.current].ParticipantGroupName);
        $('#lblSession').html( sx.subject.session+1);
                    });
    },
    loadTable: function() {
        var sx = this;
        hasSubmitted = false;
        if( sx.subject.session < sx.subject.group[sx.subject.current].TotalSession -1 )
        {
            $("#btnSubmit").val("Go To Next Session");
        } 
        else if( sx.subject.current+1 < sx.subject.group.length)
        { hasSubmitted = true;
            $("#btnSubmit").val("Save and Go To Next ParticipantGroup");
        }
        else
        {
            $("#btnSubmit").val("Save And Finish");
        }
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/GetTotalParticipantByParticipantGroupID",
            type: "POST",
            beforeSend: function() {
                $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
                $('#lblTotalParticipant').html("");
            },
            data: JSON.stringify({
                    ParticipantGroupID:sx.subject.group[sx.subject.current].ParticipantGroupID
                }),
            success: function(data){
                $('.iLoadingPopup').html($('<img alt="" />').attr('src',''));
                $('#lblTotalParticipant').html(data[0].Total);
            }
        });
         BM.ajax({
            url: BM.serviceUri + "General_Head_Prefect/getScheduleConfiguration",
            data: JSON.stringify({'ParticipantGroupID': sx.subject.group[sx.subject.current].ParticipantGroupID,'SessionID':sx.subject.session+1}),
            type: "POST",
            async: false,
            dataType: "json",
            beforeSend: function() {
                $('.dataSchedulePopUp').remove();
                $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
                $('#loadingpopup').show();
            },
            success: function(result) {
                total=0;
                $.each(result, function(a, e) {
                    var c = $('#iTemplateDataPopUp').clone().removeAttr('id').css('display', '').addClass('dataSchedulePopUp');
                    $('.iOption', c).append('<a class="icon icon-edit"  style="cursor:pointer;"></a><a class="icon icon-trash"  style="cursor:pointer;"></a>');
                    $('.iTotal ', c).append(e.Capacity); total+=e.Capacity;
                    $('.iTopic ', c).append(e.Topic);
                    $('.iType ', c).append(e.EventTypeID);
                    $('.iStartDate ', c).append(e.StartDate);
                    $('.iEndDate ', c).append(e.EndDate);
                    $('.iStartTime ', c).append(e.StartTime);
                    $('.iEndTime ', c).append(e.EndTime);
                    $('.iDuration ', c).append(e.ShiftDuration + " Minutes");
                    $('.iPostDuration ', c).append(e.PostDuration  + " Minutes");
                    $('.iCampus ', c).append(e.CAMPUS);
                    $('.iRoom ', c).append(e.FACILITY_ID);
                    $(c).click(function(event){
                    BM.filter={SystemID : parameter, ParticipantGroupID : e.ParticipantGroupID, ScheduleConfigurationID : e.ScheduleConfigurationID, SessionID : e.Session};
                    //sx.loadDataTable(initParam,e.ParticipantGroupID, e.ParticipantGroupName);
                    });
                    $('.iOption .icon-edit', c).click(function(event){
                    BM.filter={SystemID : parameter, ParticipantGroupID : e.ParticipantGroupID, ScheduleConfigurationID : e.ScheduleConfigurationID, SessionID : e.Session};
                        window.location = "#/event/binusfestival/konfigurasiJadwalRuangan."+parameter+"#AddNewTopic";
                    });
                    $('.iOption .icon-trash', c).click(function(event){
                        BM.ajax({
                                url: BM.serviceUri + "General_Head_Prefect/DeleteScheduleConfiguration",
                                data: JSON.stringify({'ScheduleConfigurationID': e.ScheduleConfigurationID}),
                                type: "POST",
                                async: false,
                                dataType: "json",
                                beforeSend: function() {
                                    $(c).remove();
                                    $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
                                    $('#loadingpopup').show();
                                },
                                success: function(result) {
                                    alert("data saved");
                                }
                            });
                        sx.loadTable();
                    });
                    $('#tableOfficialNotesPopUp tbody').append(c);  
                });
                $('#iTotalAssign').html("Capacity: "+total+ " Participants");

            }
        });
        
    },
    ExportToExcel : function() {
        var sx = this;
        var data = {};
                            data['Main'] = "Schedule";
                            data['ParticipantGroupID'] = sx.subject.group[sx.subject.current].ParticipantGroupID;
                            data['SessionID'] = sx.subject.session+1;
                           
                var form = document.createElement("form");
            form.action = BM.serviceUri+'BinusFestival/getExportData';
                form.method = 'POST';
                form.target = '_blank';
                if (data) {
                    for (var key in data) {
                        var input = document.createElement("textarea");
                        input.name = key;
                        input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
                        form.appendChild(input);
                    }
                }
                form.style.display = 'none';
                document.body.appendChild(form);
                form.submit();
        
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
                   sx.loadPeriod();
                });
                sx.loadCampus();
                sx.loadPeriod();
            }
        });
    },
    loadCampus : function() {
        $("#ddlCampus").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCampus').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getCampus",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val()
                }),
            success: function(data){
                   $('#ddlCampus').multiselect();
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlCampus').siblings().removeClass('open');
                     });
                   
                $('#loaderCampus').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].Descr, value:data[i].Campus});

                $('#ddlCampus').multiselect('dataprovider', d);
                $('#ddlCampus').change(function(){
                    sx.loadFaculty();
                });
                sx.loadFaculty();
            }
        });
    },
    loadPeriod : function() {
        $("#ddlPeriod").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriod').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getPeriod",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val(),
                    Campus:$("#ddlCampus").val()
                }),
            success: function(data){
                $('#loaderPeriod').hide();
                $('#ddlPeriod').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].Waktu+"'>"+data[i].DESCR+"</option>";
                        $("#ddlPeriod").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlPeriod").append(option);
                }
                $("#ddlPeriod").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlPeriod").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlPeriod').change(function(){
                   sx.loadFaculty();
                });
               sx.loadFaculty();
            }
        });
    },
    loadFaculty : function() {
        $("#ddlFaculty").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderFaculty').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getFaculty",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val(),
                    Campus:$("#ddlCampus").val(),
                    Term:$("#ddlPeriod").val()
                }),
            success: function(data){
                $('#loaderFaculty').hide();
                $('#ddlFaculty').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].ACAD_ORG+"'>"+data[i].DESCR+"</option>";
                        $("#ddlFaculty").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlFaculty").append(option);
                }
                $("#ddlFaculty").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlFaculty").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlFaculty').change(function(){
                  sx.loadCourseAttribute();
                  sx.loadJurusan();
                });
                sx.loadCourseAttribute();
                  sx.loadJurusan();
            }
        });
    },
    loadCourseAttribute : function() {
        $("#ddlCourseAttribute").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCourseAttribute').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllCourseType",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val(),
                    Faculty:$("#ddlFaculty").val(),
                    Term:$("#ddlPeriod").val()
                }),
            success: function(data){
                $('#loaderCourseAttribute').hide();
                $('#ddlCourseAttribute').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].CRSE_ATTR+"'>"+data[i].CRSE_DESCR+"</option>";
                        $("#ddlCourseAttribute").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlCourseAttribute").append(option);
                }
                $("#ddlCourseAttribute").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlCourseAttribute").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlCourseAttribute').change(function(){
                    sx.loadCourse();
                });
        
                sx.loadCourse();
            }
        });
    },
    loadJurusan : function() {
        $("#ddlJurusan").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderJurusan').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getJurusan",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val(),
                    Campus:$("#ddlCampus").val(),
                    Faculty:$("#ddlFaculty").val(),
                    Term:$("#ddlPeriod").val()
                }),
            success: function(data){
                $('#ddlJurusan').multiselect({includeSelectAllOption: true});
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlJurusan').siblings().removeClass('open');
                     });
                   
                $('#loaderJurusan').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].DESCR, value:data[i].JURUSAN});

                $('#ddlJurusan').multiselect('dataprovider', d);
                $('#ddlJurusan').change(function(){
                  //sx.loadCourseAttribute();
                });
                //sx.loadCourseAttribute();
            }
        });
    },
    loadBinusian : function() {
        $("#ddlBinusian").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderBinusian').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllBinusian",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val(),
                    Campus:$("#ddlCampus").val(),
                    Faculty:$("#ddlFaculty").val(),
                    Jurusan:$("#ddlJurusan").val(),
                    Term:$("#ddlPeriod").val()
                }),
            success: function(data){
                $('#ddlBinusian').multiselect({includeSelectAllOption: true});
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlBinusian').siblings().removeClass('open');
                     });
                   
                $('#loaderBinusian').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].DESCR, value:data[i].ACAD_YEAR});

                $('#ddlBinusian').multiselect('dataprovider', d);
                $('#ddlBinusian').change(function(){
                  //sx.loadCourseAttribute();
                });
                //sx.loadCourseAttribute();
            }
        });
    },
    loadCourse : function() {
        $("#ddlCourses").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCourses').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllCourseByAcad_Career_Faculty",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitution").val(),
                    AcademicCareer:$("#ddlDegree").val(),
                    Campus:$("#ddlCampus").val(),
                    Faculty:$("#ddlFaculty").val(),
                    Term:$("#ddlPeriod").val(),
                    CRSE_ATTR:$("#ddlCourseAttribute").val()
                }),
            success: function(data){
                $('#ddlCourses').multiselect({includeSelectAllOption: true});
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlCourses').siblings().removeClass('open');
                     });
                   
                $('#loaderCourses').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].CRSE_DESCR, value:data[i].CRSE_ID});

                $('#ddlCourses').multiselect('dataprovider', d);
               
                $('#ddlCourses').change(function(){
                  //sx.loadCourseAttribute();
                });
                //sx.loadCourseAttribute();
            }
        });
    },
    init: function() {
        var sx = this;
        sx.loadTable();
 
    }
};