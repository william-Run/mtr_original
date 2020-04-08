//状态信息全局变量
var name = "";
var monitor = "";
var lamp = "";
var projector = "";
var curtain = "";
var glass = "";

//自定义模式图标onmouseover事件
function lightImg() {
	$(".add-model").removeClass('addmodeloff');
	$(".add-model").addClass('addmodelon');
};
//自定义模式图标onmouseout事件
function darkImg() {
	$(".add-model").removeClass('addmodelon');
	$(".add-model").addClass('addmodeloff');
};

//清除数据方法clearData
function clearData() {
	name = "";
	monitor = "";
	lamp = "";
	projector = "";
	curtain = "";
	glass = "";
}
//清除详情页效果方法clearDetail
function clearDetail() {
	$("#txt").val("");
	$("#settings-lamp button").removeClass("lighton").removeClass("lightoff").addClass("lightoff");
	$(".modal-body>.row:not(#settings-lamp) button").removeClass("poweroff").removeClass("poweron").addClass("poweroff");
}

//获取自定义所有设备状态
function settingstatus() {
	name = $('#txt').val();
	if($('.settings-monitor').is('.poweron')) {
		monitor += "1";
	} else {
		monitor += "0";
	}

	if($('.settings-big-center').is('.lighton')) {
		lamp += "1";
	} else {
		lamp += "0";
	}
	if($('.settings-big-side').is('.lighton')) {
		lamp += "1";
	} else {
		lamp += "0";
	}
	if($('.settings-small-center').is('.lighton')) {
		lamp += "1";
	} else {
		lamp += "0";
	}
	if($('.settings-small-side').is('.lighton')) {
		lamp += "1";
	} else {
		lamp += "0";
	}

	if($('.settings-projector').is('.poweron')) {
		projector += "1";
	} else {
		projector += "0";
	}

	if($('.settings-curtain').is('.poweron')) {
		curtain += "2";
	} else {
		curtain += "1";
	}

	if($('.settings-glass').is('poweron')) {
		glass += "0";
	} else if($('.settings-special-1').is('.poweron')) {
		glass += "1";
	} else if($('.settings-special-2').is('.poweron')) {
		glass += "2";
	} else if($('.settings-special-3').is('.poweron')) {
		glass += "3";
	}
	//	$.getJSON('/api/mtr/mode/create?name=' + name + '&monitor=' + monitor + '&lamp=' + lamp + '&projector=' + projector + '&curtain=' + curtain + '&glass=' + glass, function(repsonse) {
	//	});
};

//获取数据库所有情景模式并生成图标

modelist();

//function modelist() {
//	$.getJSON('/api/mtr/mode/list', function(response) {
//		var list = response.data;
//		var html = '';
//		$.each(list, function(i, value) {
//			html += '<div class="col-md-3 col-sm-6 col-6 b-r new-model"><button type = "button" class = "btn meetoff modelonoff"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
//		});
//		html += '<div id="add-model" class="col-md-3 col-sm-6 col-6 b-r"><button type="button" class="btn addmodeloff add-model" data-toggle="modal" data-target="#settings" onmouseover="lightImg(this)" onmouseout="darkImg(this)"></button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong>自定义</strong></a>';
//		$('#add').html(html);
//	})
//};

