export type TOrdering = "ASC" | "DESC";
export type TSortParams = {
  field: string;
  order?: TOrdering;
};
export type TFilterParams = TSortParams & {
  value: string | number | RegExp;
};
export type TIdType = {
  id: number;
};

export const sortBySingleParam = <T>(
  list: T[],
  param: string,
  order: TOrdering = "ASC"
) => {
  list.sort((a, b) => {
    if (a[param] === b[param]) {
      return 0;
    }
    //сортировка числовых и булевых полей
    const paramType = typeof a[param];
    if (paramType !== "string") {
      return order === "ASC" ? b[param] - a[param] : a[param] - b[param];
    }
    //сортировка по тексту
    const movieSortResult =
      order === "ASC" ? a[param] > b[param] : a[param] < b[param];
    return movieSortResult ? 1 : -1;
  });
  return list;
};

export const doSort = <T>(list: T[], params: TSortParams[]) => {
  params.forEach((param) => sortBySingleParam(list, param.field, param.order));
  return list;
};
const doSingleFilter = <T>(list: T[], param: TFilterParams) => {
  if (typeof list[0][param.field] === "number") {
    return list.filter((m) =>
      param.order === "ASC"
        ? m[param.field] >= param.value
        : m[param.field] <= param.value
    );
  }
  let pattern: RegExp;
  if (typeof param.value === "string") {
    //патерн для глобального региcтронечувствительного поиска
    pattern = new RegExp(param.value, "ig");
  } else {
    pattern = param.value as RegExp;
  }
  return list.filter((m) => m[param.field].match(pattern));
};
export const doFilter = <T>(list: T[], params: TFilterParams[]) => {
  const result = params.reduce((acc, cur) => {
    return doSingleFilter(acc, cur);
  }, list);
  return result;
};

export const getById = <T extends TIdType>(list: T[], id: number) => {
  return list.find((m) => m.id === id);
};
export const getByRelationTable = <T>(
  list: T[],
  fieldInMainTable: string,
  relationList: any[],
  fieldInRelationTable: string,
  relatedValue: number | string
) => {
  const relationField = Object.keys(relationList[0]).find(
    (f) => f !== fieldInRelationTable
  );
  const targetRelations = relationList.filter(
    (r) => r[relationField] === relatedValue
  );
  const targetValues = targetRelations.map((r) => r[fieldInRelationTable]);
  const result = list.filter((el) =>
    targetValues.includes(el[fieldInMainTable])
  );
  return result;
};
export const getByFullRelation = <T>(
  list: T[],
  relationFieldInMainTable: string,
  relations: any[],
  mainFieldInRelationTable: string,
  secondList: any[],
  relationFiendInSecondTable: string,
  targetField: string,
  targetValue: string | number
) => {
  const relatedEl = secondList.find(
    (el) =>
      `${el[targetField]}`.toLowerCase() === `${targetValue}`.toLowerCase()
  );
  const relatedValue = relatedEl ? relatedEl[relationFiendInSecondTable] : null;
  return getByRelationTable<T>(
    list,
    relationFieldInMainTable,
    relations,
    mainFieldInRelationTable,
    relatedValue
  );
};
