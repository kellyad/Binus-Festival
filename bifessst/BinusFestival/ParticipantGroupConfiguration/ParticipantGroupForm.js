var psv;
var j = 0;
var popupSubView = {
	title: '',
	onLoaded: function(){
		psv = this;
		psv.loadExamDate();
		//psv.loadFilter();

		if(BM.filter.ParticipantGroupID ){
			$('.afterLoad').show();
			$('#divLoader').hide();
			psv.loadFilter(BM.filter.ParticipantGroupID);
			$('.heading-PopUp').html("EDIT PARTICIPANT GROUP CONFIGURATION");
		}
		else if (BM.filter)
		{	$('.afterLoad').show();
			$('#divLoader').hide();
			$('#txtInstitutionpopup').text(': '+BM.filter.Institution).attr('value',BM.filter.InstitutionVal);
			$('#txtAcadCareerpopup').text(': '+BM.filter.Acadcareer).attr('value',BM.filter.AcadcareerVal);
			$('#txtCampuspopup').text(': '+BM.filter.Campus).attr('value',BM.filter.InstitutionVal);
			$('#txtTermpopup').text(': '+BM.filter.Term).attr('value',BM.filter.TermVal);
			$('#txtExamTypepopup').text(': '+BM.filter.ExamType).attr('value',BM.filter.ExamTypeVal);
			$('#txtLocationpopup').text(': '+BM.filter.Locations).attr('value',BM.filter.LocationsVal);
		}
		else 
		{
			 window.location = "#/event/binusfestival/konfigurasiGroupPeserta";
		}

		 $('input[type=radio][name=radioShiftBy]').click(function() {
		        if (this.value == 1) {
		            $('.manualShift').hide();
		            $('.noteManualShift').hide();
		            $('.masterShift').show();
		        }
		        else if (this.value == 0) {
		            $('.manualShift').show();
		            $('.noteManualShift').show();
		            $('.masterShift').hide();
		        }
		    });
		
		$('#formAddParticipantGroup').submit(function(e){
			e.preventDefault();
			$('#status-failed').hide();
			$('#btnSubmit').hide();
			$('#submitLoading').show();

			//var shift = $('#ddlShiftPopup option:selected').text().split('-');
			var SystemID = BM.filter.SystemID;
			var ParticipantGroupName = $('.txtParticipantGroup').val();
			var totalSession = $('.txtSession').val();
			 var shiftbyValue = $('[name=radioShiftBy]:radio:checked').val();
			// var campusValue = BM.filter.CampusVal;
			// var locationValue = BM.filter.LocationsVal;
			// var examtypeValue = BM.filter.ExamTypeVal;
			// var shiftstartValue = shift[0];
			// var shiftendValue = shift[1];
			// var termValue = BM.filter.TermVal;
			 var validation = 1;



			if ($('.txtParticipantGroup').val()=='') 
			{
				$('#status-failed').find('.progress-text').text(' ParticipantGroupName must be filled');
				$('#btnSubmit').show();
				$('#submitLoading').hide();
				$('#status-failed').show();
				return;
			}
			else if ($('.txtSession').val()=='')
			{
				$('#status-failed').find('.progress-text').text('Session must be filled');
				$('#btnSubmit').show();
				$('#submitLoading').hide();
				$('#status-failed').show();
				return;
			}

			

			if (validation == 1)
			{
				var dta = 
				{	'ParticipantGroupID': (BM.filter.ParticipantGroupID == "")? "" : BM.filter.ParticipantGroupID,
					'totalSession' : totalSession,
					'SystemID' : SystemID,
					'ParticipantGroupName' : ParticipantGroupName,
					'shiftbyValue' : shiftbyValue
				};

				BM.ajax({
					url: BM.serviceUri+"BifestController/ParticipantHandler/saveParticipantGroupConfiguration",
					data: JSON.stringify(dta),
					type: "POST",
					dataType: "json",
					success: function(data){
						console.log(data);
						if(data[0].Status == "Success"){
							var message = "Your data have been saved. Thank you.";
							BM.successMessage(message,'success',function(){
                        	//$.fancybox.close();
                        	sx.loadTable(BM.filter.SystemID);
                        });
						}
						else if(data[0].Status == 'Error')
						{
							var message = "The Invigilator Has Been Allocated in The Inputted Time";
							$('#status-failed').find('.progress-text').text(message);
							$('#btnSubmit').show();
							$('#submitLoading').hide();
							$('#status-failed').show();
							return;
						}					
					}
				});
			}
			else
			{
				$('#status-failed').find('.progress-text').text('data are invalid');
				$('#btnSubmit').show();
				$('#submitLoading').hide();
				$('#status-failed').show();
			}
		});
	},
	loadExamDate : function()
	{
		BM.ajax({
			url:BM.serviceUri+"newExam/general/getExamDateByAcadCareer",
            data:JSON.stringify({
            	'INSTITUTION':BM.filter.InstitutionVal,
            	'ACAD_CAREER':BM.filter.AcadcareerVal
       		}),
            type:"POST",
            dataType:"json",
            success:function(data){
            	console.log(data);
            	var ddlExamDate = [];

            	if(data.length < 1){
            		ddlExamDate.push($("<option>No Data Available</option>").attr("value",-1));
            	}
            	else{
            		for(var i=0; i<data.length; i++){

	            		ddlExamDate.push($("<option>"+data[i].ExamDateDescription+"</option>").attr("value",data[i].ExamDate));
	            	}
            	}
            	$('#ddlExamDatePopup').append(ddlExamDate);            	
            }
		});
	},
	loadFilter: function(initParam){
		var requestFormData = {
           ParticipantGroupID : initParam
        };
        BM.ajax({
            url:BM.serviceUri+"BifestController/ParticipantHandler/getFilterParticipantGroup",
            data:JSON.stringify(requestFormData),
            type:"POST",
            dataType:"json",
            success:function(data){
            	$('.txtParticipantGroup').val(data[0].ParticipantGroupName);
            	$('.txtSession').val(data[0].TotalSession);
            	(data[0].Mandatory== '1') ? $("#ShiftByMasterShift").attr('checked', 'checked') : $("#ShiftByManual").attr('checked', 'checked');
            }
        });
	},
	appendInvigilator : function(ddlInvigilator)
	{

		var tmp = $('.templateInvigilator').clone().removeClass('templateInvigilator').addClass('Invigilator').css('display', '');
		 
		$('.custom-chosen',tmp).addClass(' '+j);
		$('.icon-trash',tmp).css('display','inline-block');

		$('.icon-trash',tmp).click(function(){
			$(this).closest('.Invigilator').remove();
		});


		$('.templateRow').append(tmp);

		$('.'+j).binus_advanced_combobox();
        $('#ddlInvigilatorPopup').trigger("chosen:updated");
		
		$('.'+j).find('.chosen-container-single').last().remove();
		/*$('.templateInvigilator').last().find($('#ddlInvigilatorPopup')).siblings('.combobox-label').text($(this).text());*/
		j = j+1;
	},
}