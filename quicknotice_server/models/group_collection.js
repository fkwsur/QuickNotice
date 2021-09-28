module.exports = (sequelize, DataTypes) => {
  const group_collection = sequelize.define(
    "group_collection",
    {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      group_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      manager: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      invite_code: {
        type: DataTypes.STRING,
        unique: true
      },
      group_img: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
      comment: '그룹 컬렉션',
    }
  );
  return group_collection;
};