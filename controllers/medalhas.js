module.exports = {

    getMedal(dia = new Number(), mes = new Number()){

        data = `${dia}/${mes}`

        switch(data) {
            case `25/12`:
                return `🎅`
            case `15/11`:
                return `🎖️`
            case `07/11`:
                return `🦥`
            case `12/06`:
                return `💌`
            case `31/10`:
                return `🧛`            
            case `05/11`:
                return `🎥`            
            case `11/08`:
                return `📚`            
            case `22/04`:
                return `🌎`
            case `20/04` || `22/04`:
                return `🦷`
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