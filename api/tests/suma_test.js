const suma = (a,b) => {
    return a - b
}

//if(suma(0,0) !== 0) {
//    new Error("suma of and 0 expected to be zero")
//}

const checks = [
    {a: 0, b: 0, result:0},
    {a: 1, b: 3, result:4},
    {a: -3, b: 1, result:0}

]

checks.forEach(check => {
    const { a,b,result } = check 

    console.assert(
        suma(a,b) === result, 
        `suma of ${a} and ${b} expected to be ${result}`
        )
    
})

console.log(` ${ checks.length } checks performed....`)