//新改版list
function modelist() {
	$.getJSON('/api/mtr/mode/list', function(response) {
		var list = response.data;
		
		var html = '';
		var html1 = '';
		var htmlD1 = '';
		var html2 = '';
		var htmlD2 = '';
		var html3 = '';
		var htmlD3 = '';
		
		var flag1 = false;
		var flag2 = false;
		var flag3 = false;
		var flag4 = false;
		var flag5 = false;
		var flag6 = false;
		
		var id1 = 0;
		var name1 = '';
		
		var id2 = 0;
		var name2 = '';
		
		var id3 = 0;
		var name3 = '';

		$.each(list, function(i, value) {
			//大会议室
				if(value.category == 11) {
					id1 = value.id;
					name1 = value.name;
					if(value.inused == 1) {
						flag1 = true;
						html1 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" category ="11" class = "btn meeton modelon bigone1"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
					}
				}
				if(value.category == 12) {
					if(value.inused == 1) {
						flag2 = true;
						html1 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" category ="12" class = "btn screenon modelon bigone1"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
					}
				}
				if(value.category == 10) {
					htmlD1 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" class = "btn meetoff bigone2"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
				}
			//小会议室
				if(value.category == 21) {
					id2 = value.id;
					name2 = value.name;
					if(value.inused == 1) {
						flag3 = true;
						html2 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" category ="21" class = "btn meeton modelon smallone1"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
					}
				}
				if(value.category == 22) {
					if(value.inused == 1) {
						flag4 = true;
						html2 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" category ="22" class = "btn screenon modelon smallone1"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
					}
				}
				if(value.category == 20) {
					htmlD2 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" class = "btn meetoff smallone2"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
				}
				//整体
				if(value.category == 31) {
					id3 = value.id;
					name3 = value.name;
					if(value.inused == 1) {
						flag5 = true;
						html3 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" category ="31" class = "btn meeton modelon allone1"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
					}
				}
				if(value.category == 32) {
					if(value.inused == 1) {
						flag6 = true;
						html3 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" category ="32" class = "btn screenon modelon allone1"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
					}
				}
				if(value.category == 30) {
					htmlD3 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" class = "btn meetoff allone2"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
				}
				

				//html += '<div class="col-md-4 col-sm-4 col-6 b-r new-model"><button type = "button" class = "btn meetoff modelonoff"  value=' + value.id + '> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + value.name + '</strong></a></div>';
		});
//		html += '<div id="add-model" class="col-md-4 col-sm-4 col-6 b-r"><button type="button" class="btn addmodeloff add-model" data-toggle="modal" data-target="#settings" onmouseover="lightImg(this)" onmouseout="darkImg(this)"></button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong>自定义</strong></a>';
		
		
		if(html1.length==0) {
			html1 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" category ="11" class = "btn meetoff modeloff bigone1"  value="'+ id1 +'"> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + name1 + '</strong></a></div>';
		}
		if(html2.length==0) {
			html2 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" category ="21" class = "btn meetoff modeloff smallone1"  value="'+ id2 +'"> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + name2 + '</strong></a></div>';
		}
		if(html3.length==0) {
			html3 += '<div class="col-md-4 col-sm-4 col-6 new-model"><button type = "button" category ="31" class = "btn meetoff modeloff allone1"  value="'+ id3 +'"> </button><br><a class="btn" data-toggle="modal" data-target="#settings"><strong id="add-name">' + name3 + '</strong></a></div>';
		}
		$('#add').html(html);
		$('#bigone').html(html1+htmlD1);
		$('#smallone').html(html2+htmlD2);
		$('#allone').html(html3+htmlD3);
	})
};

$("#bigone").on("click", ".bigone2", function() {
	var $this = $(this);
	var id=$this.val();
	$.getJSON('/api/mtr/switch/activate?id=' + id, function(response) {
	});
	$(".bigone1").val(2).removeClass("meeton").removeClass("screenon").addClass("meetoff");
	$.getJSON('/api/mtr/mode/detail?id=' +2 , function(response1) {
		$(".bigone1").parent().find("a").find("strong").html(response1.data.name);
	});
});

$("#bigone").on("click", ".bigone1", function() {
	var $this = $(this);
//	$this.attr('disabled', 'true');
	var poweroff = $this.is('.meetoff');
	var id=$this.val();
	if(poweroff){
		$.getJSON('/api/mtr/switch/activate?id=' + id, function(response) {
			$this.removeClass("meetoff").addClass("meeton");
		});
	}else{
		if(id==2){
			$.getJSON('/api/mtr/switch/activate?id=' +3 , function(response) {
				$this.attr({'category':'12','value':'3'}).removeClass("meeton").addClass("screenon");
				$.getJSON('/api/mtr/mode/detail?id=' +3 , function(response1) {
					$this.parent().find("a").find("strong").html(response1.data.name);
				});
			});
		}else if(id==3){
			$.getJSON('/api/mtr/switch/activate?id=' +2 , function(response) {
				$this.attr({'category':'11','value':'2'}).removeClass("screenon").addClass("meeton");
				$.getJSON('/api/mtr/mode/detail?id=' +2 , function(response1) {
					$this.parent().find("a").find("strong").html(response1.data.name);
				});
			});
		}
	}
})
//smallone
$("#smallone").on("click", ".smallone2", function() {
	var $this = $(this);
	var id=$this.val();
	$.getJSON('/api/mtr/switch/activate?id=' + id, function(response) {
	});
	$(".smallone1").val(5).removeClass("meeton").removeClass("screenon").addClass("meetoff");
	$.getJSON('/api/mtr/mode/detail?id=' +5 , function(response1) {
		$(".smallone1").parent().find("a").find("strong").html(response1.data.name);
	});
});

