ws={};
ws.connect=function (url) {
	ws.socket=new WebSocket(url);
	ws.socket.binaryType="arraybuffer";
}
ws.write=function (stck) {
	var data=new Uint8Array(stck.length);
	for(var i=0;i<stck.length;++i) {
		data[i]=stck.array[i];
	}
	ws.socket.send(data);
}
ws.write_str=function (msg) {
	var data=strconv.toarray(msg);
	var stck=stack.init(data.length);
	stack.push(stck,data,data.length);
	ws.write(stck);
}
ws.read=function (stck, event) {
	var data=new Uint8Array(event.data);
	stack.setpos(stck,0)
	return stack.push(stck,data,data.length);
}
