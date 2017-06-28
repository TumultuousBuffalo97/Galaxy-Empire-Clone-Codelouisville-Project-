stack={};
stack.init=function (size) {
	var obj={};
	obj.array=new Uint8Array(size);
	obj.size=size;
	obj.length=0;
	obj.pos=0;
	return obj;
}
stack.push=function (stck, data, length) {
	for(var i=0; i<length; ++i) {
		stck.array[stck.pos+i]=data[i];
	}
	if(stck.pos==stck.length) {
		stck.length+=length;
	}
	stck.pos+=length;
	return stck;
}
stack.push_char=function (stck, data) {
	stck.array[stck.pos]=data;
	if(stck.pos>=stck.length) {
		stck.length++;
	}
	stck.pos++;
	return stck;
}
stack.push_short=function (stck, num) {
	stck.array[stck.pos]=num&0x00FF;
	stck.array[stck.pos+1]=(num&0xFF00)/256;
	if(stck.pos>=stck.length-2) {
		stck.length+=2;
	}
	stck.pos+=2;
	return stck;
}
stack.push_int=function (stck, num) {
	stck.array[stck.pos+3]=(num&0xFF000000)/1677216;
	stck.array[stck.pos+2]=(num&0x00FF0000)/65536;
	stck.array[stck.pos+1]=(num&0x0000FF00)/256;
	stck.array[stck.pos]=(num&0x000000FF);
	if(stck.pos>=stck.length-4) {
		stck.length+=4;
	}
	stck.pos+=4;
	return stck;
}
stack.read=function (stck, dest, length) {
	for(var i=0; i<length; ++i) {
		dest[i]=stck.array[stck.pos+i];
	}
	pos+=length;
}
stack.read_char=function (stck, dest) {
	dest=stck.array[stck.pos];
	pos++;
}
stack.setpos=function(stck,pos) {
	return stck.pos=pos
}
