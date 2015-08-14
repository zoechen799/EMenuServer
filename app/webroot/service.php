<?php
 $q_str = $_SERVER["QUERY_STRING"];
 parse_str(html_entity_decode($q_str), $output);
 $s = new SaeStorage();
 $image = $output['image'];
 $url = $output['url'];
 $width = $output['width'];
 $height =$output['height'];
 $captcha =$output['captcha'];
 $path1 = SAE_TMP_PATH;
 echo $path1;
 if($image!=null && strlen($image)>0){
   if($s->fileExists('restaurant_pictures',$image))
   {
     if($url!=null)
     {
        echo $s-> getUrl('restaurant_pictures', $image);
     }else
     {
      $data = $s->read ('restaurant_pictures', $image);
       header("Content-Type:image/jpg");
       if($width!=null)
       {
         $f = new SaeFetchurl();
         $imageurl = $s-> getUrl('restaurant_pictures', $image);
         $img_data = $f->fetch( $imageurl );
         $img = new SaeImage();
         $img->setData( $img_data );
         $img->resize($width);
         //$new_data = $img->exec();
         $img->exec( "jpg" , true );
       }else
       	echo $data;
     }
   }
   else
   {
      echo "file not exist";
   }
 }
 else if($captcha!=null){
	header("Content-type: image/png",true);
	$authnum ="";
	$str = 'abcdefghijkmnpqrstuvwxyz1234567890';
	$l = strlen($str);
	for($i=1;$i<5;$i++)
	{
		$num=rand(0,$l-1);
		$authnum .= $str[$num];
		setcookie ("authnum",$authnum);
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
 