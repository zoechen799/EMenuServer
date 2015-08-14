<?php
function mkrdir($dir){
	return is_dir($dir) or (mkrdir(dirname($dir)) and mkdir($dir, 0777));
}

App::uses('Component', 'Controller');
class ImageComponent extends Component {
	public function resizeImage($im,$maxwidth,$maxheight)
	{
		$pic_width = imagesx($im);
		$pic_height = imagesy($im);
	
		if(($maxwidth && $pic_width > $maxwidth) || ($maxheight && $pic_height > $maxheight))
		{
			if($maxwidth && $pic_width>$maxwidth)
			{
				$widthratio = $maxwidth/$pic_width;
				$resizewidth_tag = true;
			}
	
			if($maxheight && $pic_height>$maxheight)
			{
				$heightratio = $maxheight/$pic_height;
				$resizeheight_tag = true;
			}
	
			if($resizewidth_tag && $resizeheight_tag)
			{
				if($widthratio<$heightratio)
					$ratio = $widthratio;
				else
					$ratio = $heightratio;
			}
	
			if($resizewidth_tag && !$resizeheight_tag)
				$ratio = $widthratio;
			if($resizeheight_tag && !$resizewidth_tag)
				$ratio = $heightratio;
	
			$newwidth = $pic_width * $ratio;
			$newheight = $pic_height * $ratio;
	
			if(function_exists("imagecopyresampled"))
			{
				$newim = imagecreatetruecolor($newwidth,$newheight);
				imagecopyresampled($newim,$im,0,0,0,0,$newwidth,$newheight,$pic_width,$pic_height);
			}
			else
			{
				$newim = imagecreate($newwidth,$newheight);
				imagecopyresized($newim,$im,0,0,0,0,$newwidth,$newheight,$pic_width,$pic_height);
			}
			return $newim;
		}
	}
	
	public function uploadImage($folder=null, $userid=null){
		$temp_path = SAE_TMP_PATH;
		if( $temp_path != null && $temp_path != "SAE_TMP_PATH" && strlen($temp_path)>0){
			return $this->uploadImageToSAE($folder, $userid);
		}else{
			return $this->uploadImageToLocal($folder, $userid);
		}
	}
	
	private function uploadImageToLocal($folder=null, $userid=null){
		if(empty($_FILES) === false){
			if ((($_FILES["file"]["type"] == "image/gif")
					|| ($_FILES["file"]["type"] == "image/jpeg")
					|| ($_FILES["file"]["type"] == "image/png"))
					&& ($_FILES["file"]["size"] < 1024*1024))
			{
				if ($_FILES["file"]["error"] > 0){
					return false;
				}else{
					$uuid =md5(uniqid(rand(), true));
					$path = "/Users/i061200/Projects/EMenu_All/imageservice/attachments/".$folder . "/" . $userid ."/"  . $uuid ;
					if(mkrdir($path)){
						if(move_uploaded_file($_FILES["file"]["tmp_name"], $path . "/" . $_FILES["file"]["name"])) {
							return "http://localhost/imageservice/attachments/" .$folder . "/". $userid ."/" . $uuid ."/". $_FILES["file"]["name"];
						}
					}
				}
			}
		}
		return false;
	}
	private function uploadImageToSAE($folder=null, $userid=null){
		$domain ='upload';
		if(empty($_FILES) === false){
			if ((($_FILES["file"]["type"] == "image/gif")
					|| ($_FILES["file"]["type"] == "image/jpeg")
					|| ($_FILES["file"]["type"] == "image/png"))
					&& ($_FILES["file"]["size"] < 1024*1024))
			{
				if ($_FILES["file"]["error"] > 0){
					return false;
				}else{
					$uuid = md5(uniqid(rand(), true));
					$tmp_path = SAE_TMP_PATH;
					$file_name = $_FILES['file']['name'];
					$tmp_name = $_FILES['file']['tmp_name'];
					$s = new SaeStorage();
					$img = new SaeImage();
					$img_data = file_get_contents($tmp_name);
					$img->setData($img_data);
					$file_contents = $img->exec();
					$filename=$folder . "/" . $userid ."/"  . $uuid . "/" . $file_name;
					$s->write($domain, $filename ,$file_contents);
					$img->clean();
					$url=$s->getUrl($domain, $filename );
					return $url;
				}
			}
		}
		return false;
	}
	
}