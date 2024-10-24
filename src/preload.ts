// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { exec } from "child_process";

const aaa = 50;

const gstreamer_pipeline = (
  sensor_id = 0,
  capture_width = 1920,
  capture_height = 1080,
  display_width = 1920 * (aaa / 100),
  display_height = 1080 * (aaa / 100),
  framerate = 30,
  flip_method = 2
) => {
  return `nvarguscamerasrc sensor-id=${sensor_id} ! 
        video/x-raw(memory:NVMM), width=(int)${capture_width}, height=(int)${capture_height}, framerate=(fraction)${framerate}/1 ! 
        nvvidconv flip-method=${flip_method} ! 
        video/x-raw, width=(int)${display_width}, height=(int)${display_height}, format=(string)BGRx ! 
        videoconvert ! 
        video/x-raw, format=(string)BGR ! appsink`;
};
// Declare the launchCamera function on the window object
declare global {
  interface Window {
    launchCamera: () => void;
  }
}

window.launchCamera = function () {
  const pipeline = gstreamer_pipeline();

  exec(pipeline, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing GStreamer pipeline: ${err}`);
      return;
    }
    console.log(`GStreamer Output: ${stdout}`);
  });
};
