export const calcFit = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y - distance.y,
  };
};
export const calcXFit = (client, distance) => {
  return {
    x: client.x + distance.x,
    y: client.y - distance.y,
  };
};
export const calcUpper = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y + distance.y,
  };
};
export const calcLower = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y - distance.y,
  };
};
export const calcUpperLeft = (client, distance) => {
  return {
    x: client.x + distance.x,
    y: client.y + distance.y,
  };
};
export const calcUpperRight = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y + distance.y,
  };
};
export const calcLowerLeft = (client, distance) => {
  return {
    x: client.x + distance.x,
    y: client.y - distance.y,
  };
};
export const calcLowerRight = (client, distance) => {
  return {
    x: client.x - distance.x,
    y: client.y - distance.y,
  };
};
