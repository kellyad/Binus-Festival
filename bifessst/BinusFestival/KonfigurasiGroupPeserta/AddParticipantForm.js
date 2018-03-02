var psx, prms = '';
var tempDetail = [];
(function($){
    $.fn.openOneCloseAll = function(){
        this.addClass('open');
        this.parent().parent().parent().nextAll().children().next().children().children().next().removeClass('open');
        this.parent().parent().parent().prevAll().children().next().children().children().next().removeClass('open');
        
        return this;
    };
 }(jQuery));
var popupSubView = {
    title: 'Konfigurasi Peserta - Binusmaya',
    require: 'event/binusfestival',
    rel: 'FestivalContent',
    onLoaded: function(arg)
    {
        $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        psx = this;
        prms = BM.popupparam;

        if (BM.filter.participantID =='' ) {
        psx.init();}
        console.log("argument"+arg);
        
        if (BM.filter.participantID !='' ) {
            // psx.setSingleData(prms.key);
            // if (prms.action == "view") {
            BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/GetParticipantByParticipantID",
            type: "POST",
            data: JSON.stringify({
                    ParticipantID:BM.filter.ParticipantID
                }),
            success: function(datas){

            $('select').attr('disabled',true);
                if(datas.length!=0)
                {  
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
                            $("#ddlAcademicInstitution").val(datas[0].Include_INSTITUTION);
                            $('#ddlAcademicInstitution').closest('.custom-combobox').find('.combobox-label').html($('#ddlAcademicInstitution option[value='+datas[0].Include_INSTITUTION+']').html());
                            $('#ddlAcademicInstitution').change(function(){
                                psx.loadDegree();
                            });
                        }
                    });
                    $("#ddlDegree").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderDegree').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAcademicCareer",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Include_INSTITUTION
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
                            $("#ddlDegree").val(datas[0].Include_ACAD_CAREER);
                            $('#ddlDegree').closest('.custom-combobox').find('.combobox-label').html($('#ddlDegree option[value='+datas[0].Include_ACAD_CAREER+']').html());
                            $('#ddlDegree').change(function(){
                                 psx.loadCampus();
                                 psx.loadPeriod();
                            });
                        }
                    });
                    $("#ddlCampus").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderCampus').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getCampus",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Include_INSTITUTION,
                                AcademicCareer:datas[0].Include_ACAD_CAREER
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
                            if(datas[0].CAMPUSInclude!="")
                            $("#ddlCampus").multiselect('select',datas[0].CAMPUSInclude.split(","));
                            $('#ddlCampus').change(function(){
                                psx.loadFaculty();
                            });
                        }
                    });
                    $("#ddlPeriod").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderPeriod').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getPeriod",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Include_INSTITUTION,
                                AcademicCareer:datas[0].Include_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSInclude=="")?"":datas[0].CAMPUSInclude.split(",")
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
                            $("#ddlPariod").val(datas[0].Include_STRM);
                            $('#ddlPeriod').closest('.custom-combobox').find('.combobox-label').html($('#ddlPeriod option[value='+datas[0].Include_STRM+']').html());
                            $('#ddlPeriod').change(function(){
                               psx.loadFaculty();
                            });
                        }
                    });
                    $("#ddlFaculty").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderFaculty').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getFaculty",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Include_INSTITUTION,
                                AcademicCareer:datas[0].Include_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSInclude=="")?"":datas[0].CAMPUSInclude.split(","),
                                Term:datas[0].Include_STRM
                            }),
                        success: function(data){
                            $('#loaderFaculty').hide();
                            $('#ddlFaculty').empty();
                                option = "<option value = ''>All</option>";
                                $("#ddlFaculty").append(option);
                            if(data.length) {
                                for(i=0 ; i < data.length ; i++){
                                    option = "<option value='"+data[i].ACAD_ORG+"'>"+data[i].DESCR+"</option>";
                                    $("#ddlFaculty").append(option);
                                }
                            } else {
                            }
                            $("#ddlFaculty").closest(".custom-combobox").find(".combobox-label").remove();
                            $("#ddlFaculty").closest(".custom-combobox").data("has-init","no").binus_combobox();
                            $('#ddlFaculty').closest('.custom-combobox').find('.combobox-label').html($('#ddlFaculty option[value='+datas[0].Include_ACAD_ORG+']').html());
                            $("#ddlFaculty").val(datas[0].Include_ACAD_ORG);
                            $('#ddlFaculty').change(function(){
                              psx.loadCourseAttribute();
                              psx.loadJurusan();
                            });
                        }
                    });
                    $("#ddlCourseAttribute").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderCourseAttribute').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAllCourseType",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Include_INSTITUTION,
                                AcademicCareer:datas[0].Include_ACAD_CAREER,
                                ACAD_ORG:datas[0].Include_ACAD_ORG,
                                Term:datas[0].Include_STRM
                            }),
                        success: function(data){
                            $('#loaderCourseAttribute').hide();
                            $('#ddlCourseAttribute').empty();
                                option = "<option value = ''>All</option>";
                                $("#ddlCourseAttribute").append(option);
                            if(data.length) {
                                for(i=0 ; i < data.length ; i++){
                                    option = "<option value='"+data[i].CRSE_ATTR+"'>"+data[i].CRSE_DESCR+"</option>";
                                    $("#ddlCourseAttribute").append(option);
                                }
                            } else {
                            }
                            $("#ddlCourseAttribute").closest(".custom-combobox").find(".combobox-label").remove();
                            $("#ddlCourseAttribute").closest(".custom-combobox").data("has-init","no").binus_combobox();
                            $('#ddlCourseAttribute').closest('.custom-combobox').find('.combobox-label').html($('#ddlCourseAttribute option[value='+datas[0].Include_CRSE_ATTR+']').html());
                            $("#ddlCourseAttribute").val(datas[0].Include_CRSE_ATTR);
                            $('#ddlCourseAttribute').change(function(){
                                psx.loadCourse();
                            });
                        }
                    });
                    $("#ddlJurusan").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderJurusan').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getJurusan",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Include_INSTITUTION,
                                AcademicCareer:datas[0].Include_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSInclude=="")?"":datas[0].CAMPUSInclude.split(","),
                                Faculty:datas[0].Include_ACAD_ORG,
                                Term:datas[0].Include_STRM
                            }),
                        success: function(data){
                            $('#ddlJurusan').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true,enableFiltering: true,enableCaseInsensitiveFiltering: true});
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
                                d.push({label:data[i].DESCR, value:data[i].Jurusan});

                            $('#ddlJurusan').multiselect('dataprovider', d);
                            if(datas[0].ACAD_PROGInclude!="")
                            $("#ddlJurusan").multiselect('select',datas[0].ACAD_PROGInclude.split(","));
                            $('#ddlJurusan').change(function(){
                              psx.loadBinusian();
                            });
                        }
                    });
                    $("#ddlBinusian").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderBinusian').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAllBinusian",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Include_INSTITUTION,
                                AcademicCareer:datas[0].Include_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSInclude=="")?"":datas[0].CAMPUSInclude.split(","),
                                ACAD_ORG:datas[0].Include_ACAD_ORG,
                                ACAD_PROG:(datas[0].ACAD_PROGInclude=="")?"":datas[0].ACAD_PROGInclude.split(","),
                                Term:datas[0].Include_STRM
                            }),
                        success: function(data){
                            $('#ddlBinusian').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
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
                                d.push({label:data[i].YEAR_DESCR, value:data[i].ACAD_YEAR});

                            $('#ddlBinusian').multiselect('dataprovider', d);
                            if(datas[0].ACAD_YEARInclude!="")
                            $("#ddlBinusian").multiselect('select',datas[0].ACAD_YEARInclude.split(","));
                        }
                    });
                    $("#ddlCourses").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderCourses').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAllCourseByAcad_Career_Faculty",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Include_INSTITUTION,
                                AcademicCareer:datas[0].Include_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSInclude=="")?"":datas[0].CAMPUSInclude.split(","),
                                Faculty:datas[0].Include_ACAD_ORG,
                                Term:datas[0].Include_STRM,
                                CRSE_ATTR:datas[0].Include_CRSE_ATTR
                            }),
                        success: function(data){
                            $('#ddlCourses').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true,enableFiltering: true,enableCaseInsensitiveFiltering: true});
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
                            if(datas[0].CRSE_IDInclude!="")
                            $("#ddlCourses").multiselect('select',datas[0].CRSE_IDInclude.split(","));
                        }
                    });
                    $("#ddlAcademicInstitutionExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderInstitutionExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAcademicInstitutionJSON",
                        type: "POST",
                        success: function(data){
                            $('#loaderInstitutionExclude').hide();
                            $('#ddlAcademicInstitutionExclude').empty();
                                option = "<option value = ''>Disable</option>";
                                $("#ddlAcademicInstitutionExclude").append(option);
                            if(data.length) {
                                for(i=0 ; i < data.length ; i++){
                                    option = "<option value='"+data[i].AcademicInstitution+"'>"+data[i].Description+"</option>";
                                    $("#ddlAcademicInstitutionExclude").append(option);
                                }
                            } else {
                                option = "<option value = ''>Disable</option>";
                                $("#ddlAcademicInstitutionExclude").append(option);
                            }
                            $("#ddlAcademicInstitutionExclude").closest(".custom-combobox").find(".combobox-label").remove();
                            $("#ddlAcademicInstitutionExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                            $('#ddlAcademicInstitutionExclude').closest('.custom-combobox').find('.combobox-label').html($('#ddlAcademicInstitutionExclude option[value='+datas[0].Exclude_INSTITUTION+']').html());
                            $("#ddlAcademicInstitutionExclude").val(datas[0].Exclude_INSTITUTION);
                            $('#ddlAcademicInstitutionExclude').change(function(){
                                psx.loadDegreeExclude();
                            });
                        }
                    });
                    $("#ddlDegreeExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderDegreeExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAcademicCareer",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Exclude_INSTITUTION
                            }),
                        success: function(data){
                            $('#loaderDegreeExclude').hide();
                            $('#ddlDegreeExclude').empty();
                            if(data.length) {
                                for(i=0 ; i < data.length ; i++){
                                    option = "<option value='"+data[i].Acad_Career+"'>"+data[i].Descr+"</option>";
                                    $("#ddlDegreeExclude").append(option);
                                }
                            } else {
                                option = "<option value = ''>Disable</option>";
                                $("#ddlDegreeExclude").append(option);
                            }
                            $("#ddlDegreeExclude").closest(".custom-combobox").find(".combobox-label").remove();
                            $("#ddlDegreeExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                            $("#ddlDegreeExclude").val(datas[0].Exclude_ACAD_CAREER);
                            $('#ddlDegreeExclude').closest('.custom-combobox').find('.combobox-label').html($('#ddlDegreeExclude option[value='+datas[0].Exclude_ACAD_CAREER+']').html());
                            $('#ddlDegreeExclude').change(function(){
                               psx.loadCampusExclude();
                               psx.loadPeriodExclude();
                            });
                        }
                    });
                    $("#ddlCampusExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderCampusExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getCampus",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Exclude_INSTITUTION,
                                AcademicCareer:datas[0].Exclude_ACAD_CAREER
                            }),
                        success: function(data){
                               $('#ddlCampusExclude').multiselect();
                                $('.multiselect-container').css('z-index', '2');

                                $('.btn-group').click(function(event){
                                    if(!$(this).hasClass('open'))
                                    {
                                        event.stopPropagation();
                                        $(this).openOneCloseAll();
                                    }
                                });
                                $('html').click(function(){
                                $('#ddlCampusExclude').siblings().removeClass('open');
                                 });
                               
                            $('#loaderCampusExclude').hide();
                             var d = [];
                            for(var i = 0; i< data.length; i++)
                                d.push({label:data[i].Descr, value:data[i].Campus});

                            $('#ddlCampusExclude').multiselect('dataprovider', d);
                            if(datas[0].CAMPUSExclude!="")
                            $("#ddlCampusExclude").multiselect('select',datas[0].CAMPUSExclude.split(","));
                               $('#ddlCampusExclude').change(function(){
                                psx.loadFacultyExclude();
                            });
                        }
                    });
                    $("#ddlPeriodExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderPeriodExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getPeriod",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Exclude_INSTITUTION,
                                AcademicCareer:datas[0].Exclude_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSExclude=="")?"":datas[0].CAMPUSExclude.split(",")
                            }),
                        success: function(data){
                            $('#loaderPeriodExclude').hide();
                            $('#ddlPeriodExclude').empty();
                            if(data.length) {
                                for(i=0 ; i < data.length ; i++){
                                    option = "<option value='"+data[i].Waktu+"'>"+data[i].DESCR+"</option>";
                                    $("#ddlPeriodExclude").append(option);
                                }
                            } else {
                                option = "<option value = ''>Disable</option>";
                                $("#ddlPeriodExclude").append(option);
                            }
                            $("#ddlPeriodExclude").closest(".custom-combobox").find(".combobox-label").remove();
                            $("#ddlPeriodExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                            $('#ddlPeriodExclude').closest('.custom-combobox').find('.combobox-label').html($('#ddlPeriodExclude option[value='+datas[0].Exclude_STRM+']').html());
                            $("#ddlPeriodExclude").val(datas[0].Exclude_STRM);
                            $('#ddlPeriodExclude').change(function(){
                               psx.loadFacultyExclude();
                            });
                        }
                    });
                    $("#ddlFacultyExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderFacultyExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getFaculty",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Exclude_INSTITUTION,
                                AcademicCareer:datas[0].Exclude_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSExclude=="")?"":datas[0].CAMPUSExclude.split(","),
                                Term:datas[0].Exclude_STRM
                            }),
                        success: function(data){
                            $('#loaderFacultyExclude').hide();
                            $('#ddlFacultyExclude').empty();
                            if(data.length) {
                                for(i=0 ; i < data.length ; i++){
                                    option = "<option value='"+data[i].ACAD_ORG+"'>"+data[i].DESCR+"</option>";
                                    $("#ddlFacultyExclude").append(option);
                                }
                            } else {
                                option = "<option value = ''>Disable</option>";
                                $("#ddlFacultyExclude").append(option);
                            }
                            $("#ddlFacultyExclude").closest(".custom-combobox").find(".combobox-label").remove();
                            $("#ddlFacultyExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                            $('#ddlFacultyExclude').closest('.custom-combobox').find('.combobox-label').html($('#ddlFacultyExclude option[value='+datas[0].Exclude_ACAD_ORG+']').html());
                            $("#ddlFacultyExclude").val(datas[0].Exclude_ACAD_ORG);
                            $('#ddlFacultyExclude').change(function(){
                              psx.loadCourseAttributeExclude();
                              psx.loadJurusanExclude();
                            });
                        }
                    });
                    $("#ddlCourseAttributeExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderCourseAttributeExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAllCourseType",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Exclude_INSTITUTION,
                                AcademicCareer:datas[0].Exclude_ACAD_CAREER,
                                ACAD_ORG:datas[0].Exclude_ACAD_ORG,
                                Term:datas[0].Exclude_STRM
                            }),
                        success: function(data){
                            $('#loaderCourseAttributeExclude').hide();
                            $('#ddlCourseAttributeExclude').empty();
                            if(data.length) {
                                for(i=0 ; i < data.length ; i++){
                                    option = "<option value='"+data[i].CRSE_ATTR+"'>"+data[i].CRSE_DESCR+"</option>";
                                    $("#ddlCourseAttributeExclude").append(option);
                                }
                            } else {
                                option = "<option value = ''>Disable</option>";
                                $("#ddlCourseAttributeExclude").append(option);
                            }
                            $("#ddlCourseAttributeExclude").closest(".custom-combobox").find(".combobox-label").remove();
                            $("#ddlCourseAttributeExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                            $('#ddlCourseAttributeExclude').closest('.custom-combobox').find('.combobox-label').html($('#ddlCourseAttributeExclude option[value='+datas[0].Exclude_CRSE_ATTR+']').html());
                            $("#ddlCourseAttributeExclude").val(datas[0].Exclude_CRSE_ATTR);
                            $('#ddlCourseAttributeExclude').change(function(){
                                psx.loadCourseExclude();
                            });
                        }
                    });
                    $("#ddlJurusanExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderJurusanExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getJurusan",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Exclude_INSTITUTION,
                                AcademicCareer:datas[0].Exclude_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSExclude=="")?"":datas[0].CAMPUSExclude.split(","),
                                Faculty:datas[0].Exclude_ACAD_ORG,
                                Term:datas[0].Exclude_STRM
                            }),
                        success: function(data){
                            $('#ddlJurusanExclude').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
                                $('.multiselect-container').css('z-index', '2');

                                $('.btn-group').click(function(event){
                                    if(!$(this).hasClass('open'))
                                    {
                                        event.stopPropagation();
                                        $(this).openOneCloseAll();
                                    }
                                });
                                $('html').click(function(){
                                $('#ddlJurusanExclude').siblings().removeClass('open');
                                 });
                               
                            $('#loaderJurusanExclude').hide();
                             var d = [];
                            for(var i = 0; i< data.length; i++)
                                d.push({label:data[i].DESCR, value:data[i].Jurusan});

                            $('#ddlJurusanExclude').multiselect('dataprovider', d);
                            if(datas[0].ACAD_PROGExclude!="")
                            $("#ddlJurusanExclude").multiselect('select',datas[0].ACAD_PROGExclude.split(","));
                            $('#ddlJurusanExclude').change(function(){
                              psx.loadBinusianExclude();
                            });
                        }
                    });
                    $("#ddlBinusianExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderBinusianExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAllBinusian",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Exclude_INSTITUTION,
                                AcademicCareer:datas[0].Exclude_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSExclude=="")?"":datas[0].CAMPUSExclude.split(","),
                                ACAD_ORG:datas[0].Exclude_ACAD_ORG,
                                ACAD_PROG:(datas[0].ACAD_PROGExclude=="")?"":datas[0].ACAD_PROGExclude.split(","),
                                Term:datas[0].Exclude_STRM
                            }),
                        success: function(data){
                            $('#ddlBinusianExclude').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
                                $('.multiselect-container').css('z-index', '2');

                                $('.btn-group').click(function(event){
                                    if(!$(this).hasClass('open'))
                                    {
                                        event.stopPropagation();
                                        $(this).openOneCloseAll();
                                    }
                                });
                                $('html').click(function(){
                                $('#ddlBinusianExclude').siblings().removeClass('open');
                                 });
                               
                            $('#loaderBinusianExclude').hide();
                             var d = [];
                            for(var i = 0; i< data.length; i++)
                                d.push({label:data[i].YEAR_DESCR, value:data[i].ACAD_YEAR});

                            $('#ddlBinusianExclude').multiselect('dataprovider', d);
                            if(datas[0].ACAD_YEARExclude!="")
                            $("#ddlBinusianExclude").multiselect('select',datas[0].ACAD_YEARExclude.split(","));
                        }
                    });
                    $("#ddlSystemExclude ").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderSystemExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAllSystemExclude",
                        type: "POST",
                        data: JSON.stringify({
                            SystemID: BM.filter.SystemID,
                            }),
                        success: function(data){
                            $('#ddlSystemExclude').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
                                $('.multiselect-container').css('z-index', '2');
                                $('.btn-group').click(function(event){
                                    if(!$(this).hasClass('open'))
                                    {
                                        event.stopPropagation();
                                        $(this).openOneCloseAll();
                                    }
                                });
                                $('html').click(function(){
                                $('#ddlSystemExclude').siblings().removeClass('open');
                                 });
                            $('#loaderSystemExclude').hide();
                             var d = [];
                            for(var i = 0; i< data.length; i++)
                                d.push({label:data[i].SystemName, value:data[i].SystemID});
                            $('#ddlSystemExclude').multiselect('dataprovider', d);
                            if(datas[0].SystemExclude!="")
                            $("#ddlSystemExclude").multiselect('select',datas[0].SystemExclude.split(","));
                        }
                    });
                    $("#ddlCoursesExclude ").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderCoursesExclude').show();
                    BM.ajax({
                        url : BM.serviceUri + "General_Head_Prefect/getAllCourseByAcad_Career_Faculty",
                        type: "POST",
                        data: JSON.stringify({
                                Institution:datas[0].Exclude_INSTITUTION,
                                AcademicCareer:datas[0].Exclude_ACAD_CAREER,
                                Campus:(datas[0].CAMPUSExclude=="")?"":datas[0].CAMPUSExclude.split(","),
                                Faculty:datas[0].Exclude_ACAD_ORG,
                                Term:datas[0].Exclude_STRM,
                                CRSE_ATTR:datas[0].Exclude_CRSE_ATTR
                            }),
                        success: function(data){
                            $('#ddlCoursesExclude').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
                                $('.multiselect-container').css('z-index', '2');
                                $('.btn-group').click(function(event){
                                    if(!$(this).hasClass('open'))
                                    {
                                        event.stopPropagation();
                                        $(this).openOneCloseAll();
                                    }
                                });
                                $('html').click(function(){
                                $('#ddlCoursesExclude').siblings().removeClass('open');
                                 });
                            $('#loaderCoursesExclude').hide();
                             var d = [];
                            for(var i = 0; i< data.length; i++)
                                d.push({label:data[i].CRSE_DESCR, value:data[i].CRSE_ID});
                            $('#ddlCoursesExclude').multiselect('dataprovider', d);
                            if(datas[0].CRSE_IDExclude !="")
                            $("#ddlCoursesExclude").multiselect('select',datas[0].CRSE_IDExclude.split(","));
                        }
                    });
                    $("#ddlSATExclude ").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $("#ddlSAT ").empty().closest('.custom-combobox').find('.combobox-label').remove();
                    $('#loaderSATExclude').show();
                    $('#loaderSAT').show();
                    
                    $('#loaderSATExclude').hide();
                    $('#loaderSAT').hide();
                    $('#ddlSATExclude').empty();
                    $('#ddlSAT').empty();
                    option = "<option value = ''>Not Fulfilled</option>";
                        $("#ddlSAT").append(option);
                        $("#ddlSATExclude").append(option);
                    option = "<option value = '1'>Fulfilled</option>";
                        $("#ddlSAT").append(option);
                        $("#ddlSATExclude").append(option);
                        $('#ddlSATExclude').closest('.custom-combobox').find('.combobox-label').html($('#ddlSATExclude option[value='+datas[0].Exclude_StatusSAT+']').html());
                            $("#ddlSATExclude").val(datas[0].Exclude_StatusSAT);
                        $('#ddlSAT').closest('.custom-combobox').find('.combobox-label').html($('#ddlSAT option[value='+datas[0].Exclude_StatusSAT+']').html());
                            $("#ddlSAT").val(datas[0].Exclude_StatusSAT);
                    //  setTimeout(function(){
                    //     $("#ddlAcademicInstitution").val(data[0].Include_INSTITUTION);
                    //     $("#ddlAcademicInstitution").closest("span.custom-combobox").children(".combobox-label").remove();
                    //     $("#ddlAcademicInstitution").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //     $("#ddlAcademicInstitution").trigger("change");

                    //     setTimeout(function(){
                    //         $("#ddlDegree").val(data[0].Include_ACAD_CAREER);
                    //         $("#ddlDegree").closest("span.custom-combobox").children(".combobox-label").remove();
                    //         $("#ddlDegree").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //         $("#ddlDegree").trigger("change");
                            
                    //         setTimeout(function(){
                    //             $("#ddlCampus").multiselect('select',data[0].CAMPUSInclude.split(","));
                    //             // $("#ddlCampus").closest("span.custom-combobox").children(".combobox-label").remove();
                    //             // $("#ddlCampus").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //             $("#ddlCampus").multiselect("refresh");
                                
                    //             setTimeout(function(){
                    //                 $("#ddlPeriod").val(data[0].Include_STRM);
                    //                 $("#ddlPeriod").closest("span.custom-combobox").children(".combobox-label").remove();
                    //                 $("#ddlPeriod").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //                 $("#ddlPeriod").trigger("change");

                    //                 setTimeout(function(){
                    //                     $("#ddlFaculty").val(data[0].Include_ACAD_ORG);
                    //                     $("#ddlFaculty").closest("span.custom-combobox").children(".combobox-label").remove();
                    //                     $("#ddlFaculty").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //                     $("#ddlFaculty").trigger("change");
                                    
                    //                     setTimeout(function(){
                    //                         $("#ddlJurusan").multiselect('select',data[0].ACAD_PROGInclude.split(","));
                    //                         // $("#ddlJurusan").closest("span.custom-combobox").children(".combobox-label").remove();
                    //                         // $("#ddlJurusan").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //                         $("#ddlJurusan").multiselect("refresh");
                                       
                    //                         setTimeout(function(){
                    //                             $("#ddlBinusian").multiselect('select',data[0].ACAD_YEARInclude.split(","));
                    //                             // $("#ddlBinusian").closest("span.custom-combobox").children(".combobox-label").remove();
                    //                             // $("#ddlBinusian").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //                             $("#ddlBinusian").multiselect("refresh");

                    //                             setTimeout(function(){
                    //                                 $("#ddlSAT").val(data[0].Include_StatusSAT);
                    //                                 $("#ddlSAT").closest("span.custom-combobox").children(".combobox-label").remove();
                    //                                 $("#ddlSAT").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //                                 $("#ddlSAT").trigger("change");

                    //                                 setTimeout(function(){
                    //                                     $("#ddlCourseAttribute").val(data[0].Include_CRSE_ATTR);
                    //                                     $("#ddlCourseAttribute").closest("span.custom-combobox").children(".combobox-label").remove();
                    //                                     $("#ddlCourseAttribute").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //                                     $("#ddlCourseAttribute").trigger("change");
                                                        
                    //                                      setTimeout(function(){
                    //                                         $("#ddlCourses").multiselect('select',data[0].CRSE_IDInclude.split(","));
                    //                                         // $("#ddlCourses").closest("span.custom-combobox").children(".combobox-label").remove();
                    //                                         // $("#ddlCourses").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //                                         $("#ddlCourses").multiselect("refresh");

                    //                                         setTimeout(function(){
                    //                                             // $("#ddlValidateStatus").val(data[0].ValidateStatus);
                    //                                             // $("#ddlValidateStatus").closest("span.custom-combobox").children(".combobox-label").remove();
                    //                                             // $("#ddlValidateStatus").closest("span.custom-combobox").data('has-init','no').binus_combobox();
                    //                                         }, 5000);
                    //                                     }, 5000);
                    //                                 }, 5000);
                    //                             }, 5000);
                    //                         }, 5000);
                    //                     }, 11000);
                    //                 }, 5000);
                    //             }, 5000);
                    //         }, 5000);
                    //     }, 5000);
                    // }, 2000);
                }

                $('select').attr('disabled',false);
               
                }
            });
        }
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
                    psx.loadDegree();
                });
                psx.loadDegree();
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
                   psx.loadCampus();
                   psx.loadPeriod();
                });
                psx.loadCampus();
                psx.loadPeriod();
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
                    psx.loadFaculty();
                });
                psx.loadFaculty();
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
                   psx.loadFaculty();
                });
               psx.loadFaculty();
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
                    option = "<option value = ''>All</option>";
                    $("#ddlFaculty").append(option);
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].ACAD_ORG+"'>"+data[i].DESCR+"</option>";
                        $("#ddlFaculty").append(option);
                    }
                } else {
                }
                $("#ddlFaculty").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlFaculty").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlFaculty').change(function(){
                  psx.loadCourseAttribute();
                  psx.loadJurusan();
                });
                psx.loadCourseAttribute();
                  psx.loadJurusan();
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
                    option = "<option value = ''>All</option>";
                    $("#ddlCourseAttribute").append(option);
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].CRSE_ATTR+"'>"+data[i].CRSE_DESCR+"</option>";
                        $("#ddlCourseAttribute").append(option);
                    }
                } else {
                }
                $("#ddlCourseAttribute").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlCourseAttribute").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlCourseAttribute').change(function(){
                    psx.loadCourse();
                });
               
                psx.loadCourse();
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
                $('#ddlJurusan').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
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
                    d.push({label:data[i].DESCR, value:data[i].Jurusan});

                $('#ddlJurusan').multiselect('dataprovider', d);
                $('#ddlJurusan').change(function(){
                  psx.loadBinusian();
                });
                psx.loadBinusian();
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
                    ACAD_ORG:$("#ddlFaculty").val(),
                    ACAD_PROG:$("#ddlJurusan").val(),
                    Term:$("#ddlPeriod").val()
                }),
            success: function(data){
                $('#ddlBinusian').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
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
                    d.push({label:data[i].YEAR_DESCR, value:data[i].ACAD_YEAR});

                $('#ddlBinusian').multiselect('dataprovider', d);
                $('#ddlBinusian').change(function(){
                  //psx.loadCourseAttribute();
                });
                //psx.loadCourseAttribute();
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
                $('#ddlCourses').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
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
                  //psx.loadCourseAttribute();
                });
                //psx.loadCourseAttribute();
            }
        });
    },
    loadInstitutionExclude : function() {
        $("#ddlAcademicInstitutionExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderInstitutionExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAcademicInstitutionJSON",
            type: "POST",
            success: function(data){
                $('#loaderInstitutionExclude').hide();
                $('#ddlAcademicInstitutionExclude').empty();
                    option = "<option value = ''>Disable</option>";
                    $("#ddlAcademicInstitutionExclude").append(option);
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].AcademicInstitution+"'>"+data[i].Description+"</option>";
                        $("#ddlAcademicInstitutionExclude").append(option);
                    }
                } else {
                    option = "<option value = ''>Disable</option>";
                    $("#ddlAcademicInstitutionExclude").append(option);
                }
                $("#ddlAcademicInstitutionExclude").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlAcademicInstitutionExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlAcademicInstitutionExclude').change(function(){
                    psx.loadDegreeExclude();
                });
                psx.loadDegreeExclude();
            }
        });
    },
    loadDegreeExclude : function() {
        $("#ddlDegreeExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderDegreeExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAcademicCareer",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitutionExclude").val()
                }),
            success: function(data){
                $('#loaderDegreeExclude').hide();
                $('#ddlDegreeExclude').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].Acad_Career+"'>"+data[i].Descr+"</option>";
                        $("#ddlDegreeExclude").append(option);
                    }
                } else {
                    option = "<option value = ''>Disable</option>";
                    $("#ddlDegreeExclude").append(option);
                }
                $("#ddlDegreeExclude").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlDegreeExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlDegreeExclude').change(function(){
                   psx.loadCampusExclude();
                   psx.loadPeriodExclude();
                });
                psx.loadCampusExclude();
                psx.loadPeriodExclude();
            }
        });
    },
    loadCampusExclude : function() {
        $("#ddlCampusExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCampusExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getCampus",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitutionExclude").val(),
                    AcademicCareer:$("#ddlDegreeExclude").val()
                }),
            success: function(data){
                   $('#ddlCampusExclude').multiselect();
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlCampusExclude').siblings().removeClass('open');
                     });
                   
                $('#loaderCampusExclude').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].Descr, value:data[i].Campus});

                $('#ddlCampusExclude').multiselect('dataprovider', d);
                   $('#ddlCampusExclude').change(function(){
                    psx.loadFacultyExclude();
                });
                psx.loadFacultyExclude();
            }
        });
    },
    loadPeriodExclude : function() {
        $("#ddlPeriodExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriodExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getPeriod",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitutionExclude").val(),
                    AcademicCareer:$("#ddlDegreeExclude").val(),
                    Campus:$("#ddlCampusExclude").val()
                }),
            success: function(data){
                $('#loaderPeriodExclude').hide();
                $('#ddlPeriodExclude').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].Waktu+"'>"+data[i].DESCR+"</option>";
                        $("#ddlPeriodExclude").append(option);
                    }
                } else {
                    option = "<option value = ''>Disable</option>";
                    $("#ddlPeriodExclude").append(option);
                }
                $("#ddlPeriodExclude").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlPeriodExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlPeriodExclude').change(function(){
                   psx.loadFacultyExclude();
                });
               psx.loadFacultyExclude();
            }
        });
    },
    loadFacultyExclude : function() {
        $("#ddlFacultyExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderFacultyExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getFaculty",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitutionExclude").val(),
                    AcademicCareer:$("#ddlDegreeExclude").val(),
                    Campus:$("#ddlCampusExclude").val(),
                    Term:$("#ddlPeriodExclude").val()
                }),
            success: function(data){
                $('#loaderFacultyExclude').hide();
                $('#ddlFacultyExclude').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].ACAD_ORG+"'>"+data[i].DESCR+"</option>";
                        $("#ddlFacultyExclude").append(option);
                    }
                } else {
                    option = "<option value = ''>Disable</option>";
                    $("#ddlFacultyExclude").append(option);
                }
                $("#ddlFacultyExclude").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlFacultyExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlFacultyExclude').change(function(){
                  psx.loadCourseAttributeExclude();
                  psx.loadJurusanExclude();
                });
                psx.loadCourseAttributeExclude();
                  psx.loadJurusanExclude();
            }
        });
    },
    loadCourseAttributeExclude : function() {
        $("#ddlCourseAttributeExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCourseAttributeExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllCourseType",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitutionExclude").val(),
                    AcademicCareer:$("#ddlDegreeExclude").val(),
                    ACAD_ORG:$("#ddlFacultyExclude").val(),
                    Term:$("#ddlPeriodExclude").val()
                }),
            success: function(data){
                $('#loaderCourseAttributeExclude').hide();
                $('#ddlCourseAttributeExclude').empty();
                if(data.length) {
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].CRSE_ATTR+"'>"+data[i].CRSE_DESCR+"</option>";
                        $("#ddlCourseAttributeExclude").append(option);
                    }
                } else {
                    option = "<option value = ''>Disable</option>";
                    $("#ddlCourseAttributeExclude").append(option);
                }
                $("#ddlCourseAttributeExclude").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlCourseAttributeExclude").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlCourseAttributeExclude').change(function(){
                    psx.loadCourseExclude();
                });
                psx.loadCourseExclude();
            }
        });
    },
    loadJurusanExclude : function() {
        $("#ddlJurusanExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderJurusanExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getJurusan",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitutionExclude").val(),
                    AcademicCareer:$("#ddlDegreeExclude").val(),
                    Campus:$("#ddlCampusExclude").val(),
                    Faculty:$("#ddlFacultyExclude").val(),
                    Term:$("#ddlPeriodExclude").val()
                }),
            success: function(data){
                $('#ddlJurusanExclude').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlJurusanExclude').siblings().removeClass('open');
                     });
                   
                $('#loaderJurusanExclude').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].DESCR, value:data[i].Jurusan});

                $('#ddlJurusanExclude').multiselect('dataprovider', d);
                $('#ddlJurusanExclude').change(function(){
                  psx.loadBinusianExclude();
                });
                psx.loadBinusianExclude();
            }
        });
    },
    loadBinusianExclude : function() {
        $("#ddlBinusianExclude").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderBinusianExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllBinusian",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitutionExclude").val(),
                    AcademicCareer:$("#ddlDegreeExclude").val(),
                    Campus:$("#ddlCampusExclude").val(),
                    ACAD_ORG:$("#ddlFacultyExclude").val(),
                    ACAD_PROG:$("#ddlJurusanExclude").val(),
                    Term:$("#ddlPeriodExclude").val()
                }),
            success: function(data){
                $('#ddlBinusianExclude').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlBinusianExclude').siblings().removeClass('open');
                     });
                   
                $('#loaderBinusianExclude').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].YEAR_DESCR, value:data[i].ACAD_YEAR});

                $('#ddlBinusianExclude').multiselect('dataprovider', d);
                $('#ddlBinusianExclude').change(function(){
                  //psx.loadCourseAttribute();
                });
                //psx.loadCourseAttribute();
            }
        });
    },
    loadSystemExclude : function() {
        $("#ddlSystemExclude ").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderSystemExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllSystemExclude",
            type: "POST",
            data: JSON.stringify({
                SystemID: BM.filter.SystemID,
                }),
            success: function(data){
                $('#ddlSystemExclude').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
                    $('.multiselect-container').css('z-index', '2');
                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlSystemExclude').siblings().removeClass('open');
                     });
                   
                $('#loaderSystemExclude').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].SystemName, value:data[i].SystemID});

                $('#ddlSystemExclude').multiselect('dataprovider', d);
               
                $('#ddlSystemExclude').change(function(){
                  //psx.loadCourseAttribute();
                });
                //psx.loadCourseAttribute();
            }
        });
    },
    loadCourseExclude : function() {
        $("#ddlCoursesExclude ").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderCoursesExclude').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllCourseByAcad_Career_Faculty",
            type: "POST",
            data: JSON.stringify({
                    Institution:$("#ddlAcademicInstitutionExclude").val(),
                    AcademicCareer:$("#ddlDegreeExclude").val(),
                    Campus:$("#ddlCampusExclude").val(),
                    Faculty:$("#ddlFacultyExclude").val(),
                    Term:$("#ddlPeriodExclude").val(),
                    CRSE_ATTR:$("#ddlCourseAttributeExclude").val()
                }),
            success: function(data){
                $('#ddlCoursesExclude').multiselect({allSelectedText: 'Select All',includeSelectAllOption: true});
                    $('.multiselect-container').css('z-index', '2');

                    $('.btn-group').click(function(event){
                        if(!$(this).hasClass('open'))
                        {
                            event.stopPropagation();
                            $(this).openOneCloseAll();
                        }
                    });
                    $('html').click(function(){
                    $('#ddlCoursesExclude').siblings().removeClass('open');
                     });
                   
                $('#loaderCoursesExclude').hide();
                 var d = [];
                for(var i = 0; i< data.length; i++)
                    d.push({label:data[i].CRSE_DESCR, value:data[i].CRSE_ID});

                $('#ddlCoursesExclude').multiselect('dataprovider', d);
               
                $('#ddlCoursesExclude').change(function(){
                  //psx.loadCourseAttribute();
                });
                //psx.loadCourseAttribute();
            }
        });
    },
    loadSAT : function() {
        $("#ddlSATExclude ").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $("#ddlSAT ").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderSATExclude').show();
        $('#loaderSAT').show();
        
        $('#loaderSATExclude').hide();
        $('#loaderSAT').hide();
        $('#ddlSATExclude').empty();
        $('#ddlSAT').empty();
        option = "<option value = ''>Not Fulfilled</option>";
            $("#ddlSAT").append(option);
            $("#ddlSATExclude").append(option);
        option = "<option value = '1'>Fulfilled</option>";
            $("#ddlSAT").append(option);
            $("#ddlSATExclude").append(option);
    },
    init: function() {
        var psx = this;
        psx.loadInstitution();
        psx.loadInstitutionExclude();
        psx.loadSAT();
        psx.loadSystemExclude();
        $('#btnAddParticipant').click(function(event){
            var requestFormData ={
                Include_INSTITUTION: $('#ddlAcademicInstitution option:selected').val(),
                Include_ACAD_CAREER: $('#ddlDegree option:selected').val(),
                Include_CAMPUS: ($("#ddlCampus").closest("span").find(".multiselect-selected-text").html().includes("Select All") == true || $('#ddlCampus ').val() == null )?"":$('#ddlCampus ').val(),
                Include_STRM: $('#ddlPeriod option:selected').val(),
                Include_ACAD_ORG: $('#ddlFaculty option:selected').val(),
                Include_ACAD_PROG: ($("#ddlJurusan").closest("span").find(".multiselect-selected-text").html().includes("Select All") == true || $('#ddlJurusan ').val() == null)?"":$('#ddlJurusan ').val(),
                Include_ACAD_YEAR: ($("#ddlBinusian").closest("span").find(".multiselect-selected-text").html().includes("Select All") == true || $('#ddlBinusian ').val() == null)?"":$('#ddlBinusian ').val(),
                Include_StatusSAT: $('#ddlSAT option:selected').val(),
                Include_CRSE_ATTR: $('#ddlCourseAttribute option:selected').val(),
                Include_CRSE_ID: ($("#ddlCourses").closest("span").find(".multiselect-selected-text").html().includes("Select All") == true || $('#ddlCourses ').val() == null)?"":$('#ddlCourses ').val(),
                Exclude_INSTITUTION: $('#ddlAcademicInstitutionExclude option:selected').val(),
                Exclude_ACAD_CAREER: $('#ddlDegreeExclude option:selected').val(),
                Exclude_CAMPUS: ($("#ddlCampusExclude").closest("span").find(".multiselect-selected-text").html().includes("Select All") == true || $('#ddlCampusExclude ').val() == null)?"":$('#ddlCampusExclude ').val(),
                Exclude_STRM: $('#ddlPeriodExclude option:selected').val(),
                Exclude_ACAD_ORG: $('#ddlFacultyExclude option:selected').val(),
                Exclude_ACAD_PROG: ($("#ddlJurusanExclude").closest("span").find(".multiselect-selected-text").html().includes("Select All") == true || $('#ddlJurusanExclude ').val() == null)?"":$('#ddlJurusanExclude ').val(),
                Exclude_ACAD_YEAR: ($("#ddlBinusianExclude").closest("span").find(".multiselect-selected-text").html().includes("Select All") == true || $('#ddlBinusianExclude ').val() == null)?"":$('#ddlBinusianExclude ').val(),
                Exclude_StatusSAT: $('#ddlSATExclude option:selected').val(),
                Exclude_CRSE_ATTR: $('#ddlCourseAttributeExclude option:selected').val(),
                Exclude_CRSE_ID: ($("#ddlCoursesExclude").closest("span").find(".multiselect-selected-text").html().includes("Select All") == true || $('#ddlCoursesExclude ').val() == null)?"":$('#ddlCoursesExclude ').val(),
                Exclude_System: ($("#ddlSystemExclude").closest("span").find(".multiselect-selected-text").html().includes("Select All") == true || $('#ddlSystemExclude ').val() == null)?"":$('#ddlSystemExclude ').val(),
                ParticipantGroupID: BM.filter.ParticipantGroupID,
                ParticipantID : (BM.filter.ParticipantID != undefined)?BM.filter.ParticipantID:""
            };
            BM.ajax({
            url: BM.serviceUri + "General_Head_Prefect/saveParticipant",
            data: JSON.stringify(requestFormData),
            type: "POST",
            async: false,
            dataType: "json",
            success: function(data) {
                alert("data saved");
                psx.parent.loadDataTable(BM.filter.SystemID, BM.filter.ParticipantGroupID,BM.filter.ParticipantGroupName);
                $.fancybox.close();
                }
            });
        });
    }
};