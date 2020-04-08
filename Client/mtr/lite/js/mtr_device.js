String.prototype.format = function () {
	var args = arguments;
	return this.replace(/\{(\d+)\}/g, function (m, i) {
		return args[i];
	});
};

//定义最顶级类,用于js继承基类
function Class() { }
Class.prototype.construct = function () { };
Class.extend = function (def) {
	var subClass = function () {
		if (arguments[0] !== Class) { this.construct.apply(this, arguments); }
	};
	var proto = new this(Class);
	var superClass = this.prototype;
	for (var n in def) {
		var item = def[n];
		if (item instanceof Function) item.father = superClass;
		proto[n] = item;
	}
	subClass.prototype = proto;
	//赋给这个新的子类同样的静态extend方法
	subClass.extend = this.extend;
	return subClass;
};

var Device = Class.extend({
	construct: function (name, type) {
		arguments.callee.father.construct.call(this);
		this.name = name;
		this.type = type;
		this.idle = false;
		this.options = {
			target: '.device-' + name,
		};
	},
	getUrl: function () {
		var args = arguments;
		var action = args[0];
		var param = this.name;
		if (args.length > 1) {
			param = args[1];
		}

		if (this.options[action]) {
			var str = this.options[action];
			return str.format(param);
		}
	},
	ajax: function (url, options) {
		if (!url)
			return;
		$that = this;
		var ajaxOptions = {
			sender: $that
		};
		$.extend(ajaxOptions, $that.options);
		$.extend(ajaxOptions, options);

		$.getJSON(url, function(response) {
			//console.log(url);
			//console.log(response);
			if (response.success) {
				$that.setStatus(response.data, ajaxOptions);
			} else {
				//console.log(response);
				var msg;
				switch (response.errCode) {
				case -1:
					msg = "设备不存在！";
					break;
				case -2:
					msg = "设备忙，请稍候再试！";
					break;
				case -3:
					msg = "特效中，请关闭特效再试！";
					break;
				case -4:
					msg = "设备未启用！";
					break;
				case -5:
					msg = "命令执行失败，请稍候再试！";
					break;
				}
				var target = ajaxOptions.deviceid;
				if (!target) {
					target = ajaxOptions.target;
					if (ajaxOptions.sender.type === Device.PROJECTOR || ajaxOptions.sender.type === Device.CURTAIN) {
						target += '.' + ajaxOptions.action;
					}
				}

				$('.popover').popover('hide');
				$(target).popover({
					trigger: 'manual',
					placement: "bottom",
					animation: false,
					html: true,
					content: '<div id="com-alert"></div>'
				});
				//console.log('popover: ' + target);
				$(target).popover('show');
				$("#com-alert").html(msg);
				setTimeout(function () {
					if (!$(".popover:hover").length) {
						$('.popover').popover('hide');
					}
				}, 1000);
			}
		});
	},
	setStatus: function (data, options) {
		if (options.status) {
			for (var key in options.manager.items) {
				var item = options.manager.items[key];
				if (data[item.name]) {
					//console.log(data[item.name]);
					options.sender = item;
					item.refresh(data, options);
				}
			}
		} else {
			options.sender.refresh(data, options);
		}
	},
	refresh: function (data, options) {
		var status = options.status;
		var action = options.action;
		var sender = options.sender;
		var target = options.target;

		if (status) {
			if (data[sender.name + "-Busy"] === "1") {
				//console.log(data);
				return;
			}

			target = sender.options.target;
			switch (sender.type) {
			case Device.MONITOR:
			case Device.LAMP:
				if (sender.name === "L0" || data["L0-Busy"] === "1")
					return;
				action = (data[sender.name] === "0") ? "poweroff" : "poweron";
				break;
			case Device.GLASS:
				if (data["G0-Busy"] === "1")
					return;
				//console.log(data);
				if (data["G0"] !== "0") {
					action = "E" + data["G0"];
				} else if (sender.name !== "G0") {
					action = (data[sender.name] === "0") ? "poweroff" : "poweron";
				} else {
					action = "E0";
				}
				break;
			case Device.CURTAIN:
				if (data[sender.name + "-Busy"] === "1") {
					status = false;
				} else {
					action = "E" + data[sender.name];
				}
				break;
			case Device.PROJECTOR:
				if (data[sender.name + "-Busy"] === "1")
					return;
				action = (data[sender.name] === "0") ? "switchoff" : "switchon";
				break;
			case Device.SWITCH:
				break;
			default:
				return;
			}
		}

		switch (sender.type) {
		case Device.SWITCH:
			if (status) {
				if (data[sender.name] === "1")
					$('.device.switch.poweroff').removeClass('poweroff').addClass('poweron');
				else
					$('.device.switch.poweron').removeClass('poweron').addClass('poweroff');
			} else {
				$('.volume>span').html("");
				$('.brightness>span').html("");
				$('.device.brighton').removeClass('brighton').addClass('brightoff');
				$('.device.darkon').removeClass('darkon').addClass('darkoff');
				$('.device.lighton').removeClass('lighton').addClass('lightoff');
				$('.device.poweron').removeClass('poweron').addClass('poweroff');
				$('.device.meeton').removeClass('meeton').addClass('meetoff');
			} 
			break;
		case Device.MONITOR:
			if (action === "poweron") {
				$(target + '.poweroff').removeClass('poweroff').addClass('poweron');
			} else if (action === "poweroff") {
				$(target + '.poweron').removeClass('poweron').addClass('poweroff');
			}
			break;
		case Device.LAMP:
			if (status) {
				if (data["L0"] === "0") {
					$('.device.lamp.switchall.poweron').removeClass('poweron').addClass('poweroff');
				} else {
					$('.device.lamp.switchall.poweroff').removeClass('poweroff').addClass('poweron');
				}
				if (data["L0-1"] === "0") {
					$('.device.lamp.switchgroup-1.poweron').removeClass('poweron').addClass('poweroff');
				} else {
					$('.device.lamp.switchgroup-1.poweroff').removeClass('poweroff').addClass('poweron');
				}
				if (data["L0-2"] === "0") {
					$('.device.lamp.switchgroup-2.poweron').removeClass('poweron').addClass('poweroff');
				} else {
					$('.device.lamp.switchgroup-2.poweroff').removeClass('poweroff').addClass('poweron');
				}
			}
			if (action === "poweron") {
				$(target + '.lightoff').removeClass('lightoff').addClass('lighton');
			} else if (action === "poweroff") {
				$(target + '.lighton').removeClass('lighton').addClass('lightoff');
			} else if (action === "switchon") {
				$(target + '.switchall.poweroff').removeClass('poweroff').addClass('poweron');
				$('.device.lamp.switchone.lightoff').removeClass('lightoff').addClass('lighton');
				$('.device.lamp.switchgroup-1.poweroff').removeClass('poweroff').addClass('poweron');
				$('.device.lamp.switchgroup-2.poweroff').removeClass('poweroff').addClass('poweron');
			} else if (action === "switchoff") {
				$(target + '.switchall.poweron').removeClass('poweron').addClass('poweroff');
				$('.device.lamp.switchone.lighton').removeClass('lighton').addClass('lightoff');
				$('.device.lamp.switchgroup-1.poweron').removeClass('poweron').addClass('poweroff');
				$('.device.lamp.switchgroup-2.poweron').removeClass('poweron').addClass('poweroff');
			} else if (action === "grouponoff") {
				if (options.effect === '0') {
					$('.device.lamp.switchgroup-' + options.group + '.poweron').removeClass('poweron').addClass('poweroff');
				} else if (options.effect === '1') {
					$('.device.lamp.switchgroup-' + options.group + '.poweroff').removeClass('poweroff').addClass('poweron');
				}
			}
			break;
		case Device.GLASS:
			if (action === "E1" || action === "E2" || action === "E3") {
				$('.device.glass.switchone.poweron').removeClass('poweron').addClass('poweroff');
				$('.device.glass.switchgroup.poweron').removeClass('poweron').addClass('poweroff');
				$('.device.glass.switchall.poweroff').removeClass('poweroff').addClass('poweron');
				$('.device.glass.special.poweron').removeClass('poweron').addClass('poweroff');
				$('.device.glass.special-' + action.substring(1) + '.poweroff').removeClass('poweroff').addClass('poweron');
			} else if (action === "E0") {
				if (status) {
					$('.device.glass.special.poweron').removeClass('poweron').addClass('poweroff');
					if (data["G0-0"] === "1") {
						$('.device.glass.switchall.poweroff').removeClass('poweroff').addClass('poweron');
					} else if (data["G0-0"] === "0") {
						$('.device.glass.switchall.poweron').removeClass('poweron').addClass('poweroff');
					}
				} else {
					$('.device.glass.switchall.poweron').removeClass('poweron').addClass('poweroff');
					$('.device.glass.special.poweron').removeClass('poweron').addClass('poweroff');
					$('.device.glass.switchgroup.poweron').removeClass('poweron').addClass('poweroff');
					$('.device.glass.switchone.poweron').removeClass('poweron').addClass('poweroff');
				}
			} else if (action === "switchgroup-1" || action === "switchgroup-2") {
				if (options.effect === '0') {
					$('.device.glass.switchgroup-' + options.group + '.poweron').removeClass('poweron').addClass('poweroff');
				} else if (options.effect === '1') {
					$('.device.glass.switchgroup-' + options.group + '.poweroff').removeClass('poweroff').addClass('poweron');
					$('.device.glass.switchall.poweroff').removeClass('poweroff').addClass('poweron');
				}
			} else if (action === "poweron") {
				$(target + '.poweroff').removeClass('poweroff').addClass('poweron');
			} else if (action === "poweroff") {
				$(target + '.poweron').removeClass('poweron').addClass('poweroff');
			} else if (action === "switchon") {
				$('.device.glass.switchall.poweroff').removeClass('poweroff').addClass('poweron');
				$('.device.glass.switchone.poweroff').removeClass('poweroff').addClass('poweron');
			} else if (action === "switchoff") {
				$(target + '.poweron').removeClass('poweron').addClass('poweroff');
				$('.device.glass.switchone.poweron').removeClass('poweron').addClass('poweroff');
			}
			break;
		case Device.CURTAIN:
			if (status) {
				if (action === "E1") {
					$(target + '.brighton').removeClass('brighton').addClass('brightoff');
					$(target + '.darkoff').removeClass('darkoff').addClass('darkon');
				} else if (action === "E2") {
					$(target + '.brightoff').removeClass('brightoff').addClass('brighton');
					$(target + '.darkon').removeClass('darkon').addClass('darkoff');
				} else {
					$(target + '.brightoff').removeClass('brightoff').addClass('brighton');
					$(target + '.darkoff').removeClass('darkoff').addClass('darkon');
				}
			} else {
				$(target + '.brighton').removeClass('brighton').addClass('brightoff');
				$(target + '.darkon').removeClass('darkon').addClass('darkoff');
			}
			break;
		case Device.PROJECTOR:
			if (action === "switchon") {
				$(target + '.switchall.poweroff').removeClass('poweroff').addClass('poweron');
				if (status) {
					$(target + '.volume>span').html(data[sender.name + "-Volume"]);
					$(target + '.brightness>span').html(data[sender.name + "-Brightness"]);
					if (data[sender.name + "-Mute"] === "on") {
						$(target + '.switchone.poweroff').removeClass('poweroff').addClass('poweron');
					} else {
						$(target + '.switchone.poweron').removeClass('poweron').addClass('poweroff');
					}
					if (data[sender.name + "-Volume"] === "0") {
						$(target + '.volumeup.switchone.brightoff').removeClass('brightoff').addClass('brighton');
						$(target + '.volumedown.switchone.darkon').removeClass('darkon').addClass('darkoff');
					} else if (data[sender.name + "-Volume"] === ("" + sender.maxVolume)) {
						$(target + '.volumeup.switchone.brighton').removeClass('brighton').addClass('brightoff');
						$(target + '.volumedown.switchone.darkoff').removeClass('darkoff').addClass('darkon');
					} else {
						$(target + '.volumeup.switchone.brightoff').removeClass('brightoff').addClass('brighton');
						$(target + '.volumedown.switchone.darkoff').removeClass('darkoff').addClass('darkon');
					}
					if (data[sender.name + "-Brightness"] === "0") {
						$(target + '.brightup.switchone.brightoff').removeClass('brightoff').addClass('brighton');
						$(target + '.brightdown.switchone.darkon').removeClass('darkon').addClass('darkoff');
					} else if (data[sender.name + "-Brightness"] === ("" + sender.maxBrightness)) {
						$(target + '.brightup.switchone.brighton').removeClass('brighton').addClass('brightoff');
						$(target + '.brightdown.switchone.darkoff').removeClass('darkoff').addClass('darkon');
					} else {
						$(target + '.brightup.switchone.brightoff').removeClass('brightoff').addClass('brighton');
						$(target + '.brightdown.switchone.darkoff').removeClass('darkoff').addClass('darkon');
					}
				} else {
					$(target + '.switchone.brightoff').removeClass('brightoff').addClass('brighton');
					$(target + '.switchone.darkoff').removeClass('darkoff').addClass('darkon');
				}
			} else if (action === "switchoff") {
				$(target + '.switchall.poweron').removeClass('poweron').addClass('poweroff');
				$(target + '.switchone.brighton').removeClass('brighton').addClass('brightoff');
				$(target + '.switchone.darkon').removeClass('darkon').addClass('darkoff');
				$(target + '.volume>span').html("");
				$(target + '.brightness>span').html("");
				$(target + '.switchone.poweroff').removeClass('poweroff').addClass('poweron');
			} else if (action === "volumeup" || action === "volumedown") {
				$(target + '.volume>span').html(options.param);
				if (options.param <= 0) {
					$(target + '.volumeup.switchone.brightoff').removeClass('brightoff').addClass('brighton');
					$(target + '.volumedown.switchone.darkon').removeClass('darkon').addClass('darkoff');
				} else if (options.param >= sender.maxVolume) {
					$(target + '.volumeup.switchone.brighton').removeClass('brighton').addClass('brightoff');
					$(target + '.volumedown.switchone.darkoff').removeClass('darkoff').addClass('darkon');
				} else {
					$(target + '.volumeup.switchone.brightoff').removeClass('brightoff').addClass('brighton');
					$(target + '.volumedown.switchone.darkoff').removeClass('darkoff').addClass('darkon');
				}
			} else if (action === "brightup" || action === "brightdown") {
				$(target + '.brightness>span').html(options.param);
				if (options.param <= 0) {
					$(target + '.brightup.switchone.brightoff').removeClass('brightoff').addClass('brighton');
					$(target + '.brightdown.switchone.darkon').removeClass('darkon').addClass('darkoff');
				} else if (options.param >= sender.maxBrightness) {
					$(target + '.brightup.switchone.brighton').removeClass('brighton').addClass('brightoff');
					$(target + '.brightdown.switchone.darkoff').removeClass('darkoff').addClass('darkon');
				} else {
					$(target + '.brightup.switchone.brightoff').removeClass('brightoff').addClass('brighton');
					$(target + '.brightdown.switchone.darkoff').removeClass('darkoff').addClass('darkon');
				}
			} else if (action === "mute") {
				if (options.param === "muteoff") {
					$(target + '.switchone.poweron').removeClass('poweron').addClass('poweroff');
				} if (options.param === "muteon") {
					$(target + '.switchone.poweroff').removeClass('poweroff').addClass('poweron');
				}
			}
			break;
		}
	},
	poweron: function (options) {
		this.ajax(this.getUrl("urlPowerOn"), $.extend({
			action: 'poweron',
		}, options));
	},
	poweroff: function (options) {
		this.ajax(this.getUrl("urlPowerOff"), $.extend({
			action: 'poweroff',
		}, options));
	},
	switchon: function (options) {
		this.ajax(this.getUrl("urlSwitchOn"), $.extend({
			action: 'switchon',
		}, options));
	},
	switchoff: function (options) {
		this.ajax(this.getUrl("urlSwitchOff"), $.extend({
			action: 'switchoff',
		}, options));
	},
	status: function (options) {
		this.ajax(this.getUrl("urlStatus"), $.extend({
			action: 'status',
			status: true
		}, options));
	},
});

