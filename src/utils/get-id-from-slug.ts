const getIdFromSlug = (
  slug: string,
  from: 'last' | 'first' = 'last',
):number | null => {
  const slugAry = slug.trim().split('-');
  const lastStr = (from === 'last' ? slugAry.pop() : slugAry.shift()) || '';
  const slugId  = parseInt(lastStr.trim(), 10);
  return Number.isNaN(slugId) ? null : slugId;
};

export default getIdFromSlug;
