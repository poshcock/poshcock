import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Engine } from "@babylonjs/core/Engines/engine";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { PointLight } from "@babylonjs/core/Lights/pointLight";
import { Scene } from "@babylonjs/core/scene";
import { SceneOptimizer } from "@babylonjs/core/Misc/sceneOptimizer";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { colorInputs, hexToBabylon } from "./functions-want.js";

export default class Champagne {
  // Constructor gets everything ready than runs a Babylon.js render loop
  constructor(id) {
    // Only do this if Babylon.js is supported
    if ( Engine.isSupported() ) {
      this.canvas = document.getElementById(id);
      this.engine = new Engine(this.canvas, true);
      const start = this.sceneCreate(this.engine, this.canvas);

      return this.engine.runRenderLoop( function () {
        start.render();
      });

    } else {
      console.log("No champagne at this party");
    }
  }

  bubblesColors(e) {
    // bubblesColors will be used in an event listener on a color input
    let newCol = e.target.value;
    // hexToBabylon converts color to RGB then to Babylon color ref
    newCol = hexToBabylon(newCol);
    // as RGB is non linear, we'll use Babylon's  toLinearSpace to adjust it
    this.bubbles.color1 = new Color4(newCol.r, newCol.g, newCol.b, 1).toLinearSpace();
    // Let's see what we've done
    return this.bubbles.start();
  }

  bubblesCreate() {
    this.bubbles = new ParticleSystem("particles", 2000, this.scene);
    //Texture of each particle
    this.bubbles.particleTexture = new Texture("./images/bubble.png", this.scene);
    // Colors of all particles
    this.bubbles.color1 = new Color4(1.0, 0.9, 0.5, 1);
    this.bubbles.colorDead = new Color4(1, 1, 1, 1);
    // Life time of each particle (random between...
    this.bubbles.minLifeTime = 0.3;
    this.bubbles.maxLifeTime = 15;
    // Emission rate
    this.bubbles.emitRate = 10;
    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    this.bubbles.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    // Set the gravity of all particles
    this.bubbles.gravity = new Vector3(0, 0, 0);
    // Size of each particle (random between...
    this.bubbles.minSize = 0.1;
    this.bubbles.maxSize = 3;
    // Where the particles come from
    this.bubbles.emitter = new Vector3(0, 0, 0); // the starting object, the emitter
    this.bubbles.minEmitBox = new Vector3(-5, -5, -5); // Starting all from
    this.bubbles.maxEmitBox = new Vector3(15, 15, 15); // To...
    // Start the particle system
    return this.bubbles.start();
  }

  bubblesListen(){
    const aboutContent = document.getElementById("about"),
          aboutPlay = aboutContent.getElementsByClassName("play")[0],
          rateInputs = aboutPlay.getElementsByTagName("img");

    for (const input of rateInputs) {
      input.addEventListener('click', (e) => this.bubblesRate(e), {passive: true});
    }
    // Get the color inputs
    let colInput = colorInputs();
    // Only the first color input affects the bubbles
    colInput = colInput[1];
    // When the input changes, update the bubble color
    colInput.addEventListener('change', (e) => this.bubblesColors(e), {passive: true})
  }

  bubblesRate(e) {
    // Let the user know they've done something
    this.sceneWorking(e);
    // Clicked elements say what they're doing via data attributes
    if ( e.target.dataset.rate === "up" ) {
      // Make more bubbles
      this.bubbles.emitRate = this.bubbles.emitRate += 10;
      // Make faster bubbles
      this.bubbles.maxEmitPower = this.bubbles.maxEmitPower += 5;
    }

    if ( e.target.dataset.rate === "down" ) {
      // Don't let the emit rate fall below zero
      if ( this.bubbles.emitRate > 0 ) {
        // Make less bubbles
        this.bubbles.emitRate = this.bubbles.emitRate -= 10;
      }
      // Don't let the emit power drop below zero
      if ( this.bubbles.maxEmitPower > 0 ) {
        // Make bubbles slower
        this.bubbles.maxEmitPower = this.bubbles.maxEmitPower -= 5;

      } else {
        // Reset emit power
        this.bubbles.maxEmitPower = 1;
      }
    }
    // Let's see what we've done
    return this.scene;
  }

  refreshSize(w, h) {
    this.engine.setSize(w, h);
    return this.engine.resize();
  }
  // Create a scene for everything to happen
  sceneCreate(engine, canvas) {
    this.scene = new Scene(engine);
    SceneOptimizer.OptimizeAsync(this.scene);

    this.scene.clearColor = new Color3.White();
    // We only need an omni light for this
    const light = new PointLight("Omni",new Vector3(0, 2, 8), this.scene);

    const camera = new ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new Vector3(0, 0, 0), this.scene);
    camera.detachControl(canvas);
    // bubblesCreate starts a particle system for bubbles
    this.bubblesCreate();
    // Let's see what we've done
    return this.scene;
  }
  // Function to let the user know their click is doing something
  sceneWorking(e) {
    // Adjust opacity of clicked element and canvas
    e.target.style.opacity = 0.25;
    this.canvas.style.opacity = 0.25;
    // Revert opacity of clicked element and canvas after a short period
    setTimeout(() => {
      this.canvas.style.opacity = 1;
      e.target.style.opacity = 1;
    }, 75);
  }
}
