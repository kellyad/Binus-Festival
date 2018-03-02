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
                // window.open("#/event/binusfestival/konfigurasiJadwalRuangan."+arg,"_blank");
            }
        });
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
                    $(c).click(function(event){
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

    },
    loadBindofBindCmb: function(param) {
        var sx = this;
        var classType = $('#ddlClassType option:selected').val();

        var filterData = {
            listField: ['OrgAndClass'],
            ACAD_INSTITUTION: $('#ddlPopupAcademicInstitution option:selected').val(),
            Acad_Career: $('#ddlPopupDegreeByID option:selected').val(),
            CAMPUS: $('#ddlPopupCampus option:selected').val(),
            STRM: $('#ddlPopupPeriod option:selected').val(),
            ACAD_GROUP: $('#ddlPopupGroup option:selected').val(),
            SSR_COMPONENT: (typeof classType == "undefined" ? "" : classType)
        };
        BM.ajax({
            url: BM.serviceUri + "General_Head_Prefect/getFilterData",
            data: JSON.stringify(filterData),
            type: "POST",
            async: false,
            dataType: "json",
            beforeSend: function() {
                $('.rowDetail').remove();
                $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
                $('#loadingpopup').show();
            },
            success: function(result) {
                $('.rowDetail').remove();
                var tempOrg = "";
                var tempCourse = "";
                var data = result.OrgAndClass;
                if (data.length > 0) {
                    $('#loadingpopup').hide();
                } else {
                    $('img', '.iLoadingPopup').remove();
                    $('.iLoadingPopup').text('All');
                }
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (tempOrg == "" || tempOrg != item.ACAD_ORG) {
                        var e = $('#rowOrg').clone().removeClass('looptemplate').removeAttr('id').addClass('rowDetail').css("display", '').css("text-align", 'left');
                        e.attr("ID", "row" + item.ACAD_ORG);
                        $(".iTitle", e).html("<label class='expander' mytype='close' id='expander" + item.ACAD_ORG + "'myval='row" + item.ACAD_ORG + "'style='display:inline;'><img style='display:inline;' alt='' src='" + BM.baseUri + "staff/images/icon_plus.png' /></label>&nbsp;" + item.ACAD_ORG_DESCR);
                        $(".rowInput", e).html('<input type="checkbox"name="cbOrg"myval="' + item.ACAD_ORG + '">');
                        $(".iMandatory", e).html('<input type="checkbox"name="cbMandatory"mytype="org"myval="' + item.ACAD_ORG + '">');
                        $('#rowOrg').before(e);
                        var f = $('#rowCourse').clone().removeClass('looptemplate').removeAttr('id').addClass('rowDetail').css("display", '').css("text-align", 'left');
                        f.attr("parentrow", "row" + item.ACAD_ORG);
                        f.attr("ID", "row" + item.CRSE_ID);
                        $(".iTitle", f).html("<label class='expander' mytype='close' id='expander" + item.CRSE_ID + "'myval='row" + item.CRSE_ID + "'style='display:inline;'><img style='display:inline;' alt='' src='" + BM.baseUri + "staff/images/icon_plus.png' /></label>&nbsp;" + item.COURSETITLE);
                        $(".rowInput", f).html('<input type="checkbox"name="cbCourse"myparentval="' + item.ACAD_ORG + '"myval="' + item.CRSE_ID + '"mysubject="' + item.SUBJECT + '"mycatalogno="' + item.CATALOG_NBR + '" myoffernbr="'+item.CRSE_OFFER_NBR+'">');
                        $(".iMandatory", f).html('<input type="checkbox"name="cbMandatory"myparentval="' + item.ACAD_ORG + '"mytype="course"myval="' + item.CRSE_ID + '">');
                        $("#row" + item.ACAD_ORG).after(f);
                        var g = $('#rowClass').clone().removeClass('looptemplate').removeAttr('id').addClass('rowDetail').css("display", '').css("text-align", 'left');
                        g.attr("parentrow", "row" + item.CRSE_ID);
                        g.attr("headparentrow", "row" + item.ACAD_ORG);
                        g.attr("ID", "row" + item.CLASS_NBR);
                        $(".iTitle", g).html(item.CLASS_SECTION);
                        $(".rowInput", g).html('<input type="checkbox"name="cbClass"myparentval="' + item.CRSE_ID + '"myval="' + item.CLASS_NBR + '">');
                        $(".iMandatory", g).html('<input type="checkbox"name="cbMandatory"myparentval="' + item.CRSE_ID + '"mytype="class"myval="' + item.CLASS_NBR + '">');
                        $("#row" + item.CRSE_ID).after(g);

                    } else {
                        if (tempCourse == "" || tempCourse != item.CRSE_ID) {
                            var f = $('#rowCourse').clone().removeClass('looptemplate').removeAttr('id').addClass('rowDetail').css("display", '').css("text-align", 'left');
                            f.attr("parentrow", "row" + item.ACAD_ORG);
                            f.attr("ID", "row" + item.CRSE_ID);
                            $(".iTitle", f).html("<label class='expander' mytype='close' id='expander" + item.CRSE_ID + "'myval='row" + item.CRSE_ID + "'style='display:inline;'><img style='display:inline;' alt='' src='" + BM.baseUri + "staff/images/icon_plus.png' /></label>&nbsp;" + item.COURSETITLE);
                            $(".rowInput", f).html('<input type="checkbox"name="cbCourse"myparentval="' + item.ACAD_ORG + '"myval="' + item.CRSE_ID + '"mysubject="' + item.SUBJECT + '"mycatalogno="' + item.CATALOG_NBR + '" myoffernbr="'+item.CRSE_OFFER_NBR+'">');
                            $(".iMandatory", f).html('<input type="checkbox"name="cbMandatory"myparentval="' + item.ACAD_ORG + '"mytype="course"myval="' + item.CRSE_ID + '">');
                            $("#row" + item.ACAD_ORG).after(f);
                            var g = $('#rowClass').clone().removeClass('looptemplate').removeAttr('id').addClass('rowDetail').css("display", '').css("text-align", 'left');
                            g.attr("parentrow", "row" + item.CRSE_ID);
                            g.attr("headparentrow", "row" + item.ACAD_ORG);
                            g.attr("ID", "row" + item.CLASS_NBR);
                            $(".iTitle", g).html(item.CLASS_SECTION);
                            $(".rowInput", g).html('<input type="checkbox"name="cbClass"myparentval="' + item.CRSE_ID + '"myval="' + item.CLASS_NBR + '">');
                            $(".iMandatory", g).html('<input type="checkbox"name="cbMandatory"myparentval="' + item.CRSE_ID + '"mytype="class"myval="' + item.CLASS_NBR + '">');
                            $("#row" + item.CRSE_ID).after(g);
                        } else {
                            var g = $('#rowClass').clone().removeClass('looptemplate').removeAttr('id').addClass('rowDetail').css("display", '').css("text-align", 'left');
                            g.attr("parentrow", "row" + item.CRSE_ID);
                            g.attr("headparentrow", "row" + item.ACAD_ORG);
                            g.attr("ID", "row" + item.CLASS_NBR);
                            $(".iTitle", g).html(item.CLASS_SECTION);
                            $(".rowInput", g).html('<input type="checkbox"name="cbClass"myparentval="' + item.CRSE_ID + '"myval="' + item.CLASS_NBR + '">');
                            $(".iMandatory", g).html('<input type="checkbox"name="cbMandatory"myparentval="' + item.CRSE_ID + '"mytype="class"myval="' + item.CLASS_NBR + '">');
                            $("#row" + item.CRSE_ID).after(g);
                        }
                    }
                    tempOrg = item.ACAD_ORG;
                    tempCourse = item.CRSE_ID;
                }
                $('.expander').on("click", function() {
                    var myval = $(this).attr('myval');
                    var mytype = $(this).attr('mytype');
                    if (mytype == "close") {
                        $('tr[headparentrow=' + myval + ']').fadeOut(500);
                        $('tr[parentrow=' + myval + ']').fadeOut(500);
                        $(this).attr("mytype", "open");
                        $('img', '#' + myval).attr('src', BM.baseUri + 'staff/images/icon_plus.png');
                    } else {
                        $('tr[parentrow=' + myval + ']').fadeIn(500);
                        $(this).attr("mytype", "close");
                        $('img', '#' + myval).attr('src', BM.baseUri + 'staff/images/icon_minus.png');
                    }
                });
                $('.expander').click();
                $('input[name=cbOrg]').change(function() {
                    var currentOrg = $(this).attr("myval");
                    if ($(this).is(':checked')) {
                        $('input[name=cbCourse][myparentval=' + currentOrg + ']').prop('checked', true).change();

                    } else {
                        $('input[name=cbCourse][myparentval=' + currentOrg + ']').prop('checked', false).change();
                    }
                    if ($('input[name=cbOrg]:checked').length == $('input[name=cbOrg]').length && $('input[name=cbCourse]:checked').length == $('input[name=cbCourse]').length) {
                        $('#allOrg').prop('checked', true);
                    } else {
                        $('#allOrg').prop('checked', false);
                    }
                });
                $('input[name=cbCourse]').change(function() {
                    var currentProg = $(this).attr("myparentval");
                    var myval = $(this).attr("myval");
                    if ($(this).is(':checked')) {
                        if ($('input[name=cbCourse][myparentval=' + currentProg + ']:checked').length == $('input[name=cbCourse][myparentval=' + currentProg + ']').length) {
                            $('input[name=cbOrg][myval=' + currentProg + ']').prop('checked', true);
                        }
                        $('input[name=cbClass][myparentval=' + myval + ']').prop('checked', true);

                    } else {
                        $('input[name=cbClass][myparentval=' + myval + ']').prop('checked', false);
                        $('input[name=cbOrg][myval=' + currentProg + ']').prop('checked', false);
                    }
                    if ($('input[name=cbOrg]:checked').length == $('input[name=cbOrg]').length && $('input[name=cbCourse]:checked').length == $('input[name=cbCourse]').length) {
                        $('#allOrg').prop('checked', true);
                    } else {
                        $('#allOrg').prop('checked', false);
                    }
                });
                $('input[name=cbClass]').change(function() {
                    var currentProg = $(this).attr("myparentval");
                    if ($(this).is(':checked')) {
                        if ($('input[name=cbClass][myparentval=' + currentProg + ']:checked').length == $('input[name=cbClass][myparentval=' + currentProg + ']').length) {
                            $('input[name=cbCourse][myval=' + currentProg + ']').prop('checked', true).change();
                        }
                    } else {
                        $('input[name=cbCourse][myval=' + currentProg + ']').prop('checked', false);
                    }
                    if ($('input[name=cbOrg]:checked').length == $('input[name=cbOrg]').length && $('input[name=cbCourse]:checked').length == $('input[name=cbCourse]').length) {
                        $('#allOrg').prop('checked', true);
                    } else {
                        $('#allOrg').prop('checked', false);
                    }
                });
                $('input[name=cbMandatory][mytype=org]').change(function() {
                    var currentProg = $(this).attr("myval");
                    if ($(this).is(':checked')) {
                        $('input[name=cbMandatory][myparentval=' + currentProg + ']').prop('checked', true).change();
                    } else {
                        $('input[name=cbMandatory][myparentval=' + currentProg + ']').prop('checked', false).change();
                    }
                });
                $('input[name=cbMandatory][mytype=course]').change(function() {
                    var currentProg = $(this).attr("myparentval");
                    var myval = $(this).attr("myval");
                    if ($(this).is(':checked')) {
                        if ($('input[name=cbMandatory][mytype=course][myparentval=' + currentProg + ']:checked').length == $('input[name=cbMandatory][mytype=course][myparentval=' + currentProg + ']').length) {
                            $('input[name=cbMandatory][mytype=org][myval=' + currentProg + ']').prop('checked', true);
                        }
                        $('input[name=cbMandatory][myparentval=' + myval + ']').prop('checked', true);
                    } else {
                        $('input[name=cbMandatory][mytype=org][myval=' + currentProg + ']').prop('checked', false);
                        $('input[name=cbMandatory][myparentval=' + myval + ']').prop('checked', false);
                    }
                });
                $('input[name=cbMandatory][mytype=class]').change(function() {
                    var currentProg = $(this).attr("myparentval");
                    var myval = $(this).attr("myval");
                    if ($(this).is(':checked')) {
                        if ($('input[name=cbMandatory][mytype=class][myparentval=' + currentProg + ']:checked').length == $('input[name=cbMandatory][mytype=class][myparentval=' + currentProg + ']').length) {
                            $('input[name=cbMandatory][mytype=course][myval=' + currentProg + ']').prop('checked', true);
                        }
                    } else {
                        $('input[name=cbMandatory][mytype=course][myval=' + currentProg + ']').prop('checked', false);
                    }
                });
                $('#allOrg').change(function() {
                    if ($(this).is(':checked')) {
                        $('input[name=cbOrg]').prop('checked', true);
                        $('input[name=cbCourse]').prop('checked', true);
                        $('input[name=cbClass]').prop('checked', true);
                    } else {
                        $('input[name=cbOrg]').prop('checked', false);
                        $('input[name=cbCourse]').prop('checked', false);
                        $('input[name=cbClass]').prop('checked', false);
                    }
                });
                $('#allMandatory').change(function() {
                    if ($(this).is(':checked')) {
                        $.each($('input[name=cbMandatory][mytype=org]'), function() {
                            if ($('input[name=cbOrg][myval=' + $(this).attr('myval') + ']').prop('checked') == true) {
                                $(this).prop('checked', true).change();
                            }
                        });
                    } else {
                        $('input[name=cbMandatory]').prop('checked', false);
                    }
                });
            }
        });
    },
    loadBindofBindCmb1: function() {
        var sx = this;
        var filterData = {
            listField: ['ProgAndCourse'],
            ACAD_INSTITUTION: $('#ddlPopupAcademicInstitution option:selected').val(),
            Acad_Career: $('#ddlPopupDegreeByID option:selected').val(),
            CAMPUS: $('#ddlPopupCampus option:selected').val(),
            STRM: $('#ddlPopupPeriod option:selected').val(),
            ACAD_GROUP: $('#ddlPopupGroup option:selected').val()
        };
        BM.ajax({
            url: BM.serviceUri + "General_Head_Prefect/getFilterData",
            data: JSON.stringify(filterData),
            type: "POST",
            async: false,
            dataType: "json",
            beforeSend: function() {
                $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
            },
            success: function(result) {
                $('.rowDetail').remove();
                var tempProg = "";
                var data = result.ProgAndCourse;
                if (data.length > 0) {
                    $('#loadingpopup').remove();
                } else {
                    $('img', '.iLoadingPopup').remove();
                    $('.iLoadingPopup').text('All');
                }
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (tempProg == "" || tempProg != item.ACAD_PROG) {
                        var e = $('#rowProg').clone().removeClass('looptemplate').removeAttr('id').addClass('rowDetail').css("display", '').css("text-align", 'left');
                        e.attr("ID", "row" + item.ACAD_PROG);
                        $(".iTitle", e).html("<label class='expander' mytype='close' id='expander" + item.ACAD_PROG + "'myval='row" + item.ACAD_PROG + "'style='display:inline;'><img style='display:inline;' alt='' src='" + BM.baseUri + "staff/images/icon_plus.png' /></label>&nbsp;" + item.ACAD_PROG_DESCR);
                        $(".rowInput", e).html('<input type="checkbox"name="cbProg"myval="' + item.ACAD_PROG + '">');
                        $(".iMandatory", e).html('<input type="checkbox"name="cbMandatory"mytype="prog"myval="' + item.ACAD_PROG + '">');
                        $('#rowProg').before(e);
                        var f = $('#rowCourse').clone().removeClass('looptemplate').removeAttr('id').addClass('rowDetail').css("display", '').css("text-align", 'left');
                        f.attr("parentrow", "row" + item.ACAD_PROG);
                        $(".iTitle", f).text(item.COURSETITLE);
                        $(".rowInput", f).html('<input type="checkbox"name="cbCourse"myparentval="' + item.ACAD_PROG + '"myval="' + item.CRSE_ID + '"mysubject="' + item.SUBJECT + '"mycatalogno="' + item.CATALOG_NBR + '">');
                        $(".iMandatory", f).html('<input type="checkbox"name="cbMandatory"myparentval="' + item.ACAD_PROG + '"mytype="course"myval="' + item.CRSE_ID + '">');
                        $("#row" + item.ACAD_PROG).after(f);
                    } else {
                        var f = $('#rowCourse').clone().removeClass('looptemplate').removeAttr('id').addClass('rowDetail').css("display", '').css("text-align", 'left');
                        $(".iTitle", f).text(item.COURSETITLE);
                        f.attr("parentrow", "row" + item.ACAD_PROG);
                        $(".rowInput", f).html('<input type="checkbox"name="cbCourse"myparentval="' + tempProg + '"myval="' + item.CRSE_ID + '"mysubject="' + item.SUBJECT + '"mycatalogno="' + item.CATALOG_NBR + '">');
                        $(".iMandatory", f).html('<input type="checkbox"name="cbMandatory"myparentval="' + tempProg + '"mytype="course"myval="' + item.CRSE_ID + '">');
                        $("#row" + tempProg).after(f);
                    }
                    tempProg = item.ACAD_PROG;
                }
                $('.expander').on("click", function() {
                    var myval = $(this).attr('myval');
                    var mytype = $(this).attr('mytype');
                    if (mytype == "close") {
                        $('tr[parentrow=' + myval + ']').fadeOut(500);
                        $(this).attr("mytype", "open");
                        $('img', '#' + myval).attr('src', BM.baseUri + 'staff/images/icon_plus.png');
                    } else {
                        $('tr[parentrow=' + myval + ']').fadeIn(500);
                        $(this).attr("mytype", "close");
                        $('img', '#' + myval).attr('src', BM.baseUri + 'staff/images/icon_minus.png');
                    }
                });
                $('.expander').click();
                $('input[name=cbProg]').change(function() {
                    var currentProg = $(this).attr("myval");
                    if ($(this).is(':checked')) {
                        $('input[name=cbCourse][myparentval=' + currentProg + ']').prop('checked', true);

                    } else {
                        $('input[name=cbCourse][myparentval=' + currentProg + ']').prop('checked', false);
                    }
                    if ($('input[name=cbProg]:checked').length == $('input[name=cbProg]').length && $('input[name=cbCourse]:checked').length == $('input[name=cbCourse]').length) {
                        $('#allMajor').prop('checked', true);
                    } else {
                        $('#allMajor').prop('checked', false);
                    }
                });
                $('input[name=cbCourse]').change(function() {
                    var currentProg = $(this).attr("myparentval");
                    if ($(this).is(':checked')) {
                        if ($('input[name=cbCourse][myparentval=' + currentProg + ']:checked').length == $('input[name=cbCourse][myparentval=' + currentProg + ']').length) {
                            $('input[name=cbProg][myval=' + currentProg + ']').prop('checked', true);
                        }

                    } else {
                        $('input[name=cbProg][myval=' + currentProg + ']').prop('checked', false);
                    }
                    if ($('input[name=cbProg]:checked').length == $('input[name=cbProg]').length && $('input[name=cbCourse]:checked').length == $('input[name=cbCourse]').length) {
                        $('#allMajor').prop('checked', true);
                    } else {
                        $('#allMajor').prop('checked', false);
                    }
                });
                $('input[name=cbMandatory][mytype=prog]').change(function() {
                    var currentProg = $(this).attr("myval");
                    if ($(this).is(':checked')) {
                        $('input[name=cbMandatory][myparentval=' + currentProg + ']').prop('checked', true);
                    } else {
                        $('input[name=cbMandatory][myparentval=' + currentProg + ']').prop('checked', false);
                    }
                });
                $('input[name=cbMandatory][mytype=course]').change(function() {
                    var currentProg = $(this).attr("myparentval");
                    if ($(this).is(':checked')) {
                        if ($('input[name=cbMandatory][mytype=course][myparentval=' + currentProg + ']:checked').length == $('input[name=cbMandatory][mytype=course][myparentval=' + currentProg + ']').length) {
                            $('input[name=cbMandatory][mytype=prog][myval=' + currentProg + ']').prop('checked', true);
                        }
                    } else {
                        $('input[name=cbMandatory][mytype=prog][myval=' + currentProg + ']').prop('checked', false);
                    }
                });
                $('#allMajor').change(function() {
                    if ($(this).is(':checked')) {
                        $('input[name=cbProg]').prop('checked', true);
                        $('input[name=cbCourse]').prop('checked', true);
                    } else {
                        $('input[name=cbProg]').prop('checked', false);
                        $('input[name=cbCourse]').prop('checked', false);
                    }
                });
                $('#allMandatory').change(function() {
                    if ($(this).is(':checked')) {
                        $.each($('input[name=cbMandatory][mytype=prog]'), function() {
                            if ($('input[name=cbProg][myval=' + $(this).attr('myval') + ']').prop('checked') == true) {
                                $(this).prop('checked', true).change();
                            }
                        });
                    } else {
                        $('input[name=cbMandatory]').prop('checked', false);
                    }
                });
            }
        });
    },
    showLoading: function() {
        $('#submit').prop('disabled', true);
        $('#submit').before('<div style="margin-top: 1%; margin-bottom: 0px; float: right; position: absolute; right: 14%;" id="myloading">Loading...</div>');
    },
    hideLoading: function() {
        $('#submit').prop('disabled', false);
        $('#myloading').remove();
    },
    submitForm: function(elj) {
        var sx = this;
        sx.showLoading();
        var deadline = $('#endDate').datepicker('getDate');
        var startdeadline = $('#startDate').datepicker('getDate');
        if (startdeadline > deadline) {
            alert("Start Date must before End Date");
        } else {
            var detail = [];
            $.each($('input[name=cbClass]:checked'), function() {
                var tempObj = {};
                var course = $('input[name=cbCourse][myval=' + $(this).attr("myparentval") + ']');
                var org = $('input[name=cbOrg][myval=' + $(course).attr("myparentval") + ']');
                tempObj.CRSE_ID = $(course).attr('myval');
                tempObj.CRSE_OFFER_NBR = $(course).attr('myoffernbr');
                tempObj.SUBJECT = $(course).attr('mysubject');
                tempObj.CATALOG_NBR = $(course).attr('mycatalogno');
                tempObj.ACAD_PROG = $(course).attr('myparentval');
                tempObj.Mandatory = ($('input[name=cbMandatory][mytype=class][myparentval=' + $(this).attr('myparentval') + '][myval=' + $(this).attr('myval') + ']').prop('checked') == true ? 1 : 0);
                tempObj.CLASS_NBR = $(this).attr('myval');
                tempObj.ACAD_ORG = $(org).attr('myval');
                detail.push(tempObj);
            });
            elj.detail = detail;
            delete elj.cbProg;
            delete elj.cbCourse;
            delete elj.cbClass;
            delete elj.cbMandatory;
            BM.ajax({
                type: 'POST',
                url: BM.serviceUri + 'staff/HeadPrefect_Configuration/' + $('[name=action]').val() + '_configuration',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(elj),
                beforeSend: function() {
                    sx.showLoading();
                },
                success: function(data) {
                    sx.hideLoading();
                    if (data.status == 'success') {
                        alert("Data Saved");
                        $('#ddlAcademicInstitution').val($('#ddlPopupAcademicInstitution option:selected').val());
                        $('#ddlCampus').val($('#ddlPopupCampus option:selected').val());
                        $('#ddlDegreeByID').val($('#ddlPopupDegreeByID option:selected').val());
                        $('#ddlPeriod').val($('#ddlPopupPeriod option:selected').val());
                        sx.parent.refreshCombobox();
                        sx.parent.loadTableDetail();
                        $.fancybox.close();
                    } else {
                        sx.hideLoading();
                        alert(data.message);
                    }
                }
            });
        }

    },
    refreshCombobox: function() {
        $('#ddlPopupAcademicInstitution').siblings('.combobox-label').text($('#ddlPopupAcademicInstitution option:selected').text());
        $('#ddlPopupCampus').siblings('.combobox-label').text($('#ddlPopupCampus option:selected').text());
        $('#ddlPopupDegreeByID').siblings('.combobox-label').text($('#ddlPopupDegreeByID option:selected').text());
        $('#ddlPopupPeriod').siblings('.combobox-label').text($('#ddlPopupPeriod option:selected').text());
        $('#ddlPopupGroup').siblings('.combobox-label').text($('#ddlPopupGroup option:selected').text());
        $('#ddlClassType').siblings('.combobox-label').text($('#ddlClassType option:selected').text());
    },
    setSingleData: function(key) {
        var sx = this;
        BM.ajax({
            type: 'GET',
            async: false,
            url: BM.serviceUri + 'staff/HeadPrefect_Configuration/get_single_configuration/' + key,
            success: function(result) {
                var data = result.header;
                var detail = result.detail;
                $('input[name="ID"]').val(data.HeadPrefectConfigurationID);
                $('#ddlPopupAcademicInstitution').val(data.ACAD_INSTITUTION);
                $('#ddlPopupCampus').val(data.CAMPUS);
                $('#ddlPopupDegreeByID').val(data.ACAD_CAREER);
                $('#ddlPopupDegreeByID').change();
                $('#ddlPopupPeriod').val(data.STRM);
                $('#ddlPopupPeriod').change();
                $('#ddlPopupGroup').val(data.ACAD_GROUP);
                $('#ddlPopupGroup').change();
                $('#ddlClassType').val(data.SSR_COMPONENT);
                $('#ddlClassType').change();
                $('input[name="startDate"]').val(BM.formatShortDate(data.StartDate.split(' ')[0]));
                $('input[name="endDate"]').val(BM.formatShortDate(data.EndDate.split(' ')[0]));
                $('input[name="action"]').val('edit');
                sx.refreshCombobox();
                $.each(detail, function() {
                    var temp = this;
                    $('input[name=cbClass][myparentval=' + this.CRSE_ID + '][myval=' + this.CLASS_NBR + ']').prop('checked', true).change();
                    $('input[name=cbMandatory][myparentval=' + this.CRSE_ID + '][myval=' + this.CLASS_NBR + '][mytype=class]').prop('checked', (this.Mandatory == 1 ? true : false)).change();
                });

            }
        });
    }
};