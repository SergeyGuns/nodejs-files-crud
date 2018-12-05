const arr = [
'//host.com/api/user?id=1',
'//host.com/api/user?id=2',
'//host.com/api/user?id=3',
'//host.com/api/user?id=4',
'//host.com/api/user?id=5',
]

Promyse.all( arr.map(href=> fetch(href)
  	.then(resolve)
    .catch(reject)
}).then(
	(data)=>data.map(user=>`${user.name} ${user.family}`)
  )

/*
{
	name: 'Name',
  family: 'Family'
  age: 12,
}

=> 'Name Family (12 y.o.)'
*/

fs.readFile(path, cb) // <--

function cb(err, buffer) {}
const sum = (...arg) => { 
  let res = 0;
  if(arg.length){
  	res = arg.reduce((acc,curr)=> acc+curr)
    return function (arg) {
    	return sum(res,arg)
  	}
  } else {
  	return res
  }
  
}

console.log(sum(1,2)(3)(4,5,6,7)(8)()); // = sum



