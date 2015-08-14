<?php
class UsersController extends AppController {
	public $helpers = array('Js','Form', 'Session');
	public $components = array('Session','RequestHandler','Image');
	public $uses = array('Restaurant','User');
	public function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow('add','login','loginasweibo','current','logout','existuser','changepassword');
	}
	public function index() { 
		$this->User->recursive = 0;
		$this->set('users', $this->paginate());
		$this->set('_serialize', array('users'));
	}
	public function existuser($username =''){
		$data =$this->User->findByUsername($username);
		if($data == false)
			$this->set('user', 'false');
		else
			$this->set('user', 'true');
		$this->set('_serialize', array('user'));
	}
	public function view($id = null) {
		$this->User->id = $id;
		if (!$this->User->exists()) {
			throw new NotFoundException(__('Invalid user'));
		}
		$this->set('user', $this->User->read(null, $id));
		$this->set('_serialize', array('user'));
	}
	public function current(){
		CakeLog::write('activity', "in current");
		$this->User->id = $this->Auth->user('id');
		$userinfo = $this->User->read(null, $id);
		$this->set('user',array(
				'id'=> $userinfo['User']['id'],
				'username'=> $userinfo['User']['username'],
				'realname'=> $userinfo['User']['realname'],
				'role'=> $userinfo['User']['role'],
				'restaurant_id'=>$userinfo['User']['restaurant_id'],
				'avataurl'=>$userinfo['User']['avataurl'],
				'status'=>$userinfo['User']['status'],
				'mobilephone'=> $userinfo['User']['mobilephone'],
				'email'=> $userinfo['User']['email'],
				'sinaweiboname'=> $userinfo['User']['sinaweiboname'],
				'email'=> $userinfo['User']['email'],
				'gender'=> $userinfo['User']['gender'],
				'grade'=> $userinfo['User']['grade'],
				'credit'=> $userinfo['User']['credit']
		));
		$this->set('_serialize', array('user'));
	}
	
	public function uploadphoto(){
		//upload file less than 1MB
		$userid = $this->Auth->user('id');
		$url ="";
		if($url = $this->Image->uploadImage("user", $userid)){
			$this->User->read(null, $userid);
			$this->User->saveField('avataurl', $url);
			$this->set('data',array('url' => $url));
		}
		$this->set('_serialize', array('data'));
	}
	public function add() {
		if ($this->request->is('post')) {
			$this->User->create();
			$data = $this->request->data;
				
			$username = $data['User']['username'];
			$exist =$this->User->findByUsername($username);
			if($exist){
				$this->set('user', array());
				$this->set('_serialize', array('user'));
				return;
			}
			$data['User']['status'] =1;
			$data['User']['logintype']='basic';
			if($data['User']['role'] == 'seller'){
				$this->Restaurant->create();
				$rest =array();
				$rest['Restaurant']=array('region_id'=>'1');
				$restaurant = $this->Restaurant->save($rest);
				if($restaurant !=false){
					$data['User']['restaurant_id'] = $restaurant['Restaurant']['id'];
				}
			}
 			$result = $this->User->save($data);
			if ($result) {
				
				$newuser=array('username' => $result['User']['username'], 'id' => $result['User']['id'], 'role'=> $result['User']['role']);
				$this->set('user', $newuser);
				$this->set('_serialize', array('user'));
			} else {
				$this->set('user', $data);
				$this->set('_serialize', array('user'));
			}
		}
	}

	public function edit($id = null) {
		if($id == null)
			$this->User->id = $this->Auth->user('id');
		else
			$this->User->id = $id;
		if (!$this->User->exists()) {
			throw new NotFoundException(__('Invalid user'));
		}
		if ($this->request->is('post') || $this->request->is('put')) {
			unset($this->request->data['User']['password']);
			if ($this->User->save($this->request->data)) {
				echo "success";
			} else {
				$this->Session->setFlash(__('The user could not be saved. Please, try again.'));
			}
		} else {
			$this->request->data = $this->User->read(null, $id);
			unset($this->request->data['User']['password']);
		}
	}
	public function changepassword($oldpwd, $newpwd){
		if($oldpwd!=null && $newpwd!=null){
			$id =$this->Auth->user('id');
			$this->User->id = $id;
			$user =  $this->User->read(null, $id);
			if($this->Auth->password($oldpwd) == $user['User']['password']){
				$userid = $this->Auth->user('id');
				$this->User->read(null, $userid);
				if($this->User->saveField('password', $newpwd)){
					$this->set('auth', 'succeed');
					$this->set('_serialize', array('auth'));
					return;
				}else{
					$this->set('auth', 'failed');
					$this->set('_serialize', array('auth'));
					return;
				}
			}else{
				$this->set('auth', 'error');
				$this->set('_serialize', array('auth'));
				return;
			}
		}
		$this->set('auth', 'empty');
		$this->set('_serialize', array('auth'));
	}

	public function delete($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}
		$this->User->id = $id;
		if (!$this->User->exists()) {
			throw new NotFoundException(__('Invalid user'));
		}
		if ($this->User->delete()) {
			$this->Session->setFlash(__('User deleted'));
			$this->redirect(array('action' => 'index'));
		}
		$this->Session->setFlash(__('User was not deleted'));
		$this->redirect(array('action' => 'index'));
	}
	public function loginasweibo(){
		if($this->request->is('post')){
			$data = $this->request->data;
			$username = $data['User']['username'];
			$exist =$this->User->findByUsername($username);
			if($exist == false){
				$data['User']['role'] = 'user';
				$data['User']['status'] =1;
				$data['User']['logintype']='weibo';
				$result = $this->User->save($data);
			}
			if ($this->Auth->login()){
				$this->set('loggedin', 'true');
				$this->set('_serialize', array('loggedin'));
			} else {
				$this->set('loggedin', 'false');
				$this->set('_serialize', array('loggedin'));
			}
		}
	}
	public function login() {
		if ($this->request->is('post')) {
			if ($this->Auth->login()) {
				$this->set('loggedin', 'true');
				$this->set('_serialize', array('loggedin'));
			} else {
				$this->set('loggedin', 'false');
				$this->set('_serialize', array('loggedin'));
			}
		}
	}
	public function logout() {
		$this->Auth->logout();
		$this->set('response',array('logout' => 'true'));
		$this->set('_serialize', array('response'));
	}
}