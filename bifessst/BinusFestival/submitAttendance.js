var sv;
var subView = {
    title: 'Binus Festival Submit Attendance - Binusmaya',
    require: 'event/binusfestival',
    rel: 'FestivalContent',
    successLoadCount:0,
    Status:{
        ValidateStatus:0,
        BinusFestivalAttendanceID:""
    },
    Data:{
        Institution:"",
        Acad_Career:"",
        STRM:"",
        Campus:"",
        Location:"",
        Room:"",
        TappingArea:"",
        Topic:"",
        Date:"",
        StartTime:"",
        EndTime:"",
        Notes:""
    },
    onLoaded: function(arg) {
        sv = this;
        sv.Status.BinusFestivalAttendanceID = arg;
        sv.init();
    },
    init: function() {
        window.document.title = sv.title;
      //  $('.parentTitle').text(sv.title);
        sv.setStatus();
        sv.loadTable();
        if(sv.Status.ValidateStatus==1)
        {
            BM.successMessage('Class Attendance has been Validated', 'failed', function() {
                
            });
            $('#btnSubmitAttendance').attr('disabled','disabled').removeClass('button-primary');
            $('#txtNotes').attr('disabled','disabled');
            $('#spanErrorMessage').removeClass('has-success').addClass('has-error').text('*Class Attendance has been Validated.').show();
        }
        else
        {
            $('#btnSubmitAttendance').off().click(sv.submitAttendance);
        }
    },
    loadTable: function() {
         BM.ajax({
            url: BM.serviceUri + 'BifestController/AttendanceHandler/getAllAttendanceTappingData',
            type: 'post',
            data: JSON.stringify({
                BinusFestivalAttendanceID: sv.Status.BinusFestivalAttendanceID 
            }),
            success: function(data) {
                if (data.Status == 1) {
                    var data = data.data;
                    var g = $('.iShiftNumber.looptemplate').clone().removeClass('looptemplate').addClass('shift').show();
                        //var i = $('.iShiftLecturerHeader.looptemplate').clone().removeClass('looptemplate').addClass('shift');
                    g.text('SESSION ');
                        $('.iShiftNumber.looptemplate').before(g);
                    var h = $('#iThirdHeader .looptemplate').clone().removeClass('looptemplate').addClass('shift').removeAttr('id');
                    var cbx = $('input[type=checkbox]',h).addClass('cbxAllStudent'+data[0].BinusFestivalAttendanceID);
                        

                        if(sv.Status.ValidateStatus==1 )
                        {
                            $(cbx).prop('disabled',true);
                        }else
                        {
                            $(cbx).off().click(function(){
                                $('.cbxStudent'+data[0].BinusFestivalAttendanceID).prop('checked',$(this).prop('checked'));
                            });
                        }

                        $('.iCheckboxHeader.looptemplate').before(h);
                        // $(data).each(function(k, v) {
                        //      $(sv.N_CLS_MTG_ID).each(function(key, value) {
                        $('.cbxAllStudent' + data[0].BinusFestivalAttendanceID).prop('checked',true);
                    //});

                    $(data).each(function(k, v) {
                        var e = $('#iListTemplate').clone().removeClass('looptemplate').removeAttr('id').addClass('studenList');
                        $('.iNo', e).text(k + 1);
                        $('.iStudentID', e).text(v.NIM);
                        $('.iName ', e).text(v.Name);
                       // $(sv.N_CLS_MTG_ID).each(function(key, value) {
                            var f = $('.iCheckbox.looptemplate', e).clone().removeClass('looptemplate');
                            var cbx = $('input[type="checkbox"]', f).prop('checked', (v.TappingTime== null || v.TappingTime=='') && (v.IsTapping== null || v.IsTapping =='N')?false:true).addClass('cbxStudent' + data[0].BinusFestivalAttendanceID).data('BinusID', v.BinusianID).data('StudentBinusFestivalID',v.StudentBinusFestivalID);
                            $('.iCheckbox.looptemplate', e).before(f);
                            $('.iCheckbox.looptemplate', e).before($('.iTappingTime.looptemplate', e).clone().removeClass('looptemplate').addClass('iTappingTime' + data[0].BinusFestivalAttendanceID).text(v.TappingTime != null ? moment(v.TappingTime).format('HH:mm:ss') : '-'));
                            
                            if($(cbx).prop('checked')==false)
                            {
                                $('.cbxAllStudent' +  data[0].BinusFestivalAttendanceID).prop('checked',false);
                            }

                            $(cbx).off().click(function(){
                                if($(this).prop('checked')==false)
                                {
                                    $('.cbxAllStudent' +  data[0].BinusFestivalAttendanceID).prop('checked',false);
                                }else
                                {
                                    $('.cbxAllStudent' +  data[0].BinusFestivalAttendanceID).prop('checked',true);
                                    $('.cbxStudent' +  data[0].BinusFestivalAttendanceID).each(function(){
                                        if($(this).prop('checked')==false)
                                        {
                                            $('.cbxAllStudent' +  data[0].BinusFestivalAttendanceID).prop('checked',false);
                                            //break;
                                        }
                                    });
                                }
                            });

                            if(sv.Status.ValidateStatus==1 )
                            {
                                $(cbx).prop('disabled',true);
                            }
                        $('#iListTemplate').before(e);
                        });

                        // sv.successLoadCount++;
                        // if(sv.successLoadCount==3)
                        // {
                            $('#attendanceBodyLoader').hide();
                            $('#attendanceBody').show();
                       // }
                    
                        // if (k == 0) {
                        //     var f = $('.iShiftHeader');
                        //     var i = $('.iTapping');
                        //     f.attr('colspan', data.length * 4);
                        //     i.attr('colspan', data.length * 4);
                        // }
                     //   var g = $('.iShiftNumber.looptemplate').clone().removeClass('looptemplate').addClass('shift');
                        //var i = $('.iShiftLecturerHeader.looptemplate').clone().removeClass('looptemplate').addClass('shift');
                     //   g.text('SESSION ');
                        //i.text('SESSION ' + v.SESSIONIDNUM);
                      //  $('.iShiftNumber.looptemplate').before(g);
                        //$('.iShiftLecturerHeader.looptemplate').before(i);
                        // var h = $('#iThirdHeader .looptemplate').clone().removeClass('looptemplate').addClass('shift').removeAttr('id');
                        // var j = $('#iThirdLecturerHeader .looptemplate').clone().removeClass('looptemplate').addClass('shift').removeAttr('id');
                        // var cbx = $('input[type=checkbox]',h).addClass('cbxAllStudent'+sv.N_CLS_MTG_ID[k]);
                        

                        // if(sv.Status.ValidateStatus==1 )
                        // {
                        //     $(cbx).prop('disabled',true);
                        // }else
                        // {
                        //     $(cbx).off().click(function(){
                        //         $('.cbxStudent'+sv.N_CLS_MTG_ID[k]).prop('checked',$(this).prop('checked'));
                        //     });
                        // }

                        // $('.iCheckboxHeader.looptemplate').before(h);
                        // $('.iLC.looptemplate').before(j);

                        
                   // });

                    // sv.successLoadCount++;
                    // if(sv.successLoadCount==3)
                    // {
                        $('#attendanceBodyLoader').hide();
                        $('#attendanceBody').show();
                        $('.looptemplate').hide();
                    // }
                } else if (data.status == -1) {
                    alert('You are not authorized!');
                    window.location.href = BM.loginUri;
                }
            }
        });

    },
    buildSubmitData: function() {
        var data = {
            INSTITUTION: sv.Data.Institution,
            ACAD_CAREER: sv.Data.Acad_Career,
            STRM: sv.Data.STRM,
            StudentData: [],
            BinusFestivalAttendanceID: sv.Status.BinusFestivalAttendanceID,
            Notes: $('#txtNotes').val()
        };
        
            $('input[type=checkbox].cbxStudent' + sv.Status.BinusFestivalAttendanceID).each(function(k, v) {
                /*
                data.StudentBinusID += $(v).data('BinusID') + '☺';
                data.StudentIsPresent += ($(v).is(':checked') ? 'Y' : 'N') + '☺';
                data.StudentN_CLS_MTG_ID += value + '☺';
                data.StudentAttendanceStatusID += 'NULL' + '☺';
                data.StudentNotes += 'NULL' + '☺';
                */

                data.StudentData.push({
                    "StudentBinusID":$(v).data('BinusID'),
                    "StudentIsPresent":($(v).is(':checked') ? 'Y' : 'N'),
                    "StudentBinusFestivalAttendanceID":sv.Status.BinusFestivalAttendanceID,
                    "StudentStudentBinusFestivalID":$(v).data('StudentBinusFestivalID')
                });
            //$('.lecturerList').each(function(k, v) {
                /*
                data.LecturerBinusID += $('.iLecturer', v).data('BinusID') + '☺';
                data.LecturerIsPresent += ($('.iTappingPresent>input[type=checkbox]', v).prop('checked')==true?'Y':'N')+ '☺';
                data.LecturerN_CLS_MTG_ID += value + '☺';
                */

                // data.LecturerData.push({
                //     "LecturerBinusID":$('.iLecturer', v).data('BinusID'),
                //     "LecturerIsPresent":($('.iTappingPresent>input[type=checkbox]', v).prop('checked')==true?'Y':'N'),
                //     "LecturerN_CLS_MTG_ID":value
                // });
            //});
			//data.N_CLS_MTG_ID+= value + '☺';
        });
        
        return data;
    },
    setStatus: function() {
        BM.ajax({
            url: BM.serviceUri + 'BifestController/AttendanceHandler/getAllAttendanceStatus',
            type: 'post',
            async:false,
            data: JSON.stringify({
                BinusFestivalAttendanceID: sv.Status.BinusFestivalAttendanceID 
            }),
            success: function(data) {
                if (data.Status == 1) {
                    var data = data.data;
                    sv.Status.ValidateStatus = data[0].IsValidate;
                    sv.Status.BinusFestivalAttendanceID = data[0].BinusFestivalAttendanceID;
                    sv.Data.Institution = data[0].INSTITUTION;
                    sv.Data.Acad_Career = data[0].Acad_Career;
                    sv.Data.STRM = data[0].STRM;
                    sv.Data.Campus = data[0].Campus;
                    sv.Data.Location = data[0].Location;
                    sv.Data.Room = data[0].Room;
                    sv.Data.Topic = data[0].Topic;
                    sv.Data.TappingArea = data[0].TappingArea;
                    sv.Data.Date = data[0].StartDate;
                    sv.Data.StartTime = data[0].StartTime;
                    sv.Data.EndTime = data[0].EndTime;
                    sv.Data.Notes = data[0].Notes;
                 
        $('#LabelInstitution').html(sv.Data.Institution);
        $('#LabelAcadCareer').html(sv.Data.Acad_Career);
        $('#LabelSTRM').html(sv.Data.STRM);
        $('#LabelCampus').html(sv.Data.Campus);
        $('#LabelLocation').html(sv.Data.Location);
        $('#LabelRoom').html(sv.Data.Room);
        $('#LabelTappingArea').html(sv.Data.TappingArea);
        $('#LabelTopic').html(sv.Data.Topic);
        $('#LabelStartDate').html(sv.Data.Date);
        $('#LabelTime').html(sv.Data.StartTime +' - '+ sv.Data.EndTime);
        $('#txtNotes').val(sv.Data.Notes);
                  
                 //   sv.Status.HonorStatus = data[0].HonorStatus;
                  //  $('#txtNotes').val(data[0].Notes);
                    
                } else if (data.status == -1) {
                    BM.successMessage('You are not authorized!', 'failed', function() {
                        window.close();
                    });
                    return;
                }
            }
        });
    },
    validation: function() {
        $('#spanErrorMessage').hide();

        // if($.trim($('#txtNotes').val())=="")
        // {
        //     $('#spanErrorMessage').removeClass('has-success').addClass('has-error').text('*Notes must be filled.').show();
        //     return false;
        // }
		
		if($('.iTappingPresent'+sv.N_CLS_MTG_ID).length>0)
		{
			if($('.iTappingPresent'+sv.N_CLS_MTG_ID+':checked').length==0)
			{
				$('#spanErrorMessage').removeClass('has-success').addClass('has-error').text('*At least 1 Lecturer must be present.').show();
				return false;
			}
		}

        return true;
    },
    submitAttendance: function() {
        if(!sv.validation())
        {
            return;
        }

        $("#btnSubmitAttendance").attr('disabled',true);
        $("#btnSubmitAttendance").val("Loading...");

        var attendanceData = sv.buildSubmitData();
        
        BM.ajax({
            url: BM.serviceUri + 'BifestController/AttendanceHandler/insertAttendanceList',
            type: 'post',
            data: JSON.stringify(attendanceData),
            success: function(data) {
                var data = data.data;
                if (data[0].STATUS == 1) {
    			//	window.opener.sv.loadMonitoringInfo();
                    BM.successMessage('Attendance data has been saved.', 'success', function() {
                        window.location.reload();
                    });
                }
                else
                {
                    $("#btnSubmitAttendance").removeAttr('disabled');
                    BM.successMessage('Failed!','failed',function(){});
                }

                $("#btnSubmitAttendance").val("SUBMIT");
            }
        });
    },
}