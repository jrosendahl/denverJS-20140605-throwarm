'use strict';

/* global describe */
/* global it */
/* global before */
/*jshint expr: true*/

require('should');

////This is that data set we will be using, normally this is the result of a SQl query
var row = [];

row[0] = {};
row[0].mainID = 123;
row[0].mainName = 'Parent';
row[0].mainProperty = 'Taller than childern';
row[0].childID = 1;
row[0].childName = 'Billie';
row[0].childProperty = 'Fast';
row[0].childType = 'Good';
row[0].calculate = 'fresh';

row[1] = {};
row[1].mainID = 123;
row[1].mainName = 'Parent';
row[1].mainProperty = 'Taller than childern';
row[1].childID = 2;
row[1].childName = 'Suzie';
row[1].childProperty = 'Devious';
row[1].childType = 'Bad';
row[1].calculate = 'stale';

row[2] = {};
row[2].mainID = 123;
row[2].mainName = 'Parent';
row[2].mainProperty = 'Taller than childern';
row[2].childID =3;
row[2].childName ='Jamie';
row[2].childProperty = 'Stable';
row[2].childType = 'Good';
row[2].calculate = 'stale';

row[3] = {};
row[3].mainID = 123;
row[3].mainName = 'Parent';
row[3].mainProperty = 'Taller than childern';
row[3].childID =4;
row[3].childName ='Cindy';
row[3].childProperty = 'Fast';
row[3].childType = 'Good';
row[3].calculate = 'toasted';


var Datagram = require('../index').Datagram;
var Dataset = require('../index').Dataset;
var Calc = require('../index').Calc;


// This section creates the data set and datagram objects, normally each of these would be in a sperate file
function Parent() {
	Object.defineProperty(this,'base',{value:Datagram, writable:false,configurable:true,enumerable:false});

	this.base(this);
	this.fieldMap =  {
		id:'mainID',
		name: 'mainName',
		property1: 'mainProperty'
	};

}
Parent.prototype = new Datagram();
Parent.prototype.constructor = Parent;


function Child() {
	Object.defineProperty(this,'base',{value:Datagram, writable:false,configurable:true,enumerable:false});

	this.base(this);
	this.fieldMap =  {
		id:'childID',
		name: 'childName',
		property1: 'childProperty',
		type: 'childType', 
		edible: new Calc('calculate', function(val) {return( val !== 'stale');}),
		concat: new Calc(['calculate', 'childType'], function(val, val2) {return val + ' ' + val2;})
	};

}

Child.prototype = new Datagram();
Child.prototype.constructor = Child;


//here is a simple function 
Child.prototype.isFast = function() {
	var self = this;
	return self.property1 === 'Fast';
};



function Childern() {
	var childern = new Dataset();
	childern.typeName= 'Childern';

	//I am adding a function to the object
	function getByType(type) {
		var self = this;
		function byType(child) {
			return child.type === type;
		}
		return self.copyReturn(self.filter(byType), new Childern());
	}
	Object.defineProperty(childern,'getByType',{value:getByType,writable:false,configurable:false,enumerable:false});
	
	function getById(id) {
		var self = this;
		function byID(child) {
			return child.id == id;
		}
		var child = self.filter(byID);
		if(child.length === 0) {
			return null;
		}
		return child[0];
	}

	Object.defineProperty(childern,'getById',{value:getById,writable:false,configurable:false,enumerable:false});
	
	//Once the definition is complete you must return the object
	return childern;
}

//This is one way to look at the data
var parentWithKids = new Parent();
parentWithKids.fieldMap.kids = new Childern();
parentWithKids.fieldMap.kids.key = 'childID';

parentWithKids.fieldMap.kids.items = function () {
	var child = new Child();
	return child;
};


//This is a different way to look at the same data
var kidsWithParent = new Childern();
kidsWithParent.key = 'childID';
kidsWithParent.items= function() {
	var child = new Child();
	child.fieldMap.parent = new Parent();
	return child;
};


describe('The Throwarm Library', function() {
	describe('parentWithKids', function () {
		before(function() {
			parentWithKids.fill(row);
		});
		it('should have processed the table' ,function() {
			parentWithKids.name.should.equal('Parent');
			parentWithKids.kids.length.should.equal(4);
			parentWithKids.kids[0].id.should.equal(1);
			parentWithKids.kids[0].edible.should.equal(true);
			parentWithKids.kids[0].concat.should.equal('fresh Good');
		});
		it('calling getByType should return a subset of Childern maintaing type', function() {
			var goodKids = parentWithKids.kids.getByType('Good');
			goodKids.length.should.equal(3);
			//Can;t really use instance of (since it is an array so check byu callign function)
			goodKids.typeName.should.equal('Childern');
			goodKids.getById(1).should.be.instanceOf(Child);
			goodKids.getById(1).name.should.equal('Billie');
			//since the bad kid was filered out it does not exist;
			(goodKids.getById(2) === null).should.be.true;
		});
		it('The childern should have isFast set', function() {
			parentWithKids.kids[0].isFast().should.be.true;
			parentWithKids.kids[2].isFast().should.be.false;

		});
		it('has for the childern should work', function(){
			parentWithKids.kids.has('Child').should.be.true;
			parentWithKids.kids.has('Parent').should.be.false;
			parentWithKids.kids.has('I Do Not Exist').should.be.false;
		});
		it('has for the parent should work', function(){
			parentWithKids.has('kids', 'Childern').should.be.true;
			parentWithKids.has('NA', 'Childern').should.be.false;
			parentWithKids.has('kids', 'NA').should.be.false;
			parentWithKids.has('NA', 'NA').should.be.false;
		});

	});

	describe('kidsWithParent', function () {
		before(function() {
			kidsWithParent.fill(row);
		});
		it('should have processed the table' ,function() {
			kidsWithParent.length.should.equal(4);
			kidsWithParent[0].name.should.equal('Billie');
			kidsWithParent[0].parent.name.should.equal('Parent');
		});
		it('should return the correct partials', function() {
			var secondKid  = kidsWithParent.getById(2);
			secondKid.isFast().should.be.false;
			secondKid.parent.id.should.equal(123);
		});
	});
});

