export const parseDbStr = <T>(str: string): T[] => {
  //сплитаем строку на массив рядов
  const rows = str.trim().split(`\n`);
  //получаем строку заголовков, слитаем ее на отдельные заголовки и удаляем из массива рядов
  const headers = rows.shift().split(",");
  //обьявляем результирующий массив
  const elements: T[] = [];
  //проходим по массиву рядов без заголовков
  rows.forEach((row) => {
    const fields = row.split(",");
    const element = {};
    //по для каждого заголовка присваиваем данные объекту
    headers.forEach((h, i) => {
      element[h] = isNaN((fields[i] as unknown) as number)
        ? fields[i]
        : Number(fields[i]);
    });
    elements.push(element as T);
  });
  return elements;
};
export const serializeToDbStr = (array: any[]) => {
  if (array.length === 0) {
    return "Нет записей, соответствующих заданным параметрам";
  }
  const headers = Object.keys(array[0]);
  //функция по идее универсальная, поэтому я не знаю, в каком виде приходят объекты
  //поэтому я не могу просто идти по entries и должен убеждаться, что всё будет идти в строки в правильном порядке
  const rows = array
    .map((el) => headers.map((h) => el[h]).join(","))
    .join("\n");
  return `${headers.join(",")}\n${rows}`;
};
