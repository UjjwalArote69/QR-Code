import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.model.js';

const QRCode = sequelize.define('QRCode', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qrType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shortId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  targetUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
  scanCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

// Setup relationships
User.hasMany(QRCode, { foreignKey: 'userId', as: 'qrcodes' });
QRCode.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default QRCode;