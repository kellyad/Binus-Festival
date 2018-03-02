var sx, prms = '';
var tempDetail = [];
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
    onLoaded: function(arg)
    {
        $('.iLoadingPopup').html($('<img alt="" />').attr('src', BM.baseUri + 'staff/images/loading.gif'));
        sx = this;
        prms = BM.popupparam;
        sx.init();
        $('#btnAddPopUp').click(function () {
                    
                    $('.failed').hide();
                    var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                    $('.iOption', c).append('<a class="icon icon-trash"  style="cursor:pointer;"></a>');
                    $('#tableOfficialNotesPopUp tbody').append(c);
                    var d = $('#formparticipant .custom-combobox').clone();
                    $('.iPeriod ', c).append('<span id="ddlPeriodPopUp" data="'+$('#ddlPeriodPopUp option:selected').val()+'">'+$('#ddlPeriodPopUp option:selected').html()+'</span>');
                    $('.iOption .icon-trash').click(function(e){
                        e.preventDefault();
                //      if ($('tbody').find('.dataPopUp').length == 1)
                   //      {
                   //       $('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
                            // $('.failed').show();
                   //      }
                   //      else if($('.iOrderBy').find('.txtOrderBy').attr('kdOrderBy') == null)
                   //      {
                   //       $(this).closest('tr').remove();
                   //      }
                        //$(this).closest('tr').remove();
                        if ($('tbody').find('.dataPopUp').length == 1)
                        {
                            $('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
                            $('.failed').show();
                        }
                        else if($(".iPeriod", $(this).closest("tr")).find('.txtPeriod').attr('kdPeriod') == null)
                        {
                            $(this).closest('tr').remove();
                        }
                    });


                    $('.txtInstitution').keyup(function(key) {
                        this.value = this.value.toUpperCase();
                    });
                   
                    
                    
                    flag=1;
                });
        
        if (typeof BM.headPrefectConfiguration != "undefined") {
            sx.initFilter(BM.headPrefectConfiguration);
        }
        // if (prms.action != 'create') {
        //     sx.setSingleData(prms.key);
        //     if (prms.action == "view") {
        //         $('#ddlPopupAcademicInstitution').siblings('.combobox-label').text($('#ddlPopupAcademicInstitution option:selected').text());
        //         $('#ddlPopupAcademicInstitution').parent().css('background-color', '#E7E7E7');
        //         $('#ddlPopupCampus').siblings('.combobox-label').text($('#ddlPopupCampus option:selected').text());
        //         $('#ddlPopupCampus').parent().css('background-color', '#E7E7E7');
        //         $('#ddlPopupDegreeByID').siblings('.combobox-label').text($('#ddlPopupDegreeByID option:selected').text());
        //         $('#ddlPopupDegreeByID').parent().css('background-color', '#E7E7E7');
        //         $('#ddlPopupPeriod').siblings('.combobox-label').text($('#ddlPopupPeriod option:selected').text());
        //         $('#ddlPopupPeriod').parent().css('background-color', '#E7E7E7');
        //         $('#ddlPopupGroup').siblings('.combobox-label').text($('#ddlPopupGroup option:selected').text());
        //         $('#ddlPopupGroup').parent().css('background-color', '#E7E7E7');
        //         $("#ddlPopupAcademicInstitution").attr('disabled', 'disabled');
        //         $('#ddlPopupAcademicInstitution').parent().css('background-color', '#E7E7E7');
        //         $("#ddlPopupCampus").attr('disabled', 'disabled');
        //         $('#ddlPopupCampus').parent().css('background-color', '#E7E7E7');
        //         $("#ddlPopupDegreeByID").attr('disabled', 'disabled');
        //         $('#ddlPopupDegreeByID').parent().css('background-color', '#E7E7E7');
        //         $("#ddlPopupPeriod").attr('disabled', 'disabled');
        //         $('#ddlPopupPeriod').parent().css('background-color', '#E7E7E7');
        //         $("#ddlPopupGroup").attr('disabled', 'disabled');
        //         $('#ddlPopupGroup').parent().css('background-color', '#E7E7E7');
        //         $("#ddlClassType").attr('disabled', 'disabled');
        //         $('#ddlClassType').parent().css('background-color', '#E7E7E7');
        //         $("#startDate").attr('disabled', 'disabled');
        //         $("#endDate").attr('disabled', 'disabled');
        //         $('#allOrg').attr('disabled', 'disabled');
        //         $('#allMandatory').attr('disabled', 'disabled');
        //         $('input[name=cbOrg]').attr('disabled', 'disabled');
        //         $('input[name=cbCourse]').attr('disabled', 'disabled');
        //         $('input[name=cbClass]').attr('disabled', 'disabled');
        //         $('input[name=cbMandatory]').attr('disabled', 'disabled');
        //         $("#submit").hide();
        //     }
        // }
    },
    loadPeriod : function() {
        $("#ddlPeriodPopUp").empty().closest('.custom-combobox').find('.combobox-label').remove();
        $('#loaderPeriodPopUp').show();
        BM.ajax({
            url : BM.serviceUri + "General_Head_Prefect/getAllSystemPeriod",
            type: "POST",
            data: JSON.stringify({
                }),
            success: function(data){
                $('#loaderPeriodPopUp').hide();
                $('#ddlPeriodPopUp').empty();
                if(data.length) {
                    tempData = data;
                    for(i=0 ; i < data.length ; i++){
                        option = "<option value='"+data[i].STRM+"'>"+data[i].DESCR+"</option>";
                        $("#ddlPeriodPopUp").append(option);
                    }
                } else {
                    option = "<option value = ''>All</option>";
                    $("#ddlPeriodPopUp").append(option);
                }
                $("#ddlPeriodPopUp").closest(".custom-combobox").find(".combobox-label").remove();
                $("#ddlPeriodPopUp").closest(".custom-combobox").data("has-init","no").binus_combobox();
                $('#ddlPeriodPopUp').change(function(){
                   sx.loadInit();
                });
               sx.loadInit();
            }
        });
    },
    loadInit: function() {
        var sx = this;
        BM.ajax({
            url : BM.serviceUri + "staff/HeadPrefect_Configuration/getSystemConfiguration",
            type: "POST",
            data: JSON.stringify({ Period: $('#ddlPeriodPopUp option:selected').val() }),
            success: function(data){
                $.each(data, function(a, e) {
                    var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                    $('.iOption', c).append('<a target="_blank" href="'+BM.baseUri+"newstaff/#/event/binusfestival/konfigurasiGroupPeserta."+e.SystemID+'"class="icon icon-edit"  style="cursor:pointer;"></a><a class="icon icon-trash"  style="cursor:pointer;"></a>');
                    var d = $('#formparticipant .custom-combobox').clone();
                    $('#ddlPeriodPopUp', d).val(e.STRM);
                    $('.iOfficialNotesID ', c).append(e.SystemID);
                    $('.iPeriod ', c).append(d);
                    $('.iSystem ',c).attr("data",e.SystemID);
                    $('.iSystem .txtSystem', c).val(e.SystemName);
                    $('.iStatus ', c).html("Saved");
                    $('#tableOfficialNotesPopUp tbody').append(c);
                    $('.iOption .icon-trash').click(function(e){
                        e.preventDefault();
                //      if ($('tbody').find('.dataPopUp').length == 1)
                   //      {
                   //       $('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
                            // $('.failed').show();
                   //      }
                   //      else if($('.iOrderBy').find('.txtOrderBy').attr('kdOrderBy') == null)
                   //      {
                   //       $(this).closest('tr').remove();
                   //      }
                        //$(this).closest('tr').remove();
                        if ($('tbody').find('.dataPopUp').length == 1)
                        {
                            $('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
                            $('.failed').show();
                        }
                        else if($(".iPeriod", $(this).closest("tr")).find('.txtPeriod').attr('kdPeriod') == null)
                        {
                            $(this).closest('tr').remove();
                        }
                    });
                     
                });
            }
        });
    },
    init: function() {
        var sx = this;
        sx.loadPeriod();
        $('#btnSave').click(function(){
            //sx.showLoading();
                var detail = [];
                $.each($('.dataPopUp'), function() {
                    var tempObj = {};
                    tempObj.dataID = ($(this).find('.iOfficialNotesID').html() == "")? "0" : $(this).find('.iOfficialNotesID').html();
                    tempObj.System = $(this).find('.txtSystem').val();
                    tempObj.Period = ($(this).find('#ddlPeriodPopUp').val() == ""  )?$('#ddlPeriodPopUp option:selected').val():$(this).find('#ddlPeriodPopUp').val();
                    console.log(tempObj.System);
                    console.log(tempObj.Period);
                    if(tempObj.System!=''){
                        detail.push(tempObj);
                    }
                });
                var configuration ={
                    "detail": detail
                }
                BM.ajax({   
                    type: 'POST',
                    url: BM.serviceUri + 'staff/HeadPrefect_Configuration/create_configurationfest' ,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify(configuration),
                    beforeSend: function() {
                       // sx.showLoading();
                    },
                    success: function(data) {
                        //sx.hideLoading();
                        console.log(data[0].status);
                        if (data[0].status == 'success') {
                            alert("Data Saved");
                            $('.dataPopUp').remove();
                            sx.loadInit();
                            
                        } else {
                           // sx.hideLoading();
                           // alert(data.message);
                        }
                    }
                });
        });
        // var formData = [{
        //         type: "small",
        //         name: "Institution",
        //         input: $("<span class='custom-combobox'><select id='ddlPopupAcademicInstitution' name='AcademicInstitution'>Institution</select></span>")
        //     },
        //     {
        //         type: "small",
        //         name: "Academic Career",
        //         filterType: "degree",
        //         allOption: true,
        //         input: $("<span class='custom-combobox'><select id='ddlPopupDegreeByID' name='DegreeByID'>Degree</select></span>")
        //     }, {
        //         type: "small",
        //         name: "Campus",
        //         input: $("<div style='width:35%;display:inline-block; margin-bottom:15px;'><span class='custom-multiselect'><select id='ddlPopupCampus' name='ddlCampus' multiple='multiple'>Campus</select></span></div>")
        //     },
        //     {
        //         type: "small",
        //         name: "Period",
        //         input: $("<span class='custom-combobox'><select id='ddlPopupPeriod' name='ddlPeriod'>Period</select></span>")
        //     },
        //     {
        //         type: "small",
        //         name: "Faculty",
        //         filterType: "group",
        //         input: $("<span class='custom-combobox'><select id='ddlPopupGroup' name='AcadGroup'>Faculty</select></span>")
        //     },
        //     {
        //         type: "small",
        //         name: "Course Type",
        //         input: $("<span class='custom-combobox'><select id='ddlCourseType' name='ddlCourseType'>Class Type</select></span>")
        //     },
        //     {
        //         type: "small",
        //         name: "Class Type",
        //         input: $("<span class='custom-combobox'><select id='ddlClassType' name='ddlClassType'>Class Type</select></span>")
        //     },
        //     {
        //         type: "small",
        //         name: "Start Date",
        //         input: $("<input type='text'name='startDate'id='startDate'class='datepicker' ></input>")
        //     },
        //     {
        //         type: "small",
        //         name: "End Date",
        //         input: $("<input type='text'name='endDate'id='endDate'class='datepicker' ></input>")
        //     },
        //     {
        //         type: "big",
        //         name: "",
        //         input: $("<input type='hidden'name='action'id='action'value='create'></input>")
        //     },
        //     {
        //         type: "big",
        //         name: "",
        //         input: $("<input type='hidden'name='ID'id='ID'></input>")
        //     }
        // ];

        // var buttonData = ["<input type='submit' class='button button-primary' id='submit' value='SUBMIT' style='margin:30px 15px 20px;' />"]
        // var requestFormData = {
        //     listField: ['AcademicInstitution', 'CampusByID', 'AcademicCareerByID', 'AllAcademicGroup','TermbyCareer','AllCourseType']
        // };

        // BM.ajax({
        //     url: BM.serviceUri + "General_Head_Prefect/getFilterData",
        //     data: JSON.stringify(requestFormData),
        //     type: "POST",
        //     async: false,
        //     dataType: "json",
        //     success: function(data) {
        //         data['ClassType'] = {FIELDVALUE: "", XLATLONGNAME: ""};
        //         loadForm({
        //             type: "dynamic",
        //             formData: formData,
        //             buttonList: buttonData,
        //             onSubmit: function(e) {
        //                 e.preventDefault();
        //                 var el = $(e.target);
        //                 var elj = el.serializeJSON();
        //                 sx.submitForm(elj);
        //             },
        //             target: "formConfiguration",
        //             value: ["AcademicInstitution", "Campus", 'Acad_Career', 'ACADGROUP_VALUE', 'FIELDVALUE', 'Waktu','CRSE_ATTR'],
        //             idInput: ['PopupAcademicInstitution', 'PopupCampus', 'PopupDegreeByID', 'PopupGroup', 'ClassType', 'PopupPeriod','CourseType'],
        //             text: ["Description", 'Descr', 'Descr', 'ACADGROUP_DESCR', 'XLATLONGNAME', 'DESCR','CRSE_DESCR'],
        //             addAttr: [''],
        //             prefix: ['ddl', 'ddl', 'ddl', 'ddl', 'ddl', 'ddl'],
        //             itemData: {
        //                 data: data
        //             }

        //         });
        //          newSpecialFilter([{
        //                 from: '#ddlPopupAcademicInstitution', // id dropdown awal
        //                 to: '#ddlPopupDegreeByID', // id dropdown tujuan
        //                 dataTo: data.AcademicCareerByID, // data dropdown tujuan dari getFilterData
        //                 attr: 'AcademicInstitution', // attribut yang sama di antara from dan to
        //                 toValue: 'Acad_Career', // value yg di tampilkan di dropdown to
        //                 toText: 'Descr', // text yg di tampilkan di dropdown
        //                 triggerFromStart: true // true or false trigger di awal });
        //             }, {
        //                 from: ['#ddlPopupAcademicInstitution','#ddlPopupDegreeByID'], // id dropdown awal
        //                 to: '#ddlPopupCampus', // id dropdown tujuan
        //                 dataTo: data.CampusByID, // data dropdown tujuan dari getFilterData
        //                 attr: ['AcademicInstitution','ACAD_CAREER'], // attribut yang sama di antara from dan to
        //                 toValue: 'Campus', // value yg di tampilkan di dropdown to
        //                 toText: 'Descr', // text yg di tampilkan di dropdown
        //                 triggerFromStart: true // true or false trigger di awal });
        //             }, {
        //                 from: ['#ddlPopupAcademicInstitution','#ddlPopupDegreeByID'], // id dropdown awal
        //                 to: '#ddlPopupPeriod', // id dropdown tujuan
        //                 dataTo: data.TermbyCareer, // data dropdown tujuan dari getFilterData
        //                 attr: ['AcademicInstitution','ACAD_CAREER'], // attribut yang sama di antara from dan to
        //                 toValue: 'Waktu', // value yg di tampilkan di dropdown to
        //                 toText: 'DESCR', // text yg di tampilkan di dropdown
        //                 triggerFromStart: true // true or false trigger di awal });
        //             }, {
        //                 from: ['#ddlPopupAcademicInstitution','#ddlPopupDegreeByID','#ddlPopupCampus','#ddlPopupPeriod'], // id dropdown awal
        //                 to: '#ddlPopupGroup', // id dropdown tujuan
        //                 dataTo: data.AllAcademicGroup, // data dropdown tujuan dari getFilterData
        //                 attr: ['AcademicInstitution','ACAD_CAREER','CAMPUS','STRM'], // attribut yang sama di antara from dan to
        //                 toValue: 'ACADGROUP_VALUE', // value yg di tampilkan di dropdown to
        //                 toText: 'ACADGROUP_DESCR', // text yg di tampilkan di dropdown
        //                 triggerFromStart: true // true or false trigger di awal });
        //             }, {
        //                 from: ['#ddlPopupAcademicInstitution','#ddlPopupDegreeByID','#ddlPopupCampus','#ddlPopupPeriod','#ddlPopupGroup'], // id dropdown awal
        //                 to: '#ddlCourseType', // id dropdown tujuan
        //                 dataTo: data.AllCourseType, // data dropdown tujuan dari getFilterData
        //                 attr: ['AcademicInstitution','ACAD_CAREER','CAMPUS','STRM','ACADGROUP_VALUE'], // attribut yang sama di antara from dan to
        //                 toValue: 'CRSE_ATTR', // value yg di tampilkan di dropdown to
        //                 toText: 'CRSE_DESCR', // text yg di tampilkan di dropdown
        //                 triggerFromStart: true // true or false trigger di awal });
        //             }]);
        //         sx.refreshCombobox();

        //         $.each($('.datepicker'), function(a, b) {
        //             $(this).BMdatepicker();
        //         });
        //         // $('#ddlPopupCampus').unbind().change(function() {
        //         //     sx.loadBindCmb();
        //         // });
        //         // $('#ddlPopupDegreeByID').unbind().change(function() {
        //         //     sx.loadBindCmb();
        //         // });
        //         //  $('#ddlPopupPeriod').unbind().change(function() {
        //         //     sx.loadBindCmbClass();
        //         // });
        //         $('#ddlPopupDegreeByID').change();
        //         $('#ddlPopupGroup').unbind().change(function() {
        //             sx.loadBindCmbClass();
        //         });
        //         var tableInput = $('#firstTemplate');
        //         tableInput.removeAttr('ID').attr("ID", "secondTable");
        //         $('input[name=ID]').after(tableInput);
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
    },
    loadData : function(param){},
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
                    $('.iLoadingPopup').text('No data available');
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
                    $('.iLoadingPopup').text('No data available');
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
        var sx = this;
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