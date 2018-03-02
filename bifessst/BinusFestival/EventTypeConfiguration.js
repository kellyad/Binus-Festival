var subView = {
    title: 'Master Event Type',
    require: 'attendance/masterConfiguration',
    rel: 'MasterConfigurationContent',
    EventTypeId: null,
    table: '',
    onLoaded: function() {
        sv = this;
        sv.init();
    },
    init: function() {
        window.document.title = sv.title;
        $('.parentTitle').text(sv.title);
        var formData = [{
            type: "big",
            name: "INSTITUTION",
            input: $("<span class='custom-combobox'><select id='ddlAcademicInstitution' name='Institution'>Institution</select></span>")
        }];
        var buttonData = [$("<input type='button' style='margin-right:10px' class='button button-primary btnAdd' value='Add New Event'/>"), $("<input type='submit' class='button button-primary' value='Search'/>")];
        var requestFormData = {
            listField: ['AcademicInstitution']
        };
        BM.ajax({
            url: BM.serviceUri + "binusFestival/getFilterData",
            data: JSON.stringify(requestFormData),
            type: "POST",
            dataType: "json",
            success: function(data) {
                if (data.status == 1) {
                    var data = data.data;
                    loadForm({
                        type: "dynamic",
                        formData: formData,
                        buttonList: buttonData,
                        onSubmit: function(e) {
                            e.preventDefault();
                            sv.loadTable();
                        },
                        target: "filter-reason",
                        value: ['AcademicInstitution'],
                        text: ['Description'],
                        addAttr: [''],
                        prefix: ['ddl'],
                        itemData: {
                            data: data
                        }
                    });
                    $(".row.button-list:has(input)").removeClass('row');
                    $('#filter-reason').show();
                    $('#loaderFilter').hide();
                    $('.btnAdd').click(function() {
                        sv.EventTypeId = null;
                        window.location.href = '#/event/binusfestival/EventTypeConfiguration#eventTypeForm';
                    });
                    sv.loadTable();
                } else if (data.status == -1) {
                    alert('You are not authorized!');
                    window.location.href = BM.loginUri;
                }
            }
        });
    },
    loadTable: function() {
        $('.reasonContent').hide();
        $('#tableLoader').show();
        BM.ajax({
            url: BM.serviceUri + 'BifestController/EventTypeHandler/getMasterEventType',
            type: 'post',
            data: JSON.stringify({
                INSTITUTION: $('#ddlAcademicInstitution').val()
            }),
            success: function(data) {
                $('.reasonContent').show();
                $('#tableLoader').hide();
                        console.log(data);
                if (data.status == 1) {
                    if (sv.table.length > 0) $('.freeze-pane table').DataTable().destroy();
                    $('.reasonData').remove();
                    $(data.data).each(function(k, v) {
                        var e = $('#iTemplate').clone().removeAttr('id').removeClass('looptemplate').addClass('reasonData');
                        $('.iNo', e).text(k + 1);
                        $('.iEventType .ellipsis', e).text(v.EventTypeName);
                        $('.iEventType .ellipsis', e).attr('title', v.EventTypeName);
                        $('.iDevelopmentType .ellipsis', e).text(v.EventType);
                        $('.iDevelopmentType.ellipsis', e).attr('title', v.EventType);
                        $('.iLevel .ellipsis', e).text(v.LevelName);
                        $('.iLevel .ellipsis', e).attr('title', v.LevelName);
                        $('.iCategory .ellipsis', e).text(v.CategoryName);
                        $('.iCategory .ellipsis', e).attr('title', v.CategoryName);
                        $('.iOrganizerName .ellipsis', e).text(v.OrganizerName);
                        $('.iOrganizerName .ellipsis', e).attr('title', v.OrganizerName);
                        $('.iOrganizerEmail .ellipsis', e).text(v.OrganizerEmail);
                        $('.iOrganizerEmail .ellipsis', e).attr('title', v.OrganizerEmail);
                        $('.iOrganizerAddress .ellipsis', e).text(v.OrganizerAddress);
                        $('.iOrganizerAddress .ellipsis', e).attr('title', v.OrganizerAddress);
                        $('.iOrganizerContact .ellipsis', e).text(v.OrganizerContact);
                        $('.iOrganizerContact .ellipsis', e).attr('title', v.OrganizerContact);
                        $('.iAction', e).data('id', v.EventTypeId);
                        $('.icon', e).css('cursor', 'pointer')
                        $('#tableMasterRespon tbody').append(e);
                        $('#tableMasterRespon tr.reasonData td').css('text-overflow', 'elipsis');
                        $('.icon-trash', e).click(function() {
                            BM.deleteConfirmation('Are you sure want to delete ?', function() {
                                BM.ajax({
                                    url: BM.serviceUri + 'BifestController/EventTypeHandler/deleteMasterEventType',
                                    type: 'post',
                                    data: JSON.stringify({
                                        EventTypeId: $('.iAction', e).data('id')
                                    }),
                                    success: function(data) {
                                        if (data.status == 1) {
                                            $.fancybox.close();
                                            BM.successMessage('Delete Success!', 'success', function() {
                                                sv.loadTable();
                                            })
                                        } else if (data.status == -1) {
                                            alert('You are not authorized!');
                                            window.location.href = BM.loginUri;
                                        }
                                    }
                                });
                            }, function() {
                                $.fancybox.close();
                            });
                        });
                        $('.icon-edit', e).click(function() {
                            sv.EventTypeId = $('.iAction', e).data('id');
                            window.location.href = '#/event/binusfestival/EventTypeConfiguration#eventTypeForm';
                        });
						$('#tableMasterRespon').append(e);
                    });
                    sv.table = $('#tableMasterRespon').closest('.freeze-pane').binus_freeze_pane({
                        fixed_left: 0,
                        fixed_right: 0,
                        height: 350,
                        paging: true,
                        info: true,
                        ajax: false,
                        needIndexNumber: false
                    });
                    if (sv.table.length > 0) $('.freeze-pane table').DataTable().destroy();
                    sv.table = $('#tableMasterRespon').closest('.freeze-pane').binus_freeze_pane({
                        fixed_left: 0,
                        fixed_right: 0,
                        height: 350,
                        paging: true,
                        info: true,
                        ajax: false,
                        needIndexNumber: false
                    });
                } else if (data.status == -1) {
                    alert('You are not authorized!');
                    window.location.href = BM.loginUri;
                }
            }
        });
    }
};