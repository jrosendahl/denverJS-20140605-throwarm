'use strict';

var Datagram = require('throwarm').Datagram;
var endPoint = require('../endPoints/store');

function Store() {
	Object.defineProperty(this,'base',{value:Datagram, writable:false,configurable:true,enumerable:false});
	this.base(this);
	this.endPoint = new endPoint('store', 'store_id');
	this.fieldMap = {
		id: 'store_id',
		city: 'city',
		address: 'address',
	};
}

Store.prototype = new Datagram();
Store.prototype.constructor = Store;

module.exports = Store;
