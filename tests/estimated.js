export default function (fn, context = null) {

  return (...args) => {
    let start = new Date().getTime(),
      result = fn.apply(context, args),
      end = new Date().getTime(),
      seconds = ((end - start) / 1000).toFixed(2);
    console.log(`${seconds} seconds.`);
    return result;
  }

}