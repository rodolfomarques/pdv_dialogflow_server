module.exports = {

    getMedal(dia = new Number(), mes = new Number()){

        data = `${dia}/${mes}`

        switch(data) {
            case `25/12`:
                return `🎅`
            default:
                return `❤️` 
        }
    }

}