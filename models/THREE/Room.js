
define(function(require) {

  /**
   * Wall class
   */

  function Wall(parent, point1, point2) {

    this.constructor()

    this.parent = parent

    if(point1 && point2) {

      this.setFromPoints(point1, point2)

    }

  }

  Wall.prototype = Object.create(THREE.Plane.prototype)

  Wall.prototype.setFromPoints = function(point1, point2) {

    this.point1 = point1
    this.point2 = point2

    this.position = point2.clone().add(point1).divideScalar(2)
    var sub = point2.clone().sub(point1)

    this.vec = sub.clone().normalize()
    this.rvec = this.vec.clone().applyEuler(new THREE.Euler(0, -Math.PI/2, 0)).toFixed()

    this.setFromNormalAndCoplanarPoint(this.rvec, this.position)

    this.max = new THREE.Vector3(
      Math.max(point1.x, point2.x), 
      Math.max(point1.y, point2.y),
      Math.max(point1.z, point2.z)
    )

    this.min = new THREE.Vector3(
      Math.min(point1.x, point2.x), 
      Math.min(point1.y, point2.y),
      Math.min(point1.z, point2.z)
    )

    this.rot = Math.atan((point2.z - point1.z)/(point2.x - point1.x))

  }

  Wall.prototype.getNextWall = function() {

    var idx = this.parent._walls.indexOf(this)
    var nidx = this.parent._walls.length === idx+1 ? 0 : idx+1

    return this.parent._walls[nidx]

  }

  Wall.prototype.getPrevWall = function() {

    var idx = this.parent._walls.indexOf(this)
    var pidx = 0 === idx ? this.parent._walls.length-1 : idx-1

    return this.parent._walls[pidx]

  }

  Wall.prototype.remove = function() {

    var idx = this.parent._walls.indexOf(this)
    this.parent._walls.splice(idx, 1)

  }

  /**
   * Room class
   */

  function Room(points) {

    this.constructor()

    this._walls = []
    this._floor = null
    this._plane = new THREE.Plane(new THREE.Vector3(0, 1, 0))

    if(points && points.length) {

      this.setWalls(points)

    }

  }

  Room.prototype = Object.create(THREE.Object3D)

  Room.prototype.setWalls = function(points) {

    this._walls.forEach(wall => wall.remove())

    var geom = new THREE.Shape

    for(var i = 0; i < points.length; i++) {

      var point1 = points[i]
      var point2 = points[i+1 === points.length ? 0 : i+1]

      this._walls.push(new Wall(this, point1, point2))

      geom.lineTo(point1.x, -point1.z)

    }

    geom.lineTo(points[0].x, -points[0].z)

    this._floor = new THREE.Mesh(
      new THREE.ShapeGeometry(geom),
      new THREE.MeshPhongMaterial( { color: 0x074c24 } )
    )

    this._floor.rotation.x = -Math.PI/2

  }

  return Room

})