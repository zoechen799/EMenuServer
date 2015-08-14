<?php
class Restaurant extends  AppModel{
	public $hasOne = array(
			'Restaurant_workinghour' =>array(
					'className' => 'Restaurant_workinghour',
					'foreignKey' => 'restaurant_id'
					)
			);
}