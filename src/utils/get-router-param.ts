const getRouterParam = (
  val: string | string[] | undefined,
  defaultVal: string = '',
):string => (val && Array.isArray(val) ? val.join(',') : val || defaultVal);

export default getRouterParam;
