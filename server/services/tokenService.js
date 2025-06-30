const jwt = require('jsonwebtoken');

class TokenService {
  // Generate JWT token
  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '24h' 
    });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Decode token without verification (useful for expired token info)
  decodeToken(token) {
    return jwt.decode(token);
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  // Extract user ID from token
  getUserIdFromToken(token) {
    try {
      const decoded = this.verifyToken(token);
      return decoded.id;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new TokenService(); 