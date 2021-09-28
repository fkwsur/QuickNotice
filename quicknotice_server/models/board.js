module.exports = (sequelize, DataTypes) => {
  const board = sequelize.define(
    "board",
    {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      visit_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      group_idx: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notice: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      writer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      comment: '게시판',
    }
  );
  return board;
};