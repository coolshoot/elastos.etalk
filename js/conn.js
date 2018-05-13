var bug = document.getElementById("debug");
//mui初始化，配置下拉刷新
	mui.init({
		swipeBack: false,
		pullRefresh: {
			container: '#list',
			down: {
				style: 'circle',
				offset: '0px',
				auto: true,
				callback: pulldownRefresh
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	
	/**
	 * 打开新闻详情
	 * 
	 * @param {Object} item 当前点击的新闻对象
	 */
	function open_detail(item) {
//		//触发子窗口变更新闻详情
//		mui.fire(webview_detail, 'get_detail', {
//			guid: item.guid,
//			title: item.title,
//			author: item.author,
//			time: item.time,
//			cover: item.cover
//		});
//
//		//更改详情页原生导航条信息
//		titleNView.titleText = item.title;
//		webview_detail.setStyle({
//			"titleNView": titleNView
//		});
//		setTimeout(function() {
//			webview_detail.show("slide-in-right", 300);
//		}, 150);
	}

	/**
	 *  下拉刷新获取最新列表 
	 */
	function pulldownRefresh() {
		setTimeout(function(){
			mui('#list').pullRefresh().endPulldownToRefresh();
		}, 1000)
//		if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
//			plus.nativeUI.toast('似乎已断开与互联网的连接', {
//				verticalAlign: 'top'
//			});
//			return;
//		}
//
//		var data = {
//			column: "id,post_id,title,author_name,cover,published_at" //需要的字段名
//		}
//
//		if(lastId) { //说明已有数据，目前处于下拉刷新，增加时间戳，触发服务端立即刷新，返回最新数据
//			data.lastId = lastId;
//			data.time = new Date().getTime() + "";
//		}
//
//		//请求顶部banner信息
//		mui.getJSON("http://spider.dcloud.net.cn/api/banner/36kr", data, function(rsp) {
//			news.banner = {
//				guid: rsp.post_id,
//				title: rsp.title,
//				cover: rsp.cover,
//				author: rsp.author_name,
//				time: dateUtils.format(rsp.published_at)
//			};
//		});
//
//		//请求最新列表信息流
//		mui.getJSON("http://spider.dcloud.net.cn/api/news", data, function(rsp) {
//			mui('#list').pullRefresh().endPulldownToRefresh();
//			if(rsp && rsp.length > 0) {
//				lastId = rsp[0].id; //保存最新消息的id，方便下拉刷新时使用
//				
//				if(!minId) {//首次拉取列表时保存最后一条消息的id，方便上拉加载时使用
//					minId = rsp[rsp.length - 1].id; 										
//				}
//				news.items = convert(rsp).concat(news.items);
//			}
//		});

	}

	/**
	 * 上拉加载拉取历史列表
	 */
	function pullupRefresh() {
		setTimeout(function(){
			mui('#list').pullRefresh().endPullupToRefresh();
		}, 1000)
//		var data = {
//			column: "id,post_id,title,author_name,cover,published_at" //需要的字段名
//		};
//
//		if(minId) { //说明已有数据，目前处于上拉加载，传递当前minId 返回历史数据
//			data.minId = minId;
//			data.time = new Date().getTime() + "";
//			data.pageSize = 10;
//		}
//		//请求历史列表信息流
//		mui.getJSON("http://spider.dcloud.net.cn/api/news", data, function(rsp) {
//			mui('#list').pullRefresh().endPullupToRefresh();
//			if(rsp && rsp.length > 0) {
//				minId = rsp[rsp.length - 1].id; //保存最后一条消息的id，上拉加载时使用
//				news.items = news.items.concat(convert(rsp));
//			}
//		});
	}

	
		var main,menu, mask = mui.createMask(_closeMenu);
		var showMenu = false,mode = 'menu-move';
		var state = app.getState()
		
		var backButtonPress = 0;
		mui.back = function() {
			if (showMenu) {
				//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行mui.back逻辑；
				closeMenu();
				return false;
			}
			menu.close('none');
			backButtonPress++;
			if (backButtonPress > 1) {
				plus.runtime.quit();
			} else {
				plus.nativeUI.toast('再按一次退出应用');
			}
			setTimeout(function() {
				backButtonPress = 0;
			}, 1000);
			return false;
		}

		function backx() {
			if (showMenu) {
				//菜单处于显示状态，返回键应该先关闭菜单,阻止主窗口执行mui.back逻辑；
				closeMenu();
				return false;
			} else {
				//菜单处于隐藏状态，执行返回时，要先close菜单页面，然后继续执行mui.back逻辑关闭主窗口；
				menu.close('none');
				return true;
			}
		}
		//plusReady事件后，自动创建menu窗口；
		mui.plusReady(function() {
			var mainview = plus.webview.getLaunchWebview();
			main = plus.webview.currentWebview();
						
			window.addEventListener(app.type.friend_list, function(event){
				if(event && event.detail) {
					if(event.detail.code < 0) {
						return plus.nativeUI.toast(event.detail.error || '错误');
					}
					bug.innerText = JSON.stringify(event.detail)
				}
			}, false)
			
			window.addEventListener(app.type.all, function(event){
				if(event && event.detail) { // && event.detail.code > 0 && event.detail.msg === 'ok' && event.detail.data) {
					bug.innerText = JSON.stringify(event.detail)	
				}
			}, false)
			//setTimeout的目的是等待窗体动画结束后，再执行create webview操作，避免资源竞争，导致窗口动画不流畅；
			setTimeout(function () {
				mainview && mui.fire( mainview , 'add_scribe' , {type: app.type.friend_list, data: {id: main.id}} )
				mainview && mui.fire( mainview , 'add_scribe' , {type: app.type.all, data: {id: main.id, eventname: app.type.all}} )
				mainview && mui.fire( mainview , 'sck_send', {type: app.type.me, data: {method: 'list'}})
				//侧滑菜单默认隐藏，这样可以节省内存；
				menu = mui.preload({
					id: 'right-plus-menu',
					url: 'right-plus-menu.html',
					styles: {
						left: 0,
						width: '70%',
						zindex: 9997
					}
				});
			},300);		
	
//		var list = new Vue({
//			el: '#mui-content',
//			data: {
//				items: [] //列表信息流数据
//			}
//		});
	});
	
	bug.innerText = JSON.stringify(Vue);
		
		/**
		 * 显示菜单菜单
		 */
		function openMenu() {
			if (!showMenu) {
				//侧滑菜单处于隐藏状态，则立即显示出来；
				//显示完毕后，根据不同动画效果移动窗体；
				menu.show('none', 0, function() {
					switch (mode){
						case 'main-move':
							//主窗体开始侧滑；
							main.setStyle({
								left: '70%',
								transition: {
									duration: 150
								}
							});
							break;
						case 'menu-move':
							menu.setStyle({
								left: '0%',
								transition: {
									duration: 150
								}
							});
							break;
					}
				});
				//显示遮罩
				mask.show();
				showMenu = true;
			}
		}
		/**
		 * 关闭侧滑菜单
		 */
		function closeMenu () {
			_closeMenu();
			//关闭遮罩
			mask.close();
		}
		
		/**
		 * 关闭侧滑菜单（业务部分）
		 */
		function _closeMenu() {
			if (showMenu) {
				//关闭遮罩；
				switch (mode){
					case 'main-move':
						//主窗体开始侧滑；
						main.setStyle({
							left: '0',
							transition: {
								duration: 150
							}
						});
						break;
					case 'menu-move':
						//主窗体开始侧滑；
						menu.setStyle({
							left: '-70%',
							transition: {
								duration: 150
							}
						});
						break;
				}
				
				//等窗体动画结束后，隐藏菜单webview，节省资源；
				setTimeout(function() {
					menu.hide();
				}, 200);
				//改变标志位
				showMenu = false;
			}
		}
		
//		//变换侧滑动画移动效果；
//		mui('.mui-input-group').on('change', 'input', function() {
//			if (this.checked) {
//				switch (this.value) {
//					case 'main-move':
//						//仅主窗口移动的时候，menu页面的zindex值要低一点；
//						menu.setStyle({left:'0',zindex:9997});
//						if(mode=='all-move'){
//							menu.setStyle({
//								left: '0%'
//							});
//						}
//						mode = 'main-move';
//						break;
//					case 'menu-move':
//						menu.setStyle({left:'-70%',zindex:9999});
//						if(mode=='all-move'){
//							menu.setStyle({
//								left: '0%'
//							});
//						}
//						mode = 'menu-move';
//						break;
//				}
//			}
//		});

		function goabout() {
//			mui.openWindow({
//				url: "views/about.html",
//				id: "about",
//				styles: {
//					popGesture: "close",
//					statusbar: {
//						background: "#f7f7f7"
//					}
//				},
//				show: {
//					aniShow: aniShow,
//					duration: 300
//				}
//			});
		}
		
		//点击左上角图标，打开侧滑菜单；
		//document.querySelector('.mui-icon-bars').addEventListener('tap', goabout);
		//document.getElementById("show-btn").addEventListener('tap',openMenu);
		//在android4.4中的swipe事件，需要preventDefault一下，否则触发不正常
		//故，在dragleft，dragright中preventDefault
//		window.addEventListener('dragright', function(e) {
//			e.detail.gesture.preventDefault();
//		});
//		window.addEventListener('dragleft', function(e) {
//			e.detail.gesture.preventDefault();
//		});
//		 //主界面向右滑动，若菜单未显示，则显示菜单；否则不做任何操作；
//		window.addEventListener("swiperight", openMenu);
//		 //主界面向左滑动，若菜单已显示，则关闭菜单；否则，不做任何操作；
//		window.addEventListener("swipeleft", closeMenu);
//		 //menu页面向左滑动，关闭菜单；
//		window.addEventListener("menu:swipeleft", closeMenu);

		//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
		mui.menu = function() {
			if (showMenu) {
				closeMenu();
			} else {
				openMenu();
			}
		}
		