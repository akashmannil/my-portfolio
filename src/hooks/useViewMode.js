// Which top-level view the site renders in. 'standard' is the tabbed 3D site;
// 'arcade' replaces it with the pixel workstation. Switching reloads the page
// so the outgoing view's canvases/WebGL context tear down cleanly.
const KEY = 'view-mode';

export const readViewMode = () =>
  (typeof localStorage !== 'undefined' && localStorage.getItem(KEY)) === 'arcade'
    ? 'arcade'
    : 'standard';

export const setViewMode = (mode) => {
  localStorage.setItem(KEY, mode);
  // arcade and Live mode are mutually exclusive
  if (mode === 'arcade') localStorage.setItem('ambient', 'off');
  window.location.reload();
};
