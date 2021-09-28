module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      idx: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birth: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ms_token: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      user_img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      interview: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
      comment: '유저 정보',
    }
  );
  return user;
};