Device.SWITCH = 0;
Device.PROJECTOR = 1;
Device.LAMP = 2;
Device.MONITOR = 3;
Device.CURTAIN = 4;
Device.GLASS = 5;

Device.deviceDefaultSettings = [{
	urlStatus: "/api/mtr/switch/astatus",
	urlSwitchOn: "/api/mtr/switch/apoweron",
	urlSwitchOff: "/api/mtr/switch/apoweroff",
}, {
	urlPowerOn: "/api/mtr/projector/apoweron",
	urlPowerOff: "/api/mtr/projector/apoweroff",
	urlBrightUp: "/api/mtr/projector/abright?brightness={0}",
	urlVolumeUp: "/api/mtr/projector/avolume?volume={0}",
	urlMuteOn: "/api/mtr/projector/amuteon",
	urlMuteOff: "/api/mtr/projector/amuteoff",
	urlSwitchOn: "/api/mtr/projector/apoweron",
	urlSwitchOff: "/api/mtr/projector/apoweroff",
}, {
	urlPowerOn: "/api/mtr/lamp/apoweron?lampId={0}",
	urlPowerOff: "/api/mtr/lamp/apoweroff?lampId={0}",
	urlSwitchOn: "/api/mtr/switch/alampon",
	urlSwitchOff: "/api/mtr/switch/alampoff",
	urlGroupOn: "/api/mtr/lamp/agroupon?groupId={0}",
	urlGroupOff: "/api/mtr/lamp/agroupoff?groupId={0}",
}, {
	urlPowerOn: "/api/mtr/monitor/apoweron",
	urlPowerOff: "/api/mtr/monitor/apoweroff",
	urlSwitchOn: "/api/mtr/monitor/apoweron",
	urlSwitchOff: "/api/mtr/monitor/apoweroff",
}, {
	urlEffect: "/api/mtr/curtain/aeffect?effectId={0}",
}, {
	urlPowerOn: "/api/mtr/glass/apoweron?glassId={0}",
	urlPowerOff: "/api/mtr/glass/apoweroff?glassId={0}",
	urlEffectOn: "/api/mtr/glass/aeffecton?effectId={0}",
	urlEffectOff: "/api/mtr/glass/aeffectoff",
	urlSwitchOn: "/api/mtr/switch/aglasson",
	urlSwitchOff: "/api/mtr/switch/aglassoff",
	urlGroupOn: "/api/mtr/glass/agroupon?groupId={0}",
	urlGroupOff: "/api/mtr/glass/agroupoff?groupId={0}",
}];

