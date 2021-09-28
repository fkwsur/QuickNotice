module.exports = (sequelize, DataTypes) => {
  const group_member = sequelize.define(
    "group_member",
    {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      group_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      member: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
      comment: '그룹 멤버',
    }
  );
  return group_member;
};