<?php
class OrdersController extends AppController {
	public $helpers = array('Js','Form', 'Session');
	public $components = array('Session','RequestHandler');
	public $uses = array('Order','Order_detail','Dish','Dish_picture','Restaurant','User');
	public $paginate = array();
	public function beforeFilter() {
		$this->Auth->deny('view','index','add');
		parent::beforeFilter();
	}
	public function index() {
		$queryparams = array_keys($this->passedArgs);
		$criteria = array();
		for($i=0; $i<count($queryparams); $i++)
		{
			$parakey = $queryparams[$i];
			$paraval = $this->passedArgs[$parakey];
			if($parakey == 'status'){
				if($criteria['OR'] == null){
					$criteria['OR']= array();
				}
				array_push($criteria['OR'], array('Order.status' => $paraval));
			}
		}
		$userid = $this->Auth->user('id');
		$this->User->id = $userid;
		$userinfo = $this->User->read(null, $id);
		$role = $userinfo['User']['role'];
		if($role == 'user')
			$criteria['Order.User_id'] = $userid;
		else if($role =='seller')
			$criteria['Order.Restaurant_id'] = $userinfo['User']['restaurant_id'];
		
		$this->Order->unbindModel(
        		array('hasMany' => array('detail'))
    		);
		$data = $this->Order->find('all',array('conditions'=>$criteria, 'order'=>array('Order.createtime' => 'desc')));
		for($m=0; $m<sizeof($data); $m++){
			$restaurantid = $data[$m]['Order']['restaurant_id'];
			$rest =$this->Restaurant->findById($restaurantid);
			if(sizeof($rest) >0){
				$data[$m]['Order']['restaurant_name'] = $rest['Restaurant']['name'];
			}
			$uid = $data[$m]['Order']['user_id'];
			$this->User->id = $uid;
			$userinfo = $this->User->read(null, $uid);
			$data[$m]['Order']['user_name'] = $userinfo['User']['username'];
		}
		$this->set('orders' , $data);
		$this->set('_serialize', array('orders'));
	}
	
	public function view($id=null){
		$this->Order->id = $id;
		$data =$this->Order->read();
		$rest =$this->Restaurant->findById($data['Order']['restaurant_id']);
		$data['Order']['restaurant_name']= $rest['Restaurant']['name'];
		$data['Order']['restaurant_address']= $rest['Restaurant']['address'];
		for($i=0; $i< sizeof($data['detail']); $i++){
			$dishid = $data['detail'][$i]['dish_id'];
			$dish = $this->Dish->findById($data['detail'][$i]['dish_id'] );
			$data['detail'][$i]['name'] = $dish['Dish']['name'];
			$data['detail'][$i]['price'] = $dish['Dish']['price'];
			$data['detail'][$i]['sum'] = intval($data['detail'][$i]['quantity']) * floatval($dish['Dish']['price']) ;
			if($data['detail'][$i]['remark'] == null)
				$data['detail'][$i]['remark']="";
			$pics = $this->Dish_picture->findAllByDish_id($dishid);
			if(sizeof($pics) > 0)
			$data['detail'][$i]['pic'] = $pics[0]['Dish_picture']['filepath'];
		}
		$this->set('Order' , $data);
		$this->set('_serialize', array('Order'));
	}
	public function test(){
		$this->log("in test");
		$this->set('test' , "true");
		$this->set('_serialize', array('test'));
	}
	public function add(){
		if ($this->request->is('post')){
			$data = $this->request->data;
			$data['Order']['createtime'] = date("Y-m-d H:i:s");
			$userid = $this->Auth->user('id');
			$data['Order']['user_id']=$userid;
			$resdata = array();
			$resdata['status'] = false;
			$result = $this->Order->saveAssociated($data);
			if($result){
				$resdata['id'] = $this->Order->id;
				$resdata['status'] = true;
			}
			$this->set('result' , $resdata);
			$this->set('_serialize', array('result'));
		}
	}
	public function edit($id=null){
		if ($this->request->is('post') &&$id!=null){
			$this->Order->read(null, $id);
			if($this->Order->save($this->request->data)){
				$this->set('status', 'true');
				$this->set('_serialize', array('status'));
			}else{
				$this->set('status', 'false');
				$this->set('_serialize', array('status'));
			}
		}
	}
}