var Switch = Device.extend({
	construct: function (name, options) {
		arguments.callee.father.construct.call(this, name, Device.SWITCH);
		$.extend(this.options, Device.deviceDefaultSettings[0]);
		$.extend(this.options, options);
	},
});

var Projector = Device.extend({
	construct: function (name, options) {
		arguments.callee.father.construct.call(this, name, Device.PROJECTOR);
		$.extend(this.options, Device.deviceDefaultSettings[0]);
		$.extend(this.options, Device.deviceDefaultSettings[this.type]);
		$.extend(this.options, options);
		this.maxVolume = 30;
		this.maxBrightness = 100;
	},
	brightup: function (brightness, target, options) {
		this.ajax(this.getUrl("urlBrightUp", brightness), $.extend({
			action: target,
			param: brightness,
		}), options);
	},
	volumeup: function (volume, target, options) {
		this.ajax(this.getUrl("urlVolumeUp", volume), $.extend({
			action: target,
			param: volume,
		}), options);
	},
	muteon: function (target, options) {
		this.ajax(this.getUrl("urlMuteOn"), $.extend({
			action: target,
			param: "muteon",
		}), options);
	},
	muteoff: function (target, options) {
		this.ajax(this.getUrl("urlMuteOff"), $.extend({
			action: target,
			param: "muteoff",
		}), options);
	},
	refresh: function (data, options) {
		//console.log(data);
		arguments.callee.father.refresh.call(this, data, options);
		//console.log("father");
		//console.log(this.options.target);
		//console.log(this);
	},
});

