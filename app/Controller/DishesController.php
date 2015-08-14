<?php
class DishesController extends AppController {
	public $helpers = array('Js','Form', 'Session');
	public $uses = array('Dish','Dish_category','User','Dish_picture' ,'Comment');
	public $components = array('Session','RequestHandler','Image');
	
	public function beforeFilter() {
		$this->Auth->allow('category','listcategory','listphoto','addphoto','comments');
		parent::beforeFilter();
	}
	
	public function index() {
		// extra bindings
		$dishPhotos = $this->passedArgs['dish_pictures'];
		$comments = $this->passedArgs['comments'];
		//query parameters
		$restaurantID = $this->passedArgs['restaurant_id'];
		$dishCategory = $this->passedArgs['category_id'];
		if($dishPhotos !=null && $dishPhotos != '1' )// list all photos related to this dish if dishPhoto doesn't equal to 1
		{
			$this->Dish->bindModel(
					array('hasMany' => array(
											'Dish_picture' => array(
																	'className' => 'Dish_picture',
																		'foreighKey' => 'dish_id')
											) 
					),false);
		}
		$results = null;
		if($restaurantID != null || $dishCategory!=null)
		{
			$conditions = array();
			if($restaurantID!=null)
				$conditions["Dish.restaurant_id"] = $restaurantID;
			if($dishCategory !=null)
				$conditions["Dish.category_id"] = $dishCategory;
			$results = $this->Dish->find('all', array('conditions' => $conditions));
		}else{ 
			$results = $this->Dish->find('all');
		}
		if($dishPhotos == '1'){
			for($i=0; $i<sizeof($results); $i++){
				$dish_id = $results[$i]['Dish']['id'];
				$logo_id = $results[$i]['Dish']['logo_id'];
				if($logo_id == null || $logo_id ==0){
					$photo = $this->Dish_picture->find('first', array(
							'conditions' => array('Dish_picture.dish_id' => $dish_id),
							'order' => array('Dish_picture.id' => 'desc')
					));
					$results[$i]['Dish']['photo'] =$photo['Dish_picture']['filepath'];
				}else{
					$photo = $this->Dish_picture->find('first', array(
							'conditions' => array('Dish_picture.id' => $logo_id)
					));
					$results[$i]['Dish']['photo'] =$photo['Dish_picture']['filepath'];
				}
			}
		}
		if($comments !=null){
			$num = (int)$comments;
			for($i=0; $i<sizeof($results); $i++){
				$dish_id = $results[$i]['Dish']['id'];
				$data = $this->getComments($dish_id, $num);
				$results[$i]['Dish']['comments'] =$data;
			}
		}
		$this->set('Dishes', $results);
		$this->set('_serialize', array('Dishes'));
	}
	public function comments($dishid = null){
		$data = $this->getComments($dishid, 1000);
		$this->set('Comments' , $data);
		$this->set('_serialize', array('Comments'));
	}
	public function addcomment(){
		if($this->request->is('post')){
			echo "s1";
			$this->Comment->create();
			echo "s2";
			$data = $this->request->data;
			$userid = $this->Auth->user('id');
			echo "s3";
			$data['Comment']['user_id'] = $userid;
			echo "s4";
			
			$result =$this->Comment->save($data);
			echo "s5";
			echo $result;
			if($result!=false){
				$this->set('status', 'true');
				$this->set('_serialize', array('status'));
			}else{
				$this->set('status', 'false');
				$this->set('_serialize', array('status'));
			}
		}
	}
	private function getComments($dishid =null, $limit=null){
		$data = $this->Comment->find('all', array(
				'conditions' => array(
						'Comment.entity' => 'dish',
						'Comment.entity_id' => $dishid
				),
				'order' =>array('Comment.id' => 'desc'),
				'limit' => $limit
		));
		for($j=0; $j< sizeof($data); $j++){
			$uid = $data[$j]['Comment']['user_id'];
			$this->User->id= $uid;
			$u = $this->User->read();
			$data[$j]['Comment']['username'] = $u['User']['username'];
		}
		if($data == null)
			$data= array();
		return $data;
	}
	public function view($id=null){
		$this->Dish->id = $id;
		$data =$this->Dish->read();
		$this->set('Dish' , $data["Dish"]);
		$this->set('_serialize', array('Dish'));
	}
	public function category($id=null){
		$this->Dish_category->id = $id;
		$this->set('Dish_category',$this->Dish_category->read());
		$this->set('_serialize', array('Dish_category'));
	}
	public function listcategory($restaurantid = null){
		$cats =$this->Dish_category->findAllByRestaurant_id($restaurantid);
		$this->set('Dish_categories',$cats);
		$this->set('_serialize', array('Dish_categories'));
	}
	
