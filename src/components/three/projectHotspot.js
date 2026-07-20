// screen-space rectangle of the active project card, written every frame by
// ProjectCards3D and read by the <ProjectHotspot> HTML overlay so the 3D
// "open project" card becomes a real, clickable link (the Canvas itself is
// pointer-events:none and can't receive DOM clicks)
export const projectHotspot = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  index: 0,
  visible: false,
  hover: false,
};
