 var sv;
 var subView = { 
 	title: 'Konfigurasi Penjadwalan',
	require: 'event/binusfestival',
	rel: 'FestivalContent',
	onLoaded: function(arg) 
	{
		sv = this;
		sv.init();
		window.document.title = this.title;
		$('.pageTitle').text(sv.title);
		/*if (BM.Institution == undefined)
		{
			location.href = "#/exam/master/roomtypemappingforcoursecode";
		};*/
		$('#txtInstitution').text(': '+BM.Institution);
		$('#txtAcadCareer').text(': '+BM.AcadCareer);
		$('#txtEffectiveDate').text(': '+BM.EffectiveDate);
		$('#txtStatus').text(': '+BM.Status);
		//sv.loadData();
		

        $("a[href='" + location.hash.split(".")[0] + "']").closest("li").addClass("current");
        $("a[href='" + location.hash.split(".")[0] + "']").closest("li").siblings().removeClass("current");

        BC_Caption = $('#navigation-menu li.current a').children('span').text();
        while ($('#BC_Caption').children().length > 3) {
            $('#BC_Caption li:last-child').remove();
        }
        $('#BC_Caption').append('<li>' + BC_Caption + '</li>');	
	},
	init: function(){
		var sv = this;
		var search = "<option value ='0'>All</option><option value ='1'>Course Code</option><option value = '2'>Course Name</option>";
		var formData = [
			{
				type:"big",
				name:"SCHEDULE NAME",
				input: $("<span class='iInput' style ='margin-bottom: 15px;'><input type='text' placeholder='Schedule Name' id='txtSearch' ></span>")
			},
			{
				type:"big",
				name:"MANDATORY",
				input: $("<span class='custom-combobox'><select id='ddlAcademicCareer'></select></span>")
			},
			{
				type:"half",
				name:"START DATE",
				input:$("<input type='text'name='startDate'id='startDate'class='datepicker' ></input>")
			},
			{
				type:"half",
				name:"END DATE",
				input:$("<input type='text'name='endDate'id='endDate'class='datepicker' ></input>")
			},
			{
				type:"half",
				name:"PAMERAN",
				input:$("<input type='text'name='endDate'id='endDate'class='datepicker' ></input>")
			},
			{
				type:"big",
				name:"PERIOD",
				input:$("<span class='custom-combobox'><select id='ddlPeriod' name='AcadPeriod'>PERIOD</select></span>")
			}
		];
		
		 $('#formOfficialNotes').submit(function (e) {
			e.preventDefault();
			$('.failed').hide();
			if(flag == 0)
			{
				$('.failed').find('.progress-text').text('No Data!');
				$('.failed').show();
			}
			else
			{ 
			
				var dt = [];
				var dtUp = [];
				arrKdOrderBy = [];
				$('.dataPopUp').each(function(){
					validation=1;
					//kalau dia add baru
					if($(this).find('.iOfficialNotesID').text().trim() == '')
					{
						dt.push({
							"OfficialNotesID": $(this).find('.iOfficialNotesID').text(),
							"Institution": $('#ddlPopupAcademicInstitution').val(),
							"kdOrderBy": $(this).find('.iOrderBy input').val(),
							"kdOfficialNotesIND": $(this).find('.iOfficialNotesIND textarea').val(),
							"kdOfficialNotesENG": $(this).find('.iOfficialNotesENG textarea').val()
						
						});
						//console.log(dt);
					}
					//kalau dia update
					// console.log($(this).find('.txtOrderBy').attr('kdorderby'));
					// console.log($(this).find('.txtOrderBy').val());
					// console.log($(this).find('.txtOrderBy').attr('kdorderby') != $(this).find('.txtOrderBy').val());
					if(($(this).find('.txtOrderBy').attr('kdorderby') != $(this).find('.txtOrderBy').val() ||
				    $(this).find('.txtOfficialNotesIND').attr('kdofficialnotesind') != $(this).find('.txtOfficialNotesIND').val() ||
				   	$(this).find('.txtOfficialNotesENG').attr('kdofficialnoteseng') != $(this).find('.txtOfficialNotesENG').val()) && 
					$(this).find('.iOfficialNotesID').text() != '')	
					{
						dtUp.push({
							"OfficialNotesID": $(this).find('.iOfficialNotesID').text(),
							"Institution": $('#ddlPopupAcademicInstitution').val(),
							"kdOrderBy": $(this).find('.iOrderBy input').val(),
							"kdOfficialNotesIND": $(this).find('.iOfficialNotesIND textarea').val(),
							"kdOfficialNotesENG": $(this).find('.iOfficialNotesENG textarea').val()
						});
						
					}
					if (arrKdOrderBy.indexOf($(this).find('.iOrderBy input').val()) >= 0) 
					{
						validation = 0;
						$('.failed').find('.progress-text').text('OrderBy is invalid!');
						$('.failed').show();
					}
					arrKdOrderBy.push($(this).find('.iOrderBy input').val());
				});
				if(validation == 1)
				{
					var param = 
					{
						'insert' : dt,
						'update' : dtUp,
						'Institution' : $('#ddlPopupAcademicInstitution').val()
					}
					BM.ajax({
						url:BM.serviceUri+'graduation/officialNotes/addOfficialNotes',
						data:JSON.stringify(param),
						type:"POST",
						success: function(data){
							if (data[0].status == 'Success'){
								$('#ddlAcademicInstitution').val($('#ddlPopupAcademicInstitution').val());
								$('#ddlAcademicInstitution').siblings('.combobox-label').text($('#ddlPopupAcademicInstitution option:selected').text());

								//$.fancybox.close();
								var message = "Your data have been saved. Thank you.";
								BM.successMessage(message,'success',function(){
									sv.loadOfficialNotes();
								});
		                    }
		                    else
		                    {
		                    	$('.failed').find('.progress-text').text(data[0].status);
		                    	$('.failed').show();
		                    }
						}
					});
				}
		}
        });
		var requestFormData = {
			listField:['AcademicInstitution','AcademicCareer','Period']
		};
		$('#btnAddPopUp').click(function () {
					
					$('.failed').hide();
                   	var c = $('#iTemplateOfficialNotesPopUp').clone().removeAttr('id').css('display', '').addClass('dataPopUp');
                   	$('.iOption', c).append('<a class="icon icon-trash"  style="cursor:pointer;"></a>');
                	
                   	$('#tableOfficialNotesPopUp tbody').append(c);

                	$('.iOption .icon-trash').click(function(e){
			        	e.preventDefault();
			    //     	if ($('tbody').find('.dataPopUp').length == 1)
				   //      {
				   //      	$('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
							// $('.failed').show();
				   //      }
				   //      else if($('.iOrderBy').find('.txtOrderBy').attr('kdOrderBy') == null)
				   //      {
				   //      	$(this).closest('tr').remove();
				   //      }
			        	//$(this).closest('tr').remove();
				        if ($('tbody').find('.dataPopUp').length == 1)
				        {
				        	$('.failed').find('.progress-text').text('Last Row Cannot Be Deleted');
							$('.failed').show();
				        }
				        else if($(".iOrderBy", $(this).closest("tr")).find('.txtOrderBy').attr('kdOrderBy') == null)
				        {
				        	$(this).closest('tr').remove();
				        }
			        });

                	$('.txtInstitution').keyup(function(key) {
                		this.value = this.value.toUpperCase();
                	});
			       
			        
        			
					flag=1;
                });
		BM.ajax({
			url:BM.serviceUri+"general/getFilterData",
			data:JSON.stringify(requestFormData),
			type:"POST",
			dataType:"json",
			success:function(data){
				loadForm({
					type:"dynamic",
					formData:formData,
					onSubmit:function(e){
						e.preventDefault();
						sv.loadDetail();
					},
					target:"filter-master",
					value:['AcademicInstitution','AcademicCareer','STRM'],
					text:['Description','Description','Descr'],
					addAttr:[''],
					prefix:['ddl','ddl','ddl'],
					itemData:{
						data:data
					}

				});
				  $.each($('.datepicker'), function(a, b) {
                    $(this).BMdatepicker();
                });
				newSpecialFilter({
					from: '#ddlAcademicInstitution',
					to: '#ddlAcademicCareer',
					dataTo: data.AcademicCareer,
					attr: 'AcademicInstitution',
					toValue: 'AcademicCareer',
					toText: 'Description',
					triggerFromStart:true
				});
				newSpecialFilter({
				     from: '#ddlAcademicCareer', // id dropdown awal
				     to: '#ddlPeriod', // id dropdown tujuan
				     dataTo: data.Period, // data dropdown tujuan dari getFilterData
				     attr: 'ACAD_CAREER', // attribut yang sama di antara from dan to
				     toValue: 'STRM', // value yg di tampilkan di dropdown to
				     toText: 'Descr', // text yg di tampilkan di dropdown
				     triggerFromStart:true // true or false trigger di awal
				 });
				$("select#ddlSearch").closest("span.custom-combobox").data('has-init','no').binus_combobox();
				$('#ddlSearch').change(function()
				{
					if ($('#ddlSearch').val() == '0')
					{
						$('#txtSearch').val('');
						$('#txtSearch').attr('disabled',true);
					}
					else
					{
						$('#txtSearch').removeAttr('disabled');
					}
				});
				$('#btnTransfer').click(function()
				{
					BM.Institution = $('#ddlAcademicInstitution option:selected').text();
					BM.AcademicCareer = $('#ddlAcademicCareer option:selected').text();
					BM.Term = $('#ddlPeriod option:selected').text();
					BM.InstitutionVal = $('#ddlAcademicInstitution option:selected').val();
					BM.AcademicCareerVal = $('#ddlAcademicCareer option:selected').val();
					BM.TermVal = $('#ddlPeriod option:selected').val();
					location.href = "#/exam/configuration/DetailRoom#formTransfer";
				});
			}
		});	
		
	}
			
	// },
	// loadDetail: function(data){
	// 	if ($('#ddlSearch').val() == 1 &&  $('#txtSearch').val() == '')
	// 	{
	// 		BM.successMessage('Please Fill the Course Code', 'failed', function(){});
	// 		return;
	// 	}
	// 	else if ($('#ddlSearch').val() == 2 &&  $('#txtSearch').val() == '')
	// 	{
	// 		BM.successMessage('Please Fill the Course Name', 'failed', function(){});
	// 		return;
	// 	}
	// 	BM.ajax({
	// 		url:BM.serviceUri+"newexam/roomtype/getAllCourse",
	// 		data:JSON.stringify({
	// 			'term' : $('#ddlPeriod option:selected').val(),
	// 			'acadcareer' : $('#ddlAcademicCareer option:selected').val(),
	// 			'institution' : $('#ddlAcademicInstitution option:selected').val(),
	// 			'search' : $('#ddlSearch').val(),
	// 			'textsearch' : $('#txtSearch').val()
	// 		}),
	// 		type:"POST",
	// 		dataType:"json",
	// 		success:function(data)
	// 		{
	// 			$('.datarow').remove();
	// 			$('#contentTable').show();
	// 			$('#listDetailRoom').show();

	// 			if(data.length < 1)
	// 			{
	// 				var table = $("#listDetailRoom");
	// 				$("tbody",table).append("<tr class='datarow'><td colspan='5' style='text-align:center;'>No Data Available</td></tr>");
	// 				$('#contentTable').css({"overflow-y":"hidden", "height":"auto"});
	// 			}
	// 			for(i=0;i<data.length;i++)
	// 			{
	// 				var d = data[i];
	// 				$('#contentTable').css({"overflow-y":"scroll", "height":"500px"});
	// 				var c = $('#iRoomDetail').clone().removeAttr('id').css('display', '').addClass('datarow').removeClass('looproomdetail');
	// 				//$('.iDetailID',c).text(d.FACILITY_ID);
	// 				$('.iRoomType',c).text(d.FACILITY_TYPE);
	// 				$('.iRoomAssign',c).text(d.CourseAssign);
	// 				$(".iEdit",c).click(function(){
	// 					var MappingRoomTypeWithCourseCodeDetailID = $(".iDetailID", $(this).closest("tr")).text();
	// 					BM.MappingRoomTypeWithCourseCodeDetailID = MappingRoomTypeWithCourseCodeDetailID;
	// 					BM.RoomType = $(".iRoomType", $(this).closest("tr")).text();;
	// 					BM.Institution = $('#ddlAcademicInstitution option:selected').text();
	// 					BM.AcademicCareer = $('#ddlAcademicCareer option:selected').text();
	// 					BM.InstitutionVal = $('#ddlAcademicInstitution option:selected').val();
	// 					BM.AcademicCareerVal = $('#ddlAcademicCareer option:selected').val();
	// 					BM.TermVal = $('#ddlPeriod option:selected').val();
	// 					location.href = "#/exam/configuration/DetailRoom#formAdds";
	// 				});
	// 				$(".iView",c).click(function(){
	// 					var MappingRoomTypeWithCourseCodeDetailID = $(".iDetailID", $(this).closest("tr")).text();
	// 					BM.MappingRoomTypeWithCourseCodeDetailID = MappingRoomTypeWithCourseCodeDetailID;
	// 					BM.RoomType = $(".iRoomType", $(this).closest("tr")).text();;
	// 					BM.Institution = $('#ddlAcademicInstitution option:selected').text();
	// 					BM.AcademicCareer = $('#ddlAcademicCareer option:selected').text();
	// 					BM.InstitutionVal = $('#ddlAcademicInstitution option:selected').val();
	// 					BM.AcademicCareerVal = $('#ddlAcademicCareer option:selected').val();
	// 					BM.TermVal = $('#ddlPeriod option:selected').val();
	// 					location.href = "#/exam/configuration/DetailRoom#formView";
	// 				});
	// 				$('#iRoomDetail').before(c);
	// 			}
	// 		}
	// 	});
		
	// }
	,
	onDefaultChild: function() 
	{

	}
}