$("#smallone").on("click", ".smallone1", function() {
	var $this = $(this);
//	$this.attr('disabled', 'true');
	var poweroff = $this.is('.meetoff');
	var id=$this.val();
	if(poweroff){
		$.getJSON('/api/mtr/switch/activate?id=' + id, function(response) {
			$this.removeClass("meetoff").addClass("meeton");
		});
	}else{
		if(id==5){
			$.getJSON('/api/mtr/switch/activate?id=' +6 , function(response) {
				$this.attr({'category':'22','value':'6'}).removeClass("meeton").addClass("screenon");
				$.getJSON('/api/mtr/mode/detail?id=' +6 , function(response1) {
					$this.parent().find("a").find("strong").html(response1.data.name);
				});
			});
		}else if(id==6){
			$.getJSON('/api/mtr/switch/activate?id=' +5 , function(response) {
				$this.attr({'category':'21','value':'5'}).removeClass("screenon").addClass("meeton");
				$.getJSON('/api/mtr/mode/detail?id=' +5 , function(response1) {
					$this.parent().find("a").find("strong").html(response1.data.name);
				});
			});
		}
	}
})
//整体
$("#allone").on("click", ".allone2", function() {
	var $this = $(this);
	var id=$this.val();
	$.getJSON('/api/mtr/switch/activate?id=' + id, function(response) {
	});
	$(".allone1").val(8).removeClass("meeton").removeClass("screenon").addClass("meetoff");
	$.getJSON('/api/mtr/mode/detail?id=' +8 , function(response1) {
		$(".allone1").parent().find("a").find("strong").html(response1.data.name);
	});
});

$("#allone").on("click", ".allone1", function() {
	var $this = $(this);
//	$this.attr('disabled', 'true');
	var poweroff = $this.is('.meetoff');
	var id=$this.val();
	if(poweroff){
		$.getJSON('/api/mtr/switch/activate?id=' + id, function(response) {
			$this.removeClass("meetoff").addClass("meeton");
		});
	}else{
		if(id==8){
			$.getJSON('/api/mtr/switch/activate?id=' +9 , function(response) {
				$this.attr({'category':'32','value':'9'}).removeClass("meeton").addClass("screenon");
				$.getJSON('/api/mtr/mode/detail?id=' +9 , function(response1) {
					$this.parent().find("a").find("strong").html(response1.data.name);
				});
			});
		}else if(id==9){
			$.getJSON('/api/mtr/switch/activate?id=' +8 , function(response) {
				$this.attr({'category':'31','value':'8'}).removeClass("screenon").addClass("meeton");
				$.getJSON('/api/mtr/mode/detail?id=' +8 , function(response1) {
					$this.parent().find("a").find("strong").html(response1.data.name);
				});
			});
		}
	}
})

//启动当前情景模式
$("#add").on("click", "button.modelonoff", function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.meeton');
	console.log(poweron);
	$.getJSON('/api/mtr/switch/activate?id=' + $this.val(), function(response) {
		$(".modelonoff").removeClass('meeton');
		$(".modelonoff").addClass('meetoff');
		if(poweron) {
			$this.removeClass('meeton');
			$this.addClass('meetoff');
		} else {
			$this.removeClass('meetoff');
			$this.addClass('meeton');
		}
		$this.removeAttr('disabled');
	});
})

