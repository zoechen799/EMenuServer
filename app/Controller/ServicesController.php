<?php
class ServicesController extends AppController {
	public $helpers = array('Js','Form', 'Session');
	public $uses = array('User');
	public $components = array('Session','RequestHandler','Image');
	public function beforeFilter() {
		$this->Auth->allow('captcha', 'resize' , 'verifyauth');
		parent::beforeFilter();
	}
	public function resize(){
		$url = $this->request['url']['url'];
		$width =0;
		$height =0;
		if(array_key_exists('width', $this->request['url']))
			$width = $this->request['url']['width'];
		if(array_key_exists('height', $this->request['url']))
			$height = $this->request['url']['height'];
		$notfound = 'img/notfound.jpg';
		$type = substr($url,strrpos($url,'.')+1, strlen($url)-strrpos($url,'.'));
		if($type ==null || ($type!='jpg' && $type!='jpeg' &&$type!='png' && $type!='gif')){
			header("Content-type: image/jpg",true);
			$im=imagecreatefromjpeg($notfound);
			imagejpeg($im);
		}else{
			$fileExist = true;
			if($type=='jpg' ||$type=='jpeg'){
				header("Content-type: image/jpg",true);
				$im=imagecreatefromjpeg($url);
				if($im!=false){
					if($width!=0 || $height!=0)
						$im = $this->Image->resizeImage($im, $width, $height);
					imagejpeg($im);
				}
				else 
					$fileExist = false;
			}
			else if($type=='png'){
				header("Content-type: image/png",true);
				$im = imagecreatefrompng($url);
				if($width!=0)
				if($im!=false){
					if($width!=0 || $height!=0)
						$im = $this->Image->resizeImage($im, $width, $height);
					imagepng($im);
				}
				else 
					$fileExist = false;
			}else if($type=='gif'){
				header("Content-type: image/gif",true);
				$im = imagecreatefromgif($url);
				if($im!=false){
					if($width!=0 || $height!=0)
						$im = $this->Image->resizeImage($im, $width, $height);
					imagegif($im);
				}
				else 
					$fileExist = false;
			}
			if($fileExist == false){
				header("Content-type: image/jpg",true);
				$im=imagecreatefromjpeg($notfound);
				imagejpeg($im);
			}
		}
	}
	public function verifyauth($auth){
		if($auth!=null && $auth == $this->Session->read("authnum")){
			$this->set('auth', true);
		}else{
			$this->set('auth', false);
		}
		$this->set('_serialize', array('auth'));
	}
	public function captcha(){
		header("Content-type: image/png",true);
		$authnum ="";
		$str = 'abcdefghijkmnpqrstuvwxyz1234567890';
		$l = strlen($str);
		for($i=1;$i<5;$i++)
		{
			$num=rand(0,$l-1);
			$authnum .= $str[$num];
			$this->Session->write("authnum" , $authnum);
		}
		srand((double)microtime()*1000000);
		$im = imagecreate(60,24);
		$black = ImageColorAllocate($im, 0,0,0);
		$white = ImageColorAllocate($im, 255,255,255);
		$gray = ImageColorAllocate($im, 200,200,200);
		$li = ImageColorAllocate($im, 120,220,200);
		for($k=0;$k<3;$k++)
		{
		imageline($im,rand(0,40),rand(0,51),rand(20,60),rand(0,21),$li);
		}
		imagefill($im,68,30,$gray);
		//字符在图片的位置;
		imagestring($im, 5, 14, 3, $authnum, $white);
		for($j=0;$j<90;$j++)
		{//加入干扰象素
		imagesetpixel($im, rand()%70 , rand()%30 , $gray);
		}
		ImagePNG($im);
		ImageDestroy($im);
	}
}