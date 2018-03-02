<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class BinusFestival extends BM_Controller {

    private $UAT_DB = 'UAT_DB';

    public function getTopicList() {
        $result = $this->sp('GetTopicList', array(), $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function getBinusianSchedule() {
        $arrayData = array(
            'BinusianId' => '1701300810'
        );

        $result = $this->sp('bn_BinusFestival_GetBinusianSchedule', $arrayData, $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function getBinusianMaterials() {
        $arrayData = array(
            'BinusianId' => '1701300810'
        );
        $result = $this->sp('bn_BinusFestival_GetBinusianMaterials', $arrayData, $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function getLecturerSchedule() {
        $arrayData = array(
            'LecturerID' => 'D1234'
        );
        $result = $this->sp('bn_BinusFestival_GetLecturerSchedule', $arrayData, $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function getLecturerMaterials() {
        $arrayData = array(
            'LecturerID' => 'D1234'
        );
        $result = $this->sp('bn_BinusFestival_GetLecturerMaterials', $arrayData, $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function getLecturerTopics() {
        $arrayData = array(
            'LecturerID' => 'D1234'
        );
        $result = $this->sp('bn_BinusFestival_GetTopics', $arrayData, $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function getLecturerData() {
        $arrayData = array(
            'LecturerID' => 'D1234'
        );
        $result = $this->sp('bn_BinusFestival_GetLecturerData', $arrayData, $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function uploadMaterial() {
        $error = "";
        $post = $this->rest->post();
        $this->config->load('apps');
        $directory = $this->config->item('upload_url');
        
        $binusID = '1701300810';
        $filename = array();
        $error = false;
        
        foreach ($_FILES as $file) 
        {
            $newFileName = date("YmdHis").$binusID."_".basename($file['name']);
            $dirname = $directory['binus_festival']. '\\';
            $filepath = $dirname. '\\' .$newFileName;

            /*print_r($filepath);
            die();*/

            $allowed = array('txt', 'pdf', 'ppt', 'xls', 'doc', 'pptx', 'xlsx', 'docx', 'rar', 'zip', 'jpg', 'jpeg', 'png', 'wav', 'mp3', 'mp4', 'avi', '3gp', 'mkv', 'mov', 'flv');
            
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
               if(!in_array(strtolower($ext),$allowed)){
                    $error = true;
               }else{
                    if (!file_exists($dirname)) {
                        mkdir($dirname, 0777, true);
                    }
                    
                    if(move_uploaded_file($file['tmp_name'], $filepath))
                    { 
                        $filename[] = $newFileName;
                    }
                    else
                    {
                        $error = true;
                    }

               }

        }
        
        $uploaddir = $directory['binus_festival']. "\\";
        $result = ($error) ? array('Status'=>'error','error' => 'There was an error uploading your files') : array('Status'=>'Success','filename' => $filename, 'location' => $filepath);
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function AddMaterial() {
        $post = $this->rest->post();
        $arrayData = array(
            'Institution'   => $post->Institution,
            'Campus'        => $post->Campus,
            'Acad_Career'   => $post->Acad_Career,
            'STRM'          => $post->STRM,
            'BinusianID'    => $post->BinusianID,
            'LecturerID'    => $post->LecturerID,
            'Lecturer'      => $post->Lecturer,
            'ScheduleConfigurationID' => $post->ScheduleConfigurationID,
            'Topic'         => $post->Topic,
            'Notes'         => $post->Notes,
            'Files'         => $post->Files
    
        );
        $result = $this->sp('bn_BinusFestival_InsertTopicMaterial', $arrayData, $this->UAT_DB)->result();

        return $this->load->view('json_view', array('json' => array(
            'status' => 'success'
        )));
    }

    public function getTopicConfiguration() {
        $post = $this->rest->post();
        $arrayData = array(
            'STRM' => $post->STRM,
            'KdKampus' => $post->KdKampus
        );
        $result = $this->sp('bn_BinusFestival_GetTopicConfigurationData', $arrayData, $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function getEventTypes() {
        $arrayData = array(
            'Institution' => 'BNS01'
        );
        $result = $this->sp('bn_BinusFestival_GetEventTypeByInstitution', $arrayData, $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function EditTopicAttribute() {
        $post = $this->rest->post();
        $arrayData = array(
            'MsPublishSystemId'   => $post->MsPublishSystemId,
            'Topic'               => $post->Topic,
            'EventType'           => $post->EventType,
            'Date'                => $post->Date,
            'StartTime'           => $post->StartTime,
            'EndTime'             => $post->EndTime,
            'Room'                => $post->Room,
            'User'                => '1701300810'
    
        );
        $result = $this->sp('bn_BinusFestival_UpdateTopicAttribute', $arrayData, $this->UAT_DB)->result();


        return $this->load->view('json_view', array('json' => array(
            'status' => 'success'
        )));
    }

    public function getTermPeriodNoCompact() {
        $result = $this->sp('bn_StudentService_Staff_GetTermPeriodNoCompact', array(), 'REPORT_DB')->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function getCampus() {
        $result = $this->sp('bn_BinusFestival_GetAllCampus', array(), $this->UAT_DB)->result();
        return $this->load->view('json_view',array('json'=>$result));
    }

    public function getLecturerByDepartment()
    {
        $post = $this->rest->post();

        $arrayData = array(
            'Department' => $post->Department
        );

        $result = $this->sp('bn_PeerReviewSitIn_GetLecturerByDepartment', $arrayData, 'LEC_SERV_DB')->result();
        return $this->load->view("json_view", array("json" => $result));
    }

    public function AssignLecturer() {
        $post = $this->rest->post();
        $arrayData = array(
            'ID'            => $post->ID,
            'BinusianID'    => $post->BinusianID,
            'LecturerID'    => $post->LecturerID,
            'Lecturer'      => $post->Lecturer,
            'Topic'         => $post->Topic,
            'User'          => '1701300810'
    
        );
        $result = $this->sp('bn_BinusFestival_InsertLecturerMapping', $arrayData, $this->UAT_DB)->result();


        return $this->load->view('json_view', array('json' => array(
            'status' => 'success'
        )));
    }

    public function DeleteTopicAttribute() {
        $post = $this->rest->post();
        $arrayData = array(
            'MsPublishSystemId' => $post->ID,
            'User'              => '1701300810'
    
        );
        $result = $this->sp('bn_BinusFestival_DeleteTopicAtribute', $arrayData, $this->UAT_DB)->result();


        return $this->load->view('json_view', array('json' => array(
            'status' => 'success'
        )));
    }

}

/* End of file BinusFestival.php */
/* Location: ./application/controllers/BinusFestival.php */
