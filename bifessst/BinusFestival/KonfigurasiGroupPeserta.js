var sx, prms = '';
var tempDetail = [], popUpResult={};
(function($){
    $.fn.openOneCloseAll = function(){
        this.addClass('open');
        this.parent().parent().parent().nextAll().children().next().children().children().next().removeClass('open');
        this.parent().parent().parent().prevAll().children().next().children().children().next().removeClass('open');
        return this;
    };
 }(jQuery));
var subView = {
    title: 'Konfigurasi Group Peserta - Binusmaya',
    require: 'event/binusfestival',
    rel: 'FestivalContent',
    onLoaded: function(arg)
    {   BM.popUpResult = {};
        $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        sx = this;
        prms = BM.popupparam;
        sx.init(arg);
        if (typeof BM.headPrefectConfiguration != "undefined") {
            sx.initFilter(BM.headPrefectConfiguration);
        }
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getSystemName",
            data : JSON.stringify({
                    SystemID:arg
                }),
            type: "POST",
            success: function(data){
            $('#actionTitle').append(" - "+data[0].SystemName);
            $('#lblSystem').append(data[0].SystemName);
            $('#lblPeriod').append(data[0].STRM);
                // window.open("#/event/binusfestival/konfigurasiJadwalRuangan."+arg,"_blank");
            }
        });
        $('#btnExport').click(function(event){
        sx.ExportToExcel(arg);            });
        $('#btnAddPopUp').click(function(event){
        BM.filter={SystemID : arg};
                        window.location = "#/event/binusfestival/konfigurasiGroupPeserta."+arg+"#formAdd";
                    });
        $('#btnGoToRoomConfiguration').click(function(event){
        BM.filter={SystemID : arg};
         BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getParticipantGroupConfig",
            data : JSON.stringify({
                    SystemID:arg
                }),
            type: "POST",
            success: function(data){
                BM.popUpResult.group = data;
                BM.popUpResult.current = 0;
                BM.popUpResult.session = 0;
                window.location = "#/event/binusfestival/konfigurasiJadwalRuangan."+arg;
                // window.open("#/event/binusfestival/konfigurasiJadwalRuangan."+arg,"_blank");
            }
        });
                       
                    });

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
                // $('#ddlCampus').empty();
                // if(data.length) {
                //     for(i=0 ; i < data.length ; i++){
                //         option = "<option value='"+data[i].Campus+"'>"+data[i].Descr+"</option>";
                //         $("#ddlCampus").append(option);
                //     }
                // } else {
                //     option = "<option value = ''>All</option>";
                //     $("#ddlCampus").append(option);
                // }
                // $("#ddlCampus").closest(".custom-combobox").find(".combobox-label").remove();
                // $("#ddlCampus").closest(".custom-combobox").data("has-init","no").binus_combobox();
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
                    ACAD_ORG:$("#ddlFaculty").val(),
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
                // $("#ddlCourses").change(function(){
                //      if ($("#ddlCourses option:not(:selected)").length == 0){
                //         $('#chkCourses').prop('checked',true);
                       
                //      }
                //      else{
                //          $('#chkCourses').prop('checked',false);
                         
                //      }

                // })
               
                // $("#chkCourses").on('click', function(){
                //     if($(this).prop('checked')== true){
                //         $('#ddlCourses option').prop('selected', true);
                //          $('#coursesselect ul li').each(function(){
                //             $(this).addClass('Active');
                         
                //         });
                //     }
                //     else{
                //         $('#ddlCourses option').prop('selected', false);
                //          $('#coursesselect ul li').each(function(){
                //             $(this).removeClass('Active');
                         
                //         });
                //     }
                //    // $('.cbxAttendanceMonitoring').prop('checked',$(this).prop('checked'));
                //     //$('#btnPrintDocument').val('Print Document ('+$('.cbxAttendanceMonitoring:checked').length+')');
                // });
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
    init: function(initParam) {
        var sx = this;
        sx.loadTable(initParam);
    },
    ExportToExcel : function(initParam) {
        var sx = this;
        var data = {};
                            data['Main'] = "ParticipantGroup";
                            data['SystemID'] = initParam;
                           
                var form = document.createElement("form");
            form.action = BM.serviceUri+'BinusFestival/getexportData';
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
        //   BM.ajax({
        //     url: BM.serviceUri + "staff/HeadPrefect_Configuration/getParticipantGroupConfiguration",
        //     data: JSON.stringify({'SystemID': initParam}),
        //     type: "POST",
        //     async: false,
        //     dataType: "json",
        //     beforeSend: function() {
        //         $('.dataPopUp').remove();
        //         $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        //         $('#loadingpopup').show();
        //     },
        //     success: function(result) {
        //         $.each(result, function(a, e) {
        //             var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
        //             $('.iOption', c).append('<a class="icon icon-edit"  style="cursor:pointer;"></a><a class="icon icon-trash"  style="cursor:pointer;"></a>');
        //             $('.iOfficialNotesID ', c).append(e.ParticipantGroupID);
        //             $('.iParticipantGroupName ', c).append(e.ParticipantGroupName);
        //             $('.iTotalSession ',c).append(e.TotalSession);
        //             $('.iMandatory', c).append((e.Mandatory == "1")? "Yes" : "No");
        //             $('.iStatus', c).append((e.IsConfigured == "0")? "Not Configured Yet" : "Have Configured");
        //             $(c).click(function(event){
        //                 $('.ParticipantContent').show();
        //             BM.filter={SystemID : initParam, ParticipantGroupID : e.ParticipantGroupID};
        //             sx.loadDataTable(initParam,e.ParticipantGroupID, e.ParticipantGroupName);
        //             });
        //             $('.iOption .icon-edit', c).click(function(event){
        //             BM.filter={SystemID : initParam, ParticipantGroupID : e.ParticipantGroupID};
        //                 window.location = "#/event/binusfestival/konfigurasiGroupPeserta."+initParam+"#formAdd";
        //             });
        //             $('.iOption .icon-trash', c).click(function(event){
        //                 BM.ajax({
        //                     url: BM.serviceUri + "General_Head_Prefect/DeleteParticipantGroupConfiguration",
        //                     data: JSON.stringify({'ParticipantGroupID': e.ParticipantGroupID}),
        //                     type: "POST",
        //                     async: false,
        //                     dataType: "json",
        //                     beforeSend: function() {
        //                         $(c).remove();
        //                         $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        //                         $('#loadingpopup').show();
        //                     },
        //                     success: function(result) {
        //                         alert("data saved");
        //                     }
        //                 });
        //             sx.loadTable(initParam);
        //             });
        //             $('#tableOfficialNotesPopUp tbody').append(c);
                     
        //         });

        //     }
        // });
    },
    initFilter: function(initParam) {
        var sx = this;
        $('#ddlPopupAcademicInstitution').val(initParam.Institution);
        $('#ddlPopupCampus').val(initParam.Campus);
        $('#ddlPopupDegreeByID').val(initParam.Career).change();
        $('#ddlPopupPeriod').val(initParam.Period).change();
        sx.refreshCombobox();
    },
    loadTable :function(initParam){
        var sx = this;
         BM.ajax({
            url: BM.serviceUri + "staff/HeadPrefect_Configuration/getParticipantGroupConfiguration",
            data: JSON.stringify({'SystemID': initParam}),
            type: "POST",
            async: false,
            dataType: "json",
            beforeSend: function() {
                $('.dataPopUp').remove();
                $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
                $('#loadingpopup').show();
            },
            success: function(result) {
                $.each(result, function(a, e) {
                    var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                    $('.iOption', c).append('<a class="icon icon-edit"  style="cursor:pointer;"></a><a class="icon icon-trash"  style="cursor:pointer;"></a>');
                    $('.iOfficialNotesID ', c).append(e.ParticipantGroupID);
                    $('.iParticipantGroupName ', c).append(e.ParticipantGroupName);
                    $('.iTotalSession ',c).append(e.TotalSession);
                    $('.iMandatory', c).append((e.Mandatory == "1")? "Yes" : "No");
                    $('.iStatus', c).append((e.IsConfigured == "0")? "Not Configured Yet" : "Have Configured");
                    $(c).click(function(event){
                        $('.ParticipantContent').show();
                    BM.filter={SystemID : initParam, ParticipantGroupID : e.ParticipantGroupID};
                    sx.loadDataTable(initParam,e.ParticipantGroupID, e.ParticipantGroupName);
                    });
                    $('.iOption .icon-edit', c).click(function(event){
                    BM.filter={SystemID : initParam, ParticipantGroupID : e.ParticipantGroupID};
                        window.location = "#/event/binusfestival/konfigurasiGroupPeserta."+initParam+"#formAdd";
                    });
                    $('.iOption .icon-trash', c).click(function(event){
                        BM.ajax({
                            url: BM.serviceUri + "General_Head_Prefect/DeleteParticipantGroupConfiguration",
                            data: JSON.stringify({'ParticipantGroupID': e.ParticipantGroupID}),
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
                    sx.loadTable(initParam);
                    });
                    $('#tableOfficialNotesPopUp tbody').append(c);
                     
                });

            }
        });
    },
    loadDataTable : function(initParam,ParticipantGroupID,participantgroupname){
        var sx = this;
        $("html, body").animate({ scrollTop: $('#lblSystem').position().top -5 }, "slow");
        $('#lblParticipantGroup').html(participantgroupname);
        $('#btnAddParticipantPopUp').click(function(event){
             BM.filter={SystemID : initParam, ParticipantGroupID : ParticipantGroupID, ParticipantGroupName :participantgroupname, participantID :''};
                        window.location = "#/event/binusfestival/konfigurasiGroupPeserta."+initParam+"#AddParticipantForm";
        });
        BM.ajax({
            url: BM.serviceUri + "staff/HeadPrefect_Configuration/GetAllParticipantByParticipantGroupID",
            data: JSON.stringify({'ParticipantGroupID': ParticipantGroupID}),
            type: "POST",
            async: false,
            dataType: "json",
            beforeSend: function() {
                $('.dataParticipantPopUp').remove();
                $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
                $('#loadingpopup').show();
            },
            success: function(result) {
                $.each(result, function(a, e) {
                    var c = $('#iTemplateParticipantPopUp').clone().removeAttr('id').css('display', '').addClass('dataParticipantPopUp');
                    $('.iOption', c).append('<a class="icon icon-edit"  style="cursor:pointer;"></a><a class="icon icon-trash"  style="cursor:pointer;"></a>');
                    $('.iInclude ', c).append(e.DataInclude);
                    $('.iExclude ', c).append(e.DataExclude);
                    $('.iMandatory', c).append((e.Mandatory == "1")? "Yes" : "No");
                    $(c).click(function(event){
                    BM.filter={SystemID : initParam, ParticipantGroupID : ParticipantGroupID, ParticipantGroupName :participantgroupname,ParticipantID :e.ParticipantID };
                        window.location = "#/event/binusfestival/konfigurasiGroupPeserta."+initParam+"#AddParticipantForm";
                    });
                    $('.iOption .icon-edit', c).click(function(event){
                    BM.filter={SystemID : initParam, ParticipantGroupID : ParticipantGroupID, ParticipantGroupName :participantgroupname,ParticipantID :e.ParticipantID };
                        window.location = "#/event/binusfestival/konfigurasiGroupPeserta."+initParam+"#AddParticipantForm";
                    });
                    $('.iOption .icon-trash', c).click(function(event){
                        BM.ajax({
                                url: BM.serviceUri + "General_Head_Prefect/DeleteParticipantConfiguration",
                                data: JSON.stringify({'ParticipantID': e.ParticipantID}),
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
                        sx.loadDataTable(initParam,ParticipantGroupID, participantgroupname);
                    });
                    $('#tableParticipantConfiguration tbody').append(c);
                     
                });

            }
        });

    }
};