//展示当前情景模式细节
$("#add,#bigone").on("click", "a", function() {
	var $this = $(this);
	var index = $this.parent().index("#add>div");
	var id = $this.parent().find("button").val();
	$(".re-delete").attr("value", id);
	$(".re-delete").attr("index", index);
	$(".reset").attr("value", id);
	$.getJSON('/api/mtr/mode/detail?id=' + id, function(response) {
		var obj = response.data;
		console.log(obj);
		$("#txt").val(obj.name);
		if(obj.monitor == 1) {
			$(".settings-monitor").removeClass("poweroff");
			$(".settings-monitor").addClass("poweron");
		} else {
			$(".settings-monitor").removeClass("poweron");
			$(".settings-monitor").addClass("poweroff");
		}
		var ligntArr = obj.lamp.split("");
		$.each(ligntArr, function(i, value) {
			if(value == 1) {
				$("#settings-lamp>div:nth-child(" + (i + 1) + ")>button").removeClass("lightoff");
				$("#settings-lamp>div:nth-child(" + (i + 1) + ")>button").addClass("lighton");
			} else {
				$("#settings-lamp>div:nth-child(" + (i + 1) + ")>button").removeClass("lighton");
				$("#settings-lamp>div:nth-child(" + (i + 1) + ")>button").addClass("lightoff");
			}
		});
		if(obj.projector == 1) {
			$(".settings-projector").removeClass("poweroff");
			$(".settings-projector").addClass("poweron");
		} else {
			$(".settings-projector").removeClass("poweron");
			$(".settings-projector").addClass("poweroff");
		}
		if(obj.curtain == 2) {
			$(".settings-curtain").removeClass("poweroff");
			$(".settings-curtain").addClass("poweron");
		} else if(obj.curtain == 1) {
			$(".settings-curtain").removeClass("poweron");
			$(".settings-curtain").addClass("poweroff");
		}
	});
})

//删除-确认键
$(".re-delete").click(function() {
	var $this = $(this);
	var index = $this.attr("index");
	//$this.attr('disabled', 'true');
	$.getJSON('/api/mtr/mode/delete?id=' + $this.val(), function(response) {
		//$("div#new-model").remove();
		$("#add>.new-model:nth-child(" + (parseInt(index) + 1) + ")").remove();
	})
});

//点击关闭后点击自定义清除效果
$(".close").click(function() {
	clearDetail();
});

//重置键 调用update接口更新数据
$(".reset").click(function() {
	var $this = $(this);
	settingstatus();
	$.getJSON('/api/mtr/mode/update?id=' + $this.val() + '&name=' + name + '&monitor=' + monitor + '&lamp=' + lamp + '&projector=' + projector + '&curtain=' + curtain + '&glass=' + glass);
	clearData();
	clearDetail();
	$(".close").click();
	modelist();
});

//保存键 调用create接口保存数据
$(".save").click(function() {
	settingstatus(); //获取设备设置状态
	if(name == "") {
		name = "自定义";
	}
	$.getJSON('/api/mtr/mode/create?name=' + name + '&monitor=' + monitor + '&lamp=' + lamp + '&projector=' + projector + '&curtain=' + curtain + '&glass=' + glass);
	clearData();
	clearDetail();
	modelist();
});

//自定义状态下开关效果，通过settingstatus函数取值传参
$(".settings-monitor").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.poweron');
	console.log(poweron);
	if(poweron) {
		$(".settings-monitor").removeClass('poweron');
		$(".settings-monitor").addClass('poweroff');
	} else {
		$(".settings-monitor").removeClass('poweroff');
		$(".settings-monitor").addClass('poweron');
	}
	$this.removeAttr('disabled');
});
$(".settings-big-center").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.lighton');
	console.log(poweron);
	if(poweron) {
		$(".settings-big-center").removeClass('lighton');
		$(".settings-big-center").addClass('lightoff');
	} else {
		$(".settings-big-center").removeClass('lightoff');
		$(".settings-big-center").addClass('lighton');
	}
	$this.removeAttr('disabled');
});
$(".settings-big-side").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.lighton');
	console.log(poweron);
	if(poweron) {
		$(".settings-big-side").removeClass('lighton');
		$(".settings-big-side").addClass('lightoff');
	} else {
		$(".settings-big-side").removeClass('lightoff');
		$(".settings-big-side").addClass('lighton');
	}
	$this.removeAttr('disabled');
});
$(".settings-small-center").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.lighton');
	console.log(poweron);
	if(poweron) {
		$(".settings-small-center").removeClass('lighton');
		$(".settings-small-center").addClass('lightoff');
	} else {
		$(".settings-small-center").removeClass('lightoff');
		$(".settings-small-center").addClass('lighton');
	}
	$this.removeAttr('disabled');
});
$(".settings-small-side").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.lighton');
	console.log(poweron);
	if(poweron) {
		$(".settings-small-side").removeClass('lighton');
		$(".settings-small-side").addClass('lightoff');
	} else {
		$(".settings-small-side").removeClass('lightoff');
		$(".settings-small-side").addClass('lighton');
	}
	$this.removeAttr('disabled');
});

