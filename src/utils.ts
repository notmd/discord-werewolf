export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const nextMessage = `Chọn xong nhớ chat \`!next\`.`