var Monitor = Device.extend({
	construct: function (name, options) {
		arguments.callee.father.construct.call(this, name, Device.MONITOR);
		$.extend(this.options, Device.deviceDefaultSettings[0]);
		$.extend(this.options, Device.deviceDefaultSettings[this.type]);
		$.extend(this.options, options);
	},
});

var Lamp = Device.extend({
	construct: function (name, options) {
		arguments.callee.father.construct.call(this, name, Device.LAMP);
		$.extend(this.options, Device.deviceDefaultSettings[0]);
		$.extend(this.options, Device.deviceDefaultSettings[this.type]);
		$.extend(this.options, options);
	},
	groupon: function (group) {
		this.ajax(this.getUrl("urlGroupOn", group), {
			action: 'grouponoff',
			group: group,
			effect: '1',
		});
	},
	groupoff: function (group, effect) {
		this.ajax(this.getUrl("urlGroupOff", group), {
			action: 'grouponoff',
			group: group,
			effect: '0',
		});
	},
});

var Curtain = Device.extend({
	construct: function (name, options) {
		arguments.callee.father.construct.call(this, name, Device.CURTAIN);
		$.extend(this.options, Device.deviceDefaultSettings[0]);
		$.extend(this.options, Device.deviceDefaultSettings[this.type]);
		$.extend(this.options, options);
	},
	effecton: function (effect, target) {
		this.ajax(this.getUrl("urlEffect", effect), {
			action: target,
		});
	},
});