$(".settings-projector").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.poweron');
	console.log(poweron);
	if(poweron) {
		$(".settings-projector").removeClass('poweron');
		$(".settings-projector").addClass('poweroff');
	} else {
		$(".settings-projector").removeClass('poweroff');
		$(".settings-projector").addClass('poweron');
	}
	$this.removeAttr('disabled');
});
$(".settings-curtain").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.poweron');
	console.log(poweron);
	if(poweron) {
		$(".settings-curtain").removeClass('poweron');
		$(".settings-curtain").addClass('poweroff');
	} else {
		$(".settings-curtain").removeClass('poweroff');
		$(".settings-curtain").addClass('poweron');
	}
	$this.removeAttr('disabled');
});
$(".settings-glass").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.poweron');
	console.log(poweron);
	if(poweron) {
		$(".settings-glass").removeClass('poweron');
		$(".settings-glass").addClass('poweroff');
	} else {
		$(".settings-glass").removeClass('poweroff');
		$(".settings-glass").addClass('poweron');
		$(".settings-special-1").removeClass('poweron');
		$(".settings-special-1").addClass('poweroff');
		$(".settings-special-2").removeClass('poweron');
		$(".settings-special-2").addClass('poweroff');
		$(".settings-special-3").removeClass('poweron');
		$(".settings-special-3").addClass('poweroff');
	}
	$this.removeAttr('disabled');
});
$(".settings-special-1").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.poweron');
	console.log(poweron);
	if(poweron) {
		$(".settings-special-1").removeClass('poweron');
		$(".settings-special-1").addClass('poweroff');
	} else {
		$(".settings-glass").removeClass('poweron');
		$(".settings-glass").addClass('poweroff');
		$(".settings-special-1").removeClass('poweroff');
		$(".settings-special-1").addClass('poweron');
		$(".settings-special-2").removeClass('poweron');
		$(".settings-special-2").addClass('poweroff');
		$(".settings-special-3").removeClass('poweron');
		$(".settings-special-3").addClass('poweroff');
	}
	$this.removeAttr('disabled');
});
$(".settings-special-2").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.poweron');
	console.log(poweron);
	if(poweron) {
		$(".settings-special-2").removeClass('poweron');
		$(".settings-special-2").addClass('poweroff');
	} else {
		$(".settings-glass").removeClass('poweron');
		$(".settings-glass").addClass('poweroff');
		$(".settings-special-1").removeClass('poweron');
		$(".settings-special-1").addClass('poweroff');
		$(".settings-special-2").removeClass('poweroff');
		$(".settings-special-2").addClass('poweron');
		$(".settings-special-3").removeClass('poweron');
		$(".settings-special-3").addClass('poweroff');
	}
	$this.removeAttr('disabled');
});
$(".settings-special-3").bind('click', function() {
	var $this = $(this);
	$this.attr('disabled', 'true');
	var poweron = $this.is('.poweron');
	console.log(poweron);
	if(poweron) {
		$(".settings-special-3").removeClass('poweron');
		$(".settings-special-3").addClass('poweroff');
	} else {
		$(".settings-glass").removeClass('poweron');
		$(".settings-glass").addClass('poweroff');
		$(".settings-special-1").removeClass('poweron');
		$(".settings-special-1").addClass('poweroff');
		$(".settings-special-2").removeClass('poweron');
		$(".settings-special-2").addClass('poweroff');
		$(".settings-special-3").removeClass('poweroff');
		$(".settings-special-3").addClass('poweron');
	}
	$this.removeAttr('disabled');
});