module.exports = { 
    age: 
    // Transformando os números para fazer a idade
    function (timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)

        // Calculo da idade
        // Retorna o ano
        let age = today.getFullYear() - birthDate.getFullYear()

        // Retorna o mes
        const month = today.getMonth() - birthDate.getMonth()

        // day 1 - 31
        birthDate.getDate()

        //
        if (month < 0 || month == 0 && today.getDate() <= birthDate.getDate()) {
            age -= 1
        }

        return age
    },
    date: function (timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month =`0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)

        return `${year}-${month}-${day}`
    }
}