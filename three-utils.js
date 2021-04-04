// Collection of 3D Utility functions
const THREE = require('./three.min.js')

// return maxwhere quaternion from THREE Quaternion
exports.OriFromQ = function (q) {
  return {
    'x': q._x,
    'y': q._y,
    'z': q._z,
    'w': q._w
  }
}

// return maxwhere pos from THREE Vector3
exports.PosFromV3 = function (v) {
  return {
    'x': v.x,
    'y': v.y,
    'z': v.z
  }
}

// Create Quaternion From MaxWhere orientation
exports.QFromOri = function (ori) {
  return new THREE.Quaternion(ori.x, ori.y, ori.z, ori.w)
}
