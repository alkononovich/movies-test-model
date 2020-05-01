export const parseDbStr = <T>(str: string): T[] => {
  //сплитаем строку на массив рядов
  const rows = str.trim().split(`\n`);
  //получаем строку заголовков, слитаем ее на отдельные заголовки и удаляем из массива рядов
  const headers = rows.shift().split(",");
  //обьявляем результирующий массив
  //проходим по массиву рядов без заголовков
  const elements: T[] = rows.reduce((acc, cur) => {
    const fields = cur.split(",");
    acc.push(
      headers.reduce((accIn, curIn, i) => {
        //для каждого заголовка присваиваем данные объекту
        accIn[curIn] = fields[i];
        return accIn;
      }, {} as T)
    );
    return acc;
  }, [] as T[]);
  return elements;
};
export const serializeToDbStr = (array: any[]) => {
  const filledArray = array.filter(Boolean);
  if (filledArray.length === 0) {
    return "Нет записей, соответствующих заданным параметрам";
  }
  const headers = Object.keys(filledArray[0]);
  //функция по идее универсальная, поэтому я не знаю, в каком виде приходят объекты
  //поэтому я не могу просто идти по entries и должен убеждаться, что всё будет идти в строки в правильном порядке
  const rows = filledArray
    .map((el) => headers.map((h) => el[h]).join(","))
    .join("\n");
  return `${headers.join(",")}\n${rows}`;
};
