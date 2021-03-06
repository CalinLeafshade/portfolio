import React from "react";
import random from "lodash/random";
import {
  Scene,
  FlatShading,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  Vector2,
  Clock
} from "three";
import EffectComposer, {
  RenderPass,
  ShaderPass,
  CopyShader
} from "three-effectcomposer-es6";
import FXAAShader from "three-shader-fxaa";
import UnrealBloomPass from "./UnrealBloomPass";
import ColorGradeShader from "./ColorGradeShader";
import lookupSrc from "./lookup.png";

window.THREE = require("three");

var lookupTexture = window.THREE.ImageUtils.loadTexture(lookupSrc);
lookupTexture.genMipmaps = false;
lookupTexture.minFilter = window.THREE.LinearFilter;
lookupTexture.magFilter = window.THREE.LinearFilter;
lookupTexture.wrapS = window.THREE.ClampToEdgeWrapping;
lookupTexture.wrapT = window.THREE.ClampToEdgeWrapping;

class TriangleBackground extends React.Component {
  constructor() {
    super();
    this.rand = [];
    this.t = random(100, 1000);
    this.mousePos = new Vector3(0, 0, 0);
  }

  initCamera() {
    const { width, height } = this.props;
    this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 50;
  }

  initRenderer() {
    const { width, height } = this.props;
    this.renderer = new WebGLRenderer({
      canvas: this.element
    });
    this.renderer.autoClear = false;
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //this.renderer.shadowMap.enabled = true;
    this.composer = new EffectComposer(this.renderer);
    var renderScene = new RenderPass(this.scene, this.camera);
    var effectFXAA = new ShaderPass(FXAAShader());
    effectFXAA.uniforms["resolution"].value.set(
      window.innerWidth,
      window.innerHeight
    );

    var colorGrader = new ShaderPass(ColorGradeShader);
    colorGrader.uniforms["tLookup"].value = lookupTexture;

    var copyShader = new ShaderPass(CopyShader);
    copyShader.renderToScreen = true;

    var bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      0.3,
      0.5,
      0.5
    ); //1.0, 9, 0.5, 512);
    this.composer = new EffectComposer(this.renderer);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.composer.addPass(renderScene);
    this.composer.addPass(effectFXAA);
    this.composer.addPass(bloomPass);
    this.composer.addPass(colorGrader);
    this.composer.addPass(copyShader);
    //renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
  }

  init() {
    const { width, height, light } = this.props;
    var scene = new Scene();
    this.scene = scene;
    this.clock = new Clock();
    this.initCamera();
    this.initRenderer();
    //var ambLight = new AmbientLight(0x909000);
    //scene.add(ambLight);
    var directionalLight = new DirectionalLight(0xdddddd, light);
    this.light = directionalLight;
    directionalLight.position.set(0, 100, 200);
    scene.add(directionalLight);

    var cameraZ = this.camera.position.z;
    var planeZ = 0;
    var distance = cameraZ - planeZ;
    var aspect = width / height;
    var vFov = this.camera.fov * Math.PI / 180;
    var planeHeightAtDistance = 2 * Math.tan(vFov / 2) * distance;
    var planeWidthAtDistance = planeHeightAtDistance * aspect;
    console.log(planeWidthAtDistance, planeHeightAtDistance);

    var res = width / 120;

    var rectGeom = new PlaneGeometry(
      planeWidthAtDistance * 1.2,
      planeHeightAtDistance * 1.2,
      res,
      res / (width / height)
    );
    this.rectGeom = rectGeom;

    rectGeom.vertices = rectGeom.vertices.map((v, i) => {
      var force = 3;
      return new Vector3(
        v.x + random(-force, force),
        v.y + random(-force, force),
        v.z // + random(-2, 2)
      );
    });

    this.rectMesh = new Mesh(
      rectGeom,
      new MeshStandardMaterial({
        color: 0x403113,
        metalness: 1.1,
        shading: FlatShading
      })
    );

    this.rectMesh.rotation.x = -0.1;

    this.wireMesh = new Mesh(
      rectGeom,
      new MeshStandardMaterial({
        wireframe: true,
        wireframeLinewidth: 3,
        color: 0x000000,
        transparent: true
      })
    );

    this.wireMesh.position.z = 0.1;
    this.wireMesh.rotation.x = -0.1;

    scene.add(this.wireMesh);
    scene.add(this.rectMesh);
  }

  componentDidMount() {
    this.init();
    document.addEventListener("mousemove", this.onMouseMove);
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.width !== this.props.width ||
      prevProps.height !== this.props.height
    ) {
      this.init();
    }
  }

  onMouseMove = event => {
    let vector = new Vector3();
    let camera = this.camera;
    const { width, height } = this.props;

    vector.set(
      event.clientX / width * 2 - 1,
      -(event.clientY / height) * 2 + 1,
      0.5
    );

    vector.unproject(camera);

    var dir = vector.sub(camera.position).normalize();

    var distance = -camera.position.z / dir.z;

    this.mousePos = camera.position.clone().add(dir.multiplyScalar(distance));
  };

  updateVerts() {
    const rectGeom = this.rectGeom;
    const t = this.t;
    rectGeom.vertices.forEach((v, i) => {
      this.rand[i] = this.rand[i] || Math.random() * 0.5;
      var vec = new Vector2(v.x - this.mousePos.x, v.y - this.mousePos.y);
      var d = -10 * (10 / (10 + vec.length())) * this.props.mouseEffectStrength;
      v.set(v.x, v.y, Math.sin(t * this.rand[i] * 2) * 2 + d);
    });

    rectGeom.normalsNeedUpdate = true;
    rectGeom.verticesNeedUpdate = true;
  }

  update() {
    const { light } = this.props;

    this.light.intensity = light;

    this.t += 1 / 60;
    this.updateVerts();
    this.draw();
    requestAnimationFrame(() => this.update());
  }

  draw() {
    var delta = this.clock.getDelta();
    this.composer.render(delta);
  }

  render() {
    const { width, height } = this.props;

    const style = {
      width: "100%",
      display: "block",
      position: "absolute",
      height: "100%",
      zIndex: -1
    };

    return (
      <canvas
        style={style}
        width={width}
        height={height}
        ref={el => (this.element = el)}
      />
    );
  }
}

export default TriangleBackground;
