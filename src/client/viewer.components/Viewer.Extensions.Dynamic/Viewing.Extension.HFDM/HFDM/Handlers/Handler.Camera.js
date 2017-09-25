
import BaseHandler from './Handler.Base'
import throttle from 'lodash/throttle'

export default class CameraHandler extends BaseHandler {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  constructor (viewer) {

    super()

    this.viewer = viewer

    this.onCameraChanged = throttle(
      this.onCameraChanged.bind(this), 500)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  activate () {

    this.viewer.addEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      this.onCameraChanged)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onModify (context) {

    const nav = this.viewer.navigation

    const position = this.getVectorProperty(
      'position')

    const target = this.getVectorProperty(
      'target')

    const up = this.getVectorProperty(
      'upVector')

    nav.setPosition(position)
    nav.setCameraUpVector(up)
    nav.setTarget(target)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onRemove() {

    this.viewer.removeEventListener(
      Autodesk.Viewing.CAMERA_CHANGE_EVENT,
      this.onCameraChanged)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onCameraChanged (event) {

    const nav = this.viewer.navigation

    const position = nav.getPosition()

    const up = nav.getCameraUpVector()

    const target = nav.getTarget()

    this.setVectorProperty('position', position)
    this.setVectorProperty('target', target)
    this.setVectorProperty('upVector', up)

    this.workspace.commit()
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  setVectorProperty (name, v) {

    const vectorProperty = this.property.get(name)

    vectorProperty.get('x').value = v.x
    vectorProperty.get('y').value = v.y
    vectorProperty.get('z').value = v.z
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  getVectorProperty (name) {

    const vectorProperty = this.property.get(name)

    const x = vectorProperty.get('x').value
    const y = vectorProperty.get('y').value
    const z = vectorProperty.get('z').value

    return new THREE.Vector3(x, y, z)
  }
}


