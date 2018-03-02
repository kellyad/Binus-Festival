var psv;
var popupSubView = {
    onLoaded: function() {
        psv = this;
        psv.init();
    },
    init: function() {
        var formData = [{
            type: "big",
            name: "INSTITUTION",
            input: $("<span class='custom-combobox'><select class='ddl-popup' id='ddlAcademicInstitution'>Institution</select></span>")
        },{
            type: "big",
            name: "DEVELOPMENT TYPE",
            input: $("<span class='custom-combobox'><select class='ddl-popup' id='ddlDevelopmentType'>Development Type</select></span>")
        },{
            type: "big",
            name: "DEVELOPMENT LEVEL",
            input: $("<span class='custom-combobox'><select class='ddl-popup' id='ddlDevelopmentLevel'>Level</select></span>")
        },{
            type: "big",
            name: "CATEGORY",
            input: $("<span class='custom-combobox'><select class='ddl-popup' id='ddlDevelopmentCategory'>Category</select></span>")
        }];
        var requestFormData = {
            listField: ['AcademicInstitution','DevelopmentType','DevelopmentLevel','DevelopmentCategory']
        };
        BM.ajax({
            url: BM.serviceUri + 'bifest/general/getFilterData',
            data: JSON.stringify(requestFormData),
            type: "POST",
            dataType: "json",
            success: function(data) {
                if (data.status == 1) {
                    // psv.loadTable();
                    var data = data.data;
                    loadForm({
                        type: "dynamic",
                        formData: formData,
                        onSubmit: function(e) {
                            e.preventDefault();
                            sv.loadTable();
                        },
                        target: "filter-popup-reason",
                        value: ['AcademicInstitution','DevelopmentTypeId','LevelId','CategoryID'],
                        text: ['Description','DevelopmentType','LevelName','CategoryName'],
                        popup: true,
                        prefix: ['ddl','ddl','ddl','ddl'],
                        itemData: {
                            data: data
                        }
                    });
                    $('.fancybox-wrap').css('margin', 'auto');
                    $.fancybox.update();
                    if (sv.EventTypeId != null) {
                        BM.ajax({
                            url: BM.serviceUri + 'BifestController/EventTypeHandler/getMasterEventTypeByID',
                            type: 'post',
                            data: JSON.stringify({
                                EventTypeId: sv.EventTypeId
                            }),
                            success: function(data) {
                                $('.fancybox-wrap').css('margin', 'auto');
                                $.fancybox.update();
                                $('#filter-popup-reason').show();
                                $('#filterPopUpLoader').hide();
                                $('#reasonInformation').show();
                                $('#reasonInformation2').show();
                                $('#reasonLoader').hide();
                                if (data.status == 1) {
                                    $('.txtEventType').val(data.data[0].EventTypeName);
                                    $('#ddlAcademicInstitution.ddl-popup').val(data.data[0].INSTITUTION).change();
                                    $('#ddlDevelopmentType.ddl-popup').val(data.data[0].DevelopmentTypeID).change();
                                    $('#ddlDevelopmentType').closest('span').find('.combobox-label').html(data.data[0].EventType);
                                    $('#ddlDevelopmentLevel.ddl-popup').val(data.data[0].LevelId).change();
                                    $('#ddlDevelopmentCategory.ddl-popup').val(data.data[0].CategoryID).change();
                                    $('#txtOrganizerName').val(data.data[0].OrganizerName);
                                    $('#txtOrganizerEmail').val(data.data[0].OrganizerEmail);
                                    $('#txtOrganizerAddress').val(data.data[0].OrganizerAddress);
                                    $('#txtOrganizerContact').val(data.data[0].OrganizerContact);
                                } else if (data.status == -1) {
                                    alert('You are not authorized!');
                                    window.location.href = BM.loginUri;
                                }
                            }
                        });
                    } else {
                        $('#reasonInformation').show();
                        $('#filter-popup-reason').show();
                        $('#filterPopUpLoader').hide();
                        $('#reasonInformation2').show();
                        $('#reasonLoader').hide();
                        $('#ddlAcademicInstitution.ddl-popup').val($('#ddlAcademicInstitution').not('.ddl-popup').val()).change();
                        $('#ddlDevelopmentType.ddl-popup').val($('#ddlDevelopmentType').not('.ddl-popup').val()).change();
                        $('#ddlDevelopmentLevel.ddl-popup').val($('#ddlDevelopmentLevel').not('.ddl-popup').val()).change();
                        $('#ddlDevelopmentCategory.ddl-popup').val($('#ddlDevelopmentCategory').not('.ddl-popup').val()).change();
                    }
                    $('.custom-combobox').binus_combobox();
                } else if (data.status == -1) {
                    alert('You are not authorized!');
                    window.location.href = BM.loginUri;
                }
            }
        });
        $('.btnSave').click(psv.save);
    },
    save: function() {
        if ($('.txtEventType').val().length > 0 ) {
            $('#lblError').text('');
            $('.btnSave').attr('disabled');
            BM.ajax({
                url: BM.serviceUri + 'BifestController/EventTypeHandler/saveMasterEventType',
                type: 'post',
                data: JSON.stringify({
                    EventTypeId: sv.EventTypeId,
                    INSTITUTION: $('#ddlAcademicInstitution.ddl-popup').val(),
                    EventTypeName: $('.txtEventType').val(),
                    DevelopmentTypeId: $('#ddlDevelopmentType.ddl-popup').val(),
                    EventType : $('#ddlDevelopmentType').closest('span').find('.combobox-label').html(),
                    LevelId: $('#ddlDevelopmentLevel.ddl-popup').val(),
                    CategoryID: $('#ddlDevelopmentCategory.ddl-popup').val(),
                    OrganizerName: $('#txtOrganizerName').val(),
                    OrganizerEmail: $('#txtOrganizerEmail').val(),
                    OrganizerAddress: $('#txtOrganizerAddress').val(),
                    OrganizerContact: $('#txtOrganizerContact').val()
                }),
                success: function(data) {
                    if (data.status == 1) {
                        $.fancybox.close();
                        BM.successMessage('Data has been saved!', 'success', function() {
                            sv.loadTable();
                        })
                    } else if (data.status == -1) {
                        alert('You are not authorized!');
                        window.location.href = BM.loginUri;
                    }
                }
            });
        } else {
            $('.lblError').text('All fileds must filled!');
            setTimeout(function() {
                $('.lblError').text('');
            }, 5000);
        }
    }

    // LoadForm:function(){
    //     $('#FormTemplate').hide();
    //     var formData = [{
    //         type: "half",
    //         name: "Activity Type",
    //         input: $("<span class='custom-combobox'><select id='ddlType' name='Type'></select></span>")
    //         }, {
    //         type: "half",
    //         name: "Activity Level",
    //         input: $("<span class='custom-combobox'><select id='ddlLevel' name='Level'></select></span>")
    //         }, {
    //         type: "half",
    //         name: "Activity Category",
    //         input: $("<span class='custom-combobox'><select id='ddlCategory' name='Category'></select></span>")
    //         }, {
    //         type: "half",
    //         name: "Activity Title",
    //         input: $("<input type='text' id='txtName' maxlength='100' placeholder='Name'/>")
    //         }, {
    //         type: "half",
    //         name: "Activity Place",
    //         input: $("<input type='text' id='txtPlace' maxlength='100' placeholder='Place'/>")
    //         },{
    //           type: "smallest",
    //         name: "Start Date",
    //         input:$("<span class='custom-datepicker'><input type='text' id='StartDate' name ='DateFrom' class='datepicker' style='width:100%;'><span class='icon-area' ></span>")
    //         }, {
    //         type: "smallest",
    //         name: "End Date",
    //        input:$("<span class='custom-datepicker'><input type='text' id='EndDate' name ='DateFrom' class='datepicker' style='width:100%;'><span class='icon-area' ></span>")
    //         }];
       
    //     var requestFormData = {
    //         listField: ["DevelopmentType", "DevelopmentPosition", "DevelopmentLevel", "DevelopmentCategory"]
    //     };
    //     BM.ajax({
    //         url: BM.serviceUri + "sat/general/getFilterData",
    //         data: JSON.stringify(requestFormData),
    //         type: "POST",
    //         dataType: "json",
    //         async: false,
    //         success: function (data) {
    //             // BM.dataform = data;
    //             loadForm({
    //                 type: "dynamic",
    //                 formData: formData,
    //                 target: "filter-master",
    //                 value: ['DevelopmentTypeId', "PositionID", "LevelId", "CategoryID"],
    //                 idInput: ['Type', 'Position', 'Level', 'Category'],
    //                 text: ['DevelopmentType', 'PositionName', 'LevelName', 'CategoryName'],
    //                 prefix: ['ddl', 'ddl', 'ddl', 'ddl'],
    //                 nullValue: ['','','',''],
    //                 itemData: {
    //                     data: data
    //                 }
    //             });
    //             }
    //         });
    //     $('.custom-datepicker').binus_datepicker();

        
    // }
};