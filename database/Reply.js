const Sequelize = require("sequelize");
const connection = require("./database");

const Reply = connection.define("answers", {
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    questionId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

//Reply.sync({force: false}).then(() => {console.log("Tabela Criada!")})

module.exports = Reply;