var Glass = Device.extend({
	construct: function (name, options) {
		arguments.callee.father.construct.call(this, name, Device.GLASS);
		$.extend(this.options, Device.deviceDefaultSettings[0]);
		$.extend(this.options, Device.deviceDefaultSettings[this.type]);
		$.extend(this.options, options);
	},
	effecton: function (effect) {
		this.ajax(this.getUrl("urlEffectOn", effect), {
			action: "E" + effect,
		});
	},
	effectoff: function () {
		this.ajax(this.getUrl("urlEffectOff"), {
			action: "E0",
		});
	},
	groupon: function (group) {
		this.ajax(this.getUrl("urlGroupOn", group), {
			action: 'switchgroup-' + group,
			group: group,
			effect: '1',
		});
	},
	groupoff: function (group, effect) {
		this.ajax(this.getUrl("urlGroupOff", group), {
			action: 'switchgroup-' + group,
			group: group,
			effect: '0',
		});
	},
});

var deviceManager = {
	timer: false,
	items: {},
	addDevice: function (item) {
		deviceManager.items[item.name] = item;
		item.options.manager = deviceManager;
	},
	getDevice: function (name) {
		return deviceManager.items[name];
	},
	init: function () {
		//console.log("device.init");
		$('button.device').each(function () {
			var $that = $(this);
			var name = $that.val();
			if (!deviceManager.getDevice(name)) {
				var device;
				if ($that.is('.switch')) {
					device = new Switch(name);
				} else if ($that.is('.lamp')) {
					device = new Lamp(name);
				} else if ($that.is('.monitor')) {
					device = new Monitor(name);
				} else if ($that.is('.projector')) {
					device = new Projector(name);
				} else if ($that.is('.curtain')) {
					device = new Curtain(name);
				} else if ($that.is('.glass')) {
					device = new Glass(name);
				}
				if (device) {
					deviceManager.addDevice(device);
					//console.log("find a device: " + name);
				}
			}
		});
		$('button.device').click(function () {
			var $that = $(this);
			var name = $that.val();
			var device = deviceManager.getDevice(name);
			if (!device)
				return;
			//console.log("device " + device.name + " is going to act!");

			var isoff = $that.is('.poweroff') || $that.is('.lightoff') || $that.is('.brightoff') || $that.is('.darkoff');
			var ison = $that.is('.poweron') || $that.is('.lighton') || $that.is('.brighton') || $that.is('.darkon');

			switch (device.type) {
			case Device.SWITCH:
				if (isoff) {
					device.switchon();
				} else if (ison) {
					device.switchoff();
				}
				break;
			case Device.MONITOR:
				if (isoff) {
					device.poweron();
				} else if (ison) {
					device.poweroff();
				}
				break;
			case Device.LAMP:
				if (isoff) {
					if ($that.is('.switchone')) {
						device.poweron();
					} else if ($that.is('.switchgroup')) {
						//console.log('.switchgroup');
						if ($that.is('.switchgroup-1')) {
							device.groupon("1");
						} else if ($that.is('.switchgroup-2')) {
							device.groupon("2");
						}
					} else {
						device.switchon();
					}
				} else if (ison) {
					if ($that.is('.switchone')) {
						device.poweroff();
					} else if ($that.is('.switchgroup')) {
						//console.log('.switchgroup');
						if ($that.is('.switchgroup-1')) {
							device.groupoff("1");
						} else if ($that.is('.switchgroup-2')) {
							device.groupoff("2");
						}
					} else {
						device.switchoff();
					}
				}
				break;
			case Device.CURTAIN:
				if ($that.is('.rollup')) {
					device.effecton(1, 'rollup');
				} else if ($that.is('.rolldown')) {
					device.effecton(2, 'rolldown');
				}
				break;
			case Device.GLASS:
				if ($that.is('.switchall')) {
					if (isoff) {
						device.switchon();
					} else if (ison) {
						device.switchoff();
					}
				} else if ($that.is('.special')) {
					var effect = 0;
					if ($that.is('.special-1')) {
						effect = 1;
					} else if ($that.is('.special-2')) {
						effect = 2;
					} else if ($that.is('.special-3')) {
						effect = 3;
					}
					if (isoff) {
						device.effecton(effect);
					} else if (ison) {
						device.effectoff();
					}
				} else if ($that.is('.switchgroup')) {
					var group = 0;
					if ($that.is('.switchgroup-1')) {
						group = 1;
					} else if ($that.is('.switchgroup-2')) {
						group = 2;
					}
					if (isoff) {
						device.groupon(group);
					} else if (ison) {
						device.groupoff(group);
					}
				} else if ($that.is('.switchone')) {
					if (isoff) {
						device.poweron();
					} else if (ison) {
						device.poweroff();
					}
				}
				break;
			case Device.PROJECTOR:
				if ($that.is('.switchall')) {
					var options = { deviceid: "#originone" };
					if ($that.is('.another')) {
						options = { deviceid: "#another" }
					}
					//console.log($that);
					if (isoff) {
						device.switchon(options);
					} else {
						device.switchoff(options);
					}
				} else if ($that.is('.switchone.mute')) {
					if (isoff) {
						device.muteon('mute');
					} else {
						device.muteoff('mute');
					}
				} else if ($that.is('.switchone.volumeup')) {
					var volume = -(0 - $(".volume>span").html()) + 1;
					if (volume > device.maxVolume)
						volume = device.maxVolume;
					device.volumeup(volume, 'volumeup');
				} else if ($that.is('.switchone.volumedown')) {
					var volume = -(0 - $(".volume>span").html()) - 1;
					if (volume < 0)
						volume = 0;
					device.volumeup(volume, 'volumedown');
				} else if ($that.is('.switchone.brightup')) {
					var brightness = -(0 - $(".brightness>span").html()) + 5;
					if (brightness > device.maxBrightness)
						brightness = device.maxBrightness;
					device.brightup(brightness, 'brightup');
				} else if ($that.is('.switchone.brightdown')) {
					var brightness = -(0 - $(".brightness>span").html()) - 5;
					if (brightness < 0)
						brightness = 0;
					device.brightup(brightness, 'brightdown');
				}
				break;
			}
		});
		$.ajaxSetup({
			error: function (x, e) {
				if (deviceManager.timer) {
					clearInterval(deviceManager.timer);
					deviceManager.timer = 0;
					console.log("关闭定时器！");
					alert("服务器错误，请联系管理员！");
				}
				return false;
			}
		});
		deviceManager.timer = setInterval(function() {
			deviceManager.items["M0"].status();
		}, 1000);
	},
};
