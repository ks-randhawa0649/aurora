const path = require('path')

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent bundling mysql2 in the client
      config.externals = config.externals || []
      config.externals.push('mysql2', 'mysql2/promise')
    }
    return config
  }
}
