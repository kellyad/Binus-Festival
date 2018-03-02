<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class General_Head_Prefect extends BM_Controller {

    private $examDB = 'EXAM_DB';
    private $lmsDB = 'LMS_DB';
    private $idNewDB = 'Binusian_ID_New';
    private $profileDB = 'Profile_DB';
    private $devProgDB = 'DEV_PROG_DB';
    private $satDB = 'SAT_DB';
    private $LEC_SERV_DB = 'LEC_SERV_DB';
    private $userMgmntDB = 'UserManagement';

    public function index() {
        $this->load->view('json_view', array('json' => array(
                'status' => 'invalid',
                'errno' => '404',
                'message' => 'invalid url'
        )));
    }

    public function getFilterData() {
        $request = $this->rest->post()->listField;
        $data = array();
        $functionName = "";
        for ($i = 0; $i < count($request); $i++) {
            $functionName = "get" . $request[$i];
            $data[$request[$i]] = $this->$functionName();
        }
        return $this->load->view("json_view", array("json" => $data));
    }
    public function  SaveGroupConfiguration() {
        $post = $this->rest->post();
        $result = $this->sp('[bn_BinusFestival_InsertOrUpdateGroupingConfiguration]', array( 
            'ParticipantGroupId'  => $post->ParticipantGroupID,
            'Session' => $post->Session, 
            'GroupBy' => $post->GroupBy,
            'EvenlyDivideByShift' => $post->DivideByShift,
            'EvenlyDivideByDay' => $post->DivideByDay,
            'EvenlyDivideByRoom' => $post->DivideByRoom,
            'Capacity' => $post->Capacity,  
            'BinusianID' => $_SESSION['employeeID']  ), 'EVENT_DB')->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function  DeleteParticipantGroupConfiguration() {
        $post = $this->rest->post();
        $result = $this->sp('[bn_BinusFestival_DeleteParticipantGroupConfiguration]', array( 
            'ParticipantGroupId'  => $post->ParticipantGroupID,
            'BinusianID' => $_SESSION['employeeID']  ), 'EVENT_DB')->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function  DeleteParticipantConfiguration() {
        $post = $this->rest->post();
        $result = $this->sp('[bn_BinusFestival_DeleteParticipantConfiguration]', array( 
            'ParticipantId'  => $post->ParticipantID,
            'BinusianID' => $_SESSION['employeeID']  ), 'EVENT_DB')->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function  DeleteScheduleConfiguration() {
        $post = $this->rest->post();
        $result = $this->sp('[bn_BinusFestival_DeleteScheduleConfiguration]', array( 
            'ScheduleConfigurationID'  => $post->ScheduleConfigurationID,
            'BinusianID' => $_SESSION['employeeID']  ), 'EVENT_DB')->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function getParticipantGroupConfig() {
        $post = $this->rest->post();
        $result = $this->sp('bn_BinusFestival_getParticipantGroupConfig', array( 'SystemID'  => $post->SystemID), 'EVENT_DB')->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function getSystemName() {
        $post = $this->rest->post();
        $result = $this->sp('bn_BinusFestival_GetSystemConfigurationName', array( 'SystemID'  => $post->SystemID), 'EVENT_DB')->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function GetGroupingConfiguration() {
        $post = $this->rest->post();
        $result = $this->sp('[bn_BinusFestival_GetGroupingConfigurationByID]', array(  'ParticipantGroupId'  => $post->ParticipantGroupID,
            'Session' => $post->Session), 'EVENT_DB')->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function GetScheduleConfigurationByID() {
        $post = $this->rest->post();
        $result = $this->sp('[bn_BinusFestival_GetScheduleConfigurationByID]', array(  'SCheduleConfigurationID'  => $post->ScheduleConfigurationID
            ), 'EVENT_DB')->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function getAcademicInstitutionJSON() {
        $result = $this->sp('bn_General_GetAllAcademicInstitution', array(), $this->lmsDB)->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function getAcademicCareer() {
        $post = $this->rest->post();
        $result = $this->sp('Staff_LMS_GetAcademicCareer', array( 'StaffID' => $_SESSION['employeeID'],'INSTITUTION' => $post->Institution), $this->lmsDB)->result();
        return $this->load->view("json_view", array("json" => $result));
    }
    public function getAcademicInstitution() {
        $result = $this->sp('bn_General_GetAllAcademicInstitution', array(), $this->lmsDB)->result();
        return $result;
    }

    public function getAllCourseType() {
        $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetAllCourseType', array('INSTITUTION' => $post->Institution,'ACAD_CAREER' => $post->AcademicCareer,'STRM' => $post->Term,'ACAD_ORG' =>($post->ACAD_ORG == '' )? null: $post->ACAD_ORG), $this->lmsDB)->result();
       return $this->load->view("json_view", array("json" => $result));
    }

    public function getCampusByID() {
        $result = $this->sp('Staff_SearchFilter_GetCampusesByID', array(), $this->lmsDB)->result();
        return $result;
    }
    public function getCampus() {
        $post = $this->rest->post();
        $result = $this->sp('Staff_SearchFilter_GetCampusesByInstitutionAcadCareer', array('INSTITUTION' => $post->Institution,'ACAD_CAREER' => $post->AcademicCareer), $this->lmsDB)->result();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function getFaculty() {
        $post = $this->rest->post();
        $result = $this->sp('STAFF_LMS_GetFaculty', array(
            'INSTITUTION' => $post->Institution,
            'ACAD_CAREER' => $post->AcademicCareer,
            'CAMPUS' => ($post->Campus == null )? $post->Campus :implode(",", $post->Campus),
            'STRM' => $post->Term)
        , $this->lmsDB)->result();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function getJurusan() {
        $post = $this->rest->post();
        $result = $this->sp('STAFF_LMS_GetJurusan', array(
            'INSTITUTION' => $post->Institution,
            'ACAD_CAREER' => $post->AcademicCareer,
            'ACAD_ORG' => $post->Faculty,
            'CAMPUS' => ($post->Campus == null )? $post->Campus :implode(",", $post->Campus),
            'STRM' => $post->Term), $this->lmsDB)->result();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function getAcademicCareerByID() {
        $result = $this->sp('Staff_HeadPrefect_GetDegreeByID', array('StaffID' => $_SESSION['employeeID'],'INSTITUTION' => $post->Institution), $this->lmsDB)->result();
        return $result;
    }

    public function getAcademicGroupByID() {
        $result = $this->sp('STAFF_HeadPrefect_GetAcadGroupByID', array('StaffID' => $_SESSION['employeeID']), $this->lmsDB)->result();
        return $result;
    }
    public function getAllAcademicGroup() {
        $result = $this->sp('STAFF_HeadPrefect_GetAllAcadGroup', array(), $this->lmsDB)->result();
        return $result;
    }

    public function getAcademicProgByGroup() {
        $post = $this->rest->post();
        $arrayData = array(
            'ACAD_GROUP' => $post->Acad_Group
        );
        $result = $this->sp('STAFF_HeadPrefect_GetProgbyGroup', $arrayData, $this->lmsDB)->result();
        return $result;
    }

    public function getAcademicProgByCareer() {
        $post = $this->rest->post();
        $arrayData = array(
            'Acad_Career' => $post->Acad_Career,
            'CAMPUS' => $post->CAMPUS
        );
        $result = $this->sp('STAFF_HeadPrefect_GetProgbyCareer', $arrayData, $this->lmsDB)->result();
        return $result;
    }

    public function getTermbyCareer() {
        $post = $this->rest->post();
        $arrayData = array(
           
        );
        $result = $this->sp('STAFF_HeadPrefect_GetFilteredTermbyCareer', $arrayData, $this->lmsDB)->result();
        return $result;
    }
    public function getPeriod() {
        $post = $this->rest->post();
        $arrayData = array(
            'INSTITUTION' => $post->Institution,
            'Acad_Career' => $post->AcademicCareer
        );
        $result = $this->sp('STAFF_HeadPrefect_GetFilteredTermbyCareerINSTITUTION', $arrayData, $this->lmsDB)->result();
        return $this->load->view("json_view", array("json" => $result));
    }

    public function getCourseAvailableClass() {
        $post = $this->rest->post();
        $arrayData = array(
            'ACAD_INSTITUTION' => $post->ACAD_INSTITUTION,
            'CAMPUS' => $post->CAMPUS,
            'ACAD_CAREER' => $post->Acad_Career,
            'STRM' => $post->STRM,
            'ACAD_ORG' => $post->ACAD_ORG
        );
        $result = $this->sp('STAFF_HeadPrefect_GetCoursebyClass', $arrayData, $this->lmsDB)->result();
        return $result;
    }
    public function getProgAndCourse() {
        $post = $this->rest->post();
        $arrayData = array(
            'ACAD_INSTITUTION' => $post->ACAD_INSTITUTION,
            'CAMPUS' => $post->CAMPUS,
            'ACAD_CAREER' => $post->Acad_Career,
            'STRM' => $post->STRM,
            'ACAD_GROUP' => $post->ACAD_GROUP
        );
        $result = $this->sp('STAFF_HeadPrefect_GetFilteredProgAndCourse', $arrayData, $this->lmsDB)->result();
        return $result;
    }

    public function getFilteredClassbyCourse() {
        $post = $this->rest->post();
        $arrayData = array(
            'ACAD_INSTITUTION' => $post->ACAD_INSTITUTION,
            'CAMPUS' => $post->CAMPUS,
            'ACAD_CAREER' => $post->Acad_Career,
            'STRM' => $post->STRM,
            'ACAD_ORG' => $post->ACAD_ORG,
            'CRSE_ID' => $post->CRSE_ID
        );
        $result = $this->sp('STAFF_HeadPrefect_GetFilteredClassbyCourse', $arrayData, $this->lmsDB)->result();
        return $result;
    }
    // public function getAllBinusian() {
    //      $post = $this->rest->post();
    //     $result = $this->sp('STAFF_HeadPrefect_GetAllBinusian', array(
    //         'INSTITUTION' => $post->Institution,
    //         'ACAD_CAREER' => $post->AcademicCareer,
    //         'ACAD_ORG' => $post->Faculty,
    //         'ACAD_PROG' => $post->Jurusan,
    //         'STRM' => $post->Term,
    //         'CAMPUS' => $post->Campus), 
    //         $this->lmsDB)->result();
    //    // print_r($result);die();
    //    return $this->load->view("json_view", array("json" => $result));
    // }
    public function getAllSystemPeriod() {
         $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetAllSystemPeriod', array(
            'ACAD_CAREER' => "RS1"//($post->AcademicCareer=='')?null : $post->AcademicCareer 
            ), 
            $this->lmsDB)->result();
       // print_r($result);die();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function saveParticipant() {
         $post = $this->rest->post();
         // print_r(array(
         //        'Include_INSTITUTION'   => $post->Include_INSTITUTION,
         //        'Include_ACAD_CAREER'   => $post->Include_ACAD_CAREER,
         //        'Include_CAMPUS'        => ($post->Include_CAMPUS == "" )? null: implode(",", $post->Include_CAMPUS),
         //        'Include_STRM'          => $post->Include_STRM,
         //        'Include_ACAD_ORG'      => ($post->Include_ACAD_ORG == "" )? null: $post->Include_ACAD_ORG,
         //        'Include_ACAD_PROG'     => ($post->Include_ACAD_PROG == "" )? null: implode(",", $post->Include_ACAD_PROG),
         //        'Include_ACAD_YEAR'     => ($post->Include_ACAD_YEAR == "")? null: implode(",", $post->Include_ACAD_YEAR),
         //        'Include_StatusSAT'     => ($post->Include_StatusSAT == "" )? null: $post->Include_StatusSAT,
         //        'Include_CRSE_ATTR'     => ($post->Include_CRSE_ATTR == "" )? null: $post->Include_CRSE_ATTR,
         //        'Include_CRSE_ID'       => ($post->Include_CRSE_ID == "" )? null: implode(",", $post->Include_CRSE_ID),
         //        'Exclude_INSTITUTION'   => ($post->Exclude_INSTITUTION == "" )? null: $post->Exclude_INSTITUTION,
         //        'Exclude_ACAD_CAREER'   => ($post->Exclude_ACAD_CAREER == "" )? null: $post->Exclude_ACAD_CAREER,
         //        'Exclude_CAMPUS'        => ($post->Exclude_CAMPUS == "" )? null: implode(",", $post->Exclude_CAMPUS),
         //        'Exclude_STRM'          => ($post->Exclude_STRM == "" )? null: $post->Exclude_STRM,
         //        'Exclude_ACAD_ORG'      => ($post->Exclude_ACAD_ORG == "" )? null: $post->Exclude_ACAD_ORG,
         //        'Exclude_ACAD_PROG'     => ($post->Exclude_ACAD_PROG == "" )? null: implode(",", $post->Exclude_ACAD_PROG),
         //        'Exclude_ACAD_YEAR'     => ($post->Exclude_ACAD_YEAR == "" )? null: implode(",", $post->Exclude_ACAD_YEAR),
         //        'Exclude_StatusSAT'     => ($post->Exclude_StatusSAT == "" )? null: $post->Exclude_StatusSAT,
         //        'Exclude_CRSE_ATTR'     => ($post->Exclude_CRSE_ATTR == "" )? null: $post->Exclude_CRSE_ATTR,
         //        'Exclude_CRSE_ID'       => ($post->Exclude_CRSE_ID == "" )? null: implode(",", $post->Exclude_CRSE_ID),
         //        'Exclude_System'        => ($post->Exclude_System == "" )? null: implode(",", $post->Exclude_System),
         //        'BinusianID'            => $_SESSION['employeeID']
         //    )); die();
            $data = $this->sp('STAFF_HeadPrefect_SaveParticipant', array(
                'Include_INSTITUTION'   => $post->Include_INSTITUTION,
                'Include_ACAD_CAREER'   => $post->Include_ACAD_CAREER,
                'Include_CAMPUS'        => ($post->Include_CAMPUS == "" )? null: implode(",", $post->Include_CAMPUS),
                'Include_STRM'          => $post->Include_STRM,
                'Include_ACAD_ORG'      => ($post->Include_ACAD_ORG == "" )? null: $post->Include_ACAD_ORG,
                'Include_ACAD_PROG'     => ($post->Include_ACAD_PROG == "" )? null: implode(",", $post->Include_ACAD_PROG),
                'Include_ACAD_YEAR'     => ($post->Include_ACAD_YEAR == "")? null: implode(",", $post->Include_ACAD_YEAR),
                'Include_StatusSAT'     => ($post->Include_StatusSAT == "" )? null: $post->Include_StatusSAT,
                'Include_CRSE_ATTR'     => ($post->Include_CRSE_ATTR == "" )? null: $post->Include_CRSE_ATTR,
                'Include_CRSE_ID'       => ($post->Include_CRSE_ID == "" )? null: implode(",", $post->Include_CRSE_ID),
                'Exclude_INSTITUTION'   => ($post->Exclude_INSTITUTION == "" )? null: $post->Exclude_INSTITUTION,
                'Exclude_ACAD_CAREER'   => ($post->Exclude_ACAD_CAREER == "" )? null: $post->Exclude_ACAD_CAREER,
                'Exclude_CAMPUS'        => ($post->Exclude_CAMPUS == "" )? null: implode(",", $post->Exclude_CAMPUS),
                'Exclude_STRM'          => ($post->Exclude_STRM == "" )? null: $post->Exclude_STRM,
                'Exclude_ACAD_ORG'      => ($post->Exclude_ACAD_ORG == "" )? null: $post->Exclude_ACAD_ORG,
                'Exclude_ACAD_PROG'     => ($post->Exclude_ACAD_PROG == "" )? null: implode(",", $post->Exclude_ACAD_PROG),
                'Exclude_ACAD_YEAR'     => ($post->Exclude_ACAD_YEAR == "" )? null: implode(",", $post->Exclude_ACAD_YEAR),
                'Exclude_StatusSAT'     => ($post->Exclude_StatusSAT == "" )? null: $post->Exclude_StatusSAT,
                'Exclude_CRSE_ATTR'     => ($post->Exclude_CRSE_ATTR == "" )? null: $post->Exclude_CRSE_ATTR,
                'Exclude_CRSE_ID'       => ($post->Exclude_CRSE_ID == "" )? null: implode(",", $post->Exclude_CRSE_ID),
                'Exclude_System'        => ($post->Exclude_System == "" )? null: implode(",", $post->Exclude_System),
                'ParticipantGroupID'    => $post->ParticipantGroupID,
                'ParticipantID'    => (!isset($post->ParticipantID) || $post->ParticipantID =="")?null:$post->ParticipantID,
                'BinusianID'            => $_SESSION['employeeID']
            ), 'EVENT_DB')->result();
       return $this->load->view("json_view", array("json" => $data));
    }
    public function GetParticipantByParticipantID() {
         $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetParticipantByParticipantID', array(
            'ParticipantID' => $post->ParticipantID), 
            'EVENT_DB')->result();
       // print_r($result);die();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function getAllCourseByAcad_Career_Faculty() {
         $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetAllCourses', array(
            'INSTITUTION' => $post->Institution,
            'ACAD_CAREER' => $post->AcademicCareer,
            'ACAD_ORG' => ($post->Faculty == '' )? null: $post->Faculty,
            'STRM' => $post->Term,
            'CRSE_ATTR' => ($post->CRSE_ATTR == '' )? null: $post->CRSE_ATTR), 
            $this->lmsDB)->result();
       // print_r($result);die();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function GetTotalParticipantByParticipantGroupID() {
         $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetTotalParticipantByParticipantGroupID', array(
            'ParticipantGroupID' => ($post->ParticipantGroupID=='')?null:$post->ParticipantGroupID), 
            $this->lmsDB)->result();
       // print_r($result);die();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function GetAllFacilityIDByParticipantGroupID() {
         $post = $this->rest->post();
        $result = $this->sp('bn_General_GetAllFacilityIDByParticipantGroupID', array(
            'ParticipantGroupID' => $post ->ParticipantGroupID), 
            'EVENT_DB')->result();

       // print_r($result);die();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function insertScheduleConfiguration() {
         $post = $this->rest->post();
        $result = $this->sp('bn_BinusFestival_InsertOrUpdateScheduleConfiguration', array(
            'ParticipantGroupID' => ($post->ParticipantGroupID=='')?null:$post->ParticipantGroupID,
            'Session' =>($post->SessionID=='')?null:$post->SessionID,
            'ScheduleConfigurationID' =>(!isset($post->ScheduleConfigurationID) || $post->ScheduleConfigurationID =="")?null:$post->ScheduleConfigurationID,
            'FACILITY_ID' =>($post->FACILITY_ID == "" )? null: implode(",", $post->FACILITY_ID),
            'StartDate' =>($post->StartDate=='')?null:$post->StartDate,
            'EndDate' => ($post->EndDate=='')?null:$post->EndDate,
            'StartTime' =>($post->StartTime=='')?null:$post->StartTime,
            'EndTime' =>($post->EndTime=='')?null:$post->EndTime,
            'ShiftDuration' =>($post->ShiftDuration=='')?null:$post->ShiftDuration,
            'PostDuration' =>($post->PostDuration=='')?null:$post->PostDuration,
            'SATPoints' => ($post->SATPoints=='')?null:$post->SATPoints,
            'Topic' =>($post->Topic=='')?null:$post->Topic,
            'EventTypeID' =>($post->EventTypeID=='')?null:$post->EventTypeID,
            'BinusianID' => $_SESSION['employeeID'] ),
            'EVENT_DB')->result();

       // print_r($result);die();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function getScheduleConfiguration() {
         $post = $this->rest->post();
        $result = $this->sp('bn_BinusFestival_GetScheduleConfiguration', array(
            'ParticipantGroupID' => ($post->ParticipantGroupID=='')?null:$post->ParticipantGroupID,
            'Session' =>($post->SessionID=='')?null:$post->SessionID),
            'EVENT_DB')->result();

       // print_r($result);die();
       return $this->load->view("json_view", array("json" => $result));
    }
    public function getCampusByParticipantGroupID(){
         $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetTotalParticipantByParticipantGroupID', array(
            'ParticipantGroupID' => ($post->ParticipantGroupID=='')?null:$post->ParticipantGroupID), 
            $this->lmsDB)->result();
       // print_r($result);die();
       return $this->load->view("json_view", array("json" => $result));
    }

    public function getCourse() {
        $result = $this->sp('Staff_SearchFilter_Course', array(), $this->lmsDB)->result();
        return $result;
    }

    public function getHeadPrefectClass() {
        $result = $this->sp('Staff_HeadPrefect_GetClass', array(), $this->lmsDB)->result();
        return $result;
    }

    public function getHeadPrefectFilterMandatory() {
        $result = $this->sp('Staff_HeadPrefect_GetFilterMandatory', array(), $this->lmsDB)->result();
        return $result;
    }

    public function getPhoneType() {
        $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetPhoneType', array(), $this->lmsDB)->result();
        return $result;
    }
    public function getEmailType() {
        $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetEmailType', array(), $this->lmsDB)->result();
        return $result;
    }
    public function getHeadPrefect(){
        $post = $this->rest->post();
        $arrayData = array(
            'Class' => $post->Class,
            'Course' => $post->Course,
            'Period' => $post->Period
        );
        $result = $this->sp('LECTURER_HeadPrefect_GetFilteredHeadPrefectPeople', $arrayData, $this->lmsDB)->result();
        $data = [];
        foreach ($result as $std) {
            $res = $this->sp("spr_getPhotoThumb", array('binusian_ID' => $std->BinusianID), "Binusian_ID_New")->result();
            if (empty($res))
                $photo = NULL;
            else
                $photo = $res[0]->Thumbnail;
            
            array_push($data, array(
                'HeadPrefectID'=>$std->HeadPrefectID,
                'NIM' =>$std->EXTERNAL_SYSTEM_ID,
                'BinusianID' => $std->BinusianID,
                'StudentName' => $std->StudentName,
                'GPA'=>$std->GPA,
                'Assignment'=>$std->Assignment,
                'Posts'=>$std->Posts,
                'Photo' => $photo)
            );
        }
        $this->load->view('json_view', array('json' => $data, 'status' => 'success'));
    }
    public function get_phonemail_student() {
        $post = $this->rest->post();
        $whereDetail = array(
            'BinusianID' => $post->binusianID
        );
        $phone = $this->sp('LECTURER_HeadPrefect_GetStudentPhonebyNIM', $whereDetail, 'LMS_DB');
        $detailPhone = $phone->result();
        $email = $this->sp('LECTURER_HeadPrefect_GetStudentEmailbyNIM', $whereDetail, 'LMS_DB');
        $detailEmail = $email->result();
        $data = array(
            'detailPhone' => $detailPhone,
            'detailEmail' => $detailEmail
        );
        $this->load->view('json_view', array('json' => $data, 'status' => 'success'));
    }
    public function getHeadPrefectFilterStatus() {
        $result = $this->sp('Staff_HeadPrefect_GetFilterStatus', array(), 'LMS_DB')->result();
       // print_r($result); die();
        return $result;
    }
    public function getAvailableEmailTypeBinusian(){
        $post = $this->rest->post();
        $result = $this->sp('Lecturer_HeadPrefect_GetAvailableEmailTypeBinusian', array('BinusianID'=>$post->BinusianID), $this->lmsDB)->result();
        return $result;
    }
    public function getAvailablePhoneTypeBinusian(){
        $post = $this->rest->post();
        $result = $this->sp('Lecturer_HeadPrefect_GetAvailablePhoneTypeBinusian', array('BinusianID'=>$post->BinusianID), $this->lmsDB)->result();
        return $result;
    }
    public function getAllBinusian() {
        $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetAllBinusian', array('INSTITUTION' => $post->Institution, 'ACAD_CAREER' => $post ->AcademicCareer,'STRM' => $post->Term, 'ACAD_ORG' =>($post->ACAD_ORG == '' )? null: $post->ACAD_ORG,'ACAD_PROG' => ($post->ACAD_PROG == null )? $post->ACAD_PROG :implode(",", $post->ACAD_PROG), 'CAMPUS' => ($post->Campus == null )? $post->Campus :implode(",", $post->Campus)), $this->lmsDB)->result();
        return  $this->load->view("json_view", array("json" => $result));
    }
    public function getAllSystemExclude() {
        $post = $this->rest->post();
        $result = $this->sp('STAFF_HeadPrefect_GetAllSystemExclude', array('SystemID' => $post->SystemID), 'EVENT_DB')->result();
        return  $this->load->view("json_view", array("json" => $result));
    }
    public function getHeadPrefectConfiguration(){
        $post = $this->rest->post();
        $arrayData = array(
            'Class' => $post->Class,
            'Course' => $post->Course,
            'Period' => $post->Period
        );
        $result = $this->sp('LECTURER_HeadPrefect_GetFilteredHeadPrefect', $arrayData, $this->lmsDB)->result();
        $data = [];
        foreach ($result as $std) {
            $res = $this->sp("spr_getPhotoThumb", array('binusian_ID' => $std->BinusianID), "Binusian_ID_New")->result();
            if (empty($res))
                $photo = NULL;
            else
                $photo = $res[0]->Thumbnail;
            
            array_push($data, array(
                'HeadPrefectID'=>$std->HeadPrefectID,
                'BinusianID' => $std->BinusianID,
                'StudentName' => $std->StudentName,
                'GPA'=>$std->GPA,
                'Assignment'=>$std->Assignment,
                'Posts'=>$std->Posts,
                'Photo' => $photo)
            );
        }
        
        $configuration = $this->sp('LECTURER_HeadPrefect_GetConfigurationDate', $arrayData, $this->lmsDB)->row();
        $payload=array(
            'headprefect'=>$data,
            'configuration'=>$configuration
        );
        $this->load->view('json_view', array('json' => $payload, 'status' => 'success'));
    }
    public function getClassType() {
        $post = $this->rest->post();
        $arrayData = array(
            'INSTITUTION' => $post->ACAD_INSTITUTION,
            'CAMPUS' => $post->CAMPUS,
            'CAREER' => $post->Acad_Career,
            'GROUP'=>$post->ACAD_GROUP,
            'STRM'=>$post->STRM
        );
        $result = $this->sp('Staff_HeadPrefect_GetSSRComponent', $arrayData, $this->lmsDB)->result();
        return $result;
    }
    public function getOrgAndClass(){
        $post = $this->rest->post();
        $arrayData = array(
            'INSTITUTION' => $post->ACAD_INSTITUTION,
            'STRM' => $post->STRM,
            'CAMPUS' => $post->CAMPUS,
            'CAREER' => $post->Acad_Career,
            'GROUP'=>$post->ACAD_GROUP,
            'SSR_COMPONENT'=>$post->SSR_COMPONENT
        );
        $result = $this->sp('STAFF_HeadPrefect_GetFilteredClass', $arrayData, $this->lmsDB)->result();
        return $result;
    }
    public function getAcadOrg(){
        $post = $this->rest->post();
        $arrayData = array(
         
        );
        $result = $this->sp('STAFF_HeadPrefect_GetAcadOrg', $arrayData, $this->lmsDB)->result();
        return $result;
    }
}

/* End of file General_Head_Prefect.php */
/* Location: ./application/controllers/General_Head_Prefect.php */
