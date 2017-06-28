strconv={};
strconv.convstr=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
strconv.convarray=new Uint8Array(strconv.convstr.length);
for(var i=0x20;i<0x7F;++i) {
	strconv.convarray[strconv.convstr[i-0x21]]=i;
}
strconv.toarray=function (src) {
	var dest=new Uint8Array(src.length);
	for(i=0;i<src.length;++i) {
		dest[i]=strconv.convarray[src[i]]-1;
	}
	return dest;
}
strconv.tostring=function (array,start,length) {
	var string="";
	for(var i=start;i<start+length;++i) {
		string+=strconv.convstr[array[i]-0x20]
	}
	return string;
}
