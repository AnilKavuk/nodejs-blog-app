const generateName = (length)=>{
    let generate =[]
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for(i=0; i<length; i++){
        let random = characters.charAt(Math.floor(Math.random()*characters.length-1))

        if(generate.indexOf(random)==-1){
            generate.push(random)
        }
    }

    return generate.join('')
}

module.exports=generateName