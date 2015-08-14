<?php
class BlogsController extends AppController {
	public $helpers = array('Js','Form', 'Session');
	public $uses = array('Blog', 'User');
	public $components = array('Session','RequestHandler');
	
	public function beforeFilter() {
		$this->Auth->allow('view');
		parent::beforeFilter(); 
	}
	public function index() {
		$this->set('Blogs', $this->Blog->find('all'));
		$this->set('_serialize', array('Blogs'));
	}
	
	public function view($id=null){
		$this->Blog->id = $id;
		$blog = $this->Blog->read();
		$this->set('Blog' , $blog);
		$author_id = $blog['Blog']['id'];
		$appUser = $this->User->findAllById($author_id);
		$this->set('User', $appUser);
		$this->set('_serialize', array('Blog','User'));
	}
	public function add(){
		CakeLog::write('activity', "add now");
		$blogdata = $this->request->data;
		$blogdata['Blog']['created']=date("Y-m-d H:i:s");
		$blogdata['Blog']['modified']=date("Y-m-d H:i:s");
		$blogdata['Blog']['author_id']='1';
		if($this->request->is('post')){
			$this->Blog->create();
			if($this->Blog->save($blogdata)){
				$this->Session->setFlash('true');
				$id = $this->Blog->id;
				$this->redirect(array('action' => 'view',$id));
			}else{
				$this->Session->setFlash('false');
			}
		}
	}
}