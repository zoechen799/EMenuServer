(function ($, undefined) {
	window.localization = $.extend({}, window.localization ,{
		meta:{
			close:'关闭',
			save: '保存',
			please: '请',
			previous: '上一个',
			next: '下一个'
		},
		header:{
			telenumber: "021-59175917 点餐,就到5917",
			login: "登陆",
			register: "注册",
			userinfo: "用户信息",
			userorders: "我的订单",
			logout: "退出登陆",
			placeholder: "输入餐馆名，地址等...",
			search:"查找",
			contactus:"联系我们",
			mypost:"我的新闻",
			newpost:"新闻发布",
			help:"帮助",
			mobile:"手机版"
		},
		portal:{
			ranksort: "整体评价",
			ppRatio: "性价比",
			special: "特色",
			environment: "环境",
			navi1: "上海首页",
			allregion: "所有地区"
		},
		restaurant:{
			photo_upload_title: "上传商户照片"
		},
		dish:{
			photo_upload_title: "上传菜品照片"
		},
		order:{
			restaurant_title: "餐厅信息",
			order_status_title: "订单状态",
			order_user_title:"下单用户",
			order_detail: "订单详情",
			order_user_name: "姓名",
			order_user_tel: "电话",
			order_user_gender: "性别",
			dinner_time:"就餐时间",
			dinner_members:"就餐人数",
			dinner_quantity:"菜品总数",
			dinner_amount:"菜品总价",
			status_new: '审核中',
			status_confirming: '到达餐厅，处理中',
			status_reject: '订单取消',
			status_topay: '餐厅已确认,待支付',
			status_paied: '订单已支付，待消费',
			status_used: '订单完成,待评价',
			status_commented: '订单完成并评价',
			gender_m:'男',
			gender_f:'女',
			process_title:'订单状态'
		},
		userinfo:{
			uploadavata: "上传头像",
			basic: '个人基本信息',
			username: '用户名',
			email: '电子邮件',
			realname: '真实姓名',
			gender: '性别',
			birthday: '生日',
			contact: '联系方式',
			phone: '联系电话',
			sinaweiboname: '新浪微博',
			qq: 'QQ',
			formaterr: '仅支持jpg,png,jpeg，gif格式图片'
		},
		sellerinfo:{
			uploadavata: "上传照片",
			basic: '餐厅基本信息',
			username: '用户名',
			restaurantname: '餐厅名',
			address:'地址',
			description:'介绍',
			category: '菜系',
			averageprice:'均价',
			contact: '联系方式',
			email: '电子邮件',
			phone: '联系电话',
			formaterr: '仅支持jpg,png,jpeg，gif格式图片'
		},
		usergrade:{
			gradetitle: '会员等级',
			mygrade:	'我的会员级别',
			grade_1:	'新手上路',
			grade_2: 	'2级',
			graderight: '级别特权',
			gradedesc_1: '入门会员享有特权:免费收取进餐通知,餐位查询服务。'
		},
		userscore:{
			scoretitle: '会员积分',
			myscore:	'我的会员积分'
		},
		resetpassword: {
			title: '更改密码',
			oldpassword: '输入老密码',
			newpassword: '输入新密码',
			confirmpassword: '重新输入新密码',
			checkconsist: '两次输入的密码不同,检查后重新输入!',
			succeed: '密码修改成功!',
			failed: '密码修改失败!',
			error: '旧密码输入错误!',
			empty: '输入密码格式错误!'
		}
	});
})(jQuery);
$(document).ready(function(){
	$("body").html($('body').html().replace(/\{\{(.*)\}\}/g, function(e){
		var path = e.substring(2, e.length-2); 
		return eval(path);
	}));
	$("body").css('display','');
	var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'js/bootstrap.min.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
});

	
