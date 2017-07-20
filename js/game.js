game={}
game.buildings={}
game.buildings['metal_mine']={
	"id":0,
	"display_name":"Metal Mine",
	"resource_name":"metal",
	"resource_relation":"production"
}
game.buildings['crystal_mine']={
	"id":1,
	"display_name":"Crystal Mine",
	"resource_name":"crystal",
	"resource_relation":"production"
}
game.buildings['gas_mine']={
	"id":2,
	"display_name":"Gas Mine",
	"resource_name":"gas",
	"resource_relation":"production"
}
game.buildings['metal_storage']={
	"id":3,
	"display_name":"Metal Storage",
	"resource_name":"metal",
	"resource_relation":"storage"
}
game.buildings['crystal_storage']={
	"id":4,
	"display_name":"Crystal Storage",
	"resource_name":"crystal",
	"resource_relation":"storage"
}
game.buildings['gas_storage']={
	"id":5,
	"display_name":"Gas Storage",
	"resource_name":"gas",
	"resource_relation":"storage"
}
game.buildings['shipyard']={
	"id":6,
	"display_name":"Shipyard",
	"resource_name":"ship",
	"resource_relation":"build_speed_mult"
}
game.disp={}
game.disp.menu={}
game.disp.menu.showOnly=function (name) {
	$(".menu").hide()
	$("#"+name).show()
}
game.disp.menu.showBuilding=function (name) {
	document.getElementById("building_menu").innerHTML=`
	<button onclick="game.disp.menu.showOnly('main_menu')">Close</button>
	${game.buildings[name].display_name}
	<div>
		<img src="./img/${name}.png">
		<span id="building_name" style="display:none">${name}</span>
		<table>
			<tr>
				<td>Level:</td><td id="building_level">undef</td>
			</tr>
			<tr>
				<td>${game.buildings[name].resource_name} ${game.buildings[name].resource_relation}:</td><td id="${game.buildings[name].resource_name}_${game.buildings[name].resource_relation}">undef</td>
			</tr>
			<tr colspan="2">
				<td>Upgrade Costs</td>
			</tr>
			<tr>
				<td>Metal:</td><td id="metal_upgrade_cost">undef</td>
			</tr>
			<tr>
				<td>Crystal:</td><td id="crystal_upgrade_cost">undef</td>
			</tr>
			<tr>
				<td>Gas:</td><td id="gas_upgrade_cost">undef</td>
			</tr>
			<tr>
				<td>Time:</td><td id="time_upgrade_cost">undef</td>
			</tr>
		</table>
		<button onclick="comm.upgrade(${game.buildings[name].id})" id="upgrade_time_remaining">Upgrade</button>
	</div>
	`
	game.disp.update_building_stats();
	game.disp.menu.showOnly("building_menu");
}
game.disp.update_building_stats=function() {
	//update the building stats
	if($("#building_menu").text()!=="") {
		var bname=document.getElementById("building_name").innerHTML
		switch(game.buildings[bname].resource_relation) {
			case "production":
				document.getElementById("building_level").innerHTML=pldata.planet.rpbuildings[game.buildings[bname].id].level;
				document.getElementById("upgrade_time_remaining").innerHTML=pldata.planet.rpbuildings[game.buildings[bname].id].upgradetime;
			break;
			case "storage":
				document.getElementById("building_level").innerHTML=pldata.planet.rsbuildings[game.buildings[bname].id-3].level;
				document.getElementById("upgrade_time_remaining").innerHTML=pldata.planet.rsbuildings[game.buildings[bname].id-3].upgradetime;
			break;
			case "build_speed_mult":
				document.getElementById("building_level").innerHTML=pldata.planet.shipyard.level;
				document.getElementById("upgrade_time_remaining").innerHTML=pldata.planet.shipyard.upgradetime;
			break;
		}
	}
}
game.disp.build_time=function(time) {
	if(time==0) {
		document.getElementById("shp_t").innerHTML="Not building"
	}
	else {
		document.getElementById("shp_t").innerHTML=time;
	}
}
game.disp.ships=function (data) {//player.planet.ships object
	inputs=document.querySelectorAll('input[name="mis_s"]');
	for(i=0;i<comm.SHP.NUMTYPES;++i) {
		inputs[i].placeholder=data[i];
	}
}
game.disp.playerstate=function (data) {//update the displays using the data recieved from the server
	pldata=data
	//update the resource amounts
	var elems=$("#resource_subdiv [id]");
	for(i=0;i<3;++i) {
		elems[i].innerHTML=data.planet.resources[i]
	}
	game.disp.update_building_stats();
	game.disp.build_time(data.planet.shipyard.buildtime);
	game.disp.missions(data.missions);
	game.disp.ships(data.planet.ships);
}
game.disp.ownedplanets=function (data) {
	document.getElementById("planets_menu").innerHTML=`
	<button onclick="game.disp.menu.showOnly('main_menu')">Close</button><div>
	<span>Owned Planets</span>`
	for(i=0;i<data.num;++i) {
		document.getElementById("planets_menu").innerHTML+=`
		<span>${data.objs[i].g}:${data.objs[i].s}:${data.objs[i].p} </span><button onclick="comm.changeplanetview(${i});game.disp.menu.showOnly('main_menu')">Switch To</button><br>
		`
	}
	document.getElementById("planets_menu").innerHTML+=`</div>`
	
}
game.disp.mission_type_to_string=function (type) {//just int to string conversion, I just realized I could have used a simple array for this
	switch(type) {
		case 0:
			return "Attack"
		break;
		case 1:
			return "Colonize"
		break;
		case 3:
			return "Transport"
		break;
	}
}
game.disp.travel_type_to_string=function (type) {//same here
	switch(type) {
		case 0:
			return "Arriving"
		break;
		case 1:
			return "Returning"
		break;
	}
}
game.disp.missions=function(data) {//player.missions object
	
	var disp=document.getElementById("missions_disp");
	if(data.nummissions==0) {
		disp.innerHTML=""
	}
	var HTML=""
	HTML=`
	<table class="center">
		<tr>
			<td>Type</td><td>Status</td><td>Travel Time</td>
		</tr>`;
	for(i=0;i<data.nummissions;++i) {
		HTML+=`
		<tr>
			<td>${game.disp.mission_type_to_string(data.objects[i].type)}</td><td>${game.disp.travel_type_to_string(data.objects[i].returning)}</td><td>${data.objects[i].traveltime}</td>
		</tr>`;
	}
	HTML+=`
	</table>
	`
	disp.innerHTML=HTML;
}
game.start_mission=function () {
	//thank you guy on stackoverflow, this is a much better solution. I would have used a for loop to loop through ids
	type=parseInt(document.querySelector('input[name="mis_m_t"]:checked').value);
	//gave me the idea to do this
	coords=[]
	coordinputs=document.querySelectorAll('input[name="mis_c"]');
	for(var i=0;i<coordinputs.length;++i) {
		coords[i]=parseInt(coordinputs[i].value)
	}
	ships=[]
	shipinputs=document.querySelectorAll('input[name="mis_s"]');
	for(var i=0;i<shipinputs.length;++i) {
		if(shipinputs[i].value=="") {
			ships[i]=0;
		}
		else {
			ships[i]=parseInt(shipinputs[i].value)
			shipinputs[i].value=""
		}
	}
	resources=[]
	resourceinputs=document.querySelectorAll('input[name="mis_r"]')
	for(var i=0;i<resourceinputs.length;++i) {
		if(resourceinputs[i].value=="") {
			resources[i]=0;
		}
		else {
			resources[i]=parseInt(resourceinputs[i].value)
			resourceinputs[i].value="0"
		}
	}
	console.log(coords,ships,resources)
	comm.startmission(type,ships,resources,coords[0],coords[1],coords[2]);
}
game.signup=function() {
	name=document.getElementById("signup_name").value;
	password=document.getElementById("signup_password").value;
	comm.signup(name,password);
}
game.handlesuccsess=function (type) {
	switch(type) {
		case comm.SUCCSESS.LOGIN:
			//display main menu
			comm.getownedplanets()
			game.disp.menu.showOnly("planets_menu");
		break;
		case comm.SUCCSESS.SIGNUP_INIT:
			var coords=[];
			var coordinputs=document.querySelectorAll('input[name="su_c"]');
			for(var i=0;i<coordinputs.length;++i) {
				coords[i]=parseInt(coordinputs[i].value)
			}
			comm.choosefirstplanet(coords[0],coords[1],coords[2]);
		break;
		case comm.SUCCSESS.SIGNUP:
			//display main menu
			comm.getownedplanets()
			game.disp.menu.showOnly("planets_menu");
		break;
	}
}
game.init=function() {
	document.getElementById("building_menu").innerHTML=""
	ws.connect("ws://nicksnow.tk:1233")
	var stck=stack.init(comm.MAXMESSAGELENGTH)
	ws.socket.onmessage=function (event) {
		ws.read(stck,event);
		console.log(stck.array[0])
		switch(stck.array[0]) {
			case comm.CODE.PLAYERSTATE:
				//console.log("Received player state")
				game.disp.playerstate(comm.readplayerstate(stck.array))
			break;
			case comm.CODE.OWNEDPLANETS:
				console.log("Received owned planets")
				game.disp.ownedplanets(comm.readownedplanets(stck.array))
			break;
			case comm.CODE.SYSTEMSTATE:
				console.log("Received system state")
				game.display.systemstate(comm.readsystemstate(stck.array))
			break;
			case comm.CODE.SUCCSESS:
				game.handlesuccsess(stck.array[1])
			break;
		}
	}
}
game.init()
