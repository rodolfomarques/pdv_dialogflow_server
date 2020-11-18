module.exports = {

    getMedal(dia = new Number(), mes = new Number()){

        data = `${dia}/${mes}`

        switch(data) {
            case `25/12`:
                return `🎅`
            case `15/11`:
                return `🎖️`
            default:
                return `❤️` 
        }
    },

    getLevel(doacoes = new Number()){
        
        switch(doacoes) {
            case 1:
                return `🥇`
            case 2:
                return `🥈`
            case 3:
                return `🥉`
            case 4:
                return `🏅`
            case 5:
                return `🎖`
            case 6:
                return `🏆`
            default:
                return `🎗️`
        }   
    }
}