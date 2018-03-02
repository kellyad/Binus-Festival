<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class HeadPrefect_Configuration extends BM_Controller {
    public function __construct() {
        parent::__construct();
        $this->_BinusID = $_SESSION['employeeID'];
    }

    public function get_filtered_configuration() {
        $post = $this->rest->post($input_type);
        $where = array(
            'INSTITUTION' => $post->ACAD_INSTITUTION,
            'CAMPUS' => $post->CAMPUS,
            'CAREER' => ($post->Acad_Career=='All'?'':$post->Acad_Career),
            'ORG' => $post->ACAD_ORG,
            'CRSE_ID' => ($post->CRSE_ID=='All'?'':$post->CRSE_ID),
            'Mandatory' => ($post->Mandatory == ''||$post->Mandatory == 'All' ? null : (($post->Mandatory == "Yes" ? 1 : ($post->Mandatory == "No"?0:"")))),
            'Period' => $post->Period
        );
        $res = $this->sp('STAFF_HeadPrefect_GetFilteredHeadPrefectConfiguration', $where, 'LMS_DB');
        $data = $res->result();
        $this->load->view('json_view', array('json' => $data, 'status' => 'success'));
    }

    public function get_single_configuration($id = '') {
        $qHeader = $this->sp('STAFF_HeadPrefect_GetSingleConfiguration', array('HeadPrefectConfigurationID' => $id), 'LMS_DB');
        $header = $qHeader->row();
        $qDetail = $this->sp('STAFF_HeadPrefect_GetSingleConfigurationDetail', array('HeadPrefectConfigurationID' => $id), 'LMS_DB');
        $detail = $qDetail->result();
        $payload = array(
            'header' => $header,
            'detail' => $detail
        );
        $this->load->view('json_view', array('json' => $payload, 'status' => 'success'));
    }
    public function create_configurationfest() {
        $post = $this->rest->post($input_type);
         $XMLCheckbox = '<ValidateClassCheckbox>';
            foreach($post->detail as $p)
            {
                $XMLCheckbox .= '<Data>';
                $XMLCheckbox .= '<ID>'.$p->dataID.'</ID>';
                $XMLCheckbox .= '<SystemName>'.$p->System.'</SystemName>';
                $XMLCheckbox .= '<Period>'.$p->Period.'</Period>';
                $XMLCheckbox .= '</Data>';
            }
        $XMLCheckbox .= '</ValidateClassCheckbox>';
        $data = $this->sp('STAFF_Event_SystemConfiguration', array(
            "XMLCheckbox" => $XMLCheckbox,
            "BinusianID" => $this->_BinusID
        ), 'EVENT_DB')->result();
         $this->load->view('json_view', array('json' => $data, 'status' => 'success'));
    }
    public function getFilterParticipantGroup() {
        $post = $this->rest->post();
       
        $data = $this->sp('STAFF_Event_GetParticipantGroupConfigurationByID', array(
            "ParticipantGroupID" => $post->ParticipantGroupID
        ), 'EVENT_DB')->result();
         $this->load->view('json_view', array('json' => $data, 'status' => 'success'));
    }
    public function addParticipantGroupConfiguration() {
        $post = $this->rest->post();
         
        $data = $this->sp('STAFF_Event_AddParticipantConfiguration', array(
            "ParticipantGroupID" => !isset($post->ParticipantGroupID)? null:$post->ParticipantGroupID,
            "totalSession" => $post->totalSession,
            "SystemID" => $post->SystemID,
            "ParticipantGroupName" => $post->ParticipantGroupName,
            "shiftbyValue" => $post->shiftbyValue,
            "BinusianID" => $this->_BinusID
        ), 'EVENT_DB')->result();
         $this->load->view('json_view', array('json' => $data, 'status' => 'success'));
    }
    public function getParticipantGroupConfiguration() {
        $post = $this->rest->post();
         
        $data = $this->sp('STAFF_Event_GetParticipantGroupConfiguration', array(
            "SystemID" => $post->SystemID
        ), 'EVENT_DB')->result();
         $this->load->view('json_view', array('json' => $data, 'status' => 'success'));
    }
    public function GetAllParticipantByParticipantGroupID() {
        $post = $this->rest->post();
         
        $data = $this->sp('STAFF_HeadPrefect_GetAllParticipantByParticipantGroupID', array(
            "ParticipantGroupID" => $post->ParticipantGroupID
        ), 'EVENT_DB')->result();
         $this->load->view('json_view', array('json' => $data, 'status' => 'success'));
    }
    public function getSystemConfiguration() {
        $post = $this->rest->post($input_type);
        $where = array(
            'Period' => $post->Period
        );
        $res = $this->sp('STAFF_Event_GetSystemConfiguration', $where, 'EVENT_DB');
        $data = $res->result();
        $this->load->view('json_view', array('json' => $data, 'status' => 'success'));
    }
    public function create_configuration() {
        $post = $this->rest->post($input_type);
        $this->load->library('validation');
        $v = &$this->validation;
        $v->set_data($post);
        $v->set_rules('AcademicInstitution', 'Institution', 'required');
        $v->set_rules('ddlCampus', 'Campus', 'required');
        $v->set_rules('DegreeByID', 'Degree', 'required');
        $v->set_rules('AcadGroup', 'Faculty', 'required');
        $v->set_rules('ddlPeriod', 'Period', 'required');
        $v->set_rules('startDate', 'Start Date', 'required');
        $v->set_rules('endDate', 'End Date', 'required');
        if ($v->run()) {
            $this->load->helper('general');
			
			$Checkexists=0;
			if(isset($post->detail))
			{
				foreach($post->detail as $row)
				{
					$dataValidation = array(
						'INSTITUTION' => $post->AcademicInstitution,
						'CAMPUS' => $post->ddlCampus,
						'CAREER' => $post->DegreeByID,
						'GROUP' => $post->AcadGroup,
						'PERIOD' => $post->ddlPeriod,
						'CRSE_ID'=> $row->CRSE_ID,
						'CLASS_NBR' => $row->CLASS_NBR
						
					);
					$validate = $this->sp('STAFF_HeadPrefect_ValidateConfiguration', $dataValidation, 'LMS_DB');
					if($validate->num_rows<0)
					{
						$Checkexists=1;
					}
				}
			}
            if ($Checkexists==1){//($validate->num_rows<0) {
                $result = array('status' => 'invalid', 'message' => 'Some/all of the class has been configured');
            } else {
                $data = array(
                    'UserIn' => $_SESSION['employeeID'],
                    'ACAD_INSTITUTION' => $post->AcademicInstitution,
                    'ACAD_CAREER' => $post->DegreeByID,
                    'CAMPUS' => $post->ddlCampus,
                    'STRM' => $post->ddlPeriod,
					'ACAD_GROUP' => $post->AcadGroup,
                    'StartDate' => $post->startDate,
                    'EndDate' => $post->endDate,
                    'SSR_COMPONENT' => $post->ddlClassType
                );
                $newID = $this->sp('STAFF_HeadPrefect_CreateHeadPrefectConfiguration', $data, 'LMS_DB')->row('NewID');
                if (isset($post->detail)) {
                    foreach ($post->detail as $row) {
                        $dataDetail = array(
                            'UserIn' => $_SESSION['employeeID'],
                            'HeadPrefectConfigurationID' => $newID,
                            'ACAD_ORG' => $row->ACAD_ORG,
                            'CRSE_ID' => $row->CRSE_ID,
							'CRSE_OFFER_NBR'=>$row->CRSE_OFFER_NBR,
                            'SUBJECT' => $row->SUBJECT,
                            'CATALOG_NBR' => $row->CATALOG_NBR,
                            'Mandatory' => $row->Mandatory,
                            'CLASS_NBR' => $row->CLASS_NBR
                        );
                        $res = $this->sp('STAFF_HeadPrefect_CreateConfigurationDetail', $dataDetail, 'LMS_DB');
                    }
                }
                $result = array('status' => 'success', 'message' => 'Your data have been saved. Thank you.');
            }
        } else {
            $result = array('status' => 'invalid', 'error' => $v->error_array());
        }
        $payload = array('json' => $result);
        return $this->load->view('json_view', $payload);
    }

    public function edit_configuration() {
        $post = $this->rest->post($input_type);
        $this->load->library('validation');
        $v = &$this->validation;
        $v->set_data($post);
        $v->set_rules('AcademicInstitution', 'Institution', 'required');
        $v->set_rules('ddlCampus', 'Campus', 'required');
        $v->set_rules('DegreeByID', 'Degree', 'required');
        $v->set_rules('AcadGroup', 'Faculty', 'required');
        $v->set_rules('ddlPeriod', 'Period', 'required');
        $v->set_rules('startDate', 'Start Date', 'required');
        $v->set_rules('endDate', 'End Date', 'required');
        if ($v->run()) {
            $this->load->helper('general');
            $data = array(
                'UserUp' => $_SESSION['employeeID'],
                'ACAD_INSTITUTION' => $post->AcademicInstitution,
                'ACAD_CAREER' => $post->DegreeByID,
                'CAMPUS' => $post->ddlCampus,
                'STRM' => $post->ddlPeriod,
				'ACAD_GROUP'=>$post->AcadGroup,
                'StartDate' => $post->startDate,
                'EndDate' => $post->endDate,
                'HeadPrefectConfigurationID' => $post->ID,
                'SSR_COMPONENT' => $post->ddlClassType
            );
            $this->sp('STAFF_HeadPrefect_EditHeadPrefectConfiguration', $data, 'LMS_DB');
            $newID = $post->ID;
            $this->sp('STAFF_HeadPrefect_ClearHeadPrefectConfigurationDetail', array('HeadPrefectConfigurationID' => $post->ID), 'LMS_DB');
            if (isset($post->detail)) {
                foreach ($post->detail as $row) {
                    $dataDetail = array(
                        'UserIn' => $_SESSION['employeeID'],
						'HeadPrefectConfigurationID' => $newID,
						'ACAD_ORG' => $row->ACAD_ORG,
						'CRSE_ID' => $row->CRSE_ID,
						'CRSE_OFFER_NBR'=>$row->CRSE_OFFER_NBR,
						'SUBJECT' => $row->SUBJECT,
						'CATALOG_NBR' => $row->CATALOG_NBR,
						'Mandatory' => $row->Mandatory,
						'CLASS_NBR' => $row->CLASS_NBR
                    );
                    $res = $this->sp('STAFF_HeadPrefect_CreateConfigurationDetail', $dataDetail, 'LMS_DB');
                }
            }
            $result = array('status' => 'success', 'message' => 'Your data have been saved. Thank you.');
        } else {
            $result = array('status' => 'invalid', 'error' => $v->error_array());
        }
        $payload = array('json' => $result);
        return $this->load->view('json_view', $payload);
    }

    public function delete_configuration() {
        $post = $this->rest->post($input_type);
        $res = $this->sp('STAFF_HeadPrefect_DeleteHeadPrefectConfiguration', array('HeadPrefectConfigurationDetailID' => $post->ID, 'UserUp' => $_SESSION['employeeID']), 'LMS_DB');
        $result = array('status' => 'success');
        $payload = array('json' => $result);
        return $this->load->view('json_view', $payload);
    }

}

/*End of file HeadPrefect_Configuration.php*/
/*Location:./controller/staff/HeadPrefect_Configuration.php*/