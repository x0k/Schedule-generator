let last = new Date();

export default function delta (promt = '') {
  let now = new Date();
  if (promt) {
    let seconds = ((now.getTime() - last.getTime()) / 1000).toFixed(2);
    console.log(`${promt}: ${seconds} seconds.`);
  }
  last = now;
}