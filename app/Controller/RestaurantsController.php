<?php
class RestaurantsController extends AppController {
	public $helpers = array('Js','Form', 'Session');
	public $uses = array('Restaurant', 'Restaurant_category','Restaurant_picture','Restaurant_coordinate');
	public $components = array('Session','RequestHandler','Image');
	public $paginate = array();
	public function beforeFilter() {
		$this->Auth->allow('query','categories','category','coordinate');
		parent::beforeFilter();
	}
	public function index() {
		$data =$this->Restaurant->find('all');
		for($i=0; $i<count($data);$i++)
		{
			$logo_id = $data[$i]['Restaurant']['logo_id'];
			$photo = null;
			if($logo_id!=null && strlen($logo_id)>0)
				$photo = $this->Restaurant_picture->findById($logo_id);
			else
				$photo = $this->Restaurant_picture->findByRestaurant_id($data[$i]['Restaurant']['id']);
			
			if($photo!=null && $photo['Restaurant_picture']['filepath']!=null)
					$data[$i]['Restaurant']['logo_url'] = $photo['Restaurant_picture']['filepath'];
			
		}
		$this->set('Restaurants', $data);
		
		$this->set('_serialize', array('Restaurants'));
	}
	public function uploadphoto($restaurantid=null){
		if($restaurantid==null)
			return;
		$url ="";
		if($url = $this->Image->uploadImage("restaurant", $restaurantid)){
			$this->Restaurant_picture->create();
			$pic =array();
			$pic['Restaurant_picture']['name']='pic';
			$pic['Restaurant_picture']['hashcode']='dada';
			$pic['Restaurant_picture']['restaurant_id']=$restaurantid;
			$pic['Restaurant_picture']['filepath']=$url;
			$result = $this->Restaurant_picture->save($pic);
			if($result!=false){
				$logoid = $result['Restaurant_picture']['id'];
				$this->Restaurant->read(null, $restaurantid);
				$this->Restaurant->saveField('logo_id', $logoid);
				$this->set('data',array('url' => $url));
			}
		}
		$this->set('_serialize', array('data'));
	}
	public function query(){
		$queryparams = array_keys($this->passedArgs);
		$sortField = null;
		$sortDir = null;
		$condition =array();
		$search = null;
		for($i=0; $i<count($queryparams); $i++)
		{
			$parakey = $queryparams[$i];
			$paraval = $this->passedArgs[$parakey];
			if ($parakey == 'pageSize'){
				$this->paginate['limit'] = $paraval;
			}
			if($parakey == 'sort'){
				$sortField = $paraval;
			}
			if($parakey == 'direction'){
				$sortDir = $paraval;
			}
			if(strpos($parakey,'Restaurant.') ===0){
				$condition[$parakey] = $paraval;
			}
			if($parakey == 'search'){
				$search = "%".$paraval."%";
				$condition['OR'] =array(
						"Restaurant.name LIKE" => $search,
						"Restaurant.address LIKE" => $search,
						"Restaurant.alias LIKE" => $search,
						"Restaurant.description LIKE" => $search
						);
			}
		}
		
		if($sortField!=null && $sortDir !=null)
			$this->paginate['order'] = array($sortField =>$sortDir);
		if(count($condition) >0)
			$this->paginate['conditions'] = $condition;
		$data = $this->paginate('Restaurant');
		for($i=0; $i<count($data);$i++)
		{
			$logo_id = $data[$i]['Restaurant']['logo_id'];
			$photo = null;
			if($logo_id!=null && strlen($logo_id)>0)
				$photo = $this->Restaurant_picture->findById($logo_id);
			else
				$photo = $this->Restaurant_picture->findByRestaurant_id($data[$i]['Restaurant']['id']);
			if($photo!=null && $photo['Restaurant_picture']['filepath']!=null)
				$data[$i]['Restaurant']['logo_url'] = $photo['Restaurant_picture']['filepath'];		
		}
		$this->set('Restaurants', $data);
		
		//caculate current page and total pages, out $num is in format n of m
		$view = new View($this);
		$pos = $view->loadHelper('Paginator')->counter("{\"page\":{:page}, \"totalPages\":{:pages}, \"showing\":{:current}, \"total\":{:count}, \"start\":{:start}, \"end\":{:end}}");
		$this->set('Current', $pos);
		
		$this->set('_serialize', array('Restaurants','Current'));
	}
	public function categories(){
		$this->set('Restaurant_categorys', $this->Restaurant_category->find('all'));
		$this->set('_serialize', array('Restaurant_categorys'));
	}
	public function category($id=null){
		$this->Restaurant_category->id = $id;
		$this->set('Restaurant_category' , $this->Restaurant_category->read());
		$this->set('_serialize', array('Restaurant_category'));
	}
	public function view($id=null){
		$this->Restaurant->bindModel( array('hasMany' => array(
												'Restaurant_telephone' =>array(
														'className' => 'Restaurant_telephone'
														),
												'Restaurant_introduction' =>array(
														'className' =>'Restaurant_introduction'
														),
												'Dish_category' =>array(
														'className' => 'Dish_category'
														),
												'Restaurant_picture' => array(
														'className' => 'Restaurant_picture'
														)
											) 
					), false);
		$this->Restaurant->id = $id;
		$this->set('Restaurant' , $this->Restaurant->read());
		$this->set('_serialize', array('Restaurant'));
	}
	public function coordinate($id){
		$cood = $this->Restaurant_coordinate->findByRestaurant_id($id);
		$this->set('coordinate',$cood);
		$this->set('_serialize', array('coordinate'));
	}
	public function add(){
		if($this->request->is('post')){
			$this->Restaurant->create();
			if($this->Restaurant->save($this->request->data)){
				$this->Session->setFlash('YES');
			}else{
				$this->Session->setFlash('NO');
			}
		}
		
	}
}