'use strict';
function Datagram(self) {
	
	function fill (query) {
		function keyRepresentsSingleValue(item) {
			var isSame;
			if(item[self.fieldMap[key]] instanceof Date) {
				isSame = item[self.fieldMap[key]].valueOf() === query[0][self.fieldMap[key]].valueOf();
			}
			else {
				isSame = item[self.fieldMap[key]] === query[0][self.fieldMap[key]];
			}
			return isSame;
		}

		for(var key in self.fieldMap) {
			if(query.every(keyRepresentsSingleValue)) {
				if(typeof self.fieldMap[key] === 'string') {
					self[key] = query[0][self.fieldMap[key]];
				}
				else {
					if(self.fieldMap[key] instanceof Datagram || self.fieldMap[key] instanceof Dataset) {
						self[key] = self.fieldMap[key];
						self[key].fill(query);
					}
					else{
						self[key] = self.fieldMap[key].fill(query);
					}
				}
			}
			else {
				throw new Error('Query pased to Datagram contains more than one possible value for: ' + self.fieldMap[key]);
			}
			
		}
	}
	
	function has(key, type) {
		if(self[key]) {
			if(self[key] instanceof Dataset) {	
				return self[key].typeName === type;
			}
			else {
				return self[key].constructor.name === type;
			}
		}
		else {
			return false;
		}
	}

	function single(id, callback) {
		self.endPoint.get(id, function(err, results) {
			if(err) {return callback(err);}
			if(results.length === 0) {return callback(new Error('Single Failed - no record'));}
			self.fill(results);
			callback(err, self);
		});
	}
	

	Object.defineProperty(this,'has',{value:has, writable:false,configurable:true,enumerable:false});
	Object.defineProperty(this,'fill',{value:fill, writable:false,configurable:true,enumerable:false});
	Object.defineProperty(this,'fieldMap',{writable:true,enumerable:false});
	Object.defineProperty(this,'endPoint',{writable:true,enumerable:false});
	Object.defineProperty(this,'async_single',{value:single, writable:true,configurable:true,enumerable:false});
}
exports.Datagram = Datagram;

function Calc(fields, calc) {
	this.fill = function(query) {
		var args = [];
		if(fields instanceof Array) {
			for(var i = 0; i < fields.length; i++) {
				args.push(query[0][fields[i]]);
			}
		}
		else {
			args.push(query[0][fields]);
		}
		return calc.apply(this,args);
	};
}
exports.Calc = Calc;


function Dataset() {
	var arr = [];
	arr.push.apply(arr, arguments);
	arr.__proto__ = Dataset.prototype;

	function copyReturn(source, destination) {
		source.forEach(function(value) {
			destination.push(value);
		});
		return destination;
	}

	Object.defineProperty(arr,'copyReturn',{value:copyReturn,writable:false,configurable:false,enumerable:false});
	Object.defineProperty(arr,'key',{writable:true,configurable:true,enumerable:false});
	Object.defineProperty(arr,'items',{writable:true,configurable:true,enumerable:false});
	Object.defineProperty(arr,'typeName',{writable:true,configurable:true,enumerable:false});
	return arr;
}
Dataset.prototype = [];

Dataset.prototype.fill = function(query) {
	var self = this;
	function splitQuery(splits, item, idx, array) {
		if(self.key) {
			if(idx === 0 || item[self.key]!== array[idx-1][self.key]) {
				splits.push([]);
			}

			splits[splits.length -1].push(item);
			return splits;
		}
		else {
			throw new Error('Can not process Dataset - Key not defined');
		}
	}

	function sortFunction(a,b) {
		if (a[self.key] > b[self.key]) {
			return 1;
		}
		if (a[self.key] < b[self.key]) {
			return -1;
		}
		return 0;
	}

	query = query.sort(sortFunction);

	var split = query.reduce(splitQuery,[]);

	for(var i = 0;i < split.length; i++) {
		if(split[i][0][self.key] !== null) {
			var item = self.items();
			item.fill(split[i]);
			self.push(item);
		}
	}
};

Dataset.prototype.has = function(type) {
	var self = this;
	function checkForSame(item) {
		if(item instanceof Dataset) {	
			return item.typeName === type;
		}
		else {
			return item.constructor.name === type;
		}
	}
	return self.every(checkForSame);
};
exports.Dataset = Dataset;