comm={}
comm.MAXMESSAGELENGTH=1024
comm.SIGNUP={}
comm.SIGNUP.INIT=0
comm.SIGNUP.CHOOSEFIRSTPLANET=10
comm.SUCCSESS={}
comm.SUCCSESS.LOGIN=0
comm.SUCCSESS.SIGNUP=1
comm.SUCCSESS.SIGNUP_INIT=2
comm.ERROR={}
comm.ERROR.NAMETAKEN=0
comm.ERROR.PLANETAREADYCLAIMED=5
comm.CODE={}
comm.CODE.PLAYERSTATE=1
comm.CODE.UPGRADE=2
comm.CODE.CHANGEPLANETVIEW=3
comm.CODE.SYSTEMSTATE=4
comm.CODE.OWNEDPLANETS=5
comm.CODE.LOGIN=6
comm.CODE.SIGNUP=7
comm.CODE.BUILDSHIPS=8
comm.CODE.STARTMISSION=9
comm.CODE.CHOOSEFIRSTPLANET=10
comm.CODE.ECHO=253
comm.CODE.SUCCSESS=254
comm.CODE.ERROR=255
comm.PL={}
comm.PL.NUMGALAXIES=10
comm.PL.NUMSYSTEMS=100
comm.PL.NUMPLANETS=10
comm.ECO={}
comm.ECO.NUMRESOURCES=3
comm.ECO.BTYPES={}
comm.ECO.BTYPES.SHIPYARD=6
comm.SHP={}
comm.SHP.NUMTYPES=3
comm.MIS={}
comm.MIS.NUMTYPE=3
comm.MIS.TYPE={}
comm.MIS.TYPE.ATTACK=0
comm.error={}
comm.error.messages=[]
comm.error.messages[0]="Name already taken"
comm.error.messages[1]="Name size mismatch"
comm.error.messages[2]="Password size mismatch"
comm.error.messages[3]="Player not found"
comm.error.messages[4]="Incorrect password"
comm.error.messages[5]="Planet already claimed"
comm.error.messages[6]="Planet view index is out of range"
comm.error.messages[7]="System coordinates are out of range"
comm.error.messages[255]="Disconnected from server"
comm.read_U8Int=function (array,index) {
	return array[index]
}
comm.read_U16Int=function (array,index) {
	return 256*array[index+1]+array[index]
}
comm.read_U32Int=function (array,index) {
	return 16777216*array[index+3]+65536*array[index+2]+256*array[index+1]+array[index+0]
}
comm.upgrade=function (type) {
	var stck=stack.init(comm.MAXMESSAGELENGTH)
	stck=stack.push_char(stck,comm.CODE.UPGRADE)
	stck=stack.push_char(stck,type)
	ws.write(stck)
}
comm.changeplanetview=function (index) {
	var stck=stack.init(comm.MAXMESSAGELENGTH)
	stck=stack.push_char(stck,comm.CODE.CHANGEPLANETVIEW)
	stck=stack.push_int(stck,index)
	ws.write(stck)
}
comm.login=function (name, password) {
	var stck=stack.init(comm.MAXMESSAGELENGTH)
	var data=strconv.toarray(name)
	stck=stack.push_char(stck,comm.CODE.LOGIN)
	stck=stack.push_char(stck,name.length)
	stck=stack.push(stck,data,name.length)
	data=strconv.toarray(password)
	stck=stack.push_char(stck,password.length)
	stck=stack.push(stck,data,password.length)
	ws.write(stck)
}
comm.choosefirstplanet=function (g,s,p) {//arguments are the coordinates of the planet
	var stck=stack.init(comm.MAXMESSAGELENGTH)
	stck=stack.push_char(stck,comm.CODE.CHOOSEFIRSTPLANET)
	stck=stack.push_char(stck,g)
	stck=stack.push_short(stck,s)
	stck=stack.push_char(stck,p)
	ws.write(stck);
}
comm.signup=function (name,password) {
	var payload=stack.init(comm.MAXMESSAGELENGTH)
	var data=strconv.toarray(name)
	payload=stack.push_char(payload,comm.CODE.SIGNUP)
	payload=stack.push_char(payload,name.length)
	payload=stack.push(payload,data,name.length)
	data=strconv.toarray(password)
	payload=stack.push_char(payload,password.length)
	payload=stack.push(payload,data,password.length)
	ws.write(payload)
}
comm.buildships=function (numships,type) {
	var payload=stack.init(comm.MAXMESSAGELENGTH)
	payload=stack.push_char(payload,comm.CODE.BUILDSHIPS)
	payload=stack.push_int(payload,numships)
	payload=stack.push_char(payload,type)
	ws.write(payload)
}
comm.getownedplanets=function() {
	var stck=stack.init(comm.MAXMESSAGELENGTH)
	var data=strconv.toarray(name)
	stck=stack.push_char(stck,comm.CODE.OWNEDPLANETS)
	ws.write(stck);
}
comm.getsystemstate=function (g,s) {
	var stck=stack.init(comm.MAXMESSAGELENGTH)
	stck=stack.push_char(stck,comm.CODE.SYSTEMSTATE)
	stck=stack.push_char(stck,g)
	stck=stack.push_short(stck,s)
	ws.write(stck)
}
comm.readownedplanets=function (data) {
	var offset=1;
	var ownedplanets={}
	ownedplanets.num=comm.read_U32Int(data,offset)
	offset+=4;
	ownedplanets.objs=[]
	for(var i=0;i<ownedplanets.num;++i) {
		ownedplanets.objs[i]={}
		ownedplanets.objs[i].g=comm.read_U8Int(data,offset)
		offset+=1
		ownedplanets.objs[i].s=comm.read_U16Int(data,offset)
		offset+=2
		ownedplanets.objs[i].p=comm.read_U8Int(data,offset)
		offset+=1
	}
	return ownedplanets
}
comm.readsystemstate=function (data) {
	var system={}
	var offset=1;
	var namelength;
	system.g=data[offset];
	offset+=1
	system.s=comm.read_U16Int(data,offset)
	offset+=2
	system.planets=[]
	for(var i=0;i<comm.PL.NUMPLANETS;++i) {
		system.planets[i]={}
		namelength=data[offset]
		offset+=1
		system.planets[i].owner=strconv.tostring(data,offset,namelength)
		offset+=namelength
	}
	return system
}
comm.readplayerstate=function (data) {
	var player={};
	player.planet={};
	player.missions={};
	var offset=1
	player.planet.resources=[];
	for(var i=0;i<comm.ECO.NUMRESOURCES;++i) {
		player.planet.resources[i]=comm.read_U32Int(data,offset);
		offset+=4
	}
	player.planet.rpbuildings=[]
	for(var i=0;i<comm.ECO.NUMRESOURCES;++i) {
		player.planet.rpbuildings[i]={}
		player.planet.rpbuildings[i].level=comm.read_U32Int(data,offset);
		offset+=4
		player.planet.rpbuildings[i].upgradetime=comm.read_U32Int(data,offset);
		offset+=4
	}
	player.planet.rsbuildings=[]
	for(var i=0;i<comm.ECO.NUMRESOURCES;++i) {
		player.planet.rsbuildings[i]={}
		player.planet.rsbuildings[i].level=comm.read_U32Int(data,offset);
		offset+=4
		player.planet.rsbuildings[i].upgradetime=comm.read_U32Int(data,offset);
		offset+=4
	}
	player.planet.shipyard={}
	player.planet.shipyard.level=comm.read_U32Int(data,offset);
	offset+=4
	player.planet.shipyard.upgradetime=comm.read_U32Int(data,offset);
	offset+=4
	player.planet.shipyard.buildtime=comm.read_U32Int(data,offset);
	offset+=4
	player.planet.ships=[]
	for(var i=0;i<comm.SHP.NUMTYPES;++i) {
		player.planet.ships[i]=comm.read_U32Int(data,offset);
		offset+=4
	}
	player.missions.nummissions=comm.read_U8Int(data,offset)
	offset+=1
	player.missions.objects=[]
	for(var i=0;i<player.missions.nummissions;++i) {
		player.missions.objects[i]={}
		player.missions.objects[i].type=comm.read_U8Int(data,offset)
		offset+=1
		player.missions.objects[i].returning=comm.read_U8Int(data,offset)
		offset+=1
		player.missions.objects[i].traveltime=comm.read_U32Int(data,offset)
		offset+=4
		offset+=32
	}
	return player
}
comm.startmission=function (type, nships, resources, tg, ts, tp) {
	payload=stack.init(comm.MAXMESSAGELENGTH);
	payload=stack.push_char(payload,comm.CODE.STARTMISSION);
	payload=stack.push_char(payload,type);
	for(var i=0;i<comm.SHP.NUMTYPES;++i) {
		payload=stack.push_int(payload,nships[i]);
	}
	for(var i=0;i<comm.ECO.NUMRESOURCES;++i) {
		payload=stack.push_int(payload,resources[i]);
	}
	payload=stack.push_char(payload,tg)
	payload=stack.push_short(payload,ts)
	payload=stack.push_char(payload,tp)
	ws.write(payload)
}