	public function addcategory(){
		if($this->request->is('post')){
			$data = $this->request->data;
			$this->Dish_category->create();
			if($this->Dish_category->save($data)){
				$this->set('status', 'true');
				$this->set('_serialize', array('status'));
				return;
			}
		}
		$this->set('status', 'false');
		$this->set('_serialize', array('status'));
	}
	
	public function editcategory($id= null){
		if($this->request->is('post') ){
				if($id!=null)
					$this->Dish_category->read(null, $id);
				else {
					$data = $this->request->data;
					$id = $data['Dish_category']['id'];
					$this->Dish_category->read(null, $id);
				}
				if($this->Dish_category->save($this->request->data)){
					$this->set('status', 'true');
					$this->set('_serialize', array('status'));
				}else{
					$this->set('status', 'false');
					$this->set('_serialize', array('status'));
				}
		}
	}
	
	public function add(){
		if($this->request->is('post')){
			$this->Dish->create();
			$this->User->id = $this->Auth->user('id');
			$userinfo = $this->User->read(null, $id);
			if($userinfo['User']['restaurant_id'] != null){
				$data = $this->request->data;
				$data['restaurant_id'] = $userinfo['User']['restaurant_id'];
				if($this->Dish->save($data)){
					$this->Session->setFlash('YES');
					$this->set('status', 'succeed');
					$this->set('_serialize', array('status'));
					return;
				}else{
					$this->set('status', 'failed to save');
					$this->set('_serialize', array('status'));
					return;
				}
			}
			$this->Session->setFlash('NO');
			$this->set('status', 'incorrect user');
			$this->set('_serialize', array('status'));
		}
	}
	public function edit($id = null){
		if($this->request->is('post') ){
			if($id!=null)
				$this->Dish->read(null, $id);
			else {
				$data = $this->request->data;
				$id = $data['Dish']['id'];
				$this->Dish->read(null, $id);
			}
			if($this->Dish->save($this->request->data)){
				$this->set('status', 'true');
				$this->set('_serialize', array('status'));
			}else{
				$this->set('status', 'false');
				$this->set('_serialize', array('status'));
			}
		}
	}
	public function delete($id = null) {
		if (!$this->request->is('post')) {
			$this->set('status', 'method not allowed');
		}else{
			if($id!=null){
				$this->Dish->id = $id;
			}else{
				$data = $this->request->data;
				$id = $data['Dish']['id'];
				$this->Dish->id = $id;
			}
			if (!$this->Dish->exists()) {
				$this->set('status', 'method not allowed');
			}
			else if ($this->Dish->delete()) {
				$this->set('status', 'success');
			}
		}
		$this->set('_serialize', array('status'));
	}
	
	public function listphoto($dishid = null){
		if($dishid != null){
			$photos = $this->Dish_picture->find('all', array(
					'conditions' => array('Dish_picture.dish_id' => $dishid)
			));
			$this->set('photos' , $photos);
		}
		$this->set('_serialize', array('photos'));
	}
	public function uploadphoto($dishid = null){
		if($dishid!=null ){
			$url ="";
			if($url = $this->Image->uploadImage("dish", $dishid)){
				$this->addphoto($dishid, $url);
			}
		}
	}
	private function addphoto($dishid=null, $url=null){
		if($url){
			$dishpic = array("Dish_picture" =>array(
					"name" => "",
					"hashcode" =>"1",
					"filepath" => $url,
					"dish_id" => $dishid
			));
			$r = $this->Dish_picture->save($dishpic);
			if($r && $r['Dish_picture']['id']){
				$this->Dish->id = $dishid;
				$this->Dish->read(null, $dishid);
				if($this->Dish->saveField('logo_id', $r['Dish_picture']['id'])){
					$this->set('dish_picture', $r);
					$this->set('_serialize', array('dish_picture'));
				}
			}
		}
	}
}