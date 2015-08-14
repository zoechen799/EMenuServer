<?php
class InfomenusController extends AppController {
	public $helpers = array('Js','Form', 'Session');
	public $components = array('Session','RequestHandler');
	public function index() {
		$user = $this->Auth->user('role');
		$data = $this->Infomenu->findAllByUser_role($user);
		$this->set('menus', $data);
		$this->set('_serialize', array('menus'));
	}
}