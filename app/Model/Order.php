<?php
class Order extends  AppModel{
	public $hasMany = array(
			'detail' =>array(
					'className' => 'Order_detail',
					'foreignKey' => 'order_id'
			)
	);
}
