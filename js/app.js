/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/

(function($, owner) {
	owner.type = {
		all: 'all',
		me: 'me',
		me_get: 'me/get',
		me_set: 'me/set',
		me_address: 'me/address',
		me_online: 'me/online',
		friend: 'friend',
		friend_add: 'friend/add',
		friend_list: 'friend/list/callback',
		friend_message_callback: 'friend/message/callback'
	}
//	//设置全局beforeSend
//	$.ajaxSettings.beforeSend = function(xhr, setting) {
//		//beforeSend演示,也可在$.ajax({beforeSend:function(){}})中设置单个Ajax的beforeSend
//		console.log('beforeSend:::' + JSON.stringify(setting));
//	};
//	//设置全局complete
//	$.ajaxSettings.complete = function(xhr, status) {
//		console.log('complete:::' + status);
//	}
	/*
	 *	AJAX注册 
	 */
//	owner.register = function() {	
//		//利用RunJS的Echo Ajax功能测试
//		var url = 'http://elastos.ieeac.cn/';
//		//请求方式，默认为Get；
//		var type = methodEl.value;
//		//预期服务器范围的数据类型
//		var dataType = dataTypeEl.value;
//		//发送数据
//		var data = {
//			name: "mui",
//			version: "pre-release",
//			author: "chb",
//			description: "最接近原生APP体验的高性能前端框架"
//		};
//		url = url + (dataType === 'html' ? 'text' : dataType);
//		respnoseEl.innerHTML = '正在请求中...';
//		if (type === 'get') {
//			if (dataType === 'json') {
//				$.getJSON(url, data, success);
//			} else {
//				$.get(url, data, success, dataType);
//			}
//		} else if (type === 'post') {
//			$.post(url, data, success, dataType);
//		}
//	};
	
	owner.login_ela = function(loginInfo, callback) {
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		if(!loginInfo.account) {
			callback && callback('Not empty');
			return false;
		}
		return owner.createState(loginInfo.account, callback);
	}
	
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if (loginInfo.account.length < 5) {
			return callback('账号最短为 5 个字符');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		var authed = users.some(function(user) {
			return loginInfo.account == user.account && loginInfo.password == user.password;
		});
		if (authed) {
			return owner.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		}
	};
	
	owner.logout = function(data, callback) {
		localStorage.clear();
		plus.runtime.restart();
	}

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if (regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		}
		/**
		 * 获取本地是否安装客户端
		 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				// return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
				return packageManager.getApplicationInfo(packageName[id], PackageManager.GET_UNINSTALLED_PACKAGES);
			} catch (e) { return false; }
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));