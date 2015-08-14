<?php
class RegionsController extends AppController {
	public $helpers = array('Js','Form', 'Session');
	public $components = array('Session','RequestHandler');
	
	public function index() {
		//Load paginated data
		$data = $this->paginate('Region');
		$this->set('Regions', $data);
		$this->set('_serialize', array('Regions'));
	}
	public function view($id=null){
		$this->Region->id = $id;
		$this->set('Region' , $this->Region->read());
		$this->set('_serialize', array('Region'));
	}
	public function isAuthorized($user) {
		return true;
	}
}