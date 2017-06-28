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
		}
	}
}
game.disp.playerstate=function (data) {
	pldata=data
	//update the resource amounts
	var elems=$("#resource_subdiv [id]");
	for(i=0;i<3;++i) {
		elems[i].innerHTML=data.planet.resources[i]
	}
	game.disp.update_building_stats();
}
game.disp.ownedplanets=function (data) {
	document.getElementById("planets_menu").innerHTML=`
	<button onclick="game.disp.menu.showOnly('main_menu')">Close</button><div>
	`
	for(i=0;i<data.num;++i) {
		document.getElementById("planets_menu").innerHTML+=`
		<button onclick="comm.changeplanetview(${i})">${data.objs[0].g}:${data.objs[0].s}:${data.objs[0].p}</button>
		`
	}
	document.getElementById("planets_menu").innerHTML+=`</div>`
	
}
game.init=function() {
	document.getElementById("building_menu").innerHTML=""
	ws.connect("ws://192.168.12.189:25565")
	var stck=stack.init(comm.MAXMESSAGELENGTH)
	ws.socket.onmessage=function (event) {
		ws.read(stck,event);
		console.log(stck.array[0])
		switch(stck.array[0]) {
			case comm.CODE.PLAYERSTATE:
				console.log("Received player state")
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
				comm.getownedplanets()
				game.disp.showOnly("planets_menu")
			break;
		}
	}
}
game.init()
